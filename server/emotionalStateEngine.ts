export type EmotionType =
  | 'loneliness'
  | 'sadness'
  | 'anxiety'
  | 'stress'
  | 'academic_stress'
  | 'relationship_conflict'
  | 'overthinking'
  | 'grief'
  | 'anger'
  | 'fear'
  | 'guilt'
  | 'self_doubt'
  | 'exhaustion'
  | 'confusion'
  | 'celebration'
  | 'calm'
  | 'hopeful'
  | 'supportive';

export type IntentType =
  | 'emotional_support'
  | 'venting'
  | 'seeking_perspective'
  | 'practical_coping'
  | 'celebration'
  | 'connection'
  | 'crisis'
  | 'greeting'
  | 'general_chat';

export type TopicType =
  | 'relationships'
  | 'academic'
  | 'career'
  | 'sleep'
  | 'loneliness'
  | 'family'
  | 'grief'
  | 'health'
  | 'self_worth'
  | 'future'
  | 'anxiety'
  | 'general';

export type ConversationalNeed =
  | 'being_heard'
  | 'reassurance'
  | 'grounding'
  | 'perspective'
  | 'micro_steps'
  | 'de_escalation'
  | 'celebration'
  | 'safe_presence';

export type ResponseMode =
  | 'listen_and_explore'
  | 'validate_and_reflect'
  | 'calm_and_ground'
  | 'clarify'
  | 'encourage'
  | 'practical_micro_step'
  | 'celebrate'
  | 'safety_first'
  | 'knowledge_explanation';

export type LanguageType = 'roman_marathi' | 'english' | 'devanagari_marathi' | 'hinglish' | 'mixed';

export interface EmotionalState {
  emotion: EmotionType;
  intensity: number; // 0.0 to 1.0
  intent: IntentType;
  topic: TopicType;
  conversational_need: ConversationalNeed;
  risk_level: 'none' | 'low' | 'medium' | 'high' | 'severe';
  language: LanguageType;
  response_mode: ResponseMode;
}

export function detectLanguage(text: string): LanguageType {
  const devanagariRegex = /[\u0900-\u097F]/;
  const hasDevanagari = devanagariRegex.test(text);

  const lower = text.toLowerCase();
  const marathiMarkers = [
    'aahe', 'ahe', 'mala', 'tula', 'tujha', 'majha', 'kasa', 'kashi', 'kay', 'zala', 'jhala',
    'vatat', 'vatatay', 'vichar', 'manat', 'sobat', 'bolat', 'samaj', 'halka', 'shant', 'ekta',
    'ekti', 'hot', 'nahi', 'nahiy', 'nahiye', 'karto', 'karte', 'kela', 'pan', 'ani',
    'aani', 'mhanje', 'kiti', 'khup', 'kadhi', 'tar', 'sathi', 'aplya', 'gela', 'rahat'
  ];

  const hindiMarkers = [
    'mujhe', 'mera', 'meri', 'mere', 'tum', 'tumhe', 'aap', 'kya', 'kyun', 'kaise',
    'raha', 'rahi', 'rahe', 'hoga', 'hogi', 'karein', 'kare', 'karna', 'kuch', 'bahut',
    'samajh', 'yaar', 'bhai', 'lag', 'lagta', 'lagti', 'zindagi', 'chahiye', 'karo'
  ];

  let marathiWordCount = 0;
  let hindiWordCount = 0;
  const words = lower.replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean);
  for (const w of words) {
    if (marathiMarkers.includes(w)) marathiWordCount++;
    if (hindiMarkers.includes(w)) hindiWordCount++;
  }

  const marathiRatio = words.length > 0 ? marathiWordCount / words.length : 0;
  const hindiRatio = words.length > 0 ? hindiWordCount / words.length : 0;

  if (hasDevanagari) {
    return 'devanagari_marathi';
  }
  if (marathiRatio >= 0.25 || marathiWordCount >= 2) {
    return words.length > marathiWordCount + 2 ? 'mixed' : 'roman_marathi';
  }
  if (marathiWordCount === 1 && words.length <= 4) {
    return 'roman_marathi';
  }
  if (hindiRatio >= 0.20 || hindiWordCount >= 2) {
    return 'hinglish';
  }
  return 'english';
}

export function analyzeEmotionalState(text: string, riskLevel: 'none' | 'low' | 'medium' | 'high' | 'severe' = 'none'): EmotionalState {
  const lower = text.toLowerCase();
  const language = detectLanguage(text);

  // Safety first overrides
  if (riskLevel === 'severe' || riskLevel === 'high') {
    return {
      emotion: 'grief',
      intensity: 0.95,
      intent: 'crisis',
      topic: 'general',
      conversational_need: 'safe_presence',
      risk_level: riskLevel,
      language,
      response_mode: 'safety_first'
    };
  }

  // Topic & Emotion lexical/semantic scoring
  let emotion: EmotionType = 'supportive';
  let intent: IntentType = 'emotional_support';
  let topic: TopicType = 'general';
  let conversational_need: ConversationalNeed = 'being_heard';
  let response_mode: ResponseMode = 'validate_and_reflect';
  let intensity = 0.6;

  // 1. GREETING & CASUAL
  if (/^(hi|hello|hey|namaskar|good\s*(morning|evening|afternoon)|kaay|kasa\s*ahes|kashi\s*ahes)/i.test(lower.trim()) && lower.trim().split(/\s+/).length <= 4) {
    return {
      emotion: 'calm',
      intensity: 0.4,
      intent: 'greeting',
      topic: 'general',
      conversational_need: 'connection',
      risk_level: 'none',
      language,
      response_mode: 'listen_and_explore'
    };
  }

  // 2. LONELINESS / ISOLATION
  if (
    lower.includes('lonely') || lower.includes('alone') || lower.includes('ekta') || lower.includes('ekti') ||
    lower.includes('koni nahi') || lower.includes('nobody understands') || lower.includes('isolated') ||
    lower.includes('koni bolat nahi') || lower.includes('left out')
  ) {
    emotion = 'loneliness';
    topic = 'loneliness';
    intent = 'emotional_support';
    conversational_need = 'safe_presence';
    response_mode = 'validate_and_reflect';
    intensity = 0.78;
  }
  // 3. ACADEMIC / CAREER STRESS
  else if (
    lower.includes('exam') || lower.includes('study') || lower.includes('abhyas') || lower.includes('marks') ||
    lower.includes('college') || lower.includes('assignment') || lower.includes('job') || lower.includes('interview') ||
    lower.includes('placement') || lower.includes('career') || lower.includes('syllabus') || lower.includes('fail')
  ) {
    emotion = 'academic_stress';
    topic = lower.includes('job') || lower.includes('interview') || lower.includes('placement') ? 'career' : 'academic';
    intent = lower.includes('tip') || lower.includes('kay karu') || lower.includes('how to') ? 'practical_coping' : 'venting';
    conversational_need = intent === 'practical_coping' ? 'micro_steps' : 'being_heard';
    response_mode = intent === 'practical_coping' ? 'practical_micro_step' : 'validate_and_reflect';
    intensity = 0.75;
  }
  // 4. ANXIETY & OVERTHINKING
  else if (
    lower.includes('anxious') || lower.includes('anxiety') || lower.includes('panic') || lower.includes('ghabar') ||
    lower.includes('dhad dhad') || lower.includes('heart beat') || lower.includes('overthinking') ||
    lower.includes('satat vichar') || lower.includes('chinta') || lower.includes('restless') || lower.includes('future')
  ) {
    emotion = 'anxiety';
    topic = lower.includes('future') ? 'future' : 'anxiety';
    intent = 'emotional_support';
    conversational_need = lower.includes('panic') || lower.includes('dhad') ? 'grounding' : 'reassurance';
    response_mode = conversational_need === 'grounding' ? 'calm_and_ground' : 'validate_and_reflect';
    intensity = 0.82;
  }
  // 5. RELATIONSHIPS & HEARTBREAK
  else if (
    lower.includes('breakup') || lower.includes('partner') || lower.includes('boyfriend') || lower.includes('girlfriend') ||
    lower.includes('friend') || lower.includes('mitra') || lower.includes('bhandan') || lower.includes('fight') ||
    lower.includes('cheat') || lower.includes('ignored') || lower.includes('aai') || lower.includes('baba') || lower.includes('family')
  ) {
    emotion = 'relationship_conflict';
    topic = lower.includes('aai') || lower.includes('baba') || lower.includes('family') ? 'family' : 'relationships';
    intent = 'venting';
    conversational_need = 'being_heard';
    response_mode = 'listen_and_explore';
    intensity = 0.80;
  }
  // 6. SLEEP & EXHAUSTION
  else if (
    lower.includes('sleep') || lower.includes('zop') || lower.includes('insomnia') || lower.includes('tired') ||
    lower.includes('thakloy') || lower.includes('thakle') || lower.includes('exhausted') || lower.includes('wake up')
  ) {
    emotion = 'exhaustion';
    topic = 'sleep';
    intent = 'practical_coping';
    conversational_need = 'grounding';
    response_mode = 'calm_and_ground';
    intensity = 0.70;
  }
  // 7. ANGER & IRRITATION
  else if (
    lower.includes('angry') || lower.includes('raag') || lower.includes('mad') || lower.includes('irritated') ||
    lower.includes('chidchid') || lower.includes('unfair') || lower.includes('hate')
  ) {
    emotion = 'anger';
    topic = 'general';
    intent = 'venting';
    conversational_need = 'de_escalation';
    response_mode = 'listen_and_explore';
    intensity = 0.85;
  }
  // 8. CELEBRATION & JOY
  else if (
    lower.includes('happy') || lower.includes('anand') || lower.includes('excited') || lower.includes('passed') ||
    lower.includes('got selected') || lower.includes('good news') || lower.includes('changla zala') || lower.includes('celebrate')
  ) {
    emotion = 'celebration';
    topic = 'general';
    intent = 'celebration';
    conversational_need = 'celebration';
    response_mode = 'celebrate';
    intensity = 0.85;
  }
  // 9. SADNESS & DEJECTION
  else if (
    lower.includes('sad') || lower.includes('vait vatat') || lower.includes('crying') || lower.includes('radtoy') ||
    lower.includes('radte') || lower.includes('hurt') || lower.includes('dukhta') || lower.includes('worthless') ||
    lower.includes('low') || lower.includes('depressed')
  ) {
    emotion = 'sadness';
    topic = 'general';
    intent = 'emotional_support';
    conversational_need = 'safe_presence';
    response_mode = 'validate_and_reflect';
    intensity = 0.82;
  }
  // 10. KNOWLEDGE SEEKING / PSYCHOEDUCATION
  if (
    lower.includes('what is 54321') || lower.includes('5-4-3-2-1') || lower.includes('box breathing') ||
    lower.includes('grounding technique') || lower.includes('pomodoro') || lower.includes('sleep hygiene') ||
    lower.includes('technique sang') || lower.includes('kasa karaycha exercise')
  ) {
    intent = 'practical_coping';
    conversational_need = 'micro_steps';
    response_mode = 'knowledge_explanation';
  }

  return {
    emotion,
    intensity,
    intent,
    topic,
    conversational_need,
    risk_level: riskLevel,
    language,
    response_mode
  };
}
