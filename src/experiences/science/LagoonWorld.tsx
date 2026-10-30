/**
 * The illustrated lagoon as one tall "world" (1600 × 2700): sky and
 * mangrove shore (0–900), the water column (900–2350) and the lagoon floor.
 * The descent moves a camera down through it. It is an illustration —
 * labelled on the page — and never stands in for the field photographs.
 */
export const WORLD_W = 1600;
export const WORLD_H = 2700;
/** World units per stage height (the camera window is 1600 × 900). */
export const STAGE = 900;

const fish: [number, number, number, number][] = [
  // y, scale, duration (s), delay (s)
  [1420, 1, 38, -4],
  [1480, 0.8, 44, -20],
  [1560, 1.2, 34, -12],
  [1650, 0.9, 48, -30],
  [1760, 1.1, 40, -8],
  [1830, 0.7, 52, -26],
  [1940, 1, 46, -16],
];

function Fish({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s})`}>
      <path d="M0 0 q26 -15 54 0 q-28 15 -54 0 Z" fill="#d9ece8" opacity=".85" />
      <path d="M52 0 l16 -11 v22 z" fill="#d9ece8" opacity=".85" />
      <circle cx="12" cy="-2" r="2" fill="#0b2230" />
    </g>
  );
}

/** A wading flamingo, drawn from its feet (0, 0). */
function Flamingo({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} strokeLinecap="round" fill="none">
      <path d="M0 0 L2 -36 L-1 -72 M8 0 L10 -30 L3 -36 L-1 -72" stroke="#c4646d" strokeWidth="2.2" />
      <path d="M-26 -80 C-22 -96 8 -98 22 -86 C14 -74 -14 -70 -26 -80 Z" fill="#ec9a9c" />
      <path d="M-26 -80 l-12 6" stroke="#ec9a9c" strokeWidth="6" />
      <path d="M18 -88 C36 -108 2 -120 10 -146" stroke="#ec9a9c" strokeWidth="5" />
      <circle cx="11" cy="-149" r="5.5" fill="#ec9a9c" />
      <path d="M15 -150 q9 1 7 11" stroke="#1d1b1b" strokeWidth="3" />
    </g>
  );
}

function Crab({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke="#c48a58" strokeWidth="3" fill="none" strokeLinecap="round">
      <ellipse rx="16" ry="9" fill="#a8693f" stroke="none" />
      <path d="M-12 4 l-10 8 M-6 6 l-6 10 M12 4 l10 8 M6 6 l6 10 M-12 -4 q-10 -14 -2 -18 M12 -4 q10 -14 2 -18" />
    </g>
  );
}

/** Deterministic pseudo-random in [0, 1). */
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Mangrove canopy: irregular crowns of varied width sitting on the waterline. */
function canopy(seed: number, base: number, amp: number) {
  let d = `M0 ${base}`;
  let x = 0;
  let i = 0;
  while (x < WORLD_W) {
    const w = 30 + rnd(seed + i) * 70;
    const h = amp * (0.35 + rnd(seed * 3 + i) * 0.65) * (0.7 + 0.3 * Math.sin(x * 0.004 + seed));
    d += ` C${x + w * 0.1} ${base - h} ${x + w * 0.9} ${base - h} ${x + w} ${base - h * (0.3 + rnd(i + seed * 7) * 0.4)}`;
    x += w;
    i++;
  }
  return `${d} L${WORLD_W} ${base + 22} L0 ${base + 22}Z`;
}

export function LagoonWorld() {
  return (
    <svg viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} preserveAspectRatio="xMidYMin slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="lw-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dfe9e6" />
          <stop offset=".6" stopColor="#d4e4df" />
          <stop offset="1" stopColor="#f3e2c2" />
        </linearGradient>
        <radialGradient id="lw-sun" cx="0.7" cy="0.82" r="0.42">
          <stop offset="0" stopColor="#fff6dc" stopOpacity=".95" />
          <stop offset=".35" stopColor="#fbe7bd" stopOpacity=".45" />
          <stop offset="1" stopColor="#fbe7bd" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lw-water" x1="0" y1="900" x2="0" y2="2400" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a6cfca" />
          <stop offset=".07" stopColor="#6aa8a6" />
          <stop offset=".3" stopColor="#2f6f79" />
          <stop offset=".65" stopColor="#174556" />
          <stop offset="1" stopColor="#0b2632" />
        </linearGradient>
        <linearGradient id="lw-floor" x1="0" y1="2330" x2="0" y2="2700" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4a4637" />
          <stop offset="1" stopColor="#1b1d18" />
        </linearGradient>
        <linearGradient id="lw-ray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8fbf6" stopOpacity="0" />
          <stop offset=".25" stopColor="#e8fbf6" stopOpacity=".3" />
          <stop offset="1" stopColor="#e8fbf6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lw-film" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e9b44c" />
          <stop offset=".35" stopColor="#f3d27b" />
          <stop offset=".55" stopColor="#c99adf" />
          <stop offset=".7" stopColor="#8fd0c9" />
          <stop offset="1" stopColor="#e9b44c" />
        </linearGradient>
        <filter id="lw-ripple" x="0" y="0" width="1" height="1">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.08" numOctaves="2" seed="7">
            <animate attributeName="baseFrequency" dur="16s" values="0.004 0.08;0.005 0.09;0.004 0.08" repeatCount="indefinite" />
          </feTurbulence>
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .6 -.22" />
        </filter>
        <filter id="lw-cloud" x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="lw-soft">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Sky */}
      <rect width={WORLD_W} height="905" fill="url(#lw-sky)" />
      <rect width={WORLD_W} height="905" fill="url(#lw-sun)" />
      {/* Soft clouds */}
      <g fill="#fbfaf4" opacity=".55" filter="url(#lw-cloud)">
        <ellipse cx="260" cy="430" rx="260" ry="34" />
        <ellipse cx="520" cy="470" rx="180" ry="22" />
        <ellipse cx="1080" cy="360" rx="300" ry="30" />
        <ellipse cx="1420" cy="520" rx="200" ry="20" />
      </g>
      {/* Far dry forest, hazy */}
      <path d={canopy(1.3, 872, 46)} fill="#9fae95" opacity=".6" filter="url(#lw-soft)" />
      {/* Mangrove line */}
      <path d={canopy(4.1, 888, 58)} fill="#4a6551" />
      <path d={canopy(9.7, 898, 28)} fill="#3a5242" />
      {/* Water body */}
      <rect y="900" width={WORLD_W} height="1500" fill="url(#lw-water)" />
      {/* Light rays from the surface (drift slowly) */}
      <g className="lw-rays">
        {[180, 420, 700, 960, 1230, 1470].map((x, i) => (
          <polygon key={x} points={`${x - 30},905 ${x + 40},905 ${x + 220 - i * 30},1950 ${x - 120 + i * 10},1950`} fill="url(#lw-ray)" />
        ))}
      </g>
      {/* Suspended particles */}
      <g fill="#e8fbf6" opacity=".35">
        {Array.from({ length: 70 }, (_, i) => (
          <circle key={i} cx={(i * 233) % WORLD_W} cy={1000 + ((i * 397) % 1300)} r={1 + (i % 3)} />
        ))}
      </g>
      {/* Fish & crustaceans: the poster's aquatic food-web links */}
      {fish.map(([y, s, dur, delay], i) => (
        <g key={i} transform={`translate(${i % 2 ? WORLD_W + 80 : -120} ${y})`}>
          <g className={i % 2 ? 'lw-swim-left' : 'lw-swim-right'} style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s` }}>
            <g transform={i % 2 ? undefined : 'scale(-1 1)'}>
              <Fish s={s} />
            </g>
          </g>
        </g>
      ))}
      {/* Lagoon floor */}
      <path d="M0 2350 C200 2330 380 2362 600 2344 C820 2326 1000 2360 1220 2340 C1400 2326 1520 2346 1600 2338 L1600 2700 L0 2700Z" fill="url(#lw-floor)" />
      <g className="lw-grass" stroke="#3e6b55" strokeWidth="5" strokeLinecap="round" fill="none">
        {Array.from({ length: 26 }, (_, i) => {
          const x = 40 + i * 61 + (i % 3) * 9;
          const h = 70 + ((i * 37) % 80);
          return <path key={i} d={`M${x} 2352 q${i % 2 ? 14 : -14} ${-h / 2} ${i % 2 ? -4 : 4} ${-h}`} style={{ animationDelay: `${-(i % 5)}s` }} />;
        })}
      </g>
      <Crab x={520} y={2372} />
      <Crab x={1110} y={2366} />
      <Crab x={1340} y={2380} />

      {/* Mangrove reflection */}
      <g transform="translate(0 1800) scale(1 -1)" opacity=".18">
        <path d={canopy(4.1, 888, 58)} fill="#2c4636" />
      </g>
      {/* Flamingos wading in the shallows, with reflections */}
      {([[250, 1000, 1.05, false], [330, 1012, 0.9, true], [410, 996, 1, false], [1150, 975, 0.7, true], [1205, 980, 0.78, false]] as const).map(([x, y, sc, f], i) => (
        <g key={i}>
          <Flamingo x={x} y={y} s={sc} flip={f} />
          <g transform={`translate(0 ${2 * y}) scale(1 -1)`} opacity=".22">
            <Flamingo x={x} y={y} s={sc} flip={f} />
          </g>
        </g>
      ))}
      {/* Surface: ripples, glitter and the waterline seen from below */}
      <rect y="900" width={WORLD_W} height="200" filter="url(#lw-ripple)" opacity=".55" />
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1={980 + i * 18} x2={1440 - i * 12} y1={918 + i * 14} y2={918 + i * 14} stroke="#fffbe9" strokeOpacity={0.4 - i * 0.04} strokeWidth="2" />
      ))}
      <rect y="900" width={WORLD_W} height="5" fill="#e6f6f2" opacity=".7" />

      {/* Hypothetical fuel film — revealed only in the conceptual beat */}
      <g data-film opacity="0">
        <rect y="886" width={WORLD_W} height="46" fill="#e9b44c" opacity=".92" />
        <rect y="886" width={WORLD_W} height="46" fill="url(#lw-film)" opacity=".55" />
        <rect y="930" width={WORLD_W} height="90" fill="#e9b44c" opacity=".14" />
      </g>
    </svg>
  );
}

/** Foreground reeds at the surface (a separate, faster parallax layer). */
export function LagoonReeds() {
  const blades = (x0: number, n: number, dir: number) =>
    Array.from({ length: n }, (_, i) => {
      const x = x0 + dir * i * 14;
      const h = 160 + ((i * 53) % 140);
      return <path key={i} d={`M${x} 400 q${dir * 18} ${-h / 2} ${dir * (8 + (i % 3) * 10)} ${-h}`} />;
    });
  return (
    <svg viewBox="0 0 1600 400" preserveAspectRatio="xMidYMax slice" className="h-full w-full" aria-hidden>
      <g stroke="#26402f" strokeWidth="7" strokeLinecap="round" fill="none" opacity=".92">
        {blades(10, 14, 1)}
        {blades(1590, 12, -1)}
      </g>
    </svg>
  );
}

/** A flock crossing the sky (moves on its own parallax layer). */
export function Flock() {
  const birds: [number, number, number][] = [
    [0, 0, 1],
    [70, 26, 0.85],
    [-60, 34, 0.9],
    [140, 54, 0.75],
    [-130, 66, 0.8],
    [30, 80, 0.7],
  ];
  return (
    <svg viewBox="-200 -40 420 160" className="h-full w-full" aria-hidden>
      {birds.map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <g className="lw-flap" style={{ animationDelay: `${-i * 0.23}s` }}>
            <path d="M-26 0 q14 -12 26 0 q12 -12 26 0" fill="none" stroke="#c96a75" strokeWidth="4" strokeLinecap="round" />
          </g>
          <path d="M0 0 l14 4" stroke="#c96a75" strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}
