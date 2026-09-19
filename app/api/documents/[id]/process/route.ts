import { get } from '@vercel/blob';
import { z } from 'zod';
import { pool } from '@/db';
import { chunkText } from '@/lib/rag';
import { getCurrentUser, jsonError, jsonSuccess, withErrorHandling } from '@/lib/server';

export const POST = withErrorHandling(async (_: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await getCurrentUser();
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED');
  const id = z.string().uuid().safeParse((await params).id);
  if (!id.success) return jsonError('Document not found.', 404, 'NOT_FOUND');
  const document = await pool.query('SELECT id, name, file_type, storage_url FROM idrak_documents WHERE id = $1 AND user_id = $2', [id.data, user.id]);
  if (!document.rowCount) return jsonError('Document not found.', 404, 'NOT_FOUND');
  await pool.query('UPDATE idrak_documents SET processing_status = $1, updated_at = now() WHERE id = $2 AND user_id = $3', ['processing', id.data, user.id]);
  try {
    const result = await get(document.rows[0].storage_url, { access: 'private' });
    if (!result) throw new Error('FILE_NOT_FOUND');
    if (document.rows[0].file_type === 'application/pdf') {
      await pool.query('UPDATE idrak_documents SET processing_status = $1, updated_at = now() WHERE id = $2 AND user_id = $3', ['needs_extractor', id.data, user.id]);
      return jsonSuccess({ id: id.data, processingStatus: 'needs_extractor' });
    }
    const text = await new Response(result.stream).text();
    const chunks = chunkText(text);
    await pool.query('DELETE FROM idrak_document_chunks WHERE document_id = $1 AND user_id = $2', [id.data, user.id]);
    for (const [index, content] of chunks.entries()) await pool.query('INSERT INTO idrak_document_chunks (document_id, user_id, content, chunk_index) VALUES ($1, $2, $3, $4)', [id.data, user.id, content, index]);
    await pool.query('UPDATE idrak_documents SET extracted_text = $1, processing_status = $2, updated_at = now() WHERE id = $3 AND user_id = $4', [text, 'ready', id.data, user.id]);
    return jsonSuccess({ id: id.data, processingStatus: 'ready', chunks: chunks.length });
  } catch {
    await pool.query('UPDATE idrak_documents SET processing_status = $1, updated_at = now() WHERE id = $2 AND user_id = $3', ['failed', id.data, user.id]);
    return jsonError('Unable to process this document.', 422, 'PROCESSING_FAILED');
  }
}, 'Unable to process this document.', 'PROCESSING_FAILED');
