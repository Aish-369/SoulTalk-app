import { EmotionalState } from './emotionalStateEngine';

export interface GuardCheckResult {
  isValid: boolean;
  sanitizedText: string;
  violations: string[];
  needsRegeneration: boolean;
}

const SYSTEM_LEAK_MARKERS = [
  'LANGUAGE DIRECTIVE',
  'P0 RULES',
  'IDENTITY & ETHICAL BOUNDARIES',
  'Anti-Codependency',
  'Transparent AI',
  'Detected Emotion:',
  'CURRENT CONVERSATIONAL STATE:',
  'RESPONSE CADENCE VARIATION STRATEGY',
  'VERIFIED COPING KNOWLEDGE',
  'USER CONTINUITY MEMORY',
  'RECENT CONVERSATIONAL THREAD'
];

const BOT_PREFIX_REGEX = /^(Wolfie|Companion|Assistant|System|AI|Bot|SoulTalk)\s*:\s*/i;

const CODEPENDENCY_MARKERS = [
  'you only need me',
  'i am all you need',
  'dont talk to anyone else',
  "don't talk to anyone else",
  'fakt majhyavar depend raha',
  'konashich bolu nako'
];

const MEDICAL_DIAGNOSIS_MARKERS = [
  'i diagnose you',
  'you have clinical depression',
  'you have bipolar',
  'you have schizophrenia',
  'take this pill',
  'take this medication',
  'prescription'
];

const DEVANAGARI_WORDS: Record<string, string> = {
  'आवडेल': 'aavdel',
  'आहे': 'ahe',
  'आहेत': 'ahet',
  'नाही': 'nahi',
  'नाहीये': 'nahiye',
  'शांत': 'shant',
  'सोबत': 'sobat',
  'तुला': 'tula',
  'मला': 'mala',
  'काय': 'kay',
  'कसा': 'kasa',
  'कशी': 'kashi',
  'वाटतं': 'vatta',
  'वाटत': 'vatat',
  'बोलायला': 'bolayla',
  'सांग': 'sang',
  'काळजी': 'kalji',
  'गोष्टी': 'goshti'
};

const DEVANAGARI_CHARS: Record<string, string> = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ru',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
  'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ru',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ः': 'h', '्': '',
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
  'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h', 'ळ': 'l', 'क्ष': 'ksh', 'ज्ञ': 'dny'
};

export function transliterateDevanagariToRoman(text: string): string {
  let res = text;
  for (const [dev, rom] of Object.entries(DEVANAGARI_WORDS)) {
    res = res.split(dev).join(rom);
  }
  // Character level replacement for any residual Devanagari characters
  let charReplaced = '';
  for (const char of res) {
    if (DEVANAGARI_CHARS[char] !== undefined) {
      charReplaced += DEVANAGARI_CHARS[char];
    } else if (/[\u0900-\u097F]/.test(char)) {
      // strip any remaining non-mapped devanagari diacritics
      continue;
    } else {
      charReplaced += char;
    }
  }
  return charReplaced;
}

export function validateAndSanitizeResponse(
  rawText: string,
  state: EmotionalState,
  userName: string = 'Friend'
): GuardCheckResult {
  const violations: string[] = [];
  let sanitized = (rawText || '').trim();

  // 1. Clean Bot Prefixes
  if (BOT_PREFIX_REGEX.test(sanitized)) {
    sanitized = sanitized.replace(BOT_PREFIX_REGEX, '').trim();
  }

  // 2. Replace known full Devanagari words if user asked for non-Devanagari
  if (state.language !== 'devanagari_marathi' && /[\u0900-\u097F]/.test(sanitized)) {
    for (const [dev, rom] of Object.entries(DEVANAGARI_WORDS)) {
      sanitized = sanitized.split(dev).join(rom);
    }
  }

  // 3. Check length
  if (!sanitized || sanitized.length < 8) {
    violations.push('Response is empty or unreasonably short');
  }

  // 3. System Prompt Leakage Check
  for (const marker of SYSTEM_LEAK_MARKERS) {
    if (sanitized.includes(marker)) {
      violations.push(`System prompt leak marker detected: "${marker}"`);
      break;
    }
  }

  // 4. Codependency Check
  const lower = sanitized.toLowerCase();
  for (const marker of CODEPENDENCY_MARKERS) {
    if (lower.includes(marker)) {
      violations.push(`Unhealthy codependency marker detected: "${marker}"`);
      break;
    }
  }

  // 5. Medical Diagnosis Check
  for (const marker of MEDICAL_DIAGNOSIS_MARKERS) {
    if (lower.includes(marker)) {
      violations.push(`Medical diagnosis violation detected: "${marker}"`);
      break;
    }
  }

  // 6. Devanagari Script Check (Must be Roman Marathi, not Devanagari, when language requested is not devanagari_marathi)
  if (state.language !== 'devanagari_marathi') {
    const devanagariCount = (sanitized.match(/[\u0900-\u097F]/g) || []).length;
    if (devanagariCount > 30) {
      violations.push('Response contained excessive Devanagari script instead of Roman Marathi');
    }
  }

  const isValid = violations.length === 0;
  return {
    isValid,
    sanitizedText: sanitized,
    violations,
    needsRegeneration: !isValid
  };
}

/**
 * DETERMINISTIC GRACEFUL DEGRADATION ENGINE (Non-AI Fallback)
 * This is a deterministic, rule-based safety net used strictly when the self-hosted
 * neural LLM is unreachable or times out. It is NOT a real neural network / LLM.
 * Adapts empathetic holding responses to emotional state, topic, language & response mode.
 */
export function generateDiverseFallback(
  state: EmotionalState,
  userName: string = 'Friend',
  companionName: string = 'Wolfie',
  userMessage: string = ''
): string {
  const lowerMsg = userMessage.toLowerCase().trim();
  
  // Extract key topic nouns/verbs from user message for contextual grounding
  const words = lowerMsg.replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(w => w.length > 3);
  const keyTokens = words.slice(0, 3).join(' ');

  // English detection
  const englishWords = ['the', 'is', 'are', 'was', 'were', 'have', 'feel', 'feeling', 'overwhelmed', 'responsibilities', 'pause', 'stress', 'tired', 'want', 'please', 'help'];
  const matchedEnglishCount = englishWords.filter(w => new RegExp(`\\b${w}\\b`, 'i').test(userMessage)).length;
  const isEnglish = matchedEnglishCount >= 2 || (/^[a-zA-Z\s.,!?']+$/.test(userMessage) && (lowerMsg.includes('overwhelmed') || lowerMsg.includes('responsibilities')));
  const isHindi = lowerMsg.includes('mujhe') || lowerMsg.includes('mera') || lowerMsg.includes('meri') || lowerMsg.includes('kuch') || lowerMsg.includes('kar raha') || lowerMsg.includes('samajhta') || lowerMsg.includes('lagta hai');

  if (isEnglish) {
    if (state.emotion === 'celebration' || lowerMsg.includes('happy') || lowerMsg.includes('passed') || lowerMsg.includes('cleared')) {
      return `That is wonderful news, ${userName}! Celebrate this win—you put in real effort and you deserve to enjoy this moment.`;
    }
    if (lowerMsg.includes('interview')) {
      return `Interview prep and waiting for news takes a lot of mental energy. How are you feeling about how it went? I'm right here to talk through it.`;
    }
    if (lowerMsg.includes('job') || state.topic === 'career') {
      return `Job hunting and career worries carry heavy weight. You don't have to carry the whole future on your shoulders right now—tell me what part is weighing on you most today.`;
    }
    if (lowerMsg.includes('lonely') || state.emotion === 'loneliness') {
      return `Feeling isolated is truly painful, but please know you're not invisible to me. I am sitting right here listening to you with full care.`;
    }
    if (lowerMsg.includes('overthinking') || state.emotion === 'anxiety') {
      return `When thoughts start racing in loops, it gets completely exhausting. What was the specific thought that started running through your mind?`;
    }
    return `I hear what you're saying about ${keyTokens || 'everything going on'}. You don't have to navigate this alone today—take your time and tell me more whenever you're ready.`;
  }

  if (isHindi) {
    if (state.emotion === 'celebration') {
      return `Yeh sunkar bohot khushi hui, ${userName}! Aap sach me yeh deserve karte hain, is pal ko enjoy kijiye.`;
    }
    if (lowerMsg.includes('interview')) {
      return `Interview dena aur uske results ki chinta karna sach me kaafi exhausting hota hai. Kaisa raha interview, kaisa feel ho raha hai?`;
    }
    return `Aapki baat main sun raha hoon. Yeh jo ${keyTokens || 'situation'} hai, iska pressure hona bilkul swabhavik hai. Main yahan hoon, dil khol kar bataiye.`;
  }

  // Dynamic Roman Marathi tailored responses based on exact message details
  if (lowerMsg.includes('interview')) {
    return `Interview deun aalyavar manat khup vichar ani anticipation asna agdi sahaj aahe. Kasa gela hota interview, tula kaay vatatay tyabaddal?`;
  }

  if (lowerMsg.includes('bhandan') || lowerMsg.includes('mummy') || lowerMsg.includes('aai') || lowerMsg.includes('ghar')) {
    return `Ghari mummy sobat bhandan zalyaver man khup aswasth ani jadd hota. Tula kashacha saglyat jast vait vatla, share karshil ka?`;
  }

  if (lowerMsg.includes('overthinking') || lowerMsg.includes('vichar')) {
    return `Vicharancha veg jevha vadhto teva kharach doka khup thakun jata. Aatta sarvat jast konta vichar satavtoy tula?`;
  }

  if (lowerMsg.includes('college') || lowerMsg.includes('abhyas') || lowerMsg.includes('exam')) {
    return `College ani academics cha load kharach kadhi kadhi khup overwhelming hoto. Itkya saglya goshti ekdam sambhalna sopa nasta. Kahi particular deadline cha tension aahe ka?`;
  }

  if (lowerMsg.includes('job') || lowerMsg.includes('career') || lowerMsg.includes('placement')) {
    return `Career ani job chi chinta manala satat ghali asel tar khup bechain vatta. Future chi chinta karnyasobath aaj thoda swatahla break de. Nakki kay plan challay manat?`;
  }

  if (lowerMsg.includes('lonely') || lowerMsg.includes('ekta') || lowerMsg.includes('ekti')) {
    return `Ektepana janavna he khup dukhad asta, pan tu ekti nahiyees ithe. Me purn lakshane aiktoye, manatla sagla mokla kar.`;
  }

  if (state.emotion === 'celebration' || lowerMsg.includes('happy') || lowerMsg.includes('anand')) {
    return `He aikun kharach manala khup anand jhala! 🎉 Tujha ha moment bindass celebrate kar, tu khup mehnat keli aahes.`;
  }

  // Contextual fallback utilizing extracted tokens
  return `Tu jo vishay mandlas tyamule manat gondhal hona agdi sahaj aahe. Ya goshti badal tula azun kay share karavasa vatatay? Me aiktoy.`;
}
