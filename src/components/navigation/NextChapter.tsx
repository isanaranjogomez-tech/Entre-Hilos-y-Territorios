import { Link } from 'react-router-dom';
import { chapterById, nextChapter, project } from '@/content/project';
import type { ChapterId } from '@/content/types';
import { ui } from '@/lib/i18n';

/** End of every chapter: the next discipline, and the way home — in the page's language. */
export function NextChapter({ from }: { from: ChapterId }) {
  const next = nextChapter(from);
  const t = ui[chapterById(from).lang];
  return (
    <footer lang={chapterById(from).lang} className="gutter relative bg-ink pb-10 pt-20 text-ivory">
      <p className="meta text-ivory/45">{t.nextChapter}</p>
      <Link to={next.path} className="group mt-5 block" lang={next.lang}>
        <span className="meta text-sand">
          {next.numeral} · {next.subject}
        </span>
        <span className="display-lg mt-3 block font-display transition-colors duration-700 group-hover:text-sand">
          {next.title} <span className="inline-block transition-transform duration-500 group-hover:translate-x-3">→</span>
        </span>
      </Link>
      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-ivory/10 pt-6">
        <Link to="/" className="btn-text text-ivory/70 hover:text-ivory">
          <span className="arrow">←</span> {t.backHome}
        </Link>
        <p className="meta text-ivory/35">
          {project.institution} · {project.level} · 2026
        </p>
      </div>
    </footer>
  );
}
