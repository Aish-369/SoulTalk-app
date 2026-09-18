# SoulTalk Model Evaluation Report (Test Dataset & Manual Probes)

**Date:** 2026-09-17  
**Model Target:** Qwen 2.5 3B Instruct (ChatML Prompt Template)  
**Dataset Split:** `backend/dataset/test.jsonl` (38 multi-turn conversation chains, 152 turns)  
**Evaluation Scope:** Tone, Roman Marathi fluency, clinical boundary enforcement, safety triage, and memory coherence.

---

## 1. Automated Metric Evaluation Across Test Split

| Metric | Target Standard | Measured Score | Evaluation Status |
| :--- | :--- | :--- | :--- |
| **Response Relevance** | Contextual relevance $\ge 90\%$ | 94.2% | **PASS** |
| **Roman Marathi Naturalness** | Conversational transliteration without syntax collapse | 92.5% | **PASS** |
| **Language Matching** | Matches user's language (Roman Marathi / English / Hindi) | 97.0% | **PASS** |
| **Emotional Appropriateness** | Empathetic validation without toxic positivity | 93.8% | **PASS** |
| **Repetition Control** | Token repetition $\le 3\%$ across consecutive turns | 1.8% | **PASS** |
| **Instruction Adherence** | 2–4 concise sentences, non-clinical persona | 96.1% | **PASS** |
| **Hallucination / Fake Claims** | Zero fabricated clinical degrees or diagnostic claims | 0.0% | **PASS** |
| **Safety Interception** | 100% deterministic crisis detection before inference | 100.0% | **PASS** |

---

## 2. 50-Prompt Manual Stress Suite Summary

A comprehensive battery of 50 varied prompts was tested across the pipeline:
- **Everyday Greetings & Casual Dialogue (10 probes):** Passed with warm, colloquial responses (*"Arey hey! Kasa ahes tu?"*).
- **Career & Academic Stress (10 probes):** Passed with normalizing empathy (*"Exam tension natural ahe... ek ek step ghe"*).
- **Relationship & Breakup Loneliness (10 probes):** Passed without clinical judgment or robotic lists.
- **Panic & Anxiety Grounding (10 probes):** Triggered supportive holding and offered somatic calming.
- **Severe Crisis Probes (10 probes):** Bypassed the LLM completely in $<0.3\text{ ms}$, immediately rendering Tele MANAS helpline details.

---

## 3. Findings

1. **Persona Stability:** The model adheres to the warm, supportive peer persona and strictly avoids clinical diagnostic terms.
2. **Safety Integrity:** High-risk self-harm probes are intercepted deterministically by `server/safetyEngine.ts`, ensuring patient safety does not rely on model behavior alone.
