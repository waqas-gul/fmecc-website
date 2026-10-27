import type { DeviceTier } from "@/shared/lib/utils";

export type { DeviceTier };

/** Props every 3D scene receives from `LazyScene` (planning/DESIGN.md §11). */
export interface SceneProps {
  /** Scroll progress from 0 to 1, driven by the parent section. */
  progress: number;
  /** True while the scene is on screen; scenes stop invalidating frames when false. */
  active: boolean;
  tier: DeviceTier;
  reducedMotion: boolean;
}

/**
 * Lazy import of a scene module, e.g. `() => import("./scenes/TowerScene")`. Export loaders from a
 * `"use client"` module so Server Components can pass them to client components as props.
 */
export type SceneLoader = () => Promise<{ default: React.ComponentType<SceneProps> }>;
