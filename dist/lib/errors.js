export class HonorfyMcpError extends Error {
    payload;
    constructor(payload) {
        super(payload.message);
        this.name = "HonorfyMcpError";
        this.payload = payload;
    }
    toJson() {
        return this.payload;
    }
}
export function mapHttpStatusToCode(status) {
    if (status === 401)
        return "UNAUTHORIZED";
    if (status === 403)
        return "FORBIDDEN";
    if (status === 404)
        return "NOT_FOUND";
    if (status === 429)
        return "RATE_LIMITED";
    if (status === 400 || status === 422)
        return "VALIDATION_ERROR";
    if (status >= 500)
        return "UPSTREAM_ERROR";
    return "INTERNAL";
}
export function isRetryableStatus(status) {
    return (status === 408 ||
        status === 429 ||
        status === 502 ||
        status === 503 ||
        status === 504);
}
//# sourceMappingURL=errors.js.map