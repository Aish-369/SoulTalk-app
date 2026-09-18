import { GoogleGenAI } from '@google/genai';
import { LLMProvider, CompletionRequest, CompletionResponse } from './llmProvider';

export class GeminiLLMProvider implements LLMProvider {
  public name = 'GoogleGemini';
  private ai: GoogleGenAI | null = null;
  private modelName: string;

  constructor(modelName: string = 'gemini-2.5-flash') {
    this.modelName = modelName;
  }

  private getClient(): GoogleGenAI | null {
    if (!this.ai && process.env.GEMINI_API_KEY) {
      this.ai = new GoogleGenAI();
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
        modelUsed: this.modelName,
        provider: this.name,
        latencyMs: Date.now() - startTime,
        error: 'GEMINI_API_KEY not configured'
      };
    }

    try {
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

      const response = await client.models.generateContent({
        model: this.modelName,
        contents,
        config: {
          systemInstruction: req.systemPrompt,
          temperature: req.temperature ?? 0.7,
          maxOutputTokens: req.maxTokens ?? 500
        }
      });

      const reply = response.text || '';
      return {
        success: Boolean(reply),
        content: reply.trim(),
        modelUsed: this.modelName,
        provider: this.name,
        latencyMs: Date.now() - startTime
      };
    } catch (err: any) {
      return {
        success: false,
        content: '',
        modelUsed: this.modelName,
        provider: this.name,
        latencyMs: Date.now() - startTime,
        error: err?.message || String(err)
      };
    }
  }
}

export const geminiLLM = new GeminiLLMProvider();
