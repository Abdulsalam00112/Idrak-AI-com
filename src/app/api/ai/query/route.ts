import { streamText } from 'ai';
import { gateway } from '@ai-sdk/gateway';
import { z } from 'zod';
import { getCurrentUser, jsonError } from '@/lib/server';
import { pool } from '@/db';

const schema = z.object({ conversationId: z.string().uuid().optional(), message: z.string().trim().min(1).max(12000), model: z.string().optional(), mode: z.enum(['socratic', 'direct', 'professional']).optional() });
const DEFAULT_MODEL = 'anthropic/claude-sonnet-4.5';

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError('Please sign in to continue.', 401, 'UNAUTHORIZED');
  try {
    const input = schema.parse(await request.json());
    let conversationId = input.conversationId;
    if (conversationId) {
      const owned = await pool.query('SELECT id FROM idrak_conversations WHERE id = $1 AND user_id = $2', [conversationId, user.id]);
      if (!owned.rowCount) return jsonError('Conversation not found.', 404, 'NOT_FOUND');
    } else {
      const created = await pool.query('INSERT INTO idrak_conversations (user_id, title) VALUES ($1, $2) RETURNING id', [user.id, input.message.slice(0, 80)]);
      conversationId = created.rows[0].id;
    }
    await pool.query('INSERT INTO idrak_messages (conversation_id, user_id, role, content) VALUES ($1, $2, $3, $4)', [conversationId, user.id, 'user', input.message]);
    const history = await pool.query('SELECT role, content FROM idrak_messages WHERE conversation_id = $1 AND user_id = $2 ORDER BY created_at ASC LIMIT 30', [conversationId, user.id]);
    const result = streamText({ model: gateway(input.model || DEFAULT_MODEL), system: `You are Idrak AI, an educational tutor. Use ${input.mode || 'socratic'} mode. Explain clearly, show reasoning, and never invent citations.`, messages: history.rows.map((row) => ({ role: row.role === 'user' ? 'user' : 'assistant', content: row.content })), onFinish: async ({ text, usage }) => { await pool.query('INSERT INTO idrak_messages (conversation_id, user_id, role, content, model, provider) VALUES ($1, $2, $3, $4, $5, $6)', [conversationId, user.id, 'assistant', text, input.model || DEFAULT_MODEL, 'vercel-ai-gateway']); await pool.query('INSERT INTO idrak_usage (user_id, provider, model, tokens_used) VALUES ($1, $2, $3, $4)', [user.id, 'vercel-ai-gateway', input.model || DEFAULT_MODEL, usage.totalTokens || 0]); } });
    return result.toTextStreamResponse();
  } catch (error) { if (error instanceof z.ZodError) return jsonError('Please provide a valid question.', 422, 'VALIDATION_ERROR'); return jsonError('The tutor could not answer right now.', 500, 'AI_ERROR'); }
}
