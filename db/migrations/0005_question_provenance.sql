-- Content-provenance audit (see the engineering report for full findings).
-- The app previously had no way to distinguish a real past-paper question
-- from a generated or placeholder one once it was in idrak_questions, and
-- no field to record where a question actually came from. This closes that
-- gap so the UI can be honest about what it's showing, and so an importer
-- can refuse to insert content without a declared origin.

ALTER TABLE idrak_questions ADD COLUMN IF NOT EXISTS content_type varchar(20) NOT NULL DEFAULT 'unknown';
-- content_type: 'real' (verified legitimately-sourced past-paper/official
-- content), 'generated' (Idrak/AI-authored practice question),
-- 'demo' (placeholder/sample content), 'unknown' (existing rows with no
-- recorded provenance — never displayed as if it were a past question).
ALTER TABLE idrak_questions ADD COLUMN IF NOT EXISTS source_reference text;
-- Free-text citation for REAL content, e.g. "WAEC 2019 Paper 2, Q14".
-- NULL/empty for generated or demo content — never fabricated.
ALTER TABLE idrak_questions ADD COLUMN IF NOT EXISTS explanation_source varchar(20) NOT NULL DEFAULT 'idrak_generated';
-- 'official' only if the explanation itself came from the source material;
-- otherwise 'idrak_generated' or 'unknown'. Never implied to be official
-- when it isn't.
ALTER TABLE idrak_questions ADD COLUMN IF NOT EXISTS content_hash varchar(64);
-- sha256 of normalized (exam_code, subject_name, question_text) — lets the
-- importer reject duplicate questions before insert.
CREATE UNIQUE INDEX IF NOT EXISTS idrak_questions_content_hash_uq ON idrak_questions (content_hash) WHERE content_hash IS NOT NULL;
