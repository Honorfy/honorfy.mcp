import { HonorfyMcpError } from "./errors.js";
/**
 * Rate limit simples em memória (por instância do processo MCP).
 */
export class SlidingWindowRateLimiter {
    maxPerMinute;
    windowMs;
    buckets = new Map();
    constructor(maxPerMinute, windowMs = 60_000) {
        this.maxPerMinute = maxPerMinute;
        this.windowMs = windowMs;
    }
    consume(key) {
        const now = Date.now();
        const existing = this.buckets.get(key);
        if (!existing || now - existing.windowStartMs >= this.windowMs) {
            this.buckets.set(key, { count: 1, windowStartMs: now });
            return;
        }
        if (existing.count >= this.maxPerMinute) {
            throw new HonorfyMcpError({
                code: "RATE_LIMITED",
                message: `Limite de chamadas por minuto excedido (${this.maxPerMinute}). Aguarde e tente novamente.`,
                retryable: true,
            });
        }
        existing.count += 1;
    }
}
//# sourceMappingURL=rateLimit.js.map