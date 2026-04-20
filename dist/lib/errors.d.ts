export type HonorfyMcpErrorCode = "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR" | "UPSTREAM_ERROR" | "RATE_LIMITED" | "INTERNAL";
export type HonorfyMcpErrorPayload = {
    code: HonorfyMcpErrorCode;
    message: string;
    details?: unknown;
    retryable: boolean;
};
export declare class HonorfyMcpError extends Error {
    readonly payload: HonorfyMcpErrorPayload;
    constructor(payload: HonorfyMcpErrorPayload);
    toJson(): HonorfyMcpErrorPayload;
}
export declare function mapHttpStatusToCode(status: number): HonorfyMcpErrorCode;
export declare function isRetryableStatus(status: number): boolean;
//# sourceMappingURL=errors.d.ts.map