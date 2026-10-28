import { createContext } from "react";

/**
 * Private channel from `LazyScene` to `SceneCanvas` (not exported from the index): the canvas
 * reports its first drawn frame, so the poster cross-fades only once there is a picture, and
 * reports failures (context creation or context loss), so `LazyScene` falls back to the poster.
 */
export interface SceneRuntime {
  onReady: () => void;
  onFail: () => void;
}

export const SceneRuntimeContext = createContext<SceneRuntime | null>(null);

// One WebGL canvas per page (planning/DESIGN.md §11). The first LazyScene that becomes eligible
// owns the slot until it unmounts; any other instance keeps showing its poster.
let canvasOwner: symbol | null = null;

export function claimCanvas(owner: symbol): boolean {
  if (canvasOwner && canvasOwner !== owner) return false;
  canvasOwner = owner;
  return true;
}

export function releaseCanvas(owner: symbol): void {
  if (canvasOwner === owner) canvasOwner = null;
}
