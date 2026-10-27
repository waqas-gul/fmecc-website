/** True when `href` is the current page or one of its descendants (pathnames carry trailing slashes). */
export function isActivePath(pathname: string, href: string): boolean {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}

export const pad = (value: number) => String(value).padStart(2, "0");
