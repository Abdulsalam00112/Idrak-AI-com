-- Adds a single source of truth for "which exam is this user preparing for".
-- Safe to run multiple times. The app also ensures this additive auth column at runtime.
ALTER TABLE idrak_users ADD COLUMN IF NOT EXISTS exam_id varchar(50);

-- exam_id stores the ExamSeed.id from lib/data.ts (e.g. 'exam-jamb', 'exam-waec').
-- It is intentionally a plain varchar (not a FK) because exam catalog data currently
-- lives in code (lib/data.ts), not in a DB-backed `exams` table.
