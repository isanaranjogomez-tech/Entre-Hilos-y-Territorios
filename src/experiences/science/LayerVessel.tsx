import { useEffect, useRef, useState } from 'react';
import { science } from '@/content/science';
import { useReducedMotion } from '@/hooks/useMedia';

type Layer = 'water' | 'fuel';

// Vessel geometry (SVG units)
const X0 = 120;
const X1 = 380;
const TOP = 90;
const BOTTOM = 470;
const FUEL_TOP = 160;
const INTERFACE = 230; // fuel sits above, water below

interface Drop {
  x: number;
  y: number;
  r: number;
  vy: number;
}

/**
 * Conceptual model from the poster: a vessel with a water layer (polar,
 * ~1,000 kg/m³) and a fuel layer (mainly non-polar, gasoline 715–780 kg/m³).
 * "Stir" disperses fuel droplets through the water; being less dense and not
 * mixing with water, they rise and gather above it again. Not a measurement.
 */
export function LayerVessel() {
  const [selected, setSelected] = useState<Layer>('water');
  const [drops, setDrops] = useState<Drop[] | null>(null);
  const raf = useRef(0);
  const reduced = useReducedMotion();
  const info = science.layers[selected];

  const stir = () => {
    cancelAnimationFrame(raf.current);
    const seeded: Drop[] = Array.from({ length: 26 }, (_, i) => ({
      x: X0 + 26 + ((i * 97) % (X1 - X0 - 52)),
      y: INTERFACE + 30 + ((i * 53) % (BOTTOM - INTERFACE - 60)),
      r: 5 + (i % 4) * 2,
      vy: 0,
    }));
    if (reduced) {
      setDrops(null);
      return;
    }
    let last = performance.now();
    let state = seeded;
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // Buoyancy (lower density) with drag: the droplets rise to the interface.
      state = state.map((d) => {
        const vy = d.vy + (-120 - d.vy * 1.8) * dt;
        return { ...d, vy, y: Math.max(INTERFACE - d.r * 0.4, d.y + vy * dt), x: d.x + Math.sin(now / 400 + d.r) * 0.15 };
      });
      setDrops(state);
      if (state.some((d) => d.y > INTERFACE + 2)) raf.current = requestAnimationFrame(step);
      else setTimeout(() => setDrops(null), 500);
    };
    setDrops(seeded);
    raf.current = requestAnimationFrame(step);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const fuelOpacity = drops ? 0.45 : 1;
  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-16">
      <div className="relative mx-auto w-full max-w-[460px]">
        <svg viewBox="0 0 500 540" className="w-full" role="img" aria-label="Conceptual vessel: a fuel layer floats above a water layer.">
          <defs>
            <linearGradient id="v-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7cc6d3" />
              <stop offset="1" stopColor="#3f93a8" />
            </linearGradient>
            <linearGradient id="v-fuel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f1cf72" />
              <stop offset="1" stopColor="#e1b04f" />
            </linearGradient>
            <linearGradient id="v-glass" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity=".55" />
              <stop offset=".18" stopColor="#fff" stopOpacity=".05" />
              <stop offset=".85" stopColor="#fff" stopOpacity=".02" />
              <stop offset="1" stopColor="#fff" stopOpacity=".35" />
            </linearGradient>
            <clipPath id="v-clip">
              <path d={`M${X0} ${TOP} L${X0} ${BOTTOM - 20} Q${X0} ${BOTTOM} ${X0 + 20} ${BOTTOM} L${X1 - 20} ${BOTTOM} Q${X1} ${BOTTOM} ${X1} ${BOTTOM - 20} L${X1} ${TOP}Z`} />
            </clipPath>
          </defs>
          <ellipse cx="250" cy="500" rx="170" ry="16" fill="#143848" opacity=".12" />
          <g clipPath="url(#v-clip)">
            <rect x={X0} y={INTERFACE} width={X1 - X0} height={BOTTOM - INTERFACE} fill="url(#v-water)" onClick={() => setSelected('water')} className="cursor-pointer" />
            <rect x={X0} y={FUEL_TOP} width={X1 - X0} height={INTERFACE - FUEL_TOP} fill="url(#v-fuel)" opacity={fuelOpacity} style={{ transition: 'opacity .6s' }} onClick={() => setSelected('fuel')} className="cursor-pointer" />
            <ellipse cx="250" cy={FUEL_TOP} rx="130" ry="10" fill="#f6dc94" opacity={fuelOpacity} />
            <ellipse cx="250" cy={INTERFACE} rx="130" ry="9" fill="#9fd3da" opacity=".7" />
            {drops?.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#efc965" opacity=".95" />
            ))}
            {/* selection outline */}
            <rect
              x={X0 + 3}
              y={(selected === 'fuel' ? FUEL_TOP : INTERFACE) + 3}
              width={X1 - X0 - 6}
              height={(selected === 'fuel' ? INTERFACE - FUEL_TOP : BOTTOM - INTERFACE) - 6}
              fill="none"
              stroke="#143848"
              strokeWidth="2"
              strokeDasharray="6 5"
              style={{ transition: 'all .5s' }}
            />
          </g>
          <path d={`M${X0} ${TOP} L${X0} ${BOTTOM - 20} Q${X0} ${BOTTOM} ${X0 + 20} ${BOTTOM} L${X1 - 20} ${BOTTOM} Q${X1} ${BOTTOM} ${X1} ${BOTTOM - 20} L${X1} ${TOP}`} fill="url(#v-glass)" stroke="#143848" strokeOpacity=".45" strokeWidth="2" />
          <ellipse cx="250" cy={TOP} rx="130" ry="12" fill="none" stroke="#143848" strokeOpacity=".45" strokeWidth="2" />
          {/* labels, as on the poster's Figure 3 */}
          <g fontFamily="IBM Plex Mono, monospace" fontSize="13" fill="#143848">
            <line x1={X1 + 6} y1={(FUEL_TOP + INTERFACE) / 2} x2={X1 + 26} y2={(FUEL_TOP + INTERFACE) / 2} stroke="#143848" strokeOpacity=".5" />
            <text x={X1 + 30} y={(FUEL_TOP + INTERFACE) / 2 + 4}>FUEL</text>
            <line x1={X1 + 6} y1={(INTERFACE + BOTTOM) / 2} x2={X1 + 26} y2={(INTERFACE + BOTTOM) / 2} stroke="#143848" strokeOpacity=".5" />
            <text x={X1 + 30} y={(INTERFACE + BOTTOM) / 2 + 4}>WATER</text>
          </g>
        </svg>
      </div>

      <div>
        <p className="meta text-magenta">{science.modelTitle}</p>
        <div className="mt-6 flex gap-2" role="tablist" aria-label="Layers">
          {(['fuel', 'water'] as Layer[]).map((l) => (
            <button
              key={l}
              role="tab"
              aria-selected={selected === l}
              onClick={() => setSelected(l)}
              className={`rounded-full border px-5 py-2.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] transition-colors ${selected === l ? 'border-navy bg-navy text-ivory' : 'border-navy/25 hover:border-navy'}`}
            >
              {l === 'fuel' ? 'Fuel layer' : 'Water layer'}
            </button>
          ))}
        </div>
        <dl className="mt-8 space-y-6" aria-live="polite">
          <div>
            <dt className="meta text-navy/50">Layer</dt>
            <dd className="mt-1 font-display text-3xl">{info.label}</dd>
          </div>
          <div>
            <dt className="meta text-navy/50">Polarity</dt>
            <dd className="mt-1 text-lg">{info.polarity}</dd>
          </div>
          <div>
            <dt className="meta text-navy/50">Density</dt>
            <dd className="mt-1 text-lg">{info.density}</dd>
          </div>
        </dl>
        <DensityScale highlight={selected} />
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button onClick={stir} className="btn-pill border-navy/30 hover:border-navy" disabled={Boolean(drops)}>
            {drops ? 'Separating…' : 'Stir the vessel'}
          </button>
          <p className="max-w-[34ch] text-sm leading-relaxed text-navy/60">
            {reduced ? 'Motion is reduced: the layers stay separated, fuel above water.' : 'Watch the fuel droplets rise and gather above the water again.'}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Density bars using only the poster's values (kg/m³). */
function DensityScale({ highlight }: { highlight: Layer }) {
  const max = 1050;
  const bar = (v: number) => `${(v / max) * 100}%`;
  return (
    <figure className="mt-10" aria-label="Density comparison from the poster">
      <figcaption className="meta mb-3 text-navy/50">Density (kg/m³) · values from the poster</figcaption>
      <div className="space-y-3 font-mono text-xs">
        <div className={`transition-opacity ${highlight === 'fuel' ? 'opacity-100' : 'opacity-50'}`}>
          <div className="flex justify-between">
            <span>Gasoline</span>
            <span>715 – 780</span>
          </div>
          <div className="relative mt-1 h-2 bg-navy/10">
            <span className="absolute inset-y-0 bg-[#e1b04f]" style={{ left: bar(715), width: `calc(${bar(780)} - ${bar(715)})` }} />
            <span className="absolute inset-y-0 left-0 bg-[#e1b04f]/35" style={{ width: bar(715) }} />
          </div>
        </div>
        <div className={`transition-opacity ${highlight === 'water' ? 'opacity-100' : 'opacity-50'}`}>
          <div className="flex justify-between">
            <span>Pure water (4 °C)</span>
            <span>≈ 1,000</span>
          </div>
          <div className="relative mt-1 h-2 bg-navy/10">
            <span className="absolute inset-y-0 left-0 bg-[#3f93a8]" style={{ width: bar(1000) }} />
          </div>
        </div>
      </div>
    </figure>
  );
}
