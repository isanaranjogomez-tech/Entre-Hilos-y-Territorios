import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { essay, type Argument, type Citation, type EssaySection, type Figure } from '@/content/essay';
import { useMediaQuery, useReducedMotion } from '@/hooks/useMedia';
import { asset } from '@/lib/asset';
import { isAvailable } from '@/content/publication';

interface Spread {
  id: string;
  numeral: string;
  /** Label on the ribbon tab. */
  short: string;
  title: string;
  /** Left page: what this section is and holds. */
  aside: ReactNode;
  /** Right page: the text itself (scrolls inside the page when long). */
  body: ReactNode;
}

/** Quiet marker for content that has not been delivered yet. */
function Pending({ what, field }: { what: string; field: string }) {
  return (
    <div className="border-l border-navy/25 pl-4 text-navy/55">
      <p className="meta">
        <span className="text-magenta">Pendiente</span> · {what}
      </p>
      <p className="mt-2 font-mono text-[0.62rem] opacity-70">content/{field}</p>
    </div>
  );
}

function Paragraphs({ list }: { list: string[] }) {
  return (
    <div className="space-y-4 text-[1.02rem] leading-[1.75]">
      {list.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export function EssayFigure({ f }: { f: Figure }) {
  if (!isAvailable(f.src))
    return (
      <figure className="my-8">
        <div className="grid aspect-[16/9] place-items-center border border-dashed border-navy/25 px-6 text-center">
          <p className="meta text-navy/50">Imagen de terceros · se publicará al confirmar el permiso de uso</p>
        </div>
        <figcaption className="mt-2 break-words text-[0.72rem] leading-snug text-navy/60">{f.caption}</figcaption>
      </figure>
    );
  return (
    <figure className="my-8">
      <img src={asset(f.src)} alt={f.alt} loading="lazy" className="w-full shadow-[0_20px_40px_-28px_rgba(20,56,72,.6)]" />
      <figcaption className="mt-2 break-words text-[0.72rem] leading-snug text-navy/60">{f.caption}</figcaption>
    </figure>
  );
}

function Sections({ list }: { list: EssaySection[] }) {
  return (
    <div className="space-y-10">
      {list.map((s) => (
        <section key={s.heading} id={`sec-${s.heading}`}>
          <h4 className="font-display text-2xl leading-tight">{s.heading}</h4>
          <div className="mt-3">
            <Paragraphs list={s.paragraphs} />
          </div>
          {s.figures?.map((f) => (
            <EssayFigure key={f.src} f={f} />
          ))}
        </section>
      ))}
    </div>
  );
}

function CitationNote({ c, n }: { c: Citation; n: number }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border-t border-navy/12 pt-2">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-baseline gap-2 text-left">
        <span className="font-mono text-[0.65rem] text-magenta">[{n}]</span>
        <span className="text-sm leading-snug text-navy/75">{c.source}</span>
      </button>
      {open && (
        <div className="mt-1 pl-6">
          {c.quote && <p className="font-display text-base italic leading-snug">“{c.quote}”</p>}
          {c.reference && <p className="mt-1 break-words text-[0.72rem] leading-snug text-navy/55">{c.reference}</p>}
        </div>
      )}
    </li>
  );
}

const Contents = ({ list, label }: { list: EssaySection[]; label: string }) => (
  <div>
    <p className="meta text-navy/50">{label}</p>
    <ol className="mt-3 space-y-1.5 text-sm text-navy/70">
      {list.map((s, i) => (
        <li key={s.heading} className="grid grid-cols-[1.6rem_1fr]">
          <span className="font-mono text-[0.62rem] text-magenta/70">{String(i + 1).padStart(2, '0')}</span>
          {s.heading}
        </li>
      ))}
    </ol>
  </div>
);

function argumentSpread(arg: Argument | null, i: number): Spread {
  const roman = ['I', 'II', 'III'][i];
  const field = `essay.ts → arguments[${i}]`;
  return {
    id: `argumento-${i + 1}`,
    numeral: roman,
    short: `Arg. ${roman}`,
    title: arg?.title ?? `Argumento ${roman}`,
    aside: arg ? (
      <div className="space-y-6">
        <p className="meta text-magenta">Argumento {roman}</p>
        {arg.citations.length > 0 && (
          <div>
            <p className="meta text-navy/50">Fuentes citadas</p>
            <ol className="mt-2 space-y-2">
              {arg.citations.map((c, n) => (
                <CitationNote key={c.id} c={c} n={n + 1} />
              ))}
            </ol>
          </div>
        )}
        {arg.fieldNotes && (
          <div>
            <p className="meta text-navy/50">Libreta de campo</p>
            {arg.fieldNotes.map((f) => (
              <p key={f} className="mt-2 border-l-2 border-sand pl-3 font-display text-lg italic leading-snug text-navy/80">
                {f}
              </p>
            ))}
          </div>
        )}
      </div>
    ) : (
      <p className="text-sm leading-relaxed text-navy/55">Explicación, citas textuales de la Red Textual, observaciones de la libreta de campo y fotografías de apoyo.</p>
    ),
    body: arg ? (
      <>
        <Paragraphs list={arg.paragraphs} />
        {arg.figures?.map((f) => (
          <EssayFigure key={f.src} f={f} />
        ))}
      </>
    ) : (
      <Pending what={`Argumento ${roman}`} field={field} />
    ),
  };
}

/** Builds the book from content/essay.ts — the only source of its text. */
function buildSpreads(): Spread[] {
  return [
    {
      id: 'introduccion',
      numeral: '—',
      short: 'Introducción',
      title: 'Introducción',
      aside: (
        <div className="space-y-4 text-sm leading-relaxed text-navy/65">
          {essay.authors && <p>Escrito por: {essay.authors.join(', ')}.</p>}
          <p>
            <span className="meta block text-navy/45">Pregunta de investigación</span>
            {essay.question}
          </p>
        </div>
      ),
      body: essay.introduction ? <Paragraphs list={essay.introduction} /> : <Pending what="Introducción" field="essay.ts → introduction" />,
    },
    {
      id: 'tesis',
      numeral: '◆',
      short: 'Tesis',
      title: 'Tesis',
      aside: <p className="text-sm leading-relaxed text-navy/55">La posición central que los argumentos sostienen.</p>,
      body: essay.thesis ? <p className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.12]">{essay.thesis}</p> : <Pending what="Tesis" field="essay.ts → thesis" />,
    },
    {
      id: 'marco-ambiental',
      numeral: 'A',
      short: 'Ambiente',
      title: 'El marco ambiental',
      aside: <Contents list={essay.environment} label="Aspectos del territorio" />,
      body: <Sections list={essay.environment} />,
    },
    {
      id: 'ambito-social',
      numeral: 'B',
      short: 'Sociedad',
      title: 'El ámbito social',
      aside: <Contents list={essay.society} label="Historia, organización y cosmovisión" />,
      body: <Sections list={essay.society} />,
    },
    ...essay.arguments.map(argumentSpread),
    {
      id: 'conclusion',
      numeral: '∴',
      short: 'Conclusión',
      title: 'Conclusión',
      aside: <p className="text-sm leading-relaxed text-navy/55">Donde convergen los argumentos: la Alta, la Media y la Baja Guajira.</p>,
      body: essay.conclusion ? <Paragraphs list={essay.conclusion} /> : <Pending what="Conclusión" field="essay.ts → conclusion" />,
    },
    {
      id: 'referencias',
      numeral: '§',
      short: 'Referencias',
      title: 'Bibliografía',
      aside: <p className="text-sm leading-relaxed text-navy/55">Las fuentes citadas, tal como aparecen en el ensayo.</p>,
      body: essay.bibliography ? (
        <ol className="space-y-2 text-sm leading-relaxed">
          {essay.bibliography.map((b) => (
            <li key={b} className="break-words pl-6 -indent-6">
              {b}
            </li>
          ))}
        </ol>
      ) : (
        <Pending what="Bibliografía" field="essay.ts → bibliography" />
      ),
    },
  ];
}

const paper = 'bg-[linear-gradient(180deg,#fbf7ef_0%,#f5eee1_100%)]';

/** Book geometry (px): outer page margin and vertical padding. */
const M = 44;
const PY = 46;

/**
 * One section laid out as printed pages: its text flows in columns, one column
 * per page, so it fills the left page and continues on the right — and on the
 * next spreads when it is long. `spread` picks which pair of pages is visible.
 */
function SectionPages({ s, pageW, height, spread, onCount }: { s: Spread; pageW: number; height: number; spread: number; onCount: (n: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !pageW) return;
    const measure = () => onCount(Math.max(1, Math.ceil(Math.ceil((el.scrollWidth - 1) / pageW) / 2)));
    measure();
    document.fonts?.ready.then(measure);
    const imgs = [...el.querySelectorAll('img')];
    imgs.forEach((i) => i.addEventListener('load', measure));
    return () => imgs.forEach((i) => i.removeEventListener('load', measure));
  }, [pageW, height, onCount]);
  return (
    <div
      ref={ref}
      className="text-navy transition-transform duration-[900ms] ease-[cubic-bezier(.65,0,.25,1)] [&_figure]:break-inside-avoid [&_h4]:break-after-avoid [&_img]:max-h-[34vh] [&_img]:w-auto [&_img]:max-w-full [&_li]:break-inside-avoid"
      style={{
        width: pageW * 2,
        height,
        padding: `${PY}px ${M}px`,
        columnWidth: pageW - 2 * M,
        columnGap: 2 * M,
        columnFill: 'auto',
        transform: `translateX(${-spread * pageW * 2}px)`,
      }}
    >
      <p className="font-display text-6xl italic leading-none text-magenta/80">{s.numeral}</p>
      <h3 className="mt-5 font-display text-[clamp(1.8rem,2.5vw,2.7rem)] leading-[1.05]">{s.title}</h3>
      <div className="mt-6 text-[0.98rem]">{s.aside}</div>
      <div className="mt-8 border-t border-navy/10 pt-6 [&_p]:text-[1.04rem] [&_p]:leading-[1.72]">{s.body}</div>
    </div>
  );
}

/**
 * The interactive book. Desktop: a sticky open book; each section is set as
 * real facing pages and scrolling turns them (a restrained horizontal page
 * movement, no flip-book effect). Ribbon tabs jump to a section. Phones and
 * reduced motion: the same sections as readable stacked pages.
 */
export function EssayBook() {
  const spreads = buildSpreads();
  const wrap = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [pageW, setPageW] = useState(0);
  const [height, setHeight] = useState(0);
  const [counts, setCounts] = useState<number[]>(() => spreads.map(() => 1));
  const desktop = useMediaQuery('(min-width: 1024px)');
  const reduced = useReducedMotion();
  const book = desktop && !reduced;

  // One "turn" per visible spread, across all sections.
  const turns = counts.flatMap((c, si) => Array.from({ length: c }, (_, k) => ({ si, k })));
  const turn = Math.min(turns.length - 1, Math.floor(p * turns.length));
  const { si, k } = turns[turn];
  const firstTurn = (i: number) => counts.slice(0, i).reduce((a, b) => a + b, 0);

  const setCount = useRef(spreads.map((_, i) => (c: number) => setCounts((prev) => (prev[i] === c ? prev : prev.map((x, j) => (j === i ? c : x)))))).current;

  useLayoutEffect(() => {
    if (!book) return;
    const el = frame.current!;
    const ro = new ResizeObserver(() => {
      setPageW(Math.floor(el.clientWidth / 2));
      setHeight(el.clientHeight);
    });
    ro.observe(el);
    // Progress from live geometry: the book grows once its pages are measured.
    const onScroll = () => {
      const w = wrap.current;
      if (!w) return;
      const span = w.offsetHeight - window.innerHeight;
      setP(Math.min(1, Math.max(0, -w.getBoundingClientRect().top / span)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [book]);

  const goTo = (i: number) => {
    const el = wrap.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * ((firstTurn(i) + 0.5) / turns.length), behavior: 'smooth' });
  };

  if (!book) {
    return (
      <div className="gutter space-y-6 py-12">
        {spreads.map((sp) => (
          <article key={sp.id} id={sp.id} className={`${paper} px-6 py-9 text-navy shadow-[0_20px_50px_-30px_rgba(20,56,72,.5)] sm:px-10`}>
            <p className="font-display text-3xl italic text-magenta/80">{sp.numeral}</p>
            <h3 className="display-md mt-2">{sp.title}</h3>
            <div className="mt-5 text-[0.98rem]">{sp.aside}</div>
            <div className="mt-6 border-t border-navy/10 pt-6 [&_p]:text-[1.05rem] [&_p]:leading-[1.75]">{sp.body}</div>
          </article>
        ))}
      </div>
    );
  }

  const page = firstTurn(si) * 2 + k * 2 + 1;
  return (
    <div ref={wrap} className="relative" style={{ height: `${turns.length * 85 + 40}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center justify-center px-[var(--gutter)] pt-[calc(var(--nav-h)+2rem)]">
        <div className="relative w-full max-w-[1240px]" style={{ perspective: '2200px' }}>
          {/* ribbon tabs */}
          <nav aria-label="Secciones del ensayo" className="absolute -top-11 left-0 right-0 flex flex-wrap justify-center gap-1">
            {spreads.map((sp, i) => (
              <button
                key={sp.id}
                onClick={() => goTo(i)}
                aria-current={i === si ? 'page' : undefined}
                className={`rounded-t-md px-3 pb-1.5 pt-2 font-mono text-[0.64rem] uppercase tracking-[0.14em] transition-colors ${i === si ? 'bg-magenta text-ivory' : 'bg-navy/10 text-navy/65 hover:bg-navy/20'}`}
              >
                {sp.short}
              </button>
            ))}
          </nav>
          <div ref={frame} className="relative grid h-[min(76vh,760px)] grid-cols-2 shadow-[0_60px_120px_-50px_rgba(20,56,72,.55)]" style={{ transform: 'rotateX(3deg)' }}>
            <div className={`${paper} shadow-[inset_-30px_0_40px_-30px_rgba(20,56,72,.25)]`} />
            <div className={`${paper} shadow-[inset_30px_0_40px_-30px_rgba(20,56,72,.25)]`} />
            <div className="absolute inset-0 overflow-hidden">
              {spreads.map((sp, i) => (
                <div key={sp.id} className={`absolute inset-0 transition-opacity duration-500 ${i === si ? 'opacity-100' : 'pointer-events-none opacity-0'}`} aria-hidden={i !== si}>
                  <SectionPages s={sp} pageW={pageW} height={height} spread={i === si ? k : 0} onCount={setCount[i]} />
                </div>
              ))}
            </div>
            <p className="pointer-events-none absolute bottom-4 left-11 font-mono text-[0.6rem] text-navy/40">{page}</p>
            <p className="pointer-events-none absolute bottom-4 right-11 font-mono text-[0.6rem] text-navy/40">{page + 1}</p>
            {counts[si] > 1 && (
              <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-navy/40">
                {spreads[si].short} · {k + 1} / {counts[si]}
              </p>
            )}
          </div>
          <span className="pointer-events-none absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-navy/15" aria-hidden />
        </div>
      </div>
    </div>
  );
}
