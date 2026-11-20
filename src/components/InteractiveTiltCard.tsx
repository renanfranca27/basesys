import { useRef, type MouseEvent, type ReactNode } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';

export interface TiltCardRenderProps {
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
}

interface InteractiveTiltCardProps {
  delay?: number;
  children: (props: TiltCardRenderProps) => ReactNode;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function InteractiveTiltCard({ delay = 0, children }: InteractiveTiltCardProps) {
  const cardRef = useRef<HTMLElement>(null);

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

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.48, delay, ease: EASE_OUT_EXPO }}
      style={{ perspective: 1100 }}
      className="h-full"
    >
      <motion.article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{
          y: -6,
          transition: { type: 'spring', stiffness: 320, damping: 24 },
        }}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-[border-color,box-shadow,background-color] duration-200 hover:border-[#0EA5E9]/40 hover:shadow-lg dark:border-white/10 dark:bg-[#11172B] dark:hover:border-[#F36319]/45 sm:p-8"
      >
        <motion.div
          aria-hidden="true"
          style={{
            background: sheenBackground,
            opacity: smoothSheenOpacity,
          }}
          className="pointer-events-none absolute inset-0 z-0"
        />
        {children({ parallaxX, parallaxY })}
      </motion.article>
    </motion.div>
  );
}
