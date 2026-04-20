import { describe, expect, it } from 'vitest';
import { HONORFY_MCP_TOOLS_V1 } from './capabilities.js';

describe('HONORFY_MCP_TOOLS_V1', () => {
  it('mantém lista estável de tools v1', () => {
    expect(HONORFY_MCP_TOOLS_V1).toContain('honorfy_capabilities');
    expect(HONORFY_MCP_TOOLS_V1).toHaveLength(12);
  });
});
