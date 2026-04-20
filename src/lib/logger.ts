export type LogLevel = 'info' | 'warn' | 'error';

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

export function logStructured(entry: StructuredLog): void {
  const line = JSON.stringify({
    ...entry,
    ts: new Date().toISOString(),
    service: 'mcp',
  });
  if (entry.level === 'error') {
    console.error(line);
  } else if (entry.level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}
