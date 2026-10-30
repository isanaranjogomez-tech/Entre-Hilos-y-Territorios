import { useEffect, useRef } from 'react';
import { english } from '@/content/english';
import { asset } from '@/lib/asset';

/** Callers may position the visual (e.g. `absolute inset-0`); otherwise it is relative. */
const box = (className: string) => `${/\b(absolute|fixed|sticky)\b/.test(className) ? '' : 'relative'} overflow-hidden ${className}`;


/** Inglés: a still from the actual interview, letterboxed like a screening; plays silently while `playing`. */
export function FilmFrame({ className = '', time = 95, playing = false }: { className?: string; time?: number; playing?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = video.current;
    if (!v || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (playing) v.play().catch(() => undefined);
    else v.pause();
  }, [playing]);
  return (
    <div className={`${box(className)} bg-black`}>
      <video ref={video} loop className="absolute inset-0 h-full w-full object-cover opacity-85 [filter:sepia(.25)_saturate(.9)_contrast(1.05)]" src={`${asset(english.video.src)}#t=${time}`} preload="metadata" muted playsInline aria-hidden tabIndex={-1} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,.65) 0%, transparent 18%, transparent 78%, rgba(0,0,0,.7) 100%)' }} />
      <div className="grain absolute inset-0" />
    </div>
  );
}
