import { CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { PreviewRowState, ProductModule } from '../data/products';

interface ProductPreviewFrameProps {
  productName: string;
  module: ProductModule;
  compact?: boolean;
}

function StateIcon({ state }: { state: PreviewRowState }) {
  switch (state) {
    case 'Concluído':
      return (
        <CheckCircle2
          className="h-3.5 w-3.5 text-brand-accent dark:text-brand-accent shrink-0"
          aria-hidden="true"
        />
      );
    case 'Ativo':
      return (
        <PlayCircle
          className="h-3.5 w-3.5 text-[#0284C7] dark:text-[#7DD3FC] shrink-0"
          aria-hidden="true"
        />
      );
    case 'Em análise':
      return (
        <Clock
          className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0"
          aria-hidden="true"
        />
      );
  }
}

export function ProductPreviewFrame({
  productName,
  module,
  compact = false,
}: ProductPreviewFrameProps) {
  return (
    <figure
      aria-label={`Pré-visualização da interface: ${module.previewTitle}`}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-obsidian-900"
    >
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-[#0D1224] sm:px-5">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
            {productName} · Segmento {module.code}
          </p>
          <p className="truncate font-display text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
            {module.previewTitle}
          </p>
        </div>
        <span className="hidden sm:inline-block shrink-0 font-mono text-xs text-slate-500 dark:text-slate-400">
          {module.previewSubtitle}
        </span>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={module.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className={compact ? 'p-4 sm:p-5' : 'p-5 sm:p-6'}
        >
          <dl className="grid grid-cols-3 gap-3 border-b border-slate-100 pb-4 dark:border-white/10">
            {module.previewKpis.map((kpi) => (
              <div key={kpi.label} className="min-w-0">
                <dt className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {kpi.label}
                </dt>
                <dd className="mt-1 font-display text-lg font-bold tracking-tight text-[#06285A] tabular-nums dark:text-brand-accent sm:text-xl">
                  {kpi.value}
                </dd>
              </div>
            ))}
          </dl>

          <ul className="mt-4 divide-y divide-slate-100 dark:divide-white/10">
            {module.previewRows.map((row) => (
              <li
                key={row.label}
                className="flex flex-col gap-1.5 py-3 first:pt-1 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {row.label}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {row.detail}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end shrink-0">
                  <span className="font-mono text-xs font-semibold text-slate-800 tabular-nums dark:text-slate-200 sm:text-sm">
                    {row.value}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                    <StateIcon state={row.state} />
                    <span>{row.state}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </figure>
  );
}
