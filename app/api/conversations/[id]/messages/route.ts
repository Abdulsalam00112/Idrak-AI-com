import { z } from 'zod';
import { pool } from '@/db';
import { getCurrentUser, jsonError, jsonSuccess, withErrorHandling } from '@/lib/server';

const schema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().trim().min(1).max(20000),
  model: z.string().trim().max(120).optional(),
  provider: z.string().trim().max(120).optional(),
  citations: z.array(z.unknown()).max(50).optional(),
});

export const POST = withErrorHandling(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await getCurrentUser();
  if (!user) return jsonError('Please sign in to continue.', 401, 'UNAUTHORIZED');
  const conversationId = (await params).id;
  if (!z.string().uuid().safeParse(conversationId).success) return jsonError('Conversation not found.', 404, 'NOT_FOUND');
  try {
    const input = schema.parse(await request.json());
    const conversation = await pool.query('SELECT id FROM idrak_conversations WHERE id = $1 AND user_id = $2', [conversationId, user.id]);
    if (!conversation.rowCount) return jsonError('Conversation not found.', 404, 'NOT_FOUND');
    const result = await pool.query(
      'INSERT INTO idrak_messages (conversation_id, user_id, role, content, model, provider, citations) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb) RETURNING id, conversation_id, role, content, model, provider, citations, created_at',
      [conversationId, user.id, input.role, input.content, input.model ?? null, input.provider ?? null, JSON.stringify(input.citations ?? [])],
    );
    await pool.query('UPDATE idrak_conversations SET updated_at = now() WHERE id = $1 AND user_id = $2', [conversationId, user.id]);
    return jsonSuccess(result.rows[0], 201);
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError('Invalid message details.', 422, 'VALIDATION_ERROR');
    throw error;
  }
}, 'Unable to save message.', 'SERVER_ERROR');
