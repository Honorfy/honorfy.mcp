import { HonorfyMcpError } from "./errors.js";
export function jsonResult(data) {
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
}
export function errorResult(err) {
    if (err instanceof HonorfyMcpError) {
        return {
            isError: true,
            content: [{ type: "text", text: JSON.stringify(err.toJson(), null, 2) }],
        };
    }
    const message = err instanceof Error ? err.message : String(err);
    return {
        isError: true,
        content: [
            {
                type: "text",
                text: JSON.stringify({
                    code: "INTERNAL",
                    message,
                    retryable: false,
                }, null, 2),
            },
        ],
    };
}
//# sourceMappingURL=toolResult.js.map