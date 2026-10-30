import { Suspense, lazy, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { chapters, project, settings, visibleChapters } from '@/content/project';
import { sourceInventory } from '@/content/sources';
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
  ingles: () => <FilmFrame className="absolute inset-0" />,
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

const statusWord = { complete: 'Integrado', pending: 'Pendiente', partial: 'Parcial' };
const calendarKey: Partial<Record<ChapterId, string>> = { matematicas: 'Infografía', ciencias: 'Póster', ingles: 'Entrevista', 'lenguaje-sociales': 'Texto' };

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
          <p className="absolute bottom-4 right-[var(--gutter)] font-mono text-[0.56rem] uppercase tracking-[0.16em] text-ivory/40">{heroPhoto ? heroPhoto.credit : 'Ilustración del paisaje · no es una fotografía del viaje'}</p>
        </div>

        <div className="relative -mt-[100svh]">
          {/* Title */}
          <div data-title className="gutter flex h-[100svh] flex-col justify-center pt-[var(--nav-h)]">
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
            <p data-fade className="meta mt-4 text-ivory/45">
              A digital exhibition · five ways of reading La Guajira
            </p>
          </div>

          {/* The question */}
          <div className="gutter flex min-h-[90svh] items-center">
            <div className="max-w-5xl">
              <p className="meta text-sand">La pregunta de investigación</p>
              <p className="mt-6 font-display text-[clamp(1.9rem,4vw,4rem)] leading-[1.05] [text-shadow:0_2px_30px_rgba(7,24,34,.6)]">
                <Question />
              </p>
            </div>
          </div>

          {/* The IB concepts */}
          <div className="gutter flex min-h-[70svh] flex-col justify-center pb-16">
            <p className="meta text-ivory/50">Conceptos transversales del IB</p>
            <ul className="mt-5 flex flex-wrap gap-x-12 gap-y-3">
              {project.ibConcepts.map((c) => (
                <li key={c} className="font-display text-[clamp(2rem,4vw,3.6rem)] italic leading-none">
                  {c}
                </li>
              ))}
            </ul>
            <a href="#indice-capitulos" className="btn-text mt-10 text-ivory/70 hover:text-ivory">
              Recorrer los capítulos <span className="arrow">↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* Chapter index */}
      <section id="indice-capitulos" aria-labelledby="indice-title" className="gutter scroll-mt-[var(--nav-h)] py-24 md:py-36">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6 md:mb-24">
          <h2 id="indice-title" className="display-xl">
            Cinco <span className="italic text-sand">miradas</span>
          </h2>
          <p className="max-w-[36ch] text-ivory/55">Cada disciplina es una sala de la exposición, con su propio lenguaje. Entra en el orden que prefieras.</p>
        </div>
        <ol className="grid gap-x-10 gap-y-24 md:grid-cols-12 md:gap-y-20">
          {visibleChapters.map((c) => (
            <IndexEntry key={c.id} c={c} />
          ))}
        </ol>
      </section>

      {/* Archive */}
      <section aria-labelledby="archivo-title" className="gutter border-t border-ivory/10 py-24 md:py-32">
        <div className="grid gap-14 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <h2 id="archivo-title" className="display-lg">
              Archivo
            </h2>
            <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-ivory/55">{project.officialName}. Fechas de la hoja de ruta oficial.</p>
          </div>
          <ol>
            {chapters
              .filter((c) => c.id !== 'fisica' || settings.physicsMode !== 'hidden')
              .map((c) => {
                const key = calendarKey[c.id];
                const cal = key ? project.calendar.find((x) => x.what.startsWith(key)) : undefined;
                return (
                  <li key={c.id} className="border-t border-ivory/10">
                    <Link to={c.path} className="group grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-1 py-4 md:grid-cols-[2.5rem_1fr_9rem_7rem] md:items-baseline">
                      <span className="font-mono text-xs text-ivory/40">{c.numeral}</span>
                      <span className="font-display text-xl transition-colors group-hover:text-sand" lang={c.lang}>
                        {c.subject} <span className="text-ivory/45">— {c.product}</span>
                      </span>
                      <span className="meta col-start-2 text-ivory/45 md:col-start-auto">{cal?.when ?? '—'}</span>
                      <span className={`meta col-start-2 md:col-start-auto ${c.status === 'complete' ? 'text-turquoise' : 'text-gold'}`}>{statusWord[c.status]}</span>
                    </Link>
                  </li>
                );
              })}
          </ol>
        </div>

        <div className="mt-24 grid gap-14 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <p className="meta text-ivory/45">Notas para revisión académica</p>
          <ul className="space-y-4 text-sm leading-relaxed text-ivory/65">
            {sourceInventory.flags.map((f) => (
              <li key={f} className="border-l border-magenta/60 pl-4">
                {f}
              </li>
            ))}
          </ul>
        </div>

        <footer className="mt-28 grid gap-10 border-t border-ivory/10 pt-10 md:grid-cols-3">
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
