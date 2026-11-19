import { useRef, type MouseEvent } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';
import type { BasesysProduct } from '../data/products';

interface MidwayProductCardProps {
  product: BasesysProduct;
  index: number;
  onSelectLandingPage: (slug: string) => void;
  onRequestDemo: (slug: string) => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function MidwayProductCard({
  product,
  index,
  onSelectLandingPage,
  onRequestDemo,
}: MidwayProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const sheenX = useMotionValue(0);
  const sheenY = useMotionValue(0);
  const sheenOpacity = useMotionValue(0);

  const springConfig = { stiffness: 260, damping: 24, mass: 0.6 };
  const smoothX = useSpring(pointerX, springConfig);
  const smoothY = useSpring(pointerY, springConfig);
  const smoothSheenOpacity = useSpring(sheenOpacity, { stiffness: 220, damping: 28 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [2.2, -2.2]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-2.2, 2.2]);
  const parallaxX = useTransform(smoothX, [-0.5, 0.5], [-3, 3]);
  const parallaxY = useTransform(smoothY, [-0.5, 0.5], [-3, 3]);

  const sheenBackground = useMotionTemplate`radial-gradient(380px circle at ${sheenX}px ${sheenY}px, rgba(243, 99, 25, 0.14), transparent 70%)`;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    pointerX.set(relX / rect.width - 0.5);
    pointerY.set(relY / rect.height - 0.5);
    sheenX.set(relX);
    sheenY.set(relY);
    sheenOpacity.set(1);
  };

  const handleMouseLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
    sheenOpacity.set(0);
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.48,
        delay: (index % 2) * 0.1,
        ease: EASE_OUT_EXPO,
      }}
      style={{ perspective: 1100 }}
      className="h-full"
    >
      <motion.article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={
          prefersReducedMotion
            ? undefined
            : {
                y: -6,
                transition: { type: 'spring', stiffness: 320, damping: 24 },
              }
        }
        style={
          prefersReducedMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }
        }
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-[border-color,box-shadow,background-color] duration-200 hover:border-[#0EA5E9]/40 hover:shadow-lg dark:border-white/10 dark:bg-[#11172B] dark:hover:border-[#F36319]/45 sm:p-8"
      >
        {!prefersReducedMotion && (
          <motion.div
            aria-hidden="true"
            style={{
              background: sheenBackground,
              opacity: smoothSheenOpacity,
            }}
            className="pointer-events-none absolute inset-0 z-0"
          />
        )}

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-white/10">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {product.indexNumber} · {product.category}
            </span>
            <span className="font-mono text-xs font-semibold text-[#0284C7] dark:text-[#F36319]">
              Produto Pronto
            </span>
          </div>

          <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {product.name}
          </h3>
          <p className="mt-1.5 text-sm font-medium text-[#06285A] dark:text-[#F36319]">
            {product.tagline}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {product.description}
          </p>

          <motion.div
            style={
              prefersReducedMotion
                ? undefined
                : { x: parallaxX, y: parallaxY }
            }
            className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 transition-colors duration-200 group-hover:border-slate-200 dark:border-white/10 dark:bg-[#0B0F1D] dark:group-hover:border-white/15"
          >
            <div>
              <p className="font-display text-2xl font-extrabold text-[#06285A] tabular-nums dark:text-[#F36319]">
                {product.heroMetric}
              </p>
              <p className="mt-1 text-xs leading-snug text-slate-600 dark:text-slate-300">
                {product.heroMetricContext}
              </p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-[#06285A] tabular-nums dark:text-[#F36319]">
                {product.secondaryMetric}
              </p>
              <p className="mt-1 text-xs leading-snug text-slate-600 dark:text-slate-300">
                {product.secondaryMetricContext}
              </p>
            </div>
          </motion.div>

          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Segmentos atendidos
            </p>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {product.modules.map((mod) => (
                <li
                  key={mod.id}
                  className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-200"
                >
                  <Check
                    className="mt-0.5 h-3.5 w-3.5 text-[#0284C7] dark:text-[#F36319] shrink-0"
                    aria-hidden="true"
                  />
                  <span>{mod.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative z-10 mt-8 flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => onSelectLandingPage(product.slug)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#06285A] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#0D3878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] dark:bg-[#F36319] dark:text-slate-950 dark:hover:bg-[#FF7A38] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Acessar Site do {product.shortName}</span>
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={() => onRequestDemo(product.slug)}
            className="inline-flex items-center justify-center text-sm font-semibold text-slate-700 underline underline-offset-4 transition-colors hover:text-[#06285A] dark:text-slate-300 dark:hover:text-[#F36319] whitespace-nowrap cursor-pointer"
          >
            Solicitar Demonstração
          </button>
        </div>
      </motion.article>
    </motion.div>
  );
}
