export interface WorkerEnv {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  ALLOWED_ORIGIN?: string;
  TELEGRAM_TIMEOUT_MS?: string;
  RATE_LIMIT_MAX_REQUESTS?: string;
  RATE_LIMIT_WINDOW_SECONDS?: string;
  DEDUP_WINDOW_SECONDS?: string;
  MIN_FORM_FILL_MS?: string;
}

export interface IncomingLeadPayload {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  interestKey?: unknown;
  teamSize?: unknown;
  website?: unknown;
  formStartedAt?: unknown;
  idempotencyKey?: unknown;
}

export interface ValidatedLead {
  name: string;
  email: string;
  phone: string;
  phoneDigits: string;
  company: string;
  interestKey: string;
  solutionLabel: string;
  teamSize: string;
  idempotencyKey?: string;
}

export interface ValidationFailure {
  ok: false;
  code: 'INVALID_PAYLOAD' | 'VALIDATION_ERROR' | 'SPAM_DETECTED';
  message: string;
  fieldErrors?: Record<string, string>;
}

export interface ValidationSuccess {
  ok: true;
  data: ValidatedLead;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

export interface WorkerDependencies {
  fetchImpl?: typeof fetch;
  now?: () => number;
}
