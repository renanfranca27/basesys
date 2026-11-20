import { useEffect, useRef, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { MotionConfig, motion } from 'motion/react';
import { PRODUCTS, type NexaSegmentId } from './data/products';
import { Navbar } from './components/Navbar';
import { MidwayHub } from './components/MidwayHub';
import { ProductLandingPage } from './components/ProductLandingPage';
import { Footer } from './components/Footer';
import { DemoModal } from './components/DemoModal';

const HOME_TITLE = 'Basesys — Gestão e Tecnologia | NexaERP e Sistemas Sob Medida';

function getSlugFromHash(): string | null {
  const hash = window.location.hash;
  const match = hash.match(/^#\/solucoes\/([a-z0-9-]+)$/i);
  if (!match) return null;
  const slug = match[1];
  return PRODUCTS.some((p) => p.slug === slug) ? slug : null;
}

function getInitialDarkMode(): boolean {
  try {
    const stored = window.localStorage.getItem('basesys-theme');
    if (stored === 'light') return false;
    if (stored === 'dark') return true;
    return true;
  } catch {
    return true;
  }
}

export default function App() {
  const [activeProductSlug, setActiveProductSlug] = useState<string | null>(() =>
    getSlugFromHash()
  );
  const [selectedSegmentId, setSelectedSegmentId] = useState<NexaSegmentId>('lojas-varejo');
  const [isDark, setIsDark] = useState<boolean>(() => getInitialDarkMode());
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoInterestKey, setDemoInterestKey] = useState<string | undefined>(undefined);

  const scrollTimerRef = useRef<number | null>(null);
  const skipNextHashScrollRef = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    try {
      window.localStorage.setItem('basesys-theme', isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage failures in restricted contexts
    }
  }, [isDark]);

  useEffect(() => {
    const product = activeProductSlug
      ? PRODUCTS.find((p) => p.slug === activeProductSlug)
      : null;
    document.title = product
      ? `${product.name} — Basesys | Gestão e Tecnologia`
      : HOME_TITLE;
  }, [activeProductSlug]);

  useEffect(() => {
    const handleHashChange = () => {
      const nextSlug = getSlugFromHash();
      setActiveProductSlug(nextSlug);
      if (skipNextHashScrollRef.current) {
        skipNextHashScrollRef.current = false;
        return;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  const scheduleScrollToElement = (elementId: string, delayMs: number, fallbackTop = false) => {
    if (scrollTimerRef.current !== null) {
      window.clearTimeout(scrollTimerRef.current);
    }
    scrollTimerRef.current = window.setTimeout(() => {
      scrollTimerRef.current = null;
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (fallbackTop) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, delayMs);
  };

  const navigateToProduct = (slug: string, segmentId?: NexaSegmentId) => {
    if (segmentId) {
      setSelectedSegmentId(segmentId);
    }
    const targetHash = `#/solucoes/${slug}`;
    if (window.location.hash !== targetHash) {
      skipNextHashScrollRef.current = true;
      window.location.hash = targetHash;
    }
    setActiveProductSlug(slug);

    if (segmentId) {
      scheduleScrollToElement('funcionalidades-produto', 80, true);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateHome = (sectionId?: string) => {
    if (window.location.hash && window.location.hash !== '#/') {
      skipNextHashScrollRef.current = true;
      window.location.hash = '#/';
    }
    setActiveProductSlug(null);

    if (sectionId) {
      scheduleScrollToElement(sectionId, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openDemoModal = (interestKey?: string) => {
    setDemoInterestKey(interestKey ?? activeProductSlug ?? PRODUCTS[0].slug);
    setDemoModalOpen(true);
  };

  const activeProduct = activeProductSlug
    ? PRODUCTS.find((p) => p.slug === activeProductSlug) ?? null
    : null;

  return (
    <MotionConfig reducedMotion="never">
      <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-slate-900 transition-colors duration-200 dark:bg-[#0B0F1D] dark:text-slate-100">
        <a
          href="#conteudo-principal"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-[#06285A] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F36319] dark:focus:bg-[#F36319] dark:focus:text-slate-950"
        >
          Pular para o conteúdo principal
        </a>

        <Navbar
          activeSlug={activeProductSlug}
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
          onNavigateHome={navigateHome}
          onOpenDemoModal={openDemoModal}
        />

        <main id="conteudo-principal" className="flex-1">
          {activeProduct ? (
            <ProductLandingPage
              key={activeProduct.slug}
              product={activeProduct}
              initialSegmentId={selectedSegmentId}
              onBackToHub={() => navigateHome()}
              onOpenDemoModal={openDemoModal}
            />
          ) : (
            <MidwayHub
              isDark={isDark}
              onSelectLandingPage={navigateToProduct}
              onOpenDemoModal={openDemoModal}
            />
          )}
        </main>

        <Footer onNavigateHome={navigateHome} />

        <motion.button
          type="button"
          onClick={() => openDemoModal(activeProductSlug ?? undefined)}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Fale conosco"
          className="fixed bottom-5 right-5 z-30 inline-flex h-11 items-center gap-2.5 rounded-full border border-white/15 bg-[#06285A] px-5 text-sm font-semibold text-white shadow-lg transition-colors duration-150 hover:bg-[#0D3878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] focus-visible:ring-offset-2 dark:border-white/10 dark:bg-[#F36319] dark:text-slate-950 dark:shadow-[0_8px_28px_rgba(243,99,25,0.28)] dark:hover:bg-[#FF7A38] dark:focus-visible:ring-offset-[#0B0F1D] whitespace-nowrap shrink-0 cursor-pointer"
        >
          <MessageSquare
            className="h-4 w-4 text-[#38BDF8] dark:text-slate-950 shrink-0"
            aria-hidden="true"
          />
          <span>Fale conosco</span>
        </motion.button>

        <DemoModal
          isOpen={demoModalOpen}
          defaultProductSlug={demoInterestKey}
          onClose={() => setDemoModalOpen(false)}
        />
      </div>
    </MotionConfig>
  );
}
