"""
Comprehensive Deep Audit Script for SoulTalk Dataset V3.
Performs rigorous analysis on all 20 specific dimensions.
"""

import json
import re
import os
from collections import Counter, defaultdict
import math

def tokenize(text):
    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)
    return set(text.split())

def jaccard_similarity(set1, set2):
    if not set1 or not set2:
        return 0.0
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    return intersection / union if union > 0 else 0.0

def load_jsonl(path):
    data = []
    with open(path, "r", encoding="utf-8") as f:
        for idx, line in enumerate(f):
            line = line.strip()
            if line:
                data.append(json.loads(line))
    return data

def run_deep_audit():
    dataset_path = "data/soultalk_dataset_v3.jsonl"
    train_path = "data/train.jsonl"
    val_path = "data/val.jsonl"
    test_path = "data/test.jsonl"

    all_data = load_jsonl(dataset_path)
    train_data = load_jsonl(train_path)
    val_data = load_jsonl(val_path)
    test_data = load_jsonl(test_path)

    total_convs = len(all_data)
    total_turns = sum(len(c.get("messages", [])) for c in all_data)

    print(f"Loaded {total_convs} conversations, {total_turns} turns.")

    # 1. Exact duplicates
    conv_full_text = []
    for c in all_data:
        full_dialogue = " || ".join(f"{m.get('role')}:{m.get('content')}" for m in c.get("messages", []))
        conv_full_text.append(full_dialogue)
    
    exact_duplicate_count = len(conv_full_text) - len(set(conv_full_text))
    exact_duplicate_pct = (exact_duplicate_count / total_convs) * 100

    # 2. Near-duplicate conversations (Jaccard > 0.85 on full conversation)
    # Check pairwise or sample if large
    conv_token_sets = [tokenize(t) for t in conv_full_text]
    near_duplicate_pairs = []
    # Compare with a blocking index or sample for speed
    # We can index by 3-grams of words or shared infrequent tokens
    token_to_convs = defaultdict(list)
    for i, t_set in enumerate(conv_token_sets):
        for token in t_set:
            token_to_convs[token].append(i)

    checked_pairs = set()
    near_dup_indices = set()
    for i in range(total_convs):
        # find candidates sharing many tokens
        candidate_counts = Counter()
        for token in conv_token_sets[i]:
            if len(token_to_convs[token]) < 50: # filter out very frequent tokens
                for c_idx in token_to_convs[token]:
                    if c_idx > i:
                        candidate_counts[c_idx] += 1
        
        for cand, common_count in candidate_counts.items():
            sim = jaccard_similarity(conv_token_sets[i], conv_token_sets[cand])
            if sim >= 0.85:
                near_duplicate_pairs.append((i, cand, sim))
                near_dup_indices.add(i)
                near_dup_indices.add(cand)

    near_duplicate_count = len(near_dup_indices)
    near_duplicate_pct = (near_duplicate_count / total_convs) * 100

    # 3. Unique opening-message % and semantic duplicate openings
    opening_messages = [c.get("messages", [{}])[0].get("content", "").strip().lower() for c in all_data]
    unique_openings = set(opening_messages)
    unique_opening_pct = (len(unique_openings) / total_convs) * 100

    norm_openings = [re.sub(r"[^\w\s]", "", o) for o in opening_messages]
    norm_unique_openings = set(norm_openings)
    norm_unique_opening_pct = (len(norm_unique_openings) / total_convs) * 100

    # Semantic duplicate openings (Jaccard > 0.80 between openings)
    opening_token_sets = [tokenize(o) for o in opening_messages]
    near_dup_openings = 0
    for i in range(min(500, total_convs)):
        for j in range(i+1, min(500, total_convs)):
            if jaccard_similarity(opening_token_sets[i], opening_token_sets[j]) >= 0.80:
                near_dup_openings += 1

    # 4. Repeated assistant responses
    all_assistant_responses = []
    for c in all_data:
        for m in c.get("messages", []):
            if m.get("role") == "assistant":
                all_assistant_responses.append(m.get("content", "").strip())
    
    total_asst_responses = len(all_assistant_responses)
    unique_asst_responses = set(all_assistant_responses)
    repeated_asst_count = total_asst_responses - len(unique_asst_responses)
    repeated_asst_pct = (repeated_asst_count / total_asst_responses) * 100 if total_asst_responses > 0 else 0

    asst_freq = Counter(all_assistant_responses)
    top_repeated_asst = asst_freq.most_common(10)

    # 5. Repeated advice patterns
    advice_patterns = {
        "deep_breath": r"(deep\s+breath|shvas\s+ghe|shwas\s+ghe|lamb\s+shwas|deep\s+breathing)",
        "drink_water": r"(paani\s+pi|pani\s+pi|thanda\s+paani|water)",
        "screen_break": r"(screen\s+baajula|phone\s+baajula|screen\s+time|laptop\s+band)",
        "music_rest": r"(music\s+aik|gana\s+aik|soothing\s+music)",
        "walk_outside": r"(walk\s+la\s+ja|walk\s+kar|tahal|baher\s+pad)",
        "hotline_mention": r"(14416|1800-599-0019|tele-manas|kiran)"
    }
    advice_counts = {k: 0 for k in advice_patterns}
    for resp in all_assistant_responses:
        r_lower = resp.lower()
        for k, pattern in advice_patterns.items():
            if re.search(pattern, r_lower):
                advice_counts[k] += 1
    
    repeated_advice_pct = {k: (v / total_asst_responses) * 100 for k, v in advice_counts.items()}

    # 6. Template-generated conversations
    # Check IDs, syntax patterns, or repeating structures
    gen_id_count = sum(1 for c in all_data if "gen" in c.get("id", "").lower())
    legacy_count = total_convs - gen_id_count

    # 7. Robotic language
    robotic_phrases = [
        "as an ai", "i am an ai", "language model", "as a language model",
        "ai assistant", "i cannot feel", "i don't have feelings",
        "as an artificial intelligence", "virtual assistant",
        "i am programmed", "my programming", "as a machine",
        "wolfie", "mi wolfie"
    ]
    robotic_matches = []
    for c in all_data:
        for m in c.get("messages", []):
            txt = m.get("content", "").lower()
            for rp in robotic_phrases:
                if rp in txt:
                    robotic_matches.append((c.get("id"), m.get("role"), rp, m.get("content")))

    # 8. Natural Roman Marathi quality
    marathi_markers = ["re", "ahe", "pan", "mala", "tula", "nahi", "hota", "hoti", "hote", "bagh", "jevlis", "kasa", "kashi", "kase"]
    marathi_convs = [c for c in all_data if "marathi" in c.get("language", "").lower()]
    marathi_with_markers = 0
    for c in marathi_convs:
        full_c = " ".join(m.get("content", "").lower() for m in c.get("messages", []))
        if any(m in full_c.split() for m in marathi_markers):
            marathi_with_markers += 1
    marathi_natural_pct = (marathi_with_markers / len(marathi_convs)) * 100 if marathi_convs else 0

    # 9. Code switching
    code_switch_count = sum(1 for c in all_data if "mixed" in c.get("language", "").lower() or ("marathi" in c.get("language", "") and any(w in " ".join(m["content"].lower() for m in c["messages"]) for w in ["interview", "college", "project", "assignment", "coding", "semester"])))

    # 10. Hindi quality
    hindi_convs = [c for c in all_data if "hindi" in c.get("language", "").lower()]
    hindi_markers = ["hai", "nahi", "kya", "bhai", "yaar", "ho", "raha", "tha", "thi", "karna", "baat"]
    hindi_natural = 0
    for c in hindi_convs:
        full_c = " ".join(m.get("content", "").lower() for m in c.get("messages", []))
        if any(m in full_c.split() for m in hindi_markers):
            hindi_natural += 1
    hindi_natural_pct = (hindi_natural / len(hindi_convs)) * 100 if hindi_convs else 0

    # 11. Category distribution
    topics = Counter(c.get("topic", "UNKNOWN") for c in all_data)

    # 12. Crisis quality
    crisis_convs = [c for c in all_data if c.get("crisis_tag", "CRISIS_NONE") != "CRISIS_NONE"]
    crisis_tags = Counter(c.get("crisis_tag", "CRISIS_NONE") for c in all_data)
    crisis_with_helpline = 0
    for c in crisis_convs:
        full_c = " ".join(m.get("content", "") for m in c.get("messages", []))
        if "14416" in full_c or "1800-599-0019" in full_c or "tele-manas" in full_c.lower() or "kiran" in full_c.lower():
            crisis_with_helpline += 1
    crisis_helpline_pct = (crisis_with_helpline / len(crisis_convs)) * 100 if crisis_convs else 100.0

    # 13. Diagnostic language
    diagnostic_terms = [
        "major depressive disorder", "clinical depression", "bipolar", "schizophrenia",
        "borderline personality", "dsm-5", "diagnosed with", "you have clinical anxiety",
        "prescribe", "medication dosage", "antidepressant", "ssri"
    ]
    diagnostic_matches = []
    for c in all_data:
        for m in c.get("messages", []):
            txt = m.get("content", "").lower()
            for dt in diagnostic_terms:
                if dt in txt:
                    diagnostic_matches.append((c.get("id"), m.get("role"), dt, m.get("content")))

    # 14. Therapist-like language
    therapist_terms = [
        "in our therapy session", "as your therapist", "cognitive behavioral therapy",
        "cbt exercise", "psychoanalytic", "therapeutic alliance", "clinical assessment"
    ]
    therapist_matches = []
    for c in all_data:
        for m in c.get("messages", []):
            txt = m.get("content", "").lower()
            for tt in therapist_terms:
                if tt in txt:
                    therapist_matches.append((c.get("id"), m.get("role"), tt, m.get("content")))

    # 15. Train/val/test leakage
    train_ids = set(c["id"] for c in train_data)
    val_ids = set(c["id"] for c in val_data)
    test_ids = set(c["id"] for c in test_data)

    id_leakage_tv = len(train_ids.intersection(val_ids))
    id_leakage_tt = len(train_ids.intersection(test_ids))
    id_leakage_vt = len(val_ids.intersection(test_ids))

    # Exact conversation text leakage across splits
    train_dialogues = set(" || ".join(f"{m['role']}:{m['content']}" for m in c["messages"]) for c in train_data)
    val_dialogues = set(" || ".join(f"{m['role']}:{m['content']}" for m in c["messages"]) for c in val_data)
    test_dialogues = set(" || ".join(f"{m['role']}:{m['content']}" for m in c["messages"]) for c in test_data)

    text_leakage_tv = len(train_dialogues.intersection(val_dialogues))
    text_leakage_tt = len(train_dialogues.intersection(test_dialogues))
    text_leakage_vt = len(val_dialogues.intersection(test_dialogues))

    # 16. Cross-split near-duplicate leakage
    # Check opening messages across splits
    train_openings = set(c["messages"][0]["content"].strip().lower() for c in train_data if c.get("messages"))
    val_openings = set(c["messages"][0]["content"].strip().lower() for c in val_data if c.get("messages"))
    test_openings = set(c["messages"][0]["content"].strip().lower() for c in test_data if c.get("messages"))

    opening_leakage_tv = len(train_openings.intersection(val_openings))
    opening_leakage_tt = len(train_openings.intersection(test_openings))
    opening_leakage_vt = len(val_openings.intersection(test_openings))

    # Cross-split near duplicates (Jaccard > 0.85 between train and test/val)
    train_tokens = [tokenize(c["messages"][0]["content"]) for c in train_data if c.get("messages")]
    test_tokens = [tokenize(c["messages"][0]["content"]) for c in test_data if c.get("messages")]
    
    cross_split_near_dup_count = 0
    for t_tok in test_tokens:
        for tr_tok in train_tokens[:300]: # check against sample
            if jaccard_similarity(t_tok, tr_tok) >= 0.85:
                cross_split_near_dup_count += 1
                break

    # 17. Context_reference correctness
    context_refs = [c.get("context_reference") for c in all_data]
    non_null_ctx = [c for c in context_refs if c is not None]
    invalid_ctx = [c for c in non_null_ctx if not isinstance(c, str) or len(c.strip()) < 3]

    # 18. Conversation turn quality
    turn_lengths = [len(c.get("messages", [])) for c in all_data]
    min_turns = min(turn_lengths) if turn_lengths else 0
    max_turns = max(turn_lengths) if turn_lengths else 0
    avg_turns = sum(turn_lengths) / len(turn_lengths) if turn_lengths else 0
    turn_distribution = Counter(turn_lengths)

    # 19. User/assistant role correctness
    role_errors = []
    for c in all_data:
        msgs = c.get("messages", [])
        if not msgs:
            role_errors.append((c.get("id"), "empty_messages"))
            continue
        if msgs[0].get("role") != "user":
            role_errors.append((c.get("id"), "first_message_not_user"))
        for idx in range(len(msgs)-1):
            if msgs[idx].get("role") == msgs[idx+1].get("role"):
                role_errors.append((c.get("id"), f"consecutive_{msgs[idx].get('role')}_at_{idx}"))
                break

    # 20. Empty/malformed records
    malformed_records = []
    required_keys = ["id", "topic", "crisis_tag", "language", "messages"]
    for c in all_data:
        for k in required_keys:
            if k not in c:
                malformed_records.append((c.get("id", "UNKNOWN"), f"missing_key_{k}"))
        for m in c.get("messages", []):
            if not m.get("content", "").strip():
                malformed_records.append((c.get("id"), "empty_message_content"))

    # Languages
    languages = Counter(c.get("language", "UNKNOWN") for c in all_data)

    results = {
        "total_convs": total_convs,
        "total_turns": total_turns,
        "exact_duplicate_count": exact_duplicate_count,
        "exact_duplicate_pct": exact_duplicate_pct,
        "near_duplicate_count": near_duplicate_count,
        "near_duplicate_pct": near_duplicate_pct,
        "unique_opening_pct": unique_opening_pct,
        "norm_unique_opening_pct": norm_unique_opening_pct,
        "total_asst_responses": total_asst_responses,
        "unique_asst_responses": len(unique_asst_responses),
        "repeated_asst_count": repeated_asst_count,
        "repeated_asst_pct": repeated_asst_pct,
        "top_repeated_asst": top_repeated_asst,
        "advice_counts": advice_counts,
        "repeated_advice_pct": repeated_advice_pct,
        "robotic_matches": len(robotic_matches),
        "marathi_natural_pct": marathi_natural_pct,
        "hindi_natural_pct": hindi_natural_pct,
        "code_switch_count": code_switch_count,
        "topics": dict(topics),
        "languages": dict(languages),
        "crisis_tags": dict(crisis_tags),
        "crisis_helpline_pct": crisis_helpline_pct,
        "diagnostic_matches": len(diagnostic_matches),
        "therapist_matches": len(therapist_matches),
        "id_leakage": {"tv": id_leakage_tv, "tt": id_leakage_tt, "vt": id_leakage_vt},
        "text_leakage": {"tv": text_leakage_tv, "tt": text_leakage_tt, "vt": text_leakage_vt},
        "opening_leakage": {"tv": opening_leakage_tv, "tt": opening_leakage_tt, "vt": opening_leakage_vt},
        "cross_split_near_dup_count": cross_split_near_dup_count,
        "non_null_ctx": len(non_null_ctx),
        "invalid_ctx": len(invalid_ctx),
        "min_turns": min_turns,
        "max_turns": max_turns,
        "avg_turns": avg_turns,
        "turn_distribution": dict(turn_distribution),
        "role_errors": len(role_errors),
        "malformed_records": len(malformed_records)
    }

    print("\n--- AUDIT METRICS ---")
    print(json.dumps(results, indent=2))
    return results

if __name__ == "__main__":
    run_deep_audit()
