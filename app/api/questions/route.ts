import { z } from 'zod';
import { pool } from '@/db';
import { getCurrentUser, jsonError, jsonSuccess, withErrorHandling } from '@/lib/server';
import { getExamById } from '@/lib/data';

const querySchema = z.object({
  // Accepts either an ExamSeed.id ('exam-waec') or its code ('WAEC'); resolved
  // to the code that idrak_questions.exam_code actually stores.
  examId: z.string().trim().max(50).optional(),
  topicId: z.string().uuid().optional(),
  subjectId: z.string().uuid().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'challenging']).optional(),
  // topic | subject | weak | high_yield | timed | random — see practice modes.
  mode: z.enum(['topic', 'subject', 'weak', 'high_yield', 'timed', 'random']).default('random'),
  limit: z.coerce.number().int().min(1).max(180).default(10),
});

export const GET = withErrorHandling(async (request: Request) => {
  const user = await getCurrentUser();
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED');
  try {
    const url = new URL(request.url);
    const input = querySchema.parse(Object.fromEntries(url.searchParams));

    // Resolve the exam the caller asked for, falling back to the user's own
    // persisted exam_id so a client can never accidentally (or intentionally)
    // pull another exam's questions just by omitting the param.
    const examCode = (() => {
      const raw = input.examId || user.examId || undefined;
      if (!raw) return undefined;
      const exam = getExamById(raw) || (raw ? { code: raw.toUpperCase() } : undefined);
      return exam?.code;
    })();

    // No exam filter is never allowed to mean "show every exam's questions
    // mixed together" — if we can't determine an exam (e.g. a legacy
    // account with no exam_id and no explicit param), fail closed with an
    // empty, honest result rather than silently querying across all exams.
    if (!examCode) {
      return jsonSuccess({ questions: [], mode: input.mode, examCode: null, fallback: 'no_exam_selected' });
    }

    const values: unknown[] = [examCode];
    const filters = ['q.exam_code = $1'];
    if (input.difficulty) { values.push(input.difficulty); filters.push(`q.difficulty = $${values.length}`); }

    let fallback: string | null = null;

    if (input.mode === 'topic' || input.topicId) {
      if (input.topicId) { values.push(input.topicId); filters.push(`q.topic_id = $${values.length}`); }
    } else if (input.mode === 'subject' || input.subjectId) {
      if (input.subjectId) { values.push(input.subjectId); filters.push(`q.subject_id = $${values.length}`); }
    } else if (input.mode === 'high_yield') {
      filters.push('q.is_high_yield = true');
    } else if (input.mode === 'weak') {
      // Real weak-topic detection from the user's own attempt history — never
      // fabricated. If they have no history yet, this legitimately can't
      // narrow anything, so we fall back to a general pool and say so rather
      // than pretending we know their weak spots.
      const weak = await pool.query(
        `SELECT topic_id FROM idrak_topic_mastery WHERE user_id = $1 AND topic_id IS NOT NULL ORDER BY accuracy ASC LIMIT 5`,
        [user.id],
      );
      const topicIds = weak.rows.map((r) => r.topic_id).filter(Boolean);
      if (topicIds.length > 0) {
        values.push(topicIds);
        filters.push(`q.topic_id = ANY($${values.length}::uuid[])`);
      } else {
        fallback = 'no_performance_data';
      }
    }
    // 'timed' and 'random' modes intentionally apply no extra filter beyond
    // exam/difficulty — the timer itself is a client-side concern.

    values.push(user.id);
    const userIdParam = values.length;
    values.push(input.limit);
    const result = await pool.query(
      `SELECT q.id, q.exam_id, q.exam_code, q.subject_id, q.subject_name, q.topic_id, t.name AS topic_name,
              q.question_text, q.options, q.difficulty, q.year, q.source, q.tags, q.is_high_yield,
              q.content_type, q.source_reference, q.explanation_source,
              b.id IS NOT NULL AS bookmarked, la.is_correct AS last_attempt_correct
       FROM idrak_questions q
       LEFT JOIN idrak_topics t ON t.id = q.topic_id
       LEFT JOIN idrak_bookmarks b ON b.question_id = q.id AND b.user_id = $${userIdParam}
       LEFT JOIN LATERAL (
         SELECT is_correct FROM idrak_attempts a
         WHERE a.question_id = q.id AND a.user_id = $${userIdParam}
         ORDER BY a.created_at DESC LIMIT 1
       ) la ON true
       WHERE ${filters.join(' AND ')}
       ORDER BY random()
       LIMIT $${values.length}`,
      values,
    );
    return jsonSuccess({ questions: result.rows, mode: input.mode, examCode: examCode ?? null, fallback });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError('Invalid question filters.', 422, 'VALIDATION_ERROR');
    throw error;
  }
}, 'Unable to load questions.', 'SERVER_ERROR');
