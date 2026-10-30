import { english } from '@/content/english';
import { asset } from '@/lib/asset';

/** Callers may position the visual (e.g. `absolute inset-0`); otherwise it is relative. */
const box = (className: string) => `${/\b(absolute|fixed|sticky)\b/.test(className) ? '' : 'relative'} overflow-hidden ${className}`;


/** Inglés: a still from the actual interview, letterboxed like a screening. */
export function FilmFrame({ className = '', time = 95 }: { className?: string; time?: number }) {
  return (
    <div className={`${box(className)} bg-black`}>
      <video className="absolute inset-0 h-full w-full object-cover opacity-85 [filter:sepia(.25)_saturate(.9)_contrast(1.05)]" src={`${asset(english.video.src)}#t=${time}`} preload="metadata" muted playsInline aria-hidden tabIndex={-1} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,.65) 0%, transparent 18%, transparent 78%, rgba(0,0,0,.7) 100%)' }} />
      <div className="grain absolute inset-0" />
    </div>
  );
}
