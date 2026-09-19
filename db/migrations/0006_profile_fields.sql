-- Fixes a real bug found while runtime-testing the auth/onboarding flow:
-- /api/profile (GET and PATCH) reads/writes idrak_users.institution,
-- .field_of_study, and .education_level, and onboarding's final step
-- (app/onboarding/page.tsx) PATCHes fieldOfStudy + educationLevel together
-- with onboardingComplete=true in a single request. None of these three
-- columns were ever added by a tracked migration, so on any environment
-- provisioned from this migrations folder alone, that PATCH throws
-- "column does not exist" and the request fails with 500 — which means
-- onboardingComplete never gets set, and a user can look like they can
-- never finish signing up even though their account and session are fine.
-- idrak_users.avatar is included too for the same reason (selected/updated
-- everywhere, added by no migration).
ALTER TABLE idrak_users ADD COLUMN IF NOT EXISTS avatar text;
ALTER TABLE idrak_users ADD COLUMN IF NOT EXISTS institution varchar(200);
ALTER TABLE idrak_users ADD COLUMN IF NOT EXISTS field_of_study varchar(200);
ALTER TABLE idrak_users ADD COLUMN IF NOT EXISTS education_level varchar(100);
