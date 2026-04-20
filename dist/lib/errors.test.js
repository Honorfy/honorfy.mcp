import { describe, expect, it } from "vitest";
import { HonorfyMcpError, mapHttpStatusToCode } from "./errors.js";
describe("mapHttpStatusToCode", () => {
    it("mapeia status comuns", () => {
        expect(mapHttpStatusToCode(401)).toBe("UNAUTHORIZED");
        expect(mapHttpStatusToCode(403)).toBe("FORBIDDEN");
        expect(mapHttpStatusToCode(404)).toBe("NOT_FOUND");
        expect(mapHttpStatusToCode(400)).toBe("VALIDATION_ERROR");
        expect(mapHttpStatusToCode(422)).toBe("VALIDATION_ERROR");
        expect(mapHttpStatusToCode(500)).toBe("UPSTREAM_ERROR");
        expect(mapHttpStatusToCode(429)).toBe("RATE_LIMITED");
        expect(mapHttpStatusToCode(418)).toBe("INTERNAL");
    });
});
describe("HonorfyMcpError", () => {
    it("serializa payload", () => {
        const err = new HonorfyMcpError({
            code: "NOT_FOUND",
            message: "x",
            retryable: false,
        });
        expect(err.toJson()).toEqual({
            code: "NOT_FOUND",
            message: "x",
            retryable: false,
        });
    });
});
//# sourceMappingURL=errors.test.js.map