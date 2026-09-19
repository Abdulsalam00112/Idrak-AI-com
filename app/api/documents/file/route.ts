import { get } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/db'
import { getCurrentUser, jsonError, withErrorHandling } from '@/lib/server'

export const runtime = 'nodejs'

export const GET = withErrorHandling(async (request: NextRequest) => {
  const user = await getCurrentUser()
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED')
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return jsonError('Document id is required', 400, 'DOCUMENT_ID_REQUIRED')
  const result = await pool.query('SELECT storage_url, file_type FROM idrak_documents WHERE id = $1 AND user_id = $2 LIMIT 1', [id, user.id])
  const document = result.rows[0]
  if (!document) return jsonError('Document not found', 404, 'NOT_FOUND')
  const blob = await get(document.storage_url, { access: 'private' })
  if (!blob) return jsonError('File not found', 404, 'FILE_NOT_FOUND')
  return new NextResponse(blob.stream, { headers: { 'Content-Type': document.file_type, 'Cache-Control': 'private, no-cache', ETag: blob.blob.etag } })
}, 'Unable to retrieve this file', 'DOCUMENT_FETCH_FAILED')
