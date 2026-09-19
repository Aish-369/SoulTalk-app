import { EmotionalState } from './emotionalStateEngine';
import { GenerationMode } from './conversationRouter';
import { validateAndSanitizeResponse, generateDiverseFallback } from './qualityGuard';
import { selfHostedLLM } from './llm/selfHostedProvider';
import { geminiLLM } from './llm/geminiProvider';
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
  rawModelResponse: string;
  modelUsed: string;
  modelProvider: string;
  engineUsed: 'GEMINI_LLM' | 'SELF_HOSTED_LLM' | 'LOCAL_GENERATIVE' | 'FALLBACK';
  generationMode: GenerationMode;
  contextUsed: boolean;
  knowledgeRetrieved: boolean;
  trainingExemplarUsed: false; // Explicit guarantee: strictly false in production
  validated: boolean;
  qualityViolations: string[];
  fallbackUsed: boolean;
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
  let modelProvider = 'none';
  let engineUsed: 'GEMINI_LLM' | 'SELF_HOSTED_LLM' | 'LOCAL_GENERATIVE' | 'FALLBACK' = 'LOCAL_GENERATIVE';
  let fallbackUsed = false;

  // 1. Primary Option A: Self-Hosted Open-Source LLM if configured
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
        modelProvider = 'self_hosted';
        engineUsed = 'SELF_HOSTED_LLM';
        fallbackUsed = false;
      } else {
        console.warn('[ModelAdapter] Self-hosted LLM inference failed or returned empty:', llmResult.error);
      }
    } catch (llmErr: any) {
      console.warn('[ModelAdapter] Self-hosted LLM invocation exception:', llmErr?.message || llmErr);
    }
  }

  // 2. Primary Option B: Google Gemini API
  if (!rawReply && (await geminiLLM.isAvailable())) {
    try {
      const geminiRes = await geminiLLM.generateCompletion({
        systemPrompt,
        messages: chatHistory.slice(-6),
        userMessage,
        temperature: config.temperature ?? 0.8,
        maxTokens: config.maxTokens ?? 800
      });

      if (geminiRes.success && geminiRes.content && geminiRes.content.length > 3) {
        rawReply = geminiRes.content;
        modelUsed = geminiRes.modelUsed;
        modelProvider = 'google_gemini';
        engineUsed = 'GEMINI_LLM';
        fallbackUsed = false;
      } else {
        console.warn('[ModelAdapter] Gemini generation failed:', geminiRes.error);
      }
    } catch (geminiErr: any) {
      console.warn('[ModelAdapter] Gemini generation exception:', geminiErr?.message || geminiErr);
    }
  }

  // 3. Last-Resort Graceful Degradation (Engages ONLY if all live inference endpoints are down)
  if (!rawReply) {
    rawReply = generateDiverseFallback(emotionalState, userName, companionName, userMessage);
    modelUsed = 'soultalk-graceful-resilience-engine';
    modelProvider = 'fallback_engine';
    engineUsed = 'FALLBACK';
    fallbackUsed = true;
  }

  const rawModelResponse = rawReply;

  // 4. Quality & Safety Guard Validation
  let guardResult = validateAndSanitizeResponse(rawReply, emotionalState, userName);
  if (guardResult.needsRegeneration) {
    console.warn('[ModelAdapter] Quality Guard flagged violations:', guardResult.violations);
    const hasCriticalViolation = guardResult.violations.some(v =>
      v.includes('System prompt leak') ||
      v.includes('Unhealthy codependency') ||
      v.includes('Medical diagnosis') ||
      v.includes('unreasonably short')
    );
    if (hasCriticalViolation || !rawReply || rawReply.length < 8) {
      rawReply = generateDiverseFallback(emotionalState, userName, companionName, userMessage);
      modelUsed = 'soultalk-graceful-resilience-engine';
      modelProvider = 'fallback_engine';
      engineUsed = 'FALLBACK';
      fallbackUsed = true;
      guardResult = validateAndSanitizeResponse(rawReply, emotionalState, userName);
    }
  }

  return {
    replyText: guardResult.sanitizedText,
    rawModelResponse,
    modelUsed,
    modelProvider,
    engineUsed,
    generationMode,
    contextUsed,
    knowledgeRetrieved,
    trainingExemplarUsed: false,
    validated: guardResult.isValid,
    qualityViolations: guardResult.violations,
    fallbackUsed
  };
}
