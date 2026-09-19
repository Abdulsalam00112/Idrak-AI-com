import { z } from 'zod';
import { pool } from '@/db';
import { getCurrentUser, jsonError, jsonSuccess, withErrorHandling } from '@/lib/server';

const idSchema = z.string().uuid();
const updateSchema = z.object({ title: z.string().trim().min(1).max(120) });

export const GET = withErrorHandling(async (_: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await getCurrentUser();
  if (!user) return jsonError('Please sign in to continue.', 401, 'UNAUTHORIZED');
  const id = (await params).id;
  if (!idSchema.safeParse(id).success) return jsonError('Conversation not found.', 404, 'NOT_FOUND');
  const conversation = await pool.query('SELECT id, title, created_at, updated_at FROM idrak_conversations WHERE id = $1 AND user_id = $2', [id, user.id]);
  if (!conversation.rowCount) return jsonError('Conversation not found.', 404, 'NOT_FOUND');
  const messages = await pool.query('SELECT id, role, content, model, provider, citations, created_at FROM idrak_messages WHERE conversation_id = $1 AND user_id = $2 ORDER BY created_at ASC', [id, user.id]);
  return jsonSuccess({ conversation: conversation.rows[0], messages: messages.rows });
}, 'Unable to load this conversation.', 'SERVER_ERROR');

export const PATCH = withErrorHandling(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await getCurrentUser();
  if (!user) return jsonError('Please sign in to continue.', 401, 'UNAUTHORIZED');
  const id = (await params).id;
  try {
    const { title } = updateSchema.parse(await request.json());
    const result = await pool.query('UPDATE idrak_conversations SET title = $1, updated_at = now() WHERE id = $2 AND user_id = $3 RETURNING id, title, updated_at', [title, id, user.id]);
    if (!result.rowCount) return jsonError('Conversation not found.', 404, 'NOT_FOUND');
    return jsonSuccess(result.rows[0]);
  } catch (error) { if (error instanceof z.ZodError) return jsonError('Please provide a valid title.', 422, 'VALIDATION_ERROR'); throw error; }
}, 'Unable to update conversation.', 'SERVER_ERROR');

export const DELETE = withErrorHandling(async (_: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await getCurrentUser();
  if (!user) return jsonError('Please sign in to continue.', 401, 'UNAUTHORIZED');
  const result = await pool.query('DELETE FROM idrak_conversations WHERE id = $1 AND user_id = $2 RETURNING id', [(await params).id, user.id]);
  if (!result.rowCount) return jsonError('Conversation not found.', 404, 'NOT_FOUND');
  return jsonSuccess({ deleted: true });
}, 'Unable to delete conversation.', 'SERVER_ERROR');
