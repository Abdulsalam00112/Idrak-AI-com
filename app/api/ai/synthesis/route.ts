import { NextRequest } from 'next/server'
import { pool } from '@/db'
import { getCurrentUser, jsonError, jsonSuccess, withErrorHandling } from '@/lib/server'
import { buildCitations, rankChunks, type RetrievedChunk } from '@/lib/rag'
import { synthesizeKnowledge } from '@/lib/synthesis'

export const POST = withErrorHandling(async (request: NextRequest) => {
  const user = await getCurrentUser()
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED')
  const body = await request.json().catch(() => null)
  const question = typeof body?.question === 'string' ? body.question.trim() : ''
  if (question.length < 3 || question.length > 4000) return jsonError('Please provide a valid question', 422, 'VALIDATION_ERROR')
  const result = await pool.query('SELECT id, name, extracted_text FROM idrak_documents WHERE user_id = $1 AND processing_status = $2 AND extracted_text IS NOT NULL', [user.id, 'processed'])
  const chunks: RetrievedChunk[] = result.rows.flatMap((document) => {
    const text = String(document.extracted_text || '')
    const pieces = text.match(/.{1,1200}/g) || []
    return pieces.map((content) => ({ documentId: document.id, documentName: document.name, content, score: 0 }))
  })
  const retrieved = rankChunks(question, chunks)
  // synthesizeKnowledge calls out to the AI provider; a provider timeout,
  // rate limit, or malformed response is now caught by withErrorHandling
  // instead of crashing unhandled (that was leaving "Ask Idrak" blank).
  const synthesis = await synthesizeKnowledge({ question, context: retrieved.map((chunk) => chunk.content) })
  return jsonSuccess({ answer: synthesis.answer, citations: buildCitations(retrieved), model: synthesis.model, usage: synthesis.usage })
}, 'Ask Idrak is temporarily unavailable. Please try again.', 'SYNTHESIS_FAILED')
