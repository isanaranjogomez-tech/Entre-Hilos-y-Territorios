import { Html } from '@react-three/drei';
import { useMemo } from 'react';
import { anchors, surfacePoint } from './textile';
import type { StageLabel } from './stages';

/**
 * Labels pinned to model-space points on the textile. They live inside the
 * model's group, so they rotate and move with it; drei projects them every
 * frame with the same camera (including its view offset).
 */
export function GeometryAnnotations({ labels, visible }: { labels: StageLabel[]; visible: boolean }) {
  const placed = useMemo(
    () =>
      labels.map((l) => {
        const a = anchors[l.anchor]();
        return { ...l, pos: surfacePoint(a.x, a.y, 0.03).toArray() as [number, number, number] };
      }),
    [labels],
  );
  return (
    <>
      {placed.map((l) => (
        <Html key={l.anchor} position={l.pos} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <span
            className={`flex items-center gap-2 whitespace-nowrap rounded-full bg-ink/85 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ivory shadow-lg backdrop-blur transition-all duration-500 ${visible ? '-translate-y-5 opacity-100' : '-translate-y-2 opacity-0'}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            {l.text}
          </span>
        </Html>
      ))}
    </>
  );
}
