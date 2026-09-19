import { z } from 'zod';
import { pool } from '@/db';
import { getCurrentUser, jsonError, jsonSuccess, withErrorHandling } from '@/lib/server';

const schema = z.object({ messageId: z.string().uuid(), rating: z.number().int().min(1).max(5), comment: z.string().trim().max(1000).optional() });

export const POST = withErrorHandling(async (request: Request) => {
  const user = await getCurrentUser();
  if (!user) return jsonError('Please sign in to continue.', 401, 'UNAUTHORIZED');
  try {
    const input = schema.parse(await request.json());
    const owned = await pool.query('SELECT id FROM idrak_messages WHERE id = $1 AND user_id = $2', [input.messageId, user.id]);
    if (!owned.rowCount) return jsonError('Message not found.', 404, 'NOT_FOUND');
    const result = await pool.query('INSERT INTO idrak_feedback (user_id, message_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING id, rating, comment, created_at', [user.id, input.messageId, input.rating, input.comment ?? null]);
    return jsonSuccess(result.rows[0], 201);
  } catch (error) { if (error instanceof z.ZodError) return jsonError('Please provide valid feedback.', 422, 'VALIDATION_ERROR'); throw error; }
}, 'Unable to save feedback.', 'SERVER_ERROR');
