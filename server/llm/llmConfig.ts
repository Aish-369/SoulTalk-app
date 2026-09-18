export interface LLMConfig {
  providerType: 'self_hosted_vllm' | 'self_hosted_ollama' | 'openai_compatible' | 'none';
  endpointUrl: string;
  apiKey?: string;
  modelName: string;
  timeoutMs: number;
  maxTokens: number;
  temperature: number;
  topP: number;
}

export function getLLMConfig(): LLMConfig {
  const customEndpoint = process.env.SELF_HOSTED_LLM_URL || process.env.OPENAI_BASE_URL || process.env.OLLAMA_URL;
  const apiKey = process.env.SELF_HOSTED_LLM_API_KEY || process.env.OPENAI_API_KEY || '';
  const modelName = process.env.SELF_HOSTED_LLM_MODEL || process.env.OLLAMA_MODEL || process.env.LLM_MODEL || 'qwen2.5:3b-instruct';

  if (customEndpoint && customEndpoint.trim().length > 0) {
    const isOllama = customEndpoint.includes('11434') || customEndpoint.includes('/api/chat');
    return {
      providerType: isOllama ? 'self_hosted_ollama' : 'openai_compatible',
      endpointUrl: customEndpoint.replace(/\/$/, ''),
      apiKey,
      modelName,
      timeoutMs: parseInt(process.env.SELF_HOSTED_LLM_TIMEOUT_MS || '7000', 10),
      maxTokens: parseInt(process.env.SELF_HOSTED_LLM_MAX_TOKENS || '300', 10),
      temperature: 0.7,
      topP: 0.9
    };
  }

  return {
    providerType: 'none',
    endpointUrl: '',
    apiKey: '',
    modelName,
    timeoutMs: 5000,
    maxTokens: 300,
    temperature: 0.7,
    topP: 0.9
  };
}
