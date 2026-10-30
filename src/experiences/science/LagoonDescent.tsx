import { useRef, type ReactNode } from 'react';
import { chapterById } from '@/content/project';
import { science, type FieldPhoto, type HabitatRow } from '@/content/science';
import { useGsap } from '@/hooks/useGsap';
import { useMediaQuery, useReducedMotion } from '@/hooks/useMedia';
import { gsap } from '@/lib/gsap';
import { asset } from '@/lib/asset';
import { Flock, LagoonReeds, LagoonWorld, STAGE, WORLD_H } from './LagoonWorld';

const meta = chapterById('ciencias');
const row = (element: string) => science.habitat.find((r) => r.element.startsWith(element))!;

type Tone = 'sky' | 'deep' | 'paper';
interface Beat {
  id: string;
  tone: Tone;
  depth: string;
  content: ReactNode;
}

/** A field photograph as a print, at (close to) its native 253 × 112 px. */
function Print({ p, tilt = 0 }: { p: FieldPhoto; tilt?: number }) {
  return (
    <figure className="w-[min(300px,100%)] bg-[#fbf8f1] p-2 pb-3 shadow-[0_24px_50px_-24px_rgba(11,34,48,.55)]" style={{ transform: `rotate(${tilt}deg)` }}>
      <img src={asset(p.src)} alt={p.alt} width={253} height={112} className="w-full" />
      <figcaption className="mt-2 text-[0.7rem] leading-snug text-navy/70">{p.caption}</figcaption>
    </figure>
  );
}

function HabitatBeat({ r, n }: { r: HabitatRow; n: number }) {
  return (
    <>
      <p className="meta opacity-70">Results · Biology & ecological evidence · {n} / 3</p>
      <h2 className="display-md mt-3">{r.element}</h2>
      <dl className="mt-6 space-y-4">
        <div>
          <dt className="meta opacity-60">Ecological role</dt>
          <dd className="mt-1 text-[1.08rem] leading-relaxed">{r.role}</dd>
        </div>
        <div>
          <dt className="meta text-[#e98aa9]">Threat / action</dt>
          <dd className="mt-1 text-[1.08rem] leading-relaxed">{r.threat}</dd>
        </div>
      </dl>
    </>
  );
}

/** Beats in scroll order; the camera moves from the sky to the lagoon floor. */
const beats: Beat[] = [
  {
    id: 'hero',
    tone: 'sky',
    depth: 'Surface',
    content: (
      <>
        <p className="meta text-[#13807e]">
          Chapter {meta.numeral} · {meta.subject}
        </p>
        <h1 className="display-xl mt-5 max-w-[12ch]">
          Coastal Lagoons, <span className="italic">Fishing</span> & Water Quality
        </h1>
        <p className="meta mt-6 opacity-60">{science.subtitle}</p>
        <p className="mt-6 max-w-[40ch] font-display text-[clamp(1.2rem,1.8vw,1.6rem)] leading-snug">{science.researchQuestion}</p>
      </>
    ),
  },
  {
    id: 'objective',
    tone: 'sky',
    depth: 'Surface',
    content: (
      <>
        <p className="meta text-[#13807e]">Objective & case focus</p>
        <div className="mt-5 space-y-4 font-display text-[clamp(1.3rem,1.9vw,1.75rem)] leading-snug">
          {science.objective.map((o) => (
            <p key={o}>{o}</p>
          ))}
        </div>
        <p className="meta mt-6 opacity-55">
          {science.authors.join(' · ')} — {science.affiliation}
        </p>
        <div className="mt-7">
          <Print p={science.photos[0]} tilt={-1.5} />
        </div>
      </>
    ),
  },
  {
    id: 'place',
    tone: 'sky',
    depth: 'Shoreline',
    content: (
      <>
        <p className="meta text-[#13807e]">The place</p>
        <p className="mt-5 text-[1.12rem] leading-relaxed">{science.place}</p>
        <div className="mt-7">
          <Print p={science.photos[1]} tilt={1.2} />
        </div>
      </>
    ),
  },
  { id: 'birds', tone: 'sky', depth: 'Shoreline', content: <HabitatBeat r={row('Flamingos')} n={1} /> },
  { id: 'water', tone: 'deep', depth: 'Waterline', content: <HabitatBeat r={row('Lagoon water')} n={2} /> },
  { id: 'fish', tone: 'deep', depth: 'Water column', content: <HabitatBeat r={row('Fish')} n={3} /> },
  {
    id: 'methods',
    tone: 'deep',
    depth: 'Lagoon floor',
    content: (
      <>
        <p className="meta text-[#8fd0cd]">Methods & sources</p>
        <ol className="mt-5 space-y-5">
          {science.methods.map((m, i) => (
            <li key={m.label} className="grid grid-cols-[2rem_1fr]">
              <span className="font-mono text-xs text-[#8fd0cd]">0{i + 1}</span>
              <div>
                <h3 className="font-display text-2xl leading-tight">{m.label}</h3>
                <p className="mt-1.5 text-[0.98rem] leading-relaxed opacity-80">{m.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </>
    ),
  },
  {
    id: 'film',
    tone: 'deep',
    depth: 'Surface film',
    content: (
      <>
        <p className="meta text-gold">Conservation challenge</p>
        <p className="mt-5 font-display text-[clamp(1.35rem,2vw,1.85rem)] leading-snug">{science.challenge}</p>
        <p className="mt-6 font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.14em] text-gold/80">Hypothetical film shown above · conceptual, not observed in the lagoon</p>
      </>
    ),
  },
  {
    id: 'model',
    tone: 'paper',
    depth: 'Model',
    content: (
      <>
        <p className="meta text-magenta">{science.modelTitle}</p>
        <ol className="mt-5 space-y-2 font-display text-[clamp(1.4rem,2.1vw,2rem)] leading-tight">
          {science.modelChain.split('→').map((s, i) => (
            <li key={s} className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-[#13807e]">0{i + 1}</span>
              {s.trim()}
            </li>
          ))}
        </ol>
      </>
    ),
  },
];

const depths = [...new Set(beats.map((b) => b.depth))];

const toneClass: Record<Tone, string> = {
  sky: 'text-navy min-[900px]:bg-gradient-to-r min-[900px]:from-[#e6eeea]/95 min-[900px]:via-[#e6eeea]/75 min-[900px]:to-transparent bg-gradient-to-t from-[#e6eeea] via-[#e6eeea]/90 to-transparent',
  deep: 'text-ivory min-[900px]:bg-gradient-to-r min-[900px]:from-[#071822]/80 min-[900px]:via-[#071822]/50 min-[900px]:to-transparent bg-gradient-to-t from-[#071822] via-[#071822]/85 to-transparent',
  paper: 'text-navy',
};

/**
 * Timeline (units). Each beat: [in, out]. Camera keys: [at, depth in stage heights].
 * Beats stay fully visible for ≥ 1 unit (≈ one screen of scrolling) so they can be read.
 */
const T = {
  hero: [0, 1.1],
  objective: [1.3, 3.1],
  place: [3.3, 5.1],
  birds: [5.3, 6.9],
  water: [7.5, 9.1],
  fish: [9.8, 11.4],
  methods: [12.1, 13.9],
  film: [14.6, 16.3],
  model: [17.4, 19],
} as const;
const END = 19;

/**
 * /ciencias · the descent. A sticky stage holds the illustrated lagoon; the
 * scroll moves a camera from the sky, through the waterline, to the lagoon
 * floor, then back up under a hypothetical fuel film — and finally narrows the
 * frame into the vessel of the conceptual model that follows.
 */
export function LagoonDescent() {
  const reduced = useReducedMotion();
  const desktop = useMediaQuery('(min-width: 900px)');
  return reduced ? <StaticLagoon /> : <AnimatedLagoon desktop={desktop} />;
}

function AnimatedLagoon({ desktop }: { desktop: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const q = gsap.utils.selector(wrap);
      const gauge = q('[data-depth]');
      // Camera: depth in stage heights → yPercent of the world (WORLD_H tall).
      const cam = (h: number) => (-h * STAGE * 100) / WORLD_H;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.9,
          onUpdate: (s) => {
            const t = s.progress * END;
            const beat = beats.reduce((acc, b) => (t >= T[b.id as keyof typeof T][0] - 0.3 ? b : acc), beats[0]);
            gauge.forEach((g) => g.toggleAttribute('data-on', g.dataset.depth === beat.depth));
          },
        },
      });

      beats.forEach((b) => {
        const [tin, tout] = T[b.id as keyof typeof T];
        const el = q(`[data-beat="${b.id}"]`);
        if (b.id !== 'hero') tl.fromTo(el, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' }, tin);
        if (b.id !== 'model') tl.to(el, { autoAlpha: 0, y: -36, duration: 0.45, ease: 'power2.in' }, tout);
      });

      const world = q('[data-world]');
      // Surface: the horizon sits low on desktop, in the upper third on phones (text below).
      const surface = desktop ? [0.3, 0.36] : [0.6, 0.66];
      tl.fromTo(world, { yPercent: cam(surface[0]), scale: 1.12 }, { yPercent: cam(surface[1]), scale: 1, duration: 6.5, ease: 'power1.out' }, 0)
        .to(world, { yPercent: cam(0.5), duration: 1.3, ease: 'power2.inOut' }, 6.9)
        .to(world, { yPercent: cam(1.55), duration: 1.4, ease: 'power2.inOut' }, 9.1)
        .to(world, { yPercent: cam(2), duration: 1.3, ease: 'power2.inOut' }, 11.4)
        .to(world, { yPercent: cam(0.78), duration: 1.6, ease: 'power2.inOut' }, 13.9)
        .fromTo(q('[data-film]'), { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, svgOrigin: '0 900', duration: 1.4, ease: 'power1.inOut' }, 14.7)
        .to(q('[data-flock]'), { xPercent: desktop ? -55 : -35, yPercent: 25, duration: 7 }, 0)
        .to(q('[data-reeds]'), { yPercent: 70, autoAlpha: 0, duration: 1.3, ease: 'power2.in' }, 6.9)
        .to(q('[data-flock]'), { autoAlpha: 0, duration: 0.8 }, 7.2)
        .to(q('[data-credit]'), { color: 'rgba(244,237,226,.45)', duration: 0.6 }, 7.4)
        // The frame narrows into the vessel of the conceptual model.
        .to(q('[data-frame]'), { clipPath: desktop ? 'inset(20.5% 64% 8% 12% round 0px 0px 28px 28px)' : 'inset(20.5% 26% 40% 26% round 0px 0px 22px 22px)', duration: 1.6, ease: 'power2.inOut' }, 16.4)
        .to(q('[data-credit]'), { autoAlpha: 0, duration: 0.4 }, 16.4)
        .to({}, { duration: 0 }, END);

      // Title arrives on load.
      gsap.from(q('[data-beat="hero"] > *'), { y: 30, opacity: 0, duration: 1.3, stagger: 0.1, ease: 'expo.out', delay: 0.15 });
    },
    wrap,
    [desktop],
  );

  return (
    <div ref={wrap} className="relative" style={{ height: `${END * (desktop ? 62 : 58) + 100}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#f4f1ea]">
        <div data-frame className="absolute inset-0 overflow-hidden" style={{ clipPath: 'inset(0% 0% 0% 0% round 0px)' }}>
          <div data-world className="absolute inset-x-0 top-0 origin-[50%_18%] will-change-transform" style={{ height: `${(WORLD_H / STAGE) * 100}%` }}>
            <LagoonWorld />
          </div>
          <div data-flock className="pointer-events-none absolute right-[-8%] top-[14%] h-[16%] w-[34%] min-[900px]:right-[2%] min-[900px]:w-[22%]">
            <Flock />
          </div>
          <div data-reeds className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%]">
            <LagoonReeds />
          </div>
        </div>

        {beats.map((b) => (
          <section
            key={b.id}
            data-beat={b.id}
            aria-label={b.id === 'hero' ? undefined : b.depth}
            className={`absolute inset-x-0 bottom-0 flex flex-col justify-end px-[var(--gutter)] pb-10 pt-24 min-[900px]:inset-y-0 ${b.id === 'model' ? 'min-[900px]:left-auto min-[900px]:w-[min(44rem,50%)]' : 'min-[900px]:right-auto min-[900px]:w-[min(46rem,52%)]'} min-[900px]:justify-center min-[900px]:pb-0 min-[900px]:pr-24 ${toneClass[b.tone]}`}
            style={b.id === 'hero' ? undefined : { visibility: 'hidden' }}
          >
            <div className={b.id === 'hero' ? 'max-w-[44rem]' : 'max-w-[34rem]'}>{b.content}</div>
          </section>
        ))}

        <ol className="pointer-events-none absolute right-[var(--gutter)] top-1/2 hidden -translate-y-1/2 space-y-3 text-right lg:block" aria-hidden>
          {depths.map((d) => (
            <li key={d} data-depth={d} className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ivory opacity-40 mix-blend-difference transition-opacity duration-500 data-[on]:opacity-100">
              {d}
            </li>
          ))}
        </ol>
        <p data-credit className="pointer-events-none absolute bottom-3 right-[var(--gutter)] font-mono text-[0.55rem] uppercase tracking-[0.16em] text-navy/45">
          Illustrated lagoon · not a photograph
        </p>
      </div>
    </div>
  );
}

/** Reduced motion: the same beats in reading order over still scenes. */
function StaticLagoon() {
  return (
    <div>
      <div className="relative h-[70svh] overflow-hidden">
        <div className="absolute inset-x-0 top-0" style={{ height: `${(WORLD_H / STAGE) * 70}svh` }}>
          <LagoonWorld />
        </div>
        <p className="absolute bottom-3 right-[var(--gutter)] font-mono text-[0.55rem] uppercase tracking-[0.16em] text-navy/45">Illustrated lagoon · not a photograph</p>
      </div>
      {beats.map((b) => (
        <section key={b.id} className={`gutter py-14 ${b.tone === 'deep' ? 'bg-[#123e4c] text-ivory' : b.tone === 'paper' ? 'bg-[#f4f1ea] text-navy' : 'bg-[#e6eeea] text-navy'}`}>
          <div className="max-w-[40rem]">{b.content}</div>
        </section>
      ))}
    </div>
  );
}
