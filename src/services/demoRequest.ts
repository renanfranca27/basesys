export interface DemoRequestPayload {
  name: string;
  email: string;
  phone: string;
  company: string;
  interestKey: string;
  teamSize: string;
  website: string;
  formStartedAt: number;
  idempotencyKey: string;
}

export interface DemoRequestResult {
  ok: boolean;
  duplicate?: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
}

const REQUEST_TIMEOUT_MS = 15_000;

function getDemoEndpointUrl(): string {
  const raw = import.meta.env.VITE_DEMO_API_URL;
  return typeof raw === 'string' ? raw.trim() : '';
}

export function generateIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

export async function submitDemoRequest(
  payload: DemoRequestPayload
): Promise<DemoRequestResult> {
  const endpointUrl = getDemoEndpointUrl();

  if (!endpointUrl) {
    return {
      ok: false,
      message:
        'O canal de agendamento está temporariamente indisponível. Tente novamente em instantes ou fale conosco pelo WhatsApp.',
    };
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': payload.idempotencyKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = (await response.json().catch(() => null)) as
      | {
          ok?: boolean;
          duplicate?: boolean;
          message?: string;
          fieldErrors?: Record<string, string>;
        }
      | null;

    if (response.ok && data?.ok === true) {
      return {
        ok: true,
        duplicate: data.duplicate === true,
        message: data.message,
      };
    }

    if (response.status === 400 && data?.fieldErrors) {
      return {
        ok: false,
        message: data.message ?? 'Verifique os dados informados e tente novamente.',
        fieldErrors: data.fieldErrors,
      };
    }

    if (response.status === 429) {
      return {
        ok: false,
        message: 'Muitas tentativas em sequência. Aguarde alguns minutos e tente novamente.',
      };
    }

    return {
      ok: false,
      message:
        data?.message ??
        'Não foi possível concluir o envio agora. Tente novamente em alguns instantes.',
    };
  } catch (error) {
    const isTimeout = error instanceof DOMException && error.name === 'AbortError';
    return {
      ok: false,
      message: isTimeout
        ? 'O envio demorou mais que o esperado. Verifique sua conexão e tente novamente.'
        : 'Não foi possível conectar ao serviço de agendamento. Verifique sua conexão e tente novamente.',
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
