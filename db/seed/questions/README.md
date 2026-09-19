# Question content import

This is the *only* supported way to load real question content into Idrak.
The frontend must never be the source of truth for the question bank —
`lib/data.ts` only holds the exam/subject *catalog* (names, codes, scoring
scale), never actual exam questions.

## Why this exists

An audit of this repository (see the project's engineering log) found:
- Zero real question datasets anywhere in the repo — no CSV, no JSON, no SQL
  inserts, no seed scripts.
- Exactly 2 hardcoded sample questions in `lib/data.ts`, unused by any page,
  with no source citation on their `year` fields — treat them as unverified,
  not real past questions.
- UI numbers like "12,480 questions" were never backed by real content —
  they've since been replaced with live counts from `/api/exams/content-status`.

## Content status (as of this writing)

`db/seed/questions/generated/` contains a small starter batch of 48 **Idrak-generated** practice questions (6 per exam × 8 exams), written from scratch for this project. None of it is past-paper content. See `generated/PROVENANCE.md` for the licensing research behind why no real past-paper content is included, and the constitutional/legal reasoning for staying with generated-only content until a licensing arrangement exists.

## How to add content

1. Get legitimately-licensed or properly-authorized question content into
   JSON matching `schema.json` in this folder (one file per batch — by exam,
   by year, whatever's convenient).
2. Run: `npx tsx db/seed/questions/import.ts path/to/your-file.json`
3. The importer validates every question (see below) and reports exactly
   how many were inserted vs. rejected vs. skipped as duplicates. It never
   silently drops or "fixes" bad data.

## What the importer enforces

- `examCode` must match a real exam in `lib/data.ts` (`EXAMS`) — a WAEC
  file can never accidentally land under JAMB.
- `contentType` is **required** on every question: `real`, `generated`, or
  `demo`. There is no default — you must say what a question is.
- `sourceReference` is **required** when `contentType` is `real` (e.g.
  `"WAEC 2019 Paper 2, Q14"`). The importer refuses real-content rows with
  no citation rather than accepting an unsourced "real" question.
- `year` is optional and only stored if you provide it — the importer never
  invents a year to make the UI look more complete.
- Duplicate detection via a hash of (examCode, subjectName, questionText) —
  re-running the same file is safe; nothing gets inserted twice.
- Required fields (question text, ≥2 options, a correct answer that matches
  one of the option ids, difficulty) are enforced before anything touches
  the database.

## What it does NOT do

- It does not scrape, generate, or fabricate exam content.
- It does not mark anything "real" unless you explicitly say so — if you
  omit `contentType`, the import is rejected, not defaulted to something
  misleading.
