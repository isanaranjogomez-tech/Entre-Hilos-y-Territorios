import { useEffect, useRef, useState } from 'react';
import { english } from '@/content/english';
import { asset } from '@/lib/asset';

/** Callers may position the visual (e.g. `absolute inset-0`); otherwise it is relative. */
const box = (className: string) => `${/\b(absolute|fixed|sticky)\b/.test(className) ? '' : 'relative'} overflow-hidden ${className}`;


/**
 * Inglés: a still from the final interview (its own image file, so the plate never
 * depends on the remote video loading), letterboxed like a screening. While
 * `playing`, the interview plays silently over it once it actually has frames.
 */
export function FilmFrame({ className = '', time = 95, playing = false }: { className?: string; time?: number; playing?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const v = video.current;
    if (!v || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (playing) v.play().catch(() => undefined);
    else v.pause();
  }, [playing]);
  return (
    <div className={`${box(className)} bg-black`}>
      <img src={asset(english.video.still)} alt="" aria-hidden width={1280} height={720} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[40%_50%] opacity-85 [filter:sepia(.25)_saturate(.9)_contrast(1.05)]" />
      <video
        ref={video}
        loop
        className={`absolute inset-0 h-full w-full object-cover object-[40%_50%] [filter:sepia(.25)_saturate(.9)_contrast(1.05)] transition-opacity duration-500 ${live ? 'opacity-85' : 'opacity-0'}`}
        src={`${asset(english.video.src)}#t=${time}`}
        preload="none"
        muted
        playsInline
        aria-hidden
        tabIndex={-1}
        onPlaying={() => setLive(true)}
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,.65) 0%, transparent 18%, transparent 78%, rgba(0,0,0,.7) 100%)' }} />
      <div className="grain absolute inset-0" />
    </div>
  );
}
