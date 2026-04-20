export type LogLevel = "info" | "warn" | "error";
export type StructuredLog = {
    level: LogLevel;
    tool?: string;
    procedure?: string;
    requestId: string;
    durationMs?: number;
    httpStatus?: number;
    message: string;
    /** Nunca incluir tokens ou Authorization */
    extra?: Record<string, unknown>;
};
export declare function logStructured(entry: StructuredLog): void;
//# sourceMappingURL=logger.d.ts.map