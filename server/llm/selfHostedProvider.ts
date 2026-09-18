import http from 'http';
import https from 'https';
import { LLMProvider, CompletionRequest, CompletionResponse, ChatMessage } from './llmProvider';
import { LLMConfig, getLLMConfig } from './llmConfig';

export class SelfHostedLLMProvider implements LLMProvider {
  public name = 'SelfHostedOpenSourceLLM';
  private config: LLMConfig;

  constructor(customConfig?: LLMConfig) {
    this.config = customConfig || getLLMConfig();
  }

  public updateConfig() {
    this.config = getLLMConfig();
  }

  public async isAvailable(): Promise<boolean> {
    this.updateConfig();
    if (!this.config.endpointUrl) {
      return false;
    }

    try {
      const isOllama = this.config.providerType === 'self_hosted_ollama';
      const healthUrl = isOllama
        ? `${this.config.endpointUrl}/api/tags`
        : `${this.config.endpointUrl}/models`;

      const parsed = new URL(healthUrl);
      const isHttps = parsed.protocol === 'https:';
      const client = isHttps ? https : http;

      const headers: Record<string, string> = {};
      if (this.config.apiKey) {
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
      }

      return await new Promise<boolean>((resolve) => {
        const req = client.get(
          parsed.toString(),
          { headers, timeout: 1500 },
          (res) => {
            resolve(res.statusCode === 200);
          }
        );
        req.on('error', () => resolve(false));
        req.on('timeout', () => {
          req.destroy();
          resolve(false);
        });
      });
    } catch {
      return false;
    }
  }

  public async generateCompletion(req: CompletionRequest): Promise<CompletionResponse> {
    const startTime = Date.now();
    this.updateConfig();

    if (!this.config.endpointUrl) {
      return {
        success: false,
        content: '',
        modelUsed: 'none',
        provider: this.name,
        latencyMs: 0,
        error: 'No self-hosted LLM endpoint configured.'
      };
    }

    const messages: ChatMessage[] = [
      { role: 'system', content: req.systemPrompt }
    ];

    if (req.messages && req.messages.length > 0) {
      req.messages.slice(-6).forEach(m => {
        messages.push({ role: m.role, content: m.content });
      });
    }

    messages.push({ role: 'user', content: req.userMessage });

    const isOllama = this.config.providerType === 'self_hosted_ollama';
    const targetPath = isOllama ? '/api/chat' : '/chat/completions';
    const targetUrl = `${this.config.endpointUrl}${targetPath}`;

    let payload: any;
    if (isOllama) {
      payload = {
        model: this.config.modelName,
        messages,
        stream: false,
        options: {
          temperature: req.temperature || this.config.temperature,
          top_p: this.config.topP,
          num_predict: req.maxTokens || this.config.maxTokens
        }
      };
    } else {
      // Standard OpenAI / vLLM / LocalAI compatible payload
      payload = {
        model: this.config.modelName,
        messages,
        temperature: req.temperature || this.config.temperature,
        top_p: this.config.topP,
        max_tokens: req.maxTokens || this.config.maxTokens,
        stream: false
      };
    }

    const payloadString = JSON.stringify(payload);

    try {
      const parsed = new URL(targetUrl);
      const isHttps = parsed.protocol === 'https:';
      const client = isHttps ? https : http;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Content-Length': String(Buffer.byteLength(payloadString))
      };

      if (this.config.apiKey) {
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
      }

      const responseBody = await new Promise<string>((resolve, reject) => {
        const r = client.request(
          parsed.toString(),
          {
            method: 'POST',
            headers,
            timeout: this.config.timeoutMs
          },
          (res) => {
            let body = '';
            res.on('data', chunk => (body += chunk));
            res.on('end', () => {
              if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                resolve(body);
              } else {
                reject(new Error(`Inference server HTTP ${res.statusCode}: ${body}`));
              }
            });
          }
        );

        r.on('error', reject);
        r.on('timeout', () => {
          r.destroy();
          reject(new Error(`Inference server timed out after ${this.config.timeoutMs}ms`));
        });

        r.write(payloadString);
        r.end();
      });

      const parsedJson = JSON.parse(responseBody);
      let content = '';

      if (isOllama) {
        content = parsedJson.message?.content || parsedJson.response || '';
      } else {
        content = parsedJson.choices?.[0]?.message?.content || '';
      }

      return {
        success: Boolean(content && content.trim().length > 0),
        content: content.trim(),
        modelUsed: this.config.modelName,
        provider: `${this.name} (${this.config.providerType})`,
        latencyMs: Date.now() - startTime
      };
    } catch (err: any) {
      return {
        success: false,
        content: '',
        modelUsed: this.config.modelName,
        provider: this.name,
        latencyMs: Date.now() - startTime,
        error: err?.message || String(err)
      };
    }
  }
}

export const selfHostedLLM = new SelfHostedLLMProvider();
