/**
 * next/image loader for the static export (planning/ARCHITECTURE.md §10–§11).
 * `/images/<section>/<name>.webp` maps to `<name>-<width>.webp`, which `npm run images` generates
 * for every width in next.config.ts. Brand assets and other paths are returned unchanged.
 */
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  if (src.startsWith("/images/") && !src.startsWith("/images/brand/") && src.endsWith(".webp")) {
    return `${src.slice(0, -".webp".length)}-${width}.webp`;
  }
  return src;
}
