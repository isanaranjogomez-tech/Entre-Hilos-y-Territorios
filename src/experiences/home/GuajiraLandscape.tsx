/**
 * Illustrated landscape for the entrance: dusk over the Caribbean, a distant
 * headland, layered dunes with rim light, haze between the layers and cardón
 * cactus in the foreground. Layers carry data-depth so the page can move them
 * at different speeds. It is an illustration (labelled on the page); replace it
 * with an original panoramic photograph via `heroPhoto` in HomePage when one exists.
 */
const rnd = (i: number) => {
  const x = Math.sin(i * 91.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
};

function Cardon({ x, y, k }: { x: number; y: number; k: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} fill="#050f15">
      <rect x="-9" y="-170" width="18" height="170" rx="9" />
      <path d="M-9 -90 h-26 a9 9 0 0 1 -9 -9 v-46 a9 9 0 0 1 18 0 v37 h17Z" />
      <path d="M9 -60 h24 a9 9 0 0 0 9 -9 v-58 a9 9 0 0 0 -18 0 v49 h-15Z" />
      {/* warm rim light on the sun side */}
      <rect x="4" y="-166" width="3" height="160" rx="1.5" fill="#d99a52" opacity=".35" />
    </g>
  );
}

function Shrub({ x, y, k }: { x: number; y: number; k: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} stroke="#050f15" strokeWidth="3" strokeLinecap="round" fill="none">
      {Array.from({ length: 9 }, (_, i) => {
        const a = -150 + i * 15;
        const r = 30 + rnd(i + x) * 26;
        return <path key={i} d={`M0 0 q${Math.cos((a * Math.PI) / 180) * r * 0.4} ${-r * 0.5} ${Math.cos((a * Math.PI) / 180) * r} ${Math.sin((a * Math.PI) / 180) * r}`} />;
      })}
    </g>
  );
}

export function GuajiraLandscape({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden>
      <defs>
        <linearGradient id="gl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#040e15" />
          <stop offset="0.38" stopColor="#0f2c3a" />
          <stop offset="0.6" stopColor="#3e4a4c" />
          <stop offset="0.7" stopColor="#8a6a4c" />
          <stop offset="0.76" stopColor="#d79c5e" />
        </linearGradient>
        <radialGradient id="gl-sun" cx="0.62" cy="0.67" r="0.45">
          <stop offset="0" stopColor="#fff0cf" stopOpacity="1" />
          <stop offset=".08" stopColor="#ffd99a" stopOpacity=".85" />
          <stop offset=".3" stopColor="#e3a356" stopOpacity=".35" />
          <stop offset="1" stopColor="#e3a356" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gl-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4d7f80" />
          <stop offset=".5" stopColor="#24505a" />
          <stop offset="1" stopColor="#0f2d38" />
        </linearGradient>
        <linearGradient id="gl-dune-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c08b55" />
          <stop offset="1" stopColor="#6a4a32" />
        </linearGradient>
        <linearGradient id="gl-dune-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8f633c" />
          <stop offset="1" stopColor="#35261c" />
        </linearGradient>
        <linearGradient id="gl-dune-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4c3423" />
          <stop offset="1" stopColor="#140e0b" />
        </linearGradient>
        <linearGradient id="gl-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#120d0a" />
          <stop offset="1" stopColor="#050f15" />
        </linearGradient>
        <linearGradient id="gl-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e7b27a" stopOpacity="0" />
          <stop offset=".5" stopColor="#e7b27a" stopOpacity=".28" />
          <stop offset="1" stopColor="#e7b27a" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="gl-vignette" cx=".5" cy=".55" r=".75">
          <stop offset=".55" stopColor="#040e15" stopOpacity="0" />
          <stop offset="1" stopColor="#040e15" stopOpacity=".75" />
        </radialGradient>
        <filter id="gl-blur-l">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      <rect width="1600" height="1000" fill="url(#gl-sky)" />
      {/* Faint stars in the upper sky */}
      <g fill="#f4ede2">
        {Array.from({ length: 60 }, (_, i) => (
          <circle key={i} cx={rnd(i) * 1600} cy={rnd(i + 99) * 330} r={0.6 + rnd(i + 7) * 1.1} opacity={0.15 + rnd(i + 3) * 0.45} className={i % 4 ? undefined : 'gl-twinkle'} style={{ animationDelay: `${-rnd(i) * 6}s` }} />
        ))}
      </g>

      <g data-depth="0.12">
        <rect width="1600" height="1000" fill="url(#gl-sun)" />
        <circle cx="992" cy="664" r="34" fill="#fff4dc" />
        {/* Cloud bands lit from below */}
        <g filter="url(#gl-blur-l)">
          <ellipse cx="420" cy="520" rx="380" ry="16" fill="#c98a57" opacity=".45" />
          <ellipse cx="1180" cy="560" rx="420" ry="12" fill="#e2a666" opacity=".5" />
          <ellipse cx="860" cy="470" rx="300" ry="10" fill="#9a7058" opacity=".35" />
        </g>
      </g>

      <g data-depth="0.22">
        {/* Distant headland */}
        <path d="M1180 676 C1230 640 1290 632 1340 640 C1390 646 1430 668 1460 676Z" fill="#4c4a4c" opacity=".75" />
        <rect y="672" width="1600" height="72" fill="url(#gl-sea)" />
        {/* Sun glitter path on the water */}
        <g className="gl-glitter">
          {Array.from({ length: 22 }, (_, i) => {
            const y = 676 + i * 3.1;
            const half = 18 + i * 9 + rnd(i) * 24;
            return <line key={i} x1={992 - half} x2={992 + half * (0.6 + rnd(i + 40) * 0.5)} y1={y} y2={y} stroke="#ffe3b0" strokeOpacity={0.55 - i * 0.022} strokeWidth="1.4" strokeDasharray={`${8 + rnd(i) * 30} ${6 + rnd(i + 5) * 22}`} />;
          })}
        </g>
      </g>

      <rect y="640" width="1600" height="120" fill="url(#gl-haze)" />

      <g data-depth="0.38">
        <path d="M0 712 C180 680 330 688 470 702 C640 720 760 682 930 688 C1100 696 1240 718 1400 702 C1500 692 1560 696 1600 700 L1600 820 L0 820Z" fill="url(#gl-dune-far)" />
        <path d="M0 712 C180 680 330 688 470 702 C640 720 760 682 930 688 C1100 696 1240 718 1400 702 C1500 692 1560 696 1600 700" fill="none" stroke="#ffd9a0" strokeOpacity=".45" strokeWidth="2" />
      </g>

      <rect y="700" width="1600" height="110" fill="url(#gl-haze)" opacity=".7" />

      <g data-depth="0.58">
        <path d="M-20 796 C200 740 420 756 620 786 C820 816 980 768 1220 780 C1400 788 1520 806 1620 798 L1620 920 L-20 920Z" fill="url(#gl-dune-mid)" />
        <path d="M620 786 C820 816 980 768 1220 780 C1400 788 1520 806 1620 798" fill="none" stroke="#f3b878" strokeOpacity=".4" strokeWidth="2.5" />
      </g>

      <g data-depth="0.75">
        <path d="M-20 862 C220 822 480 830 700 852 C940 876 1180 832 1620 850 L1620 1000 L-20 1000Z" fill="url(#gl-dune-near)" />
      </g>

      <g data-depth="0.95">
        <path d="M-20 900 C240 866 520 874 760 894 C1000 914 1260 872 1620 888 L1620 1000 L-20 1000Z" fill="url(#gl-ground)" />
        <Shrub x={420} y={904} k={1.1} />
        <Shrub x={1100} y={896} k={0.9} />
        <Cardon x={190} y={900} k={1.25} />
        <Cardon x={255} y={906} k={0.75} />
        <Cardon x={1330} y={888} k={1.4} />
        <Cardon x={1420} y={894} k={0.85} />
      </g>

      {/* Drifting dust in the low light */}
      <g fill="#ffd9a0" className="gl-dust">
        {Array.from({ length: 36 }, (_, i) => (
          <circle key={i} cx={rnd(i + 300) * 1600} cy={560 + rnd(i + 500) * 360} r={0.8 + rnd(i + 700) * 1.6} opacity={0.12 + rnd(i + 900) * 0.3} />
        ))}
      </g>
      <rect width="1600" height="1000" fill="url(#gl-vignette)" />
    </svg>
  );
}
