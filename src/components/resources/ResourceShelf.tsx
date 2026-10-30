import { useState, type ReactNode } from 'react';
import { DocumentViewer, type ViewerItem } from '@/components/media/DocumentViewer';
import { ui, type Lang } from '@/lib/i18n';

export interface ResourceEntry {
  title: string;
  /** e.g. "Infografía · PNG", "Poster · PNG", "Presentación · PDF · 12 páginas". */
  type: string;
  /** Resolved URL, or null when the file has not been delivered. */
  src: string | null;
  /** 'file' = download only (e.g. .docx, which browsers cannot preview). */
  kind: ViewerItem['kind'] | 'file';
  fileName?: string;
  /** Small preview image (resolved URL). For PDFs/videos, any representative still. */
  thumb?: string | null;
  alt?: string;
  /** Shown instead of the actions while pending. */
  pendingNote?: string;
}

interface Props {
  lang: Lang;
  entries: ResourceEntry[];
  tone?: 'light' | 'dark';
  /** Optional block under the shelf (e.g. references). */
  children?: ReactNode;
}

/**
 * The compact appendix every chapter ends with: a small original thumbnail,
 * title, file type and one action. The file opens in a full-screen viewer.
 */
export function ResourceShelf({ lang, entries, tone = 'light', children }: Props) {
  const t = ui[lang];
  const [open, setOpen] = useState<number | null>(null);
  const ink = tone === 'light' ? 'text-navy' : 'text-ivory';
  const muted = tone === 'light' ? 'text-navy/50' : 'text-ivory/50';
  const rule = tone === 'light' ? 'border-navy/15' : 'border-ivory/15';
  const current = open === null ? null : entries[open];

  return (
    <section aria-labelledby="recursos-title" lang={lang} className={`gutter border-t ${rule} py-16 md:py-20 ${ink}`}>
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] md:gap-16">
        <h2 id="recursos-title" className="meta">
          {t.resources}
        </h2>
        <ul className={`divide-y ${tone === 'light' ? 'divide-navy/10' : 'divide-ivory/10'}`}>
          {entries.map((e, i) => (
            <li key={e.title} className="first:pt-0">
              <div className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-5 py-4 md:grid-cols-[5.5rem_1fr_auto]">
                <button
                  onClick={() => e.src && e.kind !== 'file' && setOpen(i)}
                  disabled={!e.src || e.kind === 'file'}
                  className={`group relative aspect-[3/4] w-full overflow-hidden ${tone === 'light' ? 'bg-navy/5' : 'bg-ivory/5'} ${e.src && e.kind !== 'file' ? 'cursor-zoom-in' : 'cursor-default'}`}
                  aria-label={e.src && e.kind !== 'file' ? `${t.open}: ${e.title}` : e.title}
                  tabIndex={e.src && e.kind !== 'file' ? 0 : -1}
                >
                  {e.thumb ? (
                    <img src={e.thumb} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <span className={`absolute inset-0 grid place-items-center font-mono text-[0.6rem] uppercase ${muted}`}>{e.kind === 'file' ? (e.fileName?.split('.').pop() ?? 'file') : e.kind}</span>
                  )}
                </button>
                <div>
                  <p className="font-display text-xl leading-tight md:text-2xl">{e.title}</p>
                  <p className={`meta mt-1 ${muted}`}>{e.src ? e.type : `${t.pending} · ${e.pendingNote ?? e.type}`}</p>
                </div>
                {e.src && e.kind === 'file' && (
                  <a href={e.src} download={e.fileName ?? true} className={`btn-text ${tone === 'light' ? 'text-navy/70 hover:text-navy' : 'text-ivory/70 hover:text-ivory'}`}>
                    {t.download} <span className="arrow">↓</span>
                  </a>
                )}
                {e.src && e.kind !== 'file' && (
                  <button onClick={() => setOpen(i)} className={`btn-text ${tone === 'light' ? 'text-navy/70 hover:text-navy' : 'text-ivory/70 hover:text-ivory'}`}>
                    {t.open} <span className="arrow">→</span>
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {children && <div className="mt-14">{children}</div>}
      {current?.src && current.kind !== 'file' && (
        <DocumentViewer lang={lang} open item={{ title: current.title, src: current.src, kind: current.kind, fileName: current.fileName, alt: current.alt }} onClose={() => setOpen(null)} />
      )}
    </section>
  );
}
