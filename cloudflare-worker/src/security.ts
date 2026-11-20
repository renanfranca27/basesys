import type { ValidatedLead, WorkerEnv } from './types.ts';

interface RateLimitBucket {
  timestamps: number[];
}

interface DedupEntry {
  status: 'in_flight' | 'delivered';
  expiresAt: number;
}

const rateLimitStore = new Map<string, RateLimitBucket>();
const dedupStore = new Map<string, DedupEntry>();

export function resetSecurityStores(): void {
  rateLimitStore.clear();
  dedupStore.clear();
}

export function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function parseAllowedOrigins(rawOriginConfig: string | undefined): string[] {
  if (!rawOriginConfig) return [];
  return rawOriginConfig
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter((origin) => origin.length > 0 && origin !== '*');
}

export function resolveAllowedOrigin(
  requestOrigin: string | null,
  env: WorkerEnv
): { allowed: boolean; matchedOrigin: string | null; configured: boolean } {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGIN);
  if (allowedOrigins.length === 0) {
    return { allowed: false, matchedOrigin: null, configured: false };
  }

  if (!requestOrigin) {
    return { allowed: false, matchedOrigin: null, configured: true };
  }

  const normalizedRequestOrigin = requestOrigin.trim().replace(/\/+$/, '');
  const matched = allowedOrigins.find((origin) => origin === normalizedRequestOrigin) ?? null;
  return {
    allowed: matched !== null,
    matchedOrigin: matched,
    configured: true,
  };
}

export function buildCorsHeaders(matchedOrigin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Idempotency-Key',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
  };

  if (matchedOrigin) {
    headers['Access-Control-Allow-Origin'] = matchedOrigin;
  }

  return headers;
}

export function getClientIdentifier(request: Request): string {
  const cfIp = request.headers.get('CF-Connecting-IP')?.trim();
  if (cfIp) return cfIp;

  const forwarded = request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim();
  if (forwarded) return forwarded;

  return 'unknown-client';
}

export function checkRateLimit(
  clientKey: string,
  options: { nowMs: number; maxRequests: number; windowSeconds: number }
): { allowed: boolean; retryAfterSeconds: number } {
  const windowMs = options.windowSeconds * 1000;
  const cutoff = options.nowMs - windowMs;

  // Limpeza periódica para evitar crescimento ilimitado em memória do isolate.
  if (rateLimitStore.size > 2000) {
    for (const [key, bucket] of rateLimitStore.entries()) {
      const active = bucket.timestamps.filter((ts) => ts > cutoff);
      if (active.length === 0) {
        rateLimitStore.delete(key);
      } else {
        bucket.timestamps = active;
      }
    }
  }

  const bucket = rateLimitStore.get(clientKey) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((ts) => ts > cutoff);

  if (bucket.timestamps.length >= options.maxRequests) {
    const oldest = bucket.timestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - options.nowMs) / 1000));
    rateLimitStore.set(clientKey, bucket);
    return { allowed: false, retryAfterSeconds };
  }

  bucket.timestamps.push(options.nowMs);
  rateLimitStore.set(clientKey, bucket);
  return { allowed: true, retryAfterSeconds: 0 };
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function buildDedupKeys(
  lead: ValidatedLead,
  headerIdempotencyKey: string | null
): Promise<string[]> {
  const keys: string[] = [];

  const candidateKey = headerIdempotencyKey?.trim() || lead.idempotencyKey;
  if (candidateKey && /^[a-zA-Z0-9_-]{8,128}$/.test(candidateKey)) {
    keys.push(`idem:${candidateKey}`);
  }

  const normalizedFingerprint = [
    lead.email.toLowerCase(),
    lead.phoneDigits,
    lead.company.toLowerCase(),
    lead.interestKey.toLowerCase(),
    lead.teamSize.toLowerCase(),
  ].join('|');

  const contentHash = await sha256Hex(normalizedFingerprint);
  keys.push(`fp:${contentHash}`);

  return keys;
}

export function acquireDedupLock(
  keys: string[],
  options: { nowMs: number; windowSeconds: number }
): 'acquired' | 'duplicate_delivered' | 'duplicate_in_flight' {
  for (const [storedKey, entry] of dedupStore.entries()) {
    if (entry.expiresAt <= options.nowMs) {
      dedupStore.delete(storedKey);
    }
  }

  for (const key of keys) {
    const existing = dedupStore.get(key);
    if (existing && existing.expiresAt > options.nowMs) {
      return existing.status === 'delivered' ? 'duplicate_delivered' : 'duplicate_in_flight';
    }
  }

  const expiresAt = options.nowMs + options.windowSeconds * 1000;
  for (const key of keys) {
    dedupStore.set(key, { status: 'in_flight', expiresAt });
  }

  return 'acquired';
}

export function markDedupDelivered(
  keys: string[],
  options: { nowMs: number; windowSeconds: number }
): void {
  const expiresAt = options.nowMs + options.windowSeconds * 1000;
  for (const key of keys) {
    dedupStore.set(key, { status: 'delivered', expiresAt });
  }
}

export function releaseDedupLock(keys: string[]): void {
  for (const key of keys) {
    dedupStore.delete(key);
  }
}
