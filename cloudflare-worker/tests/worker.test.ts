import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { handleRequest } from '../src/index.ts';
import { resetSecurityStores } from '../src/security.ts';
import type { WorkerEnv } from '../src/types.ts';

const TEST_ORIGIN = 'https://basesys.com.br';
const TEST_BOT_TOKEN = '000000000:TEST_BOT_TOKEN_DO_NOT_LEAK';
const TEST_CHAT_ID = '-1009999999999';
const FIXED_NOW_MS = Date.parse('2026-11-20T20:15:00.000Z'); // 17:15 em America/Sao_Paulo

function createBaseEnv(overrides: Partial<WorkerEnv> = {}): WorkerEnv {
  return {
    TELEGRAM_BOT_TOKEN: TEST_BOT_TOKEN,
    TELEGRAM_CHAT_ID: TEST_CHAT_ID,
    ALLOWED_ORIGIN: `${TEST_ORIGIN},https://www.basesys.com.br`,
    TELEGRAM_TIMEOUT_MS: '3000',
    RATE_LIMIT_MAX_REQUESTS: '5',
    RATE_LIMIT_WINDOW_SECONDS: '600',
    DEDUP_WINDOW_SECONDS: '600',
    MIN_FORM_FILL_MS: '1500',
    ...overrides,
  };
}

function createValidPayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    name: 'Mariana Oliveira',
    email: 'mariana@empresa.com.br',
    phone: '(11) 99876-5432',
    company: 'Grupo Horizonte Ltda',
    interestKey: 'lojas-varejo',
    teamSize: '15 a 50 usuários',
    website: '',
    formStartedAt: FIXED_NOW_MS - 12_000,
    ...overrides,
  };
}

function createPostRequest(
  body: unknown,
  options: { origin?: string | null; ip?: string; idempotencyKey?: string } = {}
): Request {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'CF-Connecting-IP': options.ip ?? '203.0.113.10',
  });

  if (options.origin !== null) {
    headers.set('Origin', options.origin ?? TEST_ORIGIN);
  }
  if (options.idempotencyKey) {
    headers.set('X-Idempotency-Key', options.idempotencyKey);
  }

  return new Request('https://basesys-demo-leads.workers.dev/', {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('Cloudflare Worker — Integração BaseSys → Telegram', () => {
  beforeEach(() => {
    resetSecurityStores();
  });

  it('1 e 2. envia solicitação válida ao Telegram com mensagem formatada e CORS restrito', async () => {
    const capturedCalls: Array<{ url: string; init?: RequestInit }> = [];
    const mockFetch: typeof fetch = async (input, init) => {
      capturedCalls.push({ url: String(input), init });
      return new Response(JSON.stringify({ ok: true, result: { message_id: 101 } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const request = createPostRequest(createValidPayload(), {
      idempotencyKey: 'lead-valid-001',
    });

    const response = await handleRequest(request, createBaseEnv(), {
      fetchImpl: mockFetch,
      now: () => FIXED_NOW_MS,
    });

    assert.equal(response.status, 200);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), TEST_ORIGIN);

    const data = (await response.json()) as { ok: boolean; message: string };
    assert.equal(data.ok, true);
    assert.equal(capturedCalls.length, 1);

    const telegramCall = capturedCalls[0];
    assert.equal(
      telegramCall.url,
      `https://api.telegram.org/bot${TEST_BOT_TOKEN}/sendMessage`
    );

    const sentBody = JSON.parse(String(telegramCall.init?.body)) as {
      chat_id: string;
      text: string;
      parse_mode: string;
      disable_web_page_preview: boolean;
    };

    assert.equal(sentBody.chat_id, TEST_CHAT_ID);
    assert.equal(sentBody.parse_mode, 'HTML');
    assert.equal(sentBody.disable_web_page_preview, true);
    assert.match(sentBody.text, /🔔 <b>NOVO LEAD — BASESYS<\/b>/);
    assert.match(sentBody.text, /- <b>Nome:<\/b> Mariana Oliveira/);
    assert.match(sentBody.text, /- <b>E-mail:<\/b> mariana@empresa\.com\.br/);
    assert.match(sentBody.text, /- <b>Telefone:<\/b> \(11\) 99876-5432/);
    assert.match(sentBody.text, /- <b>Empresa:<\/b> Grupo Horizonte Ltda/);
    assert.match(sentBody.text, /- <b>Solução desejada:<\/b> NexaERP — Lojas e Varejo/);
    assert.match(sentBody.text, /- <b>Porte da operação:<\/b> 15 a 50 usuários/);
    assert.match(sentBody.text, /- Site institucional BaseSys/);
    assert.match(sentBody.text, /20\/11\/2026 às 17:15 \(Horário de Brasília\)/);
  });

  it('3. aceita campos opcionais vazios com fallback seguro ("Não informado")', async () => {
    let sentText = '';
    const mockFetch: typeof fetch = async (_input, init) => {
      const parsed = JSON.parse(String(init?.body)) as { text: string };
      sentText = parsed.text;
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };

    const request = createPostRequest(
      createValidPayload({
        interestKey: '',
        teamSize: '',
      })
    );

    const response = await handleRequest(request, createBaseEnv(), {
      fetchImpl: mockFetch,
      now: () => FIXED_NOW_MS,
    });

    assert.equal(response.status, 200);
    assert.match(sentText, /- <b>Solução desejada:<\/b> Não informado/);
    assert.match(sentText, /- <b>Porte da operação:<\/b> Não informado/);
  });

  it('4. rejeita dados inválidos sem acionar o Telegram', async () => {
    let telegramCalls = 0;
    const mockFetch: typeof fetch = async () => {
      telegramCalls += 1;
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };

    const request = createPostRequest(
      createValidPayload({
        name: 'A',
        email: 'email-invalido',
        phone: '11111111111',
        company: '',
        interestKey: 'solucao-inexistente',
      })
    );

    const response = await handleRequest(request, createBaseEnv(), {
      fetchImpl: mockFetch,
      now: () => FIXED_NOW_MS,
    });

    assert.equal(response.status, 400);
    assert.equal(telegramCalls, 0);

    const body = (await response.json()) as {
      ok: boolean;
      code: string;
      fieldErrors: Record<string, string>;
    };
    assert.equal(body.ok, false);
    assert.equal(body.code, 'VALIDATION_ERROR');
    assert.ok(body.fieldErrors.name);
    assert.ok(body.fieldErrors.email);
    assert.ok(body.fieldErrors.phone);
    assert.ok(body.fieldErrors.company);
    assert.ok(body.fieldErrors.interestKey);
  });

  it('5. lida com Telegram temporariamente indisponível e permite nova tentativa bem-sucedida', async () => {
    let callCount = 0;
    const mockFetch: typeof fetch = async () => {
      callCount += 1;
      if (callCount <= 2) {
        return new Response('Bad Gateway', { status: 502 });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };

    const originalConsoleError = console.error;
    const loggedMessages: string[] = [];
    console.error = (...args: unknown[]) => {
      loggedMessages.push(args.map(String).join(' '));
    };

    try {
      const payload = createValidPayload();
      const firstResponse = await handleRequest(
        createPostRequest(payload, { idempotencyKey: 'retry-flow-001' }),
        createBaseEnv(),
        { fetchImpl: mockFetch, now: () => FIXED_NOW_MS }
      );

      assert.equal(firstResponse.status, 503);
      const firstBody = await firstResponse.text();
      assert.doesNotMatch(firstBody, new RegExp(TEST_BOT_TOKEN));
      assert.doesNotMatch(firstBody, new RegExp(TEST_CHAT_ID));
      for (const line of loggedMessages) {
        assert.doesNotMatch(line, new RegExp(TEST_BOT_TOKEN));
        assert.doesNotMatch(line, new RegExp(TEST_CHAT_ID));
      }

      // Nova tentativa com a mesma chave deve conseguir enviar após recuperação do Telegram
      const secondResponse = await handleRequest(
        createPostRequest(payload, { idempotencyKey: 'retry-flow-001' }),
        createBaseEnv(),
        { fetchImpl: mockFetch, now: () => FIXED_NOW_MS + 5_000 }
      );

      assert.equal(secondResponse.status, 200);
      assert.equal(callCount, 3);
    } finally {
      console.error = originalConsoleError;
    }
  });

  it('6. bloqueia notificações duplicadas em caso de reenvio da mesma solicitação', async () => {
    let telegramCalls = 0;
    const mockFetch: typeof fetch = async () => {
      telegramCalls += 1;
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };

    const payload = createValidPayload();
    const first = await handleRequest(
      createPostRequest(payload, { idempotencyKey: 'dup-check-001' }),
      createBaseEnv(),
      { fetchImpl: mockFetch, now: () => FIXED_NOW_MS }
    );
    const second = await handleRequest(
      createPostRequest(payload, { idempotencyKey: 'dup-check-001' }),
      createBaseEnv(),
      { fetchImpl: mockFetch, now: () => FIXED_NOW_MS + 2_000 }
    );

    assert.equal(first.status, 200);
    assert.equal(second.status, 200);
    const secondJson = (await second.json()) as { ok: boolean; duplicate?: boolean };
    assert.equal(secondJson.ok, true);
    assert.equal(secondJson.duplicate, true);
    assert.equal(telegramCalls, 1);
  });

  it('7. protege origens, honeypot, rate limit, escape HTML e ignora chat_id malicioso', async () => {
    let lastTelegramBody: { chat_id?: string; text?: string } | null = null;
    const mockFetch: typeof fetch = async (_input, init) => {
      lastTelegramBody = JSON.parse(String(init?.body)) as { chat_id?: string; text?: string };
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };

    // Origem não autorizada
    const badOriginRes = await handleRequest(
      createPostRequest(createValidPayload(), { origin: 'https://malicioso.example' }),
      createBaseEnv(),
      { fetchImpl: mockFetch, now: () => FIXED_NOW_MS }
    );
    assert.equal(badOriginRes.status, 403);
    assert.equal(badOriginRes.headers.get('Access-Control-Allow-Origin'), null);

    // Preflight OPTIONS autorizado
    const preflightRes = await handleRequest(
      new Request('https://basesys-demo-leads.workers.dev/', {
        method: 'OPTIONS',
        headers: { Origin: TEST_ORIGIN },
      }),
      createBaseEnv(),
      { fetchImpl: mockFetch, now: () => FIXED_NOW_MS }
    );
    assert.equal(preflightRes.status, 204);
    assert.equal(preflightRes.headers.get('Access-Control-Allow-Origin'), TEST_ORIGIN);

    // Honeypot preenchido
    const botRes = await handleRequest(
      createPostRequest(createValidPayload({ website: 'https://bot-spam.example' })),
      createBaseEnv(),
      { fetchImpl: mockFetch, now: () => FIXED_NOW_MS }
    );
    assert.equal(botRes.status, 400);
    assert.equal(lastTelegramBody, null);

    // Escape de HTML + tentativa de sobrescrever chat_id no payload
    const xssRes = await handleRequest(
      createPostRequest(
        createValidPayload({
          name: '<b>João</b> & <script>alert(1)</script>',
          company: 'A & B "Soluções"\nLinha Injetada',
          chat_id: '9999999',
          TELEGRAM_CHAT_ID: '9999999',
        }),
        { ip: '203.0.113.55' }
      ),
      createBaseEnv(),
      { fetchImpl: mockFetch, now: () => FIXED_NOW_MS }
    );
    assert.equal(xssRes.status, 200);
    assert.ok(lastTelegramBody);
    assert.equal(lastTelegramBody.chat_id, TEST_CHAT_ID);
    assert.match(
      lastTelegramBody.text ?? '',
      /&lt;b&gt;João&lt;\/b&gt; &amp; &lt;script&gt;alert\(1\)&lt;\/script&gt;/
    );
    assert.match(lastTelegramBody.text ?? '', /A &amp; B &quot;Soluções&quot; Linha Injetada/);

    // Rate limit por IP
    const strictEnv = createBaseEnv({ RATE_LIMIT_MAX_REQUESTS: '2' });
    const ip = '203.0.113.99';
    const r1 = await handleRequest(
      createPostRequest(createValidPayload({ email: 'a1@empresa.com.br' }), { ip }),
      strictEnv,
      { fetchImpl: mockFetch, now: () => FIXED_NOW_MS }
    );
    const r2 = await handleRequest(
      createPostRequest(createValidPayload({ email: 'a2@empresa.com.br' }), { ip }),
      strictEnv,
      { fetchImpl: mockFetch, now: () => FIXED_NOW_MS + 1_000 }
    );
    const r3 = await handleRequest(
      createPostRequest(createValidPayload({ email: 'a3@empresa.com.br' }), { ip }),
      strictEnv,
      { fetchImpl: mockFetch, now: () => FIXED_NOW_MS + 2_000 }
    );
    assert.equal(r1.status, 200);
    assert.equal(r2.status, 200);
    assert.equal(r3.status, 429);
    assert.ok(r3.headers.get('Retry-After'));
  });
});
