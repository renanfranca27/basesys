import type { WorkerDependencies, WorkerEnv } from './types.ts';
import {
  acquireDedupLock,
  buildCorsHeaders,
  buildDedupKeys,
  checkRateLimit,
  getClientIdentifier,
  markDedupDelivered,
  parsePositiveInt,
  releaseDedupLock,
  resolveAllowedOrigin,
} from './security.ts';
import { formatTelegramLeadMessage, sendTelegramMessage } from './telegram.ts';
import { validateLeadPayload } from './validation.ts';

const MAX_BODY_BYTES = 8 * 1024;

function jsonResponse(
  status: number,
  body: Record<string, unknown>,
  corsHeaders: Record<string, string>,
  extraHeaders?: Record<string, string>
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders,
      ...(extraHeaders ?? {}),
    },
  });
}

export async function handleRequest(
  request: Request,
  env: WorkerEnv,
  deps: WorkerDependencies = {}
): Promise<Response> {
  const nowMs = deps.now ? deps.now() : Date.now();
  const requestOrigin = request.headers.get('Origin');
  const originCheck = resolveAllowedOrigin(requestOrigin, env);
  const corsHeaders = buildCorsHeaders(originCheck.matchedOrigin);

  if (!originCheck.configured) {
    console.error('[basesys-lead-worker] ALLOWED_ORIGIN não configurado.');
    return jsonResponse(
      500,
      {
        ok: false,
        code: 'SERVICE_MISCONFIGURED',
        message: 'Serviço temporariamente indisponível. Tente novamente em instantes.',
      },
      corsHeaders
    );
  }

  if (request.method === 'OPTIONS') {
    if (!originCheck.allowed) {
      return jsonResponse(
        403,
        {
          ok: false,
          code: 'FORBIDDEN_ORIGIN',
          message: 'Origem não autorizada.',
        },
        corsHeaders
      );
    }

    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (request.method !== 'POST') {
    return jsonResponse(
      405,
      {
        ok: false,
        code: 'METHOD_NOT_ALLOWED',
        message: 'Método não permitido.',
      },
      corsHeaders,
      { Allow: 'POST, OPTIONS' }
    );
  }

  if (!originCheck.allowed) {
    return jsonResponse(
      403,
      {
        ok: false,
        code: 'FORBIDDEN_ORIGIN',
        message: 'Origem não autorizada.',
      },
      corsHeaders
    );
  }

  const contentType = request.headers.get('Content-Type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return jsonResponse(
      415,
      {
        ok: false,
        code: 'UNSUPPORTED_MEDIA_TYPE',
        message: 'Tipo de conteúdo inválido.',
      },
      corsHeaders
    );
  }

  const maxRequests = parsePositiveInt(env.RATE_LIMIT_MAX_REQUESTS, 5);
  const rateLimitWindowSeconds = parsePositiveInt(env.RATE_LIMIT_WINDOW_SECONDS, 600);
  const clientId = getClientIdentifier(request);
  const rateCheck = checkRateLimit(clientId, {
    nowMs,
    maxRequests,
    windowSeconds: rateLimitWindowSeconds,
  });

  if (!rateCheck.allowed) {
    return jsonResponse(
      429,
      {
        ok: false,
        code: 'RATE_LIMITED',
        message: 'Muitas tentativas em sequência. Aguarde alguns minutos e tente novamente.',
      },
      corsHeaders,
      { 'Retry-After': String(rateCheck.retryAfterSeconds) }
    );
  }

  const rawBodyText = await request.text();
  if (new TextEncoder().encode(rawBodyText).byteLength > MAX_BODY_BYTES) {
    return jsonResponse(
      413,
      {
        ok: false,
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Os dados enviados excedem o tamanho permitido.',
      },
      corsHeaders
    );
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBodyText);
  } catch {
    return jsonResponse(
      400,
      {
        ok: false,
        code: 'INVALID_JSON',
        message: 'Não foi possível ler os dados enviados.',
      },
      corsHeaders
    );
  }

  const minFormFillMs = parsePositiveInt(env.MIN_FORM_FILL_MS, 1500);
  const validation = validateLeadPayload(parsedBody, { nowMs, minFormFillMs });
  if (!validation.ok) {
    return jsonResponse(
      400,
      {
        ok: false,
        code: validation.code,
        message: validation.message,
        ...(validation.fieldErrors ? { fieldErrors: validation.fieldErrors } : {}),
      },
      corsHeaders
    );
  }

  const botToken = env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = env.TELEGRAM_CHAT_ID?.trim();
  if (!botToken || !chatId) {
    console.error('[basesys-lead-worker] Secrets do Telegram ausentes no ambiente do Worker.');
    return jsonResponse(
      503,
      {
        ok: false,
        code: 'SERVICE_UNAVAILABLE',
        message: 'Não foi possível enviar sua solicitação no momento. Tente novamente em instantes.',
      },
      corsHeaders
    );
  }

  const dedupWindowSeconds = parsePositiveInt(env.DEDUP_WINDOW_SECONDS, 600);
  const dedupKeys = await buildDedupKeys(
    validation.data,
    request.headers.get('X-Idempotency-Key')
  );
  const lockStatus = acquireDedupLock(dedupKeys, {
    nowMs,
    windowSeconds: dedupWindowSeconds,
  });

  if (lockStatus === 'duplicate_delivered') {
    return jsonResponse(
      200,
      {
        ok: true,
        duplicate: true,
        message: 'Solicitação já recebida anteriormente.',
      },
      corsHeaders
    );
  }

  if (lockStatus === 'duplicate_in_flight') {
    return jsonResponse(
      409,
      {
        ok: false,
        code: 'DUPLICATE_IN_FLIGHT',
        message: 'Sua solicitação já está sendo processada. Aguarde um instante.',
      },
      corsHeaders
    );
  }

  const timeoutMs = parsePositiveInt(env.TELEGRAM_TIMEOUT_MS, 8000);
  const messageText = formatTelegramLeadMessage(validation.data, nowMs);

  const telegramResult = await sendTelegramMessage({
    botToken,
    chatId,
    text: messageText,
    timeoutMs,
    fetchImpl: deps.fetchImpl,
  });

  if (!telegramResult.ok) {
    releaseDedupLock(dedupKeys);
    // Log seguro: nunca inclui token, chat_id ou dados pessoais do visitante.
    console.error(
      `[basesys-lead-worker] Falha no envio ao Telegram (code=${telegramResult.errorCode ?? 'UNKNOWN'}, status=${telegramResult.statusCode ?? 'N/A'}).`
    );

    return jsonResponse(
      503,
      {
        ok: false,
        code: 'DELIVERY_FAILED',
        message:
          'Não foi possível concluir o envio agora. Seus dados continuam preenchidos — tente novamente em alguns instantes.',
      },
      corsHeaders
    );
  }

  markDedupDelivered(dedupKeys, {
    nowMs,
    windowSeconds: dedupWindowSeconds,
  });

  return jsonResponse(
    200,
    {
      ok: true,
      message: 'Solicitação enviada com sucesso.',
    },
    corsHeaders
  );
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    return handleRequest(request, env);
  },
};
