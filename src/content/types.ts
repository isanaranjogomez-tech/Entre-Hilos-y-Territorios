/**
 * Shared content types. Academic content lives in /src/content and is consumed
 * by page components; components never hard-code academic statements.
 *
 * Convention: a value of `null` means "pending — not yet delivered by the
 * students". Pages render a quiet integration note instead of inventing it.
 */

export type ProductStatus = 'complete' | 'pending' | 'partial';

export type ChapterId = 'matematicas' | 'ciencias' | 'fisica' | 'ingles' | 'lenguaje-sociales';

export interface ChapterMeta {
  id: ChapterId;
  /** Route path, e.g. "/matematicas". */
  path: string;
  numeral: string;
  title: string;
  subject: string;
  /** Academic product, e.g. "Infografía". */
  product: string;
  /** One-sentence description for the homepage index. */
  description: string;
  status: ProductStatus;
  /** Language of the original deliverable — the whole page uses it. */
  lang: 'es' | 'en';
}

export interface SourceRef {
  /** Citation exactly as provided by the school or the students. */
  label: string;
  url?: string;
  /** Where this reference came from (e.g. "Formato de construcción, v2"). */
  provenance: string;
}

export interface DocumentAsset {
  title: string;
  /** Path under /public (no leading slash) or absolute URL. `null` while pending. */
  src: string | null;
  /** Optional separate original file for download. */
  downloadSrc?: string | null;
  kind: 'image' | 'pdf';
  alt: string;
}
