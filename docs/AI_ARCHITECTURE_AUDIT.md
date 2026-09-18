# SoulTalk Complete AI Architecture Audit

**Date:** 2026-09-17  
**Environment:** Cloud Run Container (Node.js 20 ESM, TypeScript, Express, Vite, Neon PostgreSQL with pgvector)  
**Author:** SoulTalk AI Engineering Team

---

## 1. Executive Summary

This audit catalogs all active, legacy, duplicate, and broken components across the SoulTalk repository. It establishes clear architectural boundaries to eliminate commercial per-token LLM API dependencies (Google Gemini) and transition to a self-hosted open-source neural LLM architecture (`Qwen/Qwen2.5-3B-Instruct` or equivalent) with local embeddings (`multilingual-e5-base` / `all-MiniLM-L6-v2`) and independent cloud execution (laptop-off).

---

## 2. Component Classification Table

| Component / Subsystem | Path / File | Classification | Status & Notes |
| :--- | :--- | :--- | :--- |
| **Active Production Backend** | `server.ts` | **ACTIVE** | Core Express HTTP API binding on port 3000, host `0.0.0.0`. Integrates auth, chat, mood tracking, voice reflection, and Vite middleware. |
| **Legacy Python Backend** | `backend/main.py`, `backend/database.py`, `backend/models.py` | **LEGACY / UNUSED** | Earlier FastAPI implementation. Unused in production Cloud Run container (Node.js runtime). Kept for reference. |
| **Model Adapter** | `server/modelAdapter.ts` | **ACTIVE** | Primary orchestration between the self-hosted LLM provider, quality guard, and resilience fallback. |
| **Self-Hosted LLM Provider** | `server/llm/selfHostedProvider.ts`, `server/llm/llmConfig.ts` | **ACTIVE / REQUIRED** | OpenAI-compatible / Ollama client targeting remote independent inference server (`qwen2.5:3b-instruct`). |
| **Deterministic Quality Guard** | `server/qualityGuard.ts` | **ACTIVE (EMERGENCY ONLY)** | Deterministic rule-based template safety net (`generateDiverseFallback`). Must NOT be used as the normal AI chatbot. |
| **Crisis Safety Engine** | `server/safetyEngine.ts` | **ACTIVE / REQUIRED** | Hard-coded <0.3ms deterministic safety holding filter. Intercepts severe self-harm / suicidal ideation before any LLM generation. |
| **Conversational Router** | `server/conversationRouter.ts` | **ACTIVE / REQUIRED** | Directs requests based on crisis status and emotional intensity, controlling whether RAG is engaged. |
| **Neon PostgreSQL Integration** | `server/db.ts` | **ACTIVE / REQUIRED** | Live connection to Neon PostgreSQL (`ep-nameless-voice-a15tew83-pooler.ap-southeast-1.aws.neon.tech`). |
| **pgvector RAG Engine** | `server/neonVectorRag.ts` | **ACTIVE / MIGRATION REQUIRED** | Stores 243 documents in Neon with 3072 dimensions (`gemini-embedding-001`). Requires migration to 768 dimensions for open-source embeddings. |
| **Local In-Memory RAG** | `server/ragEngine.ts` | **ACTIVE (KNOWLEDGE FALLBACK)** | Built-in clinical coping knowledge base (grounding techniques, breathing guides). Used when vector search is unneeded. |
| **Legacy Ollama Client** | `server/ollamaClient.ts` | **LEGACY / DUPLICATE** | Redundant single-file client replaced by modular `server/llm/selfHostedProvider.ts`. |
| **Android Client API** | `app/src/main/java/com/example/core/ApiConfig.kt` | **ACTIVE / REQUIRED** | Retrofit client pointing strictly to production Cloud Run URL (`https://ais-dev-...run.app/`). |
| **Datasets (V2)** | `backend/dataset/soultalk_dataset.json` | **ACTIVE / REQUIRED** | 1,139 structured multi-turn conversations across Roman Marathi, English, and Hinglish. |
| **Conversational Chains** | `backend/dataset/conversation_chains.json` | **DUPLICATE / REFERENCE** | Older JSON chains, subsumed into consolidated datasets. |
| **LoRA Model / Adapter** | Not present in root repository | **UNINITIALIZED** | No binary LoRA adapter checked in. A reproducible training pipeline with standardized chat template is required. |

---

## 3. Gemini Dependency Audit

| Instance | Location | Remediation Plan |
| :--- | :--- | :--- |
| `getGeminiClient()` | `server.ts` (lines 74–85) | Dead/unused in chat flow. Mark as LEGACY or remove entirely. |
| `GoogleGenAI` import in `server/llm/embeddingProvider.ts` | `server/llm/embeddingProvider.ts` (line 51) | Remove Gemini fallback. Replace with local/self-hosted 768-dim embedding provider. |
| Database vector column | Neon PostgreSQL `rag_documents.embedding vector(3072)` | Migrate schema to `vector(768)` for `multilingual-e5-base` / `bge-small-en-v1.5`. |

---

## 4. Target Architecture

```
Android App (Kotlin / Jetpack Compose)
       │ (HTTPS POST /api/chat/send)
       ▼
Cloud Run Backend (Node 20 / Express)
       ├── 1. Deterministic Safety Engine (<0.3ms crisis check)
       ├── 2. Conversational Router (Mode & RAG determination)
       ├── 3. Short/Long Term Memory Extraction (Neon PostgreSQL)
       ├── 4. Open-Source Vector Retrieval (pgvector 768-dim)
       ├── 5. Self-Hosted LLM Provider (Qwen 2.5 3B Instruct on independent VPS/GPU)
       ├── 6. Response Validation & Sanitization (Quality Guard)
       └── 7. Persistence & Delivery
```
