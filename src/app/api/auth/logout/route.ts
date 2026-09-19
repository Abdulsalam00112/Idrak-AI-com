import { jsonSuccess, signOut } from '@/lib/server';
export async function POST() { await signOut(); return jsonSuccess({ authenticated: false }); }
