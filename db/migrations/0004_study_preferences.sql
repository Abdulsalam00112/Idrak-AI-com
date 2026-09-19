-- Backs Settings > Study preferences (daily study goal, default Tutor mode),
-- which previously had buttons with no onClick handler at all.
ALTER TABLE idrak_users ADD COLUMN IF NOT EXISTS daily_study_minutes integer NOT NULL DEFAULT 45;
ALTER TABLE idrak_users ADD COLUMN IF NOT EXISTS tutor_mode varchar(20) NOT NULL DEFAULT 'socratic';
