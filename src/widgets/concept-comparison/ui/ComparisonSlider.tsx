"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronsLeftRight } from "lucide-react";

import { mediaQueries } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/utils";
import type { ImageAsset } from "@/shared/types/media";
import { MediaImage } from "@/shared/ui";

const clamp = (value: number) => Math.min(100, Math.max(0, value));
const round = (value: number) => Math.round(value * 10) / 10;

/** Movement (px) before a touch counts as a horizontal drag rather than the start of a page scroll. */
const TOUCH_SLOP = 8;

/** One-time hint: the divider glides left, right and back when the panel first comes into view. */
const HINT = [
  { to: 36, ms: 650 },
  { to: 63, ms: 850 },
  { to: 50, ms: 650 },
] as const;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const SIZES = "(min-width: 1280px) 38rem, (min-width: 1024px) 45vw, 100vw";

/**
 * Before/after comparison with a draggable vertical divider. `before` shows left of the divider,
 * `after` right of it. The reveal is transform-only: a window layer slides while its content
 * slides back the same distance, so the `before` image stays put while its visible edge moves.
 *
 * Input: mouse and pen drag from anywhere on the panel; touch drags only once the finger moves
 * sideways (`touch-action: pan-y`), so vertical page scrolling is never captured. A native range
 * input, invisible and panel-sized, carries the value for keyboard and assistive technology: arrows move 5 %
 * (Shift for 1 %), Page Up/Down 10 %, Home/End to either edge. Without JavaScript the divider rests
 * at the centre; with reduced motion there is no hint movement.
 */
export function ComparisonSlider({
  before,
  after,
  beforeLabel,
  afterLabel,
  label,
  className,
}: {
  before: ImageAsset;
  after: ImageAsset;
  beforeLabel: string;
  afterLabel: string;
  label: string;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const gesture = useRef<{ id: number; x: number; y: number; active: boolean } | null>(null);
  const touched = useRef(false);
  const hintFrame = useRef(0);

  const stopHint = () => {
    touched.current = true;
    cancelAnimationFrame(hintFrame.current);
  };

  // The hint plays once, when at least 60 % of the panel is visible, unless the visitor got there first.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !window.matchMedia(mediaQueries.motionOk).matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (touched.current) return;
        let step = 0;
        let from = 50;
        let start = performance.now();
        const tick = (now: number) => {
          if (touched.current) return;
          const { to, ms } = HINT[step];
          const t = Math.min(1, (now - start) / ms);
          setPosition(round(from + (to - from) * easeInOut(t)));
          if (t < 1) {
            hintFrame.current = requestAnimationFrame(tick);
          } else if (step < HINT.length - 1) {
            step += 1;
            from = to;
            start = now;
            hintFrame.current = requestAnimationFrame(tick);
          }
        };
        hintFrame.current = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(frame);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(hintFrame.current);
    };
  }, []);

  const positionAt = (clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    return rect && rect.width > 0 ? round(clamp(((clientX - rect.left) / rect.width) * 100)) : 50;
  };

  const beginDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    setPosition(positionAt(event.clientX));
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    stopHint();
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, active: event.pointerType !== "touch" };
    if (event.pointerType !== "touch") {
      // Keep focus on the range input so the arrows carry on from the drag (a pointer focus shows
      // no ring); without preventDefault the mousedown that follows would move focus to the body.
      event.preventDefault();
      inputRef.current?.focus({ preventScroll: true });
      beginDrag(event);
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    if (!current.active) {
      const dx = Math.abs(event.clientX - current.x);
      const dy = Math.abs(event.clientY - current.y);
      if (dx < TOUCH_SLOP || dx < dy) return;
      current.active = true;
      beginDrag(event);
      return;
    }
    setPosition(positionAt(event.clientX));
  };

  const endDrag = () => {
    gesture.current = null;
    setDragging(false);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const step = event.shiftKey ? 1 : 5;
    const moves: Record<string, number> = {
      ArrowLeft: -step,
      ArrowDown: -step,
      ArrowRight: step,
      ArrowUp: step,
      PageDown: -10,
      PageUp: 10,
    };
    let next: number | null = null;
    if (event.key in moves) next = clamp(Math.round(position) + moves[event.key]);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 100;
    if (next === null) return;
    event.preventDefault();
    stopHint();
    setPosition(next);
  };

  const shown = Math.round(position);

  return (
    <div
      ref={frameRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
      onDragStart={(event) => event.preventDefault()}
      style={{ "--position": `${position}%` } as CSSProperties}
      className={cn(
        "relative isolate aspect-[4/5] w-full touch-pan-y touch-pinch-zoom overflow-hidden rounded-md border border-line bg-navy-950 select-none",
        dragging ? "cursor-grabbing" : "cursor-ew-resize",
        className,
      )}
    >
      {/* Before (left of the divider): a window that slides right, holding content that slides back. */}
      <div className="absolute inset-0 z-10 overflow-hidden [transform:translateX(calc(var(--position)_-_100%))]">
        <div className="absolute inset-0 [transform:translateX(calc(100%_-_var(--position)))]">
          <MediaImage asset={before} fill sizes={SIZES} className="pointer-events-none object-cover" />
        </div>
      </div>
      <MediaImage asset={after} fill sizes={SIZES} className="pointer-events-none object-cover" />

      <span
        aria-hidden
        className={cn(
          "type-label pointer-events-none absolute top-4 left-4 z-20 rounded-full border border-white/25 bg-navy-950/70 px-3 py-1.5 text-white backdrop-blur-sm transition-opacity duration-250 sm:top-5 sm:left-5",
          position < 24 && "opacity-0",
        )}
      >
        {beforeLabel}
      </span>
      <span
        aria-hidden
        className={cn(
          "type-label pointer-events-none absolute top-4 right-4 z-20 max-w-[45%] rounded-full border border-white/25 bg-navy-950/70 px-3 py-1.5 text-right leading-snug text-white backdrop-blur-sm transition-opacity duration-250 sm:top-5 sm:right-5",
          position > 55 && "opacity-0",
        )}
      >
        {afterLabel}
      </span>

      <input
        ref={inputRef}
        type="range"
        min={0}
        max={100}
        step={1}
        value={shown}
        aria-label={label}
        aria-valuetext={`${shown}% ${beforeLabel.toLowerCase()}, ${100 - shown}% ${afterLabel.toLowerCase()}`}
        onChange={(event) => {
          stopHint();
          setPosition(Number(event.target.value));
        }}
        onKeyDown={onKeyDown}
        onFocus={(event) => setFocusVisible(event.currentTarget.matches(":focus-visible"))}
        onBlur={() => setFocusVisible(false)}
        // Invisible but panel-sized (not sr-only): focus scrolling and screen-reader focus outlines
        // then frame the whole slider. Pointer input goes to the panel, so it ignores the pointer.
        className="pointer-events-none absolute inset-0 z-0 size-full opacity-0"
      />

      {/* Divider and handle: one full-size layer moved by transform. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-30 [transform:translateX(var(--position))]">
        <span className="absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_18px_rgb(19_201_215/0.55)]" />
        <span
          className={cn(
            "absolute top-1/2 left-0 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-navy-950 shadow-raised transition-[scale] duration-150",
            dragging && "scale-105",
            focusVisible && "outline-2 outline-offset-4 outline-cyan-500",
          )}
        >
          <ChevronsLeftRight className="size-5" />
        </span>
      </div>
    </div>
  );
}
