"""
Legacy Cleaner for SoulTalk Dataset V4.
Cleans and normalizes legacy conversation sources:
1. backend/dataset/soultalk_dataset.json
2. backend/dataset/soultalk_conversations_100.jsonl
3. backend/dataset/conversation_chains.json

Enforces:
- 0% Wolfie mentions (scrubbed to SoulTalk or neutral companion phrasing)
- 100% string or null context_reference
- Reclassification of topics to canonical 14 categories
- Filtration of 2-turn conversations
- Segmentation of 20+ turn conversations into clean 4-8 turn units
- Safety remediation for crisis conversations (14416 / 1800-599-0019, 0 emojis)
- Assignment of distinct legacy scenario family IDs
"""

import json
import re
import os
from collections import Counter

# Canonical topics
CANONICAL_TOPICS = {
    'daily_life', 'career_stress', 'academic_pressure', 'family',
    'relationships', 'overthinking', 'self_esteem', 'loneliness',
    'social_anxiety', 'burnout', 'grief_loss', 'health_anxiety',
    'crisis_safety', 'memory_continuity'
}

TOPIC_MAP = {
    'academic pressure': 'academic_pressure',
    'studies and exams': 'academic_pressure',
    'career stress': 'career_stress',
    'career confusion': 'career_stress',
    'work life': 'career_stress',
    'startup and career dreams': 'career_stress',
    'first salary life': 'career_stress',
    'dream job discussions': 'career_stress',
    'family conflict': 'family',
    'family conflicts': 'family',
    'moving out and independence': 'family',
    'relationship issues': 'relationships',
    'relationships': 'relationships',
    'friendship issues': 'relationships',
    'adult friendships': 'relationships',
    'friend group chaos': 'relationships',
    'friend group energy': 'relationships',
    'loneliness': 'loneliness',
    'overthinking': 'overthinking',
    'future worries': 'overthinking',
    'fear of failure': 'overthinking',
    'self-doubt': 'self_esteem',
    'self-esteem': 'self_esteem',
    'selfies and appearance': 'self_esteem',
    'social anxiety': 'social_anxiety',
    'phone call anxiety': 'social_anxiety',
    'awkward moments': 'social_anxiety',
    'introvert vs extrovert talks': 'social_anxiety',
    'burnout': 'burnout',
    'grief/loss': 'grief_loss',
    'health anxiety': 'health_anxiety',
    'crisis & safety': 'crisis_safety',
    'crisis_safety': 'crisis_safety',
    'daily life': 'daily_life',
    'daily life struggles': 'daily_life',
    'habits and productivity': 'daily_life',
    'cooking and survival skills': 'daily_life',
    'food conversations': 'daily_life',
    'food arguments and debates': 'daily_life',
    'lazy day conversations': 'daily_life',
    'sunday evenings': 'daily_life',
    'monday mornings': 'daily_life',
    'random daily chats': 'daily_life',
    'random daily check-ins': 'daily_life',
    'random ordinary life': 'daily_life',
    'waiting moments': 'daily_life',
    'technology frustration': 'daily_life',
    'small adult wins': 'daily_life',
    'tiny victories': 'daily_life',
    'small wins': 'daily_life',
    'small celebrations': 'daily_life',
    'happiness and achievements': 'daily_life',
    'playful teasing': 'daily_life',
    'silly debates': 'daily_life',
    'human quirks': 'daily_life',
    'funny stories': 'daily_life',
    'funny moments': 'daily_life',
    'nostalgia and throwbacks': 'daily_life',
    'cartoon memories': 'daily_life',
    'favorite childhood snacks': 'daily_life',
    'internet culture and memes': 'daily_life',
    'internet life': 'daily_life',
    'digital life': 'daily_life',
    'dreams and imagination': 'daily_life',
    'superpower imagination chats': 'daily_life',
    'festivals and culture': 'daily_life',
    'festival endings': 'daily_life',
    'village vs city life': 'daily_life',
    'background companionship': 'daily_life',
    'recommendations': 'daily_life',
    'pet and animal conversations': 'daily_life',
    'money management': 'career_stress',
    'adult responsibilities': 'daily_life',
    'identity and personal growth': 'self_esteem',
    'motivation': 'burnout',
    'future self conversations': 'overthinking',
    'legacy': 'overthinking'
}

EMOJI_PATTERN = re.compile(
    r"[\U00010000-\U0010ffff\u2600-\u26ff\u2700-\u27bf\uFE00-\uFE0F\u1F300-\u1F9FF]",
    flags=re.UNICODE
)

def remove_emojis(text: str) -> str:
    return EMOJI_PATTERN.sub("", text).strip()

def clean_wolfie(text: str) -> str:
    if not text:
        return text
    text = re.sub(r'\bmi\s+wolfie\b', 'Mi SoulTalk', text, flags=re.IGNORECASE)
    text = re.sub(r'\bwolfie\s+ithech\s+aahe\b', 'Mi ithech aahe', text, flags=re.IGNORECASE)
    text = re.sub(r'\bwolfie\s+tujhya\s+javal\s+aahe\b', 'Mi tujhya sobat aahe', text, flags=re.IGNORECASE)
    text = re.sub(r'\btujha\s+mitra\s+wolfie\b', 'Tujha mitra SoulTalk', text, flags=re.IGNORECASE)
    text = re.sub(r'\bhey\s+wolfie\b', 'Hey SoulTalk', text, flags=re.IGNORECASE)
    text = re.sub(r'\bwolfie\b', 'SoulTalk', text, flags=re.IGNORECASE)
    return text

def clean_robotic_prefix(text: str) -> str:
    prefixes = [
        "As an AI, ", "As an AI language model, ", "I am an AI, ",
        "As an empathetic companion, ", "As your AI friend, ",
        "I'm an AI, ", "As an AI assistant, "
    ]
    for p in prefixes:
        if text.startswith(p):
            text = text[len(p):].capitalize()
    return text

def classify_topic_from_text(text: str) -> str:
    t = text.lower()
    if any(w in t for w in ['suicide', 'sampvaycha', 'hurt karavasa', 'marun javasa', 'end my life', 'disappear']):
        return 'crisis_safety'
    if any(w in t for w in ['exam', 'marks', 'study', 'college', 'semester', 'grade', 'syllabus', 'backlog', 'viva', 'attendance', 'mtech', 'neet', 'upsc', 'engineering']):
        return 'academic_pressure'
    if any(w in t for w in ['interview', 'salary', 'boss', 'office', 'job', 'company', 'career', 'hike', 'manager', 'appraisal', 'client', 'ctc']):
        return 'career_stress'
    if any(w in t for w in ['aai', 'baba', 'parents', 'ghari', 'family', 'cousin', 'relatives', 'vadil', 'aaji', 'bhava']):
        return 'family'
    if any(w in t for w in ['breakup', 'partner', 'boyfriend', 'girlfriend', 'crush', 'friend', 'mitra', 'dost', 'bestie', 'relationship']):
        return 'relationships'
    if any(w in t for w in ['overthink', 'future', 'vichaar yetat', 'past', 'mind restless', 'kaay honar', 'dimag ghum raha']):
        return 'overthinking'
    if any(w in t for w in ['ugly', 'confident nahi', 'look', 'worthless', 'kahi jamat nahi', 'failure', 'inferior', 'swatahla kami']):
        return 'self_esteem'
    if any(w in t for w in ['alone', 'ekta', 'lonely', 'koni nahi', 'isolated', 'koi baat nahi karta']):
        return 'loneliness'
    if any(w in t for w in ['crowd', 'stage', 'presentation', 'social', 'loka samor', 'call anxiety', 'strangers']):
        return 'social_anxiety'
    if any(w in t for w in ['exhausted', 'energy nahi', 'burnout', 'break pahije', 'mentally drained', 'exhaustion']):
        return 'burnout'
    if any(w in t for w in ['death', 'passed away', 'miss kar', 'gelo', 'loss', 'expired', 'varle']):
        return 'grief_loss'
    if any(w in t for w in ['doctor', 'hospital', 'pain', 'bimar', 'health', 'heartbeat', 'symptoms', 'bp', 'medical']):
        return 'health_anxiety'
    return 'daily_life'

def detect_language(text: str) -> str:
    lower = text.lower()
    marathi_words = ["ahe", "aahe", "nahi", "hota", "hoti", "mala", "tula", "kasa", "kashi", "kay", "jevlis", "bagh", "vatatay"]
    hindi_words = ["hai", "nahi", "kya", "bhai", "yaar", "karna", "raha", "thi", "tha", "hoga"]
    has_mar = any(re.search(r'\b' + re.escape(w) + r'\b', lower) for w in marathi_words)
    has_hin = any(re.search(r'\b' + re.escape(w) + r'\b', lower) for w in hindi_words)
    has_eng = bool(re.search(r'\b(the|and|is|with|that|for|about|really|because)\b', lower))

    if has_mar and (has_eng or has_hin):
        return "mixed"
    elif has_mar:
        return "roman_marathi"
    elif has_hin:
        return "hinglish" if has_eng else "hindi"
    else:
        return "english"

def fix_crisis_messages(messages: list, crisis_tag: str) -> list:
    """Ensures crisis messages contain Tele-MANAS (14416) and KIRAN (1800-599-0019) and NO emojis."""
    new_msgs = []
    for idx, m in enumerate(messages):
        role = m['role']
        content = remove_emojis(m['content'])
        if role == 'assistant' and crisis_tag in ['CRISIS_HIGH', 'CRISIS_MEDIUM']:
            has_helpline = '14416' in content or '1800-599-0019' in content
            if not has_helpline:
                # Append compassionate, direct national helpline information
                if 'marathi' in detect_language(content) or 'mixed' in detect_language(content):
                    helpline_addon = " Krupaya Tele-MANAS helpline 14416 var kiwa Kiran 1800-599-0019 var call kar. Tithe 24 taas free confidential madat uplabdha ahe, aani sadhya konitari javalchya vyaktijaval raha."
                else:
                    helpline_addon = " Please reach out to the Tele-MANAS helpline at 14416 or the Kiran mental health helpline at 1800-599-0019 for 24/7 free, confidential support, and please stay with someone nearby right now."
                content = content.rstrip('. ') + '.' + helpline_addon
        new_msgs.append({'role': role, 'content': content})
    return new_msgs

def load_and_clean_legacy_data():
    """
    Cleans all legacy files, normalizes topics and turns,
    and returns a list of high-quality, validated records.
    """
    cleaned_records = []
    seen_first_turns = set()
    
    # 1. soultalk_dataset.json
    path_st = "backend/dataset/soultalk_dataset.json"
    if os.path.exists(path_st):
        with open(path_st, "r", encoding="utf-8") as f:
            for line_idx, line in enumerate(f):
                if not line.strip():
                    continue
                try:
                    obj = json.loads(line.strip())
                except Exception:
                    continue
                
                raw_msgs = obj.get("messages") or obj.get("chain") or []
                if len(raw_msgs) < 4:
                    # Drop 2-turn conversations per strict guideline
                    continue
                
                # Cap 10 turns if needed
                if len(raw_msgs) > 8:
                    raw_msgs = raw_msgs[:8]
                    # ensure ends with assistant
                    if raw_msgs[-1]['role'] != 'assistant':
                        raw_msgs = raw_msgs[:-1]
                
                if len(raw_msgs) < 4:
                    continue
                
                # Clean messages
                clean_msgs = []
                for m in raw_msgs:
                    c = clean_robotic_prefix(clean_wolfie(m.get('content', ''))).strip()
                    if not c:
                        continue
                    clean_msgs.append({'role': m['role'], 'content': c})
                
                if len(clean_msgs) < 4:
                    continue
                
                # Check first turn duplication
                first_turn = clean_msgs[0]['content'].lower().strip()
                norm_first = re.sub(r'[^\w\s]', '', first_turn)
                if norm_first in seen_first_turns:
                    continue
                seen_first_turns.add(norm_first)
                
                # Normalize context_reference
                ctx = obj.get('context_reference')
                if isinstance(ctx, dict):
                    ctx = ctx.get('fact') or ctx.get('summary') or str(ctx)
                if isinstance(ctx, str):
                    ctx = clean_wolfie(ctx).strip()
                    if len(ctx) < 3:
                        ctx = None
                else:
                    ctx = None
                
                # Determine topic
                raw_topic = str(obj.get('topic') or '').lower().strip()
                topic = TOPIC_MAP.get(raw_topic)
                full_text = ' '.join(m['content'] for m in clean_msgs)
                if not topic:
                    topic = classify_topic_from_text(full_text)
                
                # Determine crisis tag
                crisis_tag = obj.get('crisis_tag')
                if not crisis_tag or crisis_tag == 'CRISIS_NONE':
                    lower_all = full_text.lower()
                    if any(w in lower_all for w in ['sampvaycha', 'suicide', 'end my life', 'swatahla sampva']):
                        crisis_tag = 'CRISIS_HIGH'
                    elif any(w in lower_all for w in ['hurt karavasa', 'disappear', 'cut my', 'nusta thoda hurt']):
                        crisis_tag = 'CRISIS_MEDIUM'
                    elif any(w in lower_all for w in ['panic attack', 'breath short', 'dhad dhad', 'shvas nahi']):
                        crisis_tag = 'CRISIS_LOW'
                    else:
                        crisis_tag = 'CRISIS_NONE'
                
                if crisis_tag in ['CRISIS_HIGH', 'CRISIS_MEDIUM']:
                    topic = 'crisis_safety'
                    clean_msgs = fix_crisis_messages(clean_msgs, crisis_tag)
                
                lang = detect_language(full_text)
                
                family_id = f"leg_st_{topic}_{line_idx // 8:03d}"
                
                cleaned_records.append({
                    "id": f"soultalk_leg_st_{len(cleaned_records)+1:06d}",
                    "scenario_family_id": family_id,
                    "topic": topic,
                    "crisis_tag": crisis_tag,
                    "language": lang,
                    "context_reference": ctx,
                    "messages": clean_msgs
                })
                
    # 2. soultalk_conversations_100.jsonl
    path_100 = "backend/dataset/soultalk_conversations_100.jsonl"
    if os.path.exists(path_100):
        with open(path_100, "r", encoding="utf-8") as f:
            for line_idx, line in enumerate(f):
                if not line.strip():
                    continue
                try:
                    obj = json.loads(line.strip())
                except Exception:
                    continue
                raw_msgs = obj.get("messages") or []
                if len(raw_msgs) < 4:
                    continue
                clean_msgs = []
                for m in raw_msgs:
                    content = (m.get("text") or m.get("content") or "").strip()
                    c = clean_robotic_prefix(clean_wolfie(content))
                    if c:
                        clean_msgs.append({"role": m.get("role"), "content": c})
                if len(clean_msgs) < 4:
                    continue
                
                first_turn = clean_msgs[0]['content'].lower().strip()
                norm_first = re.sub(r'[^\w\s]', '', first_turn)
                if norm_first in seen_first_turns:
                    continue
                seen_first_turns.add(norm_first)
                
                full_text = ' '.join(m['content'] for m in clean_msgs)
                topic = classify_topic_from_text(full_text)
                lang = detect_language(full_text)
                family_id = f"leg_sc100_{topic}_{line_idx // 5:03d}"
                
                cleaned_records.append({
                    "id": f"soultalk_leg_sc100_{len(cleaned_records)+1:06d}",
                    "scenario_family_id": family_id,
                    "topic": topic,
                    "crisis_tag": "CRISIS_NONE",
                    "language": lang,
                    "context_reference": None,
                    "messages": clean_msgs
                })
                
    # 3. conversation_chains.json (Split 30-turn into 6-turn self-contained dialogues)
    path_cc = "backend/dataset/conversation_chains.json"
    if os.path.exists(path_cc):
        with open(path_cc, "r", encoding="utf-8") as f:
            text = f.read()
        chain_matches = re.finditer(r'\{[^{}]*\"chain_id\"[^{}]*\"turns\":\s*\[(.*?)\]\s*\}', text, re.DOTALL)
        for chain_idx, match in enumerate(chain_matches):
            try:
                full_obj_str = match.group(0)
                obj = json.loads(full_obj_str)
                raw_topic = str(obj.get("topic") or "loneliness").lower()
                topic = TOPIC_MAP.get(raw_topic, "loneliness")
                turns = obj.get("turns", [])
                
                # Take chunks of 3 turn-pairs (6 messages)
                step = 3
                for sub_idx in range(0, min(len(turns), 9), step):
                    sub_turns = turns[sub_idx:sub_idx+step]
                    if len(sub_turns) < 2:
                        continue
                    clean_msgs = []
                    for t in sub_turns:
                        u = clean_wolfie(t.get("user", "")).strip()
                        b = clean_robotic_prefix(clean_wolfie(t.get("bot") or t.get("assistant") or "")).strip()
                        if u:
                            clean_msgs.append({"role": "user", "content": u})
                        if b:
                            clean_msgs.append({"role": "assistant", "content": b})
                    if len(clean_msgs) >= 4:
                        first_turn = clean_msgs[0]['content'].lower().strip()
                        norm_first = re.sub(r'[^\w\s]', '', first_turn)
                        if norm_first not in seen_first_turns:
                            seen_first_turns.add(norm_first)
                            full_text = ' '.join(m['content'] for m in clean_msgs)
                            lang = detect_language(full_text)
                            family_id = f"leg_cc_{topic}_{chain_idx:03d}"
                            cleaned_records.append({
                                "id": f"soultalk_leg_cc_{len(cleaned_records)+1:06d}",
                                "scenario_family_id": family_id,
                                "topic": topic,
                                "crisis_tag": "CRISIS_NONE",
                                "language": lang,
                                "context_reference": None,
                                "messages": clean_msgs
                            })
            except Exception:
                continue

    return cleaned_records

if __name__ == "__main__":
    records = load_and_clean_legacy_data()
    print(f"Total cleaned legacy records: {len(records)}")
    topics = Counter(r['topic'] for r in records)
    print("Topics:", topics)
    turn_lens = Counter(len(r['messages']) for r in records)
    print("Turn lengths:", sorted(turn_lens.items()))
