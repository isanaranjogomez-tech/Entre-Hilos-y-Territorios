import { Suspense, lazy, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { project, visibleChapters } from '@/content/project';
import type { ChapterId, ChapterMeta } from '@/content/types';
import { FilmFrame } from '@/components/editorial/ChapterVisuals';
import { PendingSlot } from '@/components/editorial/PendingSlot';
import { GuajiraLandscape } from '@/experiences/home/GuajiraLandscape';
import { BookVisual, LagoonPreview, MapPreview } from '@/experiences/home/Previews';
import { useGsap } from '@/hooks/useGsap';
import { gsap } from '@/lib/gsap';
import { asset } from '@/lib/asset';

const MochilaPreview = lazy(() => import('@/experiences/mathematics/MochilaPreview'));

/**
 * Set to an original panoramic photograph of the trip (in /public/images) to
 * replace the illustrated landscape, e.g. { src: 'images/guajira.jpg', alt, credit }.
 */
const heroPhoto: { src: string; alt: string; credit: string } | null = null;

/** Highlight colours for the research question (on the dark landscape). */
const hl = { turquoise: 'text-[#7fd1cc]', magenta: 'text-[#e88aac]', gold: 'text-gold' } as const;

function Question() {
  const parts: ReactNode[] = [];
  let rest = project.researchQuestion;
  project.questionHighlights.forEach((h) => {
    const i = rest.indexOf(h.phrase);
    if (i < 0) return;
    parts.push(rest.slice(0, i));
    parts.push(
      <em key={h.phrase} className={`italic ${hl[h.color]}`}>
        {h.phrase}
      </em>,
    );
    rest = rest.slice(i + h.phrase.length);
  });
  parts.push(rest);
  return <>{parts}</>;
}

const visualFor: Record<ChapterId, (hovered: boolean) => ReactNode> = {
  matematicas: (h) => (
    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 45%, #fdfaf4 0%, #efe6d8 55%, #ddcfb9 100%)' }}>
      <Suspense fallback={null}>
        <MochilaPreview hovered={h} />
      </Suspense>
    </div>
  ),
  ciencias: () => <LagoonPreview />,
  fisica: (h) => <MapPreview active={h} />,
  ingles: (h) => <FilmFrame className="absolute inset-0" playing={h} />,
  'lenguaje-sociales': () => <BookVisual />,
};

/** Asymmetric placement in the 12-column index: varied scale, crop and rhythm. */
const placement: Record<ChapterId, { wrap: string; frame: string }> = {
  matematicas: { wrap: 'md:col-span-7', frame: 'aspect-[4/5] md:aspect-[5/6]' },
  ciencias: { wrap: 'md:col-span-5 md:col-start-8 md:mt-40', frame: 'aspect-[4/3]' },
  fisica: { wrap: 'md:col-span-5 md:col-start-1 md:-mt-6', frame: 'aspect-[1055/1148]' },
  ingles: { wrap: 'md:col-span-7 md:col-start-6 md:mt-28', frame: 'aspect-video' },
  'lenguaje-sociales': { wrap: 'md:col-span-6 md:col-start-2 md:mt-4', frame: 'aspect-[16/10]' },
};

function IndexEntry({ c }: { c: ChapterMeta }) {
  const [hovered, setHovered] = useState(false);
  const p = placement[c.id];
  return (
    <li className={p.wrap} lang={c.lang}>
      <Link to={c.path} className="group block" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setHovered(true)} onBlur={() => setHovered(false)}>
        <div className={`relative overflow-hidden ${p.frame}`}>
          <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.035]">{visualFor[c.id](hovered)}</div>
        </div>
        <div className="mt-6 grid grid-cols-[auto_1fr] items-baseline gap-x-5">
          <span className="font-display text-4xl italic text-sand/80">{c.numeral}</span>
          <div>
            <p className="meta text-ivory/50">
              {c.subject} · {c.product}
            </p>
            <h3 className="mt-2 font-display text-[clamp(1.9rem,3.2vw,3.2rem)] leading-[0.98] transition-colors duration-500 group-hover:text-sand">{c.title}</h3>
            <p className="mt-3 max-w-[46ch] leading-relaxed text-ivory/60">{c.description}</p>
            <span className="mt-5 inline-flex items-center gap-3 rounded-full border border-ivory/25 px-5 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-ivory transition-colors group-hover:border-sand group-hover:text-sand">
              {c.lang === 'en' ? 'Enter chapter' : 'Entrar al capítulo'} <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default function HomePage() {
  const root = useRef<HTMLDivElement>(null);
  useGsap(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('[data-line]', { yPercent: 105, duration: 1.7, ease: 'expo.out', stagger: 0.14, delay: 0.15 });
      gsap.from('[data-fade]', { opacity: 0, y: 12, duration: 1.3, stagger: 0.1, delay: 0.8 });
      // Depth: each landscape layer drifts at its own speed while the story scrolls over it.
      gsap.utils.toArray<SVGGElement>('[data-depth]').forEach((g) => {
        const d = Number(g.dataset.depth);
        gsap.to(g, { yPercent: -d * 9, ease: 'none', scrollTrigger: { trigger: '[data-entrance]', start: 'top top', end: 'bottom bottom', scrub: true } });
      });
      gsap.to('[data-landscape]', { scale: 1.08, ease: 'none', scrollTrigger: { trigger: '[data-entrance]', start: 'top top', end: 'bottom bottom', scrub: true } });
      gsap.to('[data-title]', { opacity: 0, y: -80, ease: 'none', scrollTrigger: { trigger: '[data-title]', start: 'top top', end: '70% top', scrub: true } });
    });
  }, root);

  return (
    <div ref={root} lang="es" className="bg-ink text-ivory">
      {/* Entrance: the title, the question and the concepts scroll over a sticky landscape */}
      <section data-entrance aria-label="Entrada" className="relative">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div data-landscape className="absolute inset-0 origin-bottom">
            {heroPhoto ? <img src={asset(heroPhoto.src)} alt={heroPhoto.alt} className="h-full w-full object-cover" /> : <GuajiraLandscape className="h-full w-full" />}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/10 to-ink/75" aria-hidden />
          <p className="absolute right-[var(--gutter)] top-[calc(var(--nav-h)+0.5rem)] font-mono text-[0.56rem] uppercase tracking-[0.16em] text-ivory/40 md:bottom-4 md:top-auto">{heroPhoto ? heroPhoto.credit : 'Ilustración del paisaje · no es una fotografía del viaje'}</p>
        </div>

        <div className="relative -mt-[100svh]">
          <a href="#indice-capitulos" className="sr-only focus:not-sr-only">
            Ir a los capítulos
          </a>
          {/* Title */}
          <div data-title className="gutter flex h-[100svh] flex-col justify-center pb-36 pt-[var(--nav-h)] md:pb-28">
            <p data-fade className="meta text-sand">
              {project.program} · {project.institution}
            </p>
            <h1 className="display-hero mt-8" aria-label="Entre hilos y territorios">
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-line className="block">
                  Entre hilos
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-line className="block pl-[9vw] italic text-sand">
                  y territorios
                </span>
              </span>
            </h1>
            <p data-fade className="mt-8 max-w-[40ch] text-lg leading-relaxed text-ivory/90 [text-shadow:0_1px_18px_rgba(7,24,34,.9)] md:text-xl">
              {project.subtitle}
            </p>
          </div>

          {/* The five rooms, reachable from the first screen */}
          <nav aria-label="Capítulos" className="gutter absolute inset-x-0 top-[calc(100svh-7.5rem)] md:top-[calc(100svh-7rem)]">
            <ol data-fade className="-mx-[var(--gutter)] flex snap-x gap-6 overflow-x-auto border-t border-ivory/20 px-[var(--gutter)] pb-2 pt-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
              {visibleChapters.map((c) => (
                <li key={c.id} lang={c.lang} className="min-w-[10.5rem] snap-start md:min-w-0">
                  <Link to={c.path} className="group block">
                    <span className="meta text-sand/80">
                      {c.numeral} · {c.subject}
                    </span>
                    <span className="mt-1 block font-display text-[1.15rem] leading-tight text-ivory/90 transition-colors group-hover:text-sand md:text-[1.35rem]">{c.title}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          {/* The question and the IB concepts */}
          <div className="gutter flex min-h-[86svh] flex-col justify-center py-20">
            <div className="max-w-5xl">
              <p className="meta text-sand">La pregunta de investigación</p>
              <p className="mt-6 font-display text-[clamp(1.9rem,4vw,4rem)] leading-[1.05] [text-shadow:0_2px_30px_rgba(7,24,34,.6)]">
                <Question />
              </p>
            </div>
            <div className="mt-14">
              <p className="meta text-ivory/55">Conceptos transversales del IB</p>
              <ul className="mt-4 flex flex-wrap gap-x-10 gap-y-2">
                {project.ibConcepts.map((c) => (
                  <li key={c} className="font-display text-[clamp(1.8rem,3.4vw,3rem)] italic leading-none text-ivory/90">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter index */}
      <section id="indice-capitulos" aria-labelledby="indice-title" className="gutter scroll-mt-[var(--nav-h)] pb-24 pt-16 md:pb-32 md:pt-20">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <h2 id="indice-title" className="display-xl">
            Cinco <span className="italic text-sand">miradas</span>
          </h2>
          <p className="max-w-[36ch] text-ivory/55">Cada disciplina es una sala de la exposición, con su propio lenguaje. Entra en el orden que prefieras.</p>
        </div>
        <ol className="grid gap-x-10 gap-y-16 md:grid-cols-12 md:gap-y-16">
          {visibleChapters.map((c) => (
            <IndexEntry key={c.id} c={c} />
          ))}
        </ol>
      </section>

      <section aria-label="Créditos" className="gutter border-t border-ivory/10 pb-16 pt-12">
        <footer className="grid gap-10 md:grid-cols-3">
          <p className="font-display text-3xl leading-none">
            Entre hilos <span className="italic text-sand">y territorios</span>
          </p>
          <div>
            <p className="meta text-ivory/45">Equipo</p>
            {project.team ? (
              <ul className="mt-3 space-y-1">
                {project.team.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            ) : (
              <PendingSlot className="mt-3" label="Nombres del equipo" field="project.ts → team" />
            )}
          </div>
          <div className="text-sm text-ivory/55">
            <p className="text-ivory">{project.institution}</p>
            <p className="italic">{project.institutionMotto}</p>
            <p className="mt-2">
              {project.level} · {project.program}
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
}
