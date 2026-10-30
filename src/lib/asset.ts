/** Resolves a file in /public against the deployment base (works on every route). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\.?\//, '')}`;
