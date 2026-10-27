import { site } from "@/shared/config";

/** Adds the trailing slash used by the static export (`trailingSlash: true`) to a path. */
export function withTrailingSlash(path: string): string {
  const end = path.search(/[?#]/);
  const pathname = end === -1 ? path : path.slice(0, end);
  const rest = end === -1 ? "" : path.slice(end);
  return `${pathname.endsWith("/") ? pathname : `${pathname}/`}${rest}`;
}

/** Absolute URL on the configured site origin, in its canonical trailing-slash form. */
export function absoluteUrl(path: string): string {
  return new URL(withTrailingSlash(path), `${site.url}/`).toString();
}
