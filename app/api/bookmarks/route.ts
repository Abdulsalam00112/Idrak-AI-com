import { getCurrentUser, jsonError, jsonSuccess, withErrorHandling } from '@/lib/server';
import { pool } from '@/db';

export const GET = withErrorHandling(async () => {
  const user = await getCurrentUser();
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED');
  const result = await pool.query(
    `SELECT q.id, q.exam_code, q.subject_id, q.subject_name, q.topic_id, t.name AS topic_name,
            q.question_text, q.options, q.difficulty, q.year, q.source, q.tags, q.is_high_yield
     FROM idrak_bookmarks b
     JOIN idrak_questions q ON q.id = b.question_id
     LEFT JOIN idrak_topics t ON t.id = q.topic_id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [user.id],
  );
  return jsonSuccess(result.rows);
}, 'Unable to load bookmarks', 'BOOKMARKS_FAILED');
