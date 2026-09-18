# SoulTalk Dataset V3 — Master Dataset Card & Quality Audit

## 1. Executive Summary
- **Total Clean Conversations:** 2,061
- **Total Clean Turns:** 10,922
- **User Messages:** 5,461
- **Assistant Messages:** 5,461
- **Average Turns Per Conversation:** 5.30
- **Average Assistant Message Length:** 15.3 words
- **Average User Message Length:** 9.3 words
- **Target Achieved:** Yes (Exceeded 10,000+ turn milestone with strict quality validation)

## 2. Dataset Partitioning (Zero-Leakage 80 / 10 / 10 Split)
| Partition | File Path | Conversations | Total Turns | Percentage |
|---|---|---|---|---|
| **Training** | `data/train.jsonl` | 1,648 | 8,666 | 80.0% |
| **Validation** | `data/val.jsonl` | 206 | 1,118 | 10.0% |
| **Testing** | `data/test.jsonl` | 207 | 1,138 | 10.0% |

- **Leakage Audit:** 0 overlapping IDs, 0 overlapping opening user prompts.

## 3. Language Breakdown
| Language | Conversations | Share (%) |
|---|---|---|
| Roman Marathi | 1,571 | 76.2% |
| Mixed Marathi Hindi | 280 | 13.6% |
| English | 133 | 6.5% |
| Mixed Marathi English | 57 | 2.8% |
| Hindi | 11 | 0.5% |
| Mixed Code Switching | 9 | 0.4% |

## 4. Category Breakdown (14 Categories)
| Category | Conversations | Share (%) | Description |
|---|---|---|---|
| `daily_life` | 975 | 47.3% | Multi-turn emotional companion scenario |
| `career_stress` | 272 | 13.2% | Multi-turn emotional companion scenario |
| `academic_pressure` | 201 | 9.8% | Multi-turn emotional companion scenario |
| `family` | 123 | 6.0% | Multi-turn emotional companion scenario |
| `relationships` | 82 | 4.0% | Multi-turn emotional companion scenario |
| `overthinking` | 67 | 3.3% | Multi-turn emotional companion scenario |
| `self_esteem` | 58 | 2.8% | Multi-turn emotional companion scenario |
| `loneliness` | 57 | 2.8% | Multi-turn emotional companion scenario |
| `social_anxiety` | 53 | 2.6% | Multi-turn emotional companion scenario |
| `grief_loss` | 47 | 2.3% | Multi-turn emotional companion scenario |
| `burnout` | 47 | 2.3% | Multi-turn emotional companion scenario |
| `health_anxiety` | 46 | 2.2% | Multi-turn emotional companion scenario |
| `crisis_safety` | 33 | 1.6% | Multi-turn emotional companion scenario |

## 5. Crisis & Safety Tagging
| Tag | Count | Action Protocol |
|---|---|---|
| `CRISIS_NONE` | 2,025 | Tele-MANAS (14416) & Kiran (1800-599-0019) safe guidance |
| `CRISIS_MEDIUM` | 18 | Tele-MANAS (14416) & Kiran (1800-599-0019) safe guidance |
| `CRISIS_LOW` | 10 | Tele-MANAS (14416) & Kiran (1800-599-0019) safe guidance |
| `CRISIS_HIGH` | 8 | Tele-MANAS (14416) & Kiran (1800-599-0019) safe guidance |

## 6. Strict Quality Gates Enforced
1. **Zero AI Slop & Disclaimers:** Completely removed phrases such as *"as an AI"*, *"I am a language model"*, *"I don't possess feelings"*.
2. **Removed Robotic Branding:** Stripped repetitive `"mi wolfie"` and generic greeting prefixes.
3. **Conversational Length Constraints:** Assistant responses calibrated to WhatsApp rhythm (15–45 words average), avoiding lecture-style monologues.
4. **Natural Roman Marathi Orthography:** Normalized spellings for common phonetic variants (`aahe`/`ahe`, `tula`/`tulaa`, `kay`/`kaay`, `khoop`/`khup`).
5. **Multi-Format Exports for Fine-Tuning:**
   - Standard SoulTalk schema: `data/soultalk_dataset_v3.jsonl`
   - ShareGPT format: `data/sharegpt_format.json`
   - Alpaca instruction format: `data/alpaca_format.json`

## 7. Sample Multi-Turn Record
```json
{
  "id": "soultalk_v3_000001",
  "topic": "daily_life",
  "crisis_tag": "CRISIS_NONE",
  "language": "mixed_marathi_hindi",
  "context_reference": null,
  "messages": [
    {
      "role": "user",
      "content": "yaar mi gharchya logana satisfy karayla khup kahi kela. thokloy."
    },
    {
      "role": "assistant",
      "content": "Thokloy - kahi specific trigger zala ka ya ek vel chi feeling aahe?"
    },
    {
      "role": "user",
      "content": "pattern aahe khup vel cha. kahi kela ki 'hya peksha te karayla hava hota'."
    },
    {
      "role": "assistant",
      "content": "'Hya peksha te' - goalpost always moves. He tuzya sathi khel nahi jhana. He exhausting pattern aahe."
    },
    {
      "role": "user",
      "content": "exhausted aahe mi genuinely."
    },
    {
      "role": "assistant",
      "content": "Aahe - te valid aahe. Continuously prove karat rahane thakavta. Tula swatahsathi kahi kela aahe lately?"
    }
  ]
}
```
