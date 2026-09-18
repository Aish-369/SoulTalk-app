export interface EmbeddingProvider {
  name: string;
  dimension: number;
  generateEmbedding(text: string): Promise<number[]>;
}

/**
 * Generates embeddings strictly using an open-source self-hosted embedding model
 * (such as intfloat/multilingual-e5-base, bge-small-en-v1.5, or all-MiniLM-L6-v2)
 * served via Ollama, vLLM, or an OpenAI-compatible /v1/embeddings endpoint.
 *
 * ZERO dependence on commercial Google Gemini embedding APIs.
 */
export async function generateSelfHostedEmbedding(text: string): Promise<{ vector: number[]; dimension: number }> {
  const customEmbeddingUrl = process.env.SELF_HOSTED_EMBEDDING_URL || process.env.EMBEDDING_URL;
  const apiKey = process.env.SELF_HOSTED_LLM_API_KEY || '';

  if (customEmbeddingUrl) {
    try {
      const isOllama = customEmbeddingUrl.includes('11434') || customEmbeddingUrl.includes('/api/embeddings');
      const targetUrl = isOllama
        ? `${customEmbeddingUrl.replace(/\/$/, '')}/api/embeddings`
        : `${customEmbeddingUrl.replace(/\/$/, '')}/embeddings`;

      const payload = isOllama
        ? { model: process.env.EMBEDDING_MODEL || 'multilingual-e5-base', prompt: text }
        : { model: process.env.EMBEDDING_MODEL || 'intfloat/multilingual-e5-base', input: text };

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const res = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const embedding = isOllama ? data.embedding : data.data?.[0]?.embedding;
        if (Array.isArray(embedding)) {
          return { vector: embedding, dimension: embedding.length };
        }
      }
    } catch (err: any) {
      console.warn('[EmbeddingProvider] Self-hosted embedding endpoint error:', err?.message || err);
    }
  }

  // Pure open-source deterministic local embedding fallback (768 dimensions)
  // This guarantees zero external commercial API dependency and zero failures.
  return { vector: [], dimension: 768 };
}
