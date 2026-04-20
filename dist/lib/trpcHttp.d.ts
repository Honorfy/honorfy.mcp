import type { HonorfyMcpConfig } from "./config.js";
import type { AccessTokenProvider } from "./auth.js";
export type TrpcRequestContext = {
    baseUrl: string;
    tokenProvider: AccessTokenProvider;
    timeoutMs: number;
    companyId?: string;
};
export declare function trpcGetJson<T>(procedurePath: string, input: unknown, ctx: TrpcRequestContext): Promise<T>;
export declare function trpcContextFromConfig(config: HonorfyMcpConfig, tokenProvider: AccessTokenProvider, companyId?: string): TrpcRequestContext;
//# sourceMappingURL=trpcHttp.d.ts.map