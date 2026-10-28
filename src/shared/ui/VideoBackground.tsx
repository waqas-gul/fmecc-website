"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";

import { mediaQueries, useReducedMotion } from "@/shared/lib/animation";
import { cn, savesData } from "@/shared/lib/utils";
import type { VideoAsset } from "@/shared/types/media";

import { MediaImage } from "./MediaImage";

const overlayClasses = {
  dark: "bg-linear-to-t from-navy-950/70 to-navy-950/20",
  brand: "bg-navy-900/60",
} as const;

function subscribeWide(onChange: () => void) {
  const query = window.matchMedia(mediaQueries.lg);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const isWide = () => window.matchMedia(mediaQueries.lg).matches;

/**
 * Muted, looping background video over its poster (planning/DESIGN.md §12.3). Sources attach only
 * when the element is within one viewport of the screen, motion is allowed and Save-Data is off;
 * playback pauses off-screen; a corner control pauses or resumes it (WCAG 2.2.2). In a hero the
 * poster is the page's LCP image: set `preload` there (and only there) so it is fetched with high
 * priority. `sizes` is the poster's rendered width: a cover-fitted poster in a box taller than 16:9
 * renders wider than the box. `desktopOnly` keeps the poster alone below 1024 px: no video element,
 * no source requests and no control. The width check runs after hydration (prerendered HTML assumes
 * a narrow screen), so server and client markup match.
 */
export function VideoBackground({
  video,
  overlay = "none",
  preload = false,
  sizes = "100vw",
  desktopOnly = false,
  className,
}: {
  video: VideoAsset;
  overlay?: "none" | "dark" | "brand";
  preload?: boolean;
  sizes?: string;
  desktopOnly?: boolean;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const wide = useSyncExternalStore(subscribeWide, isWide, () => false);
  const [inView, setInView] = useState(false);
  const [requested, setRequested] = useState(false);
  const [userChoice, setUserChoice] = useState<"play" | "pause" | null>(null);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);

  const wantsPlayback = userChoice === "play" || (userChoice === null && !reducedMotion);
  const enabled = !video.placeholder;
  const loaded = enabled && (wide || !desktopOnly) && (requested || userChoice === "play");

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && !window.matchMedia(mediaQueries.reduced).matches && !savesData()) setRequested(true);
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [enabled]);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    if (inView && wantsPlayback) element.play().catch(() => setPlaying(false));
    else element.pause();
  }, [inView, wantsPlayback, loaded]);

  return (
    <div ref={rootRef} className={cn("relative h-full w-full overflow-hidden bg-navy-900", className)}>
      <MediaImage asset={video.poster} fill preload={preload} sizes={sizes} className="object-cover" />
      {loaded && (
        <video
          ref={videoRef}
          aria-hidden
          muted
          loop
          playsInline
          preload="none"
          onPlaying={() => {
            setPlaying(true);
            setVisible(true);
          }}
          onPause={() => setPlaying(false)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-standard",
            visible ? "opacity-100" : "opacity-0",
          )}
        >
          {video.webm && <source src={video.webm} type="video/webm" />}
          <source src={video.mp4} type="video/mp4" />
        </video>
      )}
      {overlay !== "none" && <div aria-hidden className={cn("absolute inset-0", overlayClasses[overlay])} />}
      {enabled && (
        <button
          type="button"
          onClick={() => setUserChoice(playing ? "pause" : "play")}
          className={cn(
            "absolute right-4 bottom-4 z-(--z-raised) inline-flex size-11 items-center justify-center rounded-full border border-white/30 bg-navy-950/50 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-navy-950/75",
            desktopOnly && "max-lg:hidden",
          )}
        >
          {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
          <span className="sr-only">{playing ? "Pause background video" : "Play background video"}</span>
        </button>
      )}
    </div>
  );
}
