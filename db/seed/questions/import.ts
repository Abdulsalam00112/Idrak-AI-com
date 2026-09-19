// Question content importer.
//
// Usage: npx tsx db/seed/questions/import.ts path/to/file.json [--dry-run]
//
// See README.md in this folder for the full rules. In short: every question
// must declare a real exam code, a content_type (no default), and a source
// citation if it claims to be real. Nothing here generates or invents
// question content — it only validates and loads content you provide.

import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import { Pool } from 'pg';
import { EXAMS } from '../../../lib/data';

const optionSchema = z.object({ id: z.string().min(1).max(5), text: z.string().min(1) });

const questionSchema = z.object({
  examCode: z.string().refine((code) => EXAMS.some((e) => e.code === code.toUpperCase()), {
    message: 'examCode must match a real exam code from lib/data.ts (JAMB, WAEC, NECO, POST-UTME, SAT, IELTS, ICAN, CITN)',
  }),
  subjectName: z.string().min(1).max(120),
  topicId: z.string().uuid().nullable().optional(),
  questionText: z.string().min(1),
  options: z.array(optionSchema).min(2),
  correctAnswer: z.string().min(1),
  explanation: z.string().min(1),
  explanationSource: z.enum(['official', 'idrak_generated', 'unknown']).default('idrak_generated'),
  difficulty: z.enum(['easy', 'medium', 'hard', 'challenging']),
  // No default on purpose — a question with unstated provenance must be
  // explicitly marked 'unknown', never silently treated as anything else.
  contentType: z.enum(['real', 'generated', 'demo', 'unknown']),
  sourceReference: z.string().min(1).max(500).nullable().optional(),
  year: z.number().int().min(1950).max(2100).nullable().optional(),
  isHighYield: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
}).superRefine((q, ctx) => {
  if (!q.options.some((o) => o.id === q.correctAnswer)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `correctAnswer "${q.correctAnswer}" does not match any option id` });
  }
  if (q.contentType === 'real' && !q.sourceReference) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'sourceReference is required when contentType is "real" — real content must be citable' });
  }
});

function contentHash(examCode: string, subjectName: string, questionText: string) {
  const normalized = `${examCode.toUpperCase()}|${subjectName.trim().toLowerCase()}|${questionText.trim().toLowerCase().replace(/\s+/g, ' ')}`;
  return createHash('sha256').update(normalized).digest('hex');
}

async function main() {
  const filePath = process.argv[2];
  const dryRun = process.argv.includes('--dry-run');
  if (!filePath) { console.error('Usage: npx tsx db/seed/questions/import.ts <file.json> [--dry-run]'); process.exit(1); }

  const raw = JSON.parse(readFileSync(filePath, 'utf-8'));
  if (!Array.isArray(raw)) { console.error('Input file must be a JSON array of questions.'); process.exit(1); }

  const accepted: z.infer<typeof questionSchema>[] = [];
  const rejected: { index: number; errors: string[] }[] = [];

  raw.forEach((row, index) => {
    const result = questionSchema.safeParse(row);
    if (result.success) accepted.push(result.data);
    else rejected.push({ index, errors: result.error.issues.map((i) => i.message) });
  });

  console.log(`Parsed ${raw.length} rows: ${accepted.length} valid, ${rejected.length} rejected.`);
  if (rejected.length > 0) {
    console.log('\nRejected rows:');
    rejected.forEach((r) => console.log(`  [${r.index}] ${r.errors.join('; ')}`));
  }
  if (accepted.length === 0) { console.log('\nNothing valid to import.'); return; }

  if (dryRun) { console.log(`\nDry run — would insert up to ${accepted.length} rows (duplicates against existing content are skipped at insert time).`); return; }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  let inserted = 0;
  let duplicates = 0;
  for (const q of accepted) {
    const hash = contentHash(q.examCode, q.subjectName, q.questionText);
    const result = await pool.query(
      `INSERT INTO idrak_questions
         (exam_code, subject_name, topic_id, question_text, options, correct_answer, explanation,
          explanation_source, difficulty, content_type, source_reference, year, is_high_yield, tags, content_hash)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       ON CONFLICT (content_hash) DO NOTHING
       RETURNING id`,
      [
        q.examCode.toUpperCase(), q.subjectName, q.topicId ?? null, q.questionText,
        JSON.stringify(q.options), q.correctAnswer, q.explanation, q.explanationSource,
        q.difficulty, q.contentType, q.sourceReference ?? null, q.year ?? null,
        q.isHighYield, q.tags, hash,
      ],
    );
    if (result.rowCount && result.rowCount > 0) inserted += 1; else duplicates += 1;
  }
  await pool.end();
  console.log(`\nInserted ${inserted} new question(s). Skipped ${duplicates} duplicate(s) already in idrak_questions.`);
}

main().catch((error) => { console.error(error); process.exit(1); });
