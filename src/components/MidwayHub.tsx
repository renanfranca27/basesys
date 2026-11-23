import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  CORPORATE_METRICS,
  CUSTOM_SOFTWARE_OFFERING,
  ENGINEERING_PILLARS,
  HUB_RESULTS_HIGHLIGHTS,
  NEXA_PRODUCT,
  type NexaSegmentId,
} from '../data/products';
import { LeadCaptureForm } from './LeadCaptureForm';
import { MidwayProductCard } from './MidwayProductCard';
import { InteractiveTiltCard } from './InteractiveTiltCard';
import { FaqSection } from './FaqSection';
import { HeroSystemsCanvas } from './HeroSystemsCanvas';

interface MidwayHubProps {
  isDark: boolean;
  onSelectLandingPage: (slug: string, segmentId?: NexaSegmentId) => void;
  onOpenDemoModal: (interestKey?: string) => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

function CustomSoftwareCard({
  onOpenDemoModal,
  onScrollToFaq,
}: {
  onOpenDemoModal: (interestKey: string) => void;
  onScrollToFaq: () => void;
}) {
  return (
    <InteractiveTiltCard delay={0.1}>
      {({ parallaxX, parallaxY }) => (
        <>
          <div className="relative z-10">
            <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-white/10">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {CUSTOM_SOFTWARE_OFFERING.indexNumber} · {CUSTOM_SOFTWARE_OFFERING.category}
              </span>
              <span className="font-mono text-xs font-semibold text-[#0284C7] dark:text-[#F36319]">
                {CUSTOM_SOFTWARE_OFFERING.badgeLabel}
              </span>
            </header>

            <h3 className="mt-5 flex items-center gap-2.5 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              <Code2
                className="h-5 w-5 text-[#0284C7] dark:text-[#F36319] shrink-0"
                aria-hidden="true"
              />
              <span>{CUSTOM_SOFTWARE_OFFERING.name}</span>
            </h3>
            <p className="mt-1.5 text-sm font-medium text-[#06285A] dark:text-[#F36319]">
              {CUSTOM_SOFTWARE_OFFERING.tagline}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {CUSTOM_SOFTWARE_OFFERING.description}
            </p>

            <motion.dl
              style={{ x: parallaxX, y: parallaxY }}
              className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 transition-colors duration-200 group-hover:border-slate-200 dark:border-white/10 dark:bg-[#0B0F1D] dark:group-hover:border-white/15"
            >
              {CUSTOM_SOFTWARE_OFFERING.metrics.map((metric) => (
                <div key={metric.value} className="flex flex-col-reverse">
                  <dt className="mt-1 text-xs leading-snug text-slate-600 dark:text-slate-300">
                    {metric.context}
                  </dt>
                  <dd className="font-display text-2xl font-extrabold text-[#06285A] tabular-nums dark:text-[#F36319]">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </motion.dl>

            <div className="mt-6">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                O que entregamos sob medida
              </p>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {CUSTOM_SOFTWARE_OFFERING.deliverables.map((item) => (
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
          </div>

          <footer className="relative z-10 mt-8 flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => onOpenDemoModal('sob-medida')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#06285A] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#0D3878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] dark:bg-[#F36319] dark:text-slate-950 dark:hover:bg-[#FF7A38] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Solicitar Projeto Sob Medida</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              onClick={onScrollToFaq}
              className="inline-flex items-center justify-center text-sm font-semibold text-slate-700 underline underline-offset-4 transition-colors hover:text-[#06285A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] rounded-sm dark:text-slate-300 dark:hover:text-[#F36319] whitespace-nowrap cursor-pointer"
            >
              Como funciona
            </button>
          </footer>
        </>
      )}
    </InteractiveTiltCard>
  );
}

export function MidwayHub({
  isDark,
  onSelectLandingPage,
  onOpenDemoModal,
}: MidwayHubProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. Hero Centralizado — Arquitetura Interativa em Canvas */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden border-b border-slate-200 bg-white pt-14 pb-16 transition-colors duration-200 dark:border-white/10 dark:bg-[#0B0F1D] lg:pt-24 lg:pb-20"
      >
        <HeroSystemsCanvas isDark={isDark} />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              className="font-mono text-xs font-medium tracking-wide text-[#0284C7] dark:text-[#F36319]"
            >
              Basesys · Gestão e Tecnologia
            </motion.p>

            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.06, ease: EASE_OUT_EXPO }}
              className="mx-auto mt-5 max-w-3xl font-display text-[clamp(2.5rem,5.2vw,4.25rem)] font-bold leading-[1.06] tracking-[-0.03em] text-slate-900 dark:text-white"
            >
              Software corporativo,{' '}
              <span className="text-[#0284C7] dark:text-[#F36319]">
                feito para escalar.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12, ease: EASE_OUT_EXPO }}
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg"
            >
              Desenvolvemos sistemas sob medida para qualquer tipo de negócio e oferecemos o{' '}
              <strong className="font-semibold text-slate-900 dark:text-white">NexaERP</strong>,
              nosso sistema completo de vendas e gestão pronto para 4 segmentos.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.18, ease: EASE_OUT_EXPO }}
              className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row"
            >
              <button
                type="button"
                onClick={() => onOpenDemoModal('nexa-erp')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#06285A] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#0D3878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] focus-visible:ring-offset-2 dark:bg-[#F36319] dark:text-slate-950 dark:shadow-[0_0_32px_rgba(243,99,25,0.28)] dark:hover:bg-[#FF7A38] dark:focus-visible:ring-offset-[#0B0F1D] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Agendar Demonstração</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('solucoes')}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition-colors duration-150 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] dark:border-white/15 dark:bg-[#161E35]/80 dark:text-white dark:hover:bg-[#1D2745] whitespace-nowrap shrink-0 cursor-pointer"
              >
                Explorar Soluções
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.24, ease: EASE_OUT_EXPO }}
              className="mt-10 flex justify-center"
            >
              <button
                type="button"
                onClick={() => scrollToSection('solucoes')}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 transition-colors hover:text-[#06285A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] rounded-sm dark:text-slate-400 dark:hover:text-[#F36319] cursor-pointer"
              >
                <span>Role para explorar</span>
                <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </motion.div>
          </div>

          {/* 4-column Corporate KPI Strip */}
          <dl
            aria-label="Indicadores corporativos da Basesys"
            className="mt-14 grid grid-cols-1 gap-6 border-t border-slate-200 pt-10 dark:border-white/10 sm:grid-cols-2 lg:grid-cols-4"
          >
            {CORPORATE_METRICS.map((metric, idx) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.42,
                  delay: idx * 0.07,
                  ease: EASE_OUT_EXPO,
                }}
                className="flex min-w-0 flex-col-reverse"
              >
                <dt className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {metric.label}
                </dt>
                <dd className="font-display text-3xl font-bold tracking-tight text-[#06285A] tabular-nums dark:text-[#F36319]">
                  {metric.value}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </section>

      {/* 2. Visão Resumida das Soluções Basesys (Direcionando para o Site do Produto) */}
      <section
        id="solucoes"
        aria-labelledby="solucoes-heading"
        className="bg-[#F8FAFC] py-20 transition-colors duration-200 dark:bg-[#0D1224] lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.38, ease: EASE_OUT_EXPO }}
              className="font-mono text-xs font-medium tracking-wide text-[#0284C7] dark:text-[#F36319]"
            >
              Produtos Criados &amp; Engenharia Sob Medida
            </motion.p>
            <motion.h2
              id="solucoes-heading"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.44, delay: 0.05, ease: EASE_OUT_EXPO }}
              className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
            >
              Conheça o NexaERP ou solicite um sistema desenvolvido sob medida para a sua empresa.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.44, delay: 0.1, ease: EASE_OUT_EXPO }}
              className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300"
            >
              Apresentamos um resumo das nossas frentes de entrega. Todas as especificações técnicas, módulos e telas do produto estão disponíveis no site dedicado do NexaERP.
            </motion.p>
          </header>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <MidwayProductCard
              product={NEXA_PRODUCT}
              index={0}
              onSelectLandingPage={onSelectLandingPage}
              onRequestDemo={(slug) => onOpenDemoModal(slug)}
              externalUrl="https://nexaerp.com.br"
            />

            <CustomSoftwareCard
              onOpenDemoModal={(key) => onOpenDemoModal(key)}
              onScrollToFaq={() => scrollToSection('faq')}
            />
          </div>
        </div>
      </section>

      {/* 3. Engenharia & Resultados Comprovados */}
      <section
        id="resultados"
        aria-labelledby="resultados-heading"
        className="border-t border-slate-200 bg-white py-20 transition-colors duration-200 dark:border-white/10 dark:bg-obsidian-950 lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.header
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className="max-w-2xl"
          >
            <p className="font-mono text-xs font-medium tracking-wide text-[#0284C7] dark:text-[#F36319]">
              Arquitetura e Resultados Comprovados
            </p>
            <h2
              id="resultados-heading"
              className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
            >
              Construído para crescer junto com a complexidade da sua operação.
            </h2>
          </motion.header>

          <ol className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {ENGINEERING_PILLARS.map((pillar, idx) => (
              <motion.li
                key={pillar.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.42,
                  delay: idx * 0.08,
                  ease: EASE_OUT_EXPO,
                }}
                className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 dark:border-white/10 dark:bg-obsidian-900 sm:p-7"
              >
                <p
                  aria-hidden="true"
                  className="font-mono text-xs font-semibold text-[#0284C7] dark:text-brand-accent"
                >
                  {pillar.number}.
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-slate-900 dark:text-white">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {pillar.description}
                </p>
              </motion.li>
            ))}
          </ol>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {HUB_RESULTS_HIGHLIGHTS.map((item, idx) => (
              <motion.article
                key={item.badge}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.1,
                  ease: EASE_OUT_EXPO,
                }}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#06285A] p-7 text-white dark:border-white/10 dark:bg-[#11172B] sm:p-8"
              >
                <figure>
                  <p className="font-mono text-xs font-medium text-[#38BDF8] dark:text-brand-accent">
                    {item.badge} · {item.sector}
                  </p>
                  <blockquote className="mt-4 font-display text-lg font-medium leading-relaxed text-white">
                    “{item.quote}”
                  </blockquote>
                  <p className="mt-4 border-t border-white/15 pt-4 text-sm text-slate-200 dark:border-white/10 dark:text-slate-300">
                    {item.outcome}
                  </p>

                  <figcaption className="mt-6 flex items-center justify-between gap-4 border-t border-white/15 pt-4 dark:border-white/10">
                    <div>
                      <cite className="block font-display text-sm font-bold not-italic text-white">
                        {item.author}
                      </cite>
                      <p className="text-xs text-slate-300 dark:text-slate-400">
                        {item.role}
                      </p>
                    </div>
                    {item.actionType === 'product' ? (
                      <button
                        type="button"
                        onClick={() => window.open('https://nexaerp.com.br', '_blank')}
                        className="inline-flex items-center gap-1.5 rounded-sm text-xs font-semibold text-[#38BDF8] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] dark:text-[#F36319] dark:hover:text-[#FF7A38] whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>{item.ctaLabel}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenDemoModal('sob-medida')}
                        className="inline-flex items-center gap-1.5 rounded-sm text-xs font-semibold text-[#38BDF8] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] dark:text-[#F36319] dark:hover:text-[#FF7A38] whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>{item.ctaLabel}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </figcaption>
                </figure>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Perguntas Frequentes */}
      <FaqSection onOpenDemoModal={() => onOpenDemoModal('nexa-erp')} />

      {/* 5. Conversão / Contato */}
      <section
        id="contato"
        aria-labelledby="contato-heading"
        className="border-t border-slate-200 bg-[#F8FAFC] py-20 transition-colors duration-200 dark:border-white/10 dark:bg-[#0D1224] lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
              className="lg:col-span-5"
            >
              <div className="inline-flex items-center justify-center rounded-2xl bg-[#06285A] px-4 py-2 dark:rounded-none dark:bg-transparent dark:p-0">
                <img
                  src="/assets/aistudio/logooficial_8bf58cab.png"
                  alt="Basesys — Gestão e Tecnologia"
                  referrerPolicy="no-referrer"
                  className="h-28 w-28 object-contain dark:h-32 dark:w-32 dark:-ml-4 dark:-my-4"
                />
              </div>

              <h2
                id="contato-heading"
                className="mt-6 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                Converse com a equipe de engenharia e produto da Basesys.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Quer conhecer o NexaERP na prática ou precisa de um sistema desenvolvido sob medida para a sua operação? Conte seu cenário atual e indicamos o melhor caminho.
              </p>

              <ul className="mt-6 space-y-3 border-t border-slate-200 pt-6 text-sm text-slate-700 dark:border-white/10 dark:text-slate-200">
                <li className="flex items-start gap-2.5">
                  <Check
                    className="mt-0.5 h-4 w-4 text-[#0284C7] dark:text-[#F36319] shrink-0"
                    aria-hidden="true"
                  />
                  <span>Demonstração prática do NexaERP no seu segmento</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check
                    className="mt-0.5 h-4 w-4 text-[#0284C7] dark:text-[#F36319] shrink-0"
                    aria-hidden="true"
                  />
                  <span>Roteiro de migração de dados e configuração assistida</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check
                    className="mt-0.5 h-4 w-4 text-[#0284C7] dark:text-[#F36319] shrink-0"
                    aria-hidden="true"
                  />
                  <span>Proposta para NexaERP ou projeto 100% sob medida</span>
                </li>
              </ul>
            </motion.header>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.48, delay: 0.1, ease: EASE_OUT_EXPO }}
              className="lg:col-span-7"
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#11172B] sm:p-8">
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  Solicitar Demonstração ou Proposta
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Selecione o segmento do NexaERP ou a opção de sistema sob medida.
                </p>
                <div className="mt-6">
                  <LeadCaptureForm defaultProductSlug="nexa-erp" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
