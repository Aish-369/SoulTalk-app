import json
import re
import os

ROBOTIC_PREFIXES = [
    r"^mi wolfie,?\s*",
    r"^wolfie ithe aahe,?\s*",
    r"^wolfie aahe mi,?\s*",
    r"^he mi, wolfie,?\s*",
    r"^tujha mitra wolfie ithe aahe,?\s*",
    r"^tujha mitra wolfie,?\s*",
    r"^hello, mi wolfie,?\s*",
    r"^hey, mi wolfie,?\s*",
    r"^wolfie here,?\s*",
    r"^i am wolfie,?\s*"
]

TOPIC_MAP = {
    "daily life": "daily_life",
    "daily life struggles": "daily_life",
    "random daily check-ins": "daily_life",
    "funny stories": "daily_life",
    "food conversations": "daily_life",
    "small wins": "daily_life",
    "lazy day conversations": "daily_life",
    "nostalgia and throwbacks": "daily_life",
    "friend group chaos": "daily_life",
    "silly debates": "daily_life",
    "comfort food conversations": "daily_life",
    "random ordinary life": "daily_life",
    "food arguments and debates": "daily_life",
    "internet culture and memes": "daily_life",
    "internet life": "daily_life",
    "pet and animal conversations": "daily_life",
    "human quirks": "daily_life",
    "festivals and culture": "daily_life",
    "dreams and imagination": "daily_life",
    "childhood memories": "daily_life",
    "school life nostalgia": "daily_life",
    "summer vacation memories": "daily_life",
    "cartoon memories": "daily_life",
    "favorite teacher memories": "daily_life",
    "superpower imagination chats": "daily_life",
    "alternate life scenarios": "daily_life",
    "introvert vs extrovert talks": "daily_life",
    "hidden talents": "daily_life",
    "weird habits": "daily_life",
    "guilty pleasures": "daily_life",
    "favorite smells and nostalgia": "daily_life",
    "comfort songs": "daily_life",
    "comfort places": "daily_life",
    "small fears": "daily_life",
    "dream house discussions": "daily_life",
    "village vs city life": "daily_life",
    "if today became a movie": "daily_life",
    "if money wasnt a problem": "daily_life",
    "dream travel destination": "daily_life",
    "secret hobbies": "daily_life",
    "favorite childhood snacks": "daily_life",
    "things nobody knows about me": "daily_life",
    "small celebrations": "daily_life",
    "random daily chats": "daily_life",
    "playful teasing": "daily_life",
    "funny moments": "daily_life",
    "waiting moments": "daily_life",
    "technology frustration": "daily_life",
    "monday mornings": "daily_life",
    "sunday evenings": "daily_life",
    "tiny victories": "daily_life",
    "awkward moments": "daily_life",
    "festival endings": "daily_life",
    "background companionship": "daily_life",
    "recommendations": "daily_life",
    "everyday": "daily_life",

    "academic pressure": "academic_pressure",
    "studies and exams": "academic_pressure",
    "college_pressure": "academic_pressure",

    "career stress": "career_stress",
    "career confusion": "career_stress",
    "work life": "career_stress",
    "startup and career dreams": "career_stress",
    "startup dreams": "career_stress",
    "first salary life": "career_stress",
    "money management": "career_stress",
    "adult responsibilities": "career_stress",
    "future plans": "career_stress",
    "ambitions": "career_stress",
    "career growth": "career_stress",
    "financial independence": "career_stress",
    "side hustles": "career_stress",
    "creating impact": "career_stress",
    "legacy": "career_stress",
    "success meaning": "career_stress",
    "taking risks": "career_stress",

    "family conflict": "family",
    "family conflicts": "family",
    "family_issues": "family",
    "moving out and independence": "family",

    "relationship issues": "relationships",
    "relationships": "relationships",
    "friendship issues": "relationships",
    "friendship": "relationships",
    "adult friendships": "relationships",
    "friendship values": "relationships",
    "loyalty discussions": "relationships",

    "loneliness": "loneliness",

    "future worries": "overthinking",
    "self-doubt": "overthinking",
    "fear of failure": "overthinking",
    "future self conversations": "overthinking",
    "letter to future self": "overthinking",
    "stress": "overthinking",

    "self-esteem": "self_esteem",
    "selfies and appearance": "self_esteem",
    "identity and personal growth": "self_esteem",
    "happiness meaning": "self_esteem",

    "social anxiety": "social_anxiety",
    "stage fear": "social_anxiety",
    "public speaking fear": "social_anxiety",
    "phone call anxiety": "social_anxiety",

    "burnout": "burnout",
    "habits and productivity": "burnout",

    "grief/loss": "grief_loss",
    "grief": "grief_loss",

    "health anxiety": "health_anxiety",
    "cooking and survival skills": "daily_life",
    "digital life": "daily_life",
    "small adult wins": "daily_life",
    "dream cities": "daily_life",
    "travel dreams": "daily_life",
    "happiness and achievements": "daily_life",
    "motivation": "daily_life",
    "friend group energy": "daily_life",

    "crisis & safety": "crisis_safety",
    "crisis": "crisis_safety"
}

FORBIDDEN_PHRASES = [
    "as an ai language model",
    "as an ai",
    "i am just an ai",
    "here are 5 things you can do",
    "here are 5 steps",
    "i diagnose you",
    "you have a clinical diagnosis",
    "you suffer from major depressive disorder",
    "you suffer from generalized anxiety disorder",
    "that is completely valid and remember that you are not alone"
]

MARATHI_MARKERS = {
    "aahe", "ahe", "nahi", "mala", "tula", "kasa", "kashi", "kase", "zala", "zali",
    "vatat", "vatatay", "khup", "kay", "aaj", "kal", "udya", "bol", "aiktoy",
    "pan", "tar", "mag", "sobat", "baddal", "kela", "keli", "karte", "karto",
    "ghari", "mitra", "divas", "shant", "thoda", "evdha", "bindhast", "chalu", "ata"
}

HINDI_MARKERS = {
    "hai", "nahi", "mujhe", "tujhe", "kya", "kaise", "kaisi", "hua", "hoga",
    "hogi", "bol", "sun", "raha", "rahi", "hoon", "bahut", "aaj", "kal",
    "bhai", "yaar", "saath", "baat", "lagta", "lagti", "kuch", "sab", "ab"
}

ENGLISH_MARKERS = {
    "the", "is", "am", "are", "you", "your", "my", "me", "with", "have", "has",
    "feel", "feeling", "stressed", "anxious", "today", "tomorrow", "work", "job",
    "what", "how", "why", "about", "really", "so", "much", "too", "just", "like"
}

def detect_language(text):
    tokens = set(re.findall(r"[a-zA-Z]+", text.lower()))
    if not tokens:
        return "roman_marathi"
    
    m_score = len(tokens.intersection(MARATHI_MARKERS))
    h_score = len(tokens.intersection(HINDI_MARKERS))
    e_score = len(tokens.intersection(ENGLISH_MARKERS))
    
    if m_score >= 3 and e_score >= 3:
        return "mixed_marathi_english"
    elif m_score >= 3 and h_score >= 2:
        return "mixed_marathi_hindi"
    elif h_score >= 3 and e_score >= 3:
        return "mixed_code_switching"
    elif m_score >= max(h_score, e_score):
        return "roman_marathi"
    elif h_score > max(m_score, e_score):
        return "hindi"
    elif e_score > max(m_score, h_score) and m_score == 0 and h_score <= 1:
        return "english"
    else:
        return "roman_marathi"

def clean_robotic_prefix(text):
    orig = text.strip()
    lower = orig.lower()
    for pattern in ROBOTIC_PREFIXES:
        match = re.match(pattern, lower)
        if match:
            clean = orig[match.end():].strip()
            if clean:
                # Capitalize first letter
                return clean[0].upper() + clean[1:]
    return orig

def determine_crisis_tag(text, topic):
    t_lower = text.lower()
    if any(k in t_lower for k in [
        "want to die", "kill myself", "end my life", "suicide", "maraycha aahe",
        "swatahla sampva", "jeevan sampva", "marna chahta", "jaan de dunga"
    ]):
        return "CRISIS_HIGH"
    if any(k in t_lower for k in [
        "self harm", "cutting myself", "hurt myself", "jeev nako vatato", "kahi artha nahi",
        "no reason to live", "hopeless", "can't go on"
    ]):
        return "CRISIS_MEDIUM"
    if any(k in t_lower for k in [
        "panic attack", "can't breathe", "shvas gheta yet nahi", "dhad dhad hotiye"
    ]):
        return "CRISIS_LOW"
    if topic == "crisis_safety":
        return "CRISIS_MEDIUM"
    return "CRISIS_NONE"

def clean_existing_datasets():
    cleaned_conversations = []
    seen_first_messages = set()
    rejected_count = 0
    rejection_reasons = {}

    def reject(reason):
        nonlocal rejected_count
        rejected_count += 1
        rejection_reasons[reason] = rejection_reasons.get(reason, 0) + 1

    # 1. Parse backend/dataset/soultalk_dataset.json
    st_path = "backend/dataset/soultalk_dataset.json"
    if os.path.exists(st_path):
        with open(st_path, "r", encoding="utf-8") as f:
            for line_idx, line in enumerate(f):
                if not line.strip():
                    continue
                try:
                    obj = json.loads(line.strip())
                except Exception:
                    reject("malformed_json_line")
                    continue
                
                raw_msgs = obj.get("messages") or obj.get("chain") or []
                if len(raw_msgs) < 2:
                    reject("less_than_2_turns")
                    continue
                
                # Check messages validity
                clean_msgs = []
                has_forbidden = False
                for m in raw_msgs:
                    role = m.get("role")
                    content = m.get("content", "").strip()
                    if not content or role not in ["user", "assistant"]:
                        continue
                    
                    if role == "assistant":
                        content = clean_robotic_prefix(content)
                        c_lower = content.lower()
                        for fp in FORBIDDEN_PHRASES:
                            if fp in c_lower:
                                has_forbidden = True
                                break
                    
                    clean_msgs.append({"role": role, "content": content})
                
                if has_forbidden:
                    reject("forbidden_phrase_found")
                    continue
                
                if len(clean_msgs) < 2:
                    reject("too_few_clean_messages")
                    continue
                
                first_user = next((m["content"] for m in clean_msgs if m["role"] == "user"), None)
                if not first_user:
                    reject("no_user_turn")
                    continue
                
                norm_first = first_user.lower().strip()
                if norm_first in seen_first_messages:
                    reject("duplicate_first_message")
                    continue
                seen_first_messages.add(norm_first)

                raw_topic = str(obj.get("topic") or "daily_life").lower().strip()
                canonical_topic = TOPIC_MAP.get(raw_topic, "daily_life")
                
                combined_text = " ".join(m["content"] for m in clean_msgs)
                crisis_tag = obj.get("crisis_tag")
                if not crisis_tag or crisis_tag == "CRISIS_NONE":
                    crisis_tag = determine_crisis_tag(combined_text, canonical_topic)
                
                lang = detect_language(combined_text)
                
                cleaned_conversations.append({
                    "id": f"soultalk_existing_st_{len(cleaned_conversations)+1:06d}",
                    "topic": canonical_topic,
                    "crisis_tag": crisis_tag,
                    "language": lang,
                    "context_reference": obj.get("context_reference"),
                    "messages": clean_msgs
                })

    # 2. Parse backend/dataset/conversation_chains.json
    cc_path = "backend/dataset/conversation_chains.json"
    if os.path.exists(cc_path):
        with open(cc_path, "r", encoding="utf-8") as f:
            text = f.read()
        chain_indices = [m.start() for m in re.finditer(r"\"chain_id\"", text)]
        for i in range(len(chain_indices)):
            start = text.rfind("{", 0, chain_indices[i])
            end = text.rfind("}", 0, chain_indices[i+1]) + 1 if i < len(chain_indices)-1 else text.rfind("}") + 1
            chunk = text[start:end].strip()
            cleaned_chunk = re.sub(r",\s*\]", "]", chunk)
            cleaned_chunk = re.sub(r",\s*\}", "}", cleaned_chunk)
            try:
                obj = json.loads(cleaned_chunk, strict=False)
                raw_topic = str(obj.get("topic") or "loneliness").lower().strip()
                canonical_topic = TOPIC_MAP.get(raw_topic, "loneliness")
                turns = obj.get("turns", [])
                clean_msgs = []
                for t in turns:
                    u = t.get("user", "").strip()
                    b = (t.get("bot") or t.get("assistant") or "").strip()
                    if u:
                        clean_msgs.append({"role": "user", "content": u})
                    if b:
                        b_clean = clean_robotic_prefix(b)
                        clean_msgs.append({"role": "assistant", "content": b_clean})
                
                if len(clean_msgs) >= 2:
                    first_u = clean_msgs[0]["content"].lower().strip()
                    if first_u not in seen_first_messages:
                        seen_first_messages.add(first_u)
                        combined_text = " ".join(m["content"] for m in clean_msgs)
                        lang = detect_language(combined_text)
                        crisis_tag = determine_crisis_tag(combined_text, canonical_topic)
                        cleaned_conversations.append({
                            "id": f"soultalk_existing_cc_{len(cleaned_conversations)+1:06d}",
                            "topic": canonical_topic,
                            "crisis_tag": crisis_tag,
                            "language": lang,
                            "context_reference": None,
                            "messages": clean_msgs
                        })
                    else:
                        reject("duplicate_first_message_cc")
                else:
                    reject("too_few_clean_messages_cc")
            except Exception:
                reject("malformed_chunk_cc")

    # 3. Parse backend/dataset/soultalk_conversations_100.jsonl
    sc100_path = "backend/dataset/soultalk_conversations_100.jsonl"
    if os.path.exists(sc100_path):
        with open(sc100_path, "r", encoding="utf-8") as f:
            for line in f:
                if not line.strip():
                    continue
                try:
                    obj = json.loads(line.strip())
                    raw_msgs = obj.get("messages", [])
                    clean_msgs = []
                    for m in raw_msgs:
                        role = m.get("role")
                        content = (m.get("text") or m.get("content") or "").strip()
                        if role in ["user", "assistant"] and content:
                            if role == "assistant":
                                content = clean_robotic_prefix(content)
                            clean_msgs.append({"role": role, "content": content})
                    if len(clean_msgs) >= 2:
                        first_u = clean_msgs[0]["content"].lower().strip()
                        if first_u not in seen_first_messages:
                            seen_first_messages.add(first_u)
                            combined_text = " ".join(m["content"] for m in clean_msgs)
                            lang = detect_language(combined_text)
                            canonical_topic = TOPIC_MAP.get(obj.get("category", "daily_life").lower(), "daily_life")
                            crisis_tag = determine_crisis_tag(combined_text, canonical_topic)
                            cleaned_conversations.append({
                                "id": f"soultalk_existing_sc_{len(cleaned_conversations)+1:06d}",
                                "topic": canonical_topic,
                                "crisis_tag": crisis_tag,
                                "language": lang,
                                "context_reference": None,
                                "messages": clean_msgs
                            })
                        else:
                            reject("duplicate_first_message_sc100")
                except Exception:
                    reject("malformed_sc100_line")

    print(f"Cleaned existing conversations retained: {len(cleaned_conversations)}")
    total_turns = sum(len(c["messages"]) for c in cleaned_conversations)
    print(f"Total turns from cleaned existing conversations: {total_turns}")
    print(f"Rejected existing count: {rejected_count}")
    print(f"Rejection breakdown: {rejection_reasons}")
    return cleaned_conversations

if __name__ == "__main__":
    cleaned = clean_existing_datasets()
    print("Sample cleaned item:")
    print(json.dumps(cleaned[0], indent=2))
