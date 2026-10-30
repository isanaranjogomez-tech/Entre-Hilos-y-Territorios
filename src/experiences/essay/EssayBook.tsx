import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { essay, type Argument, type Citation, type EssaySection, type Figure } from '@/content/essay';
import { useMediaQuery, useReducedMotion } from '@/hooks/useMedia';
import { ScrollTrigger } from '@/lib/gsap';
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

function Page({ side, children, turnKey }: { side: 'left' | 'right'; children: ReactNode; turnKey: string }) {
  return (
    <div className={`relative h-full overflow-hidden ${paper} ${side === 'left' ? 'shadow-[inset_-30px_0_40px_-30px_rgba(20,56,72,.25)]' : 'shadow-[inset_30px_0_40px_-30px_rgba(20,56,72,.25)]'}`}>
      <div key={turnKey} className={`h-full overflow-y-auto px-8 py-10 lg:px-12 lg:py-12 ${side === 'right' ? 'animate-[page-turn-in_.9s_cubic-bezier(.2,.7,.2,1)_both]' : 'animate-[page-fade-in_.9s_ease_both]'}`} style={{ transformOrigin: 'left center' }}>
        {children}
      </div>
    </div>
  );
}

/**
 * The interactive book. Desktop: a sticky open book; scrolling turns to the
 * next section (a restrained page movement, no flip-book effect), and ribbon
 * tabs jump directly. Phones and reduced motion: the same spreads as
 * readable stacked pages.
 */
export function EssayBook() {
  const spreads = buildSpreads();
  const n = spreads.length;
  const wrap = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const desktop = useMediaQuery('(min-width: 1024px)');
  const reduced = useReducedMotion();
  const book = desktop && !reduced;

  useLayoutEffect(() => {
    if (!book) return;
    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (s) => setIndex(Math.min(n - 1, Math.floor(s.progress * n))),
    });
    return () => st.kill();
  }, [book, n]);

  const goTo = (i: number) => {
    const el = wrap.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * ((i + 0.5) / n), behavior: 'smooth' });
  };

  if (!book) {
    return (
      <div className="gutter space-y-6 py-12">
        {spreads.map((s) => (
          <article key={s.id} id={s.id} className={`${paper} px-6 py-8 text-navy shadow-[0_20px_50px_-30px_rgba(20,56,72,.5)]`}>
            <p className="font-display text-3xl italic text-magenta/80">{s.numeral}</p>
            <h3 className="display-md mt-2">{s.title}</h3>
            <div className="mt-5">{s.body}</div>
            <div className="mt-6 border-t border-navy/10 pt-4">{s.aside}</div>
          </article>
        ))}
      </div>
    );
  }

  const s = spreads[index];
  return (
    <div ref={wrap} className="relative" style={{ height: `${n * 110}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center justify-center px-[var(--gutter)] pt-[var(--nav-h)]">
        <div className="relative w-full max-w-[1180px]" style={{ perspective: '2200px' }}>
          {/* ribbon tabs */}
          <nav aria-label="Secciones del ensayo" className="absolute -top-12 left-0 right-0 flex flex-wrap justify-center gap-1">
            {spreads.map((sp, i) => (
              <button
                key={sp.id}
                onClick={() => goTo(i)}
                aria-current={i === index ? 'page' : undefined}
                className={`rounded-t-md px-3 pb-1.5 pt-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] transition-colors ${i === index ? 'bg-magenta text-ivory' : 'bg-navy/10 text-navy/60 hover:bg-navy/20'}`}
              >
                {sp.short}
              </button>
            ))}
          </nav>
          <div className="grid h-[min(70vh,680px)] grid-cols-2 shadow-[0_60px_120px_-50px_rgba(20,56,72,.55)]" style={{ transform: 'rotateX(4deg)' }}>
            <Page side="left" turnKey={`l-${s.id}`}>
              <p className="font-display text-6xl italic leading-none text-magenta/80">{s.numeral}</p>
              <h3 className="mt-6 font-display text-[clamp(1.7rem,2.4vw,2.6rem)] leading-[1.05] text-navy">{s.title}</h3>
              <div className="mt-8">{s.aside}</div>
              <p className="absolute bottom-6 left-12 font-mono text-[0.6rem] text-navy/40">
                {index + 1} / {n}
              </p>
            </Page>
            <Page side="right" turnKey={`r-${s.id}`}>
              <div className="text-navy">{s.body}</div>
            </Page>
          </div>
          <span className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-navy/15" aria-hidden />
        </div>
      </div>
    </div>
  );
}
