import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Day } from '@/content/physics';
import { asset } from '@/lib/asset';
import { polyline } from './RouteMap';

export interface Camera {
  /** 0–1: overview of the route (0) ↔ close follow of the vehicle (1). */
  follow: number;
  /** 0–1: how much of the displacement vectors is drawn. */
  vectors: number;
}

interface Props {
  day: Day;
  /** 0–1 position of the vehicle along the traced road route. */
  travel: number;
  camera: Camera;
  /** Area kept clear for the data panel, in px: right (desktop) or bottom (phone). */
  inset: { right: number; bottom: number };
  showVectors: boolean;
}

const FOLLOW_ZOOM = 2.3;
/** Constant on-screen size of the vehicle (px). */
const CAR_PX = 46;

/**
 * Full-bleed map stage with a camera. The map plane (the day's Google Maps
 * screenshot + overlays, in image pixels) is moved with translate/scale:
 * overview = the whole route framed in the free area; follow = close on the
 * vehicle. The road route is drawn as the vehicle drives; the displacement
 * vectors (straight arrows the students marked) draw on afterwards, in a
 * different style, so they are never confused with the road.
 */
export function JourneyMap({ day, travel, camera, inset, showVectors }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = box.current!;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const line = useMemo(() => polyline(day.route), [day.route]);
  const bbox = useMemo(() => {
    const pts = [...day.route, ...day.vectors.flatMap((v) => [v.from, v.to])];
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const pad = 90;
    return { x0: Math.min(...xs) - pad, y0: Math.min(...ys) - pad, x1: Math.max(...xs) + pad, y1: Math.max(...ys) + pad };
  }, [day]);

  const { w: W, h: H } = day.map;
  const car = line.at(travel);

  // Free area (where the map should be framed) and its centre.
  const fw = Math.max(1, size.w - inset.right - 32);
  const fh = Math.max(1, size.h - inset.bottom - 32);
  const cx = 16 + fw / 2;
  const cy = 16 + fh / 2 + 24;
  // Overview scale fits the route; never smaller than what covers the stage height.
  const sOverview = Math.min(fw / (bbox.x1 - bbox.x0), fh / (bbox.y1 - bbox.y0));
  const sFollow = sOverview * FOLLOW_ZOOM;
  const f = camera.follow;
  const s = sOverview * Math.pow(sFollow / sOverview, f);
  const fx = (bbox.x0 + bbox.x1) / 2 + (car.x - (bbox.x0 + bbox.x1) / 2) * f;
  const fy = (bbox.y0 + bbox.y1) / 2 + (car.y - (bbox.y0 + bbox.y1) / 2) * f;
  const tx = cx - s * fx;
  const ty = cy - s * fy;
  const k = 1 / s; // image px per screen px
  const v = showVectors ? camera.vectors : 0;
  const draw = (i: number, n: number) => Math.min(1, Math.max(0, v * n - i));

  return (
    <div ref={box} className="absolute inset-0 overflow-hidden bg-[#0b1d27]">
      {/* Ambient: the same map, blurred, so the frame never shows empty edges */}
      <img src={asset(day.map.src)} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-2xl" />
      <div
        className="absolute left-0 top-0 origin-top-left will-change-transform"
        style={{ width: W, height: H, transform: `translate3d(${tx}px, ${ty}px, 0) scale(${s})` }}
      >
        <img src={asset(day.map.src)} alt={`Mapa del día ${day.n}: ${day.lead}`} width={W} height={H} className="absolute inset-0 h-full w-full shadow-[0_40px_120px_rgba(0,0,0,.6)]" draggable={false} />
        <div className="absolute inset-0 bg-[#0b2230]/20" aria-hidden />
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <defs>
            <marker id={`jm-p-${day.n}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">
              <path d="M0 0 L10 5 L0 10Z" fill="#F4EDE2" />
            </marker>
            <marker id={`jm-r-${day.n}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">
              <path d="M0 0 L10 5 L0 10Z" fill="#E3C34B" />
            </marker>
          </defs>
          {/* Road route: dark casing + faint full trace + bright travelled part */}
          <path d={line.d} fill="none" stroke="#071822" strokeOpacity=".55" strokeWidth={15 * k} strokeLinecap="round" strokeLinejoin="round" />
          <path d={line.d} fill="none" stroke="#F4EDE2" strokeOpacity=".3" strokeWidth={8 * k} strokeLinecap="round" strokeLinejoin="round" />
          <path d={line.d} fill="none" stroke="#F4EDE2" strokeWidth={8 * k} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - travel} />

          {/* Displacement vectors: straight, dashed partials and solid gold resultant, drawn on in order */}
          {day.vectors.map((vec, i) => {
            const p = draw(i, day.vectors.length);
            if (p <= 0) return null;
            const resultant = vec.kind === 'resultante';
            const ex = vec.from[0] + (vec.to[0] - vec.from[0]) * p;
            const ey = vec.from[1] + (vec.to[1] - vec.from[1]) * p;
            const mx = (vec.from[0] + vec.to[0]) / 2;
            const my = (vec.from[1] + vec.to[1]) / 2;
            return (
              <g key={vec.label}>
                <line x1={vec.from[0]} y1={vec.from[1]} x2={ex} y2={ey} stroke="#071822" strokeOpacity=".5" strokeWidth={(resultant ? 9 : 7) * k} />
                <line
                  x1={vec.from[0]}
                  y1={vec.from[1]}
                  x2={ex}
                  y2={ey}
                  stroke={resultant ? '#E3C34B' : '#F4EDE2'}
                  strokeWidth={(resultant ? 5 : 3.5) * k}
                  strokeDasharray={resultant ? undefined : `${14 * k} ${9 * k}`}
                  markerEnd={p >= 1 ? `url(#jm-${resultant ? 'r' : 'p'}-${day.n})` : undefined}
                />
                {p >= 1 && (
                  <g transform={`translate(${mx} ${my}) scale(${k})`}>
                    <circle r="17" fill="#071822" opacity=".9" />
                    <text textAnchor="middle" dy="7" fontSize="21" fontStyle="italic" fontFamily="Instrument Serif, serif" fill={resultant ? '#E3C34B' : '#F4EDE2'}>
                      {vec.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Start / end pins */}
          <g transform={`translate(${day.route[0][0]} ${day.route[0][1]}) scale(${k})`}>
            <circle r="9" fill="#071822" stroke="#F4EDE2" strokeWidth="3.5" />
          </g>
          <g transform={`translate(${day.route[day.route.length - 1][0]} ${day.route[day.route.length - 1][1]}) scale(${k})`}>
            <circle r="9" fill="#B02A5E" stroke="#F4EDE2" strokeWidth="3.5" />
          </g>

          {/* Vehicle: constant on-screen size, halo, oriented along the road */}
          <g transform={`translate(${car.x} ${car.y}) scale(${k * (CAR_PX / 60)}) rotate(${car.angle})`}>
            <circle r="46" fill="#E3C34B" opacity=".18" className="jm-halo" />
            <ellipse rx="34" ry="20" fill="#071822" opacity=".35" transform="translate(4 7)" />
            <rect x="-30" y="-16" width="60" height="32" rx="10" fill="#F4EDE2" stroke="#071822" strokeWidth="3" />
            <rect x="8" y="-12" width="16" height="24" rx="4" fill="#143848" />
            <rect x="-24" y="-11" width="10" height="22" rx="3" fill="#143848" opacity=".55" />
            <rect x="-30" y="-3" width="60" height="6" fill="#B02A5E" opacity=".85" />
          </g>
        </svg>
      </div>
    </div>
  );
}
