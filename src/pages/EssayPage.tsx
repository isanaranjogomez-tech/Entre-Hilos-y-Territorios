import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { chapterById, project } from '@/content/project';
import { essay, type Figure } from '@/content/essay';
import { PendingSlot } from '@/components/editorial/PendingSlot';
import { ResourceShelf } from '@/components/resources/ResourceShelf';
import { EssayBook, EssayFigure } from '@/experiences/essay/EssayBook';
import { SourceList } from '@/components/editorial/SourceList';
import { asset } from '@/lib/asset';
import { isAvailable } from '@/content/publication';

const meta = chapterById('lenguaje-sociales');

function ReadingBlock({ heading, paragraphs, figures, sub }: { heading: string; paragraphs: string[]; figures?: Figure[]; sub?: boolean }) {
  return (
    <section className={sub ? 'mt-8' : 'mt-12'}>
      <h3 className={sub ? 'meta text-magenta' : 'font-display text-3xl leading-tight'}>{heading}</h3>
      {paragraphs.map((p, k) => (
        <p key={k} className="mt-4">
          {p}
        </p>
      ))}
      {figures?.map((f) => (
        <EssayFigure key={f.src} f={f} />
      ))}
    </section>
  );
}

function ReadingMode({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseRef.current();
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);
  if (!open) return null;
  const complete = essay.thesis && essay.arguments.every(Boolean) && essay.conclusion;
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Ensayo completo" className="fixed inset-0 z-[80] overflow-y-auto bg-[#f7f1e6] text-navy">
      <div className="sticky top-0 flex items-center justify-between bg-[#f7f1e6]/95 px-[var(--gutter)] py-4 backdrop-blur">
        <p className="meta text-navy/55">Modo de lectura</p>
        <button ref={closeRef} onClick={onClose} className="meta">
          Cerrar ✕
        </button>
      </div>
      <article className="mx-auto max-w-[66ch] px-5 pb-24 pt-10 text-[1.12rem] leading-[1.8]">
        {complete ? (
          <>
            <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-tight">{essay.title}</h1>
            {essay.authors && <p className="mt-3 text-sm text-navy/60">Escrito por: {essay.authors.join(', ')}</p>}
            <p className="mt-8 border-l-2 border-magenta/50 pl-4 italic text-navy/75">{essay.question}</p>
            <ReadingBlock heading="Introducción" paragraphs={essay.introduction ?? []} />
            <p className="mt-6 font-semibold">{essay.thesis}</p>
            <h2 className="mt-14 font-display text-3xl">El marco ambiental</h2>
            {essay.environment.map((sec) => (
              <ReadingBlock key={sec.heading} sub heading={sec.heading} paragraphs={sec.paragraphs} figures={sec.figures} />
            ))}
            <h2 className="mt-14 font-display text-3xl">El ámbito social</h2>
            {essay.society.map((sec) => (
              <ReadingBlock key={sec.heading} sub heading={sec.heading} paragraphs={sec.paragraphs} figures={sec.figures} />
            ))}
            {essay.arguments.map((a) => (
              <ReadingBlock key={a!.title} heading={a!.title} paragraphs={a!.paragraphs} figures={a!.figures} />
            ))}
            <ReadingBlock heading="Conclusión" paragraphs={essay.conclusion!} />
            {essay.bibliography && (
              <section className="mt-14 border-t border-navy/15 pt-6 text-sm">
                <h2 className="meta mb-4">Bibliografía</h2>
                <ol className="space-y-2">
                  {essay.bibliography.map((b) => (
                    <li key={b} className="break-words pl-6 -indent-6">
                      {b}
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </>
        ) : (
          <PendingSlot tone="light" label="Texto argumentativo completo" field="essay.ts">
            El modo de lectura mostrará el ensayo tal como fue entregado —tesis, tres argumentos, conclusión, citas y bibliografía— sin reescritura.
          </PendingSlot>
        )}
      </article>
    </div>,
    document.body,
  );
}

/** /lenguaje-sociales — "El atlas de los argumentos": a living research book. */
export default function EssayPage() {
  const [reading, setReading] = useState(false);
  return (
    <div lang="es" className="bg-[#f3ebdd] text-navy">
      {/* Masthead */}
      <section className="gutter flex min-h-[78svh] flex-col justify-between pb-12 pt-32">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-navy/20 pb-4">
          <p className="meta text-magenta">
            Capítulo {meta.numeral} · {meta.subject}
          </p>
          <p className="meta text-navy/50">{project.program} · Texto argumentativo</p>
        </div>
        <h1 className="display-hero my-12 max-w-[12ch]">
          El atlas <span className="italic text-magenta">de los</span> argumentos
        </h1>
        <div className="grid gap-8 border-t border-navy/20 pt-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] md:items-end">
          <p className="max-w-[36ch] leading-relaxed text-navy/70">Un libro de investigación: introducción, tesis, el marco ambiental y social, tres argumentos con sus fuentes, conclusión y bibliografía.</p>
          <p className="font-display text-xl italic leading-snug text-navy/60">{essay.title ?? 'Título del ensayo — pendiente de integración'}</p>
          <button onClick={() => setReading(true)} className="btn-pill w-fit border-navy/30 hover:border-navy">
            Leer ensayo completo
          </button>
        </div>
      </section>

      <EssayBook />

      <ResourceShelf
        lang="es"
        entries={[
          {
            title: essay.title ?? 'Texto argumentativo',
            type: 'Documento original · DOCX · descarga',
            src: essay.file && isAvailable(essay.file) ? asset(essay.file) : null,
            kind: 'file',
            fileName: 'Ensayo Guajira - Entrega final.docx',
            pendingNote: essay.file ? 'archivo original reservado para la versión pública (conserva comentarios de revisión)' : 'el archivo se integrará en content/essay.ts → file',
          },
        ]}
      >
        <button onClick={() => setReading(true)} className="btn-text text-navy hover:text-magenta">
          Abrir el modo de lectura <span className="arrow">→</span>
        </button>
        <div className="mt-14">
          <SourceList tone="light" title="Red Textual · Sociales y Lenguaje" note="Recursos propuestos por el colegio. La bibliografía del ensayo está en el libro y en el modo de lectura." sources={essay.proposedResources} />
        </div>
      </ResourceShelf>
      <ReadingMode open={reading} onClose={() => setReading(false)} />
    </div>
  );
}
