"use client";

import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, MeshBasicMaterial, MeshStandardMaterial, type Material } from "three";

import { SceneCanvas, type SceneProps } from "@/shared/three";

import {
  TOWER_SECTION_SPAN,
  TOWER_SECTIONS,
  towerSectionStart,
  towerTimeline,
} from "../model/timelines";
import { SCENE_FRAME_MASK } from "./lib/frame";
import { ease, lerp, span } from "./lib/math";
import { cross, dashed, Gauge, GroundMarks, line } from "./lib/overlays";
import { palette } from "./lib/palette";
import { Grow, Members, type Member, type Vec3 } from "./lib/progressive";
import { Studio } from "./lib/Studio";
import { useDisposables } from "./lib/useDisposables";
import { useSceneDriver, type SceneDrive } from "./lib/useSceneDriver";

// Procedural four-legged, self-supporting lattice tower (planning/DESIGN.md §9.2, §11), in metres.
// Illustrative only: proportions are generic, not a specific FMECC structure.

const HEIGHT = 30;
const SECTION = HEIGHT / TOWER_SECTIONS;
const TAPER_TO = 24;
const BASE = 2.6;
const TOP = 0.75;
const PLATFORM_Y = 28.2;
const PLATFORM = 1.75;
const COMPOUND = 7;

const halfWidth = (y: number) => (y >= TAPER_TO ? TOP : lerp(BASE, TOP, y / TAPER_TO));
const corners = (y: number): Vec3[] => {
  const w = halfWidth(y);
  return [
    [w, y, w],
    [-w, y, w],
    [-w, y, -w],
    [w, y, -w],
  ];
};
const within = ([start, end]: readonly [number, number], a: number, b: number): [number, number] => [
  lerp(start, end, a),
  lerp(start, end, b),
];

/** Legs, horizontals and X-bracing, erected bottom-up with each section overlapping the next. */
function latticeMembers(): Member[] {
  const [start, end] = towerTimeline.sections;
  const slot = (end - start) / (TOWER_SECTIONS - 1 + TOWER_SECTION_SPAN);
  const members: Member[] = [];
  for (let k = 0; k < TOWER_SECTIONS; k++) {
    const from = towerSectionStart(k);
    const at = (a: number, b: number): [number, number] => [
      from + a * slot * TOWER_SECTION_SPAN,
      from + b * slot * TOWER_SECTION_SPAN,
    ];
    const y0 = k * SECTION;
    const [bottom, middle, top] = [corners(y0), corners(y0 + SECTION / 2), corners(y0 + SECTION)];
    const leg = lerp(0.11, 0.055, k / (TOWER_SECTIONS - 1));
    for (let c = 0; c < 4; c++) {
      const n = (c + 1) % 4;
      members.push(
        { from: bottom[c], to: top[c], radius: leg, at: at(0, 0.45) },
        { from: middle[c], to: middle[n], radius: 0.028, at: at(0.3, 0.6) },
        { from: top[c], to: top[n], radius: 0.042, at: at(0.4, 0.65) },
        { from: bottom[c], to: middle[n], radius: 0.03, at: at(0.45, 0.75) },
        { from: bottom[n], to: middle[c], radius: 0.03, at: at(0.5, 0.8) },
        { from: middle[c], to: top[n], radius: 0.03, at: at(0.6, 0.9) },
        { from: middle[n], to: top[c], radius: 0.03, at: at(0.65, 1) },
      );
    }
  }
  return members;
}

/** Antenna faces on the platform: outward normal and the direction along the face. */
const FACES = [
  { normal: [0, 1] as const, along: [1, 0] as const },
  { normal: [1, 0] as const, along: [0, -1] as const },
  { normal: [-1, 0] as const, along: [0, 1] as const },
];
const PIPE_OFFSET = PLATFORM + 0.2;
const pipeBase = (face: (typeof FACES)[number], side: number): Vec3 => [
  face.normal[0] * PIPE_OFFSET + face.along[0] * side * 0.85,
  PLATFORM_Y - 0.7,
  face.normal[1] * PIPE_OFFSET + face.along[1] * side * 0.85,
];

/** Platform frame, kickers, handrail and antenna mounting pipes. */
function platformMembers(): Member[] {
  const at = (a: number, b: number) => within(towerTimeline.platform, a, b);
  const inner = corners(PLATFORM_Y);
  const kick = corners(PLATFORM_Y - 1.4);
  const rail = PLATFORM_Y + 1.05;
  const outer: Vec3[] = [
    [PLATFORM, PLATFORM_Y, PLATFORM],
    [-PLATFORM, PLATFORM_Y, PLATFORM],
    [-PLATFORM, PLATFORM_Y, -PLATFORM],
    [PLATFORM, PLATFORM_Y, -PLATFORM],
  ];
  const members: Member[] = [];
  for (let c = 0; c < 4; c++) {
    const n = (c + 1) % 4;
    const mid: Vec3 = [(outer[c][0] + outer[n][0]) / 2, PLATFORM_Y, (outer[c][2] + outer[n][2]) / 2];
    members.push(
      { from: inner[c], to: outer[c], radius: 0.05, at: at(0, 0.2) },
      { from: kick[c], to: outer[c], radius: 0.035, at: at(0.05, 0.25) },
      { from: outer[c], to: outer[n], radius: 0.05, at: at(0.15, 0.35) },
      { from: outer[c], to: [outer[c][0], rail, outer[c][2]], radius: 0.022, at: at(0.25, 0.4) },
      { from: mid, to: [mid[0], rail, mid[2]], radius: 0.022, at: at(0.25, 0.4) },
      { from: [outer[c][0], rail, outer[c][2]], to: [outer[n][0], rail, outer[n][2]], radius: 0.022, at: at(0.3, 0.45) },
    );
  }
  FACES.forEach((face) => {
    for (const side of [-1, 1]) {
      const base = pipeBase(face, side);
      members.push({ from: base, to: [base[0], PLATFORM_Y + 1.9, base[2]], radius: 0.035, at: at(0.35, 0.5) });
    }
  });
  return members;
}

/** Compound fence posts and rails, with a gate opening on the front side. */
function fenceMembers(): Member[] {
  const at = (a: number, b: number) => within(towerTimeline.foundations, a, b);
  const path: [number, number][] = [
    [COMPOUND, COMPOUND],
    [-COMPOUND, COMPOUND],
    [-COMPOUND, -COMPOUND],
    [COMPOUND, -COMPOUND],
  ];
  const members: Member[] = [];
  const posts: [number, number][] = [];
  path.forEach((a, side) => {
    const b = path[(side + 1) % 4];
    for (let step = 0; step < 7; step++) {
      const x = a[0] + ((b[0] - a[0]) * step) / 7;
      const z = a[1] + ((b[1] - a[1]) * step) / 7;
      if (side === 0 && Math.abs(x) < 1.5) continue;
      posts.push([x, z]);
    }
  });
  posts.forEach(([x, z], index) => {
    const t = index / posts.length;
    members.push({ from: [x, 0, z], to: [x, 2.1, z], radius: 0.035, at: at(0.2 + t * 0.6, 0.35 + t * 0.6) });
  });
  const rails: [Vec3, Vec3][] = [
    [[COMPOUND, 2, COMPOUND], [1, 2, COMPOUND]],
    [[-1, 2, COMPOUND], [-COMPOUND, 2, COMPOUND]],
    [[-COMPOUND, 2, COMPOUND], [-COMPOUND, 2, -COMPOUND]],
    [[-COMPOUND, 2, -COMPOUND], [COMPOUND, 2, -COMPOUND]],
    [[COMPOUND, 2, -COMPOUND], [COMPOUND, 2, COMPOUND]],
  ];
  rails.forEach(([from, to]) => {
    members.push({ from, to, radius: 0.014, at: at(0.75, 1) });
    members.push({ from: [from[0], 0.9, from[2]], to: [to[0], 0.9, to[2]], radius: 0.012, at: at(0.75, 1) });
  });
  return members;
}

/** Feeder cable tray up the inside of one leg, and the cable bridge from the equipment shelter. */
function cableMembers(): Member[] {
  const inset = (y: number): Vec3 => {
    const w = halfWidth(y) - 0.32;
    return [-w, y, w];
  };
  const [start, end] = towerTimeline.sections;
  return [
    { from: inset(0.4), to: inset(TAPER_TO), radius: 0.06, at: [start + 0.02, lerp(start, end, 0.82)] },
    { from: inset(TAPER_TO), to: inset(PLATFORM_Y - 0.2), radius: 0.06, at: [lerp(start, end, 0.82), end] },
    { from: [-3.6, 2.3, 2.2], to: [-2.3, 2.3, 2.3], radius: 0.07, at: within(towerTimeline.platform, 0, 0.2) },
    { from: [-3.6, 0, 2.2], to: [-3.6, 2.3, 2.2], radius: 0.04, at: within(towerTimeline.platform, 0, 0.1) },
  ];
}

const STEEL_MEMBERS = [...latticeMembers(), ...platformMembers()];
const FENCE_MEMBERS = fenceMembers();
const CABLE_MEMBERS = cableMembers();

const LEG_MARKS = [-BASE, BASE].flatMap((x) => [-BASE, BASE].flatMap((z) => cross(x, z, 0.75, 0.05)));
const FOOTPRINT_MARKS = [
  line([BASE, BASE], [-BASE, BASE], 0.03),
  line([-BASE, BASE], [-BASE, -BASE], 0.03),
  line([-BASE, -BASE], [BASE, -BASE], 0.03),
  line([BASE, -BASE], [BASE, BASE], 0.03),
];
const COMPOUND_MARKS = [
  dashed([COMPOUND, COMPOUND], [-COMPOUND, COMPOUND], 0.05, 0.5, 0.35),
  dashed([-COMPOUND, COMPOUND], [-COMPOUND, -COMPOUND], 0.05, 0.5, 0.35),
  dashed([-COMPOUND, -COMPOUND], [COMPOUND, -COMPOUND], 0.05, 0.5, 0.35),
  dashed([COMPOUND, -COMPOUND], [COMPOUND, COMPOUND], 0.05, 0.5, 0.35),
].flat();
const SECTION_TICKS = Array.from({ length: TOWER_SECTIONS + 1 }, (_, k) => k * SECTION);

const setOutOpacity = (p: number) => ease(span(p, 0, 0.05)) * (1 - 0.85 * span(p, 0.14, 0.26));
const compoundOpacity = (p: number) => ease(span(p, 0.02, 0.08)) * (1 - 0.55 * span(p, 0.2, 0.3));
const sectionFill = (p: number) => span(p, ...towerTimeline.sections);

function Antennas({ drive, material, dark }: { drive: RefObject<SceneDrive>; material: Material; dark: Material }) {
  return FACES.flatMap((face, f) =>
    [-1, 1].map((side, s) => {
      const base = pipeBase(face, side);
      const order = f * 2 + s;
      const start = lerp(towerTimeline.platform[0], towerTimeline.platform[1], 0.45 + order * 0.07);
      return (
        <Grow
          key={`${f}-${side}`}
          drive={drive}
          at={[start, start + 0.03]}
          drop={1.2}
          position={[base[0] + face.normal[0] * 0.14, PLATFORM_Y - 0.4, base[2] + face.normal[1] * 0.14]}
          rotation-y={Math.atan2(face.normal[0], face.normal[1])}
        >
          <mesh position-y={0.95} rotation-x={-0.05} material={material} castShadow>
            <boxGeometry args={[0.34, 1.9, 0.13]} />
          </mesh>
          <mesh position={[0, -0.25, -0.1]} material={dark} castShadow>
            <boxGeometry args={[0.26, 0.36, 0.12]} />
          </mesh>
        </Grow>
      );
    }),
  );
}

/** A microwave dish with its shroud and radome, mounted on a short arm. */
function Dish({ material, dark }: { material: Material; dark: Material }) {
  return (
    <group>
      <mesh rotation-x={Math.PI / 2} material={material} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.3, 32]} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position-z={0.16} material={material}>
        <cylinderGeometry args={[0.4, 0.42, 0.03, 32]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-z={-0.25} material={dark} castShadow>
        <cylinderGeometry args={[0.18, 0.4, 0.2, 24]} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position-z={-0.5} material={dark}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
      </mesh>
    </group>
  );
}

function Tower({ progress, active, tier, reducedMotion }: SceneProps) {
  const drive = useSceneDriver({ progress, active, reducedMotion });
  const materials = useDisposables(() => ({
    steel: new MeshStandardMaterial({ color: palette.neutral300, metalness: 0.82, roughness: 0.4 }),
    dark: new MeshStandardMaterial({ color: palette.neutral700, metalness: 0.7, roughness: 0.45 }),
    concrete: new MeshStandardMaterial({ color: palette.neutral200, roughness: 0.92 }),
    panel: new MeshStandardMaterial({ color: palette.neutral100, metalness: 0.05, roughness: 0.5 }),
    fence: new MeshStandardMaterial({ color: palette.neutral400, metalness: 0.6, roughness: 0.5 }),
    light: new MeshBasicMaterial({ color: palette.white, toneMapped: false }),
  }));
  const segments = tier === "high" ? 8 : 6;

  // Camera work: opens looking down on the setting-out, then descends to a slight low angle and
  // pulls back as the tower rises. Stable horizon; the mouse adds at most 4° of orbit.
  useFrame(({ camera, size }) => {
    const { progress: p, pointerX, pointerY } = drive.current;
    const t = ease(span(p, 0, 0.85));
    const fit = Math.max(1, 0.8 / (size.width / size.height));
    const distance = lerp(26, 55, t) * fit;
    const azimuth = MathUtils.degToRad(lerp(50, 36, t) + pointerX * 4);
    camera.position.set(Math.sin(azimuth) * distance, lerp(13, 6.5, t) - pointerY * 1.2, Math.cos(azimuth) * distance);
    camera.lookAt(0, lerp(0.5, 15.6, t), 0);
  });

  return (
    <>
      <Studio tier={tier} extent={18} distance={60} grid={{ cell: 1, section: 5, fade: 24 }} />

      <GroundMarks marks={LEG_MARKS} drive={drive} opacity={setOutOpacity} />
      <GroundMarks marks={FOOTPRINT_MARKS} drive={drive} opacity={setOutOpacity} />
      <GroundMarks marks={COMPOUND_MARKS} drive={drive} opacity={compoundOpacity} />

      {[-BASE, BASE].flatMap((x) =>
        [-BASE, BASE].map((z, i) => {
          const start = lerp(...towerTimeline.foundations, 0.05 + (x > 0 ? 2 : 0) * 0.1 + i * 0.1);
          return (
            <Grow key={`${x}${z}`} drive={drive} at={[start, start + 0.05]} position={[x, 0, z]}>
              <mesh position-y={0.15} material={materials.concrete} castShadow receiveShadow>
                <boxGeometry args={[1.5, 0.3, 1.5]} />
              </mesh>
            </Grow>
          );
        }),
      )}

      <Grow drive={drive} at={within(towerTimeline.foundations, 0.55, 1)} position={[-5.2, 0, 2.1]} rotation-y={0.25}>
        <mesh position-y={0.12} material={materials.concrete} receiveShadow>
          <boxGeometry args={[3.2, 0.24, 2.7]} />
        </mesh>
        <mesh position-y={1.45} material={materials.panel} castShadow receiveShadow>
          <boxGeometry args={[2.8, 2.5, 2.3]} />
        </mesh>
        <mesh position-y={2.76} material={materials.concrete} castShadow>
          <boxGeometry args={[3, 0.12, 2.5]} />
        </mesh>
        <mesh position={[1.41, 1.2, 0.35]} material={materials.dark}>
          <boxGeometry args={[0.02, 2, 0.9]} />
        </mesh>
      </Grow>

      <Members members={FENCE_MEMBERS} material={materials.fence} drive={drive} segments={5} />
      <Members members={STEEL_MEMBERS} material={materials.steel} drive={drive} segments={segments} />
      <Members members={CABLE_MEMBERS} material={materials.dark} drive={drive} segments={segments} />

      <Antennas drive={drive} material={materials.panel} dark={materials.dark} />
      <Grow
        drive={drive}
        at={within(towerTimeline.platform, 0.6, 0.85)}
        axis="all"
        position={[0.3, 21.6, halfWidth(21.6) + 0.55]}
        rotation-y={0.35}
      >
        <Dish material={materials.panel} dark={materials.dark} />
      </Grow>
      <Grow
        drive={drive}
        at={within(towerTimeline.platform, 0.72, 0.97)}
        axis="all"
        position={[halfWidth(24.4) + 0.55, 24.4, -0.35]}
        rotation-y={Math.PI / 2 - 0.3}
      >
        <Dish material={materials.panel} dark={materials.dark} />
      </Grow>

      <Grow drive={drive} at={within(towerTimeline.finish, 0, 0.6)} position-y={HEIGHT}>
        <mesh position-y={1.2} material={materials.steel} castShadow>
          <cylinderGeometry args={[0.025, 0.04, 2.4, 8]} />
        </mesh>
      </Grow>
      <Grow drive={drive} at={within(towerTimeline.finish, 0.6, 1)} axis="all" position={[TOP, HEIGHT + 0.12, TOP]}>
        <mesh material={materials.light}>
          <sphereGeometry args={[0.1, 16, 12]} />
        </mesh>
      </Grow>

      <Grow drive={drive} at={[0.04, 0.22]} position={[4.4, 0, -4.4]} rotation-y={0.69}>
        <Gauge
          drive={drive}
          position={[0, 0, 0]}
          height={HEIGHT}
          ticks={SECTION_TICKS}
          fill={sectionFill}
          thickness={0.05}
          tickLength={0.5}
        />
      </Grow>
    </>
  );
}

/** Lattice telecom tower that assembles bottom-up with scroll progress. */
export default function TowerScene(props: SceneProps) {
  return (
    <SceneCanvas tier={props.tier} className={SCENE_FRAME_MASK}>
      <Tower {...props} />
    </SceneCanvas>
  );
}
