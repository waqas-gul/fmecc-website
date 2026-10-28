"use client";

import dynamic from "next/dynamic";

// Loaded on first render so three.js, R3F and Drei never enter a route's initial bundle,
// even though SceneCanvas is exported from the '@/shared/three' index. LazyScene starts the
// same import in parallel with the scene module, so the chunk is usually cached by then.
export const SceneCanvas = dynamic(() => import("./SceneCanvasImpl"), { ssr: false });
