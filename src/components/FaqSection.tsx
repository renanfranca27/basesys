import { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

interface FaqItem {
  number: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    number: '01',
    question: 'Quais produtos prontos a Basesys oferece e vocês também desenvolvem sob medida?',
    answer:
      'Atualmente nosso produto pronto é o NexaERP — um sistema completo de vendas e gestão (PDV, CRM, estoque, financeiro e fiscal) preparado para 4 segmentos: Lojas e Varejo, Mercados e Padarias, Bares e Restaurantes e Salões e Barbearias. Além disso, desenvolvemos sistemas 100% sob medida para regras exclusivas de qualquer tipo de negócio.',
  },
  {
    number: '02',
    question: 'Como funciona a implantação e a migração dos dados atuais da empresa?',
    answer:
      'Nosso time técnico conduz a implantação assistida conforme o segmento escolhido no NexaERP ou o escopo do projeto sob medida. Apoiamos na importação de clientes, produtos, grades, códigos de barras e saldos iniciais, além da parametrização fiscal e treinamento prático da equipe.',
  },
  {
    number: '03',
    question: 'Os sistemas exigem servidor próprio ou instalação local nos computadores?',
    answer:
      'Não. Tanto o NexaERP quanto nossos sistemas sob medida operam em nuvem com acesso direto pelo navegador e backups automáticos, permitindo acompanhar vendas, estoque, comandas e agenda de qualquer computador, tablet ou celular.',
  },
  {
    number: '04',
    question: 'Quais integrações o NexaERP e os sistemas sob medida suportam?',
    answer:
      'O NexaERP conta com emissão fiscal (NFC-e, NF-e e NFS-e), integração com balanças de checkout, impressoras de etiquetas térmicas, leitores de código de barras, PIX e maquininhas TEF. Em projetos sob medida, também conectamos APIs REST, Webhooks, bancos e ERPs externos.',
  },
  {
    number: '05',
    question: 'Como funciona o suporte técnico e a atualização fiscal após a entrada em produção?',
    answer:
      'O suporte é prestado diretamente pela equipe própria da Basesys no Brasil via chat, WhatsApp e atendimento remoto. Atualizações fiscais, melhorias contínuas e ajustes de segurança são aplicados automaticamente na nuvem sem custos extras de atualização.',
  },
  {
    number: '06',
    question: 'Como saber se devo contratar o NexaERP ou um sistema sob medida?',
    answer:
      'Se a sua operação se encaixa em Lojas e Varejo, Mercados e Padarias, Bares e Restaurantes ou Salões e Barbearias, o NexaERP já entrega tudo pronto para começar rápido. Caso sua empresa possua processos próprios ou integrações específicas, agendamos uma conversa técnica para desenhar uma solução sob medida.',
  },
];

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface FaqSectionProps {
  onOpenDemoModal: () => void;
}

export function FaqSection({ onOpenDemoModal }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const prefersReducedMotion = useReducedMotion();

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="border-t border-slate-200 bg-white py-20 transition-colors duration-200 dark:border-white/10 dark:bg-[#0B0F1D] lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className="lg:col-span-4"
          >
            <p className="font-mono text-xs font-medium tracking-wide text-[#0284C7] dark:text-[#F36319]">
              Perguntas Frequentes
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Dúvidas comuns sobre nossos sistemas e implantação.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Respostas diretas sobre projetos sob medida, produtos prontos por segmento, segurança em nuvem, integrações via API e suporte nacional.
            </p>

            <button
              type="button"
              onClick={onOpenDemoModal}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors duration-150 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] dark:border-white/15 dark:bg-[#161E35] dark:text-white dark:hover:bg-[#1D2745] whitespace-nowrap cursor-pointer"
            >
              <span>Tirar Dúvida com Especialista</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </motion.div>

          <div className="lg:col-span-8 space-y-3">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index;
              const buttonId = `faq-trigger-${item.number}`;
              const panelId = `faq-panel-${item.number}`;

              return (
                <motion.div
                  key={item.number}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.38,
                    delay: index * 0.04,
                    ease: EASE_OUT_EXPO,
                  }}
                  className={`overflow-hidden rounded-2xl border transition-colors duration-200 ${
                    isOpen
                      ? 'border-[#06285A]/30 bg-[#F8FAFC] dark:border-[#F36319]/45 dark:bg-[#11172B]'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-[#11172B]/70 dark:hover:border-white/20'
                  }`}
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleItem(index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F36319] sm:px-6 sm:py-5 cursor-pointer"
                    >
                      <span className="flex items-baseline gap-3.5">
                        <span className="font-mono text-xs font-semibold text-[#0284C7] dark:text-[#F36319] shrink-0">
                          {item.number}.
                        </span>
                        <span className="font-display text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                          {item.question}
                        </span>
                      </span>

                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
                        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                          isOpen
                            ? 'border-[#06285A]/20 bg-white text-[#06285A] dark:border-[#F36319]/40 dark:bg-[#161E35] dark:text-[#F36319]'
                            : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-[#0D1224] dark:text-slate-400'
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                      </motion.span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={
                          prefersReducedMotion
                            ? { opacity: 1 }
                            : { opacity: 0, height: 0 }
                        }
                        animate={
                          prefersReducedMotion
                            ? { opacity: 1 }
                            : { opacity: 1, height: 'auto' }
                        }
                        exit={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : { opacity: 0, height: 0 }
                        }
                        transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          initial={prefersReducedMotion ? false : { y: -6 }}
                          animate={{ y: 0 }}
                          exit={prefersReducedMotion ? undefined : { y: -6 }}
                          transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
                          className="border-t border-slate-200/80 px-5 pt-4 pb-5 pl-12 text-sm leading-relaxed text-slate-600 dark:border-white/10 dark:text-slate-300 sm:px-6 sm:pl-14"
                        >
                          {item.answer}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
