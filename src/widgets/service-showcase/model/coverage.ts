// Illustrative site plan for the security coverage diagram (planning/DESIGN.md §9.2): a fenced
// compound with a main building, parking and a vehicle gate, in SVG user units (960 × 640).
// Generic layout only; it does not depict a real site or an FMECC installation.

export type CoverageLayer = "cameras" | "perimeter" | "access" | "links";

// Legend for the illustrative coverage diagram: it describes the drawing, not a real site.
export const coverageLayers: { id: CoverageLayer; title: string; description: string }[] = [
  { id: "cameras", title: "Camera coverage", description: "Fixed cameras and a PTZ dome, each drawn with its field of view." },
  { id: "perimeter", title: "Perimeter detection", description: "The fence line is split into zones, so an alarm points to one stretch." },
  { id: "access", title: "Access control", description: "Readers at the vehicle gate and building entrances, with bollards at the gate." },
  { id: "links", title: "Monitoring links", description: "Every camera and reader reports back to the control room." },
];

export const coverageDescription =
  "Site plan of a fenced compound with a main building, a parking area and a vehicle gate. Six fixed cameras and one PTZ dome cover the approaches, the parking area and the gate. The fence line is divided into five perimeter detection zones. Card readers control the vehicle gate and two building entrances, with bollards at the gate. Every device is linked to a control room inside the building.";

export const SITE = { x: 60, y: 60, width: 840, height: 520 };
export const BUILDING = { x: 360, y: 150, width: 300, height: 210 };
export const CONTROL_ROOM = { x: 376, y: 166, width: 96, height: 72 };
export const CONTROL_POINT = { x: CONTROL_ROOM.x + CONTROL_ROOM.width / 2, y: CONTROL_ROOM.y + CONTROL_ROOM.height / 2 };
export const GATE = { from: 430, to: 560 };
export const PARKING = { x: 96, y: 410, width: 216, height: 136, stall: 27 };
export const GATEHOUSE = { x: 584, y: 520, width: 48, height: 36 };

/** Fixed cameras: position, viewing direction (degrees, clockwise from east), field of view and range. */
export const cameras = [
  { id: "CAM 01", x: 84, y: 84, angle: 40, fov: 62, range: 250 },
  { id: "CAM 02", x: 876, y: 84, angle: 140, fov: 62, range: 250 },
  { id: "CAM 03", x: 876, y: 556, angle: 218, fov: 62, range: 235 },
  { id: "CAM 04", x: 84, y: 556, angle: 318, fov: 70, range: 260 },
  { id: "CAM 05", x: 528, y: 372, angle: 88, fov: 58, range: 175 },
  { id: "CAM 06", x: 348, y: 318, angle: 162, fov: 70, range: 200 },
] as const;

export const ptz = { id: "PTZ 01", x: 672, y: 138, range: 120 };

export const readers = [
  { id: "AC 01", x: 608, y: 572 },
  { id: "AC 02", x: 552, y: 368 },
  { id: "AC 03", x: 668, y: 296 },
] as const;

export const bollards = [452, 495, 538] as const;

/** Perimeter detection zones along the fence, with a label position. */
export const zones = [
  { id: "Zone 1", d: `M${SITE.x} ${SITE.y} H${SITE.x + SITE.width}`, label: { x: 480, y: 44 } },
  { id: "Zone 2", d: `M${SITE.x + SITE.width} ${SITE.y} V${SITE.y + SITE.height}`, label: { x: 912, y: 320 } },
  { id: "Zone 3", d: `M${SITE.x + SITE.width} ${SITE.y + SITE.height} H${GATE.to}`, label: { x: 760, y: 608 } },
  { id: "Zone 4", d: `M${GATE.from} ${SITE.y + SITE.height} H${SITE.x}`, label: { x: 240, y: 608 } },
  { id: "Zone 5", d: `M${SITE.x} ${SITE.y + SITE.height} V${SITE.y}`, label: { x: 48, y: 320 } },
] as const;

/** SVG path for a camera's field of view: a circular sector from the camera position. */
export function sector(x: number, y: number, angle: number, fov: number, range: number) {
  const point = (degrees: number) => {
    const radians = (degrees * Math.PI) / 180;
    return `${(x + range * Math.cos(radians)).toFixed(1)} ${(y + range * Math.sin(radians)).toFixed(1)}`;
  };
  return `M${x} ${y} L${point(angle - fov / 2)} A${range} ${range} 0 0 1 ${point(angle + fov / 2)} Z`;
}
