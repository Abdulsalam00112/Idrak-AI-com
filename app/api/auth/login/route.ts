import { z } from 'zod';
import { jsonError, jsonServerError, jsonSuccess, loginUser } from '@/lib/server';
const schema = z.object({ email: z.string().email(), password: z.string().min(8).max(128) });
export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const { onboardingComplete } = await loginUser(input.email, input.password);
    return jsonSuccess({ authenticated: true, onboardingComplete });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError('Please enter a valid email and password.', 422, 'VALIDATION_ERROR');
    // loginUser throws exactly 'INVALID_CREDENTIALS' for a wrong password or
    // unknown email — that's the only case that should read as 401. Any
    // other error (DB connection failure, missing column, etc.) was
    // previously collapsed into the same "Invalid email or password."
    // response, which hid real infrastructure failures behind what looked
    // like a normal wrong-password message.
    if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') return jsonError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    return jsonServerError(error, 'Unable to sign in right now.', 'AUTH_ERROR');
  }
}
