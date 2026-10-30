/**
 * Illustrated lagoon horizon: sky, a low mangrove line, shallow water with
 * slow light ripples. It is an illustration (labelled on the page), never a
 * substitute for the field photographs.
 */
export function LagoonScene({ className = '', mood = 'day' }: { className?: string; mood?: 'day' | 'dusk' }) {
  const sky = mood === 'day' ? ['#e9efe9', '#cfe1dd', '#f1e3c8'] : ['#1b3a47', '#3d6a70', '#d6a874'];
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={`lg-sky-${mood}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="0.55" stopColor={sky[1]} />
          <stop offset="1" stopColor={sky[2]} />
        </linearGradient>
        <linearGradient id={`lg-water-${mood}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mood === 'day' ? '#9cc7c3' : '#2f6b70'} />
          <stop offset="0.45" stopColor={mood === 'day' ? '#5d9fa0' : '#1d4c58'} />
          <stop offset="1" stopColor={mood === 'day' ? '#2e6b77' : '#0e2a36'} />
        </linearGradient>
        <filter id={`lg-ripple-${mood}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.06" numOctaves="2" seed="4">
            <animate attributeName="baseFrequency" dur="18s" values="0.004 0.06;0.005 0.07;0.004 0.06" repeatCount="indefinite" />
          </feTurbulence>
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 -.18" />
        </filter>
      </defs>
      <rect width="1600" height="900" fill={`url(#lg-sky-${mood})`} />
      <radialGradient id={`lg-glow-${mood}`} cx="0.72" cy="0.5" r="0.35">
        <stop offset="0" stopColor="#fff8e6" stopOpacity={mood === 'day' ? 0.75 : 0.45} />
        <stop offset="1" stopColor="#fff8e6" stopOpacity="0" />
      </radialGradient>
      <rect width="1600" height="900" fill={`url(#lg-glow-${mood})`} />
      {/* distant mangrove and dry-forest line */}
      <path d="M0 492 C80 480 140 486 210 478 C300 468 360 484 450 476 C560 466 640 482 760 474 C880 466 980 480 1100 472 C1220 464 1330 480 1450 470 C1520 465 1570 470 1600 468 L1600 512 L0 512Z" fill={mood === 'day' ? '#55705a' : '#24372e'} opacity="0.75" />
      <rect y="505" width="1600" height="395" fill={`url(#lg-water-${mood})`} />
      <rect y="505" width="1600" height="395" filter={`url(#lg-ripple-${mood})`} opacity="0.6" />
      {Array.from({ length: 7 }, (_, i) => (
        <line key={i} x1={880 + i * 20} x2={1480 - i * 14} y1={530 + i * 26} y2={530 + i * 26} stroke="#fffbe9" strokeOpacity={0.28 - i * 0.03} strokeWidth="1.5" />
      ))}
    </svg>
  );
}
