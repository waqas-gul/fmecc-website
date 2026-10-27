"use client";

import { AdaptiveDpr } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import type { DeviceTier } from "./types";

export interface SceneCanvasProps {
  children: React.ReactNode;
  tier: DeviceTier;
  className?: string;
}

/**
 * R3F canvas with the performance rules from planning/DESIGN.md §11: on-demand frames,
 * device pixel ratio capped at 1.5, adaptive resolution, transparent background.
 */
export default function SceneCanvasImpl({ children, tier, className }: SceneCanvasProps) {
  return (
    <Canvas
      aria-hidden
      className={className}
      frameloop="demand"
      dpr={[1, tier === "high" ? 1.5 : 1.25]}
      gl={{ alpha: true, antialias: tier === "high", powerPreference: tier === "high" ? "high-performance" : "default" }}
      camera={{ fov: 40, near: 0.1, far: 200, position: [0, 2, 12] }}
    >
      <AdaptiveDpr />
      {children}
    </Canvas>
  );
}
