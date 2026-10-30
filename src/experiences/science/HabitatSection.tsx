import { useEffect, useRef, useState } from 'react';
import { science } from '@/content/science';

/**
 * Cross-section of the lagoon, one zone per row of the poster's table:
 * birds above the wetland, the water column, fish & crustaceans within it.
 * The active row (by scroll) lights its zone. Diagrammatic — no species
 * observations are implied.
 */
function CrossSection({ active }: { active: number }) {
  const on = (i: number) => (active === i ? 1 : 0.28);
  return (
    <svg viewBox="0 0 600 640" className="h-full w-full" role="img" aria-label="Diagram of the lagoon: air and birds above, lagoon water and wetland, fish and crustaceans in the water column.">
      <defs>
        <linearGradient id="hab-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fb7b4" />
          <stop offset="1" stopColor="#1f5563" />
        </linearGradient>
      </defs>
      {/* air · waterbirds (row 2) */}
      <g style={{ opacity: on(2), transition: 'opacity .8s' }}>
        <rect width="600" height="230" fill="#efe9dc" />
        {[[150, 120], [210, 96], [262, 130], [390, 84], [440, 112]].map(([x, y], i) => (
          <path key={i} d={`M${x - 18} ${y} q18 -14 18 0 q0 -14 18 0`} fill="none" stroke="#143848" strokeWidth="2.4" strokeLinecap="round" />
        ))}
        <text x="32" y="44" fontFamily="IBM Plex Mono, monospace" fontSize="13" letterSpacing="2" fill="#143848">FLAMINGOS & WATERBIRDS</text>
      </g>
      {/* lagoon water & wetland (row 0) */}
      <g style={{ opacity: on(0), transition: 'opacity .8s' }}>
        <path d="M0 230 C70 220 120 236 190 228 L190 250 L0 250Z" fill="#6c8a63" />
        <path d="M420 228 C480 220 540 234 600 226 L600 250 L420 250Z" fill="#6c8a63" />
        <rect y="244" width="600" height="300" fill="url(#hab-water)" />
        <text x="32" y="284" fontFamily="IBM Plex Mono, monospace" fontSize="13" letterSpacing="2" fill="#f4ede2">LAGOON WATER & WETLAND HABITAT</text>
      </g>
      {/* fish & crustaceans (row 1) */}
      <g style={{ opacity: on(1), transition: 'opacity .8s' }}>
        {[[180, 380], [300, 420], [420, 365], [250, 470]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} q22 -12 44 0 q-22 12 -44 0 Z M${x + 44} ${y} l12 -8 v16 z`} fill="#f4ede2" opacity="0.9" />
        ))}
        <path d="M120 528 q10 -14 22 0 M134 520 v-10 M128 524 l-8 -6 M140 524 l8 -6" stroke="#e3c34b" strokeWidth="2.4" fill="none" />
        <path d="M470 532 q10 -14 22 0 M484 524 v-10 M478 528 l-8 -6 M490 528 l8 -6" stroke="#e3c34b" strokeWidth="2.4" fill="none" />
        <text x="32" y="512" fontFamily="IBM Plex Mono, monospace" fontSize="13" letterSpacing="2" fill="#f4ede2">FISH & CRUSTACEANS</text>
      </g>
      <rect y="544" width="600" height="96" fill="#b99a72" />
      <text x="32" y="600" fontFamily="IBM Plex Mono, monospace" fontSize="11" letterSpacing="2" fill="#143848" opacity=".6">
        ILLUSTRATIVE CROSS-SECTION
      </text>
    </svg>
  );
}

export function HabitatSection() {
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))), { rootMargin: '-45% 0px -50% 0px' });
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="habitat-title" className="gutter relative bg-[#eef3ef] py-24 text-navy md:py-32">
      <div className="mb-16 max-w-3xl">
        <p className="meta text-turquoise">02 · A living habitat</p>
        <h2 id="habitat-title" className="display-lg mt-4">
          Results: Biology & ecological evidence
        </h2>
        <p className="mt-6 leading-relaxed text-navy/75">{science.place}</p>
        <p className="mt-4 border-l-2 border-magenta pl-4 leading-relaxed text-navy/85">{science.challenge}</p>
      </div>
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-20">
        <div className="md:sticky md:top-[calc(var(--nav-h)+5vh)] md:h-[78vh]">
          <div className="mx-auto aspect-[15/16] w-full max-w-[560px] overflow-hidden shadow-[0_40px_80px_-50px_rgba(20,56,72,.6)]">
            <CrossSection active={active} />
          </div>
        </div>
        <ol>
          {science.habitat.map((r, i) => (
            <li key={r.element} data-i={i} ref={(el) => (rows.current[i] = el)} className="flex min-h-[56vh] flex-col justify-center border-t border-navy/10 py-12">
              <p className="meta text-turquoise">Natural element</p>
              <h3 className="display-md mt-3">{r.element}</h3>
              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="meta text-navy/50">Ecological role</p>
                  <p className="mt-2 text-lg leading-snug">{r.role}</p>
                </div>
                <div>
                  <p className="meta text-magenta">Threat / action</p>
                  <p className="mt-2 text-lg leading-snug">{r.threat}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
