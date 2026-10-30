import { useMemo } from 'react';
import type { Day, Pt } from '@/content/physics';
import { asset } from '@/lib/asset';

/** Cumulative-length sampler for a polyline (image pixels). */
export function polyline(points: Pt[]) {
  const cum = [0];
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    cum.push(cum[i - 1] + Math.hypot(x1 - x0, y1 - y0));
  }
  const total = cum[cum.length - 1];
  const at = (f: number) => {
    const d = Math.min(1, Math.max(0, f)) * total;
    let i = 1;
    while (i < cum.length - 1 && cum[i] < d) i++;
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const k = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
    return { x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k, angle: (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI };
  };
  return { total, at, d: points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ') };
}

interface Props {
  day: Day;
  /** 0–1 position of the vehicle along the traced road route. */
  travel: number;
  showVectors: boolean;
  /** 0–1: how closely the view follows the vehicle. */
  follow: number;
  className?: string;
}

/**
 * The day's original Google Maps screenshot with three overlays:
 *  - the road route (traced from the screenshot), revealed as the vehicle drives;
 *  - the vehicle, oriented along the road;
 *  - displacement vectors: straight arrows between the points the students
 *    marked — kept visually distinct from the road route.
 */
export function RouteMap({ day, travel, showVectors, follow, className = '' }: Props) {
  const line = useMemo(() => polyline(day.route), [day.route]);
  const { w, h } = day.map;
  const car = line.at(travel);
  const zoom = 1 + 0.45 * follow;
  const ox = (car.x / w) * 100;
  const oy = (car.y / h) * 100;

  return (
    <div className={`relative overflow-hidden bg-[#a9dce6] ${className}`} style={{ aspectRatio: `${w} / ${h}` }}>
      <div className="absolute inset-0 will-change-transform" style={{ transform: `scale(${zoom})`, transformOrigin: `${ox}% ${oy}%`, transition: 'transform .6s cubic-bezier(.2,.7,.2,1), transform-origin .6s linear' }}>
        <img src={asset(day.map.src)} alt={`Mapa del día ${day.n}: ${day.lead}`} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
        <div className="absolute inset-0 bg-[#0b2230]/25" aria-hidden />
        <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <marker id={`arrow-p-${day.n}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M0 0 L10 5 L0 10Z" fill="#F4EDE2" />
            </marker>
            <marker id={`arrow-r-${day.n}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M0 0 L10 5 L0 10Z" fill="#E3C34B" />
            </marker>
          </defs>
          {/* Road route: full (faint) and travelled (bright) */}
          <path d={line.d} fill="none" stroke="#F4EDE2" strokeOpacity=".45" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d={line.d}
            fill="none"
            stroke="#F4EDE2"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - travel}
          />
          {/* Displacement vectors */}
          <g style={{ opacity: showVectors ? 1 : 0, transition: 'opacity .7s' }}>
            {day.vectors.map((v) => {
              const resultant = v.kind === 'resultante';
              const mx = (v.from[0] + v.to[0]) / 2;
              const my = (v.from[1] + v.to[1]) / 2;
              return (
                <g key={v.label}>
                  <line
                    x1={v.from[0]}
                    y1={v.from[1]}
                    x2={v.to[0]}
                    y2={v.to[1]}
                    stroke={resultant ? '#E3C34B' : '#F4EDE2'}
                    strokeWidth={resultant ? 7 : 5}
                    strokeDasharray={resultant ? undefined : '18 12'}
                    markerEnd={`url(#arrow-${resultant ? 'r' : 'p'}-${day.n})`}
                  />
                  <g transform={`translate(${mx} ${my})`}>
                    <circle r="26" fill="#071822" opacity=".85" />
                    <text textAnchor="middle" dy="10" fontSize="30" fontStyle="italic" fontFamily="Instrument Serif, serif" fill={resultant ? '#E3C34B' : '#F4EDE2'}>
                      {v.label}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
          {/* Start and end */}
          <circle cx={day.route[0][0]} cy={day.route[0][1]} r="14" fill="#071822" stroke="#F4EDE2" strokeWidth="5" />
          <circle cx={day.route[day.route.length - 1][0]} cy={day.route[day.route.length - 1][1]} r="14" fill="#B02A5E" stroke="#F4EDE2" strokeWidth="5" />
          {/* Vehicle: a small top-down van, oriented along the road */}
          <g transform={`translate(${car.x} ${car.y}) rotate(${car.angle})`}>
            <ellipse rx="34" ry="20" fill="#071822" opacity=".25" transform="translate(4 6)" />
            <rect x="-30" y="-16" width="60" height="32" rx="10" fill="#F4EDE2" stroke="#071822" strokeWidth="3" />
            <rect x="8" y="-12" width="16" height="24" rx="4" fill="#143848" />
            <rect x="-24" y="-11" width="10" height="22" rx="3" fill="#143848" opacity=".55" />
          </g>
        </svg>
      </div>
    </div>
  );
}
