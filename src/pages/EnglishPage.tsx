import { useCallback, useEffect, useRef, useState } from 'react';
import { chapterById, project } from '@/content/project';
import { english } from '@/content/english';
import { SourceList } from '@/components/editorial/SourceList';
import { VideoPlayer, type VideoPlayerHandle } from '@/components/media/VideoPlayer';
import { ResourceShelf } from '@/components/resources/ResourceShelf';
import { useReducedMotion } from '@/hooks/useMedia';
import { asset } from '@/lib/asset';
import { fmtTime, type Cue } from '@/lib/vtt';

const meta = chapterById('ingles');
/** A short, quiet loop from the interview itself, used as the poster's moving image. */
const LOOP = { from: 92, to: 104 };

/** Background loop of the real interview, muted and graded warm. */
function PosterLoop() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = LOOP.from;
    if (!reduced) v.play().catch(() => undefined);
    const onTime = () => v.currentTime >= LOOP.to && (v.currentTime = LOOP.from);
    v.addEventListener('timeupdate', onTime);
    return () => v.removeEventListener('timeupdate', onTime);
  }, [reduced]);
  return (
    <video
      ref={ref}
      src={asset(english.video.src)}
      poster={english.video.poster ? asset(english.video.poster) : undefined}
      muted
      playsInline
      preload="metadata"
      aria-hidden
      tabIndex={-1}
      className="absolute inset-0 h-full w-full object-cover opacity-70 [filter:sepia(.18)_saturate(1.05)_contrast(1.05)]"
    />
  );
}

/**
 * /ingles — a screening room. Opens like a film poster, then the interview
 * itself, large and letterboxed, with its scenes and transcript beside it.
 */
export default function EnglishPage() {
  const player = useRef<VideoPlayerHandle>(null);
  const [time, setTime] = useState(0);
  const [cues, setCues] = useState<Cue[]>([]);
  const [transcript, setTranscript] = useState(false);
  const onCues = useCallback((c: Cue[]) => setCues(c), []);
  const current = [...english.chapters].reverse().find((c) => time >= c.t);

  return (
    <div lang="en" className="bg-[#0e0b09] text-ivory">
      {/* Poster — the whole first screen */}
      <section className="relative h-[100svh] overflow-hidden">
        <PosterLoop />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(14,11,9,.55) 0%, rgba(14,11,9,.05) 30%, rgba(14,11,9,.2) 55%, rgba(14,11,9,.92) 88%, #0e0b09 100%)' }} />
        <div className="gutter relative flex h-full flex-col justify-end pb-[max(3rem,7svh)] pt-[var(--nav-h)] text-center">
          <p className="meta text-sand/85">
            {project.institution} · {meta.subject} · 2026
          </p>
          <h1 className="display-hero mt-5 [text-shadow:0_4px_40px_rgba(0,0,0,.55)]">
            Voices <span className="italic text-sand">of</span> La Guajira
          </h1>
          <p className="mx-auto mt-5 max-w-[40ch] font-display text-xl italic text-ivory/85 md:text-2xl">{english.title}</p>
          <p className="meta mt-6 text-ivory/55">
            Role-play interview · English · {english.video.durationLabel} · Language Arts
          </p>
          <p className="meta mt-8 text-ivory/40">Scroll to the screening ↓</p>
        </div>
      </section>

      {/* Screening */}
      <section aria-label="Interview" className="pb-14 pt-16 md:pb-20 md:pt-20">
        <div className="mx-auto max-w-[1600px] md:px-[var(--gutter)]">
          <VideoPlayer ref={player} src={asset(english.video.src)} captions={asset(english.video.captions)} poster={english.video.poster ? asset(english.video.poster) : null} title={english.title} captionsOn={!english.video.burnedInSubtitles} onTime={setTime} onCues={onCues} />
        </div>

        <div className="mx-auto mt-6 max-w-[1600px] md:px-[var(--gutter)]">
          <nav aria-label="Scenes" className="flex items-stretch gap-2 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] md:px-0">
            {english.chapters.map((c, i) => {
              const on = current === c && time > 0;
              return (
                <button key={c.t} onClick={() => player.current?.seek(c.t)} aria-current={on ? 'true' : undefined} className={`min-w-[11rem] max-w-[15rem] shrink-0 rounded-[3px] border px-4 py-3 text-left transition-colors ${on ? 'border-gold/70 bg-gold/10' : 'border-ivory/12 hover:border-ivory/35'}`}>
                  <span className={`font-mono text-[0.68rem] ${on ? 'text-gold' : 'text-ivory/45'}`}>
                    {String(i + 1).padStart(2, '0')} · {fmtTime(c.t)}
                  </span>
                  <span className={`mt-1 block font-display text-lg leading-tight ${on ? 'text-gold' : 'text-ivory/90'}`}>{c.label}</span>
                </button>
              );
            })}
          </nav>
          {cues.length > 0 && (
            <div className="mt-6 px-[var(--gutter)] md:px-0">
              <button className="btn-text text-ivory/70 hover:text-ivory" aria-expanded={transcript} aria-controls="transcript" onClick={() => setTranscript((s) => !s)}>
                {transcript ? 'Hide transcript' : 'Read the transcript'} <span className="arrow">{transcript ? '↑' : '↓'}</span>
              </button>
              {transcript && (
                <ol id="transcript" className="mt-5 max-h-[55vh] max-w-3xl space-y-1 overflow-y-auto pr-2 text-[1rem]">
                  {cues.map((c) => {
                    const on = time >= c.start && time < c.end;
                    return (
                      <li key={c.start}>
                        <button onClick={() => player.current?.seek(c.start)} className={`grid w-full grid-cols-[3rem_1fr] gap-3 py-1.5 text-left transition-colors ${on ? 'text-gold' : 'text-ivory/70 hover:text-ivory'}`}>
                          <span className="font-mono text-[0.7rem] text-ivory/40">{fmtTime(c.start)}</span>
                          <span>{c.text}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Credits & context */}
      <section aria-labelledby="eng-credits" className="gutter border-t border-ivory/10 py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          <div>
            <h2 id="eng-credits" className="meta text-sand">
              Credits
            </h2>
            <p className="mt-4 font-display text-2xl leading-snug">{english.title}</p>
            <p className="mt-2 text-sm text-ivory/60">{english.format}</p>
          </div>
          <dl className="space-y-4 text-[0.98rem]">
            {english.credits.map((c) => (
              <div key={c.role}>
                <dt className="meta text-ivory/45">{c.role}</dt>
                <dd className="mt-1 text-ivory/85">{c.names}</dd>
              </div>
            ))}
          </dl>
          <p className="text-[0.98rem] leading-relaxed text-ivory/75">{english.roleplayNote}</p>
        </div>
      </section>

      <ResourceShelf
        lang="en"
        tone="dark"
        entries={[
          {
            title: english.title,
            type: `Original interview · MP4 · 1080p · ${english.video.durationLabel}`,
            src: asset(english.video.src),
            kind: 'video',
            fileName: 'Discovering-the-Wayuu-Culture.mp4',
            thumb: null,
          },
        ]}
      >
        <a href={asset(english.video.captions)} download="Discovering-the-Wayuu-Culture.en.vtt" className="btn-text text-ivory/70 hover:text-ivory">
          English subtitle file (WebVTT, from the original .srt) <span className="arrow">↓</span>
        </a>
        <div className="mt-14">
          <SourceList lang="en" title="Red Textual · Language Arts" note="Resources proposed by the school for this product." sources={english.proposedResources} />
        </div>
      </ResourceShelf>
    </div>
  );
}
