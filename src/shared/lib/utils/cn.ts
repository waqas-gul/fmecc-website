/** Joins class names, skipping falsy values. Components own their styles; `className` is for layout. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
