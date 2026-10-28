// Scroll-progress windows (0–1) shared by each 3D scene and the stage list beside it, so the
// text and the picture always agree. Scenes read them in the browser; the stage lists read them
// on the server, so this module stays free of three.js.

type Window = readonly [start: number, end: number];

export const towerTimeline = {
  setOut: [0, 0.1],
  foundations: [0.08, 0.22],
  sections: [0.22, 0.8],
  platform: [0.8, 0.95],
  finish: [0.92, 1],
} as const satisfies Record<string, Window>;

export const TOWER_SECTIONS = 8;

/** Each section's window is this many slots long, so neighbouring sections overlap. */
export const TOWER_SECTION_SPAN = 1.8;

/** Start of tower section `index`'s window inside `towerTimeline.sections`. */
export const towerSectionStart = (index: number) => {
  const [start, end] = towerTimeline.sections;
  return start + ((end - start) * index) / (TOWER_SECTIONS - 1 + TOWER_SECTION_SPAN);
};

export const buildingTimeline = {
  setOut: [0, 0.08],
  raft: [0.05, 0.14],
  floors: [0.14, 0.86],
  roof: [0.86, 0.97],
} as const satisfies Record<string, Window>;

/** Two podium floors and eight typical floors. */
export const BUILDING_FLOORS = 10;
export const PODIUM_FLOORS = 2;

/** Start of floor `index`'s window inside `buildingTimeline.floors`. */
export const floorStart = (index: number) => {
  const [start, end] = buildingTimeline.floors;
  return start + ((end - start) * index) / (BUILDING_FLOORS + 0.5);
};

export const bollardTimeline = {
  rise: [0.18, 0.72],
  /** Delay between neighbouring bollards, as a share of the rise window. */
  stagger: 0.12,
} as const;
