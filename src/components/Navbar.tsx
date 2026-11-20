import { useEffect, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';

interface NavbarProps {
  activeSlug: string | null;
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigateHome: (sectionId?: string) => void;
  onOpenDemoModal: (productId?: string) => void;
}

export function Navbar({
  activeSlug,
  isDark,
  onToggleTheme,
  onNavigateHome,
  onOpenDemoModal,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileOpen]);

  const navItems = activeSlug
    ? [
        { label: 'Soluções', target: 'solucoes' },
        { label: 'Funcionalidades', target: 'funcionalidades' },
        { label: 'Resultados', target: 'resultados' },
        { label: 'Contato', target: 'contato' },
      ]
    : [
        { label: 'Soluções', target: 'solucoes' },
        { label: 'Resultados', target: 'resultados' },
        { label: 'Dúvidas', target: 'faq' },
        { label: 'Contato', target: 'contato' },
      ];

  const handleLinkClick = (target: string) => {
    setMobileOpen(false);
    if (activeSlug) {
      if (target === 'contato') {
        const el = document.getElementById('contato-produto');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      if (target === 'funcionalidades') {
        const el = document.getElementById('funcionalidades-produto');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      if (target === 'resultados') {
        const el = document.getElementById('resultados-produto');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      onNavigateHome(target);
      return;
    }
    onNavigateHome(target);
  };

  return (
    <header className="sticky top-0 z-40 w-full pt-3 pb-2 transition-colors duration-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-8 rounded-2xl border border-slate-200/90 bg-white/90 px-4 shadow-sm backdrop-blur-md transition-colors duration-200 dark:border-white/10 dark:bg-[#11172B]/90 dark:shadow-[0_12px_36px_rgba(0,0,0,0.45)] sm:px-6">
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              setMobileOpen(false);
              onNavigateHome();
            }}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 rounded-md py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319]"
            aria-label="Basesys página inicial"
          >
            <span className="relative h-9 w-9 overflow-hidden rounded-xl bg-[#06285A] shrink-0 dark:bg-transparent">
              <img
                src="/assets/aistudio/logooficial_8bf58cab.png"
                alt="Símbolo Basesys"
                referrerPolicy="no-referrer"
                className="pointer-events-none absolute left-1/2 top-1/2 h-[230%] w-[230%] max-w-none -translate-x-1/2 -translate-y-[34.6%] select-none"
              />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-[#06285A] dark:text-white">
              Basesys
            </span>
          </a>

          <nav aria-label="Navegação principal" className="hidden md:block">
            <ul className="flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
              {navItems.map((item) => (
                <li key={item.target}>
                  <button
                    type="button"
                    onClick={() => handleLinkClick(item.target)}
                    className="whitespace-nowrap shrink-0 py-1 text-slate-600 transition-colors duration-150 hover:text-[#06285A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] dark:text-slate-300 dark:hover:text-[#F36319] rounded-sm cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
              aria-pressed={isDark}
              title={isDark ? 'Modo claro' : 'Modo escuro'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors duration-150 hover:bg-slate-100 hover:text-[#06285A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] dark:border-white/10 dark:bg-[#161E35] dark:text-slate-200 dark:hover:bg-[#1E2846] dark:hover:text-[#F36319] cursor-pointer"
            >
              {isDark ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onOpenDemoModal(activeSlug ?? undefined)}
              className="hidden sm:inline-flex items-center justify-center rounded-xl bg-[#06285A] px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#0D3878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] focus-visible:ring-offset-2 dark:bg-[#F36319] dark:text-slate-950 dark:shadow-[0_0_24px_rgba(243,99,25,0.22)] dark:hover:bg-[#FF7A38] dark:focus-visible:ring-offset-[#11172B] whitespace-nowrap shrink-0 cursor-pointer"
            >
              Agendar Demonstração
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:hidden hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] dark:border-white/10 dark:bg-[#161E35] dark:text-slate-200 dark:hover:bg-[#1E2846]"
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-lg md:hidden dark:border-white/10 dark:bg-[#11172B]">
            <nav aria-label="Navegação mobile">
              <ul className="flex flex-col gap-1.5">
                {navItems.map((item) => (
                  <li key={item.target}>
                    <button
                      type="button"
                      onClick={() => handleLinkClick(item.target)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#06285A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] dark:text-slate-200 dark:hover:bg-[#161E35] dark:hover:text-[#F36319] cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenDemoModal(activeSlug ?? undefined);
                }}
                className="mt-3 flex w-full items-center justify-center rounded-xl bg-[#06285A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0D3878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] dark:bg-[#F36319] dark:text-slate-950 dark:hover:bg-[#FF7A38] cursor-pointer"
              >
                Agendar Demonstração
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
