import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { HonorfyMcpConfig } from "../lib/config.js";
import type { AccessTokenProvider } from "../lib/auth.js";
import { SlidingWindowRateLimiter } from "../lib/rateLimit.js";
export type RegisterHonorfyToolsDeps = {
    config: HonorfyMcpConfig;
    tokenProvider: AccessTokenProvider;
    rateLimiter: SlidingWindowRateLimiter;
};
export declare function registerHonorfyTools(server: McpServer, deps: RegisterHonorfyToolsDeps): void;
//# sourceMappingURL=registerHonorfyTools.d.ts.map