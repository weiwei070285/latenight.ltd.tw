/** Prefix a public-folder path with the site's base URL (works on GitHub Pages sub-paths and custom domains). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
