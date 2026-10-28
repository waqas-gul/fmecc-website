"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BackSide,
  CanvasTexture,
  Color,
  ExtrudeGeometry,
  LatheGeometry,
  MathUtils,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Plane,
  RepeatWrapping,
  Shape,
  SRGBColorSpace,
  Vector2,
  Vector3,
  type Group,
  type Mesh,
} from "three";

import { SceneCanvas, type SceneProps } from "@/shared/three";

import { bollardTimeline } from "../model/timelines";
import { SCENE_FRAME_MASK } from "./lib/frame";
import { ease, lerp, settle, span } from "./lib/math";
import { Gauge } from "./lib/overlays";
import { palette } from "./lib/palette";
import { Studio } from "./lib/Studio";
import { useDisposables } from "./lib/useDisposables";
import { useSceneDriver, type SceneDrive } from "./lib/useSceneDriver";

// Cutaway of a row of automatic hydraulic security bollards set in paving, in metres. The front,
// below-ground quarter is cut away to show each housing and hydraulic ram. Generic proportions
// (Ø 275 mm, 800 mm rise); illustrative only, not a specific product.

const RADIUS = 0.1375;
const HOUSING = 0.19;
const RISE = 0.8;
const BODY = 1;
const BOLLARDS = [-1.1, 0, 1.1];
const BLOCK = { x: [-1.75, 1.75] as const, z: -1.4, depth: 1.7 };
const PAVING = 0.08;
const SUB_BASE = 0.3;

/** Rise of bollard `index` (0–1) at progress `p`: in sequence, with soft hydraulic starts and stops. */
const riseOf = (p: number, index: number) => {
  const [start, end] = bollardTimeline.rise;
  const length = end - start;
  const delay = index * bollardTimeline.stagger * length;
  return ease(span(p, start + delay, start + delay + length * (1 - (BOLLARDS.length - 1) * bollardTimeline.stagger)));
};
const heroRise = (p: number) => riseOf(p, BOLLARDS.length - 1);

/** A slab of the ground block with semicircular notches where the cut face passes through each pit. */
function notchedSlab(x0: number, x1: number, z0: number, notches: readonly number[], radius: number, thickness: number) {
  const shape = new Shape();
  shape.moveTo(x0, z0);
  shape.lineTo(x1, z0);
  shape.lineTo(x1, 0);
  [...notches]
    .sort((a, b) => b - a)
    .forEach((x) => {
      shape.lineTo(x + radius, 0);
      shape.absarc(x, 0, radius, 0, Math.PI, true);
    });
  shape.lineTo(x0, 0);
  shape.closePath();
  // Shape Y becomes world Z and the extrusion runs downwards from y = 0.
  return new ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false, curveSegments: 28 }).rotateX(Math.PI / 2);
}

/**
 * Brushed finish for the stainless bodies: fine vertical streaks of slightly different roughness
 * around the circumference (cylinder U), so highlights break up like brushed steel. Deterministic,
 * so poster renders stay identical.
 */
function createBrushedTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 4;
  const context = canvas.getContext("2d")!;
  let seed = 11;
  const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let x = 0; x < 512; x++) {
    const shade = Math.round(200 + random() * 55);
    context.fillStyle = `rgb(${shade} ${shade} ${shade})`;
    context.fillRect(x, 0, 1, 4);
  }
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(3, 1);
  texture.anisotropy = 4;
  return texture;
}

/** 400 mm pavers with fine joints; a deterministic speckle keeps poster renders identical. */
function createPavingTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const context = canvas.getContext("2d")!;
  context.fillStyle = palette.neutral300;
  context.fillRect(0, 0, 256, 256);
  let seed = 7;
  const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 2400; i++) {
    context.fillStyle = random() > 0.5 ? "rgb(255 255 255 / 0.12)" : "rgb(75 82 98 / 0.12)";
    context.fillRect(random() * 256, random() * 256, 2, 2);
  }
  context.fillStyle = palette.neutral500;
  for (const at of [0, 128]) {
    context.fillRect(at, 0, 3, 256);
    context.fillRect(0, at, 256, 3);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(1 / 0.8, 1 / 0.8);
  texture.anisotropy = 4;
  return texture;
}

function useBollardResources() {
  return useDisposables(() => {
    // Cut only where z > 0 and y < 0: the front, below-ground quarter.
    const cutaway = [new Plane(new Vector3(0, 0, -1), 0), new Plane(new Vector3(0, 1, 0), 0)];
    const front = [new Plane(new Vector3(0, 0, -1), 0)];
    const paving = createPavingTexture();
    const brushed = createBrushedTexture();
    return {
      paving,
      brushed,
      pavingMaterial: new MeshStandardMaterial({ map: paving, color: palette.neutral200, roughness: 0.85 }),
      subBase: new MeshStandardMaterial({ color: palette.neutral500, roughness: 0.95 }),
      ground: new MeshStandardMaterial({ color: palette.neutral700, roughness: 1 }),
      concrete: new MeshStandardMaterial({ color: palette.neutral400, roughness: 0.9 }),
      housing: new MeshStandardMaterial({
        color: palette.neutral400,
        metalness: 0.45,
        roughness: 0.55,
        clippingPlanes: cutaway,
        clipIntersection: true,
        clipShadows: true,
      }),
      // Brushed stainless: rough enough to pick up the key light, not just the dark room; the
      // roughness map streaks the highlights vertically.
      stainless: new MeshStandardMaterial({
        color: palette.white,
        metalness: 0.72,
        roughness: 0.24,
        roughnessMap: brushed,
        envMapIntensity: 2.8,
        clippingPlanes: cutaway,
        clipIntersection: true,
        clipShadows: true,
      }),
      // Inside faces revealed by the cut: matte and dark, so the section reads as hollow.
      interior: new MeshStandardMaterial({
        color: palette.neutral700,
        roughness: 0.9,
        side: BackSide,
        clippingPlanes: cutaway,
        clipIntersection: true,
      }),
      band: new MeshStandardMaterial({
        color: palette.white,
        roughness: 0.35,
        clippingPlanes: cutaway,
        clipIntersection: true,
      }),
      cap: new MeshStandardMaterial({ color: palette.neutral300, metalness: 1, roughness: 0.3 }),
      flange: new MeshStandardMaterial({ color: palette.neutral300, metalness: 1, roughness: 0.35, clippingPlanes: front }),
      chrome: new MeshStandardMaterial({ color: palette.white, metalness: 1, roughness: 0.08 }),
      dark: new MeshStandardMaterial({ color: palette.neutral700, metalness: 0.6, roughness: 0.5 }),
      layerPaving: notchedSlab(BLOCK.x[0], BLOCK.x[1], BLOCK.z, BOLLARDS, HOUSING + 0.01, PAVING),
      layerSubBase: notchedSlab(BLOCK.x[0], BLOCK.x[1], BLOCK.z, BOLLARDS, HOUSING + 0.01, SUB_BASE),
      layerGround: notchedSlab(BLOCK.x[0], BLOCK.x[1], BLOCK.z, BOLLARDS, HOUSING + 0.01, BLOCK.depth - PAVING - SUB_BASE),
      footing: notchedSlab(-0.34, 0.34, -0.5, [0], HOUSING + 0.01, 1.32),
      flangeGeometry: new LatheGeometry(
        [new Vector2(RADIUS + 0.008, 0), new Vector2(0.27, 0), new Vector2(0.27, 0.012), new Vector2(RADIUS + 0.008, 0.016)],
        64,
      ),
    };
  });
}

type Resources = ReturnType<typeof useBollardResources>;

const OFF = new Color(palette.neutral700);
const ON = new Color(palette.cyan500);

function Bollard({ index, x, drive, resources }: { index: number; x: number; drive: RefObject<SceneDrive>; resources: Resources }) {
  const body = useRef<Group>(null);
  const ram = useRef<Mesh>(null);
  const led = useDisposables(() => ({ material: new MeshBasicMaterial({ color: OFF.clone(), toneMapped: false }) }));
  const lastRise = useRef<number | null>(null);

  useFrame(({ clock }) => {
    const { progress, hover } = drive.current;
    const rise = riseOf(progress, index);
    const top = 0.005 + rise * RISE;
    if (body.current) body.current.position.y = top;
    if (ram.current) {
      const length = top - BODY + 1.1;
      ram.current.scale.y = length;
      ram.current.position.y = -1.1 + length / 2;
    }
    // The LED crown flashes while the bollard travels, as warning lights do, and stays lit at full
    // height; hovering brightens it slightly. Frames only run while progress is still easing, so the
    // flashing costs no extra loop and a settled bollard rests steady.
    const travelling = lastRise.current !== null && Math.abs(rise - lastRise.current) > 1e-4 && rise > 0.02 && rise < 0.98;
    lastRise.current = rise;
    const level = travelling ? (Math.sin(clock.elapsedTime * 16) > 0 ? 1 : 0.25) : span(rise, 0.6, 1);
    led.material.color.lerpColors(OFF, ON, Math.min(1, level * (0.85 + 0.15 * hover)));
  });

  return (
    <group position-x={x}>
      {[resources.housing, resources.interior].map((material) => (
        <mesh key={material.uuid} position-y={-0.72} material={material} receiveShadow>
          <cylinderGeometry args={[HOUSING, HOUSING, 1.4, 48, 1, true]} />
        </mesh>
      ))}
      <mesh position-y={-1.4} material={resources.dark} receiveShadow>
        <cylinderGeometry args={[HOUSING, HOUSING, 0.04, 48]} />
      </mesh>
      <mesh position-y={-1.24} material={resources.dark} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 24]} />
      </mesh>
      <mesh ref={ram} material={resources.chrome}>
        <cylinderGeometry args={[0.026, 0.026, 1, 20]} />
      </mesh>
      <group ref={body}>
        <mesh position-y={-BODY / 2} material={resources.stainless} castShadow receiveShadow>
          <cylinderGeometry args={[RADIUS, RADIUS, BODY, 64]} />
        </mesh>
        <mesh position-y={-BODY / 2} material={resources.interior}>
          <cylinderGeometry args={[RADIUS, RADIUS, BODY, 64, 1, true]} />
        </mesh>
        <mesh position-y={0.004} material={resources.cap} castShadow>
          <cylinderGeometry args={[RADIUS - 0.012, RADIUS, 0.012, 64]} />
        </mesh>
        <mesh position-y={-0.032} material={led.material}>
          <cylinderGeometry args={[RADIUS + 0.002, RADIUS + 0.002, 0.022, 64, 1, true]} />
        </mesh>
        <mesh position-y={-0.15} material={resources.band}>
          <cylinderGeometry args={[RADIUS + 0.0015, RADIUS + 0.0015, 0.065, 64, 1, true]} />
        </mesh>
      </group>
      <mesh geometry={resources.flangeGeometry} material={resources.flange} castShadow receiveShadow />
    </group>
  );
}

function Bollards({ progress, active, tier, reducedMotion }: SceneProps) {
  const drive = useSceneDriver({ progress, active, reducedMotion });
  const resources = useBollardResources();

  // A product view: three-quarter, just above ground level, easing in slightly as the row rises.
  // On first draw the camera settles in from slightly wider (drive.intro).
  useFrame(({ camera, size }) => {
    const { progress: p, pointerX, pointerY, intro } = drive.current;
    const t = ease(p);
    const entrance = settle(intro);
    const fit = Math.max(1, 0.8 / (size.width / size.height));
    const distance = lerp(6.9, 6.3, t) * fit * (1 + 0.1 * entrance);
    const azimuth = MathUtils.degToRad(34 + pointerX * 3 + 8 * entrance);
    camera.position.set(
      Math.sin(azimuth) * distance,
      lerp(1.5, 1.2, t) - pointerY * 0.2 + 0.35 * entrance,
      Math.cos(azimuth) * distance - 0.5,
    );
    camera.lookAt(0, lerp(-0.6, -0.45, t), -0.5);
  });

  return (
    <>
      <Studio tier={tier} extent={4} distance={10} grid={{ cell: 0.25, section: 1, fade: 7 }} floor={-BLOCK.depth} rim={1.1} />

      <mesh geometry={resources.layerPaving} material={resources.pavingMaterial} receiveShadow castShadow />
      <mesh geometry={resources.layerSubBase} material={resources.subBase} position-y={-PAVING} receiveShadow />
      <mesh geometry={resources.layerGround} material={resources.ground} position-y={-PAVING - SUB_BASE} receiveShadow castShadow />
      {BOLLARDS.map((x) => (
        // Concrete footing around each housing, a hair proud of the cut face to avoid z-fighting.
        <mesh key={x} geometry={resources.footing} material={resources.concrete} position={[x, -PAVING - 0.002, 0.003]} receiveShadow />
      ))}

      {BOLLARDS.map((x, index) => (
        <Bollard key={x} index={index} x={x} drive={drive} resources={resources} />
      ))}

      <group position={[1.62, 0, -0.42]} rotation-y={0.63}>
        <Gauge drive={drive} position={[0, 0, 0]} height={RISE} ticks={[0, 0.2, 0.4, 0.6, 0.8]} fill={heroRise} thickness={0.012} tickLength={0.07} />
      </group>
    </>
  );
}

/** Row of hydraulic bollards that rise with scroll progress and lower when scrolling back. */
export default function BollardScene(props: SceneProps) {
  return (
    <SceneCanvas tier={props.tier} className={SCENE_FRAME_MASK}>
      <Bollards {...props} />
    </SceneCanvas>
  );
}
