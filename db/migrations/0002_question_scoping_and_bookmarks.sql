-- Phase 2: bridges the questions table to the app's exam catalog (lib/data.ts),
-- adds bookmarking, and fixes a real bug found while auditing this migration:
-- app/api/questions/[id]/attempt was writing to a table called
-- `student_topic_performance`, which doesn't exist anywhere else in the app
-- and doesn't follow the idrak_ naming convention every other table uses.
-- /api/study-plan already reads topic performance from `idrak_topic_mastery`,
-- so that's the table attempt-recording should write to as well. This
-- migration creates/repairs idrak_topic_mastery with the columns the attempt
-- route needs, and the attempt route itself is updated to match.
--
-- Design note: idrak_questions.exam_id and .subject_id are uuid columns with
-- no corresponding idrak_exams / idrak_subjects tables anywhere in this
-- repo (no migration, no seed script, no code reference). Rather than invent
-- a UUID catalog and guess at values that may not match whatever is actually
-- in the live idrak_questions table, this adds plain denormalized text
-- columns (exam_code, subject_name) that content authors can set directly
-- when inserting questions, and that the API can filter on safely without
-- assuming anything about a table that may not exist. Existing rows (if any)
-- will have these columns NULL until backfilled.

ALTER TABLE idrak_questions ADD COLUMN IF NOT EXISTS exam_code varchar(20);
ALTER TABLE idrak_questions ADD COLUMN IF NOT EXISTS subject_name varchar(120);
ALTER TABLE idrak_questions ADD COLUMN IF NOT EXISTS is_high_yield boolean NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS idrak_questions_exam_code_idx ON idrak_questions (exam_code);
CREATE INDEX IF NOT EXISTS idrak_questions_topic_id_idx ON idrak_questions (topic_id);

CREATE TABLE IF NOT EXISTS idrak_topic_mastery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  topic_id uuid NOT NULL,
  questions_answered integer NOT NULL DEFAULT 0,
  correct integer NOT NULL DEFAULT 0,
  accuracy numeric NOT NULL DEFAULT 0,
  mastery_level varchar(20) NOT NULL DEFAULT 'learning',
  last_practiced timestamptz,
  UNIQUE (user_id, topic_id)
);
-- In case idrak_topic_mastery already exists with a different/older shape.
ALTER TABLE idrak_topic_mastery ADD COLUMN IF NOT EXISTS questions_answered integer NOT NULL DEFAULT 0;
ALTER TABLE idrak_topic_mastery ADD COLUMN IF NOT EXISTS correct integer NOT NULL DEFAULT 0;
ALTER TABLE idrak_topic_mastery ADD COLUMN IF NOT EXISTS accuracy numeric NOT NULL DEFAULT 0;
ALTER TABLE idrak_topic_mastery ADD COLUMN IF NOT EXISTS mastery_level varchar(20) NOT NULL DEFAULT 'learning';
ALTER TABLE idrak_topic_mastery ADD COLUMN IF NOT EXISTS last_practiced timestamptz;

CREATE TABLE IF NOT EXISTS idrak_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  question_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, question_id)
);
CREATE INDEX IF NOT EXISTS idrak_bookmarks_user_idx ON idrak_bookmarks (user_id);
