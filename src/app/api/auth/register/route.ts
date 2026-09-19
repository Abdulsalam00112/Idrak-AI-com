import { z } from 'zod';
import { jsonError, jsonServerError, jsonSuccess, registerUser } from '@/lib/server';
import { getExamByCode, getExamById } from '@/lib/data';

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  // Accepts either an ExamSeed.id ('exam-waec') or an exam code ('WAEC') so the
  // landing page and signup form can send whichever they have on hand.
  examId: z.string().trim().max(50).optional(),
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const resolvedExam = input.examId
      ? getExamById(input.examId) || getExamByCode(input.examId.toUpperCase())
      : undefined;
    await registerUser(input.name, input.email, input.password, resolvedExam?.id ?? null);
    return jsonSuccess({ authenticated: true, examId: resolvedExam?.id ?? null }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError('Please check your account details.', 422, 'VALIDATION_ERROR');
    // Postgres unique_violation. Checking the error CODE (23505) instead of
    // sniffing error.message for the word "duplicate" — the old string
    // check happened to work for this one constraint but is not something
    // to rely on across Postgres/driver versions or other constraints.
    const pgCode = (error as { code?: string } | null)?.code;
    if (pgCode === '23505') return jsonError('An account with this email already exists.', 409, 'ACCOUNT_EXISTS');
    return jsonServerError(error, 'Unable to create your account.', 'AUTH_ERROR');
  }
}
