"use client";

import type { SceneLoader } from "@/shared/three";

// Scene loaders live in a client module so Server Components can hand them to client components
// as references (planning/ARCHITECTURE.md §6). Each import is its own chunk, fetched only when
// LazyScene decides to load it.
export const loadTowerScene: SceneLoader = () => import("../scenes/TowerScene");
export const loadBuildingScene: SceneLoader = () => import("../scenes/BuildingScene");
export const loadBollardScene: SceneLoader = () => import("../scenes/BollardScene");
