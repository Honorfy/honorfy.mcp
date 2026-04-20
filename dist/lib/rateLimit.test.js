import { describe, expect, it } from "vitest";
import { HonorfyMcpError } from "./errors.js";
import { SlidingWindowRateLimiter } from "./rateLimit.js";
describe("SlidingWindowRateLimiter", () => {
    it("bloqueia após exceder o limite na janela", () => {
        const rl = new SlidingWindowRateLimiter(2, 60_000);
        rl.consume("t");
        rl.consume("t");
        expect(() => rl.consume("t")).toThrow(HonorfyMcpError);
    });
});
//# sourceMappingURL=rateLimit.test.js.map