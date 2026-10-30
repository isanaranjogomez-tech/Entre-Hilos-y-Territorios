import { Suspense, lazy, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { mathematics } from '@/content/mathematics';
import { chapterById } from '@/content/project';
import { useMediaQuery, useReducedMotion } from '@/hooks/useMedia';
import { ScrollTrigger } from '@/lib/gsap';
import { S, stageCenter } from './stages';
import type { StoryState } from './MochilaScene';

const MochilaScene = lazy(() => import('./MochilaScene'));
const meta = chapterById('matematicas');
const scenes = mathematics.scenes;

function Caption({ i, active }: { i: number; active: boolean }) {
  const s = scenes[i];
  return (
    <div
      aria-hidden={!active}
      className={`absolute inset-x-0 bottom-0 transition-all ease-out lg:inset-y-0 lg:flex lg:flex-col lg:justify-center lg:pt-[var(--nav-h)] ${active ? 'translate-y-0 opacity-100 delay-300 duration-[900ms]' : 'pointer-events-none translate-y-3 opacity-0 duration-300'}`}
    >
      <p className="meta text-magenta">
        {s.step} <span className="text-navy/40">/ 0{scenes.length}</span>
      </p>
      <h2 className="display-lg mt-3 lg:mt-5">{s.title}</h2>
      <dl className="mt-5 space-y-4 lg:mt-8 lg:space-y-6">
        {s.infographicText?.map((item) => (
          <div key={item.text}>
            {item.label && <dt className="meta text-navy/50">{item.label}</dt>}
            <dd className="mt-1 font-display text-[1.3rem] leading-snug lg:text-[1.75rem]">{item.text}</dd>
          </div>
        ))}
      </dl>
      {s.note && <p className="mt-5 max-w-[38ch] text-sm leading-relaxed text-navy/55">{s.note}</p>}
    </div>
  );
}

/**
 * Guided sequence: a sticky full-viewport studio with ONE persistent canvas.
 * ScrollTrigger only reports progress; the scene samples the storyboard from
 * it. No pinning, no scroll-jacking — the page scrolls normally.
 */
export function MathematicsScrollController() {
  const wrap = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [stage, setStage] = useState<StoryState>({ stage: 0, settled: true });
  const desktop = useMediaQuery('(min-width: 1024px)');
  const reduced = useReducedMotion();
  const lowPower = useMemo(() => window.matchMedia('(pointer: coarse)').matches && (navigator.hardwareConcurrency ?? 8) <= 6, []);
  const onStage = useCallback((s: StoryState) => setStage(s), []);

  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => (progress.current = self.progress),
    });
    progress.current = st.progress;
    return () => st.kill();
  }, []);

  /** Jump to the settled part of stage i (step navigation; also the reduced-motion path). */
  const goTo = (i: number) => {
    const el = wrap.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * stageCenter(i), behavior: reduced ? 'auto' : 'smooth' });
  };

  const opening = stage.stage === 0;

  return (
    <div ref={wrap} className="relative" style={{ height: `${S * (desktop ? 230 : 190) + 100}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden text-navy" style={{ background: 'radial-gradient(ellipse at 62% 46%, #fdfaf4 0%, #f1e9dc 48%, #e2d4bf 100%)' }}>
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <MochilaScene progress={progress} onStage={onStage} stage={stage} layout={desktop ? 'side' : 'top'} instant={reduced} lowPower={lowPower} />
          </Suspense>
        </div>

        {/* Reading veil: keeps text legible when the camera is close to the textile */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${opening ? 'opacity-0' : 'opacity-100'} bg-[linear-gradient(to_top,rgba(244,237,226,0.96)_0%,rgba(244,237,226,0.9)_34%,rgba(244,237,226,0)_52%)] lg:bg-[linear-gradient(to_right,rgba(244,237,226,0.97)_0%,rgba(244,237,226,0.9)_30%,rgba(244,237,226,0)_46%)]`}
        />

        {/* Stage 01 — opening title */}
        <header
          className={`gutter pointer-events-none absolute inset-x-0 bottom-[max(4.5rem,8vh)] transition-all duration-700 lg:bottom-0 lg:top-0 lg:flex lg:w-[46%] lg:flex-col lg:justify-center ${opening ? 'opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          <p className="meta text-magenta">
            Capítulo {meta.numeral} · {meta.subject} · La geometría que se puede tocar
          </p>
          <h1 className="display-xl mt-4 lg:mt-6">
            Geometría en el <span className="italic">tejido Wayuu</span>
          </h1>
          <p className="mt-5 max-w-[34ch] text-base leading-relaxed text-navy/70 lg:mt-8 lg:text-lg">
            {mathematics.infographicSubheading}. {scenes[0].infographicText?.[0].text}.
          </p>
          <p className="meta mt-8 hidden items-center gap-3 text-navy/50 lg:flex">
            <span className="relative block h-8 w-px overflow-hidden bg-navy/15">
              <span className="absolute inset-x-0 top-0 h-3 animate-[scrollcue_2s_ease-in-out_infinite] bg-magenta" />
            </span>
            Desplázate para girar la mochila
          </p>
        </header>

        {/* Stages 02–06 — captions */}
        <div className="gutter pointer-events-none absolute inset-x-0 bottom-[max(4.5rem,8vh)] h-[38svh] lg:bottom-0 lg:top-0 lg:h-auto lg:w-[38%]">
          <div className="relative h-full">{scenes.map((_, i) => i > 0 && <Caption key={i} i={i} active={stage.stage === i} />)}</div>
        </div>

        {/* Step navigation */}
        <nav aria-label="Etapas del recorrido" className="gutter absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 pb-5">
          <ol className="flex gap-1.5">
            {scenes.map((s, i) => (
              <li key={s.id}>
                <button
                  onClick={() => goTo(i)}
                  aria-label={`${s.step} ${s.title}`}
                  aria-current={stage.stage === i ? 'step' : undefined}
                  className="group flex h-8 items-center"
                >
                  <span className={`block h-[3px] rounded-full transition-all duration-500 ${stage.stage === i ? 'w-10 bg-magenta' : 'w-5 bg-navy/20 group-hover:bg-navy/45'}`} />
                </button>
              </li>
            ))}
          </ol>
          <p className="hidden max-w-[30ch] text-right font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.14em] text-navy/45 sm:block">
            Reconstrucción 3D procedimental basada en la mochila de la infografía · no es una réplica exacta
          </p>
        </nav>
      </div>
    </div>
  );
}
