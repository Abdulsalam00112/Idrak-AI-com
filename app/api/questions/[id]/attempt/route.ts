import { NextRequest } from 'next/server';
import { getCurrentUser, jsonError, jsonSuccess, withErrorHandling } from '@/lib/server';
import { pool } from '@/db';

export const POST = withErrorHandling(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await getCurrentUser();
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED');
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body.selectedAnswer !== 'string' || body.selectedAnswer.length > 255) return jsonError('A valid answer is required', 400, 'INVALID_INPUT');
  const timeSpent = Number.isInteger(body.timeSpentSeconds) && body.timeSpentSeconds >= 0 ? body.timeSpentSeconds : 0;
  const question = await pool.query('SELECT id, exam_id, subject_id, topic_id, correct_answer, explanation FROM idrak_questions WHERE id = $1 LIMIT 1', [id]);
  if (!question.rowCount) return jsonError('Question not found', 404, 'NOT_FOUND');
  const q = question.rows[0];
  const isCorrect = body.selectedAnswer === q.correct_answer;
  await pool.query('INSERT INTO idrak_attempts (user_id, question_id, exam_id, subject_id, topic_id, selected_answer, is_correct, time_spent_seconds) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [user.id, id, q.exam_id, q.subject_id, q.topic_id, body.selectedAnswer, isCorrect, timeSpent]);
  // NOTE: this used to write to a table called `student_topic_performance`,
  // which doesn't exist anywhere else in the codebase and doesn't follow the
  // idrak_ naming convention every other table uses. /api/study-plan already
  // reads per-topic performance from `idrak_topic_mastery`, so that's the
  // table this now writes to (see db/migrations/0002_*.sql for its shape).
  if (q.topic_id) {
    const existing = await pool.query('SELECT id FROM idrak_topic_mastery WHERE user_id = $1 AND topic_id = $2 LIMIT 1', [user.id, q.topic_id]);
    if (existing.rowCount) {
      await pool.query(
        `UPDATE idrak_topic_mastery
         SET questions_answered = questions_answered + 1,
             correct = correct + $1,
             accuracy = ROUND(((correct + $1)::numeric / (questions_answered + 1)) * 100, 2),
             mastery_level = CASE
               WHEN ((correct + $1)::numeric / (questions_answered + 1)) >= .8 THEN 'mastered'
               WHEN ((correct + $1)::numeric / (questions_answered + 1)) >= .6 THEN 'developing'
               ELSE 'learning' END,
             last_practiced = now()
         WHERE id = $2`,
        [isCorrect ? 1 : 0, existing.rows[0].id],
      );
    } else {
      await pool.query(
        `INSERT INTO idrak_topic_mastery (user_id, topic_id, questions_answered, correct, accuracy, mastery_level, last_practiced)
         VALUES ($1, $2, 1, $3, $4, $5, now())`,
        [user.id, q.topic_id, isCorrect ? 1 : 0, isCorrect ? 100 : 0, isCorrect ? 'mastered' : 'learning'],
      );
    }
  }
  return jsonSuccess({ correct: isCorrect, correctAnswer: q.correct_answer, explanation: q.explanation, topicId: q.topic_id });
}, 'Unable to record your answer', 'ATTEMPT_FAILED');
