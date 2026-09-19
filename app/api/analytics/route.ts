import { getCurrentUser, jsonError, jsonSuccess, withErrorHandling } from '@/lib/server';
import { pool } from '@/db';

export const GET = withErrorHandling(async () => {
  const user = await getCurrentUser();
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED');
  const summary = await pool.query(`SELECT COUNT(*)::int AS total_questions, COUNT(*) FILTER (WHERE is_correct)::int AS correct_answers, COUNT(*) FILTER (WHERE NOT is_correct)::int AS incorrect_answers, COALESCE(ROUND(AVG((is_correct::int) * 100), 2), 0) AS accuracy, COALESCE(SUM(time_spent_seconds), 0)::int AS time_spent_seconds FROM idrak_attempts WHERE user_id = $1`, [user.id]);
  const topics = await pool.query(`SELECT a.topic_id, t.name AS topic_name, COUNT(*)::int AS questions_attempted, COUNT(*) FILTER (WHERE a.is_correct)::int AS questions_correct, ROUND(AVG((a.is_correct::int) * 100), 2) AS accuracy, ROUND(AVG((a.is_correct::int) * CASE q.difficulty WHEN 'challenging' THEN 1.25 WHEN 'hard' THEN 1.1 ELSE 1 END) * 100, 2) AS difficulty_adjusted_accuracy, COUNT(*) FILTER (WHERE a.created_at > now() - interval '30 days')::int AS recent_attempts FROM idrak_attempts a LEFT JOIN idrak_topics t ON t.id = a.topic_id LEFT JOIN idrak_questions q ON q.id = a.question_id WHERE a.user_id = $1 AND a.topic_id IS NOT NULL GROUP BY a.topic_id, t.name ORDER BY accuracy ASC`, [user.id]);
  // Individual recent attempts, most recent first — this is what the
  // dashboard's "Recent activity" card renders. It previously had no data
  // source at all (a hardcoded empty array in the component), which is why
  // that card was always blank regardless of account activity.
  const recent = await pool.query(
    `SELECT a.id, a.created_at, a.is_correct, a.time_spent_seconds,
            q.subject_name, q.question_text, q.topic_id, t.name AS topic_name
     FROM idrak_attempts a
     LEFT JOIN idrak_questions q ON q.id = a.question_id
     LEFT JOIN idrak_topics t ON t.id = a.topic_id
     WHERE a.user_id = $1
     ORDER BY a.created_at DESC
     LIMIT 10`,
    [user.id],
  );
  const row = summary.rows[0] ?? { total_questions: 0, correct_answers: 0, incorrect_answers: 0, accuracy: 0, time_spent_seconds: 0 };
  const readiness = row.total_questions >= 10 ? Math.round(Number(row.accuracy) * 0.7 + Math.min(Number(row.total_questions), 100) * 0.3) : null;
  return jsonSuccess({
    summary: row,
    topics: topics.rows,
    recentAttempts: recent.rows,
    readinessScore: readiness,
    readinessLabel: readiness === null ? 'Not enough data yet' : readiness >= 80 ? 'Strong readiness' : readiness >= 60 ? 'Building readiness' : 'Needs focused practice',
  });
}, 'Unable to load analytics', 'ANALYTICS_FAILED');
