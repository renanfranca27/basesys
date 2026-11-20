import { ArrowUpRight, Check } from 'lucide-react';
import { motion } from 'motion/react';
import type { BasesysProduct, NexaSegmentId } from '../data/products';
import { InteractiveTiltCard } from './InteractiveTiltCard';

interface MidwayProductCardProps {
  product: BasesysProduct;
  index: number;
  onSelectLandingPage: (slug: string, segmentId?: NexaSegmentId) => void;
  onRequestDemo: (slug: string) => void;
  externalUrl?: string;
}

export function MidwayProductCard({
  product,
  index,
  onSelectLandingPage,
  onRequestDemo,
  externalUrl,
}: MidwayProductCardProps) {
  return (
    <InteractiveTiltCard delay={(index % 2) * 0.1}>
      {({ parallaxX, parallaxY }) => (
        <>
          <div className="relative z-10">
            <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-white/10">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {product.indexNumber} · {product.category}
              </span>
              <span className="font-mono text-xs font-semibold text-[#0284C7] dark:text-[#F36319]">
                Produto Pronto
              </span>
            </header>

            <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {product.name}
            </h3>
            <p className="mt-1.5 text-sm font-medium text-[#06285A] dark:text-[#F36319]">
              {product.tagline}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {product.description}
            </p>

            <motion.dl
              style={{ x: parallaxX, y: parallaxY }}
              className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 transition-colors duration-200 group-hover:border-slate-200 dark:border-white/10 dark:bg-[#0B0F1D] dark:group-hover:border-white/15"
            >
              <div className="flex flex-col-reverse">
                <dt className="mt-1 text-xs leading-snug text-slate-600 dark:text-slate-300">
                  {product.heroMetricContext}
                </dt>
                <dd className="font-display text-2xl font-extrabold text-[#06285A] tabular-nums dark:text-[#F36319]">
                  {product.heroMetric}
                </dd>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="mt-1 text-xs leading-snug text-slate-600 dark:text-slate-300">
                  {product.secondaryMetricContext}
                </dt>
                <dd className="font-display text-2xl font-extrabold text-[#06285A] tabular-nums dark:text-[#F36319]">
                  {product.secondaryMetric}
                </dd>
              </div>
            </motion.dl>

            <div className="mt-6">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Segmentos atendidos
              </p>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {product.modules.map((mod) => (
                  <li key={mod.id}>
                      <a
                        href={externalUrl ?? undefined}
                        target={externalUrl ? '_blank' : undefined}
                        rel={externalUrl ? 'noopener noreferrer' : undefined}
                        onClick={
                          externalUrl
                            ? undefined
                            : () => onSelectLandingPage(product.slug, mod.id)
                        }
                      className="flex w-full items-start gap-2 rounded-md py-0.5 text-left text-xs font-medium text-slate-700 transition-colors hover:text-[#0284C7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] dark:text-slate-200 dark:hover:text-[#F36319] cursor-pointer"
                    >
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 text-[#0284C7] dark:text-[#F36319] shrink-0"
                        aria-hidden="true"
                      />
                      <span className="underline-offset-2 hover:underline">{mod.name}</span>
                      </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <footer className="relative z-10 mt-8 flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={externalUrl ?? undefined}
              target={externalUrl ? '_blank' : undefined}
              rel={externalUrl ? 'noopener noreferrer' : undefined}
              onClick={externalUrl ? undefined : () => onSelectLandingPage(product.slug)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#06285A] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#0D3878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] dark:bg-[#F36319] dark:text-slate-950 dark:hover:bg-[#FF7A38] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Acessar Site do {product.shortName}</span>
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>

            <button
              type="button"
              onClick={() => onRequestDemo(product.slug)}
              className="inline-flex items-center justify-center text-sm font-semibold text-slate-700 underline underline-offset-4 transition-colors hover:text-[#06285A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] rounded-sm dark:text-slate-300 dark:hover:text-[#F36319] whitespace-nowrap cursor-pointer"
            >
              Solicitar Demonstração
            </button>
          </footer>
        </>
      )}
    </InteractiveTiltCard>
  );
}
