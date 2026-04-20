export type HonorfyMcpErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'UPSTREAM_ERROR'
  | 'RATE_LIMITED'
  | 'INTERNAL';

export type HonorfyMcpErrorPayload = {
  code: HonorfyMcpErrorCode;
  message: string;
  details?: unknown;
  retryable: boolean;
};

export class HonorfyMcpError extends Error {
  readonly payload: HonorfyMcpErrorPayload;

  constructor(payload: HonorfyMcpErrorPayload) {
    super(payload.message);
    this.name = 'HonorfyMcpError';
    this.payload = payload;
  }

  toJson(): HonorfyMcpErrorPayload {
    return this.payload;
  }
}

export function mapHttpStatusToCode(status: number): HonorfyMcpErrorCode {
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 429) return 'RATE_LIMITED';
  if (status === 400 || status === 422) return 'VALIDATION_ERROR';
  if (status >= 500) return 'UPSTREAM_ERROR';
  return 'INTERNAL';
}

export function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 429 || status === 502 || status === 503 || status === 504;
}
