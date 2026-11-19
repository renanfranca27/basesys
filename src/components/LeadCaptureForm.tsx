import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { LEAD_INTEREST_OPTIONS } from '../data/products';

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

export function LeadCaptureForm({
  defaultProductSlug,
  compact = false,
  onSuccess,
}: LeadCaptureFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [interestKey, setInterestKey] = useState(
    defaultProductSlug || LEAD_INTEREST_OPTIONS[0].value
  );
  const [teamSize, setTeamSize] = useState('Até 15 usuários');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

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
    if (digits.length < 10) {
      nextErrors.phone = 'Informe DDD e telefone ou WhatsApp válido.';
    }
    if (company.trim().length < 2) {
      nextErrors.company = 'Informe o nome da sua empresa.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    if (onSuccess) {
      onSuccess();
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-[#F36319]/30 bg-[#F36319]/10 p-6 dark:border-[#F36319]/35 dark:bg-[#F36319]/10 sm:p-8">
        <div className="flex items-start gap-3.5">
          <CheckCircle2
            className="mt-0.5 h-6 w-6 text-[#F36319] dark:text-[#F36319] shrink-0"
            aria-hidden="true"
          />
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Solicitação registrada para {selectedInterest.label}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              Recebemos os dados de <span className="font-semibold">{company}</span> ({email}). Um especialista da Basesys entrará em contato em até 2 horas úteis para apresentar o ambiente de demonstração.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setPhone('');
                setCompany('');
                setErrors({});
              }}
              className="mt-5 inline-flex items-center text-sm font-semibold text-[#06285A] underline underline-offset-4 hover:text-[#0284C7] dark:text-[#F36319] dark:hover:text-white cursor-pointer"
            >
              Enviar outra solicitação
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inputBaseClass =
    'mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F36319] dark:bg-[#0B0F1D] dark:text-slate-100 dark:placeholder:text-slate-500';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className={compact ? 'grid grid-cols-1 gap-4 sm:grid-cols-2' : 'grid grid-cols-1 gap-4 sm:grid-cols-2'}>
        <div>
          <label
            htmlFor="lead-name"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Nome completo
          </label>
          <input
            id="lead-name"
            type="text"
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
            <p className="mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lead-email"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            E-mail corporativo
          </label>
          <input
            id="lead-email"
            type="email"
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
            <p className="mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lead-phone"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            WhatsApp ou Telefone
          </label>
          <input
            id="lead-phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
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
            <p className="mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lead-company"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Empresa
          </label>
          <input
            id="lead-company"
            type="text"
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
            <p className="mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.company}</span>
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lead-product"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Solução ou segmento de interesse
          </label>
          <select
            id="lead-product"
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
            htmlFor="lead-team"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Porte da operação
          </label>
          <select
            id="lead-team"
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
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Demonstração ao vivo de 30 minutos com especialista técnico, sem compromisso.
        </p>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#06285A] px-6 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#0D3878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] focus-visible:ring-offset-2 dark:bg-[#F36319] dark:text-slate-950 dark:shadow-[0_0_24px_rgba(243,99,25,0.22)] dark:hover:bg-[#FF7A38] dark:focus-visible:ring-offset-[#11172B] whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Solicitar Demonstração</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
