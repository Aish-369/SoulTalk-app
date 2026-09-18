import { EmotionalState } from './emotionalStateEngine';
import { GenerationMode } from './conversationRouter';
import { validateAndSanitizeResponse, generateDiverseFallback } from './qualityGuard';
import { selfHostedLLM } from './llm/selfHostedProvider';
import { getLLMConfig } from './llm/llmConfig';

export interface ModelGenerationRequest {
  systemPrompt: string;
  userMessage: string;
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  emotionalState: EmotionalState;
  userName: string;
  companionName: string;
  generationMode: GenerationMode;
  contextUsed: boolean;
  knowledgeRetrieved: boolean;
}

export interface ModelGenerationResult {
  replyText: string;
  modelUsed: string;
  engineUsed: 'SELF_HOSTED_LLM' | 'LOCAL_GENERATIVE' | 'FALLBACK';
  generationMode: GenerationMode;
  contextUsed: boolean;
  knowledgeRetrieved: boolean;
  trainingExemplarUsed: false; // Explicit guarantee: strictly false in production
  validated: boolean;
  qualityViolations: string[];
}

export async function generateCompanionResponse(
  req: ModelGenerationRequest
): Promise<ModelGenerationResult> {
  const {
    systemPrompt,
    userMessage,
    chatHistory,
    emotionalState,
    userName,
    companionName,
    generationMode,
    contextUsed,
    knowledgeRetrieved
  } = req;

  let rawReply = '';
  let modelUsed = 'none';
  let engineUsed: 'SELF_HOSTED_LLM' | 'LOCAL_GENERATIVE' | 'FALLBACK' = 'LOCAL_GENERATIVE';

  // 1. Primary Engine: Self-Hosted Open-Source LLM (vLLM / Ollama / OpenAI-Compatible Private Endpoint)
  // ZERO dependence on Gemini API tokens.
  const config = getLLMConfig();
  if (config.endpointUrl) {
    try {
      const llmResult = await selfHostedLLM.generateCompletion({
        systemPrompt,
        messages: chatHistory.slice(-6),
        userMessage,
        temperature: config.temperature,
        maxTokens: config.maxTokens
      });

      if (llmResult.success && llmResult.content && llmResult.content.length > 3) {
        rawReply = llmResult.content;
        modelUsed = llmResult.modelUsed;
        engineUsed = 'SELF_HOSTED_LLM';
      } else {
        console.warn('[ModelAdapter] Self-hosted LLM inference failed or returned empty:', llmResult.error);
      }
    } catch (llmErr: any) {
      console.warn('[ModelAdapter] Self-hosted LLM invocation exception:', llmErr?.message || llmErr);
    }
  }

  // 2. Last-Resort Graceful Degradation (Engages ONLY if the self-hosted inference server is down)
  // Transparently labeled as LOCAL_GENERATIVE. Never claimed to be a real neural LLM.
  if (!rawReply) {
    rawReply = generateDiverseFallback(emotionalState, userName, companionName, userMessage);
    modelUsed = 'soultalk-graceful-resilience-engine';
    engineUsed = 'LOCAL_GENERATIVE';
  }

  // 3. Quality & Safety Guard Validation
  let guardResult = validateAndSanitizeResponse(rawReply, emotionalState, userName);
  if (guardResult.needsRegeneration) {
    console.warn('[ModelAdapter] Quality Guard flagged violations:', guardResult.violations);
    rawReply = generateDiverseFallback(emotionalState, userName, companionName, userMessage);
    guardResult = validateAndSanitizeResponse(rawReply, emotionalState, userName);
  }

  return {
    replyText: guardResult.sanitizedText,
    modelUsed,
    engineUsed,
    generationMode,
    contextUsed,
    knowledgeRetrieved,
    trainingExemplarUsed: false,
    validated: guardResult.isValid,
    qualityViolations: guardResult.violations
  };
}
