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

  const sm = science.summary;
  const [consTitle, consSub] = science.conservation.heading.split('—').map((s) => s.trim());

  return (
    <div ref={root} lang="en" className="bg-[#f4f1ea] text-navy">
      <LagoonDescent />

      {/* The conceptual model: one sentence, then the simulator */}
      <section aria-labelledby="chem-title" className="gutter pb-16 pt-8 md:pb-20">
        <div className="max-w-3xl">
          <p className="meta text-[#13807e]">Polarity + density</p>
          <h2 id="chem-title" className="display-lg mt-3">
            Why fuel floats
          </h2>
          <p className="mt-4 max-w-[52ch] text-[1.15rem] leading-relaxed text-navy/80">{sm.chemistry}</p>
        </div>
        <div className="mt-10">
          <LayerVessel />
        </div>
        <p className="mt-6 text-sm text-navy/55">{science.modelCaption}</p>
      </section>

      {/* What it means: three ideas at dusk, then the plan */}
      <section aria-labelledby="ideas-title" className="relative overflow-hidden text-ivory">
        <LagoonScene mood="dusk" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e2a36]/90 via-[#0e2a36]/78 to-[#0e2a36]/92" />
        <div className="gutter relative py-20 md:py-24">
          <h2 id="ideas-title" className="meta text-sand">
            What the model suggests
          </h2>
          <ol data-reveal className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
            {sm.ideas.map((idea, i) => (
              <li key={idea.title}>
                <span className="font-mono text-xs text-sand">0{i + 1}</span>
                <h3 className="mt-2 font-display text-[1.9rem] leading-tight">{idea.title}</h3>
                <p className="mt-2 text-[1.05rem] leading-relaxed text-ivory/80">{idea.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-2xl border-l-2 border-gold/70 pl-4 text-sm leading-relaxed text-ivory/75">{sm.limits}</p>

          <div className="mt-20 grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] md:gap-16">
            <div>
              <p className="meta text-sand">Conservation proposal</p>
              <h2 className="display-md mt-3 max-w-[14ch]">{consTitle}</h2>
              <p className="mt-2 font-display text-lg italic text-ivory/70">— {consSub}</p>
            </div>
            <div>
              <ol data-reveal className="space-y-4">
                {sm.actions.map((a, i) => (
                  <li key={a} className="grid grid-cols-[2.2rem_1fr] text-[1.15rem] leading-snug">
                    <span className="pt-1 font-mono text-xs text-sand">0{i + 1}</span>
                    {a}
                  </li>
                ))}
              </ol>
              <p className="mt-8 font-display text-2xl leading-snug">{sm.benefit}</p>
              <p className="mt-1 text-ivory/65">{sm.limit}</p>
            </div>
          </div>
          <p className="mt-12 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-ivory/40">Background: illustrated lagoon, not a photograph</p>
        </div>
      </section>

      {/* Conclusion beside a field photograph */}
      <section aria-labelledby="concl-title" className="gutter grid items-center gap-10 py-20 md:grid-cols-[auto_minmax(0,1fr)] md:gap-16 md:py-24">
        <figure className="w-[min(320px,100%)] rotate-[-1deg] bg-[#fbf8f1] p-2 pb-3 shadow-[0_24px_50px_-24px_rgba(11,34,48,.45)]">
          <img src={asset(science.photos[1].src)} alt={science.photos[1].alt} width={253} height={112} loading="lazy" className="w-full" />
          <figcaption className="mt-2 text-[0.7rem] leading-snug text-navy/70">{science.photos[1].caption}</figcaption>
        </figure>
        <div>
          <h2 id="concl-title" className="meta text-[#13807e]">
            Conclusion
          </h2>
          <p className="mt-4 max-w-[30ch] font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.12]">{sm.conclusion}</p>
          <p className="mt-4 max-w-[52ch] text-[1.05rem] leading-relaxed text-navy/70">{sm.conclusionNote}</p>
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
