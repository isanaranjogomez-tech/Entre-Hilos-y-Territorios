import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { parseVtt, type Cue } from '@/lib/vtt';

export interface VideoPlayerHandle {
  seek: (t: number) => void;
}

interface Props {
  src: string;
  captions?: string;
  captionsLang?: string;
  poster?: string | null;
  title: string;
  /** Turn the caption track on at start (leave off when subtitles are burned into the video). */
  captionsOn?: boolean;
  onTime?: (t: number) => void;
  onCues?: (cues: Cue[]) => void;
}

/**
 * Screening-room player: native, accessible controls (play/pause, volume,
 * full screen, progress, captions) inside a letterboxed frame, behind a title
 * card until the viewer presses play.
 */
export const VideoPlayer = forwardRef<VideoPlayerHandle, Props>(function VideoPlayer(
  { src, captions, captionsLang = 'en', poster, title, captionsOn = false, onTime, onCues },
  ref,
) {
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!captions || !onCues) return;
    fetch(captions)
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((t) => onCues(parseVtt(t)))
      .catch(() => onCues([]));
  }, [captions, onCues]);

  /** Without a poster image, show a real frame of the interview as the cover. */
  const COVER_FRAME = 12;
  const play = () => {
    setStarted(true);
    const v = video.current!;
    if (!poster && v.currentTime === COVER_FRAME) v.currentTime = 0;
    if (captionsOn && v.textTracks[0]) v.textTracks[0].mode = 'showing';
    v.play().catch(() => undefined);
  };

  useImperativeHandle(ref, () => ({
    seek: (t: number) => {
      const v = video.current;
      if (!v) return;
      v.currentTime = t;
      setStarted(true);
      v.play().catch(() => undefined);
    },
  }));

  return (
    <div className="relative bg-black">
      <video
        ref={video}
        className="block aspect-video w-full bg-black"
        controls={started}
        playsInline
        preload="metadata"
        poster={poster ?? undefined}
        onTimeUpdate={(e) => onTime?.(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          if (!poster && !started) e.currentTarget.currentTime = COVER_FRAME;
        }}
        onPlay={() => setStarted(true)}
        onError={() => setError(true)}
        aria-label={title}
      >
        <source src={src} type="video/mp4" />
        {captions && <track kind="captions" src={captions} srcLang={captionsLang} label="English" default={captionsOn} />}
      </video>

      {!started && (
        <button onClick={play} className="group absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/55 text-center transition-colors duration-700 hover:bg-black/30" aria-label={`Play: ${title}`}>
          <span className="grid h-20 w-20 place-items-center rounded-full border border-ivory/60 transition-all duration-500 group-hover:scale-110 group-hover:border-gold md:h-28 md:w-28">
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-ivory md:h-9 md:w-9" aria-hidden>
              <path d="M7 4.5 19.5 12 7 19.5Z" />
            </svg>
          </span>
          <span className="meta text-ivory/80">Play the interview</span>
        </button>
      )}
      {error && <p className="absolute inset-x-0 top-0 bg-magenta px-4 py-2 text-sm">No se pudo cargar el video. Verifica la ruta en content/english.ts.</p>}
    </div>
  );
});
