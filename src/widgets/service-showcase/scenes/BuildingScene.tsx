"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import {
  CanvasTexture,
  MathUtils,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  SRGBColorSpace,
  type Group,
  type Material,
  type Mesh,
} from "three";

import { SceneCanvas, type SceneProps } from "@/shared/three";

import { BUILDING_FLOORS, buildingTimeline, floorStart, PODIUM_FLOORS } from "../model/timelines";
import { SCENE_FRAME_MASK } from "./lib/frame";
import { ease, lerp, settle, span } from "./lib/math";
import { cross, dashed, Gauge, GroundMarks, line, type Mark } from "./lib/overlays";
import { palette } from "./lib/palette";
import { Grow, Members, type Member, type Vec3 } from "./lib/progressive";
import { Studio } from "./lib/Studio";
import { useDisposables } from "./lib/useDisposables";
import { useSceneDriver, type SceneDrive } from "./lib/useSceneDriver";

// Architectural massing of a mid-rise building under construction (planning/DESIGN.md §9.2), in
// metres: a two-level podium and eight typical floors. The core leads, columns and slabs follow,
// the façade trails two floors behind, and a tower crane climbs alongside. Illustrative only.

const RAFT_TOP = 0.3;
const PODIUM_HEIGHT = 4.2;
const TYPICAL_HEIGHT = 3.4;
const SLAB = 0.3;
const LEVELS = Array.from({ length: BUILDING_FLOORS + 1 }, (_, k) =>
  k <= PODIUM_FLOORS ? RAFT_TOP + k * PODIUM_HEIGHT : RAFT_TOP + PODIUM_FLOORS * PODIUM_HEIGHT + (k - PODIUM_FLOORS) * TYPICAL_HEIGHT,
);
const ROOF = LEVELS[BUILDING_FLOORS];

type Box = { x: [number, number]; z: [number, number] };
const PODIUM: Box = { x: [-10, 10], z: [-7, 7] };
const TOWER: Box = { x: [-7, 5], z: [-5, 5] };
const CORE: Box = { x: [-2.8, 0.8], z: [-3.3, 0.3] };
const footprint = (floor: number) => (floor < PODIUM_FLOORS ? PODIUM : TOWER);
const centre = (box: Box): [number, number] => [(box.x[0] + box.x[1]) / 2, (box.z[0] + box.z[1]) / 2];
const size = (box: Box): [number, number] => [box.x[1] - box.x[0], box.z[1] - box.z[0]];
const inCore = (x: number, z: number) => x > CORE.x[0] && x < CORE.x[1] && z > CORE.z[0] && z < CORE.z[1];
const [CORE_X, CORE_Z] = centre(CORE);
const [CORE_WIDTH, CORE_DEPTH] = size(CORE);

const SLOT = (buildingTimeline.floors[1] - buildingTimeline.floors[0]) / (BUILDING_FLOORS + 0.5);
const FLOOR_SPAN = SLOT * 1.5;
const floorAt = (floor: number, a: number, b: number): [number, number] => [
  floorStart(floor) + a * FLOOR_SPAN,
  floorStart(floor) + b * FLOOR_SPAN,
];
/** Façade units for a floor go in once the frame is two floors higher; the top floors close in at roof stage. */
const facadeAt = (floor: number): [number, number] => {
  const start =
    floor + 2 < BUILDING_FLOORS ? floorAt(floor + 2, 0.3, 0.3)[0] : buildingTimeline.roof[0] + (floor + 2 - BUILDING_FLOORS) * 0.035;
  return [start, start + 0.06];
};

const PODIUM_GRID = { x: [-9.4, -3.1, 3.1, 9.4], z: [-6.4, 0, 6.4] };
const TOWER_GRID = { x: [-6.4, -1, 4.4], z: [-4.4, 0, 4.4] };

function columnMembers(): Member[] {
  const members: Member[] = [];
  for (let floor = 0; floor < BUILDING_FLOORS; floor++) {
    const grid = floor < PODIUM_FLOORS ? PODIUM_GRID : TOWER_GRID;
    grid.x.forEach((x) =>
      grid.z.forEach((z) => {
        if (inCore(x, z)) return;
        members.push({
          from: [x, LEVELS[floor], z],
          to: [x, LEVELS[floor + 1] - SLAB, z],
          radius: floor < PODIUM_FLOORS ? 0.34 : 0.3,
          at: floorAt(floor, 0.15, 0.55),
        });
      }),
    );
  }
  return members;
}

// Tower crane: square lattice mast that climbs with the building, slewing jib on top.
const CRANE: [number, number] = [13, -6.5];
const MAST = 0.8;
const MAST_SEGMENT = 2.5;
const MAST_SEGMENTS = 17;
const ERECTED = 4;
const mastAt = (segment: number): [number, number] => {
  if (segment < ERECTED) {
    const start = lerp(0.06, 0.12, segment / ERECTED);
    return [start, start + 0.012];
  }
  const start = lerp(0.2, 0.8, (segment - ERECTED) / (MAST_SEGMENTS - ERECTED));
  return [start, start + 0.04];
};

function mastMembers(): Member[] {
  const members: Member[] = [];
  const corner = (c: number, y: number): Vec3 => [c === 0 || c === 3 ? MAST : -MAST, y, c < 2 ? MAST : -MAST];
  for (let segment = 0; segment < MAST_SEGMENTS; segment++) {
    const [start, end] = mastAt(segment);
    const at = (a: number, b: number): [number, number] => [lerp(start, end, a), lerp(start, end, b)];
    const y0 = segment * MAST_SEGMENT;
    const y1 = y0 + MAST_SEGMENT;
    for (let c = 0; c < 4; c++) {
      const n = (c + 1) % 4;
      members.push(
        { from: corner(c, y0), to: corner(c, y1), radius: 0.06, at: at(0, 0.6) },
        { from: corner(c, y1), to: corner(n, y1), radius: 0.035, at: at(0.4, 0.8) },
        { from: corner(segment % 2 ? c : n, y0), to: corner(segment % 2 ? n : c, y1), radius: 0.03, at: at(0.5, 1) },
      );
    }
  }
  return members;
}

/** Jib, counter-jib, tower head and ties, in the slewing frame (origin on the mast top). */
function jibMembers(): Member[] {
  const at: [number, number] = [0.1, 0.14];
  const members: Member[] = [];
  const JIB = 17;
  const PANEL = 1.6;
  members.push(
    { from: [1, 0.6, 0.45], to: [JIB, 0.6, 0.45], radius: 0.05, at },
    { from: [1, 0.6, -0.45], to: [JIB, 0.6, -0.45], radius: 0.05, at },
    { from: [1, 1.6, 0], to: [JIB - 0.6, 1.6, 0], radius: 0.05, at },
    { from: [-1, 0.6, 0.5], to: [-7.4, 0.6, 0.5], radius: 0.05, at },
    { from: [-1, 0.6, -0.5], to: [-7.4, 0.6, -0.5], radius: 0.05, at },
  );
  for (let x = 1; x < JIB - 0.5; x += PANEL) {
    for (const z of [0.45, -0.45]) {
      members.push(
        { from: [x, 0.6, z], to: [x + PANEL / 2, 1.6, 0], radius: 0.028, at },
        { from: [x + PANEL / 2, 1.6, 0], to: [Math.min(x + PANEL, JIB), 0.6, z], radius: 0.028, at },
      );
    }
    members.push({ from: [x, 0.6, 0.45], to: [x, 0.6, -0.45], radius: 0.025, at });
  }
  for (const [x, z] of [
    [MAST, MAST],
    [-MAST, MAST],
    [-MAST, -MAST],
    [MAST, -MAST],
  ]) {
    members.push({ from: [x, 0.6, z], to: [0, 4.4, 0], radius: 0.05, at });
  }
  members.push(
    { from: [0, 4.4, 0], to: [11, 1.6, 0], radius: 0.02, at },
    { from: [0, 4.4, 0], to: [-7, 0.6, 0], radius: 0.02, at },
  );
  return members;
}

const COLUMN_MEMBERS = columnMembers();
const MAST_MEMBERS = mastMembers();
const JIB_MEMBERS = jibMembers();

const SET_OUT_MARKS: Mark[] = [
  ...PODIUM_GRID.x.map((x) => line([x, -9], [x, 9], 0.06)),
  ...PODIUM_GRID.z.map((z) => line([-12, z], [12, z], 0.06)),
  ...PODIUM_GRID.x.flatMap((x) => PODIUM_GRID.z.flatMap((z) => cross(x, z, 0.7, 0.1))),
];
const OUTLINE_MARKS: Mark[] = [
  dashed([PODIUM.x[0], PODIUM.z[1]], [PODIUM.x[1], PODIUM.z[1]], 0.08, 0.8, 0.5),
  dashed([PODIUM.x[1], PODIUM.z[1]], [PODIUM.x[1], PODIUM.z[0]], 0.08, 0.8, 0.5),
  dashed([PODIUM.x[1], PODIUM.z[0]], [PODIUM.x[0], PODIUM.z[0]], 0.08, 0.8, 0.5),
  dashed([PODIUM.x[0], PODIUM.z[0]], [PODIUM.x[0], PODIUM.z[1]], 0.08, 0.8, 0.5),
].flat();
const setOutOpacity = (p: number) => ease(span(p, 0, 0.05)) * (1 - 0.9 * span(p, 0.1, 0.18));
const outlineOpacity = (p: number) => ease(span(p, 0.01, 0.06)) * (1 - 0.6 * span(p, 0.12, 0.2));

/** Height of the structure (top of the highest slab cast so far) at progress `p`. */
const structureTop = (p: number) => {
  let top = RAFT_TOP * ease(span(p, ...buildingTimeline.raft));
  for (let floor = 0; floor < BUILDING_FLOORS; floor++) {
    top += (LEVELS[floor + 1] - LEVELS[floor]) * ease(span(p, ...floorAt(floor, 0.45, 0.9)));
  }
  return top;
};
const structureFill = (p: number) => structureTop(p) / ROOF;

/** Mullion and transom pattern: one tile is a 1.5 m façade module, one floor high. */
function createFacadeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const context = canvas.getContext("2d")!;
  context.fillStyle = palette.navy700;
  context.fillRect(0, 0, 128, 128);
  const glare = context.createLinearGradient(0, 0, 128, 128);
  glare.addColorStop(0, "rgb(143 176 255 / 0.18)");
  glare.addColorStop(1, "rgb(143 176 255 / 0)");
  context.fillStyle = glare;
  context.fillRect(0, 0, 128, 128);
  context.fillStyle = palette.neutral400;
  context.fillRect(0, 0, 5, 128);
  context.fillRect(0, 0, 128, 7);
  context.fillRect(0, 84, 128, 3);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

/** A façade plane whose UVs repeat the module texture once per 1.5 m. */
function facadePlane(width: number, height: number) {
  const geometry = new PlaneGeometry(width, height);
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setX(i, (uv.getX(i) * width) / 1.5);
  return geometry;
}

interface Glazing {
  material: Material;
  podiumWidth: PlaneGeometry;
  podiumDepth: PlaneGeometry;
  towerWidth: PlaneGeometry;
  towerDepth: PlaneGeometry;
}

function Facade({ floor, drive, glass }: { floor: number; drive: RefObject<SceneDrive>; glass: Glazing }) {
  const box = footprint(floor);
  const [cx, cz] = centre(box);
  const height = LEVELS[floor + 1] - LEVELS[floor] - SLAB;
  const podium = floor < PODIUM_FLOORS;
  const along = podium ? glass.podiumWidth : glass.towerWidth;
  const across = podium ? glass.podiumDepth : glass.towerDepth;
  const sides: { geometry: PlaneGeometry; position: Vec3; rotation: number }[] = [
    { geometry: along, position: [cx, height / 2, box.z[1]], rotation: 0 },
    { geometry: along, position: [cx, height / 2, box.z[0]], rotation: Math.PI },
    { geometry: across, position: [box.x[1], height / 2, cz], rotation: Math.PI / 2 },
    { geometry: across, position: [box.x[0], height / 2, cz], rotation: -Math.PI / 2 },
  ];
  return (
    <Grow drive={drive} at={facadeAt(floor)} position-y={LEVELS[floor]}>
      {sides.map((side, index) => (
        <mesh
          key={index}
          geometry={side.geometry}
          material={glass.material}
          position={side.position}
          rotation-y={side.rotation}
          receiveShadow
        />
      ))}
    </Grow>
  );
}

function Crane({ drive, steel, panel, concrete, dark }: { drive: RefObject<SceneDrive>; steel: Material; panel: Material; concrete: Material; dark: Material }) {
  const head = useRef<Group>(null);
  const cable = useRef<Mesh>(null);
  const hook = useRef<Group>(null);

  useFrame(() => {
    const p = drive.current.progress;
    let top = 0;
    for (let segment = 0; segment < MAST_SEGMENTS; segment++) top += MAST_SEGMENT * ease(span(p, ...mastAt(segment)));
    const slew = ease(span(p, 0.12, 0.96));
    if (head.current) {
      head.current.position.y = top;
      head.current.rotation.y = lerp(-0.35, Math.PI - 0.3, slew);
      head.current.visible = top > 0.5;
    }
    const trolley = lerp(14, 7, slew);
    const hookY = Math.min(top - 2, Math.max(structureTop(p) + 3, 4));
    const length = Math.max(top + 0.5 - hookY, 0.1);
    if (cable.current) {
      cable.current.position.set(trolley, 0.5 - length / 2, 0);
      cable.current.scale.y = length;
    }
    if (hook.current) hook.current.position.set(trolley, 0.5 - length, 0);
  });

  return (
    <group position={[CRANE[0], 0, CRANE[1]]}>
      <Grow drive={drive} at={[0.04, 0.07]}>
        <mesh position-y={0.4} material={concrete} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.8, 3.2]} />
        </mesh>
      </Grow>
      <Members members={MAST_MEMBERS} material={steel} drive={drive} />
      <group ref={head}>
        <mesh position-y={0.3} material={dark} castShadow>
          <boxGeometry args={[2, 0.6, 2]} />
        </mesh>
        <Members members={JIB_MEMBERS} material={steel} drive={drive} />
        <mesh position={[1.1, 1.1, 1.25]} material={panel} castShadow>
          <boxGeometry args={[1.3, 1.3, 1.1]} />
        </mesh>
        {[-5.6, -6.4, -7.2].map((x) => (
          <mesh key={x} position={[x, 0.1, 0]} material={concrete} castShadow>
            <boxGeometry args={[0.7, 1.6, 1.1]} />
          </mesh>
        ))}
        <mesh ref={cable} material={dark}>
          <cylinderGeometry args={[0.02, 0.02, 1, 6]} />
        </mesh>
        <group ref={hook}>
          <mesh position-y={-0.25} material={dark} castShadow>
            <boxGeometry args={[0.35, 0.5, 0.3]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Building({ progress, active, tier, reducedMotion }: SceneProps) {
  const drive = useSceneDriver({ progress, active, reducedMotion });
  const materials = useDisposables(() => ({
    concrete: new MeshStandardMaterial({ color: palette.neutral200, roughness: 0.9 }),
    core: new MeshStandardMaterial({ color: palette.neutral300, roughness: 0.85 }),
    steel: new MeshStandardMaterial({ color: palette.neutral300, metalness: 0.8, roughness: 0.4 }),
    dark: new MeshStandardMaterial({ color: palette.neutral700, metalness: 0.6, roughness: 0.5 }),
    panel: new MeshStandardMaterial({ color: palette.neutral100, roughness: 0.6 }),
  }));
  const glass = useDisposables(() => {
    const texture = createFacadeTexture();
    return {
      texture,
      material: new MeshStandardMaterial({ map: texture, metalness: 0.55, roughness: 0.16, envMapIntensity: 1.3 }),
      podiumWidth: facadePlane(size(PODIUM)[0], PODIUM_HEIGHT - SLAB),
      podiumDepth: facadePlane(size(PODIUM)[1], PODIUM_HEIGHT - SLAB),
      towerWidth: facadePlane(size(TOWER)[0], TYPICAL_HEIGHT - SLAB),
      towerDepth: facadePlane(size(TOWER)[1], TYPICAL_HEIGHT - SLAB),
    };
  });

  // Opens looking down on the setting-out, then descends to a slight low angle as floors rise.
  // On first draw the camera settles in from slightly wider and higher (drive.intro).
  useFrame(({ camera, size: view }) => {
    const { progress: p, pointerX, pointerY, intro } = drive.current;
    const t = ease(span(p, 0, 0.9));
    const entrance = settle(intro);
    const fit = Math.max(1, 0.8 / (view.width / view.height));
    const distance = lerp(46, 82, t) * fit * (1 + 0.14 * entrance);
    const azimuth = MathUtils.degToRad(lerp(42, 32, t) + pointerX * 4 + 9 * entrance);
    camera.position.set(
      Math.sin(azimuth) * distance + 2,
      lerp(30, 9, t) - pointerY * 1.5 + 5 * entrance,
      Math.cos(azimuth) * distance,
    );
    camera.lookAt(lerp(1, 2.5, t), lerp(3, 20, t), 0);
  });

  return (
    <>
      <Studio tier={tier} extent={30} distance={90} grid={{ cell: 2, section: 10, fade: 42 }} />

      <GroundMarks marks={SET_OUT_MARKS} drive={drive} opacity={setOutOpacity} />
      <GroundMarks marks={OUTLINE_MARKS} drive={drive} opacity={outlineOpacity} />

      <Grow drive={drive} at={[...buildingTimeline.raft]}>
        <mesh position-y={RAFT_TOP / 2} material={materials.concrete} castShadow receiveShadow>
          <boxGeometry args={[21.6, RAFT_TOP, 15.6]} />
        </mesh>
      </Grow>

      {Array.from({ length: BUILDING_FLOORS }, (_, floor) => {
        const box = footprint(floor);
        const [width, depth] = size(box);
        const [cx, cz] = centre(box);
        const coreHeight = LEVELS[floor + 1] - LEVELS[floor];
        return (
          <group key={floor}>
            <Grow drive={drive} at={floorAt(floor, 0, 0.35)} position={[CORE_X, LEVELS[floor], CORE_Z]}>
              <mesh position-y={coreHeight / 2} material={materials.core} castShadow receiveShadow>
                <boxGeometry args={[CORE_WIDTH, coreHeight, CORE_DEPTH]} />
              </mesh>
            </Grow>
            <Grow drive={drive} at={floorAt(floor, 0.45, 0.9)} axis="xz" position={[cx, LEVELS[floor + 1] - SLAB, cz]}>
              <mesh position-y={SLAB / 2} material={materials.concrete} castShadow receiveShadow>
                <boxGeometry args={[width + 0.4, SLAB, depth + 0.4]} />
              </mesh>
            </Grow>
            <Facade floor={floor} drive={drive} glass={glass} />
          </group>
        );
      })}

      <Members members={COLUMN_MEMBERS} material={materials.concrete} drive={drive} segments={tier === "high" ? 10 : 8} />

      <Grow drive={drive} at={floorAt(4, 0, 0.3)} position-y={LEVELS[PODIUM_FLOORS]}>
        {[
          { position: [0, 0.5, PODIUM.z[1] + 0.1] as Vec3, args: [20.4, 1, 0.2] as Vec3 },
          { position: [0, 0.5, PODIUM.z[0] - 0.1] as Vec3, args: [20.4, 1, 0.2] as Vec3 },
          { position: [PODIUM.x[1] + 0.1, 0.5, 0] as Vec3, args: [0.2, 1, 14.4] as Vec3 },
          { position: [PODIUM.x[0] - 0.1, 0.5, 0] as Vec3, args: [0.2, 1, 14.4] as Vec3 },
        ].map((wall, index) => (
          <mesh key={index} position={wall.position} material={materials.concrete} castShadow>
            <boxGeometry args={wall.args} />
          </mesh>
        ))}
      </Grow>

      <Grow drive={drive} at={[buildingTimeline.roof[0], buildingTimeline.roof[0] + 0.04]} position-y={ROOF}>
        {[
          { position: [centre(TOWER)[0], 0.5, TOWER.z[1] + 0.1] as Vec3, args: [12.4, 1, 0.2] as Vec3 },
          { position: [centre(TOWER)[0], 0.5, TOWER.z[0] - 0.1] as Vec3, args: [12.4, 1, 0.2] as Vec3 },
          { position: [TOWER.x[1] + 0.1, 0.5, 0] as Vec3, args: [0.2, 1, 10.4] as Vec3 },
          { position: [TOWER.x[0] - 0.1, 0.5, 0] as Vec3, args: [0.2, 1, 10.4] as Vec3 },
        ].map((wall, index) => (
          <mesh key={index} position={wall.position} material={materials.concrete} castShadow>
            <boxGeometry args={wall.args} />
          </mesh>
        ))}
      </Grow>
      <Grow drive={drive} at={[buildingTimeline.roof[0] + 0.02, buildingTimeline.roof[0] + 0.07]} position={[CORE_X, ROOF, CORE_Z]}>
        <mesh position-y={1} material={materials.core} castShadow>
          <boxGeometry args={[CORE_WIDTH, 2, CORE_DEPTH]} />
        </mesh>
      </Grow>
      <Grow drive={drive} at={[buildingTimeline.roof[0] + 0.05, buildingTimeline.roof[1]]} position-y={ROOF}>
        <mesh position={[2.6, 0.8, 2.4]} material={materials.panel} castShadow>
          <boxGeometry args={[2.8, 1.6, 2.2]} />
        </mesh>
        <mesh position={[-5, 0.6, 2.8]} material={materials.panel} castShadow>
          <boxGeometry args={[2, 1.2, 1.6]} />
        </mesh>
      </Grow>

      <Crane drive={drive} steel={materials.steel} panel={materials.panel} concrete={materials.concrete} dark={materials.dark} />

      <Grow drive={drive} at={[0.04, 0.14]} position={[-11.6, 0, 7]} rotation-y={-2.53}>
        <Gauge
          drive={drive}
          position={[0, 0, 0]}
          height={ROOF}
          ticks={LEVELS}
          fill={structureFill}
          thickness={0.09}
          tickLength={0.9}
        />
      </Grow>
    </>
  );
}

/** Building massing that rises floor by floor with scroll progress. */
export default function BuildingScene(props: SceneProps) {
  return (
    <SceneCanvas tier={props.tier} className={SCENE_FRAME_MASK}>
      <Building {...props} />
    </SceneCanvas>
  );
}
