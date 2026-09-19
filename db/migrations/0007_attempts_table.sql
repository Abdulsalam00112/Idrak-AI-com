-- Fixes a real bug found while runtime-testing the authenticated account
-- surface: app/api/questions/[id]/attempt writes to idrak_attempts, and
-- app/api/account (GET for data export, DELETE for account deletion) reads
-- and cleans up the same table — but no migration anywhere creates it.
-- On any environment provisioned from this migrations folder alone,
-- recording a practice attempt, exporting account data, or deleting an
-- account all fail with "relation idrak_attempts does not exist" (confirmed
-- by running GET /api/account against a fresh database during this audit).
CREATE TABLE IF NOT EXISTS idrak_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  question_id uuid NOT NULL,
  exam_id uuid,
  subject_id uuid,
  topic_id uuid,
  selected_answer varchar(255),
  is_correct boolean NOT NULL DEFAULT false,
  time_spent_seconds integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idrak_attempts_user_idx ON idrak_attempts (user_id);
CREATE INDEX IF NOT EXISTS idrak_attempts_question_idx ON idrak_attempts (question_id);
