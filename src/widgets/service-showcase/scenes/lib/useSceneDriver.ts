import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils } from "three";

import type { SceneProps } from "@/shared/three";

export interface SceneDrive {
  /** Damped scroll progress, 0–1. */
  progress: number;
  /** Damped mouse position over the canvas, −1 to 1 on each axis; 0 when the mouse leaves. */
  pointerX: number;
  pointerY: number;
  /** Damped hover amount, 0–1 (mouse only; touch never hovers). */
  hover: number;
  /**
   * Entrance, 0–1: runs once over `INTRO` seconds of on-screen frames after the scene first draws,
   * so cameras can settle into their framing as the scene fades in. 1 with reduced motion.
   */
  intro: number;
}

const SETTLED = 1e-4;
const INTRO = 1.6;

/**
 * Drives a scene from `SceneProps` with the on-demand frame loop (planning/DESIGN.md §11): frames
 * are requested only while a value is still easing towards its target (or the one-time entrance is
 * still running) and the scene is on screen.
 * Runs before other frame callbacks (priority −1), so consumers read this frame's values.
 */
export function useSceneDriver({ progress, active, reducedMotion }: Omit<SceneProps, "tier">) {
  const drive = useRef<SceneDrive>({ progress, pointerX: 0, pointerY: 0, hover: 0, intro: reducedMotion ? 1 : 0 });
  const target = useRef({ progress, pointerX: 0, pointerY: 0, hover: 0 });
  const canvas = useThree((state) => state.gl.domElement);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    target.current.progress = progress;
    if (active) invalidate();
  }, [progress, active, invalidate]);

  useEffect(() => {
    if (reducedMotion) return;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      target.current.pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      target.current.pointerY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      target.current.hover = 1;
      invalidate();
    };
    const leave = () => {
      Object.assign(target.current, { pointerX: 0, pointerY: 0, hover: 0 });
      invalidate();
    };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    return () => {
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, [canvas, invalidate, reducedMotion]);

  useFrame((_, delta) => {
    const current = drive.current;
    const goal = target.current;
    // Frames are rare in on-demand mode; a long gap must not turn into a jump.
    const step = Math.min(delta, 1 / 30);
    let moving = false;
    for (const [key, lambda] of [
      ["progress", 4.5],
      ["pointerX", 3],
      ["pointerY", 3],
      ["hover", 4],
    ] as const) {
      const next = reducedMotion ? goal[key] : MathUtils.damp(current[key], goal[key], lambda, step);
      current[key] = Math.abs(next - goal[key]) < SETTLED ? goal[key] : next;
      if (current[key] !== goal[key]) moving = true;
    }
    // Linear in time and bounded, so the entrance costs at most INTRO seconds of frames.
    if (current.intro < 1) {
      current.intro = reducedMotion ? 1 : Math.min(1, current.intro + step / INTRO);
      if (current.intro < 1) moving = true;
    }
    if (moving && active) invalidate();
  }, -1);

  return drive;
}
