# Idrak AI authentication fix

## What was fixed

The active Next.js app is the **root `app/` + root `lib/` tree**. The previous package also contained a stale `src/` copy of the auth files; both copies are now synchronized.

The auth server now:

- logs safe Postgres diagnostics for unexpected failures;
- detects duplicate emails by Postgres error code `23505`;
- automatically ensures the additive auth columns exist on `idrak_users` before register/login/session queries;
- keeps production responses generic while exposing `debug` only outside production;
- preserves exam selection and onboarding fields.

## Important

The runtime schema check can add missing columns to an existing `idrak_users` table, but it cannot create the original base `idrak_users` table if that table itself is missing.

The tracked SQL migrations remain in `db/migrations/`. They are idempotent and should still be applied to fully provision the database.

After deploying, test:

1. Create a brand-new account.
2. Sign out.
3. Sign back in with the same account.
4. Complete onboarding and refresh.
5. Try each exam code: JAMB, WAEC, NECO, SAT, IELTS, ICAN.

If registration still returns a 500, the response outside production will contain `error.debug` with the actual PostgreSQL error, and the server log contains `[auth] server error:`.
