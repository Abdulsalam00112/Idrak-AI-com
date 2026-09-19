import { pool } from '@/db';
import { jsonServerError, jsonSuccess } from '@/lib/server';
import { EXAMS } from '@/lib/data';

// Real, DB-backed content counts per exam. This exists specifically because
// the UI used to display lib/data.ts's `totalQuestions` (a hand-picked
// marketing-style number, e.g. 12,480 for JAMB) as if it were the number of
// questions actually available. It never reflected real content. Every
// number this endpoint returns comes from an actual COUNT(*) against
// idrak_questions — nothing here is estimated, rounded up, or padded.
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT exam_code,
              COUNT(*)::int AS total,
              COUNT(*) FILTER (WHERE content_type = 'real')::int AS real_count,
              COUNT(*) FILTER (WHERE content_type = 'generated')::int AS generated_count,
              COUNT(*) FILTER (WHERE content_type = 'demo')::int AS demo_count,
              COUNT(*) FILTER (WHERE content_type = 'unknown')::int AS unknown_count,
              COUNT(*) FILTER (WHERE is_high_yield)::int AS high_yield_count,
              COUNT(DISTINCT year) FILTER (WHERE year IS NOT NULL)::int AS distinct_years
       FROM idrak_questions
       WHERE exam_code IS NOT NULL
       GROUP BY exam_code`,
    );
    const byCode = new Map(result.rows.map((r) => [r.exam_code, r]));
    const statuses = EXAMS.map((exam) => {
      const row = byCode.get(exam.code);
      const total = row?.total ?? 0;
      return {
        examId: exam.id,
        examCode: exam.code,
        totalQuestions: total,
        realQuestions: row?.real_count ?? 0,
        generatedQuestions: row?.generated_count ?? 0,
        demoQuestions: row?.demo_count ?? 0,
        unknownProvenanceQuestions: row?.unknown_count ?? 0,
        highYieldQuestions: row?.high_yield_count ?? 0,
        distinctYears: row?.distinct_years ?? 0,
        // Deliberately just "has content" vs "none" rather than a fabricated
        // partial/full tier — there's no authoritative target count to compare
        // against, so a maturity label beyond this would itself be a guess.
        hasContent: total > 0,
      };
    });
    return jsonSuccess(statuses);
  } catch (error) {
    return jsonServerError(error, 'Unable to load exam content status', 'CONTENT_STATUS_FAILED');
  }
}
