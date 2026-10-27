/** First focusable element on every page; jumps to `<main id="main-content">`. */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only rounded-sm bg-accent px-5 py-3 font-semibold text-accent-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-(--z-skip)"
    >
      Skip to main content
    </a>
  );
}
