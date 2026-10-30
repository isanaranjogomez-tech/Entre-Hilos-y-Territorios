import { useLayoutEffect, useRef, useState, type MutableRefObject } from 'react';
import { chapterById, settings } from '@/content/project';
import { physics, verifyDay, type Day } from '@/content/physics';
import { ResourceShelf } from '@/components/resources/ResourceShelf';
import { DocumentViewer } from '@/components/media/DocumentViewer';
import { RouteMap } from '@/experiences/physics/RouteMap';
import { useMediaQuery, useReducedMotion } from '@/hooks/useMedia';
import { ScrollTrigger } from '@/lib/gsap';
import { asset } from '@/lib/asset';

const meta = chapterById('fisica');
const DAYS = physics.days;
const N = DAYS.length;
/** Within each day: arrive (map settles) → travel (vehicle drives) → hold (vectors + data). */
const ARRIVE = 0.12;
const TRAVEL_END = 0.6;

const num = (n: number, d = 1) => n.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d });
const smooth = (x: number) => x * x * (3 - 2 * x);

function phase(t: number) {
  const travel = smooth(Math.min(1, Math.max(0, (t - ARRIVE) / (TRAVEL_END - ARRIVE))));
  const holding = t >= TRAVEL_END;
  // The view follows the vehicle while it drives, then pulls back to show the whole route.
  const follow = t < ARRIVE || holding ? 0 : Math.sin(Math.PI * travel) * 0.9;
  return { travel, holding, follow };
}

/** Which segment the vehicle is in, by share of the day's distance. */
function segmentAt(day: Day, travel: number) {
  let acc = 0;
  for (let i = 0; i < day.segments.length; i++) {
    acc += day.segments[i].km;
    if (travel * day.total.km <= acc + 0.001) return i;
  }
  return day.segments.length - 1;
}

const kindLabel = { 'rapidez-media': 'Rapidez media', 'rapidez-movimiento': 'Rapidez en movimiento', 'velocidad-media': 'Velocidad media (vector)' };

function DayPanel({ day, t }: { day: Day; t: number }) {
  const { travel, holding } = phase(t);
  const seg = segmentAt(day, travel);
  const km = Math.round(travel * day.total.km);
  const [chart, setChart] = useState(false);
  return (
    <div className="flex h-full flex-col">
      <p className="meta text-sand">Día {day.n}</p>
      <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-ivory/40 md:hidden">{physics.mapCredit} · ruta aproximada</p>
      <h2 className="mt-2 font-display text-[clamp(1.9rem,3vw,3rem)] leading-[1.02]">{day.title}</h2>
      <p className="mt-2 text-sm text-ivory/60">{day.lead}</p>

      <div className="mt-6 grid grid-cols-3 gap-4 border-y border-ivory/10 py-4 font-mono">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.16em] text-ivory/45">Distancia</p>
          <p className="mt-1 text-xl tabular-nums md:text-2xl">
            {holding ? day.total.km : km} <span className="text-xs text-ivory/50">km</span>
          </p>
        </div>
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.16em] text-ivory/45">En movimiento</p>
          <p className="mt-1 text-xl tabular-nums md:text-2xl">
            {num(day.total.hours, 2)} <span className="text-xs text-ivory/50">h</span>
          </p>
        </div>
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.16em] text-ivory/45">Horario</p>
          <p className="mt-1 text-xl tabular-nums md:text-2xl">
            {day.total.depart}–{day.total.arrive}
          </p>
        </div>
      </div>

      <ol className="mt-4 space-y-1 text-sm">
        {day.segments.map((s, i) => (
          <li key={s.code} className={`grid grid-cols-[3.2rem_1fr] gap-x-3 rounded-sm px-2 py-1.5 transition-colors lg:grid-cols-[3.2rem_1fr_auto] ${!holding && i === seg && t > ARRIVE ? 'bg-ivory/10 text-ivory' : 'text-ivory/65'}`}>
            <span className="font-mono text-xs text-sand">{s.code}</span>
            <span>
              {s.from} → {s.to}
            </span>
            <span className="col-start-2 font-mono text-xs tabular-nums text-ivory/60 lg:col-start-auto">
              {s.km} km · {num(s.hours, 2)} h · {num(s.speed)} km/h
            </span>
          </li>
        ))}
      </ol>

      <div className={`mt-5 space-y-3 transition-opacity duration-700 ${holding ? 'opacity-100' : 'opacity-0'}`} aria-hidden={!holding}>
        {day.speeds.map((s) => (
          <div key={s.label} className="flex items-baseline justify-between gap-4 border-t border-ivory/10 pt-3">
            <div>
              <p className="text-[0.6rem] font-mono uppercase tracking-[0.16em] text-ivory/45">{kindLabel[s.kind]}</p>
              <p className="text-sm text-ivory/70">
                {s.label} <span className="font-mono text-xs text-ivory/45">{s.formula}</span>
              </p>
            </div>
            <p className={`whitespace-nowrap font-display text-3xl tabular-nums ${s.kind === 'velocidad-media' ? 'text-gold' : ''}`}>
              {num(s.value)} <span className="font-sans text-xs text-ivory/50">km/h</span>
            </p>
          </div>
        ))}
        <button onClick={() => setChart(true)} className="btn-text pt-2 text-ivory/60 hover:text-ivory">
          Gráfica distancia–tiempo del día <span className="arrow">→</span>
        </button>
      </div>
      <DocumentViewer lang="es" open={chart} onClose={() => setChart(false)} item={{ title: `Día ${day.n} · gráfica de la presentación`, src: asset(day.chart), kind: 'image' }} />
    </div>
  );
}

/** The sticky map stage. Owns the scroll state so only this part re-renders while scrolling. */
function Journey({ goToRef }: { goToRef: MutableRefObject<(i: number) => void> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [showVectors, setShowVectors] = useState(true);
  const desktop = useMediaQuery('(min-width: 900px)');
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const st = ScrollTrigger.create({ trigger: wrap.current, start: 'top top', end: 'bottom bottom', onUpdate: (s) => setP(s.progress) });
    setP(st.progress);
    return () => st.kill();
  }, []);

  const f = Math.min(N - 0.0001, p * N);
  const dayIndex = Math.floor(f);
  const t = reduced ? 0.8 : f - dayIndex;
  const day = DAYS[dayIndex];
  const ph = phase(t);

  const goTo = (i: number) => {
    const el = wrap.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * ((i + (reduced ? 0.5 : 0.75)) / N), behavior: reduced ? 'auto' : 'smooth' });
  };
  goToRef.current = goTo;

  return (
    <>
      <div ref={wrap} className="relative" style={{ height: `${N * (desktop ? 240 : 200) + 100}vh` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-[var(--nav-h)] md:flex-row">
          <div className="relative flex min-h-0 flex-1 items-center justify-center p-3 md:p-6">
            <RouteMap key={day.n} day={day} travel={ph.travel} showVectors={showVectors && (ph.holding || reduced)} follow={reduced ? 0 : ph.follow} className="h-full max-h-full max-w-full shadow-[0_40px_90px_-40px_rgba(0,0,0,.8)]" />
          </div>
          <div className="gutter relative h-[44svh] shrink-0 overflow-y-auto border-t border-ivory/10 py-5 md:h-auto md:w-[42%] md:max-w-[560px] md:border-l md:border-t-0 md:py-10">
            <DayPanel day={day} t={t} />
          </div>
          <div className="absolute left-3 top-[calc(var(--nav-h)+0.75rem)] flex flex-wrap items-center gap-1.5 md:left-6">
            <nav aria-label="Días del viaje" className="flex gap-1 rounded-full bg-ink/75 p-1 backdrop-blur">
              {DAYS.map((d, i) => (
                <button key={d.n} onClick={() => goTo(i)} aria-current={i === dayIndex ? 'step' : undefined} className={`rounded-full px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] transition-colors ${i === dayIndex ? 'bg-ivory text-ink' : 'text-ivory/70 hover:text-ivory'}`}>
                  Día {d.n}
                </button>
              ))}
            </nav>
            <button onClick={() => setShowVectors((v) => !v)} aria-pressed={showVectors} className="rounded-full bg-ink/75 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ivory/80 backdrop-blur hover:text-ivory">
              {showVectors ? 'Ocultar vectores' : 'Mostrar vectores'}
            </button>
          </div>
          <p className="pointer-events-none absolute bottom-2 left-6 hidden max-w-[52%] font-mono text-[0.55rem] uppercase leading-relaxed tracking-[0.12em] text-ivory/45 md:block">
            {physics.mapCredit} · ruta trazada aproximadamente sobre la captura, sin precisión GPS · las flechas son vectores de desplazamiento, no la ruta
          </p>
        </div>
      </div>

    </>
  );
}

export default function PhysicsPage() {
  const goToRef = useRef<(i: number) => void>(() => undefined);
  const goTo = (i: number) => goToRef.current(i);
  const totalKm = DAYS.reduce((s, d) => s + d.total.km, 0);

  return (
    <div lang="es" className="bg-[#0b1d27] text-ivory">
      {/* Opening */}
      <section className="gutter relative flex min-h-[86svh] flex-col justify-end overflow-hidden pb-14 pt-32">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(244,237,226,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(244,237,226,.06) 1px, transparent 1px)', backgroundSize: '64px 64px' }} aria-hidden />
        <div className="relative">
          <p className="meta text-sand">
            Capítulo {meta.numeral} · {meta.subject}
            {settings.physicsMode === 'merged' && ' · Anexo de Matemáticas'} · El viaje en movimiento
          </p>
          <h1 className="display-hero mt-6">
            Vectores <span className="italic text-sand">en La Guajira</span>
          </h1>
          <p className="mt-8 max-w-[46ch] text-lg leading-relaxed text-ivory/75">{physics.intro}</p>
          <p className="meta mt-6 text-ivory/45">{physics.authors.join(' · ')}</p>
        </div>
        <ol className="relative mt-14 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ivory/15 pt-6 sm:grid-cols-3 md:grid-cols-6">
          {DAYS.map((d, i) => (
            <li key={d.n}>
              <button onClick={() => goTo(i)} className="group text-left">
                <span className="meta text-sand">Día {d.n}</span>
                <span className="mt-1 block font-display text-2xl transition-colors group-hover:text-sand">{d.total.km} km</span>
                <span className="block text-xs text-ivory/50">{d.lead}</span>
              </button>
            </li>
          ))}
          <li className="col-span-2 sm:col-span-1">
            <span className="meta text-ivory/45">Total</span>
            <span className="mt-1 block font-display text-2xl">{totalKm} km</span>
            <span className="block text-xs text-ivory/50">Cinco días</span>
          </li>
        </ol>
      </section>

      <Journey goToRef={goToRef} />

      {/* Route vs vector — the key distinction */}
      <section className="gutter grid gap-10 border-t border-ivory/10 py-24 md:grid-cols-2 md:gap-20 md:py-32">
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
      <section aria-labelledby="tablas" className="gutter border-t border-ivory/10 py-24 md:py-32">
        <h2 id="tablas" className="display-lg">
          Datos por día
        </h2>
        <p className="mt-4 max-w-[60ch] text-ivory/60">Valores tal como aparecen en la presentación. La columna “Verificación” recalcula cada operación con los mismos datos.</p>
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
      </section>

      {/* Fuel */}
      <section aria-labelledby="combustible" className="gutter border-t border-ivory/10 bg-[#0e2531] py-24 md:py-32">
        <p className="meta text-sand">Análisis final</p>
        <h2 id="combustible" className="display-lg mt-3">
          Combustible
        </h2>
        <div className="mt-12 overflow-x-auto">
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
        <ul className="mt-8 max-w-3xl space-y-2 border-l-2 border-gold/70 pl-4 text-sm text-ivory/75">
          {physics.fuel.review.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
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
