import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createAccessTokenProvider } from './lib/auth.js';
import { loadConfig } from './lib/config.js';
import { logStructured } from './lib/logger.js';
import { SlidingWindowRateLimiter } from './lib/rateLimit.js';
import { registerHonorfyTools } from './tools/registerHonorfyTools.js';

async function main(): Promise<void> {
  const config = loadConfig();
  const tokenProvider = createAccessTokenProvider(config);
  const rateLimiter = new SlidingWindowRateLimiter(config.HONORFY_MCP_RATE_LIMIT_PER_MINUTE);

  const server = new McpServer(
    { name: 'honorfy-mcp', version: '0.1.0' },
    {
      instructions:
        'MCP Honorfy v1 (somente leitura). Chama a API via HTTP GET em /trpc. Defina HONORFY_USER_TOKEN e opcionalmente HONORFY_API_URL (padrão https://api.honorfy.io) e HONORFY_DEFAULT_COMPANY_ID. Veja docs/mcp/honorfy.md.',
    }
  );

  registerHonorfyTools(server, { config, tokenProvider, rateLimiter });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  logStructured({
    level: 'info',
    requestId: 'bootstrap',
    message: 'mcp_honorfy_connected_stdio',
  });
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  logStructured({
    level: 'error',
    requestId: 'bootstrap',
    message: 'mcp_honorfy_fatal',
    extra: { error: message },
  });
  process.exit(1);
});
