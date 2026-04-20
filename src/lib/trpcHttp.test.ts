import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { EnvUserTokenProvider } from './auth.js';
import { HonorfyMcpError } from './errors.js';
import { trpcContextFromConfig, trpcGetJson } from './trpcHttp.js';
import type { HonorfyMcpConfig } from './config.js';

const baseConfig: HonorfyMcpConfig = {
  HONORFY_API_URL: 'http://localhost:3000',
  HONORFY_USER_TOKEN: 'jwt',
  HONORFY_MCP_HTTP_TIMEOUT_MS: 5000,
  HONORFY_MCP_RATE_LIMIT_PER_MINUTE: 120,
  HONORFY_MCP_TOOL_VERSION: 'v1',
};

describe('trpcGetJson', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('retorna result.data em sucesso', async () => {
    globalThis.fetch = vi.fn(async () => {
      return new Response(JSON.stringify({ result: { data: { ok: true } } }), { status: 200 });
    }) as unknown as typeof fetch;

    const ctx = trpcContextFromConfig(baseConfig, new EnvUserTokenProvider('jwt'), 'company1');
    const data = await trpcGetJson<{ ok: boolean }>('sale.list', { page: 1, limit: 10 }, ctx);
    expect(data).toEqual({ ok: true });
    expect(globalThis.fetch).toHaveBeenCalled();
    const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(url).toContain('/trpc/sale.list');
    expect(url).toContain('input=');
  });

  it('lança HonorfyMcpError em HTTP de erro', async () => {
    globalThis.fetch = vi.fn(async () => {
      return new Response(
        JSON.stringify({ error: { message: 'nope', data: { code: 'UNAUTHORIZED' } } }),
        { status: 401 }
      );
    }) as unknown as typeof fetch;

    const ctx = trpcContextFromConfig(baseConfig, new EnvUserTokenProvider('jwt'));
    await expect(trpcGetJson('company.listMyCompanies', {}, ctx)).rejects.toBeInstanceOf(HonorfyMcpError);
  });
});
