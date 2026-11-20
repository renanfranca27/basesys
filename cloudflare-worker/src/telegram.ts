import type { ValidatedLead } from './types.ts';
import { escapeHtml } from './validation.ts';

export interface TelegramSendResult {
  ok: boolean;
  retryable?: boolean;
  statusCode?: number;
  errorCode?: string;
}

export function formatBrasiliaDateTime(nowMs: number): string {
  const date = new Date(nowMs);
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${formatter.format(date).replace(',', ' às')} (Horário de Brasília)`;
}

export function formatTelegramLeadMessage(lead: ValidatedLead, nowMs: number): string {
  const safeName = escapeHtml(lead.name);
  const safeEmail = escapeHtml(lead.email);
  const safePhone = escapeHtml(lead.phone);
  const safeCompany = escapeHtml(lead.company);
  const safeSolution = escapeHtml(lead.solutionLabel);
  const safeTeamSize = escapeHtml(lead.teamSize);
  const formattedDateTime = escapeHtml(formatBrasiliaDateTime(nowMs));

  return [
    '🔔 <b>NOVO LEAD — BASESYS</b>',
    '',
    '<b>DADOS DO INTERESSADO</b>',
    `- <b>Nome:</b> ${safeName}`,
    `- <b>E-mail:</b> ${safeEmail}`,
    `- <b>Telefone:</b> ${safePhone}`,
    `- <b>Empresa:</b> ${safeCompany}`,
    '',
    '<b>INTERESSE COMERCIAL</b>',
    `- <b>Solução desejada:</b> ${safeSolution}`,
    `- <b>Porte da operação:</b> ${safeTeamSize}`,
    '',
    '<b>ORIGEM</b>',
    '- Site institucional BaseSys',
    `- Data e horário: ${formattedDateTime}`,
  ].join('\n');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendTelegramMessage(options: {
  botToken: string;
  chatId: string;
  text: string;
  timeoutMs: number;
  fetchImpl?: typeof fetch;
}): Promise<TelegramSendResult> {
  const fetchFn = options.fetchImpl ?? fetch;
  const endpoint = `https://api.telegram.org/bot${options.botToken}/sendMessage`;
  const payload = JSON.stringify({
    chat_id: options.chatId,
    text: options.text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  });

  const maxAttempts = 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs);

    try {
      const response = await fetchFn(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const body = (await response.json().catch(() => null)) as { ok?: boolean } | null;
        if (body && body.ok === true) {
          return { ok: true, statusCode: response.status };
        }
        return {
          ok: false,
          retryable: true,
          statusCode: response.status,
          errorCode: 'TELEGRAM_UNEXPECTED_RESPONSE',
        };
      }

      const retryable = response.status === 429 || response.status >= 500;
      if (retryable && attempt < maxAttempts) {
        const retryAfterHeader = response.headers.get('Retry-After');
        const retryAfterMs = retryAfterHeader
          ? Math.min(2000, Math.max(250, Number.parseInt(retryAfterHeader, 10) * 1000 || 500))
          : 400;
        await sleep(retryAfterMs);
        continue;
      }

      return {
        ok: false,
        retryable,
        statusCode: response.status,
        errorCode: retryable ? 'TELEGRAM_UNAVAILABLE' : 'TELEGRAM_REJECTED',
      };
    } catch (error) {
      clearTimeout(timeoutId);
      const isTimeout = error instanceof Error && error.name === 'AbortError';
      if (attempt < maxAttempts) {
        await sleep(350);
        continue;
      }
      return {
        ok: false,
        retryable: true,
        errorCode: isTimeout ? 'TELEGRAM_TIMEOUT' : 'TELEGRAM_NETWORK_ERROR',
      };
    }
  }

  return {
    ok: false,
    retryable: true,
    errorCode: 'TELEGRAM_UNAVAILABLE',
  };
}
