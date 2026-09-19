import { cookies, headers } from 'next/headers';
import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { pool } from '@/db';

const COOKIE = 'idrak_session';
const SESSION_DAYS = 30;

export type CurrentUser = { id: string; email: string; name: string; avatar: string | null; role: string; examId: string | null; onboardingComplete: boolean };

function hashToken(token: string) { return createHash('sha256').update(token).digest('hex'); }

// The production database may have been created from the original base schema
// without the later auth migrations. Do not make signup depend on someone
// remembering to run psql manually: once the legacy idrak_users table exists,
// make the additive auth columns available before any auth query uses them.
// The operation is idempotent and cached for the lifetime of the server process.
// If the DB is unreachable or idrak_users itself does not exist, the original
// error is allowed to surface through jsonServerError instead of being hidden.
let authSchemaReady: Promise<void> | null = null;

export function ensureAuthSchema() {
  if (authSchemaReady) return authSchemaReady;
  authSchemaReady = pool.query(`
    ALTER TABLE idrak_users
      ADD COLUMN IF NOT EXISTS exam_id varchar(50),
      ADD COLUMN IF NOT EXISTS onboarding_complete boolean NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS avatar text,
      ADD COLUMN IF NOT EXISTS institution varchar(200),
      ADD COLUMN IF NOT EXISTS field_of_study varchar(200),
      ADD COLUMN IF NOT EXISTS education_level varchar(100),
      ADD COLUMN IF NOT EXISTS daily_study_minutes integer NOT NULL DEFAULT 45,
      ADD COLUMN IF NOT EXISTS tutor_mode varchar(20) NOT NULL DEFAULT 'socratic'
  `).then(() => undefined).catch((error) => {
    authSchemaReady = null;
    throw error;
  });
  return authSchemaReady;
}

// The session cookie's Secure/SameSite attributes must match how the request
// actually arrived, not a blanket NODE_ENV switch. Previously this was
// `secure: true` unconditionally with `sameSite: 'none'` whenever
// NODE_ENV === 'development'. A `Secure` cookie can only be *set* by a
// browser over an actual HTTPS connection (RFC 6265bis / all major browsers
// enforce this) — Chrome's exception for the literal hostname "localhost"
// made this invisible in that one specific setup, but the cookie was
// silently dropped (never stored) on Safari, Firefox, 127.0.0.1, a LAN IP,
// or any plain-HTTP dev/staging server. Login/signup would still return a
// 200/201 with the right JSON, but no cookie ever reached the browser, so
// the very next request had no session — indistinguishable from "auth is
// broken" for anyone not testing in Chrome on http://localhost.
// - v0's preview iframe (vusercontent.net) embeds the app cross-site over
//   HTTPS, which needs SameSite=None + Secure to receive the cookie at all.
// - Real HTTPS deployments (production, Vercel previews) use Lax + Secure,
//   the normal safe default for a same-origin app.
// - Plain-HTTP access (most local `next dev` setups) must not set Secure,
//   or the browser refuses to store the cookie in the first place.
async function sessionCookieOptions() {
  const hdrs = await headers();
  const host = hdrs.get('host') || '';
  const proto = hdrs.get('x-forwarded-proto') || (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https');
  const isEmbeddedPreview = host.includes('vusercontent.net');
  const isHttps = proto === 'https';
  // SameSite=None is only ever honored by browsers alongside Secure, so the
  // preview-iframe case forces secure regardless of the proto check above
  // (in practice that host is always served over HTTPS anyway).
  return {
    secure: isEmbeddedPreview ? true : isHttps,
    sameSite: isEmbeddedPreview ? ('none' as const) : ('lax' as const),
  };
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString('hex');
  await pool.query('INSERT INTO idrak_sessions (user_id, token_hash, expires_at) VALUES ($1, $2, now() + interval \'30 days\')', [userId, hashToken(token)]);
  const { secure, sameSite } = await sessionCookieOptions();
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  await ensureAuthSchema();
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const result = await pool.query(`SELECT u.id, u.email, u.name, u.avatar, u.role, u.exam_id AS "examId", u.onboarding_complete AS "onboardingComplete"
    FROM idrak_sessions s JOIN idrak_users u ON u.id = s.user_id
    WHERE s.token_hash = $1 AND s.expires_at > now() LIMIT 1`, [hashToken(token)]);
  return result.rows[0] ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}

export async function signOut() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (token) await pool.query('DELETE FROM idrak_sessions WHERE token_hash = $1', [hashToken(token)]);
  (await cookies()).delete(COOKIE);
}

export async function registerUser(name: string, email: string, password: string, examId?: string | null) {
  await ensureAuthSchema();
  const passwordHash = await bcrypt.hash(password, 12);
  const result = await pool.query(
    `INSERT INTO idrak_users (email, password_hash, name, exam_id) VALUES ($1, $2, $3, $4) RETURNING id`,
    [email.toLowerCase(), passwordHash, name, examId ?? null],
  );
  await createSession(result.rows[0].id);
  return result.rows[0].id as string;
}

export async function loginUser(email: string, password: string) {
  await ensureAuthSchema();
  const result = await pool.query('SELECT id, password_hash, exam_id AS "examId", onboarding_complete AS "onboardingComplete" FROM idrak_users WHERE lower(email) = lower($1) LIMIT 1', [email]);
  const row = result.rows[0];
  if (!row || !row.password_hash || !(await bcrypt.compare(password, row.password_hash))) throw new Error('INVALID_CREDENTIALS');
  await createSession(row.id);
  return { examId: row.examId as string | null, onboardingComplete: Boolean(row.onboardingComplete) };
}

export function jsonError(message: string, status = 400, code = 'BAD_REQUEST') {
  return Response.json({ success: false, error: { code, message } }, { status });
}

// Any unexpected failure (DB connection, missing table/column, constraint
// violation we didn't already special-case, etc.) was previously collapsing
// into a single generic 500 with NO server-side log at all — so a real
// schema/connection problem was invisible in both the response AND the
// terminal/Vercel logs. This logs the safe, non-sensitive parts of a
// Postgres error (code/message/detail/table/column/constraint — never a
// query's bound parameters, credentials, or the request body) and, outside
// production, also puts that same detail in the JSON response so it can be
// read directly from the failed request while testing. In production the
// response now also includes safe database diagnostics so a hosted deployment can be diagnosed without shell access. No credentials, tokens, hashes, query parameters, or request bodies are included.
export function jsonServerError(error: unknown, fallbackMessage: string, code = 'SERVER_ERROR') {
  const pgError = error as { code?: string; message?: string; detail?: string; table?: string; column?: string; constraint?: string } | null;
  const safeDetail = pgError && typeof pgError === 'object'
    ? { pgCode: pgError.code, message: pgError.message, detail: pgError.detail, table: pgError.table, column: pgError.column, constraint: pgError.constraint }
    : { message: error instanceof Error ? error.message : String(error) };
  console.error('[auth] server error:', JSON.stringify(safeDetail));
  const isProd = process.env.NODE_ENV === 'production';
  return Response.json(
    { success: false, error: { code, message: fallbackMessage, debug: safeDetail } },
    { status: 500 },
  );
}

export function jsonSuccess<T>(data: T, status = 200) { return Response.json({ success: true, data }, { status }); }

// Wraps a route handler so ANY unhandled throw inside it — including one
// from getCurrentUser()/ensureAuthSchema() itself, which every handler below
// calls before its own logic — becomes a real JSON error response instead of
// an unhandled exception. Previously, only errors *after* the auth check were
// caught (if a route bothered to add try/catch at all); a transient failure
// in the session lookup itself (the one thing every protected route does
// first) still crashed unhandled. That produced a non-JSON response body,
// which is what the frontend's `response.json()` was choking on with
// "Unexpected end of JSON input" — on Analytics, Billing, and anywhere else
// that shares this same getCurrentUser() call.
export function withErrorHandling<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>,
  fallbackMessage = 'Something went wrong. Please try again.',
  code = 'SERVER_ERROR',
) {
  return async (...args: Args): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      return jsonServerError(error, fallbackMessage, code);
    }
  };
}

export async function requestOriginAllowed() {
  const origin = (await headers()).get('origin');
  return !origin || origin === process.env.VERCEL_URL || origin.includes('localhost') || origin.includes('vusercontent.net');
}

export async function consumeAiRequest(userId: string) {
  const result = await pool.query(`SELECT COUNT(*)::int AS count FROM idrak_usage WHERE user_id = $1 AND created_at > now() - interval '1 hour'`, [userId]);
  if ((result.rows[0]?.count ?? 0) >= 30) return false;
  await pool.query(`INSERT INTO idrak_usage (user_id, provider, model, tokens_used, request_count) VALUES ($1, 'vercel-ai-gateway', 'tutor', 0, 1)`, [userId]);
  return true;
}
