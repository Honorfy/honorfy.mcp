/**
 * Rate limit simples em memória (por instância do processo MCP).
 */
export declare class SlidingWindowRateLimiter {
    private readonly maxPerMinute;
    private readonly windowMs;
    private readonly buckets;
    constructor(maxPerMinute: number, windowMs?: number);
    consume(key: string): void;
}
//# sourceMappingURL=rateLimit.d.ts.map