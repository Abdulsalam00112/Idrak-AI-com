import { z } from 'zod';
import { pool } from '@/db';
import { getCurrentUser, jsonError, jsonSuccess, withErrorHandling } from '@/lib/server';

const planSchema = z.object({
  examId: z.string().uuid().optional(),
  targetDate: z.string().date(),
  dailyMinutes: z.number().int().min(15).max(480).default(45),
});

export const GET = withErrorHandling(async () => {
  const user = await getCurrentUser();
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED');
  const plans = await pool.query(`SELECT p.*, COALESCE(json_agg(i ORDER BY i.date, i.order) FILTER (WHERE i.id IS NOT NULL), '[]') AS items FROM study_plans p LEFT JOIN study_plan_items i ON i.plan_id = p.id WHERE p.user_id = $1 GROUP BY p.id ORDER BY p.updated_at DESC LIMIT 1`, [user.id]);
  return jsonSuccess(plans.rows[0] ?? null);
}, 'Unable to load study plan.', 'SERVER_ERROR');

export const POST = withErrorHandling(async (request: Request) => {
  const user = await getCurrentUser();
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED');
  try {
    const input = planSchema.parse(await request.json());
    const target = new Date(input.targetDate);
    const mastery = await pool.query(`SELECT topic_id, accuracy FROM idrak_topic_mastery WHERE user_id = $1 ORDER BY accuracy ASC LIMIT 10`, [user.id]);
    const topics = mastery.rows;
    const plan = await pool.query(`INSERT INTO study_plans (user_id, exam_id, name, end_date, daily_minutes, is_adaptive) VALUES ($1, $2, 'Adaptive study plan', $3, $4, true) RETURNING *`, [user.id, input.examId ?? null, input.targetDate, input.dailyMinutes]);
    const planId = plan.rows[0].id;
    const days = Math.max(1, Math.min(30, Math.ceil((target.getTime() - Date.now()) / 86400000)));
    for (let index = 0; index < days; index += 1) {
      const topic = topics[index % Math.max(topics.length, 1)];
      const date = new Date(Date.now() + index * 86400000).toISOString().slice(0, 10);
      await pool.query(`INSERT INTO study_plan_items (plan_id, date, day_of_week, topic_id, activity_type, title, description, duration_minutes, priority, reason) VALUES ($1, $2, $3, $4, 'practice', $5, $6, $7, $8, $9)`, [planId, date, new Date(date).toLocaleDateString('en-US', { weekday: 'long' }), topic?.topic_id ?? null, topic ? 'Practice a weak topic' : 'Build your baseline', topic ? 'Focus on your lowest recorded mastery topic.' : 'Complete a short diagnostic set to personalize your plan.', input.dailyMinutes, topic?.accuracy < 50 ? 'high' : 'medium', topic ? `Current accuracy: ${topic.accuracy}%` : 'Not enough performance data yet.']);
    }
    return jsonSuccess({ ...plan.rows[0], items: days });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError('Invalid study plan details.', 422, 'VALIDATION_ERROR');
    throw error;
  }
}, 'Unable to generate study plan.', 'SERVER_ERROR');
