import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { mathematics } from '@/content/mathematics';
import { chapterById, settings } from '@/content/project';
import { SourceList } from '@/components/editorial/SourceList';
import { ResourceShelf } from '@/components/resources/ResourceShelf';
import { asset } from '@/lib/asset';
import { MathematicsScrollController } from '@/experiences/mathematics/MathematicsScrollController';

const MochilaExplorer = lazy(() => import('@/experiences/mathematics/MochilaExplorer'));

export default function MathematicsPage() {
  const physics = chapterById('fisica');
  return (
    <div className="bg-[#efe6d8]">
      <MathematicsScrollController />

      {/* Calm editorial interlude: the infographic's reflections, verbatim */}
      <section aria-labelledby="mat-reflexion" className="gutter bg-navy py-28 text-ivory md:py-40">
        <div className="grid gap-16 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-24">
          <div>
            <p className="meta text-sand">Geometría + cultura</p>
            <div id="mat-reflexion" className="mt-8 space-y-8">
              {mathematics.reflections?.map((r, i) => (
                <p key={r} className={`font-display leading-[1.12] ${i === 0 ? 'text-[clamp(1.9rem,3.6vw,3.4rem)]' : 'text-[clamp(1.5rem,2.4vw,2.2rem)] italic text-sand'}`}>
                  {r}
                </p>
              ))}
            </div>
          </div>
          {mathematics.whyItMatters && (
            <div className="md:pt-14">
              <p className="meta text-ivory/50">¿Por qué importa la geometría?</p>
              <ol className="mt-8 space-y-5">
                {mathematics.whyItMatters.map((w, i) => (
                  <li key={w} className="grid grid-cols-[2.5rem_1fr] items-baseline border-t border-ivory/15 pt-5">
                    <span className="font-mono text-xs text-sand">0{i + 1}</span>
                    <span className="text-lg leading-snug text-ivory/85">{w}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
        {mathematics.closingReflection && (
          <p className="mx-auto mt-28 max-w-4xl text-center font-display text-[clamp(1.9rem,4.2vw,4rem)] leading-[1.05] md:mt-40">
            <span className="meta mb-6 block text-gold">Reflexión</span>
            {mathematics.closingReflection}
          </p>
        )}
      </section>

      {/* Stage 07 — free exploration */}
      <section aria-label="Exploración libre" className="gutter py-24 md:py-32">
        <Suspense fallback={<div className="h-[78vh]" />}>
          <MochilaExplorer />
        </Suspense>
      </section>

      <ResourceShelf
        lang="es"
        entries={[
          {
            title: mathematics.infographicHeading,
            type: 'Infografía original · PNG · 1294 × 2000',
            src: asset(mathematics.infographic.src!),
            kind: 'image',
            fileName: 'Geometria-en-el-tejido-Wayuu.png',
            thumb: asset(mathematics.infographic.src!),
            alt: mathematics.infographic.alt,
          },
        ]}
      >
        <SourceList tone="light" title="Referencias de Matemáticas" note="Recursos propuestos por el colegio para este producto." sources={mathematics.references} />
        {settings.physicsMode === 'merged' && (
          <Link to={physics.path} className="btn-text mt-12 text-navy hover:text-magenta">
            Anexo · {physics.subject}: {physics.title} <span className="arrow">→</span>
          </Link>
        )}
      </ResourceShelf>
    </div>
  );
}
