import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import { COMPANY_CONTACT, LEAD_INTEREST_OPTIONS } from '../data/products';
import { generateIdempotencyKey, submitDemoRequest } from '../services/demoRequest';

interface LeadCaptureFormProps {
  defaultProductSlug?: string;
  compact?: boolean;
  onSuccess?: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
}

function formatBrazilPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function LeadCaptureForm({
  defaultProductSlug,
  compact = false,
  onSuccess,
}: LeadCaptureFormProps) {
  const idPrefix = useId();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [interestKey, setInterestKey] = useState(
    defaultProductSlug || LEAD_INTEREST_OPTIONS[0].value
  );
  const [teamSize, setTeamSize] = useState('Até 15 usuários');
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formStartedAtRef = useRef<number>(Date.now());
  const idempotencyKeyRef = useRef<string>(generateIdempotencyKey());
  const submissionSignatureRef = useRef<string>('');
  const inFlightRef = useRef<boolean>(false);

  useEffect(() => {
    if (defaultProductSlug) {
      const matched = LEAD_INTEREST_OPTIONS.some((opt) => opt.value === defaultProductSlug);
      if (matched) {
        setInterestKey(defaultProductSlug);
      }
    }
  }, [defaultProductSlug]);

  const selectedInterest =
    LEAD_INTEREST_OPTIONS.find((opt) => opt.value === interestKey) ?? LEAD_INTEREST_OPTIONS[0];

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (name.trim().length < 2) {
      nextErrors.name = 'Informe seu nome completo.';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      nextErrors.email = 'Informe um e-mail corporativo válido.';
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) {
      nextErrors.phone = 'Informe DDD e telefone ou WhatsApp válido (10 ou 11 dígitos).';
    }
    if (company.trim().length < 2) {
      nextErrors.company = 'Informe o nome da sua empresa.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (inFlightRef.current || isSubmitting) return;
    if (!validate()) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedCompany = company.trim();
    const currentSignature = [
      trimmedName,
      trimmedEmail.toLowerCase(),
      trimmedPhone,
      trimmedCompany,
      interestKey,
      teamSize,
    ].join('|');

    // Mantém a mesma chave de idempotência ao tentar reenviar os mesmos dados após falha temporária,
    // evitando duplicidade caso o servidor já tenha confirmado, e gera nova chave se os dados mudarem.
    if (submissionSignatureRef.current && submissionSignatureRef.current !== currentSignature) {
      idempotencyKeyRef.current = generateIdempotencyKey();
    }
    submissionSignatureRef.current = currentSignature;

    inFlightRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitDemoRequest({
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        company: trimmedCompany,
        interestKey,
        teamSize,
        website: honeypot,
        formStartedAt: formStartedAtRef.current,
        idempotencyKey: idempotencyKeyRef.current,
      });

      if (!result.ok) {
        if (result.fieldErrors) {
          setErrors((prev) => ({
            ...prev,
            name: result.fieldErrors?.name ?? prev.name,
            email: result.fieldErrors?.email ?? prev.email,
            phone: result.fieldErrors?.phone ?? prev.phone,
            company: result.fieldErrors?.company ?? prev.company,
          }));
        }
        setSubmitError(
          result.message ??
            'Não foi possível enviar sua solicitação no momento. Tente novamente em instantes.'
        );
        return;
      }

      setSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }
    } finally {
      inFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    const whatsappMessage = encodeURIComponent(
      `Olá! Sou ${name.trim()} da empresa ${company.trim()}. Gostaria de agendar uma demonstração de ${selectedInterest.label} (${teamSize}). E-mail: ${email.trim()} | Telefone: ${phone.trim()}.`
    );

    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-brand-accent/30 bg-brand-accent/10 p-6 dark:border-brand-accent/35 dark:bg-brand-accent/10 sm:p-8"
      >
        <div className="flex items-start gap-3.5">
          <CheckCircle2
            className="mt-0.5 h-6 w-6 text-brand-accent dark:text-brand-accent shrink-0"
            aria-hidden="true"
          />
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Solicitação registrada para {selectedInterest.label}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              Obrigado, <span className="font-semibold">{name.trim()}</span>. Recebemos os dados de{' '}
              <span className="font-semibold">{company.trim()}</span> ({email.trim()} · {teamSize}).
              Um especialista da Basesys entrará em contato em até 2 horas úteis para apresentar o
              ambiente de demonstração.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <a
                href={`https://wa.me/${COMPANY_CONTACT.whatsappDigits}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#06285A] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0D3878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent dark:bg-brand-accent dark:text-slate-950 dark:hover:bg-[#FF7A38]"
              >
                <span>Agilizar pelo WhatsApp</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setPhone('');
                  setCompany('');
                  setHoneypot('');
                  setErrors({});
                  setSubmitError(null);
                  formStartedAtRef.current = Date.now();
                  idempotencyKeyRef.current = generateIdempotencyKey();
                  submissionSignatureRef.current = '';
                }}
                className="inline-flex items-center text-sm font-semibold text-[#06285A] underline underline-offset-4 hover:text-[#0284C7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-sm dark:text-brand-accent dark:hover:text-white cursor-pointer"
              >
                Enviar outra solicitação
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const nameId = `${idPrefix}-name`;
  const nameErrId = `${idPrefix}-name-error`;
  const emailId = `${idPrefix}-email`;
  const emailErrId = `${idPrefix}-email-error`;
  const phoneId = `${idPrefix}-phone`;
  const phoneErrId = `${idPrefix}-phone-error`;
  const companyId = `${idPrefix}-company`;
  const companyErrId = `${idPrefix}-company-error`;
  const productId = `${idPrefix}-product`;
  const teamId = `${idPrefix}-team`;
  const honeypotId = `${idPrefix}-website`;

  const inputBaseClass =
    'mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F36319] dark:bg-[#0B0F1D] dark:text-slate-100 dark:placeholder:text-slate-500';

  return (
    <form onSubmit={handleSubmit} noValidate className={compact ? 'space-y-3.5' : 'space-y-4'}>
      <div aria-hidden="true" className="sr-only">
        <label htmlFor={honeypotId}>Website</label>
        <input
          id={honeypotId}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
      <fieldset disabled={isSubmitting} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <legend className="sr-only">Dados para solicitação de demonstração</legend>
        <div>
          <label
            htmlFor={nameId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Nome completo
          </label>
          <input
            id={nameId}
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? nameErrId : undefined}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="Ex.: Mariana Oliveira"
            className={`${inputBaseClass} ${
              errors.name
                ? 'border-red-500 dark:border-red-400'
                : 'border-slate-300 dark:border-white/10'
            }`}
          />
          {errors.name && (
            <p
              id={nameErrId}
              role="alert"
              className="mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={emailId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            E-mail corporativo
          </label>
          <input
            id={emailId}
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? emailErrId : undefined}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="nome@suaempresa.com.br"
            className={`${inputBaseClass} ${
              errors.email
                ? 'border-red-500 dark:border-red-400'
                : 'border-slate-300 dark:border-white/10'
            }`}
          />
          {errors.email && (
            <p
              id={emailErrId}
              role="alert"
              className="mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={phoneId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            WhatsApp ou Telefone
          </label>
          <input
            id={phoneId}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={15}
            required
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? phoneErrId : undefined}
            value={phone}
            onChange={(e) => {
              setPhone(formatBrazilPhone(e.target.value));
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
            }}
            placeholder="(11) 99999-0000"
            className={`${inputBaseClass} ${
              errors.phone
                ? 'border-red-500 dark:border-red-400'
                : 'border-slate-300 dark:border-white/10'
            }`}
          />
          {errors.phone && (
            <p
              id={phoneErrId}
              role="alert"
              className="mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={companyId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Empresa
          </label>
          <input
            id={companyId}
            type="text"
            autoComplete="organization"
            required
            aria-invalid={Boolean(errors.company)}
            aria-describedby={errors.company ? companyErrId : undefined}
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              if (errors.company) setErrors((prev) => ({ ...prev, company: undefined }));
            }}
            placeholder="Razão social ou nome fantasia"
            className={`${inputBaseClass} ${
              errors.company
                ? 'border-red-500 dark:border-red-400'
                : 'border-slate-300 dark:border-white/10'
            }`}
          />
          {errors.company && (
            <p
              id={companyErrId}
              role="alert"
              className="mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.company}</span>
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={productId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Solução ou segmento de interesse
          </label>
          <select
            id={productId}
            value={interestKey}
            onChange={(e) => setInterestKey(e.target.value)}
            className={`${inputBaseClass} border-slate-300 dark:border-white/10`}
          >
            {LEAD_INTEREST_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor={teamId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Porte da operação
          </label>
          <select
            id={teamId}
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            className={`${inputBaseClass} border-slate-300 dark:border-white/10`}
          >
            <option value="Até 15 usuários">Até 15 usuários</option>
            <option value="15 a 50 usuários">15 a 50 usuários</option>
            <option value="51 a 150 usuários">51 a 150 usuários</option>
            <option value="Acima de 150 usuários">Acima de 150 usuários</option>
          </select>
        </div>
      </fieldset>

      {submitError && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Demonstração ao vivo de 30 minutos com especialista técnico, sem compromisso.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#06285A] px-6 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#0D3878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-brand-accent dark:text-slate-950 dark:shadow-[0_0_24px_rgba(243,99,25,0.22)] dark:hover:bg-[#FF7A38] dark:focus-visible:ring-offset-obsidian-900 whitespace-nowrap shrink-0 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <span>Solicitar Demonstração</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
