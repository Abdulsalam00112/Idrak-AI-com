import { getCurrentUser, jsonError, jsonSuccess, signOut, withErrorHandling } from '@/lib/server';
import { pool } from '@/db';

export const GET = withErrorHandling(async () => {
  // A minimal, honest data export — everything the app actually stores
  // about the requester. Not a formatted archive with attachments; just
  // the real rows, as JSON, download-ready.
  const user = await getCurrentUser();
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED');
  const [profile, attempts, mastery, bookmarks] = await Promise.all([
    pool.query('SELECT id, email, name, institution, field_of_study, education_level, exam_id, created_at FROM idrak_users WHERE id = $1', [user.id]),
    pool.query('SELECT question_id, exam_id, subject_id, topic_id, selected_answer, is_correct, time_spent_seconds, created_at FROM idrak_attempts WHERE user_id = $1 ORDER BY created_at DESC', [user.id]),
    pool.query('SELECT topic_id, questions_answered, correct, accuracy, mastery_level, last_practiced FROM idrak_topic_mastery WHERE user_id = $1', [user.id]),
    pool.query('SELECT question_id, created_at FROM idrak_bookmarks WHERE user_id = $1', [user.id]),
  ]);
  return jsonSuccess({
    exportedAt: new Date().toISOString(),
    profile: profile.rows[0] ?? null,
    attempts: attempts.rows,
    topicMastery: mastery.rows,
    bookmarks: bookmarks.rows,
  });
}, 'Unable to export your data.', 'ACCOUNT_EXPORT_FAILED');

export const DELETE = withErrorHandling(async () => {
  // NOTE: this previously deleted from a table called `users`, which
  // doesn't exist at runtime (the app's real table is `idrak_users`) — so
  // "Delete my account" was signing people out without deleting anything.
  // Cleans up every table that references user_id before removing the
  // account itself, since we don't know what FK constraints (if any) exist
  // on the live database.
  const user = await getCurrentUser();
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED');
  const tables = ['idrak_attempts', 'idrak_bookmarks', 'idrak_topic_mastery', 'idrak_sessions'];
  for (const table of tables) {
    try { await pool.query(`DELETE FROM ${table} WHERE user_id = $1`, [user.id]); } catch { /* table may not exist on every deployment */ }
  }
  await pool.query('DELETE FROM idrak_users WHERE id = $1', [user.id]);
  await signOut();
  return jsonSuccess({ deleted: true });
}, 'Unable to delete your account.', 'ACCOUNT_DELETE_FAILED');
