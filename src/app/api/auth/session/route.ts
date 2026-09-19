import { jsonSuccess, getCurrentUser } from '@/lib/server';
export async function GET() { return jsonSuccess({ user: await getCurrentUser() }); }
