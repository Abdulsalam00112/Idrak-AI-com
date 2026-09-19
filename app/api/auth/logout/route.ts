import { jsonSuccess, signOut, withErrorHandling } from '@/lib/server';
export const POST = withErrorHandling(async () => { await signOut(); return jsonSuccess({ authenticated: false }); }, 'Unable to sign out', 'LOGOUT_FAILED');
