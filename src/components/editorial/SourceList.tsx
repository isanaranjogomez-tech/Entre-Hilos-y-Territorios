import type { SourceRef } from '@/content/types';

interface Props {
  lang?: 'es' | 'en';
  title: string;
  note?: string;
  sources: SourceRef[];
  tone?: 'dark' | 'light';
}

export function SourceList({ title, note, sources, tone = 'dark', lang = 'es' }: Props) {
  const word = lang === 'en' ? ['Show', 'Hide'] : ['Ver', 'Ocultar'];
  const muted = tone === 'dark' ? 'text-ivory/55' : 'text-navy/55';
  const rule = tone === 'dark' ? 'border-ivory/12' : 'border-navy/15';
  return (
    <details aria-label={title} className="group grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] md:gap-12">
      <summary className="flex cursor-pointer list-none flex-wrap items-baseline justify-between gap-x-6 gap-y-2 md:col-span-2 [&::-webkit-details-marker]:hidden">
        <span>
          <h3 className="meta inline">{title}</h3>
          <span className={`meta ml-3 ${muted}`}>· {sources.length}</span>
          {note && <span className={`mt-2 block text-sm leading-relaxed ${muted}`}>{note}</span>}
        </span>
        <span className={`btn-text ${muted}`}>
          <span className="group-open:hidden">{word[0]}</span>
          <span className="hidden group-open:inline">{word[1]}</span> <span className="arrow transition-transform group-open:rotate-180">↓</span>
        </span>
      </summary>
      <ol className={`md:col-start-2 divide-y ${tone === 'dark' ? 'divide-ivory/12' : 'divide-navy/15'} border-y ${rule}`}>
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
    </details>
  );
}
