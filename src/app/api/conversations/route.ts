import { getCurrentUser, jsonError, jsonSuccess } from '@/lib/server';
import { pool } from '@/db';
import { z } from 'zod';

export async function GET() { const user = await getCurrentUser(); if (!user) return jsonError('Please sign in.', 401, 'UNAUTHORIZED'); const result = await pool.query('SELECT id, title, created_at, updated_at FROM idrak_conversations WHERE user_id = $1 ORDER BY updated_at DESC', [user.id]); return jsonSuccess(result.rows); }
export async function POST(request: Request) { const user = await getCurrentUser(); if (!user) return jsonError('Please sign in.', 401, 'UNAUTHORIZED'); try { const body = z.object({ title: z.string().trim().min(1).max(120).optional() }).parse(await request.json().catch(() => ({}))); const result = await pool.query('INSERT INTO idrak_conversations (user_id, title) VALUES ($1, $2) RETURNING id, title, created_at, updated_at', [user.id, body.title || 'New conversation']); return jsonSuccess(result.rows[0], 201); } catch { return jsonError('Invalid conversation details.', 422, 'VALIDATION_ERROR'); } }
