import { HonorfyMcpError } from './errors.js';

export function jsonResult(data: unknown): { content: Array<{ type: 'text'; text: string }> } {
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
}

export function errorResult(err: unknown): {
  isError: true;
  content: Array<{ type: 'text'; text: string }>;
} {
  if (err instanceof HonorfyMcpError) {
    return {
      isError: true,
      content: [{ type: 'text', text: JSON.stringify(err.toJson(), null, 2) }],
    };
  }
  const message = err instanceof Error ? err.message : String(err);
  return {
    isError: true,
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          {
            code: 'INTERNAL' as const,
            message,
            retryable: false,
          },
          null,
          2
        ),
      },
    ],
  };
}
