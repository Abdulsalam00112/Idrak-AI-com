import { NextRequest } from 'next/server';
import { getCurrentUser, jsonError, jsonSuccess, withErrorHandling } from '@/lib/server';
import { pool } from '@/db';

export const POST = withErrorHandling(async (_request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await getCurrentUser();
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED');
  const { id } = await params;
  await pool.query(
    `INSERT INTO idrak_bookmarks (user_id, question_id) VALUES ($1, $2) ON CONFLICT (user_id, question_id) DO NOTHING`,
    [user.id, id],
  );
  return jsonSuccess({ bookmarked: true });
}, 'Unable to bookmark this question', 'BOOKMARK_FAILED');

export const DELETE = withErrorHandling(async (_request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await getCurrentUser();
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED');
  const { id } = await params;
  await pool.query('DELETE FROM idrak_bookmarks WHERE user_id = $1 AND question_id = $2', [user.id, id]);
  return jsonSuccess({ bookmarked: false });
}, 'Unable to remove this bookmark', 'BOOKMARK_FAILED');
