"use client";

import { use, useEffect, useRef } from "react";
import { AdaptiveDpr } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { NeutralToneMapping } from "three";

import { SceneRuntimeContext } from "./runtime";
import type { DeviceTier } from "./types";

export interface SceneCanvasProps {
  children: React.ReactNode;
  tier: DeviceTier;
  className?: string;
}

/** Tells `LazyScene` once the first frame has been presented, so the cross-fade shows a picture. */
function FirstFrameSignal({ onReady }: { onReady: () => void }) {
  const sent = useRef(false);
  useFrame(() => {
    if (sent.current) return;
    sent.current = true;
    requestAnimationFrame(onReady);
  });
  return null;
}

/**
 * R3F canvas with the performance rules from planning/DESIGN.md §11: on-demand frames,
 * device pixel ratio capped at 1.5, adaptive resolution, transparent background.
 * Neutral tone mapping keeps Royal Blue and Cyan close to their brand values; shadows use PCF
 * (three r186 removed PCFSoft). Local clipping is on for cutaway views.
 */
export default function SceneCanvasImpl({ children, tier, className }: SceneCanvasProps) {
  const runtime = use(SceneRuntimeContext);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <Canvas
      aria-hidden
      className={className}
      frameloop="demand"
      dpr={[1, tier === "high" ? 1.5 : 1.25]}
      shadows="percentage"
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: tier === "high" ? "high-performance" : "default",
        toneMapping: NeutralToneMapping,
        localClippingEnabled: true,
        // Reading back every program's compile status stalls the GPU; development keeps the check.
        // Set here, not in onCreated: scenes compile programs while rendering (Studio's PMREM
        // environment), before onCreated runs. The other two fields keep three's defaults.
        debug: {
          checkShaderErrors: process.env.NODE_ENV !== "production",
          diagnostics: { keywords: false },
          onShaderError: null,
        },
      }}
      camera={{ fov: 40, near: 0.1, far: 200, position: [0, 2, 12] }}
      onCreated={({ gl }) => {
        // R3F forces a context loss itself on unmount; only a loss while mounted is a failure.
        gl.domElement.addEventListener("webglcontextlost", () => {
          if (mounted.current) runtime?.onFail();
        });
      }}
    >
      <AdaptiveDpr />
      {runtime && <FirstFrameSignal onReady={runtime.onReady} />}
      {children}
    </Canvas>
  );
}
