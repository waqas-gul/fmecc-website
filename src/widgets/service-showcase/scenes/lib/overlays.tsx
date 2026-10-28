import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BoxGeometry,
  Color,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
  type Group,
  type InstancedMesh,
} from "three";

import { palette } from "./palette";
import type { Vec3 } from "./progressive";
import { useDisposables } from "./useDisposables";
import type { SceneDrive } from "./useSceneDriver";

// Technical overlays (planning/DESIGN.md §9.2, §11): setting-out lines, section markers, floor
// ticks and the rise indicator are cyan, unlit and exempt from tone mapping so they read as
// annotation rather than material.

/** A flat strip on the ground plane: centre, length, width and rotation about Y. */
export interface Mark {
  x: number;
  z: number;
  length: number;
  width: number;
  angle: number;
}

/** A solid line on the ground from `a` to `b`, given as [x, z]. */
export function line(a: [number, number], b: [number, number], width: number): Mark {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  return { x: (a[0] + b[0]) / 2, z: (a[1] + b[1]) / 2, length: Math.hypot(dx, dz), width, angle: -Math.atan2(dz, dx) };
}

/** A dashed line on the ground from `a` to `b`. */
export function dashed(a: [number, number], b: [number, number], width: number, dash: number, gap: number): Mark[] {
  const total = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const marks: Mark[] = [];
  for (let start = 0; start < total; start += dash + gap) {
    const end = Math.min(start + dash, total);
    const at = (d: number): [number, number] => [a[0] + ((b[0] - a[0]) * d) / total, a[1] + ((b[1] - a[1]) * d) / total];
    marks.push(line(at(start), at(end), width));
  }
  return marks;
}

/** A survey cross at [x, z]. */
export function cross(x: number, z: number, size: number, width: number): Mark[] {
  return [line([x - size, z], [x + size, z], width), line([x, z - size], [x, z + size], width)];
}

const dummy = new Object3D();

/** Ground marks in one instanced draw call whose opacity follows progress. */
export function GroundMarks({
  marks,
  drive,
  opacity,
  color = palette.cyan500,
  y = 0.01,
}: {
  marks: readonly Mark[];
  drive: RefObject<SceneDrive>;
  opacity: (progress: number) => number;
  color?: string;
  y?: number;
}) {
  const { geometry, material } = useDisposables(() => ({
    geometry: new PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
    material: new MeshBasicMaterial({ color, transparent: true, depthWrite: false, toneMapped: false }),
  }));
  const mesh = useRef<InstancedMesh>(null);
  const placed = useRef(false);

  useFrame(() => {
    const instanced = mesh.current;
    if (!instanced) return;
    if (!placed.current) {
      marks.forEach((mark, index) => {
        dummy.position.set(mark.x, y, mark.z);
        dummy.rotation.set(0, mark.angle, 0);
        dummy.scale.set(mark.length, 1, mark.width);
        dummy.updateMatrix();
        instanced.setMatrixAt(index, dummy.matrix);
      });
      instanced.instanceMatrix.needsUpdate = true;
      placed.current = true;
    }
    const value = opacity(drive.current.progress);
    instanced.visible = value > 0.002;
    (instanced.material as MeshBasicMaterial).opacity = value;
  });

  return <instancedMesh ref={mesh} args={[geometry, material, marks.length]} frustumCulled={false} renderOrder={1} />;
}

const LIT = new Color(palette.cyan500);
const UNLIT = new Color(palette.neutral700);

/**
 * Vertical gauge: a rail, a cyan fill that follows `fill(progress)` and ticks at the given
 * heights that light up as the fill passes them. Used for section markers, floor ticks and
 * the bollard rise indicator.
 */
export function Gauge({
  drive,
  position,
  height,
  ticks,
  fill,
  thickness,
  tickLength,
}: {
  drive: RefObject<SceneDrive>;
  position: Vec3;
  height: number;
  ticks: readonly number[];
  fill: (progress: number) => number;
  thickness: number;
  tickLength: number;
}) {
  const resources = useDisposables(() => ({
    rail: new MeshBasicMaterial({ color: palette.neutral700, toneMapped: false }),
    lit: new MeshBasicMaterial({ color: palette.cyan500, toneMapped: false }),
    tick: new MeshBasicMaterial({ toneMapped: false }),
    tickGeometry: new BoxGeometry(tickLength, thickness, thickness).translate(tickLength / 2, 0, 0),
  }));
  const fillRef = useRef<Group>(null);
  const tickRef = useRef<InstancedMesh>(null);
  const lastLit = useRef(-1);
  const tickYs = useMemo(() => [...ticks], [ticks]);

  useFrame(() => {
    const amount = Math.min(1, Math.max(0, fill(drive.current.progress)));
    const bar = fillRef.current;
    if (bar) {
      bar.visible = amount > 0.001;
      bar.scale.y = Math.max(amount, 1e-4);
    }
    const instanced = tickRef.current;
    if (!instanced) return;
    const reached = amount * height + 1e-3;
    const litCount = tickYs.filter((y) => y <= reached).length;
    if (litCount === lastLit.current) return;
    if (lastLit.current < 0) {
      tickYs.forEach((y, index) => {
        dummy.position.set(0, y, 0);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        instanced.setMatrixAt(index, dummy.matrix);
      });
      instanced.instanceMatrix.needsUpdate = true;
    }
    tickYs.forEach((y, index) => instanced.setColorAt(index, y <= reached ? LIT : UNLIT));
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;
    lastLit.current = litCount;
  });

  return (
    <group position={position}>
      <mesh position-y={height / 2} material={resources.rail}>
        <boxGeometry args={[thickness * 0.6, height, thickness * 0.6]} />
      </mesh>
      <group ref={fillRef}>
        <mesh position-y={height / 2} material={resources.lit}>
          <boxGeometry args={[thickness, height, thickness]} />
        </mesh>
      </group>
      <instancedMesh
        ref={tickRef}
        args={[resources.tickGeometry, resources.tick, tickYs.length]}
        frustumCulled={false}
      />
    </group>
  );
}
