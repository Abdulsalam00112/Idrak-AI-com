-- Fixes a real bug: /login always redirected to /dashboard regardless of
-- whether the user had ever finished onboarding, so someone who signed up
-- and abandoned onboarding partway through would skip it entirely on their
-- next login. The dead (unused at runtime) Drizzle schema at db/schema.ts
-- already models this exact concept as `onboarding_complete` on its `users`
-- table, so this reuses that name for idrak_users to match the app's
-- original intent rather than inventing a new one.
ALTER TABLE idrak_users ADD COLUMN IF NOT EXISTS onboarding_complete boolean NOT NULL DEFAULT false;
