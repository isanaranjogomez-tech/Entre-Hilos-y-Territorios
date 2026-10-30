import { useRef } from 'react';
import { science } from '@/content/science';
import { SourceList } from '@/components/editorial/SourceList';
import { ResourceShelf } from '@/components/resources/ResourceShelf';
import { LagoonScene } from '@/experiences/science/LagoonScene';
import { LagoonDescent } from '@/experiences/science/LagoonDescent';
import { LayerVessel } from '@/experiences/science/LayerVessel';
import { useGsap } from '@/hooks/useGsap';
import { gsap } from '@/lib/gsap';
import { asset } from '@/lib/asset';

/** Splits a verbatim paragraph into its sentences (citations stay attached). */
const sentences = (text: string) => text.split(/(?<=\.)\s+(?=[A-Z])/);

/**
 * /ciencias — "Beneath the lagoon". English, like the poster. A scroll-driven
 * descent through the illustrated lagoon (habitat, methods, the conservation
 * challenge) narrows into the conceptual vessel; the chemistry, the model,
 * the discussion and the conservation proposal follow.
 */
export default function SciencePage() {
  const root = useRef<HTMLDivElement>(null);

  useGsap(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Text arrives sentence by sentence / item by item, as it scrolls into view.
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((group) => {
        gsap.from(group.children, { opacity: 0.12, y: 18, duration: 0.9, stagger: 0.18, ease: 'power2.out', scrollTrigger: { trigger: group, start: 'top 82%' } });
      });
    });
  }, root);

  const [consTitle, consSub] = science.conservation.heading.split('—').map((s) => s.trim());

  return (
    <div ref={root} lang="en" className="bg-[#f4f1ea] text-navy">
      <LagoonDescent />

      {/* The conceptual model: chemistry → interactive vessel */}
      <section aria-labelledby="chem-title" className="gutter pb-20 pt-10 md:pb-24">
        <div className="grid gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] md:gap-16">
          <div>
            <p className="meta text-[#13807e]">The invisible chemistry</p>
            <h2 id="chem-title" className="display-lg mt-3">
              Chemistry: Polarity + Density
            </h2>
          </div>
          <p data-reveal className="text-[1.12rem] leading-relaxed text-navy/85 md:pt-2">
            {sentences(science.chemistry).map((s) => (
              <span key={s} className="inline">
                {s}{' '}
              </span>
            ))}
          </p>
        </div>
        <div className="mt-14">
          <LayerVessel />
        </div>
        <p className="mt-8 max-w-[70ch] text-sm leading-relaxed text-navy/60">{science.modelCaption} The interactive version on this page follows the same conceptual diagram.</p>
      </section>

      {/* Discussion: read in two measured columns */}
      <section aria-labelledby="disc-title" className="gutter border-t border-navy/10 py-20 md:py-24">
        <div className="grid gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] md:gap-16">
          <h2 id="disc-title" className="meta pt-2 text-[#13807e]">
            Discussion & integrated analysis
          </h2>
          <div data-reveal className="space-y-6">
            {sentences(science.discussion).map((s) => (
              <p key={s} className="text-[1.12rem] leading-relaxed">
                {s}
              </p>
            ))}
            <p className="bg-[#ebe4d6] px-5 py-4 text-[1.02rem] leading-relaxed text-navy/85">{science.limitations}</p>
          </div>
        </div>
      </section>

      {/* Conservation proposal, at dusk */}
      <section aria-labelledby="cons-title" className="relative overflow-hidden text-ivory">
        <LagoonScene mood="dusk" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e2a36]/92 via-[#0e2a36]/72 to-[#0e2a36]/30" />
        <div className="gutter relative py-20 md:py-28">
          <p className="meta text-sand">Conservation proposal</p>
          <h2 id="cons-title" className="display-lg mt-3 max-w-[16ch]">
            {consTitle}
          </h2>
          <p className="mt-3 font-display text-xl italic text-ivory/75">— {consSub}</p>
          <ol data-reveal className="mt-10 max-w-3xl space-y-5">
            {science.conservation.actions.map((a, i) => (
              <li key={a} className="grid grid-cols-[2.5rem_1fr] text-[1.15rem] leading-snug">
                <span className="pt-1 font-mono text-xs text-sand">0{i + 1}</span>
                {a}
              </li>
            ))}
          </ol>
          <div data-reveal className="mt-10 max-w-3xl">
            <p className="font-display text-2xl leading-snug">{science.conservation.benefit}</p>
            <p className="mt-3 text-ivory/70">{science.conservation.limit}</p>
          </div>
          <p className="mt-10 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-ivory/40">Background: illustrated lagoon, not a photograph</p>
        </div>
      </section>

      {/* Conclusion */}
      <section aria-labelledby="concl-title" className="gutter py-20 md:py-28">
        <h2 id="concl-title" className="meta text-[#13807e]">
          Conclusion
        </h2>
        <div data-reveal className="mt-6 max-w-[40ch] space-y-4 font-display text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.15]">
          {sentences(science.conclusion).map((s) => (
            <p key={s}>{s}</p>
          ))}
        </div>
      </section>

      <ResourceShelf
        lang="en"
        entries={[
          {
            title: science.poster.title,
            type: 'Original poster · PNG · 2000 × 1414',
            src: asset(science.poster.src!),
            kind: 'image',
            fileName: 'Coastal-Lagoons-Fishing-Water-Quality.png',
            thumb: asset(science.poster.src!),
            alt: science.poster.alt,
          },
        ]}
      >
        <SourceList lang="en" tone="light" title="References (APA 7)" note="As listed on the poster." sources={science.references} />
      </ResourceShelf>
    </div>
  );
}
