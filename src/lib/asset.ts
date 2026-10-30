/** Resolves a file in /public against the deployment base (works on every route); absolute URLs pass through. */
export const asset = (path: string) => (/^https?:\/\//.test(path) ? path : `${import.meta.env.BASE_URL}${path.replace(/^\.?\//, '')}`);
