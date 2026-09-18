"""
Common utilities and validator helpers for SoulTalk Dataset V4 scenario generators.
"""

import re

FORBIDDEN_PATTERNS = [
    r"as an ai",
    r"as a language model",
    r"i am an ai",
    r"i cannot feel",
    r"i don't have feelings",
    r"as an artificial intelligence",
    r"virtual assistant",
    r"i am programmed",
    r"my programming",
    r"as a machine",
    r"wolfie",
    r"major depressive disorder",
    r"clinical depression",
    r"bipolar",
    r"schizophrenia",
    r"borderline personality",
    r"dsm-5",
    r"diagnosed with",
    r"you have clinical anxiety",
    r"prescribe",
    r"medication dosage",
    r"antidepressant",
    r"in our therapy session",
    r"as your therapist",
    r"cognitive behavioral therapy",
    r"cbt exercise",
    r"psychoanalytic",
    r"therapeutic alliance",
    r"clinical assessment"
]

EMOJI_PATTERN = re.compile(
    r"[\U00010000-\U0010ffff\u2600-\u26ff\u2700-\u27bf\uFE00-\uFE0F\u1F300-\u1F9FF]",
    flags=re.UNICODE
)

def remove_emojis(text: str) -> str:
    return EMOJI_PATTERN.sub("", text).strip()

def has_forbidden_phrase(text: str) -> bool:
    t_lower = text.lower()
    for pattern in FORBIDDEN_PATTERNS:
        if re.search(r"\b" + pattern + r"\b", t_lower):
            return True
    return False

def detect_language(text: str) -> str:
    lower = text.lower()
    marathi_words = ["ahe", "aahe", "nahi", "hota", "hoti", "mala", "tula", "kasa", "kashi", "kay", "jevlis", "bagh", "vatatay", "khup", "pan", "re", "bhava"]
    hindi_words = ["hai", "nahi", "kya", "bhai", "yaar", "karna", "raha", "thi", "tha", "hoga", "mujhe", "tujhe"]
    
    has_mar = any(re.search(r'\b' + re.escape(w) + r'\b', lower) for w in marathi_words)
    has_hin = any(re.search(r'\b' + re.escape(w) + r'\b', lower) for w in hindi_words)
    has_eng = bool(re.search(r'\b(the|and|is|with|that|for|about|really|because|what|feeling)\b', lower))

    if has_mar and (has_eng or has_hin):
        return "mixed"
    elif has_mar:
        return "roman_marathi"
    elif has_hin:
        return "hinglish" if has_eng else "hindi"
    else:
        return "english"

def create_conv(scenario_family_id: str, topic: str, turns: list, crisis_tag: str = "CRISIS_NONE", context_reference: str = None) -> dict:
    """
    Creates a verified conversation object.
    turns is a list of (role, content) tuples.
    """
    assert len(turns) in [4, 6, 8], f"Turn count must be 4, 6, or 8, got {len(turns)}"
    assert turns[0][0] == "user", "First turn must be user"
    assert turns[-1][0] == "assistant", "Last turn must be assistant"
    
    msgs = []
    full_text_list = []
    
    for idx, (role, text) in enumerate(turns):
        text = text.strip()
        if crisis_tag != "CRISIS_NONE":
            text = remove_emojis(text)
        assert not has_forbidden_phrase(text), f"Forbidden phrase found in: {text}"
        msgs.append({"role": role, "content": text})
        full_text_list.append(text)
        
    full_text = " ".join(full_text_list)
    lang = detect_language(full_text)
    
    if crisis_tag in ["CRISIS_HIGH", "CRISIS_MEDIUM"]:
        assert ("14416" in full_text or "1800-599-0019" in full_text), "Crisis message must contain Tele-MANAS (14416) or KIRAN (1800-599-0019)"
        
    return {
        "scenario_family_id": scenario_family_id,
        "topic": topic,
        "crisis_tag": crisis_tag,
        "language": lang,
        "context_reference": context_reference,
        "messages": msgs
    }
