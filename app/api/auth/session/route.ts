import { jsonSuccess, getCurrentUser, withErrorHandling } from '@/lib/server';
export const GET = withErrorHandling(async () => { return jsonSuccess({ user: await getCurrentUser() }); }, 'Unable to check session', 'SESSION_CHECK_FAILED');
