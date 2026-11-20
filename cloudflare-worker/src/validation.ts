import type { IncomingLeadPayload, ValidatedLead, ValidationResult } from './types.ts';

export const SOLUTION_LABELS: Readonly<Record<string, string>> = {
  'nexa-erp': 'NexaERP — Visão Geral do Sistema',
  'lojas-varejo': 'NexaERP — Lojas e Varejo',
  'mercados-padarias': 'NexaERP — Mercados e Padarias',
  'bares-restaurantes': 'NexaERP — Bares e Restaurantes',
  'saloes-barbearias': 'NexaERP — Salões e Barbearias',
  'sob-medida': 'Sistema Sob Medida (Projeto Exclusivo)',
};

export const ALLOWED_TEAM_SIZES: ReadonlySet<string> = new Set([
  'Até 15 usuários',
  '15 a 50 usuários',
  '51 a 150 usuários',
  'Acima de 150 usuários',
]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const IDEMPOTENCY_PATTERN = /^[a-zA-Z0-9_-]{8,128}$/;

export function sanitizeSingleLine(value: string): string {
  return value
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatBrazilPhoneFromDigits(digits: string): string {
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  return digits;
}

function asOptionalString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function validateLeadPayload(
  raw: unknown,
  options: { nowMs: number; minFormFillMs: number }
): ValidationResult {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      ok: false,
      code: 'INVALID_PAYLOAD',
      message: 'Formato de dados inválido.',
    };
  }

  const payload = raw as IncomingLeadPayload;

  // 1. Proteção Honeypot: bots costumam preencher campos ocultos.
  const honeypot = asOptionalString(payload.website).trim();
  if (honeypot.length > 0) {
    return {
      ok: false,
      code: 'SPAM_DETECTED',
      message: 'Não foi possível processar a solicitação.',
    };
  }

  // 2. Proteção contra envio automatizado instantâneo (quando o timestamp é enviado).
  if (payload.formStartedAt !== undefined && payload.formStartedAt !== null) {
    const startedAt = Number(payload.formStartedAt);
    const elapsedMs = options.nowMs - startedAt;
    if (!Number.isFinite(startedAt) || elapsedMs < options.minFormFillMs || elapsedMs > 24 * 60 * 60 * 1000) {
      return {
        ok: false,
        code: 'SPAM_DETECTED',
        message: 'Não foi possível validar o envio. Tente novamente em alguns instantes.',
      };
    }
  }

  const name = sanitizeSingleLine(asOptionalString(payload.name));
  const email = sanitizeSingleLine(asOptionalString(payload.email)).toLowerCase();
  const rawPhone = sanitizeSingleLine(asOptionalString(payload.phone));
  const phoneDigits = rawPhone.replace(/\D/g, '');
  const company = sanitizeSingleLine(asOptionalString(payload.company));
  const rawInterestKey = sanitizeSingleLine(asOptionalString(payload.interestKey));
  const rawTeamSize = sanitizeSingleLine(asOptionalString(payload.teamSize));
  const rawIdempotencyKey = sanitizeSingleLine(asOptionalString(payload.idempotencyKey));

  const fieldErrors: Record<string, string> = {};

  if (name.length < 2 || name.length > 120) {
    fieldErrors.name = 'Informe seu nome completo (entre 2 e 120 caracteres).';
  }

  if (email.length > 180 || !EMAIL_PATTERN.test(email)) {
    fieldErrors.email = 'Informe um e-mail corporativo válido.';
  }

  if (phoneDigits.length < 10 || phoneDigits.length > 11 || /^(\d)\1+$/.test(phoneDigits)) {
    fieldErrors.phone = 'Informe DDD e telefone ou WhatsApp válido (10 ou 11 dígitos).';
  }

  if (company.length < 2 || company.length > 140) {
    fieldErrors.company = 'Informe o nome da sua empresa (entre 2 e 140 caracteres).';
  }

  let interestKey = '';
  let solutionLabel = 'Não informado';
  if (rawInterestKey.length > 0) {
    if (Object.prototype.hasOwnProperty.call(SOLUTION_LABELS, rawInterestKey)) {
      interestKey = rawInterestKey;
      solutionLabel = SOLUTION_LABELS[rawInterestKey];
    } else {
      fieldErrors.interestKey = 'Selecione uma solução ou segmento válido.';
    }
  }

  let teamSize = 'Não informado';
  if (rawTeamSize.length > 0) {
    if (ALLOWED_TEAM_SIZES.has(rawTeamSize)) {
      teamSize = rawTeamSize;
    } else {
      fieldErrors.teamSize = 'Selecione um porte de operação válido.';
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      code: 'VALIDATION_ERROR',
      message: 'Verifique os campos destacados e tente novamente.',
      fieldErrors,
    };
  }

  const idempotencyKey = IDEMPOTENCY_PATTERN.test(rawIdempotencyKey) ? rawIdempotencyKey : undefined;

  const validated: ValidatedLead = {
    name,
    email,
    phone: formatBrazilPhoneFromDigits(phoneDigits),
    phoneDigits,
    company,
    interestKey,
    solutionLabel,
    teamSize,
    idempotencyKey,
  };

  return { ok: true, data: validated };
}
