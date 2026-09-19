import { put } from '@vercel/blob'
import { NextRequest } from 'next/server'
import { pool } from '@/db'
import { getCurrentUser, jsonError, jsonSuccess, withErrorHandling } from '@/lib/server'

export const runtime = 'nodejs'
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = new Set(['application/pdf', 'text/plain', 'text/markdown'])

export const GET = withErrorHandling(async () => {
  const user = await getCurrentUser()
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED')
  const result = await pool.query('SELECT id, name, file_type, file_size, processing_status, created_at, updated_at FROM idrak_documents WHERE user_id = $1 ORDER BY created_at DESC', [user.id])
  return jsonSuccess(result.rows)
}, 'Unable to load documents', 'DOCUMENTS_LIST_FAILED')

export const POST = withErrorHandling(async (request: NextRequest) => {
  const user = await getCurrentUser()
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED')
  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) return jsonError('A file is required', 400, 'FILE_REQUIRED')
  if (!ALLOWED_TYPES.has(file.type)) return jsonError('Only PDF, text, and Markdown files are supported', 415, 'UNSUPPORTED_FILE_TYPE')
  if (file.size <= 0 || file.size > MAX_FILE_SIZE) return jsonError('Files must be smaller than 10 MB', 413, 'FILE_TOO_LARGE')

  const pathname = `users/${user.id}/documents/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  const blob = await put(pathname, file, { access: 'private', addRandomSuffix: false })
  const result = await pool.query(`INSERT INTO idrak_documents (user_id, name, file_type, file_size, storage_url, processing_status) VALUES ($1, $2, $3, $4, $5, 'uploaded') RETURNING id, name, file_type, file_size, processing_status, created_at`, [user.id, file.name, file.type, file.size, blob.pathname])
  return jsonSuccess(result.rows[0], 201)
}, 'Unable to upload this file', 'DOCUMENT_UPLOAD_FAILED')
