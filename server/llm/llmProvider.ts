export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CompletionRequest {
  systemPrompt: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  userMessage: string;
  temperature?: number;
  maxTokens?: number;
}

export interface CompletionResponse {
  success: boolean;
  content: string;
  modelUsed: string;
  provider: string;
  latencyMs: number;
  error?: string;
}

export interface LLMProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  generateCompletion(req: CompletionRequest): Promise<CompletionResponse>;
}
