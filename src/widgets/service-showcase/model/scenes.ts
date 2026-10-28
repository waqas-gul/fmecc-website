import type { SceneLoader } from "@/shared/three";
import type { ImageAsset } from "@/shared/types/media";

import { loadBollardScene, loadBuildingScene, loadTowerScene } from "../lib/loaders";

export type SceneKey = "tower" | "building" | "bollard";

/** Everything a `LazyScene` needs for one of the three procedural scenes. */
export interface ShowcaseScene {
  /** Client reference: safe to pass from a Server Component to a client component. */
  load: SceneLoader;
  /**
   * Still render of the finished scene (4:5, transparent background), generated from the scene
   * itself so the cross-fade matches. Source: media-src/showcase/, built by `npm run images`.
   */
  poster: ImageAsset;
  /** Text alternative for the animation, read next to the poster's alt text. */
  label: string;
}

const poster = (name: SceneKey, alt: string): ImageAsset => ({
  src: `/images/showcase/${name}-scene.webp`,
  width: 1600,
  height: 2000,
  alt,
});

export const showcaseScenes: Record<SceneKey, ShowcaseScene> = {
  tower: {
    load: loadTowerScene,
    poster: poster(
      "tower",
      "Illustration of a four-legged lattice telecom tower inside a fenced compound, with an equipment shelter, panel antennas on a top platform and two microwave dishes.",
    ),
    label:
      "Animated 3D model: as you scroll, leg positions are set out on the ground, concrete foundations are cast, the lattice tower is erected section by section from the bottom up, and the antenna platform, panel antennas and microwave dishes are fitted at the top.",
  },
  building: {
    load: loadBuildingScene,
    poster: poster(
      "building",
      "Illustration of a mid-rise building with a two-storey podium and a glazed eight-storey tower, beside a tower crane.",
    ),
    label:
      "Animated 3D massing model: as you scroll, the building is set out and its foundation raft cast; the concrete core rises first, columns and floor slabs follow floor by floor, the glazed façade closes in two floors behind, and a tower crane climbs alongside until the roof is complete.",
  },
  bollard: {
    load: loadBollardScene,
    poster: poster(
      "bollard",
      "Cutaway illustration of three raised stainless-steel hydraulic bollards in paving, showing the below-ground housings and hydraulic rams.",
    ),
    label:
      "Animated 3D cutaway: as you scroll, three cylindrical hydraulic bollards rise in sequence from their below-ground housings on hydraulic rams until they stand at full height; scrolling back lowers them flush with the paving. A cyan scale beside them shows the rise.",
  },
};
