import { getCurrentUser, jsonError, jsonSuccess, withErrorHandling } from '@/lib/server';
import { pool } from '@/db';

export const GET = withErrorHandling(async () => {
  const user = await getCurrentUser();
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED');
  const result = await pool.query(`SELECT plan_code, CASE WHEN status IN ('active','trialing') AND (current_period_end IS NULL OR current_period_end > now()) THEN status ELSE 'free' END AS status, current_period_end FROM idrak_subscriptions WHERE user_id = $1`, [user.id]);
  return jsonSuccess(result.rows[0] ?? { plan_code: 'free', status: 'free', current_period_end: null });
}, 'Unable to load subscription', 'SUBSCRIPTION_FAILED');
