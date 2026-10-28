"use client";

import { Component, useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from "react";

import { useReducedMotion } from "@/shared/lib/animation";
import { cn, hasWebGL } from "@/shared/lib/utils";
import type { ImageAsset } from "@/shared/types/media";
import { MediaImage } from "@/shared/ui";

import { claimCanvas, releaseCanvas, SceneRuntimeContext, type SceneRuntime } from "./runtime";
import type { SceneLoader, SceneProps } from "./types";
import { useDeviceTier } from "./useDeviceTier";

export interface LazySceneProps {
  load: SceneLoader;
  poster: ImageAsset;
  label: string;
  /** Scroll progress from 0 to 1, owned by the parent section. Omitted: the finished state (1). */
  progress?: number;
  className?: string;
}

type SceneState = "poster" | "loading" | "scene" | "fallback";

let webGLSupport: boolean | undefined;
const webGLAvailable = () => (webGLSupport ??= hasWebGL());

/** Contains anything a scene throws (including WebGL context creation) and reports it. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Poster-first slot for a 3D scene (planning/ARCHITECTURE.md §6, DESIGN.md §11).
 *
 * The poster and the text alternative render immediately and are the complete fallback. The scene
 * module is imported only once the slot is within one viewport, motion is allowed, the device tier
 * is not `low`, WebGL is available and no other canvas is mounted on the page. It cross-fades in
 * after its first frame; a load error, render error or lost WebGL context returns to the poster.
 */
export function LazyScene({ load, poster, label, progress = 1, className }: LazySceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const reducedMotion = useReducedMotion();
  const [requested, setRequested] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [Scene, setScene] = useState<ComponentType<SceneProps> | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const enabled = requested && !reducedMotion && tier !== "low" && !failed && !blocked;
  const showScene = enabled && Scene !== null;

  const runtime = useMemo<SceneRuntime>(
    () => ({ onReady: () => setReady(true), onFail: () => setFailed(true) }),
    [],
  );

  // `requested` latches once the slot comes within one viewport, so scrolling away later keeps the
  // loaded scene mounted (paused) instead of rebuilding a WebGL context on every pass.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRequested(true);
        near.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    const visible = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    near.observe(root);
    visible.observe(root);
    return () => {
      near.disconnect();
      visible.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const owner = Symbol("scene");
    let cancelled = false;

    Promise.resolve()
      .then(async () => {
        if (cancelled) return;
        if (!claimCanvas(owner)) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(`[LazyScene] "${label.slice(0, 48)}…" kept its poster: another 3D scene is already mounted on this page.`);
          }
          setBlocked(true);
          return;
        }
        if (!webGLAvailable()) throw new Error("WebGL is not available");
        // The canvas chunk (three.js, R3F) downloads in parallel with the scene chunk.
        const [scene] = await Promise.all([load(), import("./SceneCanvasImpl")]);
        if (!cancelled) setScene(() => scene.default);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      releaseCanvas(owner);
    };
  }, [enabled, load, label]);

  const state: SceneState = failed ? "fallback" : showScene && ready ? "scene" : enabled ? "loading" : "poster";
  const clamped = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 1;

  return (
    <div ref={rootRef} data-scene-state={state} className={cn("relative overflow-hidden", className)}>
      {/* The canvas is transparent, so the poster fades out as the scene fades in. */}
      <MediaImage
        asset={poster}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className={cn(
          "h-full w-full object-cover transition-opacity duration-700 ease-standard",
          state === "scene" && "opacity-0",
        )}
      />
      <p className="sr-only">{label}</p>
      {showScene && (
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-standard",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <SceneRuntimeContext value={runtime}>
            <SceneBoundary onError={runtime.onFail}>
              <Scene progress={clamped} active={onScreen} tier={tier} reducedMotion={reducedMotion} />
            </SceneBoundary>
          </SceneRuntimeContext>
        </div>
      )}
    </div>
  );
}
