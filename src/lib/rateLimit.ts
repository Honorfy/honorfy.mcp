import { HonorfyMcpError } from './errors.js';

type Bucket = { count: number; windowStartMs: number };

/**
 * Rate limit simples em memória (por instância do processo MCP).
 */
export class SlidingWindowRateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(
    private readonly maxPerMinute: number,
    private readonly windowMs: number = 60_000
  ) {}

  consume(key: string): void {
    const now = Date.now();
    const existing = this.buckets.get(key);
    if (!existing || now - existing.windowStartMs >= this.windowMs) {
      this.buckets.set(key, { count: 1, windowStartMs: now });
      return;
    }
    if (existing.count >= this.maxPerMinute) {
      throw new HonorfyMcpError({
        code: 'RATE_LIMITED',
        message: `Limite de chamadas por minuto excedido (${this.maxPerMinute}). Aguarde e tente novamente.`,
        retryable: true,
      });
    }
    existing.count += 1;
  }
}
