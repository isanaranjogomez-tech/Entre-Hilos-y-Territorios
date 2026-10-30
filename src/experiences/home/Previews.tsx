import { useEffect, useRef, useState } from 'react';
import { physics } from '@/content/physics';
import { science } from '@/content/science';
import { RouteMap } from '@/experiences/physics/RouteMap';
import { LagoonScene } from '@/experiences/science/LagoonScene';
import { useReducedMotion } from '@/hooks/useMedia';
import { asset } from '@/lib/asset';

/** Física: the day-2 map with the vehicle driving its route on a loop (only while visible). */
export function MapPreview({ active }: { active: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0.35);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) {
      setTravel(1);
      return;
    }
    let raf = 0;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(box.current!);
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (visible) setTravel((t) => (t + dt * (active ? 0.16 : 0.06)) % 1.15);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [active, reduced]);
  return (
    <div ref={box} className="absolute inset-0 flex items-center justify-center bg-[#0b1d27]">
      <RouteMap day={physics.days[1]} travel={Math.min(1, travel)} showVectors={travel > 1} follow={0} className="h-full" />
    </div>
  );
}

/** Ciencias: the illustrated lagoon with one of the team's photographs, at its real size. */
export function LagoonPreview() {
  const p = science.photos[0];
  return (
    <div className="absolute inset-0">
      <LagoonScene className="h-full w-full" />
      <figure className="absolute bottom-5 right-5 w-[min(48%,253px)] shadow-[0_20px_40px_-20px_rgba(20,56,72,.7)]">
        <img src={asset(p.src)} alt={p.alt} width={253} height={112} className="w-full" loading="lazy" />
      </figure>
    </div>
  );
}

/** Lenguaje y Sociales: a closed research book on a warm desk. */
export function BookVisual() {
  return (
    <div className="absolute inset-0 grid place-items-center" style={{ background: 'radial-gradient(ellipse at 50% 40%, #f7f1e6 0%, #eadcc4 100%)' }} aria-hidden>
      <div className="relative h-[68%] w-[46%] min-w-[150px] [perspective:1200px]">
        <div className="absolute inset-0 origin-left shadow-[30px_40px_60px_-30px_rgba(20,56,72,.6)] transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] [transform:rotateY(-18deg)] group-hover:[transform:rotateY(-30deg)]" style={{ background: 'linear-gradient(135deg, #1b4354 0%, #143848 60%, #0e2a36 100%)' }}>
          <span className="absolute inset-y-0 left-0 w-3 bg-black/20" />
          <div className="absolute inset-x-[12%] top-[14%] border-t border-sand/50 pt-3">
            <p className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-sand">Lenguaje y Sociales</p>
            <p className="mt-3 font-display text-[clamp(1.1rem,2vw,1.9rem)] leading-[1.02] text-ivory">
              El atlas <span className="italic">de los</span> argumentos
            </p>
          </div>
          <p className="absolute bottom-[10%] left-[12%] font-mono text-[0.5rem] uppercase tracking-[0.2em] text-ivory/50">Texto argumentativo · 2026</p>
        </div>
        <span className="absolute -right-2 top-[3%] h-[94%] w-2 rounded-r-sm bg-[repeating-linear-gradient(180deg,#f4ede2_0,#f4ede2_2px,#e2d6c2_3px)]" />
      </div>
    </div>
  );
}
