import type { ShowcaseKey } from "@/entities/service";

import type { SceneKey } from "./scenes";
import { bollardTimeline, buildingTimeline, floorStart, PODIUM_FLOORS, towerSectionStart, towerTimeline } from "./timelines";

/** One step in the list beside a scene; `at` is the scroll progress at which it becomes current. */
export interface ShowcaseStage {
  title: string;
  description: string;
  at: number;
}

interface ShowcaseText {
  eyebrow: string;
  title: string;
  lede: string;
  /** Shown under the visual; makes clear that it is an illustration, not FMECC project imagery. */
  caption: string;
}

export type ShowcaseContent =
  | (ShowcaseText & { kind: "scene"; scene: SceneKey; stages: ShowcaseStage[] })
  | (ShowcaseText & { kind: "diagram" });

const ILLUSTRATIVE = "Illustrative model. It does not depict a specific FMECC project.";

// TODO(content): draft section copy describing the illustrations; FMECC to review the wording.
// The stages describe the generic construction sequence shown in each model, not company claims.
// Partial on purpose: a showcase key without an entry falls back to the service gallery.
export const showcases: Partial<Record<ShowcaseKey, ShowcaseContent>> = {
  tower: {
    kind: "scene",
    scene: "tower",
    eyebrow: "Tower assembly",
    title: "From setting-out to the antenna platform",
    lede: "Scroll to follow an illustrative self-supporting lattice tower from marked leg positions to a fitted antenna platform.",
    caption: ILLUSTRATIVE,
    stages: [
      { title: "Setting out", description: "Leg positions and the compound boundary are marked on the cleared site.", at: towerTimeline.setOut[0] },
      { title: "Foundations", description: "Concrete pads are cast for each leg, and the fence and equipment shelter go in.", at: towerTimeline.foundations[0] + 0.02 },
      { title: "Lower sections", description: "Legs, horizontals and cross-bracing are erected and bolted, section by section.", at: towerTimeline.sections[0] },
      { title: "Upper sections", description: "The tower tapers towards the top as the remaining sections go up.", at: towerSectionStart(4) },
      { title: "Antenna platform", description: "The platform, panel antennas and microwave dishes are mounted at the top.", at: towerTimeline.platform[0] },
    ],
  },
  building: {
    kind: "scene",
    scene: "building",
    eyebrow: "Structural progression",
    title: "Floor by floor, from raft to roof",
    lede: "An illustrative massing model of the construction sequence: the core leads, the frame follows and the façade closes in behind.",
    caption: ILLUSTRATIVE,
    stages: [
      { title: "Setting out", description: "Grid lines and the building outline are marked on site.", at: buildingTimeline.setOut[0] },
      { title: "Foundation raft", description: "A concrete raft is cast across the footprint.", at: buildingTimeline.raft[0] },
      { title: "Podium", description: "The two podium levels rise on a wider column grid.", at: floorStart(0) },
      { title: "Core and frame", description: "The concrete core leads; columns and slabs follow floor by floor.", at: floorStart(PODIUM_FLOORS) },
      { title: "Façade", description: "Glazed façade units close in a few floors behind the frame.", at: floorStart(PODIUM_FLOORS + 2) },
      { title: "Roof", description: "Parapets, rooftop plant and the lift overrun complete the building.", at: buildingTimeline.roof[0] },
    ],
  },
  bollard: {
    kind: "scene",
    scene: "bollard",
    eyebrow: "Rise and retract",
    title: "Flush with the ground until it is needed",
    lede: "An illustrative cutaway of automatic hydraulic bollards: each one rises from its below-ground housing on a hydraulic ram and retracts flush with the paving.",
    caption: ILLUSTRATIVE,
    stages: [
      { title: "Retracted", description: "The bollards sit flush with the paving, so vehicles pass over them.", at: 0 },
      { title: "Rising", description: "Hydraulic rams lift each bollard from its housing in sequence.", at: bollardTimeline.rise[0] },
      { title: "Raised", description: "The row stands at full height across the lane. Scroll back to lower it.", at: bollardTimeline.rise[1] },
    ],
  },
  coverage: {
    kind: "diagram",
    eyebrow: "Coverage design",
    title: "Coverage planned zone by zone",
    lede: "An illustrative site plan showing how camera fields of view, perimeter detection and access control points are laid out and linked back to a control room.",
    caption: "Illustrative layout. It does not depict a specific site.",
  },
};
