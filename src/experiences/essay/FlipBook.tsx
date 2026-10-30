import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { essay, type Figure } from '@/content/essay';
import { useMediaQuery, useReducedMotion } from '@/hooks/useMedia';
import { gsap } from '@/lib/gsap';
import { asset } from '@/lib/asset';

const b = essay.book;
const args = essay.arguments.filter(Boolean) as NonNullable<(typeof essay.arguments)[number]>[];
const fig1 = essay.environment.flatMap((s) => s.figures ?? [])[0];
const ROMAN = ['I', 'II', 'III'];

/* ---------- Page designs (contemporary editorial, cqw-based type) ---------- */

const Folio = ({ n, side }: { n: number; side: 'l' | 'r' }) => (
  <span className={`absolute bottom-[calc(var(--u)*3.2)] font-mono text-[length:calc(var(--u)*0.85)] tracking-[0.2em] text-navy/40 ${side === 'l' ? 'left-[calc(var(--u)*4)]' : 'right-[calc(var(--u)*4)]'}`}>{n}</span>
);

function Kicker({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[length:calc(var(--u)*0.95)] uppercase tracking-[0.22em] text-magenta">{children}</p>;
}

function CoverPage() {
  return (
    <div className="flex h-full flex-col justify-between bg-[linear-gradient(135deg,#1b4354_0%,#143848_55%,#0e2a36_100%)] p-[calc(var(--u)*4.5)] text-ivory">
      <div className="border-t border-sand/50 pt-[calc(var(--u)*1.6)]">
        <p className="font-mono text-[length:calc(var(--u)*0.95)] uppercase tracking-[0.24em] text-sand">Lenguaje y Sociales · Texto argumentativo</p>
        <p className="mt-[calc(var(--u)*3)] font-display text-[length:calc(var(--u)*5.2)] leading-[0.95]">
          El atlas <span className="italic text-sand">de los</span> argumentos
        </p>
      </div>
      <div>
        <p className="font-display text-[length:calc(var(--u)*1.75)] italic leading-snug text-ivory/85">{essay.title}</p>
        <p className="mt-[calc(var(--u)*1.6)] text-[length:calc(var(--u)*1.1)] leading-relaxed text-ivory/60">{essay.authors?.join(' · ')}</p>
      </div>
    </div>
  );
}

function EndpaperPage() {
  return (
    <div className="flex h-full flex-col justify-center bg-[#e9dfcc] p-[calc(var(--u)*5)] text-navy">
      <Kicker>Pregunta de investigación</Kicker>
      <p className="mt-[calc(var(--u)*2.2)] font-display text-[length:calc(var(--u)*2.5)] leading-[1.15]">{essay.question}</p>
    </div>
  );
}

function TextPage({ kicker, title, children, n, side }: { kicker: string; title?: string; children: ReactNode; n: number; side: 'l' | 'r' }) {
  return (
    <div className="relative h-full px-[calc(var(--u)*4.4)] pb-[calc(var(--u)*6)] pt-[calc(var(--u)*4.6)] text-navy">
      <Kicker>{kicker}</Kicker>
      {title && <h3 className="mt-[calc(var(--u)*1.6)] font-display text-[length:calc(var(--u)*2.6)] leading-[1.05]">{title}</h3>}
      <div className="mt-[calc(var(--u)*2.2)]">{children}</div>
      <Folio n={n} side={side} />
    </div>
  );
}

function PhotoPage({ f, pull, n, side }: { f: Figure; pull?: string; n: number; side: 'l' | 'r' }) {
  return (
    <div className="relative flex h-full flex-col px-[calc(var(--u)*3.6)] pb-[calc(var(--u)*5.6)] pt-[calc(var(--u)*3.6)] text-navy">
      <div className="ph-img min-h-0 flex-1 overflow-hidden bg-[#e9e1d2]">
        <img src={asset(f.src)} alt={f.alt} className="h-full w-full object-cover" draggable={false} />
      </div>
      {pull && <p className="mt-[calc(var(--u)*1.8)] font-display text-[length:calc(var(--u)*1.75)] italic leading-snug">{pull}</p>}
      <p className="mt-[calc(var(--u)*1.2)] line-clamp-3 break-words text-[length:calc(var(--u)*0.85)] leading-snug text-navy/55">{f.caption}</p>
      <Folio n={n} side={side} />
    </div>
  );
}

const body = 'text-[length:calc(var(--u)*1.5)] leading-[1.58]';

function ArgumentPage({ i, n, side }: { i: number; n: number; side: 'l' | 'r' }) {
  const a = b.arguments[i];
  return (
    <TextPage kicker={`Argumento ${ROMAN[i]}`} title={args[i].title} n={n} side={side}>
      <p className="font-display text-[length:calc(var(--u)*1.85)] leading-snug">{a.idea}</p>
      <dl className="mt-[calc(var(--u)*2)] space-y-[calc(var(--u)*1.2)]">
        {a.evidence.map((e) => (
          <div key={e.label} className="grid grid-cols-[calc(var(--u)*9)_1fr] gap-x-[calc(var(--u)*1.2)]">
            <dt className="pt-[calc(var(--u)*0.2)] font-mono text-[length:calc(var(--u)*0.85)] uppercase tracking-[0.14em] text-magenta/80">{e.label}</dt>
            <dd className={body}>{e.text}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-[calc(var(--u)*2)] text-[length:calc(var(--u)*0.95)] leading-snug text-navy/50">({a.sources.join('; ')})</p>
    </TextPage>
  );
}

interface Leaf {
  front: (n: number) => ReactNode;
  back?: (n: number) => ReactNode;
  /** Label of the spread revealed once this leaf is turned. */
  label?: string;
  hard?: boolean;
}

/** The book, leaf by leaf. Turning leaf k reveals its back (left) and leaf k+1's front (right). */
function buildLeaves(onRead: () => void): Leaf[] {
  return [
    { hard: true, front: () => <CoverPage />, back: () => <EndpaperPage />, label: 'Introducción' },
    {
      front: (n) => (
        <TextPage kicker="Introducción" n={n} side="r">
          <div className="space-y-[calc(var(--u)*1.6)]">
            {b.intro.map((p) => (
              <p key={p} className={`${body} first:font-display first:text-[length:calc(var(--u)*2.1)] first:leading-snug`}>
                {p}
              </p>
            ))}
          </div>
        </TextPage>
      ),
      back: (n) => <PhotoPage f={fig1} n={n} side="l" />,
      label: 'Tesis',
    },
    {
      front: (n) => (
        <TextPage kicker="Tesis" n={n} side="r">
          <p className="mt-[calc(var(--u)*4)] font-display text-[length:calc(var(--u)*3.1)] leading-[1.12]">{essay.thesis}</p>
        </TextPage>
      ),
      back: (n) => <ArgumentPage i={0} n={n} side="l" />,
      label: 'Argumento I',
    },
    {
      front: (n) => <PhotoPage f={args[0].figures![0]} pull={b.arguments[0].pull} n={n} side="r" />,
      back: (n) => <ArgumentPage i={1} n={n} side="l" />,
      label: 'Argumento II',
    },
    {
      front: (n) => <PhotoPage f={args[1].figures![0]} pull={b.arguments[1].pull} n={n} side="r" />,
      back: (n) => <ArgumentPage i={2} n={n} side="l" />,
      label: 'Argumento III',
    },
    {
      front: (n) => <PhotoPage f={args[2].figures![0]} pull={b.arguments[2].pull} n={n} side="r" />,
      back: (n) => (
        <TextPage kicker="Conclusión" n={n} side="l">
          <p className="font-display text-[length:calc(var(--u)*2.3)] leading-[1.2]">{b.conclusion}</p>
        </TextPage>
      ),
      label: 'Conclusión',
    },
    {
      front: (n) => (
        <div className="relative flex h-full flex-col justify-center px-[calc(var(--u)*5)] text-navy">
          <Kicker>El ensayo completo</Kicker>
          <p className="mt-[calc(var(--u)*2)] font-display text-[length:calc(var(--u)*2.4)] leading-[1.15]">Marco ambiental, ámbito social, los tres argumentos con sus citas y la bibliografía completa.</p>
          <button onClick={onRead} className="mt-[calc(var(--u)*3)] w-fit rounded-full border border-navy/40 px-[calc(var(--u)*2.2)] py-[calc(var(--u)*1.1)] font-mono text-[length:calc(var(--u)*0.95)] uppercase tracking-[0.18em] hover:border-navy hover:bg-navy hover:text-ivory">
            Leer ensayo completo
          </button>
          <Folio n={n} side="r" />
        </div>
      ),
    },
  ];
}

/* ---------- The sheet: two hinged strips so the paper bends as it turns ---------- */

const paper = 'bg-[#fbf7ef] bg-[radial-gradient(120%_90%_at_50%_40%,#fdfaf3_0%,#f6efe2_100%)]';

/** One face half: shows the left or right half of a page. */
function Half({ children, offset, back, hard }: { children: ReactNode; offset: 0 | 1; back?: boolean; hard?: boolean }) {
  return (
    <div className={`absolute inset-0 overflow-hidden [backface-visibility:hidden] ${hard && !back ? '' : paper}`} style={back ? { transform: 'rotateY(180deg)' } : undefined}>
      <div className="absolute inset-y-0 w-[200%]" style={{ left: offset ? '-100%' : 0 }}>
        {children}
      </div>
      {/* Lighting: darkens as the sheet lifts (set via --lift on the leaf) */}
      <div className="pointer-events-none absolute inset-0" style={{ background: `linear-gradient(${back ? 'to left' : 'to right'}, rgba(20,40,50,calc(var(--lift,0)*0.22)) 0%, rgba(20,40,50,0) 70%)` }} />
    </div>
  );
}

function Sheet({ leaf, index, refCb }: { leaf: Leaf; index: number; refCb: (el: HTMLDivElement | null, outer: HTMLDivElement | null) => void; total: number }) {
  const inner = useRef<HTMLDivElement>(null);
  const outer = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    refCb(inner.current, outer.current);
  }, [refCb]);
  const front = leaf.front(index * 2 + 1);
  const back = leaf.back?.(index * 2 + 2);
  return (
    <div ref={inner} className="absolute left-1/2 top-0 h-full w-1/4 origin-left [transform-style:preserve-3d]" >
      <Half offset={0} hard={leaf.hard}>{front}</Half>
      {back && (
        <Half offset={1} back hard={leaf.hard}>
          {back}
        </Half>
      )}
      <div ref={outer} className="absolute left-full top-0 h-full w-full origin-left [transform-style:preserve-3d]">
        <Half offset={1} hard={leaf.hard}>{front}</Half>
        {back && (
          <Half offset={0} back hard={leaf.hard}>
            {back}
          </Half>
        )}
      </div>
    </div>
  );
}

/**
 * /lenguaje-sociales · a physical book. Scrolling (or the controls, or ←/→)
 * sets how many sheets are turned; each sheet then turns around the spine in
 * 3D — its two halves hinge so the paper bends while it lifts — carrying its
 * text and images, with light on the sheet and a shadow on the page below.
 * Phones and reduced motion: the same pages, stacked and readable.
 */
export function FlipBook({ onRead }: { onRead: () => void }) {
  const leaves = buildLeaves(onRead);
  const L = leaves.length;
  const MAX = L - 1; // the last sheet stays on the right
  const wide = useMediaQuery('(min-width: 768px)');
  const reduced = useReducedMotion();
  const animated = wide && !reduced;

  const wrap = useRef<HTMLDivElement>(null);
  const book = useRef<HTMLDivElement>(null);
  const sheets = useRef<{ inner: HTMLDivElement | null; outer: HTMLDivElement | null; a: number }[]>(leaves.map(() => ({ inner: null, outer: null, a: 0 })));
  const refCbs = useRef(leaves.map((_, i) => (inner: HTMLDivElement | null, outer: HTMLDivElement | null) => Object.assign(sheets.current[i], { inner, outer }))).current;
  const [turned, setTurned] = useState(0);
  const shown = useRef(0);

  // Pose one sheet for angle fraction a (0 = right, 1 = turned left).
  const pose = (i: number, a: number, dir: 1 | -1) => {
    const s = sheets.current[i];
    if (!s.inner || !s.outer) return;
    s.a = a;
    const lift = Math.sin(Math.PI * a);
    const bend = (sheetsHard(i) ? 0 : 26) * lift * dir; // the outer half lags behind: the paper bends
    // In 3D, depth (not z-index) orders the sheets: a hair apart, the moving one on top.
    const z = a > 0 && a < 1 ? L * 0.7 + 1.5 : a >= 1 ? i * 0.7 + 0.5 : (L - i) * 0.7 + 0.5;
    s.inner.style.transform = `translateZ(${z}px) rotateY(${-180 * a}deg)`;
    s.outer.style.transform = `rotateY(${bend}deg)`;
    s.inner.style.setProperty('--lift', lift.toFixed(3));
    const shade = book.current?.querySelector<HTMLDivElement>('[data-cast]');
    if (shade && a > 0 && a < 1) shade.style.opacity = (lift * 0.9).toFixed(3);
    else if (shade) shade.style.opacity = '0';
  };
  const sheetsHard = (i: number) => Boolean(leaves[i].hard);

  // Scroll → target number of turned sheets.
  useEffect(() => {
    if (!animated) return;
    const onScroll = () => {
      const w = wrap.current;
      if (!w) return;
      const p = Math.min(1, Math.max(0, -w.getBoundingClientRect().top / (w.offsetHeight - window.innerHeight)));
      setTurned(Math.min(MAX, Math.floor(p * (MAX + 1))));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [animated, MAX]);

  // Animate sheets toward the target, one after another, at a calm pace.
  useEffect(() => {
    if (!animated) return;
    const from = shown.current;
    shown.current = turned;
    const dir: 1 | -1 = turned >= from ? 1 : -1;
    const idx = dir === 1 ? range(from, turned) : range(turned, from).reverse();
    idx.forEach((i, k) => {
      const s = sheets.current[i];
      const proxy = { a: s.a };
      gsap.killTweensOf(s);
      gsap.to(proxy, {
        a: dir === 1 ? 1 : 0,
        duration: 1.35,
        delay: k * 0.28,
        ease: 'power2.inOut',
        onUpdate: () => pose(i, proxy.a, dir),
      });
    });
    gsap.to(book.current, { xPercent: turned === 0 ? -25 : 0, duration: 1.2, ease: 'power3.inOut' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turned, animated]);

  // Initial pose (closed, centred).
  useLayoutEffect(() => {
    if (!animated) return;
    leaves.forEach((_, i) => pose(i, 0, 1));
    gsap.set(book.current, { xPercent: -25 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated]);

  const goTo = (n: number) => {
    const t = Math.max(0, Math.min(MAX, n));
    const w = wrap.current!;
    const top = w.getBoundingClientRect().top + window.scrollY;
    const span = w.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * ((t + 0.5) / (MAX + 1)), behavior: 'smooth' });
  };

  useEffect(() => {
    if (!animated) return;
    const onKey = (e: KeyboardEvent) => {
      const r = wrap.current?.getBoundingClientRect();
      if (!r || r.top > 0 || r.bottom < window.innerHeight) return;
      if (e.key === 'ArrowRight') goTo(turned + 1);
      if (e.key === 'ArrowLeft') goTo(turned - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!animated) {
    // Readable stacked pages (same content, in reading order), with a larger type unit.
    const pages: { node: ReactNode; photo: boolean }[] = [];
    leaves.forEach((l, i) => {
      pages.push({ node: l.front(i * 2 + 1), photo: i >= 3 && i <= 5 });
      if (l.back && i < MAX) pages.push({ node: l.back(i * 2 + 2), photo: i === 1 });
    });
    return (
      <div className="gutter space-y-5 py-10" style={{ ['--u' as string]: 'min(2.6vw, 1.15rem)' } as CSSProperties}>
        {pages.map((pg, i) => (
          <article key={i} className={`relative overflow-hidden ${paper} shadow-[0_20px_50px_-30px_rgba(20,56,72,.5)] ${pg.photo ? 'aspect-[0.78]' : 'min-h-[60vw]'} [&_.ph-img]:min-h-[50vw]`}>
            {pg.node}
          </article>
        ))}
      </div>
    );
  }

  const label = turned === 0 ? 'Portada' : leaves[turned - 1].label ?? '';
  return (
    <div ref={wrap} className="relative" style={{ height: `${(MAX + 1) * 75 + 100}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center gap-6 pt-[var(--nav-h)]">
        <div className="relative" style={{ width: 'min(1120px, 92vw, calc((100svh - 220px) * 1.44))', aspectRatio: '1.44', perspective: '2600px' }}>
          <div ref={book} className="absolute inset-0 [transform-style:preserve-3d]">
            <div className="absolute inset-0 [container-type:inline-size] [transform-style:preserve-3d]" style={{ ['--u' as string]: '1cqw' } as CSSProperties}>
              {/* boards and page-block edges */}
              <div className="absolute inset-y-[-0.8%] right-[-0.8%] rounded-[4px] bg-[#143848] shadow-[0_50px_100px_-40px_rgba(20,56,72,.65)] transition-[left] duration-700" style={{ left: turned === 0 ? '49.2%' : '-0.8%', transform: 'translateZ(-2px)' }} />
              <div className="absolute inset-y-[0.4%] left-1/2 right-[-0.5%] rounded-r-[3px] bg-[repeating-linear-gradient(90deg,#efe6d6_0,#efe6d6_1px,#ddd2bf_2px)]" style={{ transform: 'translateZ(-1px)' }} />
              {turned > 0 && <div className="absolute inset-y-[0.4%] left-[-0.5%] right-1/2 rounded-l-[3px] bg-[repeating-linear-gradient(90deg,#ddd2bf_0,#efe6d6_1px,#efe6d6_2px)]" style={{ transform: 'translateZ(-1px)' }} />}
              {/* cast shadow on the page below a lifting sheet */}
              <div data-cast className="pointer-events-none absolute inset-y-0 left-1/2 right-0 opacity-0" style={{ background: 'linear-gradient(to right, rgba(20,40,50,.28), rgba(20,40,50,0) 55%)', transform: `translateZ(${L * 0.7 + 0.9}px)` }} />
              {leaves.map((leaf, i) => (
                <Sheet key={i} leaf={leaf} index={i} refCb={refCbs[i]} total={L} />
              ))}
              {/* spine */}
              <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[3%] -translate-x-1/2 bg-[linear-gradient(to_right,rgba(20,40,50,0),rgba(20,40,50,.16)_48%,rgba(255,255,255,.18)_52%,rgba(20,40,50,0))]" style={{ opacity: turned === 0 ? 0 : 1, transform: `translateX(-50%) translateZ(${L * 0.7 + 1}px)` }} />
            </div>
          </div>
        </div>

        <nav aria-label="Páginas del libro" className="flex items-center gap-5 text-navy">
          <button onClick={() => goTo(turned - 1)} disabled={turned === 0} className="btn-text disabled:opacity-30">
            ← Anterior
          </button>
          <p className="meta min-w-[12rem] text-center text-navy/60" aria-live="polite">
            {label}
          </p>
          <button onClick={() => goTo(turned + 1)} disabled={turned === MAX} className="btn-text disabled:opacity-30">
            Siguiente →
          </button>
        </nav>
      </div>
    </div>
  );
}

function range(a: number, b: number) {
  return Array.from({ length: Math.max(0, b - a) }, (_, i) => a + i);
}

