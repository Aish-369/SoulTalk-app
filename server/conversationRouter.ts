import { EmotionalState } from './emotionalStateEngine';
import { CrisisCheckResult } from './safetyEngine';

export type GenerationMode =
  | 'GENERATIVE'
  | 'KNOWLEDGE_RAG_GENERATIVE'
  | 'SAFETY_FIRST'
  | 'CONTEXTUAL_GENERATIVE'
  | 'LOCAL_GENERATIVE'
  | 'FALLBACK';

export interface RoutingDecision {
  mode: GenerationMode;
  retrieveKnowledge: boolean;
  knowledgeTopic?: string;
  reason: string;
}

const KNOWLEDGE_INTENT_TRIGGERS = [
  'technique', 'exercise', '5-4-3-2-1', '54321', 'box breathing', 'breathing',
  'pomodoro', 'sleep hygiene', 'coping', 'grounding', 'tips', 'kay karu',
  'steps sang', 'kasa karu', 'upay sang', 'guide kar'
];

export function routeConversation(
  text: string,
  state: EmotionalState,
  crisis: CrisisCheckResult,
  historyCount: number
): RoutingDecision {
  const lower = text.toLowerCase();

  // 1. Safety First Route (Severe / High Risk)
  if (crisis.isCrisis && (crisis.level === 'severe' || crisis.level === 'high')) {
    return {
      mode: 'SAFETY_FIRST',
      retrieveKnowledge: false,
      reason: `Crisis level ${crisis.level} detected: immediate deterministic safety holding`
    };
  }

  // 2. Explicit or Implicit Knowledge Request
  const asksForTechnique = KNOWLEDGE_INTENT_TRIGGERS.some(trigger => lower.includes(trigger));
  if (asksForTechnique || state.response_mode === 'knowledge_explanation') {
    let topic = state.topic;
    if (lower.includes('breath') || lower.includes('shwas') || lower.includes('panic')) {
      topic = 'anxiety';
    } else if (lower.includes('abhyas') || lower.includes('study') || lower.includes('focus')) {
      topic = 'academic';
    } else if (lower.includes('zop') || lower.includes('sleep')) {
      topic = 'sleep';
    } else if (lower.includes('lonely') || lower.includes('ekta')) {
      topic = 'loneliness';
    }

    return {
      mode: 'KNOWLEDGE_RAG_GENERATIVE',
      retrieveKnowledge: true,
      knowledgeTopic: topic,
      reason: `User requested wellness/coping technique for topic: ${topic}`
    };
  }

  // 3. Contextual Multi-Turn Generative (if user has active conversational history)
  if (historyCount >= 2 && !/^(hi|hello|hey|namaskar)/i.test(text.trim())) {
    return {
      mode: 'CONTEXTUAL_GENERATIVE',
      retrieveKnowledge: false,
      reason: 'Ongoing conversational thread with recent user history'
    };
  }

  // 4. Standard Generative Mode
  return {
    mode: 'GENERATIVE',
    retrieveKnowledge: false,
    reason: `Normal emotional conversation in mode: ${state.response_mode}`
  };
}
