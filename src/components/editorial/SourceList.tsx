import type { SourceRef } from '@/content/types';

interface Props {
  title: string;
  note?: string;
  sources: SourceRef[];
  tone?: 'dark' | 'light';
}

export function SourceList({ title, note, sources, tone = 'dark' }: Props) {
  const muted = tone === 'dark' ? 'text-ivory/55' : 'text-navy/55';
  const rule = tone === 'dark' ? 'border-ivory/12' : 'border-navy/15';
  return (
    <section aria-label={title} className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] md:gap-12">
      <div>
        <h3 className="meta">{title}</h3>
        {note && <p className={`mt-3 text-sm leading-relaxed ${muted}`}>{note}</p>}
      </div>
      <ol className={`divide-y ${tone === 'dark' ? 'divide-ivory/12' : 'divide-navy/15'} border-y ${rule}`}>
        {sources.map((s, i) => (
          <li key={s.label} className="grid grid-cols-[2.2rem_1fr] gap-2 py-4 text-sm leading-relaxed">
            <span className={`font-mono text-xs ${muted}`}>{String(i + 1).padStart(2, '0')}</span>
            <div>
              {s.url ? (
                <a href={s.url} target="_blank" rel="noreferrer" className="link-underline">
                  {s.label}
                  <span aria-hidden className="ml-1 text-xs">↗</span>
                </a>
              ) : (
                <span>{s.label}</span>
              )}
              <p className={`mt-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] ${muted}`}>{s.provenance}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
