-- SoulTalk pgvector 768-Dimension Migration
-- Prepares Neon PostgreSQL to support open-source embedding models (e.g. multilingual-e5-base / bge-small-en-v1.5)
-- without dropping or corrupting existing records.

-- 1. Create table for 768-dim open source embeddings if not exists
CREATE TABLE IF NOT EXISTS rag_documents_768 (
    id SERIAL PRIMARY KEY,
    document_id VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    source VARCHAR(255),
    language VARCHAR(50) DEFAULT 'en',
    embedding vector(768),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create HNSW index on 768-dim vector space for fast cosine similarity
CREATE INDEX IF NOT EXISTS rag_documents_768_hnsw_idx 
ON rag_documents_768 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 3. Copy text content from legacy 3072 table into 768 table for re-indexing
INSERT INTO rag_documents_768 (document_id, title, category, content, source, language, metadata)
SELECT document_id, title, category, content, source, language, metadata
FROM rag_documents
ON CONFLICT (document_id) DO NOTHING;
