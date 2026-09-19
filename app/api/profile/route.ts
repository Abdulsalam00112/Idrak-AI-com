import { z } from 'zod';
import { pool } from '@/db';
import { getCurrentUser, jsonError, jsonSuccess, withErrorHandling } from '@/lib/server';
import { getExamById } from '@/lib/data';

const profileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  institution: z.string().trim().max(200).nullable().optional(),
  fieldOfStudy: z.string().trim().max(200).nullable().optional(),
  educationLevel: z.string().trim().max(100).nullable().optional(),
  // The user's single selected exam (ExamSeed.id from lib/data.ts). This is the
  // source of truth consumed by onboarding, dashboard, practice, etc.
  examId: z.string().trim().max(50).nullable().optional(),
  // Set by onboarding's final step. Login uses this to decide whether a
  // returning user goes to /dashboard or back to /onboarding.
  onboardingComplete: z.boolean().optional(),
  dailyStudyMinutes: z.number().int().min(5).max(600).optional(),
  tutorMode: z.enum(['socratic', 'direct', 'professional']).optional(),
});

export const GET = withErrorHandling(async () => {
  const user = await getCurrentUser();
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED');
  const result = await pool.query(
    'SELECT id, email, name, avatar, institution, field_of_study, education_level, role, exam_id AS "examId", onboarding_complete AS "onboardingComplete", daily_study_minutes AS "dailyStudyMinutes", tutor_mode AS "tutorMode", created_at, updated_at FROM idrak_users WHERE id = $1',
    [user.id],
  );
  const row = result.rows[0] ?? null;
  return jsonSuccess(row ? { ...row, exam: row.examId ? getExamById(row.examId) ?? null : null } : null);
}, 'Unable to load profile. Please refresh and try again.', 'PROFILE_LOAD_FAILED');

export const PATCH = withErrorHandling(async (request: Request) => {
  const user = await getCurrentUser();
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED');
  try {
    const input = profileSchema.parse(await request.json());
    if (input.examId && !getExamById(input.examId)) {
      return jsonError('Unknown exam selected.', 422, 'VALIDATION_ERROR');
    }
    const result = await pool.query(
      `UPDATE idrak_users
       SET name = COALESCE($1, name), institution = COALESCE($2, institution),
           field_of_study = COALESCE($3, field_of_study), education_level = COALESCE($4, education_level),
           exam_id = COALESCE($5, exam_id), onboarding_complete = COALESCE($6, onboarding_complete),
           daily_study_minutes = COALESCE($7, daily_study_minutes), tutor_mode = COALESCE($8, tutor_mode),
           updated_at = now()
       WHERE id = $9
       RETURNING id, email, name, avatar, institution, field_of_study, education_level, role, exam_id AS "examId", onboarding_complete AS "onboardingComplete", daily_study_minutes AS "dailyStudyMinutes", tutor_mode AS "tutorMode", updated_at`,
      [input.name ?? null, input.institution ?? null, input.fieldOfStudy ?? null, input.educationLevel ?? null, input.examId ?? null, input.onboardingComplete ?? null, input.dailyStudyMinutes ?? null, input.tutorMode ?? null, user.id],
    );
    const row = result.rows[0] ?? null;
    return jsonSuccess(row ? { ...row, exam: row.examId ? getExamById(row.examId) ?? null : null } : null);
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError('Invalid profile details.', 422, 'VALIDATION_ERROR');
    throw error;
  }
}, 'Unable to update profile.', 'SERVER_ERROR');
