import type { HonorfyMcpConfig } from "./config.js";

/**
 * Abstração de autenticação: v1 lê token do ambiente; futuro OAuth pode implementar a mesma interface.
 */
export interface AccessTokenProvider {
  getAccessToken(): Promise<string>;
}

export class EnvUserTokenProvider implements AccessTokenProvider {
  constructor(private readonly token: string) {}

  async getAccessToken(): Promise<string> {
    return this.token;
  }
}

export function createAccessTokenProvider(
  config: HonorfyMcpConfig,
): AccessTokenProvider {
  return new EnvUserTokenProvider(config.HONORFY_USER_TOKEN);
}
