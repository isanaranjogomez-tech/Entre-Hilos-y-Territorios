/**
 * Provisional illustrated landscape for the entrance: dusk over the
 * Caribbean, dunes, a salt-flat glint and cardón cactus silhouettes. Layers
 * carry data-depth so the page can move them at different speeds. It is an
 * illustration (labelled on the page); replace it with an original panoramic
 * photograph via `heroPhoto` in HomePage when one exists.
 */
export function GuajiraLandscape({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden>
      <defs>
        <linearGradient id="gl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#06141c" />
          <stop offset="0.45" stopColor="#143848" />
          <stop offset="0.72" stopColor="#5f5a52" />
          <stop offset="0.86" stopColor="#c99a62" />
        </linearGradient>
        <radialGradient id="gl-sun" cx="0.62" cy="0.66" r="0.32">
          <stop offset="0" stopColor="#ffe7b8" stopOpacity=".95" />
          <stop offset=".2" stopColor="#e3c34b" stopOpacity=".45" />
          <stop offset="1" stopColor="#e3c34b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gl-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b7f86" />
          <stop offset="1" stopColor="#123643" />
        </linearGradient>
        <linearGradient id="gl-dune-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b98a57" />
          <stop offset="1" stopColor="#6e4f35" />
        </linearGradient>
        <linearGradient id="gl-dune-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8c6440" />
          <stop offset="1" stopColor="#3a2a20" />
        </linearGradient>
        <linearGradient id="gl-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2019" />
          <stop offset="1" stopColor="#071822" />
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#gl-sky)" />
      <g data-depth="0.15">
        <rect width="1600" height="1000" fill="url(#gl-sun)">
          <animate attributeName="opacity" values=".9;1;.9" dur="12s" repeatCount="indefinite" />
        </rect>
        <circle cx="992" cy="652" r="30" fill="#fff1d2" opacity=".9" />
      </g>
      <g data-depth="0.25">
        <rect y="660" width="1600" height="80" fill="url(#gl-sea)" />
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={860 + i * 18} x2={1180 - i * 14} y1={672 + i * 10} y2={672 + i * 10} stroke="#ffe7b8" strokeOpacity={0.35 - i * 0.05} strokeWidth="1.5" />
        ))}
      </g>
      <g data-depth="0.4">
        <path d="M0 700 C180 668 330 676 470 690 C640 708 760 670 930 676 C1100 684 1240 706 1400 690 C1500 680 1560 684 1600 688 L1600 800 L0 800Z" fill="url(#gl-dune-far)" />
        <path d="M520 716 C620 706 720 712 820 720" stroke="#f4ede2" strokeOpacity=".35" strokeWidth="2" fill="none" />
      </g>
      <g data-depth="0.6">
        <path d="M-20 790 C200 730 420 748 620 780 C820 812 980 760 1220 772 C1400 780 1520 800 1620 790 L1620 900 L-20 900Z" fill="url(#gl-dune-mid)" />
      </g>
      <g data-depth="0.9">
        <path d="M-20 880 C240 838 520 846 760 870 C1000 894 1260 846 1620 864 L1620 1000 L-20 1000Z" fill="url(#gl-ground)" />
        {/* Cardón cactus silhouettes */}
        {[
          [190, 870, 1.15],
          [252, 874, 0.7],
          [1330, 860, 1.3],
          [1418, 866, 0.8],
        ].map(([x, y, k], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${k})`} fill="#071822">
            <rect x="-9" y="-170" width="18" height="170" rx="9" />
            <path d="M-9 -90 h-26 a9 9 0 0 1 -9 -9 v-46 a9 9 0 0 1 18 0 v37 h17Z" />
            <path d="M9 -60 h24 a9 9 0 0 0 9 -9 v-58 a9 9 0 0 0 -18 0 v49 h-15Z" />
          </g>
        ))}
      </g>
    </svg>
  );
}
