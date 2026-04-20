import { describe, expect, it } from "vitest";
import { loadConfig, normalizeBaseUrl } from "./config.js";

describe("loadConfig", () => {
  it("carrega variáveis mínimas", () => {
    const c = loadConfig({
      HONORFY_USER_TOKEN: "token",
    });
    expect(c.HONORFY_API_URL).toBe("https://api.honorfy.io");
    expect(c.HONORFY_USER_TOKEN).toBe("token");
    expect(c.HONORFY_MCP_RATE_LIMIT_PER_MINUTE).toBe(120);
  });

  it("permite sobrescrever URL padrão", () => {
    const c = loadConfig({
      HONORFY_API_URL: "http://localhost:3000",
      HONORFY_USER_TOKEN: "x",
    });
    expect(c.HONORFY_API_URL).toBe("http://localhost:3000");
  });
});

describe("normalizeBaseUrl", () => {
  it("remove barra final", () => {
    expect(normalizeBaseUrl("http://a.com/")).toBe("http://a.com");
  });
});
