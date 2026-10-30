import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { chapters, project, visibleChapters } from '@/content/project';

/** Chapters with light pages get an ivory bar; the rest an ink bar. */
const LIGHT = ['/matematicas', '/ciencias', '/lenguaje-sociales'];

/**
 * Fixed global navigation. Transparent over each page's opening, it becomes a
 * discreet solid bar in the page's tone (and slightly shorter) once the page
 * scrolls. Desktop lists the five chapters with the active one marked;
 * smaller screens keep a compact "Capítulos" menu.
 */
export function SiteHeader() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const first = useRef<HTMLAnchorElement>(null);
  const current = chapters.find((c) => c.path === pathname);

  const light = LIGHT.includes(pathname);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    first.current?.focus();
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      toggle.current?.focus();
    };
  }, [open]);

  return (
    <>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink">
        Saltar al contenido
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,color] duration-500 ${
          open
            ? 'border-transparent text-ivory'
            : `${light ? 'text-navy' : 'text-ivory'} ${
                scrolled ? (light ? 'border-navy/10 bg-[#f6f1e7]/95 backdrop-blur-sm' : 'border-ivory/10 bg-[#071822]/92 backdrop-blur-sm') : 'border-transparent'
              }`
        }`}
      >
        <nav aria-label="Principal" className={`gutter flex items-center justify-between gap-6 transition-[height] duration-500 ${scrolled && !open ? 'h-[52px]' : 'h-[var(--nav-h)]'}`}>
          <Link to="/" className="font-display text-[1.35rem] leading-none tracking-tight" aria-label="Entre hilos y territorios — inicio">
            Entre hilos <span className="italic">y territorios</span>
          </Link>
          {/* Desktop: the five chapters, always one click away */}
          <ol className="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-7" aria-label="Capítulos">
            {visibleChapters.map((c) => (
              <li key={c.id}>
                <NavLink to={c.path} lang={c.lang} className={({ isActive }) => `meta group relative whitespace-nowrap py-2 transition-opacity ${isActive ? 'opacity-100' : 'opacity-55 hover:opacity-100'}`}>
                  {({ isActive }) => (
                    <>
                      <span className="mr-2 opacity-60">{c.numeral}</span>
                      {c.subject.split(' · ')[0]}
                      <span className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-500 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ol>
          {current && (
            <p className="meta hidden flex-1 text-center opacity-70 md:block lg:hidden" aria-current="page">
              {current.numeral} — {current.subject}
            </p>
          )}
          <button
            ref={toggle}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="indice"
            className="meta flex items-center gap-3"
          >
            {open ? 'Cerrar' : 'Capítulos'}
            <span aria-hidden className="relative block h-2.5 w-6">
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-500 ${open ? 'top-1 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-500 ${open ? 'top-1 -rotate-45' : 'top-2.5'}`} />
            </span>
          </button>
        </nav>
      </header>

      <div
        id="indice"
        role="dialog"
        aria-modal="true"
        aria-label="Capítulos"
        className={`fixed inset-0 z-40 overflow-y-auto bg-ink transition-[clip-path,visibility] duration-700 ease-[cubic-bezier(.7,0,.2,1)] ${open ? 'visible [clip-path:inset(0)]' : 'invisible [clip-path:inset(0_0_100%_0)]'}`}
      >
        <div className="gutter grid min-h-full content-between gap-12 pb-12 pt-28">
          <ol>
            <li>
              <NavLink ref={first} to="/" end tabIndex={open ? 0 : -1} className="group flex items-baseline gap-6 border-b border-ivory/10 py-4">
                {({ isActive }) => (
                  <>
                    <span className="meta w-10 text-ivory/40">—</span>
                    <span className={`font-display text-[clamp(1.8rem,4vw,3.4rem)] leading-none transition-colors ${isActive ? 'text-gold' : 'group-hover:text-sand'}`}>Inicio</span>
                  </>
                )}
              </NavLink>
            </li>
            {visibleChapters.map((c) => (
              <li key={c.id}>
                <NavLink to={c.path} tabIndex={open ? 0 : -1} className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-6 border-b border-ivory/10 py-4 md:grid-cols-[2.5rem_1fr_14rem]">
                  {({ isActive }) => (
                    <>
                      <span className="meta text-ivory/40">{c.numeral}</span>
                      <span className={`font-display text-[clamp(1.8rem,4vw,3.4rem)] leading-none transition-colors ${isActive ? 'text-gold' : 'group-hover:text-sand'}`}>
                        {c.title}
                      </span>
                      <span className="meta col-start-2 mt-2 text-ivory/45 md:col-start-3 md:mt-0" lang={c.lang}>
                        {c.subject}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ol>
          <p className="meta text-ivory/40">
            {project.program} · {project.institution}
          </p>
        </div>
      </div>
    </>
  );
}
