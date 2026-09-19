import { getCurrentUser, jsonError, jsonSuccess, withErrorHandling } from '@/lib/server';
import { pool } from '@/db';

export const GET = withErrorHandling(async () => {
  const user = await getCurrentUser();
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED');
  const result = await pool.query(`SELECT COALESCE(SUM(tokens_used), 0)::int AS tokens_used, COALESCE(SUM(request_count), 0)::int AS request_count FROM idrak_usage WHERE user_id = $1 AND created_at >= date_trunc('month', now())`, [user.id]);
  return jsonSuccess(result.rows[0]);
}, 'Unable to load usage', 'USAGE_FAILED');
