export const CrisisLevel = {
  NONE: 'none',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  SEVERE: 'severe'
} as const;

export type CrisisLevelType = typeof CrisisLevel[keyof typeof CrisisLevel];

export interface CrisisCheckResult {
  isCrisis: boolean;
  level: CrisisLevelType;
  confidence: number;
  response?: string;
  matchedKeywords: string[];
  resources: {
    primary: string;
    secondary: string;
    kiran: string;
    emergency: string;
    icall: string;
  };
}

export const HELPLINE_RESOURCES = {
  teleManas: 'Tele MANAS — 14416 or 1800-891-4416 (Govt. of India, 24x7, Free & Toll-Free, 20+ Languages)',
  kiran: 'KIRAN (Govt. of India) — 1800-599-0019 (24x7 Mental Health Helpline)',
  vandrevala: 'Vandrevala Foundation — 1860-266-2345 / 9999 666 555 (24x7 Free Support)',
  aasra: 'AASRA — +91-9820466726 (24x7 Suicide Prevention & Crisis Support)',
  icall: 'iCALL (TISS Mumbai) — 9152987821 (Mon–Sat 10:00 AM – 8:00 PM)',
  emergency: '112 (National Emergency Number, India)'
};

const SEVERE_KEYWORDS = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die', 'no reason to live',
  'better off dead', 'end it all', 'take my own life', 'commit suicide',
  'plan to die', 'plan to kill myself', 'plan to suicide', 'suicide plan', 'suicidal plan',
  'sleep forever and never wake up', 'never wake up', 'want to sleep forever',
  'hurt myself', 'hurting myself', 'self harm', 'self-harm', 'harm myself', 'harming myself',
  'cut myself', 'cutting myself', 'overdose', 'swatahla hurt', 'swatala hurt', 'swatahala hurt',
  'dont want to live', "don't want to live", 'dont wanna live', 'not want to live',
  'hang myself', 'jump off', 'marun jau', 'jagne nako', 'maraycha ahe', 'maraycha aahe', 'marun zava',
  'marun javasa vatat', 'marun javasa vatatay', 'marun java vatat', 'marun jau vatat', 'marun javasa',
  'aatmhatya', 'aatmahatya', 'jeevan sampva', 'jeevan nako', 'swatahla marnar', 'khallas karaycha',
  'khudkushi', 'mar jaana chahta', 'jaan lena chahta', 'jagaycha nahiye', 'jagaycha nahi',
  'आत्महत्या', 'जगायचे नाही', 'जगावेसे वाटत नाही', 'स्वतःला संपवायचे', 'जीवन संपवायचे', 'स्वतःला इजा'
];

const FIGURATIVE_IDIOMS = [
  "dying of laughter", "dying of curiosity", "dying from boredom", "dying of boredom",
  "dying to see", "dying to know", "dying to meet", "dying to try", "dying to go",
  "killing it", "killing time", "deadly good", "deadly funny",
  "exam is killing me", "work is killing me", "assignment is killing me",
  "traffic is killing me", "feet are killing me", "legs are killing me",
  "weather is killing me", "heat is killing me", "cold is killing me",
  "hasun marun gele", "hasun marun gelo", "hasun hasun marlo", "hasun maraychi vel"
];

const NEGATION_PATTERNS = [
  "don't want to die", "dont want to die", "do not want to die", "not wanting to die",
  "not suicidal", "never suicidal", "not feeling suicidal", "not thinking of suicide",
  "not going to kill myself", "won't kill myself", "wont kill myself", "never kill myself",
  "do not want to kill myself", "don't want to kill myself", "dont want to kill myself",
  "not hurting myself", "not going to hurt myself", "don't want to hurt myself",
  "dont want to hurt myself", "do not want to hurt myself", "no plan to die",
  "never want to die", "no desire to die"
];

const THIRD_PERSON_INDICATORS = [
  "my friend", "my best friend", "my brother", "my sister", "my roommate",
  "my classmate", "my colleague", "my cousin", "my mom", "my mother",
  "my dad", "my father", "my partner", "my boyfriend", "my girlfriend",
  "someone i know", "a person i know", "he wants to die", "she wants to die",
  "they want to die", "he is suicidal", "she is suicidal", "they are suicidal",
  "friend of mine", "friend is suicidal", "friend wants to die"
];

const HIGH_KEYWORDS = [
  'giving up on life', 'everyone better off without me', 'everyone would be better off without me',
  'better off without me', 'burden to everyone', 'no hope left to live',
  'end the pain forever', 'kahi vatat nahi jagaycha'
];

const MEDIUM_KEYWORDS = [
  'hopeless', 'worthless', 'giving up', "can't go on", 'cant go on',
  'want to disappear', 'severe depression', 'anxiety attack', 'panic attack',
  'overwhelmed', "can't cope", 'falling apart', 'breaking down',
  'mental breakdown', 'losing control', 'scared of myself', 'ghabarli'
];

export function checkCrisis(text: string): CrisisCheckResult {
  const t = text.toLowerCase().trim();
  const matchedKeywords: string[] = [];

  // 1. Check for purely figurative non-crisis idioms
  for (const idiom of FIGURATIVE_IDIOMS) {
    if (t.includes(idiom)) {
      // If the text does NOT contain other explicit self-harm terms, treat as non-crisis
      const hasOtherSelfHarm = SEVERE_KEYWORDS.some(kw =>
        kw !== 'want to die' && kw !== 'dont want to live' && !idiom.includes(kw) && t.includes(kw)
      );
      if (!hasOtherSelfHarm) {
        return {
          isCrisis: false,
          level: CrisisLevel.NONE,
          confidence: 0.0,
          matchedKeywords: [],
          resources: {
            primary: HELPLINE_RESOURCES.teleManas,
            secondary: HELPLINE_RESOURCES.vandrevala,
            kiran: HELPLINE_RESOURCES.kiran,
            emergency: HELPLINE_RESOURCES.emergency,
            icall: HELPLINE_RESOURCES.icall
          }
        };
      }
    }
  }

  // 2. Check for explicit negated crisis statements (e.g. "I don't want to die", "I am not suicidal")
  const isExplicitlyNegated = NEGATION_PATTERNS.some(neg => t.includes(neg));
  if (isExplicitlyNegated) {
    // Check if there are contradictory overt crisis markers like "overdose", "cut myself", "suicide plan"
    const hasActiveCrisis = ['plan to die', 'overdose', 'cut myself', 'hang myself', 'jump off', 'swatahla marnar'].some(kw => t.includes(kw));
    if (!hasActiveCrisis) {
      return {
        isCrisis: false,
        level: CrisisLevel.NONE,
        confidence: 0.0,
        matchedKeywords: [],
        resources: {
          primary: HELPLINE_RESOURCES.teleManas,
          secondary: HELPLINE_RESOURCES.vandrevala,
          kiran: HELPLINE_RESOURCES.kiran,
          emergency: HELPLINE_RESOURCES.emergency,
          icall: HELPLINE_RESOURCES.icall
        }
      };
    }
  }

  // 3. Check for third-person crisis statements ("My friend is suicidal")
  const isThirdPerson = THIRD_PERSON_INDICATORS.some(tp => t.includes(tp));
  const hasFirstPersonCrisis = [
    'i want to die', 'kill myself', 'end my life', 'take my own life',
    'i am suicidal', "i'm suicidal", 'swatahla hurt', 'cut myself'
  ].some(fp => t.includes(fp));

  for (const kw of SEVERE_KEYWORDS) {
    if (t.includes(kw)) {
      matchedKeywords.push(kw);
    }
  }

  // Third-person disclosure handling
  if (isThirdPerson && !hasFirstPersonCrisis && matchedKeywords.length > 0) {
    return {
      isCrisis: true,
      level: CrisisLevel.SEVERE,
      confidence: 0.96,
      matchedKeywords,
      response: `I hear how alarming and painful it is to see someone you care about going through this crisis. You are being a supportive friend, but you do not have to carry this alone. Please connect them with immediate caring help: call Tele-MANAS at 14416 (or 1800-891-4416), call KIRAN at 1800-599-0019, or call Emergency at 112. Free, confidential support is available 24/7 to guide both of you.`,
      resources: {
        primary: HELPLINE_RESOURCES.teleManas,
        secondary: HELPLINE_RESOURCES.vandrevala,
        kiran: HELPLINE_RESOURCES.kiran,
        emergency: HELPLINE_RESOURCES.emergency,
        icall: HELPLINE_RESOURCES.icall
      }
    };
  }

  // First-person severe crisis handling
  if (matchedKeywords.length > 0) {
    return {
      isCrisis: true,
      level: CrisisLevel.SEVERE,
      confidence: 0.98,
      matchedKeywords,
      response: `I hear that you are in deep, heavy pain right now, and I want you to know that your life matters. Please reach out to someone who can help you right now. You can call Tele-MANAS at 14416 (or 1800-891-4416), call KIRAN at 1800-599-0019, or call Emergency at 112. You are not alone, and free confidential support is available 24/7.`,
      resources: {
        primary: HELPLINE_RESOURCES.teleManas,
        secondary: HELPLINE_RESOURCES.vandrevala,
        kiran: HELPLINE_RESOURCES.kiran,
        emergency: HELPLINE_RESOURCES.emergency,
        icall: HELPLINE_RESOURCES.icall
      }
    };
  }

  for (const kw of HIGH_KEYWORDS) {
    if (t.includes(kw)) {
      matchedKeywords.push(kw);
    }
  }

  if (matchedKeywords.length > 0) {
    return {
      isCrisis: true,
      level: CrisisLevel.HIGH,
      confidence: 0.85,
      matchedKeywords,
      response: `I hear how exhausting and overwhelming everything feels right now, and you do not have to carry this alone. Please connect with caring support immediately: call Tele-MANAS at 14416 or KIRAN at 1800-599-0019. Free, confidential support is available 24/7.`,
      resources: {
        primary: HELPLINE_RESOURCES.teleManas,
        secondary: HELPLINE_RESOURCES.vandrevala,
        kiran: HELPLINE_RESOURCES.kiran,
        emergency: HELPLINE_RESOURCES.emergency,
        icall: HELPLINE_RESOURCES.icall
      }
    };
  }

  for (const kw of MEDIUM_KEYWORDS) {
    if (t.includes(kw)) {
      matchedKeywords.push(kw);
    }
  }

  if (matchedKeywords.length > 0) {
    return {
      isCrisis: false,
      level: CrisisLevel.MEDIUM,
      confidence: 0.70,
      matchedKeywords,
      resources: {
        primary: HELPLINE_RESOURCES.teleManas,
        secondary: HELPLINE_RESOURCES.vandrevala,
        kiran: HELPLINE_RESOURCES.kiran,
        emergency: HELPLINE_RESOURCES.emergency,
        icall: HELPLINE_RESOURCES.icall
      }
    };
  }

  return {
    isCrisis: false,
    level: CrisisLevel.NONE,
    confidence: 0.0,
    matchedKeywords: [],
    resources: {
      primary: HELPLINE_RESOURCES.teleManas,
      secondary: HELPLINE_RESOURCES.vandrevala,
      kiran: HELPLINE_RESOURCES.kiran,
      emergency: HELPLINE_RESOURCES.emergency,
      icall: HELPLINE_RESOURCES.icall
    }
  };
}

export function detectEmotionAdvanced(text: string): { emotion: string; confidence: number } {
  const t = text.toLowerCase();

  // 1. HAPPY / JOY
  if (
    t.includes('happy') || t.includes('joy') || t.includes('glad') || t.includes('smile') ||
    t.includes('mast') || t.includes('changla') || t.includes('chhan') || t.includes('छान') ||
    t.includes('आनंद') || t.includes('sahi') || t.includes('dream job') || t.includes('offer') ||
    t.includes('jinklo') || t.includes('celebrate') || t.includes('great') || t.includes('wonderful') ||
    t.includes('feeling good') || t.includes('feeling okay') || t.includes('feel okay') || t.includes('mast vatat')
  ) {
    return { emotion: 'HAPPY', confidence: 0.95 };
  }

  // 2. EXCITED
  if (
    t.includes('excite') || t.includes('hyped') || t.includes('awesome') || t.includes('amazing') ||
    t.includes('thrill') || t.includes('cant wait') || t.includes("can't wait")
  ) {
    return { emotion: 'EXCITED', confidence: 0.96 };
  }

  // 3. CALM / PEACEFUL
  if (
    t.includes('calm') || t.includes('peace') || t.includes('shant') || t.includes('शांत') ||
    t.includes('relaxed') || t.includes('chill') || t.includes('halke vatat') || t.includes('serene')
  ) {
    return { emotion: 'CALM', confidence: 0.92 };
  }

  // 4. LONELY
  if (
    t.includes('lonely') || t.includes('alone') || t.includes('isolated') || t.includes('ekta') ||
    t.includes('ekti') || t.includes('ektech') || t.includes('ektatav') || t.includes('एकटा') ||
    t.includes('nobody') || t.includes('ignore') || t.includes('unseen') || t.includes('konashi bolavasa') ||
    t.includes('konich nahi') || t.includes('koni nahi')
  ) {
    return { emotion: 'LONELY', confidence: 0.94 };
  }

  // 5. ANXIOUS / PANIC / FEAR
  if (
    t.includes('anxious') || t.includes('anxiety') || t.includes('worry') || t.includes('worried') ||
    t.includes('fear') || t.includes('nervous') || t.includes('bhiti') || t.includes('ghabar') ||
    t.includes('panic') || t.includes('chinta') || t.includes('भिती') || t.includes('चिंता') ||
    t.includes('future') || t.includes('bhavishya') || t.includes('dhad dhad') || t.includes('palpitation')
  ) {
    return { emotion: 'ANXIOUS', confidence: 0.93 };
  }

  // 6. STRESSED / OVERWHELMED / BURNOUT
  if (
    t.includes('stress') || t.includes('overwhelm') || t.includes('exhaust') || t.includes('tension') ||
    t.includes('burnout') || t.includes('pressure') || t.includes('thaklo') || t.includes('thakle') ||
    t.includes('deadline') || t.includes('abhyas') || t.includes('exam') || t.includes('taan') ||
    t.includes('ताण') || t.includes('workload') || t.includes('heavy')
  ) {
    return { emotion: 'STRESSED', confidence: 0.93 };
  }

  // 7. ANGRY / FRUSTRATED
  if (
    t.includes('angry') || t.includes('mad') || t.includes('hate') || t.includes('annoy') ||
    t.includes('frustrat') || t.includes('bhandan') || t.includes('unfair') || t.includes('rag yetoy') ||
    t.includes('raag') || t.includes('chid') || t.includes('संताप') || t.includes('राग')
  ) {
    return { emotion: 'ANGRY', confidence: 0.91 };
  }

  // 8. CONFUSED / LOST
  if (
    t.includes('confused') || t.includes('lost') || t.includes('samjat nahi') || t.includes('samjena') ||
    t.includes('kahi samjat') || t.includes('stuck') || t.includes('karan samjat nahi') || t.includes('gondhal')
  ) {
    return { emotion: 'CONFUSED', confidence: 0.90 };
  }

  // 9. SAD / GRIEF / HURT
  if (
    t.includes('sad') || t.includes('cry') || t.includes('grief') || t.includes('pain') ||
    t.includes('vait vatat') || t.includes('vait') || t.includes('dukhta') || t.includes('breakup') ||
    t.includes('miss karto') || t.includes('heartbroke') || t.includes('hurt') || t.includes('tears') ||
    t.includes('hopeless') || t.includes('grey') || t.includes('mood kharab') || t.includes('kharab') ||
    t.includes('depress') || t.includes('bad day') || t.includes('off aahe') || t.includes('off ahe') ||
    t.includes('खराब') || t.includes('वाईट') || t.includes('दुःख')
  ) {
    return { emotion: 'SAD', confidence: 0.94 };
  }

  // 10. MOTIVATED
  if (
    t.includes('motivat') || t.includes('goal') || t.includes('focus') || t.includes('ready') ||
    t.includes('try karto') || t.includes('jit') || t.includes('win')
  ) {
    return { emotion: 'MOTIVATED', confidence: 0.89 };
  }

  return { emotion: 'NEUTRAL', confidence: 0.82 };
}
