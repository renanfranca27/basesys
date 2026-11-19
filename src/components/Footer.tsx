interface FooterProps {
  onNavigateHome: (sectionId?: string) => void;
}

export function Footer({ onNavigateHome }: FooterProps) {
  const navLinks = [
    { label: 'Soluções', target: 'solucoes' },
    { label: 'Resultados', target: 'resultados' },
    { label: 'Dúvidas', target: 'faq' },
    { label: 'Contato', target: 'contato' },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white transition-colors duration-200 dark:border-white/10 dark:bg-[#0D1224]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                onNavigateHome();
              }}
              className="inline-flex items-center justify-center rounded-2xl bg-[#06285A] px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36319] dark:rounded-none dark:bg-transparent dark:p-0"
            >
              <img
                src="/assets/aistudio/logooficial_8bf58cab.png"
                alt="Basesys — Gestão e Tecnologia"
                referrerPolicy="no-referrer"
                className="h-28 w-28 object-contain dark:h-32 dark:w-32 dark:-ml-4 dark:-my-4"
              />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Criadora do NexaERP e especialista no desenvolvimento de sistemas sob medida para qualquer negócio.
            </p>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
              Navegação
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
              {navLinks.map((item) => (
                <li key={item.target}>
                  <button
                    type="button"
                    onClick={() => onNavigateHome(item.target)}
                    className="transition-colors hover:text-[#06285A] dark:hover:text-[#F36319] cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
              Contato
            </h3>
            <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">E-mail</p>
                <a
                  href="mailto:comercial@basesys.com.br"
                  className="mt-0.5 inline-block transition-colors hover:text-[#06285A] dark:hover:text-[#F36319]"
                >
                  comercial@basesys.com.br
                </a>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Whatsapp</p>
                <a
                  href="https://wa.me/5583999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 inline-block tabular-nums transition-colors hover:text-[#06285A] dark:hover:text-[#F36319]"
                >
                  (83) 99999-9999
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
              Siga-nos
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Acompanhe nossas novidades e dicas nas redes sociais.
            </p>
            <div className="mt-5 flex items-center gap-5 text-slate-700 dark:text-white">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-colors hover:text-[#06285A] dark:hover:text-[#F36319]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="transition-colors hover:text-[#06285A] dark:hover:text-[#F36319]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="transition-colors hover:text-[#06285A] dark:hover:text-[#F36319]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="transition-colors hover:text-[#06285A] dark:hover:text-[#F36319]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>©{new Date().getFullYear()} Basesys Gestão e Tecnologia Ltda. Todos os direitos reservados.</p>
          <p>Arquitetura 100% Web · Hospedagem em Nuvem no Brasil · Conformidade LGPD</p>
        </div>
      </div>
    </footer>
  );
}
