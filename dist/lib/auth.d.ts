import type { HonorfyMcpConfig } from "./config.js";
/**
 * Abstração de autenticação: v1 lê token do ambiente; futuro OAuth pode implementar a mesma interface.
 */
export interface AccessTokenProvider {
    getAccessToken(): Promise<string>;
}
export declare class EnvUserTokenProvider implements AccessTokenProvider {
    private readonly token;
    constructor(token: string);
    getAccessToken(): Promise<string>;
}
export declare function createAccessTokenProvider(config: HonorfyMcpConfig): AccessTokenProvider;
//# sourceMappingURL=auth.d.ts.map