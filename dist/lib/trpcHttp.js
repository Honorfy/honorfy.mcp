import { normalizeBaseUrl } from "./config.js";
import { HonorfyMcpError, isRetryableStatus, mapHttpStatusToCode, } from "./errors.js";
function buildUrl(baseUrl, procedurePath, input) {
    const url = new URL(`${normalizeBaseUrl(baseUrl)}/trpc/${procedurePath}`);
    url.searchParams.set("input", JSON.stringify(input ?? {}));
    return url.toString();
}
function parseTrpcErrorBody(text) {
    try {
        return JSON.parse(text);
    }
    catch {
        return null;
    }
}
function isTransientUpstream(status) {
    return status === 502 || status === 503 || status === 504;
}
export async function trpcGetJson(procedurePath, input, ctx) {
    const token = await ctx.tokenProvider.getAccessToken();
    const url = buildUrl(ctx.baseUrl, procedurePath, input);
    const doFetch = async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), ctx.timeoutMs);
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            };
            if (ctx.companyId) {
                headers["x-company-id"] = ctx.companyId;
            }
            try {
                return await fetch(url, {
                    method: "GET",
                    headers,
                    signal: controller.signal,
                });
            }
            catch (err) {
                if (err instanceof Error && err.name === "AbortError") {
                    throw new HonorfyMcpError({
                        code: "UPSTREAM_ERROR",
                        message: `Timeout ao chamar ${procedurePath} (${ctx.timeoutMs}ms)`,
                        retryable: true,
                    });
                }
                throw err;
            }
        }
        finally {
            clearTimeout(timeout);
        }
    };
    let res = await doFetch();
    if (!res.ok && isTransientUpstream(res.status)) {
        await new Promise((r) => setTimeout(r, 400));
        res = await doFetch();
    }
    const text = await res.text();
    if (!res.ok) {
        const parsed = parseTrpcErrorBody(text);
        const message = parsed?.error?.message ??
            `Erro HTTP ${res.status} ao chamar ${procedurePath}`;
        const code = mapHttpStatusToCode(res.status);
        throw new HonorfyMcpError({
            code,
            message,
            details: parsed?.error?.data ?? (text ? text.slice(0, 2000) : undefined),
            retryable: isRetryableStatus(res.status),
        });
    }
    let body;
    try {
        body = JSON.parse(text);
    }
    catch {
        throw new HonorfyMcpError({
            code: "UPSTREAM_ERROR",
            message: `Resposta inválida (não JSON) de ${procedurePath}`,
            details: text.slice(0, 500),
            retryable: false,
        });
    }
    const data = body?.result?.data;
    if (data === undefined) {
        const parsed = parseTrpcErrorBody(text);
        if (parsed?.error) {
            throw new HonorfyMcpError({
                code: "VALIDATION_ERROR",
                message: parsed.error.message ?? "Erro retornado pela API",
                details: parsed.error.data,
                retryable: false,
            });
        }
        throw new HonorfyMcpError({
            code: "UPSTREAM_ERROR",
            message: `Formato de resposta inesperado de ${procedurePath}`,
            details: text.slice(0, 500),
            retryable: false,
        });
    }
    return data;
}
export function trpcContextFromConfig(config, tokenProvider, companyId) {
    return {
        baseUrl: config.HONORFY_API_URL,
        tokenProvider,
        timeoutMs: config.HONORFY_MCP_HTTP_TIMEOUT_MS,
        companyId,
    };
}
//# sourceMappingURL=trpcHttp.js.map