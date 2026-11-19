import { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LeadCaptureForm } from './LeadCaptureForm';

interface DemoModalProps {
  isOpen: boolean;
  defaultProductSlug?: string;
  onClose: () => void;
}

export function DemoModal({ isOpen, defaultProductSlug, onClose }: DemoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050811]/75 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#11172B] sm:p-8"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4 dark:border-white/10">
              <div>
                <p className="font-mono text-xs font-medium text-[#0284C7] dark:text-[#F36319]">
                  Basesys · Atendimento Consultivo
                </p>
                <h2
                  id="demo-modal-title"
                  className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white sm:text-2xl"
                >
                  Agendar demonstração técnica
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800 dark:border-white/10 dark:bg-[#161E35] dark:text-slate-300 dark:hover:bg-[#1E2846] dark:hover:text-white cursor-pointer"
                aria-label="Fechar janela"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6">
              <LeadCaptureForm defaultProductSlug={defaultProductSlug} compact />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
