import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getCurrentUser, jsonError, jsonSuccess, withErrorHandling } from '@/lib/server';
import { pool } from '@/db';

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

export const POST = withErrorHandling(async (request: Request) => {
  const user = await getCurrentUser();
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED');
  try {
    const input = schema.parse(await request.json());
    const row = await pool.query('SELECT password_hash FROM idrak_users WHERE id = $1', [user.id]);
    const currentHash = row.rows[0]?.password_hash;
    if (!currentHash || !(await bcrypt.compare(input.currentPassword, currentHash))) {
      return jsonError('Current password is incorrect.', 401, 'INVALID_PASSWORD');
    }
    const newHash = await bcrypt.hash(input.newPassword, 12);
    await pool.query('UPDATE idrak_users SET password_hash = $1, updated_at = now() WHERE id = $2', [newHash, user.id]);
    return jsonSuccess({ updated: true });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError('New password must be at least 8 characters.', 422, 'VALIDATION_ERROR');
    throw error;
  }
}, 'Unable to update password.', 'SERVER_ERROR');
