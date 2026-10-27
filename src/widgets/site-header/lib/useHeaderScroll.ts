import { useEffect, useState } from "react";

const COMPACT_AFTER = 24; // px, planning/DESIGN.md §6.1
const HIDE_AFTER = 160;
const MIN_DELTA = 6;

/**
 * `scrolled`: past 24 px, the header turns compact and solid.
 * `hidden`: scrolling down past 160 px hides it, scrolling up reveals it; `locked` keeps it visible.
 */
export function useHeaderScroll(locked: boolean) {
  const [state, setState] = useState({ scrolled: false, hidden: false });

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = Math.max(window.scrollY, 0);
      const delta = y - lastY;
      if (Math.abs(delta) >= MIN_DELTA || y <= COMPACT_AFTER) lastY = y;

      setState((previous) => {
        const scrolled = y > COMPACT_AFTER;
        let hidden = previous.hidden;
        if (y <= HIDE_AFTER || delta <= -MIN_DELTA) hidden = false;
        else if (delta >= MIN_DELTA) hidden = true;
        return previous.scrolled === scrolled && previous.hidden === hidden ? previous : { scrolled, hidden };
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return { scrolled: state.scrolled, hidden: state.hidden && !locked };
}
