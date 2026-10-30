/**
 * PUBLIC RELEASE — files kept out of the public GitHub Pages build.
 *
 * These stay in the local project (public/) but are excluded from the
 * repository (.gitignore) and hidden on the public site until their
 * authorization is confirmed. To publish one: confirm permission, remove it
 * from this list and from .gitignore, then push.
 */
export const withheld = new Set<string>([
  // The essay's figures are published: permission confirmed by the project lead (2026-10-30).
  // The original .docx still carries the coordinator's review comments.
  'documents/ensayo-guajira-entrega-final.docx',
]);

/** True in the GitHub Pages build (set by .github/workflows/deploy.yml). */
export const isPublicRelease = import.meta.env.VITE_PUBLIC_RELEASE === 'true';

export const isAvailable = (path: string) => !(isPublicRelease && withheld.has(path));
