import { del } from '@vercel/blob'
import { NextRequest } from 'next/server'
import { pool } from '@/db'
import { getCurrentUser, jsonError, jsonSuccess, withErrorHandling } from '@/lib/server'

export const runtime = 'nodejs'

type Context = { params: Promise<{ id: string }> }

export const DELETE = withErrorHandling(async (_request: NextRequest, context: Context) => {
  const user = await getCurrentUser()
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED')
  const { id } = await context.params
  const result = await pool.query('DELETE FROM idrak_documents WHERE id = $1 AND user_id = $2 RETURNING storage_url', [id, user.id])
  if (!result.rowCount) return jsonError('Document not found', 404, 'NOT_FOUND')
  await del(result.rows[0].storage_url)
  return jsonSuccess({ deleted: true })
}, 'Unable to delete this document', 'DOCUMENT_DELETE_FAILED')

export const POST = withErrorHandling(async (request: NextRequest, context: Context) => {
  const user = await getCurrentUser()
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED')
  const { id } = await context.params
  const result = await pool.query('SELECT id, file_type, storage_url FROM idrak_documents WHERE id = $1 AND user_id = $2 LIMIT 1', [id, user.id])
  const document = result.rows[0]
  if (!document) return jsonError('Document not found', 404, 'NOT_FOUND')
  const blob = await (await import('@vercel/blob')).get(document.storage_url, { access: 'private' })
  if (!blob) return jsonError('File not found', 404, 'FILE_NOT_FOUND')
  const buffer = Buffer.from(await new Response(blob.stream).arrayBuffer())
  // NOTE: PDFs are intentionally NOT extracted here — there is no PDF
  // text-extraction library wired into this project. Only plain text/markdown
  // is actually processed; a PDF upload will sit at 'queued' indefinitely
  // until that pipeline is built. This route no longer silently 500s on that
  // case, but the underlying feature gap (item 7, PDF handling) is real and
  // unresolved — see the audit summary.
  const extractedText = document.file_type === 'text/plain' || document.file_type === 'text/markdown' ? buffer.toString('utf8') : null
  await pool.query('UPDATE idrak_documents SET processing_status = $1, extracted_text = $2, updated_at = now() WHERE id = $3 AND user_id = $4', [extractedText ? 'processed' : 'queued', extractedText, id, user.id])
  return jsonSuccess({ id, processingStatus: extractedText ? 'processed' : 'queued' })
}, 'Unable to process this document', 'DOCUMENT_PROCESS_FAILED')
