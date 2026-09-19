# Idrak AI — audit report

## Root causes found

1. **Shared crash pattern (Analytics, Billing, Ask Idrak, and 21 other routes).**
   `getCurrentUser()` queries the database and was called *before* any
   try/catch in every protected API route. Any transient DB error there
   crashed the route unhandled → Next returned a non-JSON error response →
   the frontend's `response.json()` threw "Unexpected end of JSON input".
   This is a single root cause behind items 4, 5, and part of 6.

2. **Onboarding "no topic data" (item 1).** Not a query bug — `lib/data.ts`
   has `topics: []` hardcoded for every subject under WAEC, NECO, SAT,
   IELTS, and ICAN (JAMB is the only exam with topics filled in; CITN is
   missing 6 of 18). The onboarding screen reads this static file directly.

3. **Dashboard blank sections (item 2).** `RECOMMENDED_PRACTICE`,
   `RECENT_ACTIVITY`, and `WEEKLY_PLAN` were hardcoded empty arrays in the
   dashboard component — never wired to any endpoint at all.

4. **Fabricated readiness text (item 3).** The "Algebra and Human
   Physiology are the biggest unlocks" line was a static string in both
   the dashboard and analytics components, unrelated to any user's data.
   The numeric readiness score itself was already a single shared value
   (`/api/analytics`'s `readinessScore`) consumed by both pages — the
   "0% / —% / Loading data" inconsistency you saw was that same endpoint
   crashing (root cause #1) and being caught differently by each
   component's fallback UI, not two competing calculations.

5. **PDF handling (item 7).** No PDF text-extraction library is wired into
   the project. The processing route already sets `processing_status:
   'needs_extractor'` for PDFs — this is documented, unfinished work, not
   a bug to patch.

## Files changed

**Error-handling wrapper (new):** `lib/server.ts` — added `withErrorHandling()`.

**Routes converted to use it (24):** `api/analytics`, `api/subscription`,
`api/usage`, `api/bookmarks`, `api/profile`, `api/account`,
`api/account/password`, `api/study-plan`, `api/questions`,
`api/questions/[id]/attempt`, `api/questions/[id]/bookmark`,
`api/documents`, `api/documents/[id]`, `api/documents/[id]/process`,
`api/documents/file`, `api/ai/synthesis`, `api/ai/query`,
`api/feedback`, `api/conversations`, `api/conversations/[id]`,
`api/conversations/[id]/messages`, `api/payment/initialize`,
`api/exams/content-status`, `api/auth/session`, `api/auth/logout`.

**Real data wired in (no longer stubs):** `app/api/analytics/route.ts`
(added `recentAttempts`), `app/(dashboard)/dashboard/page.tsx`
(Recommended Practice, Recent Activity, Your Week now derive from
`/api/analytics` and `/api/study-plan`; added empty-state copy for all
three), `app/(dashboard)/analytics/page.tsx` (readiness callout text is
now generated from the user's actual weakest topics).

## Tests performed

- `tsc --noEmit` — clean, no errors, across the whole project.
- `next build` (production) — compiles successfully; all 24 API routes
  register correctly as dynamic; all pages generate.
- Could not run against a live database or exercise the real
  sign-up → practice → dashboard flow end-to-end (no DB connection or
  deployment available in this environment) — that verification still
  needs to happen in your environment.

## Remaining known issues (not fixed)

- **Topic content gap (item 1) — RESOLVED at the catalog level.** Every
  exam's subjects now have real topic lists in `lib/data.ts`: JAMB was
  already complete; WAEC, NECO, Post-UTME, SAT, IELTS, ICAN, and CITN have
  all been filled in this pass (0 subjects with empty `topics: []`,
  confirmed by grep). Onboarding's "no topic data available" message will
  no longer appear for any supported exam.
- **Topics aren't linked to real questions yet:** the existing
  `db/seed/questions/generated/*.json` batch (763 questions, built in an
  earlier pass on this project — see its `PROVENANCE.md` for the honest
  licensing research behind why it's generated-only, not past-paper
  content) has `topicId: null` on every question. The onboarding *catalog*
  picker now works, but the topic ↔ question link in the database still
  doesn't exist, so topic-level mastery/practice won't yet reflect the new
  catalog. Closing that needs either an `idrak_topics` seed matching the
  `lib/data.ts` topic IDs, or a pass over the generated questions to tag
  `topicId`.
- **Question bank redesign (item 16):** turns out this is already mostly
  built (`db/seed/questions/`) — a validated importer enforcing exam
  ownership, required content-type/source-citation on real content,
  programmatically-verified quantitative answers, and duplicate
  detection. Worth checking with whoever ran that work before treating
  item 16 as unstarted.
- **PDF text extraction (item 7):** genuinely unbuilt; needs a PDF
  parsing library wired into `app/api/documents/[id]/process/route.ts`.
- **Full end-to-end re-test with a live database and deployment** —
  everything above is verified at the code/type/build level only.
