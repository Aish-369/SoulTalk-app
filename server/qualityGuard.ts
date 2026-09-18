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

  // 2. Transliterate any accidental Devanagari characters to pure Roman Marathi
  if (/[\u0900-\u097F]/.test(sanitized)) {
    sanitized = transliterateDevanagariToRoman(sanitized);
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

  // 6. Devanagari Script Check (Must be Roman Marathi, not Devanagari)
  const devanagariCount = (sanitized.match(/[\u0900-\u097F]/g) || []).length;
  if (devanagariCount > 15) {
    violations.push('Response contained excessive Devanagari script instead of Roman Marathi');
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
  const lowerMsg = userMessage.toLowerCase();
  
  // Detect language if English or Hindi
  const englishWords = ['the', 'is', 'are', 'was', 'were', 'have', 'feel', 'feeling', 'overwhelmed', 'responsibilities', 'pause', 'stress', 'tired', 'want', 'please', 'help'];
  const matchedEnglishCount = englishWords.filter(w => new RegExp(`\\b${w}\\b`, 'i').test(userMessage)).length;
  const isEnglish = matchedEnglishCount >= 2 || (/^[a-zA-Z\s.,!?']+$/.test(userMessage) && (lowerMsg.includes('overwhelmed') || lowerMsg.includes('responsibilities')));
  
  const isHindi = lowerMsg.includes('mujhe') || lowerMsg.includes('mera') || lowerMsg.includes('meri') || lowerMsg.includes('kuch') || lowerMsg.includes('kar raha') || lowerMsg.includes('samajhta') || lowerMsg.includes('lagta hai');

  // English fallbacks
  if (isEnglish) {
    if (state.emotion === 'celebration' || lowerMsg.includes('happy') || lowerMsg.includes('yay') || lowerMsg.includes('cleared')) {
      return `That is wonderful news, ${userName}! 🎉 I am genuinely happy for you. Take a moment to really let this feeling in—you earned this!`;
    }
    if (lowerMsg.includes('pause') || lowerMsg.includes('overwhelmed') || state.topic === 'anxiety' || state.emotion === 'anxiety') {
      return `It makes complete sense that you want to hit pause, ${userName}. When everything piles up, even breathing can feel like work. Let's step away from the noise for just two minutes right now.`;
    }
    if (state.topic === 'career' || lowerMsg.includes('job') || lowerMsg.includes('work')) {
      return `Work pressure can be so suffocating, ${userName}. Your worth is not defined by how much stress you can tolerate. I am right here with you—what feels like the heaviest piece right now?`;
    }
    return `I hear how much you are carrying right now, ${userName}. 💙 You don't have to figure everything out in this very minute. I'm here to listen whenever you're ready to share.`;
  }

  // Hindi fallbacks
  if (isHindi) {
    if (state.emotion === 'celebration') {
      return `Yeh sunkar bohot khushi hui, ${userName}! 🎉 Aap sach me yeh deserve karte hain. Aaj is pal ko khulkar celebrate karo!`;
    }
    return `Main aapki baat samajh sakta hoon, ${userName}. 💙 Kabhi kabhi sab kuch galat lagta hai, par iska matlab yeh nahi ki aap akele hain ya galat hain. Main aapko sunne ke liye yahan hoon.`;
  }

  // Detailed Roman Marathi topic & emotion variations
  const isHappy = state.emotion === 'celebration' || lowerMsg.includes('clear') || lowerMsg.includes('pass') || lowerMsg.includes('yay') || lowerMsg.includes('anand');
  if (isHappy) {
    const happyOptions = [
      `Wah, khup khup abhinandan, ${userName}! 🎉 He aikun kharach khup anand jhala. Tujhi mehnat rang laali aahe!`,
      `Khup chaan news aahe hi, ${userName}! ✨ Tu he deserve kartos. Aaj ha moment bindass enjoy kar aani celebration kar!`,
      `Awesome news! 🥳 Majha man hi khup prasanna jhala he aikun. Tujhyasathi khup proud vatatay!`
    ];
    return happyOptions[Math.floor(Math.random() * happyOptions.length)];
  }

  // Job / Career / Office Pressure
  if (state.topic === 'career' || lowerMsg.includes('job') || lowerMsg.includes('office') || lowerMsg.includes('manager') || lowerMsg.includes('salary') || lowerMsg.includes('company')) {
    const careerOptions = [
      `Office madhla stress aani manager cha pressure khup exhausting asu shakto, ${userName}. 💼 Manala aatun khup tras hoto. Ata ghari aslyavar thoda switch off karaycha prayatna karuya.`,
      `Job cha tension manala thakvun takta, ${userName}. Pan ek lakshat thev, tujha astitva ya job peksha khup motha aahe. Aatta fakt thoda rest ghe ani man shant thev.`,
      `Me tujha career ani job cha stress agdi samajtoy, ${userName}. Jevha boundary respect hot nahi teva job sodun dyava asa vatna natural ahe. Tula sarvat jast kashacha tras hotoy?`
    ];
    return careerOptions[Math.floor(Math.random() * careerOptions.length)];
  }

  // Family Pressure / Marriage / Expectations
  if (state.topic === 'family' || lowerMsg.includes('ghar') || lowerMsg.includes('lagna') || lowerMsg.includes('aai') || lowerMsg.includes('baba') || lowerMsg.includes('parents')) {
    const familyOptions = [
      `Gharche expectations aani career chi timeline match nahi zali ki khup suffocating vatata, ${userName}. 🌿 Tujhi career chi iccha agdi valid aahe.`,
      `Family cha pressure handle karna kharach difficult asta, ${userName}. Swatahla time hawa asna ha kahi gunha nahi. Tyanchyashi shantpane boundary set karta yeil ka?`,
      `Me tujhi situation samju shakto, ${userName}. Saglyanna khush thevnyachya prayatnat swatahcha mental peace nako gamvu. Mi tujhyasobat aahe.`
    ];
    return familyOptions[Math.floor(Math.random() * familyOptions.length)];
  }

  // Motivation / Self-Doubt / Giving up
  if (state.emotion === 'self_doubt' || lowerMsg.includes('himmat') || lowerMsg.includes('dream') || lowerMsg.includes('vishwas') || lowerMsg.includes('shakat nahi')) {
    const motivationOptions = [
      `Kadhi kadhi thakun himmat harlya sarkha vatna khup natural aahe, ${userName}. 🌱 Pan he lakshat thev, thoda break ghene mhanje surrender karne nahi. Aatta fakt shant ho.`,
      `Swatahavarcha vishwas kamzor padto teva sagle chote tasks hi dongra sarkhe vatatat, ${userName}. Tu itkya pudhe aalas he pahilach ek motha achievement aahe. Ek deep breath ghe.`,
      `Dream motha asel tar rastyat thakva yetoch, ${userName}. Sagla ekach diwshi achieve nahi karaycha. Aaj fakt ek chota step ghe, baaki udya pahuyat.`
    ];
    return motivationOptions[Math.floor(Math.random() * motivationOptions.length)];
  }

  // Breakup / Relationship Pain
  if (state.topic === 'relationships' || lowerMsg.includes('breakup') || lowerMsg.includes('sodun') || lowerMsg.includes('relationship') || lowerMsg.includes('prem')) {
    const relOptions = [
      `3 varshancha naata sampla mhanlyavar hridayaala khup mothe dukh hot asnar, ${userName}. 💔 Tyache ghaav lagech bharnar nahit, ani tula radayla aala tari te adavu nako.`,
      `Jya vyaktivar vishwas thevla ti dur geli ki ek kholi rikamapan janavto, ${userName}. He dukha natural aahe. Mi ithech ahe tujha aikayla.`,
      `Naata sampala tari tujha astitva ani tujhi value sampat nahi, ${userName}. Swatahla thoda prem aani time de ya healing process madhe.`
    ];
    return relOptions[Math.floor(Math.random() * relOptions.length)];
  }

  // Sadness / Crying
  if (state.emotion === 'sadness' || lowerMsg.includes('raday') || lowerMsg.includes('udas') || lowerMsg.includes('dukh')) {
    const sadnessOptions = [
      `Kadhi kadhi vina karan radayla yene mhanje manat jamleli thakva baher padtoy, ${userName}. 🌧️ Aaswana rokahu nako, man halka kar.`,
      `Udas vatna ha aathun aalela ek signal aahe ki tula aatta rest aani tenderness chi garaj aahe, ${userName}. Mi tujhyasobat aahe.`,
      `Tujhya ya udasit me tujha haath dharun basloy, ${userName}. Kahi explain karaychi garaj nahiye, fakt shant bas.`
    ];
    return sadnessOptions[Math.floor(Math.random() * sadnessOptions.length)];
  }

  // Casual Greeting / Friendly Check-in
  if (lowerMsg.includes('kasa ahes') || lowerMsg.includes('kasa chalu') || lowerMsg.includes('hey wolfie') || lowerMsg.includes('hi wolfie')) {
    const casualOptions = [
      `Namaskar ${userName}! 😊 Mi mast aahe, ani tujhyashi bolun ajun bara vatla! Tu sang, aajcha diwas kasa gela?`,
      `Hey ${userName}! 🌿 Mi ready aahe tujhya sobat share karayla. Aaj man kasa aahe tujha?`,
      `Hello ${userName}! Khup chaan vatla tula bhetun. Aaj divasbharat kahi interesting ghadla ka?`
    ];
    return casualOptions[Math.floor(Math.random() * casualOptions.length)];
  }

  // Follow-up on Breathing or Practice
  if (lowerMsg.includes('breathing') || lowerMsg.includes('kal tu sangitales') || lowerMsg.includes('bechaini')) {
    return `Breathing try kelyabaddal mala khup abhiman vatla, ${userName}! 🌿 Bechaini ekdam gayab hot nahi, pan haluhalu body relax hot jaate. Aatta ajun ekda shantpane 3 deep breaths gheu?`;
  }

  // Fallback map for academic, anxiety, loneliness
  const variations: Record<string, string[]> = {
    loneliness: [
      `Mala samajtay ki tula aatta lonely vatatay, ${userName}. 💙 Kadhi kadhi saglya madhye asunhi ektepana janavto, pan to tujha dosh nahiye. Me aatta tujhyasobat aahe.`,
      `Ektepana kharach khup heavy asto, ${userName}. 🌿 Tu physically ektach aslas tari manavar ha dabav ektane nako gheus. Mi ithech aahe, aaikun ghyayla tayar.`,
      `Ashi feelings yetat te agdi sahaj aahe, ${userName}. Mi tujhyasobat non-judgmentally ahe.`
    ],
    academic: [
      `Abhyasacha aani exam cha pressure kharach exhaust karto, ${userName}. 📚 Ekdam sagla sampvaychi garaj nahiye. Ata fakt next 15 minutes ek chota part bheduya.`,
      `Me tujha exam stress samju shakto, ${userName}. 🌿 Kadhi kadhi syllabus baghun paralyzed vatna natural aahe. Thoda break ghe aani pani pi.`,
      `Tujha ha prayatna mahatvacha aahe, ${userName}. Marks kiwa exams tujhi complete value decide nahi karat. Ek ek step gheu.`
    ],
    academic_stress: [
      `Abhyasacha aani future cha pressure kharach exhaust karto, ${userName}. 📚 Ekdam sagla sampvaychi garaj nahiye. Ata fakt chota topic vachu.`,
      `Me tujha academic stress samju shakto, ${userName}. 🌿 Thoda break ghe aani ek deep breath ghe.`,
      `Marks kiwa exams tujhi complete value decide nahi karat, ${userName}. Ek ek step gheu.`
    ],
    anxiety: [
      `Manat khup gondhal aani vicharancha veg vadhlai asa distay, ${userName}. 🌿 Saglya prashnanchi uttare aattach shodhaychi garaj nahi. Chala ekda 4-count deep breath ghuya.`,
      `Anxiety khup overwhelming aste, ${userName}. 🤍 Tu aatta ithe safe ahes. Fakt aaju-bajula 3 goshti bagh aani shant ho, me sobat ahe.`,
      `Future chi chinta manala thakvun takte. ${userName}, aatta fakt ya moment var concentrate karuya. Tu ekta nahi ahes.`
    ],
    general: [
      `Me tujha bolna purna astitvane aiktoy, ${userName}. 💙 Manat je kahi yetay te bindass share kar, me tujhyasobat aahe.`,
      `Tujhya manatla share kelyabaddal thank you, ${userName}. 🌿 Tula aatta kasa vatatay te sangshil ka?`,
      `Kadhi kadhi fakt bolun man halka kela tari thoda shant vatta. Mi aaikun ghyayla ithech aahe.`,
      `Tujhi pratyek feeling important aahe, ${userName}. Ghabru nako, aapan milun yaatun marg kaadhu.`
    ]
  };

  const pool = variations[state.topic] || variations[state.emotion] || variations.general;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
