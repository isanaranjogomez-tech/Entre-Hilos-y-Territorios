import { useLayoutEffect, useRef, useState, type MutableRefObject } from 'react';
import { chapterById, settings } from '@/content/project';
import { physics, verifyDay, type Day } from '@/content/physics';
import { ResourceShelf } from '@/components/resources/ResourceShelf';
import { DocumentViewer } from '@/components/media/DocumentViewer';
import { JourneyMap } from '@/experiences/physics/JourneyMap';
import { useMediaQuery, useReducedMotion } from '@/hooks/useMedia';
import { asset } from '@/lib/asset';

const meta = chapterById('fisica');
const DAYS = physics.days;
const N = DAYS.length;
/**
 * Within each day (t ∈ 0–1): arrive (overview) → the camera eases in → the
 * vehicle drives at a steady visual pace → the camera eases back out →
 * vectors draw on → hold (totals and speeds, long enough to read).
 * The scroll is the single progress controller; nothing runs on its own clock.
 */
const FOLLOW_IN = [0.03, 0.13] as const;
const TRAVEL = [0.14, 0.62] as const;
const FOLLOW_OUT = [0.63, 0.74] as const;
const VECTORS = [0.74, 0.84] as const;
const HOLD = 0.72;
/** Intro (cover → map) length, in day units. */
const INTRO = 0.7;

const num = (n: number, d = 1) => n.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d });
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => x * x * (3 - 2 * x);
const ramp = (t: number, [a, b]: readonly [number, number]) => smooth(clamp01((t - a) / (b - a)));

/**
 * Trapezoidal pace: gentle acceleration over the first 15 %, constant speed,
 * gentle stop over the last 15 %. Applied to arc length (see `polyline`), so
 * the vehicle's on-screen speed is even across segments of different length.
 */
function pace(x: number, e = 0.15) {
  const v = 1 / (1 - e); // cruise speed so that the total distance is 1
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  if (x < e) return (v / (2 * e)) * x * x;
  if (x > 1 - e) return 1 - (v / (2 * e)) * (1 - x) * (1 - x);
  return v * (x - e / 2);
}

function phase(t: number) {
  const travel = pace(clamp01((t - TRAVEL[0]) / (TRAVEL[1] - TRAVEL[0])));
  const follow = ramp(t, FOLLOW_IN) * (1 - ramp(t, FOLLOW_OUT));
  const vectors = clamp01((t - VECTORS[0]) / (VECTORS[1] - VECTORS[0]));
  return { travel, follow, vectors, holding: t >= HOLD };
}

/**
 * Segment progress along the drive. The vehicle's position on the traced line
 * is split in proportion to each segment's distance (an approximation of the
 * map, not GPS). Values are shown only once a segment is complete — never as a
 * running counter — and always as written in the presentation.
 */
function segmentState(day: Day, travel: number) {
  const sum = day.segments.reduce((acc, x) => acc + x.km, 0);
  let acc = 0;
  return day.segments.map((s) => {
    const start = acc / sum;
    acc += s.km;
    const end = acc / sum;
    return { active: travel > start && travel < end - 0.001, done: travel >= end - 0.001 };
  });
}

const kindLabel = { 'rapidez-media': 'Rapidez media', 'rapidez-movimiento': 'Rapidez en movimiento', 'velocidad-media': 'Velocidad media (vector)' };

function DayPanel({ day, t }: { day: Day; t: number }) {
  const { travel, holding } = phase(t);
  const segs = segmentState(day, travel);
  const [chart, setChart] = useState(false);
  return (
    <div className="flex min-h-full flex-col">
      <p className="meta text-sand">
        Día {day.n} <span className="text-ivory/40">/ {N}</span>
      </p>
      <h2 className="mt-2 font-display text-[clamp(1.7rem,2.4vw,2.5rem)] leading-[1.02]">{day.title}</h2>
      <p className="mt-1.5 text-[0.95rem] text-ivory/65">{day.lead}</p>

      <ol className="mt-5 space-y-1.5">
        {day.segments.map((s, i) => (
          <li key={s.code} className={`rounded-sm px-3 py-2 transition-colors duration-500 ${segs[i].active ? 'bg-ivory/12' : ''}`}>
            <p className={`text-[0.95rem] leading-snug transition-colors ${segs[i].active || segs[i].done ? 'text-ivory' : 'text-ivory/45'}`}>
              <span className="mr-2 font-mono text-xs text-sand">{s.code}</span>
              {s.from} → {s.to}
            </p>
            <p className={`mt-1 font-mono text-[0.78rem] tabular-nums text-ivory/70 transition-opacity duration-700 ${segs[i].done ? 'opacity-100' : 'opacity-0'}`} aria-hidden={!segs[i].done}>
              {s.km} km · {num(s.hours, 2)} h · {num(s.speed)} km/h
            </p>
          </li>
        ))}
      </ol>

      <div className={`mt-5 transition-all duration-700 ${holding ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`} aria-hidden={!holding}>
        <div className="grid grid-cols-3 gap-3 border-y border-ivory/12 py-4">
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ivory/50">Distancia</p>
            <p className="mt-1 font-display text-3xl tabular-nums">
              {day.total.km} <span className="font-sans text-xs text-ivory/55">km</span>
            </p>
          </div>
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ivory/50">En movimiento</p>
            <p className="mt-1 font-display text-3xl tabular-nums">
              {num(day.total.hours, 2)} <span className="font-sans text-xs text-ivory/55">h</span>
            </p>
          </div>
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ivory/50">Horario</p>
            <p className="mt-1 font-display text-2xl tabular-nums">
              {day.total.depart}–{day.total.arrive}
            </p>
          </div>
        </div>
        <div className="mt-3 space-y-2.5">
          {day.speeds.map((sp) => (
            <div key={sp.label} className="flex items-baseline justify-between gap-4">
              <div className="min-w-0">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ivory/50">{kindLabel[sp.kind]}</p>
                <p className="text-sm text-ivory/75">
                  {sp.label} <span className="font-mono text-xs text-ivory/50">{sp.formula}</span>
                </p>
              </div>
              <p className={`whitespace-nowrap font-display text-[1.7rem] tabular-nums ${sp.kind === 'velocidad-media' ? 'text-gold' : ''}`}>
                {num(sp.value)} <span className="font-sans text-xs text-ivory/55">km/h</span>
              </p>
            </div>
          ))}
        </div>
        <button onClick={() => setChart(true)} className="btn-text mt-4 text-ivory/65 hover:text-ivory">
          Gráfica distancia–tiempo <span className="arrow">→</span>
        </button>
      </div>
      <DocumentViewer lang="es" open={chart} onClose={() => setChart(false)} item={{ title: `Día ${day.n} · gráfica de la presentación`, src: asset(day.chart), kind: 'image' }} />
    </div>
  );
}

/** Cover: the real day-2 route and its resultant vector, drawn as a cartographic line. */
function CoverRoute() {
  const d = DAYS[1];
  const pts = d.route;
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  const pad = 60;
  const vb = [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) - Math.min(...xs) + pad * 2, Math.max(...ys) - Math.min(...ys) + pad * 2];
  const path = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  const r = d.vectors.find((v) => v.kind === 'resultante') ?? d.vectors[d.vectors.length - 1];
  return (
    <svg viewBox={vb.join(' ')} className="h-full w-full" aria-hidden preserveAspectRatio="xMidYMid meet">
      <path d={path} fill="none" stroke="#d6a874" strokeOpacity=".2" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <path d={path} fill="none" stroke="#f4ede2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="ph-draw" />
      <line x1={r.from[0]} y1={r.from[1]} x2={r.to[0]} y2={r.to[1]} stroke="#e3c34b" strokeWidth="3" strokeDasharray="2 14" strokeLinecap="round" className="ph-fade" />
      <circle cx={pts[0][0]} cy={pts[0][1]} r="11" fill="#0b1d27" stroke="#f4ede2" strokeWidth="4" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="11" fill="#b02a5e" stroke="#f4ede2" strokeWidth="4" className="ph-fade" />
    </svg>
  );
}

/**
 * The sticky stage. One scroll progress drives everything: first the cover
 * (which fades and recedes while the map scales in), then the five days.
 * The displayed progress eases toward the scroll target, so the camera never jumps.
 */
function Journey({ goToRef }: { goToRef: MutableRefObject<(i: number) => void> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [showVectors, setShowVectors] = useState(true);
  const desktop = useMediaQuery('(min-width: 900px)');
  const reduced = useReducedMotion();
  const [vh, setVh] = useState(() => window.innerHeight);
  const [vw, setVw] = useState(() => window.innerWidth);

  useLayoutEffect(() => {
    let target = 0;
    let shown = 0;
    let raf = 0;
    const tick = () => {
      shown += (target - shown) * 0.1;
      if (Math.abs(target - shown) < 0.00003) shown = target;
      setP(shown);
      if (shown !== target) raf = requestAnimationFrame(tick);
    };
    // Progress from live geometry (robust to late layout changes).
    const read = () => {
      const w = wrap.current;
      if (!w) return 0;
      return clamp01(-w.getBoundingClientRect().top / (w.offsetHeight - window.innerHeight));
    };
    const onScroll = () => {
      target = read();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    target = shown = read();
    setP(shown);
    const onResize = () => {
      setVh(window.innerHeight);
      setVw(window.innerWidth);
      onScroll();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const U = INTRO + N;
  const units = p * U;
  const intro = reduced ? 1 : clamp01(units / INTRO);
  const f = Math.min(N - 0.0001, Math.max(0, units - INTRO));
  const dayIndex = Math.floor(f);
  const t = reduced ? 0.9 : f - dayIndex;
  const day = DAYS[dayIndex];
  const ph = phase(t);

  const goTo = (i: number) => {
    const el = wrap.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * ((INTRO + i + (reduced ? 0.5 : 0.86)) / U), behavior: reduced ? 'auto' : 'smooth' });
  };
  goToRef.current = goTo;

  // A solid information column (desktop) or band (phone); the map is framed beside it, never under it.
  const panelW = desktop ? Math.min(420, Math.round(vw * 0.3)) : 0;
  const bandH = desktop ? 0 : Math.round(vh * 0.42);
  const stage = smooth(clamp01((intro - 0.35) / 0.65));
  const coverOut = smooth(clamp01(intro / 0.75));
  const totalKm = DAYS.reduce((acc, d) => acc + d.total.km, 0);

  return (
    <div ref={wrap} className="relative" style={{ height: `${U * (desktop ? 300 : 250) + 100}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#0b1d27]">
        {/* Map stage — scales in from the cover */}
        <div className="absolute inset-0" style={{ opacity: stage, transform: `scale(${1.08 - 0.08 * stage})` }} aria-hidden={stage < 0.5}>
          <div className="absolute inset-y-0 left-0" style={{ right: panelW, bottom: bandH }}>
            <JourneyMap key={day.n} day={day} travel={reduced ? 1 : ph.travel} camera={{ follow: reduced ? 0 : ph.follow, vectors: reduced ? 1 : ph.vectors }} inset={{ right: 0, bottom: 0 }} showVectors={showVectors} />
          </div>

          <aside
            className="absolute inset-x-0 bottom-0 overflow-y-auto border-t border-ivory/10 bg-[#0b1d27] px-[var(--gutter)] pb-6 pt-5 min-[900px]:inset-y-0 min-[900px]:left-auto min-[900px]:border-l min-[900px]:border-t-0 min-[900px]:px-9 min-[900px]:pb-8 min-[900px]:pt-[calc(var(--nav-h)+2rem)]"
            style={desktop ? { width: panelW } : { height: bandH }}
            aria-live="polite"
          >
            <DayPanel day={day} t={t} />
          </aside>

          <div className="absolute left-3 top-[calc(var(--nav-h)+0.75rem)] space-y-2 md:left-6" style={{ right: panelW ? panelW + 12 : 12 }}>
            <div className="flex flex-wrap items-center gap-1.5">
              <nav aria-label="Días del viaje" className="flex gap-1 rounded-full bg-[#0b1d27] p-1">
                {DAYS.map((d, i) => (
                  <button key={d.n} onClick={() => goTo(i)} aria-current={i === dayIndex ? 'step' : undefined} className={`rounded-full px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] transition-colors ${i === dayIndex ? 'bg-ivory text-ink' : 'text-ivory/70 hover:text-ivory'}`}>
                    Día {d.n}
                  </button>
                ))}
              </nav>
              <button onClick={() => setShowVectors((v) => !v)} aria-pressed={showVectors} className="rounded-full bg-[#0b1d27] px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ivory/80 hover:text-ivory">
                {showVectors ? 'Ocultar vectores' : 'Mostrar vectores'}
              </button>
            </div>
            <div className="pointer-events-none flex w-fit gap-4 rounded-full bg-[#0b1d27]/90 px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ivory/85">
              <span className="flex items-center gap-2">
                <span className="h-[3px] w-6 rounded-full bg-ivory" /> Ruta por carretera
              </span>
              <span className="flex items-center gap-2">
                <span className="h-[3px] w-6 rounded-full bg-gold" /> Vector resultante
              </span>
            </div>
          </div>
          <p className="pointer-events-none absolute bottom-2 left-6 hidden font-mono text-[0.55rem] uppercase leading-relaxed tracking-[0.12em] text-ivory/55 min-[900px]:block" style={{ right: panelW + 24 }}>
            {physics.mapCredit} · ruta trazada aproximadamente sobre la captura, sin precisión GPS
          </p>
        </div>

        {/* Cover — the whole first screen; it fades and recedes on the first scroll */}
        {coverOut < 1 && (
          <section
            aria-label="Portada"
            className="absolute inset-0 overflow-hidden"
            style={{ opacity: 1 - coverOut, transform: `scale(${1 - 0.06 * coverOut}) translateY(${-4 * coverOut}vh)` }}
          >
            <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'linear-gradient(rgba(244,237,226,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(244,237,226,.05) 1px, transparent 1px)', backgroundSize: '72px 72px' }} aria-hidden />
            <div className="absolute inset-y-[12%] right-[4%] w-[46%] opacity-30 max-[899px]:inset-x-[8%] max-[899px]:inset-y-[8%] max-[899px]:w-auto min-[900px]:opacity-100">
              <CoverRoute />
            </div>
            <div className="gutter relative flex h-full flex-col justify-center pt-[var(--nav-h)] min-[900px]:w-[60%]">
              <p className="meta text-sand">
                Capítulo {meta.numeral} · {meta.subject}
                {settings.physicsMode === 'merged' && ' · Anexo de Matemáticas'}
              </p>
              <h1 className="display-hero mt-6">
                Vectores <span className="block italic text-sand">en La Guajira</span>
              </h1>
              <p className="mt-8 max-w-[42ch] text-lg leading-relaxed text-ivory/80">{physics.intro}</p>
              <p className="meta mt-8 text-ivory/50">
                5 días · {totalKm} km · {physics.authors.join(' · ')}
              </p>
            </div>
            <p className="meta absolute bottom-6 left-1/2 -translate-x-1/2 text-ivory/45">Desliza para iniciar el recorrido ↓</p>
          </section>
        )}
      </div>
    </div>
  );
}

export default function PhysicsPage() {
  const goToRef = useRef<(i: number) => void>(() => undefined);

  return (
    <div lang="es" className="bg-[#0b1d27] text-ivory">
      <Journey goToRef={goToRef} />

      {/* Route vs vector — the key distinction */}
      <section className="gutter grid gap-10 border-t border-ivory/10 py-16 md:grid-cols-2 md:gap-20 md:py-20">
        <div>
          <p className="meta text-sand">Trayectoria</p>
          <h2 className="display-md mt-3">La ruta por carretera</h2>
          <p className="mt-4 max-w-[46ch] leading-relaxed text-ivory/70">La línea clara es el camino que siguió el vehículo, tomado de la captura de Google Maps de cada día. Su longitud es la distancia recorrida que reporta la presentación.</p>
        </div>
        <div>
          <p className="meta text-gold">Desplazamiento</p>
          <h2 className="display-md mt-3">Los vectores a, b y R</h2>
          <p className="mt-4 max-w-[46ch] leading-relaxed text-ivory/70">Las flechas rectas unen los puntos que el equipo marcó sobre cada mapa: vectores parciales (a, b) y el resultante (R), del inicio al final del día. La presentación reporta una magnitud de desplazamiento solo para el día 2 (110 km al noreste).</p>
        </div>
      </section>

      {/* Full tables (source values + verification) */}
      <section aria-labelledby="tablas" className="gutter border-t border-ivory/10 py-16 md:py-20">
        <details className="group">
          <summary className="flex cursor-pointer list-none flex-wrap items-baseline justify-between gap-4 [&::-webkit-details-marker]:hidden">
            <span>
              <h2 id="tablas" className="display-md inline">
                Datos completos por día
              </h2>
              <span className="mt-2 block max-w-[60ch] text-ivory/60">Tablas de la presentación con la verificación de cada operación y las notas de revisión.</span>
            </span>
            <span className="btn-pill border-ivory/25 text-ivory/80 group-open:border-ivory">
              <span className="group-open:hidden">Abrir tablas</span>
              <span className="hidden group-open:inline">Cerrar tablas</span>
            </span>
          </summary>
        <div className="mt-12 space-y-16">
          {DAYS.map((d) => {
            const v = verifyDay(d);
            return (
              <article key={d.n} className="grid gap-6 md:grid-cols-[12rem_1fr]">
                <div>
                  <p className="meta text-sand">Día {d.n}</p>
                  <p className="mt-2 font-display text-2xl leading-tight">{d.title}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="border-b border-ivory/15 text-left font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ivory/45">
                        <th className="py-2 pr-3 font-normal">Trayecto</th>
                        <th className="py-2 pr-3 font-normal">Salida</th>
                        <th className="py-2 pr-3 font-normal">Llegada</th>
                        <th className="py-2 pr-3 text-right font-normal">t (h)</th>
                        <th className="py-2 pr-3 text-right font-normal">d (km)</th>
                        <th className="py-2 pr-3 text-right font-normal">Parada (min)</th>
                        <th className="py-2 pr-3 text-right font-normal">v = d/t</th>
                        <th className="py-2 text-right font-normal">Verificación</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono tabular-nums">
                      {d.segments.map((s, i) => {
                        const c = v.segmentChecks[i];
                        return (
                          <tr key={s.code} className="border-b border-ivory/10">
                            <td className="py-2 pr-3 font-sans">
                              <span className="text-sand">{s.code}</span> {s.from} → {s.to}
                            </td>
                            <td className="py-2 pr-3">{s.depart}</td>
                            <td className="py-2 pr-3">{s.arrive}</td>
                            <td className="py-2 pr-3 text-right">{num(s.hours, 2)}</td>
                            <td className="py-2 pr-3 text-right">{s.km}</td>
                            <td className="py-2 pr-3 text-right">{s.stopMin ?? '—'}</td>
                            <td className="py-2 pr-3 text-right">{num(s.speed)}</td>
                            <td className={`py-2 text-right ${c.clockMatches && Math.abs(c.computed - s.speed) < 0.06 ? 'text-turquoise' : 'text-gold'}`}>
                              {num(c.computed, 2)}
                              {!c.clockMatches && ` · reloj ${num(c.clockHours, 2)} h`}
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="text-ivory">
                        <td className="py-2 pr-3 font-sans font-semibold">Total del día</td>
                        <td className="py-2 pr-3">{d.total.depart}</td>
                        <td className="py-2 pr-3">{d.total.arrive}</td>
                        <td className="py-2 pr-3 text-right">{num(d.total.hours, 2)}</td>
                        <td className="py-2 pr-3 text-right">{d.total.km}</td>
                        <td className="py-2 pr-3 text-right">{d.total.stopMin}</td>
                        <td />
                        <td className={`py-2 text-right ${v.kmMatches && v.movingMatches && v.stopsMatch ? 'text-turquoise' : 'text-gold'}`}>{v.kmMatches && v.movingMatches && v.stopsMatch ? 'sumas ✓' : 'revisar'}</td>
                      </tr>
                    </tbody>
                  </table>
                  <ul className="mt-4 space-y-1 text-sm text-ivory/70">
                    {v.speedChecks.map((s) => (
                      <li key={s.label}>
                        <span className="font-mono">{num(s.value)} km/h</span> — {s.label} {s.formula} · <span className={s.matches ? 'text-turquoise' : 'text-gold'}>{s.matches ? `verificado (${num(s.computed, 2)})` : `recalculado: ${num(s.computed, 2)}`}</span>
                      </li>
                    ))}
                  </ul>
                  {d.review.length > 0 && (
                    <ul className="mt-4 space-y-2 border-l-2 border-gold/70 pl-4 text-sm text-ivory/75">
                      {d.review.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        </details>
      </section>

      {/* Fuel */}
      <section aria-labelledby="combustible" className="gutter border-t border-ivory/10 bg-[#0e2531] py-16 md:py-20">
        <p className="meta text-sand">Análisis final</p>
        <h2 id="combustible" className="display-md mt-3">
          Combustible
        </h2>
        <dl className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {physics.fuel.rows.map((r) => (
            <div key={r.vehicle}>
              <dt className="meta text-ivory/50">{r.vehicle}</dt>
              <dd className="mt-1 font-display text-3xl tabular-nums">{r.km} km</dd>
              <dd className="text-sm text-ivory/60">{r.days}</dd>
            </div>
          ))}
          <div>
            <dt className="meta text-ivory/50">Galones gastados</dt>
            <dd className="mt-1 font-display text-3xl tabular-nums">{num(physics.fuel.total.gallons)}</dd>
            <dd className="text-sm text-ivory/60">{physics.fuel.total.km} km en total</dd>
          </div>
          <div>
            <dt className="meta text-ivory/50">Costo</dt>
            <dd className="mt-1 font-display text-3xl text-gold">{physics.fuel.total.cost}</dd>
            <dd className="text-sm text-ivory/60">{physics.fuel.priceLabel} {physics.fuel.rows[0].price}</dd>
          </div>
        </dl>
        <ul className="mt-8 max-w-3xl space-y-2 border-l-2 border-gold/70 pl-4 text-sm text-ivory/75">
          {physics.fuel.review.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <details className="group mt-8">
          <summary className="btn-text cursor-pointer list-none text-ivory/70 hover:text-ivory [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Ver tabla de combustible</span>
            <span className="hidden group-open:inline">Ocultar tabla</span> <span className="arrow">↓</span>
          </summary>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-ivory/15 text-left font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ivory/45">
                <th className="py-2 pr-3 font-normal">Tipo de vehículo</th>
                <th className="py-2 pr-3 font-normal">Días</th>
                <th className="py-2 pr-3 text-right font-normal">Distancia (km)</th>
                <th className="py-2 pr-3 font-normal">Rendimiento</th>
                <th className="py-2 pr-3 text-right font-normal">Galones gastados</th>
                <th className="py-2 pr-3 text-right font-normal">{physics.fuel.priceLabel}</th>
                <th className="py-2 text-right font-normal">Costo</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {physics.fuel.rows.map((r) => (
                <tr key={r.vehicle} className="border-b border-ivory/10">
                  <td className="py-3 pr-3 font-display text-lg">{r.vehicle}</td>
                  <td className="py-3 pr-3">{r.days}</td>
                  <td className="py-3 pr-3 text-right font-mono">{r.km}</td>
                  <td className="py-3 pr-3 font-mono text-xs">{r.efficiency}</td>
                  <td className="py-3 pr-3 text-right font-mono">{num(r.gallons)}</td>
                  <td className="py-3 pr-3 text-right font-mono">{r.price}</td>
                  <td className="py-3 text-right font-mono">{r.cost}</td>
                </tr>
              ))}
              <tr>
                <td className="py-3 pr-3 font-semibold">TOTAL</td>
                <td className="py-3 pr-3">Todos</td>
                <td className="py-3 pr-3 text-right font-mono">{physics.fuel.total.km}</td>
                <td className="py-3 pr-3">—</td>
                <td className="py-3 pr-3 text-right font-mono">{num(physics.fuel.total.gallons)}</td>
                <td className="py-3 pr-3 text-right">—</td>
                <td className="py-3 text-right font-display text-2xl text-gold">{physics.fuel.total.cost}</td>
              </tr>
            </tbody>
          </table>
        </div>
        </details>
      </section>

      <ResourceShelf
        lang="es"
        tone="dark"
        entries={[
          {
            title: physics.presentation.title,
            type: 'Presentación original · PDF · 12 diapositivas',
            src: asset(physics.presentation.src!),
            kind: 'pdf',
            fileName: 'Vectores-en-La-Guajira-Grupo-2.pdf',
            thumb: asset('images/fisica/portada-presentacion.jpg'),
          },
        ]}
      />
    </div>
  );
}
