export type RetrievedChunk = { documentId: string; documentName: string; content: string; score: number }

export function chunkText(text: string, size = 1200, overlap = 160): string[] {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (!cleaned) return []
  const chunks: string[] = []
  for (let start = 0; start < cleaned.length; start += Math.max(1, size - overlap)) {
    chunks.push(cleaned.slice(start, start + size))
    if (start + size >= cleaned.length) break
  }
  return chunks
}

export function rankChunks(query: string, chunks: RetrievedChunk[], limit = 5): RetrievedChunk[] {
  const terms = new Set(query.toLowerCase().split(/\W+/).filter((term) => term.length > 2))
  return chunks.map((chunk) => {
    const matches = [...terms].filter((term) => chunk.content.toLowerCase().includes(term)).length
    return { ...chunk, score: terms.size ? matches / terms.size : 0 }
  }).filter((chunk) => chunk.score > 0).sort((a, b) => b.score - a.score).slice(0, limit)
}

export function buildCitations(chunks: RetrievedChunk[]) {
  return chunks.map((chunk) => ({ title: chunk.documentName, documentId: chunk.documentId, relevanceScore: Number(chunk.score.toFixed(3)), relevantContent: chunk.content.slice(0, 500) }))
}
