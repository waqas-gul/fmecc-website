"use client";

import { cn } from "@/shared/lib/utils";
import type { ImageAsset } from "@/shared/types/media";
import { MediaImage } from "@/shared/ui";

import type { SceneLoader } from "./types";

export interface LazySceneProps {
  load: SceneLoader;
  poster: ImageAsset;
  label: string;
  progress?: number;
  className?: string;
}

/**
 * Poster-first slot for a 3D scene (planning/ARCHITECTURE.md §6, DESIGN.md §11).
 *
 * WS-0 stub: renders the poster and the text alternative only. WS-5 replaces the body with the
 * gated loader (within one viewport, WebGL available, motion allowed, tier !== "low") that
 * calls `load()` and cross-fades the scene over the poster. The props must not change.
 */
export function LazyScene({ poster, label, className }: LazySceneProps) {
  return (
    <div data-scene-state="poster" className={cn("relative overflow-hidden", className)}>
      <MediaImage asset={poster} sizes="(min-width: 1024px) 50vw, 100vw" className="h-full w-full object-cover" />
      <p className="sr-only">{label}</p>
    </div>
  );
}
