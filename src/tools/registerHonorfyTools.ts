import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import {
  emptyInputSchema,
  getIncentiveGroupInputSchema,
  getIncentiveInputSchema,
  getPaymentInputSchema,
  getWalletConsolidatedBalanceInputSchema,
  getSaleInputSchema,
  listGroupParticipantsInputSchema,
  listIncentiveGroupsInputSchema,
  listIncentivesInputSchema,
  listMyCompaniesInputSchema,
  listPaymentsInputSchema,
  listSalesInputSchema,
  whoamiInputSchema,
} from '../schemas/honorfyMcpInputs.js';
import type { HonorfyMcpConfig } from '../lib/config.js';
import type { AccessTokenProvider } from '../lib/auth.js';
import { HONORFY_MCP_TOOLS_V1 } from '../lib/capabilities.js';
import { HonorfyMcpError } from '../lib/errors.js';
import { logStructured } from '../lib/logger.js';
import { SlidingWindowRateLimiter } from '../lib/rateLimit.js';
import { errorResult, jsonResult } from '../lib/toolResult.js';
import { trpcContextFromConfig, trpcGetJson } from '../lib/trpcHttp.js';

export type RegisterHonorfyToolsDeps = {
  config: HonorfyMcpConfig;
  tokenProvider: AccessTokenProvider;
  rateLimiter: SlidingWindowRateLimiter;
};

function pickCompanyId(candidate: unknown): string | undefined {
  if (!candidate || typeof candidate !== 'object') return undefined;
  const record = candidate as Record<string, unknown>;
  const raw = record.id ?? record.companyId;
  if (typeof raw === 'string' && raw.trim().length > 0) return raw;
  if (typeof raw === 'number' && Number.isFinite(raw)) return String(raw);
  return undefined;
}

function firstCompanyIdFromListResponse(payload: unknown): string | undefined {
  if (Array.isArray(payload)) {
    for (const item of payload) {
      const companyId = pickCompanyId(item);
      if (companyId) return companyId;
    }
    return undefined;
  }
  if (!payload || typeof payload !== 'object') return undefined;

  const record = payload as Record<string, unknown>;
  const arraysToScan = [record.items, record.companies, record.data];
  for (const list of arraysToScan) {
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      const companyId = pickCompanyId(item);
      if (companyId) return companyId;
    }
  }
  return pickCompanyId(payload);
}

async function resolveCompanyId(
  config: HonorfyMcpConfig,
  tokenProvider: AccessTokenProvider,
  companyId: string | undefined,
  required: boolean,
  cache: { inferredCompanyId?: string }
): Promise<string | undefined> {
  const resolved = companyId ?? config.HONORFY_DEFAULT_COMPANY_ID;
  if (resolved) return resolved;
  if (!required) return undefined;
  if (cache.inferredCompanyId) return cache.inferredCompanyId;

  const ctx = trpcContextFromConfig(config, tokenProvider, undefined);
  const companies = await trpcGetJson<unknown>('company.listMyCompanies', {}, ctx);
  const inferredCompanyId = firstCompanyIdFromListResponse(companies);
  if (inferredCompanyId) {
    cache.inferredCompanyId = inferredCompanyId;
    return inferredCompanyId;
  }

  throw new HonorfyMcpError({
    code: 'VALIDATION_ERROR',
    message:
      'companyId não informado e não foi possível inferir via company.listMyCompanies.',
    retryable: false,
  });
}

async function findInPaginated<T extends { id?: string }>(
  load: (page: number, limit: number) => Promise<{ items: T[]; totalPages: number }>,
  match: (item: T) => boolean,
  opts?: { maxPages?: number; pageLimit?: number }
): Promise<T | null> {
  const maxPages = opts?.maxPages ?? 30;
  const pageLimit = opts?.pageLimit ?? 50;
  for (let page = 1; page <= maxPages; page++) {
    const data = await load(page, pageLimit);
    const hit = data.items.find(match);
    if (hit) return hit;
    if (page >= (data.totalPages || 0)) break;
  }
  return null;
}

export function registerHonorfyTools(server: McpServer, deps: RegisterHonorfyToolsDeps): void {
  const { config, tokenProvider, rateLimiter } = deps;
  const companyIdCache: { inferredCompanyId?: string } = {};

  const run =
    <T>(toolName: string, handler: (args: T) => Promise<unknown>) =>
    async (args: T): Promise<{ content: Array<{ type: 'text'; text: string }>; isError?: boolean }> => {
      const requestId = randomUUID();
      const started = Date.now();
      rateLimiter.consume(toolName);
      logStructured({ level: 'info', tool: toolName, requestId, message: 'tool_start' });
      try {
        const out = await handler(args);
        logStructured({
          level: 'info',
          tool: toolName,
          requestId,
          durationMs: Date.now() - started,
          message: 'tool_ok',
        });
        return jsonResult(out);
      } catch (err) {
        logStructured({
          level: 'error',
          tool: toolName,
          requestId,
          durationMs: Date.now() - started,
          message: 'tool_error',
          extra: err instanceof HonorfyMcpError ? { code: err.payload.code } : undefined,
        });
        return errorResult(err);
      }
    };

  server.registerTool(
    'honorfy_list_companies',
    {
      title: 'Listar empresas (v1)',
      description:
        'Lista empresas do usuário autenticado (`company.listMyCompanies`). Não envia x-company-id.',
      inputSchema: listMyCompaniesInputSchema,
    },
    run('honorfy_list_companies', async (_args: z.infer<typeof listMyCompaniesInputSchema>) => {
      const ctx = trpcContextFromConfig(config, tokenProvider, undefined);
      return trpcGetJson('company.listMyCompanies', {}, ctx);
    })
  );

  server.registerTool(
    'honorfy_list_sales',
    {
      title: 'Listar vendas (v1)',
      description:
        'Lista vendas (`sale.list`). Usa companyId informado, default ou tenta inferir via `company.listMyCompanies`.',
      inputSchema: listSalesInputSchema,
    },
    run('honorfy_list_sales', async (args: z.infer<typeof listSalesInputSchema>) => {
      const companyId = await resolveCompanyId(
        config,
        tokenProvider,
        args.companyId,
        true,
        companyIdCache
      );
      const { companyId: _c, ...rest } = args;
      const ctx = trpcContextFromConfig(config, tokenProvider, companyId);
      return trpcGetJson('sale.list', rest, ctx);
    })
  );

  server.registerTool(
    'honorfy_get_sale',
    {
      title: 'Obter venda por ID (v1)',
      description:
        'Busca uma venda pelo id percorrendo páginas de `sale.list` (a API não expõe get único público).',
      inputSchema: getSaleInputSchema,
    },
    run('honorfy_get_sale', async (args: z.infer<typeof getSaleInputSchema>) => {
      const companyId = await resolveCompanyId(
        config,
        tokenProvider,
        args.companyId,
        true,
        companyIdCache
      );
      const ctx = trpcContextFromConfig(config, tokenProvider, companyId);
      const sale = await findInPaginated(
        async (page, limit) =>
          trpcGetJson<{
            items: Array<{ id?: string }>;
            totalPages: number;
          }>('sale.list', { page, limit }, ctx),
        (item) => String(item.id) === String(args.saleId)
      );
      if (!sale) {
        throw new HonorfyMcpError({
          code: 'NOT_FOUND',
          message: `Venda não encontrada: ${args.saleId}`,
          retryable: false,
        });
      }
      return sale;
    })
  );

  server.registerTool(
    'honorfy_list_payments',
    {
      title: 'Listar transações da carteira (v1)',
      description:
        'Lista transações (`payment.wallet.listTransactions`). Usa companyId informado, default ou inferido.',
      inputSchema: listPaymentsInputSchema,
    },
    run('honorfy_list_payments', async (args: z.infer<typeof listPaymentsInputSchema>) => {
      const companyId = await resolveCompanyId(
        config,
        tokenProvider,
        args.companyId,
        true,
        companyIdCache
      );
      const { companyId: _c, ...rest } = args;
      const ctx = trpcContextFromConfig(config, tokenProvider, companyId);
      return trpcGetJson('payment.wallet.listTransactions', rest, ctx);
    })
  );

  server.registerTool(
    'honorfy_get_wallet_consolidated_balance',
    {
      title: 'Obter saldo consolidado da carteira (v1)',
      description:
        'Retorna o consolidado da carteira (`payment.wallet.getConsolidatedBalance`), em centavos e por status.',
      inputSchema: getWalletConsolidatedBalanceInputSchema,
    },
    run(
      'honorfy_get_wallet_consolidated_balance',
      async (args: z.infer<typeof getWalletConsolidatedBalanceInputSchema>) => {
        const companyId = await resolveCompanyId(
          config,
          tokenProvider,
          args.companyId,
          true,
          companyIdCache
        );
        const ctx = trpcContextFromConfig(config, tokenProvider, companyId);
        return trpcGetJson('payment.wallet.getConsolidatedBalance', {}, ctx);
      }
    )
  );

  server.registerTool(
    'honorfy_get_payment',
    {
      title: 'Obter transação por ID (v1)',
      description: 'Localiza transação pelo id em páginas de `payment.wallet.listTransactions`.',
      inputSchema: getPaymentInputSchema,
    },
    run('honorfy_get_payment', async (args: z.infer<typeof getPaymentInputSchema>) => {
      const companyId = await resolveCompanyId(
        config,
        tokenProvider,
        args.companyId,
        true,
        companyIdCache
      );
      const ctx = trpcContextFromConfig(config, tokenProvider, companyId);
      const tx = await findInPaginated(
        async (page, limit) =>
          trpcGetJson<{ items: Array<{ id: string }>; totalPages: number }>(
            'payment.wallet.listTransactions',
            { page, limit },
            ctx
          ),
        (item) => String(item.id) === String(args.transactionId)
      );
      if (!tx) {
        throw new HonorfyMcpError({
          code: 'NOT_FOUND',
          message: `Transação não encontrada: ${args.transactionId}`,
          retryable: false,
        });
      }
      return tx;
    })
  );

  server.registerTool(
    'honorfy_list_incentives',
    {
      title: 'Listar incentivos (v1)',
      description: 'Lista incentivos (`gamification.listIncentives`).',
      inputSchema: listIncentivesInputSchema,
    },
    run('honorfy_list_incentives', async (args: z.infer<typeof listIncentivesInputSchema>) => {
      const companyId = await resolveCompanyId(
        config,
        tokenProvider,
        args.companyId,
        true,
        companyIdCache
      );
      const { companyId: _c, ...rest } = args;
      const ctx = trpcContextFromConfig(config, tokenProvider, companyId);
      return trpcGetJson('gamification.listIncentives', rest, ctx);
    })
  );

  server.registerTool(
    'honorfy_get_incentive',
    {
      title: 'Obter incentivo por ID (v1)',
      description: 'Detalhe do incentivo (`gamification.getIncentiveById`).',
      inputSchema: getIncentiveInputSchema,
    },
    run('honorfy_get_incentive', async (args: z.infer<typeof getIncentiveInputSchema>) => {
      const companyId = await resolveCompanyId(
        config,
        tokenProvider,
        args.companyId,
        true,
        companyIdCache
      );
      const { companyId: _c, incentiveId } = args;
      const ctx = trpcContextFromConfig(config, tokenProvider, companyId);
      return trpcGetJson('gamification.getIncentiveById', { incentiveId }, ctx);
    })
  );

  server.registerTool(
    'honorfy_list_incentive_groups',
    {
      title: 'Listar grupos de incentivo (v1)',
      description: 'Lista grupos (`gamification.listIncentiveGroups`).',
      inputSchema: listIncentiveGroupsInputSchema,
    },
    run('honorfy_list_incentive_groups', async (args: z.infer<typeof listIncentiveGroupsInputSchema>) => {
      const companyId = await resolveCompanyId(
        config,
        tokenProvider,
        args.companyId,
        true,
        companyIdCache
      );
      const { companyId: _c, ...rest } = args;
      const ctx = trpcContextFromConfig(config, tokenProvider, companyId);
      return trpcGetJson('gamification.listIncentiveGroups', rest, ctx);
    })
  );

  server.registerTool(
    'honorfy_get_incentive_group',
    {
      title: 'Obter grupo de incentivo por ID (v1)',
      description: 'Busca grupo pelo id via páginas de `gamification.listIncentiveGroups`.',
      inputSchema: getIncentiveGroupInputSchema,
    },
    run('honorfy_get_incentive_group', async (args: z.infer<typeof getIncentiveGroupInputSchema>) => {
      const companyId = await resolveCompanyId(
        config,
        tokenProvider,
        args.companyId,
        true,
        companyIdCache
      );
      const ctx = trpcContextFromConfig(config, tokenProvider, companyId);
      const group = await findInPaginated(
        async (page, limit) =>
          trpcGetJson<{ items: Array<{ id?: string }>; totalPages: number }>(
            'gamification.listIncentiveGroups',
            { page, limit },
            ctx
          ),
        (item) => String(item.id) === String(args.groupId)
      );
      if (!group) {
        throw new HonorfyMcpError({
          code: 'NOT_FOUND',
          message: `Grupo não encontrado: ${args.groupId}`,
          retryable: false,
        });
      }
      return group;
    })
  );

  server.registerTool(
    'honorfy_list_group_participants',
    {
      title: 'Listar participantes do grupo (v1)',
      description: 'Lista participantes (`gamification.listParticipants`) filtrando por groupId.',
      inputSchema: listGroupParticipantsInputSchema,
    },
    run('honorfy_list_group_participants', async (args: z.infer<typeof listGroupParticipantsInputSchema>) => {
      const companyId = await resolveCompanyId(
        config,
        tokenProvider,
        args.companyId,
        true,
        companyIdCache
      );
      const { companyId: _c, ...rest } = args;
      const ctx = trpcContextFromConfig(config, tokenProvider, companyId);
      return trpcGetJson('gamification.listParticipants', rest, ctx);
    })
  );

  server.registerTool(
    'honorfy_whoami',
    {
      title: 'Quem sou (v1)',
      description:
        'Perfil do usuário autenticado (`user.getProfile`); usa companyId informado, default ou inferido.',
      inputSchema: whoamiInputSchema,
    },
    run('honorfy_whoami', async (args: z.infer<typeof whoamiInputSchema>) => {
      const companyId = await resolveCompanyId(
        config,
        tokenProvider,
        args.companyId,
        true,
        companyIdCache
      );
      const ctx = trpcContextFromConfig(config, tokenProvider, companyId);
      return trpcGetJson('user.getProfile', {}, ctx);
    })
  );

  server.registerTool(
    'honorfy_capabilities',
    {
      title: 'Capacidades do MCP Honorfy (v1)',
      description: 'Lista tools disponíveis, versão e limites configurados (sem chamar a API).',
      inputSchema: emptyInputSchema,
    },
    run('honorfy_capabilities', async (_args: z.infer<typeof emptyInputSchema>) => ({
      toolVersion: config.HONORFY_MCP_TOOL_VERSION,
      transport: 'stdio',
      apiStyle: 'tRPC over HTTP GET (/trpc/<procedure>?input=...)',
      tools: [...HONORFY_MCP_TOOLS_V1],
      rateLimitPerMinute: config.HONORFY_MCP_RATE_LIMIT_PER_MINUTE,
      httpTimeoutMs: config.HONORFY_MCP_HTTP_TIMEOUT_MS,
      defaultCompanyIdConfigured: Boolean(config.HONORFY_DEFAULT_COMPANY_ID),
    }))
  );
}
