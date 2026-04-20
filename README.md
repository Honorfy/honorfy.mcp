# Honorfy MCP Server

Servidor MCP read-only para consultar dados da API Honorfy via tRPC HTTP (`/trpc/<procedure>?input=...`).

## Requisitos

- Node.js `^20.19.0 || >=22.12.0`
- `pnpm`
- Token JWT de usuário Honorfy válido

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `HONORFY_API_URL` | não | URL base da API (padrão: `https://api.honorfy.io`) |
| `HONORFY_USER_TOKEN` | sim | JWT do usuário (Bearer) |
| `HONORFY_DEFAULT_COMPANY_ID` | não | Empresa padrão para tools com `x-company-id` |
| `HONORFY_MCP_HTTP_TIMEOUT_MS` | não | Timeout HTTP em ms (padrão `25000`) |
| `HONORFY_MCP_RATE_LIMIT_PER_MINUTE` | não | Limite por minuto por tool (padrão `120`) |
| `HONORFY_MCP_TOOL_VERSION` | não | Versão exposta em `honorfy_capabilities` (padrão `v1`) |

## Instalação

```bash
pnpm install
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm test
pnpm check-types
```

## Como rodar localmente

1. Defina as variáveis de ambiente obrigatórias (`HONORFY_USER_TOKEN`).
2. Gere o build:

```bash
pnpm build
```

3. Inicie o servidor MCP:

```bash
pnpm start
```

## Configuração no Cursor (exemplo)

No `mcp.json` do Cursor:

```json
{
  "mcpServers": {
    "honorfy": {
      "command": "node",
      "args": ["<caminho>/dist/server.js"],
      "env": {
        "HONORFY_USER_TOKEN": "${env:HONORFY_USER_TOKEN}",
        "HONORFY_DEFAULT_COMPANY_ID": ""
      }
    }
  }
}
```

## Ferramentas disponíveis (v1)

- `honorfy_list_companies`
- `honorfy_list_sales`
- `honorfy_get_sale`
- `honorfy_list_payments`
- `honorfy_get_payment`
- `honorfy_list_incentives`
- `honorfy_get_incentive`
- `honorfy_list_incentive_groups`
- `honorfy_get_incentive_group`
- `honorfy_list_group_participants`
- `honorfy_whoami`
- `honorfy_capabilities`

## Observações

- O servidor é somente leitura.
- Tools com escopo de empresa usam `companyId` explícito, `HONORFY_DEFAULT_COMPANY_ID` ou inferência via `company.listMyCompanies` quando aplicável.
