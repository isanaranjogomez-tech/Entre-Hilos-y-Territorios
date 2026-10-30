import { useRef } from 'react';
import { chapterById } from '@/content/project';
import { science } from '@/content/science';
import { SourceList } from '@/components/editorial/SourceList';
import { ResourceShelf } from '@/components/resources/ResourceShelf';
import { LagoonScene } from '@/experiences/science/LagoonScene';
import { HabitatSection } from '@/experiences/science/HabitatSection';
import { LayerVessel } from '@/experiences/science/LayerVessel';
import { useGsap } from '@/hooks/useGsap';
import { gsap, MQ } from '@/lib/gsap';
import { asset } from '@/lib/asset';

const meta = chapterById('ciencias');

/**
 * /ciencias — "Beneath the lagoon". English, like the poster. The page moves
 * from the surface (illustrated lagoon + the team's photographs), into the
 * habitat, down into the water's chemistry (conceptual model), back to the
 * field evidence, and out to conservation and the conclusion.
 */
export default function SciencePage() {
  const root = useRef<HTMLDivElement>(null);

  useGsap(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Surface: the lagoon drifts slowly as the title lifts away.
      gsap.to('[data-surface]', { scale: 1.12, yPercent: 8, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } });
      // Descent: the page darkens from lagoon light toward deep water.
      gsap.fromTo('[data-descent]', { backgroundColor: '#3a7b83' }, { backgroundColor: '#0f3340', ease: 'none', scrollTrigger: { trigger: '[data-descent]', start: 'top 80%', end: 'bottom 40%', scrub: true } });
    });
    mm.add(MQ.desktopMotion, () => {
      gsap.from('[data-hero-title] > *', { y: 30, opacity: 0, duration: 1.4, stagger: 0.12, ease: 'expo.out', delay: 0.15 });
    });
  }, root);

  return (
    <div ref={root} lang="en" className="bg-[#eef3ef] text-navy">
      {/* 01 · Above the surface */}
      <section data-hero className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-14 pt-32">
        <div data-surface className="absolute inset-0 origin-[60%_70%]">
          <LagoonScene className="h-full w-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#eef3ef]/10 via-transparent to-[#eef3ef]" />
        <div className="gutter relative grid gap-12 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
          <div data-hero-title>
            <p className="meta text-[#13807e]">
              Chapter {meta.numeral} · {meta.subject} · Beneath the lagoon
            </p>
            <h1 className="display-xl mt-5 max-w-[14ch]">
              Coastal Lagoons, <span className="italic">Fishing</span> & Water Quality
            </h1>
            <p className="meta mt-6 text-navy/60">{science.subtitle}</p>
            <p className="mt-8 max-w-[46ch] font-display text-[clamp(1.25rem,2vw,1.7rem)] leading-snug">{science.researchQuestion}</p>
          </div>
          <figure className="justify-self-start md:justify-self-end">
            <img src={asset(science.photos[0].src)} alt={science.photos[0].alt} width={253} height={112} className="w-[min(320px,80vw)] shadow-[0_30px_60px_-30px_rgba(20,56,72,.6)]" />
            <figcaption className="mt-2 max-w-[320px] text-[0.7rem] leading-snug text-navy/60">{science.photos[0].caption}</figcaption>
          </figure>
        </div>
        <p className="gutter relative mt-10 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-navy/40">Background: illustrated lagoon, not a photograph</p>
      </section>

      {/* Objective & case focus */}
      <section aria-label="Objective and case focus" className="gutter grid gap-10 py-24 md:grid-cols-[minmax(0,0.7fr)_minmax(0,2fr)] md:py-32">
        <p className="meta text-[#13807e]">Objective & case focus</p>
        <div className="space-y-6 font-display text-[clamp(1.4rem,2.4vw,2.2rem)] leading-snug">
          {science.objective.map((o) => (
            <p key={o}>{o}</p>
          ))}
          <p className="meta pt-4 font-sans text-navy/50">{science.authors.join(' · ')} — {science.affiliation}</p>
        </div>
      </section>

      {/* 02 · A living habitat */}
      <HabitatSection />

      {/* 03 · Beneath the surface */}
      <section data-descent aria-labelledby="descent-title" className="gutter py-28 text-ivory md:py-40" style={{ backgroundColor: '#0f3340' }}>
        <p className="meta text-[#8fd0cd]">03 · Beneath the surface</p>
        <h2 id="descent-title" className="display-lg mt-4 max-w-[18ch]">
          Methods & sources
        </h2>
        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {science.methods.map((m, i) => (
            <article key={m.label}>
              <p className="font-mono text-xs text-[#8fd0cd]">0{i + 1}</p>
              <h3 className="mt-3 font-display text-2xl">{m.label}</h3>
              <p className="mt-4 leading-relaxed text-ivory/75">{m.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 04 · The invisible chemistry */}
      <section aria-labelledby="chem-title" className="gutter bg-[#f4f1ea] py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="meta text-[#13807e]">04 · The invisible chemistry</p>
          <h2 id="chem-title" className="display-lg mt-4">
            Chemistry: Polarity + Density
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-navy/80">{science.chemistry}</p>
        </div>
        <div className="mt-12 border-y border-navy/15 py-3">
          <p className="meta text-center text-navy/60">{science.modelChain}</p>
        </div>
        <div className="mt-14">
          <LayerVessel />
        </div>
        <p className="mt-10 text-sm text-navy/55">{science.modelCaption} The interactive version on this page follows the same conceptual diagram.</p>
        <div className="mt-20 grid gap-10 md:grid-cols-[minmax(0,0.7fr)_minmax(0,2fr)]">
          <p className="meta text-[#13807e]">Discussion & integrated analysis</p>
          <div className="space-y-5 text-lg leading-relaxed">
            <p>{science.discussion}</p>
            <p className="border-l-2 border-magenta pl-4 text-navy/75">{science.limitations}</p>
          </div>
        </div>
      </section>

      {/* 05 · Evidence from the field */}
      <section aria-labelledby="field-title" className="gutter py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] md:items-end">
          <div>
            <p className="meta text-[#13807e]">05 · Evidence from the field</p>
            <h2 id="field-title" className="display-lg mt-4">
              Original visit photographs
            </h2>
            <p className="mt-5 max-w-[38ch] text-sm leading-relaxed text-navy/60">Shown at their original size, as embedded in the poster.</p>
          </div>
          <div className="flex flex-wrap items-end gap-10">
            {science.photos.map((p, i) => (
              <figure key={p.src} className={i === 1 ? 'md:mb-16' : ''}>
                <img src={asset(p.src)} alt={p.alt} width={253} height={112} loading="lazy" className="w-[min(340px,86vw)] shadow-[0_30px_60px_-34px_rgba(20,56,72,.55)]" />
                <figcaption className="mt-3 max-w-[340px] text-xs leading-snug text-navy/65">{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 06 · Conservation */}
      <section aria-labelledby="cons-title" className="relative overflow-hidden text-ivory">
        <LagoonScene mood="dusk" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e2a36]/90 via-[#0e2a36]/70 to-[#0e2a36]/30" />
        <div className="gutter relative py-28 md:py-40">
          <p className="meta text-sand">06 · Conservation proposal</p>
          <h2 id="cons-title" className="display-lg mt-4 max-w-[16ch]">
            {science.conservation.heading.split('—')[0].trim()}
          </h2>
          <p className="mt-3 font-display text-xl italic text-ivory/70">— {science.conservation.heading.split('—')[1].trim()}</p>
          <ol className="mt-12 max-w-3xl space-y-6">
            {science.conservation.actions.map((a, i) => (
              <li key={a} className="grid grid-cols-[2.5rem_1fr] border-t border-ivory/15 pt-5 text-lg leading-snug">
                <span className="font-mono text-xs text-sand">0{i + 1}</span>
                {a}
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-3xl font-display text-2xl">{science.conservation.benefit}</p>
          <p className="mt-3 max-w-3xl text-ivory/65">{science.conservation.limit}</p>
          <p className="mt-10 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ivory/40">Background: illustrated lagoon, not a photograph</p>
        </div>
      </section>

      {/* 07 · Conclusion */}
      <section aria-labelledby="concl-title" className="gutter py-28 md:py-40">
        <p className="meta text-[#13807e]">07 · Conclusion</p>
        <h2 id="concl-title" className="sr-only">
          Conclusion
        </h2>
        <p className="mt-8 max-w-[34ch] font-display text-[clamp(1.8rem,3.4vw,3.2rem)] leading-[1.1]">{science.conclusion}</p>
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
        <SourceList tone="light" title="References (APA 7)" note="As listed on the poster." sources={science.references} />
      </ResourceShelf>
    </div>
  );
}
