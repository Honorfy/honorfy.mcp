import { z } from "zod";
declare const envSchema: z.ZodObject<{
    HONORFY_API_URL: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    HONORFY_USER_TOKEN: z.ZodString;
    HONORFY_DEFAULT_COMPANY_ID: z.ZodOptional<z.ZodString>;
    HONORFY_MCP_HTTP_TIMEOUT_MS: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    HONORFY_MCP_RATE_LIMIT_PER_MINUTE: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    HONORFY_MCP_TOOL_VERSION: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    HONORFY_API_URL: string;
    HONORFY_USER_TOKEN: string;
    HONORFY_MCP_HTTP_TIMEOUT_MS: number;
    HONORFY_MCP_RATE_LIMIT_PER_MINUTE: number;
    HONORFY_MCP_TOOL_VERSION: string;
    HONORFY_DEFAULT_COMPANY_ID?: string | undefined;
}, {
    HONORFY_USER_TOKEN: string;
    HONORFY_API_URL?: string | undefined;
    HONORFY_DEFAULT_COMPANY_ID?: string | undefined;
    HONORFY_MCP_HTTP_TIMEOUT_MS?: number | undefined;
    HONORFY_MCP_RATE_LIMIT_PER_MINUTE?: number | undefined;
    HONORFY_MCP_TOOL_VERSION?: string | undefined;
}>;
export type HonorfyMcpConfig = z.infer<typeof envSchema>;
export declare function loadConfig(env?: NodeJS.ProcessEnv): HonorfyMcpConfig;
export declare function normalizeBaseUrl(url: string): string;
export {};
//# sourceMappingURL=config.d.ts.map