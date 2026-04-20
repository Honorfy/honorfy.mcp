import { z } from 'zod';

const envSchema = z.object({
  HONORFY_API_URL: z.string().url().describe('URL base da API (ex.: http://localhost:3000)'),
  HONORFY_USER_TOKEN: z.string().min(1).describe('JWT do usuário (Bearer)'),
  HONORFY_DEFAULT_COMPANY_ID: z.string().min(1).optional(),
  HONORFY_MCP_HTTP_TIMEOUT_MS: z.coerce.number().int().positive().optional().default(25_000),
  HONORFY_MCP_RATE_LIMIT_PER_MINUTE: z.coerce.number().int().positive().optional().default(120),
  HONORFY_MCP_TOOL_VERSION: z.string().optional().default('v1'),
});

export type HonorfyMcpConfig = z.infer<typeof envSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): HonorfyMcpConfig {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Variáveis de ambiente inválidas: ${msg}`);
  }
  return parsed.data;
}

export function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}
