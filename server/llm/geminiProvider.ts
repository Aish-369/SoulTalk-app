import { GoogleGenAI } from '@google/genai';
import { LLMProvider, CompletionRequest, CompletionResponse } from './llmProvider';

export class GeminiLLMProvider implements LLMProvider {
  public name = 'GoogleGemini';
  private ai: GoogleGenAI | null = null;
  private candidateModels: string[];

  constructor(preferredModel: string = 'gemini-3-flash-preview') {
    this.candidateModels = [
      preferredModel,
      'gemini-3.1-flash-lite-preview',
      'gemini-flash-latest',
      'gemini-3.5-flash'
    ];
  }

  private getClient(): GoogleGenAI | null {
    if (!this.ai && process.env.GEMINI_API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return this.ai;
  }

  public async isAvailable(): Promise<boolean> {
    return Boolean(process.env.GEMINI_API_KEY);
  }

  public async generateCompletion(req: CompletionRequest): Promise<CompletionResponse> {
    const startTime = Date.now();
    const client = this.getClient();
    if (!client) {
      return {
        success: false,
        content: '',
        modelUsed: this.candidateModels[0],
        provider: this.name,
        latencyMs: Date.now() - startTime,
        error: 'GEMINI_API_KEY not configured'
      };
    }

    // Development logging for prompt verification (no secrets)
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[GeminiLLMProvider] Sending prompt for user message: "${req.userMessage.slice(0, 80)}"`);
      console.log(`[GeminiLLMProvider] System Prompt length: ${req.systemPrompt.length} chars | History turns: ${req.messages.length}`);
    }

    // Build conversation contents for generateContent
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    for (const m of req.messages) {
      contents.push({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: req.userMessage }]
    });

    let lastError = '';
    // Try candidate models in order to ensure resilience against temporary 503 high demand or 429 quota spikes
    for (const modelToTry of this.candidateModels) {
      try {
        // Enforce 8.5s timeout per candidate model attempt
        const generatePromise = client.models.generateContent({
          model: modelToTry,
          contents,
          config: {
            systemInstruction: req.systemPrompt,
            temperature: req.temperature ?? 0.8,
            maxOutputTokens: req.maxTokens ?? 800,
            thinkingConfig: {
              thinkingBudget: 0
            }
          }
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout after 8500ms on ${modelToTry}`)), 8500)
        );

        const response = await Promise.race([generatePromise, timeoutPromise]);

        const reply = response.text || '';
        if (reply.trim()) {
          return {
            success: true,
            content: reply.trim(),
            modelUsed: modelToTry,
            provider: this.name,
            latencyMs: Date.now() - startTime
          };
        }
      } catch (err: any) {
        const status = err?.status || err?.code || (err?.message?.includes('503') ? 503 : (err?.message?.includes('429') ? 429 : 500));
        lastError = `Model ${modelToTry} unavailable (${status}): ${err?.message || ''}`;
        console.log(`[GeminiLLMProvider] ${modelToTry} failed or busy (${status}), failing over to next candidate...`);
      }
    }

    return {
      success: false,
      content: '',
      modelUsed: this.candidateModels[0],
      provider: this.name,
      latencyMs: Date.now() - startTime,
      error: lastError || 'All candidate Gemini models failed to respond'
    };
  }
}

export const geminiLLM = new GeminiLLMProvider('gemini-3-flash-preview');
