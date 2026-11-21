import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  Check,
  Quote,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  UtensilsCrossed,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { BasesysProduct, NexaSegmentId } from '../data/products';
import { ProductPreviewFrame } from './ProductPreviewFrame';
import { LeadCaptureForm } from './LeadCaptureForm';

interface ProductLandingPageProps {
  product: BasesysProduct;
  initialSegmentId?: NexaSegmentId;
  onBackToHub: () => void;
  onOpenDemoModal: (interestKey: string) => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

function getSegmentIcon(id: NexaSegmentId) {
  switch (id) {
    case 'lojas-varejo':
      return ShoppingBag;
    case 'mercados-padarias':
      return ShoppingCart;
    case 'bares-restaurantes':
      return UtensilsCrossed;
    case 'saloes-barbearias':
      return Scissors;
  }
}

export function ProductLandingPage({
  product,
  initialSegmentId,
  onBackToHub,
  onOpenDemoModal,
}: ProductLandingPageProps) {
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(() => {
    if (!initialSegmentId) return 0;
    const idx = product.modules.findIndex((m) => m.id === initialSegmentId);
    return idx >= 0 ? idx : 0;
  });

  useEffect(() => {
    if (!initialSegmentId) return;
    const idx = product.modules.findIndex((m) => m.id === initialSegmentId);
    setSelectedModuleIdx(idx >= 0 ? idx : 0);
  }, [initialSegmentId, product.modules]);

  const currentModule = product.modules[selectedModuleIdx] ?? product.modules[0];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
      className="bg-[#F8FAFC] transition-colors duration-200 dark:bg-obsidian-950"
    >
      {/* Contextual Sub-bar: Voltar + Atalho para os 4 Segmentos do NexaERP */}
      <nav
        aria-label={`Atalhos de segmentos do ${product.name}`}
        className="border-b border-slate-200 bg-white dark:border-white/10 dark:bg-[#0D1224]"
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onBackToHub}
            className="inline-flex items-center gap-2 rounded text-xs font-semibold text-slate-600 transition-colors hover:text-[#06285A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] dark:text-slate-300 dark:hover:text-[#F36319] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Voltar ao Portal Basesys</span>
          </button>

          <ul className="flex items-center gap-1.5 overflow-x-auto">
            {product.modules.map((seg, idx) => {
              const active = idx === selectedModuleIdx;
              return (
                <li key={seg.id} className="shrink-0">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setSelectedModuleIdx(idx);
                      scrollToSection('funcionalidades-produto');
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] ${
                      active
                        ? 'bg-[#06285A] text-white dark:bg-brand-accent dark:text-slate-950'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-obsidian-800 dark:hover:text-white'
                    }`}
                  >
                    {seg.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Dedicated NexaERP Hero */}
      <section
        aria-labelledby="product-hero-heading"
        className="border-b border-slate-200 bg-white py-16 dark:border-white/10 dark:bg-obsidian-950 lg:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <p className="font-mono text-xs font-medium text-[#0284C7] dark:text-brand-accent">
                  {product.name} · {product.category}
                </p>
                <h1
                  id="product-hero-heading"
                  className="mt-3 font-display text-[clamp(2.1rem,3.6vw,3.25rem)] font-bold leading-[1.08] tracking-tight text-slate-900 dark:text-white"
                >
                  {product.headline}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                  {product.description}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => scrollToSection('contato-produto')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#06285A] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#0D3878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] dark:bg-[#F36319] dark:text-slate-950 dark:shadow-[0_0_28px_rgba(243,99,25,0.25)] dark:hover:bg-[#FF7A38] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Solicitar Demonstração do {product.shortName}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('segmentos-nexa')}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] dark:border-white/15 dark:bg-[#161E35] dark:text-white dark:hover:bg-[#1D2745] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Ver 4 Segmentos
                  </button>
                </div>
              </div>

              <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-slate-200 pt-6 dark:border-white/10">
                <div className="flex flex-col-reverse">
                  <dt className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {product.heroMetricContext}
                  </dt>
                  <dd className="font-display text-3xl font-bold text-[#06285A] tabular-nums dark:text-[#F36319]">
                    {product.heroMetric}
                  </dd>
                </div>
                <div className="flex flex-col-reverse">
                  <dt className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {product.secondaryMetricContext}
                  </dt>
                  <dd className="font-display text-3xl font-bold text-[#06285A] tabular-nums dark:text-[#F36319]">
                    {product.secondaryMetric}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="rounded-2xl border border-slate-200 bg-[#06285A] p-4 shadow-sm dark:border-white/10 dark:bg-[#11172B] sm:p-6">
                <div className="mb-4 flex items-center justify-between text-xs text-slate-300">
                  <span className="font-medium text-white">{product.tagline}</span>
                  <span className="font-mono text-[#38BDF8] dark:text-[#F36319]">
                    {product.landingUrlLabel}
                  </span>
                </div>
                <ProductPreviewFrame
                  productName={product.name}
                  module={currentModule}
                  compact
                />
              </div>
            </div>
          </div>

          {/* 5 Módulos Base do NexaERP */}
          <ul
            aria-label={`Módulos base do ${product.name}`}
            className="mt-14 grid grid-cols-1 gap-4 border-t border-slate-200 pt-10 dark:border-white/10 sm:grid-cols-2 lg:grid-cols-5"
          >
            {product.corePillars.map((pillar) => (
              <li
                key={pillar.title}
                className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-4 dark:border-white/10 dark:bg-obsidian-900"
              >
                <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                  {pillar.title}
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {pillar.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Soluções por Segmento no NexaERP (4 Cards) */}
      <section
        id="segmentos-nexa"
        aria-labelledby="segmentos-heading"
        className="border-b border-slate-200 bg-[#F8FAFC] py-16 dark:border-white/10 dark:bg-[#0D1224] lg:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="max-w-2xl">
            <p className="font-mono text-xs font-medium tracking-wide text-[#0284C7] dark:text-brand-accent">
              Feito para o seu negócio · NexaERP
            </p>
            <h2
              id="segmentos-heading"
              className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              Soluções por Segmento no NexaERP
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              O NexaERP se adapta às necessidades específicas da sua empresa. Selecione um segmento para explorar as especificações detalhadas abaixo.
            </p>
          </header>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {product.modules.map((segment, idx) => {
              const Icon = getSegmentIcon(segment.id);
              const isActive = idx === selectedModuleIdx;
              return (
                <motion.article
                  key={segment.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    duration: 0.4,
                    delay: idx * 0.06,
                    ease: EASE_OUT_EXPO,
                  }}
                  whileHover={{
                    y: -4,
                    transition: { type: 'spring', stiffness: 320, damping: 24 },
                  }}
                  className={`group flex flex-col justify-between rounded-2xl border p-6 transition-colors duration-200 ${
                    isActive
                      ? 'border-[#06285A] bg-white shadow-sm dark:border-[#F36319] dark:bg-[#11172B]'
                      : 'border-slate-200 bg-white hover:border-[#0284C7]/50 dark:border-white/10 dark:bg-[#11172B] dark:hover:border-[#F36319]/60'
                  }`}
                >
                  <div>
                    <header className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                          isActive
                            ? 'border-[#0284C7]/40 bg-[#F8FAFC] text-[#0284C7] dark:border-[#F36319]/50 dark:bg-[#0B0F1D] dark:text-[#F36319]'
                            : 'border-slate-200 bg-[#F8FAFC] text-[#06285A] dark:border-white/10 dark:bg-[#0B0F1D] dark:text-[#F36319]'
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span
                        aria-hidden="true"
                        className="font-mono text-xs font-medium text-slate-400 dark:text-slate-500"
                      >
                        {segment.code}
                      </span>
                    </header>

                    <h3 className="mt-5 font-display text-lg font-bold text-slate-900 dark:text-white">
                      {segment.name}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {segment.summary}
                    </p>

                    <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 dark:border-white/10">
                      {segment.cardHighlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-200"
                        >
                          <Check
                            className="mt-0.5 h-3.5 w-3.5 text-[#0284C7] dark:text-[#F36319] shrink-0"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <footer className="mt-6 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedModuleIdx(idx);
                        scrollToSection('funcionalidades-produto');
                      }}
                      className={`w-full rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] ${
                        isActive
                          ? 'bg-[#06285A] text-white dark:bg-[#F36319] dark:text-slate-950'
                          : 'border border-slate-300 bg-white text-slate-800 hover:border-[#06285A] hover:bg-[#06285A] hover:text-white dark:border-white/15 dark:bg-[#0B0F1D] dark:text-white dark:hover:border-[#F36319] dark:hover:bg-[#F36319] dark:hover:text-slate-950'
                      }`}
                    >
                      Ver Detalhes
                    </button>
                  </footer>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Deep-dive Especificações & Funcionalidades por Segmento */}
      <section
        id="funcionalidades-produto"
        aria-labelledby="funcionalidades-heading"
        className="bg-white py-16 dark:bg-[#0B0F1D] lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.42, ease: EASE_OUT_EXPO }}
            className="max-w-2xl"
          >
            <p className="font-mono text-xs font-medium text-[#0284C7] dark:text-[#F36319]">
              Especificações e Fluxos · {product.name}
            </p>
            <h2
              id="funcionalidades-heading"
              className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              Cada segmento com rotinas prontas para operar sem adaptações improvisadas.
            </h2>
          </motion.header>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div
              role="tablist"
              aria-label={`Segmentos do ${product.name}`}
              aria-orientation="vertical"
              className="lg:col-span-5 space-y-3"
            >
              {product.modules.map((mod, index) => {
                const isSelected = index === selectedModuleIdx;
                return (
                  <button
                    key={mod.id}
                    id={`segment-tab-${mod.id}`}
                    role="tab"
                    type="button"
                    aria-selected={isSelected}
                    aria-controls={`segment-panel-${mod.id}`}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => setSelectedModuleIdx(index)}
                    onKeyDown={(e) => {
                      const total = product.modules.length;
                      let nextIdx: number | null = null;
                      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                        nextIdx = (index + 1) % total;
                      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                        nextIdx = (index - 1 + total) % total;
                      } else if (e.key === 'Home') {
                        nextIdx = 0;
                      } else if (e.key === 'End') {
                        nextIdx = total - 1;
                      }
                      if (nextIdx !== null) {
                        e.preventDefault();
                        setSelectedModuleIdx(nextIdx);
                        const nextMod = product.modules[nextIdx];
                        document.getElementById(`segment-tab-${nextMod.id}`)?.focus();
                      }
                    }}
                    className={`w-full rounded-xl border p-5 text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] ${
                      isSelected
                        ? 'border-[#06285A] bg-[#F8FAFC] shadow-sm dark:border-[#F36319] dark:bg-[#161E35]'
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-[#11172B] dark:hover:border-white/20'
                    }`}
                  >
                    <span className="block font-mono text-xs font-medium text-[#0284C7] dark:text-[#F36319]">
                      Segmento {mod.code} · {mod.shortTag}
                    </span>
                    <span className="mt-1 block font-display text-lg font-bold text-slate-900 dark:text-white">
                      {mod.name}
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {mod.summary}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              id={`segment-panel-${currentModule.id}`}
              role="tabpanel"
              aria-labelledby={`segment-tab-${currentModule.id}`}
              className="lg:col-span-7 space-y-6"
            >
              <ProductPreviewFrame productName={product.name} module={currentModule} />

              <article className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 dark:border-white/10 dark:bg-[#11172B]">
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  Fluxo de operação · {currentModule.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {currentModule.workflow}
                </p>

                <ul className="mt-5 space-y-2.5 border-t border-slate-200/80 pt-5 dark:border-white/10">
                  {currentModule.capabilities.map((cap) => (
                    <li
                      key={cap}
                      className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 text-[#0284C7] dark:text-[#F36319] shrink-0"
                        aria-hidden="true"
                      />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>

                <footer className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/80 pt-4 dark:border-white/10">
                  <span className="text-xs font-semibold text-[#06285A] dark:text-[#F36319]">
                    Resultado esperado: {currentModule.impactMetric}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenDemoModal(currentModule.id)}
                    className="rounded-sm text-xs font-semibold text-[#0284C7] underline underline-offset-4 hover:text-[#06285A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] dark:text-[#F36319] dark:hover:text-white cursor-pointer"
                  >
                    Ver {currentModule.name} ao vivo na demo
                  </button>
                </footer>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations & Security + Case Study */}
      <section
        id="resultados-produto"
        aria-labelledby="resultados-produto-heading"
        className="border-y border-slate-200 bg-[#F8FAFC] py-16 dark:border-white/10 dark:bg-[#0D1224] lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-8">
              <div>
                <div className="flex items-center gap-2 text-[#0284C7] dark:text-[#F36319]">
                  <Blocks className="h-4 w-4" aria-hidden="true" />
                  <span className="font-mono text-xs font-medium">Ecossistema Conectado</span>
                </div>
                <h2
                  id="resultados-produto-heading"
                  className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white"
                >
                  Integrações nativas e segurança em nuvem
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  {product.integrations.map((item) => (
                    <li
                      key={item}
                      className="flex items-center justify-between border-b border-slate-200/80 py-2 last:border-0 dark:border-white/10"
                    >
                      <span>{item}</span>
                      <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                        Suportado
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#11172B]">
                <div className="flex items-center gap-2 text-[#06285A] dark:text-[#F36319]">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  <h3 className="font-display text-sm font-bold dark:text-white">
                    Governança &amp; Proteção de Dados
                  </h3>
                </div>
                <ul className="mt-3 space-y-2">
                  {product.securityHighlights.map((sec) => (
                    <li
                      key={sec}
                      className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                    >
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 text-[#0284C7] dark:text-[#F36319] shrink-0"
                        aria-hidden="true"
                      />
                      <span>{sec}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>

            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
              className="lg:col-span-7"
            >
              <figure className="flex h-full flex-col justify-between rounded-2xl border border-transparent bg-[#06285A] p-8 text-white dark:border-white/10 dark:bg-[#11172B] sm:p-10">
                <div>
                  <header className="flex items-center justify-between gap-4 border-b border-white/15 pb-4 dark:border-white/10">
                    <span className="font-mono text-xs font-medium text-[#38BDF8] dark:text-[#F36319]">
                      Estudo de Caso · {product.caseStudy.sector}
                    </span>
                    <Quote
                      className="h-5 w-5 text-[#38BDF8] dark:text-[#F36319]"
                      aria-hidden="true"
                    />
                  </header>

                  <blockquote className="mt-6 font-display text-xl font-medium leading-relaxed text-white sm:text-2xl">
                    “{product.caseStudy.quote}”
                  </blockquote>

                  <dl className="mt-8 grid grid-cols-1 gap-6 border-t border-white/15 pt-6 dark:border-white/10 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-semibold text-slate-300 dark:text-slate-400">
                        Cenário anterior
                      </dt>
                      <dd className="mt-1.5 text-sm leading-relaxed text-slate-200 dark:text-slate-300">
                        {product.caseStudy.before}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-[#38BDF8] dark:text-[#F36319]">
                        Resultado mensurado
                      </dt>
                      <dd className="mt-1.5 text-sm leading-relaxed text-white">
                        {product.caseStudy.outcome}
                      </dd>
                    </div>
                  </dl>
                </div>

                <figcaption className="mt-8 border-t border-white/15 pt-5 dark:border-white/10">
                  <cite className="block font-display text-base font-bold not-italic text-white">
                    {product.caseStudy.author}
                  </cite>
                  <p className="text-xs text-slate-300 dark:text-slate-400">
                    {product.caseStudy.role} · {product.caseStudy.company}
                  </p>
                </figcaption>
              </figure>
            </motion.article>
          </div>
        </div>
      </section>

      {/* Plans & Deployment Models */}
      <section
        id="planos-produto"
        aria-labelledby="planos-heading"
        className="bg-white py-16 dark:bg-[#0B0F1D] lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="max-w-2xl">
            <p className="font-mono text-xs font-medium text-[#0284C7] dark:text-[#F36319]">
              Modelos de Licenciamento
            </p>
            <h2
              id="planos-heading"
              className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              Escolha a escala ideal para a sua operação.
            </h2>
          </header>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {product.plans.map((plan, idx) => (
              <motion.article
                key={plan.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.42,
                  delay: idx * 0.08,
                  ease: EASE_OUT_EXPO,
                }}
                whileHover={{
                  y: -4,
                  transition: { type: 'spring', stiffness: 320, damping: 24 },
                }}
                className={`flex flex-col justify-between rounded-2xl border p-6 sm:p-7 ${
                  plan.recommended
                    ? 'border-[#06285A] bg-[#F8FAFC] shadow-md dark:border-[#F36319] dark:bg-[#161E35]'
                    : 'border-slate-200 bg-white dark:border-white/10 dark:bg-[#11172B]'
                }`}
              >
                <div>
                  <header className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                      {plan.name}
                    </h3>
                    {plan.recommended && (
                      <span className="text-xs font-semibold text-[#0284C7] dark:text-[#F36319]">
                        Mais adotado
                      </span>
                    )}
                  </header>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                    {plan.audience}
                  </p>

                  <div className="mt-5 border-y border-slate-200/80 py-4 dark:border-white/10">
                    <p className="font-display text-lg font-bold text-[#06285A] dark:text-[#F36319]">
                      {plan.priceLabel}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {plan.billingNote}
                    </p>
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {plan.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 text-[#0284C7] dark:text-[#F36319] shrink-0"
                          aria-hidden="true"
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <footer className="mt-8">
                  <button
                    type="button"
                    onClick={() =>
                      onOpenDemoModal(
                        plan.name.includes('Sob Medida') ? 'sob-medida' : currentModule.id
                      )
                    }
                    className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] ${
                      plan.recommended
                        ? 'bg-[#06285A] text-white hover:bg-[#0D3878] dark:bg-[#F36319] dark:text-slate-950 dark:hover:bg-[#FF7A38]'
                        : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-white/15 dark:bg-[#0B0F1D] dark:text-white dark:hover:bg-[#1D2745]'
                    }`}
                  >
                    Solicitar Proposta {plan.name}
                  </button>
                </footer>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Product Conversion Section */}
      <section
        id="contato-produto"
        aria-labelledby="contato-produto-heading"
        className="border-t border-slate-200 bg-[#F8FAFC] py-16 dark:border-white/10 dark:bg-[#0D1224] lg:py-24"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#11172B] sm:p-10">
            <header className="max-w-2xl">
              <p className="font-mono text-xs font-medium text-[#0284C7] dark:text-[#F36319]">
                Demonstração Personalizada · {product.name}
              </p>
              <h2
                id="contato-produto-heading"
                className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl"
              >
                Agende uma sessão técnica aplicada ao seu segmento.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Preencha os dados abaixo para testar o {product.name} ({currentModule.name}) com um especialista da Basesys.
              </p>
            </header>

            <div className="mt-8">
              <LeadCaptureForm defaultProductSlug={currentModule.id} />
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
