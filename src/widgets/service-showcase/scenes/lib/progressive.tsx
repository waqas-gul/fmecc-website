import { useEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { CylinderGeometry, Matrix4, Quaternion, Vector3, type Group, type InstancedMesh, type Material } from "three";

import { ease, span } from "./math";
import type { SceneDrive } from "./useSceneDriver";

export type Vec3 = [number, number, number];

/** A straight structural member that grows from `from` to `to` during its progress window. */
export interface Member {
  from: Vec3;
  to: Vec3;
  radius: number;
  at: [start: number, end: number];
}

const UP = new Vector3(0, 1, 0);
const matrix = new Matrix4();
const scale = new Vector3();

/**
 * Every member of a lattice in one instanced draw call (planning/DESIGN.md §11). Matrices are
 * rewritten only for members whose growth changed this frame.
 */
export function Members({
  members,
  material,
  drive,
  segments = 6,
}: {
  members: readonly Member[];
  material: Material;
  drive: RefObject<SceneDrive>;
  segments?: number;
}) {
  const geometry = useMemo(() => new CylinderGeometry(1, 1, 1, segments, 1).translate(0, 0.5, 0), [segments]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const prepared = useMemo(
    () =>
      members.map(({ from, to, radius, at }) => {
        const start = new Vector3(...from);
        const direction = new Vector3(...to).sub(start);
        const length = direction.length();
        return {
          position: start,
          quaternion: new Quaternion().setFromUnitVectors(UP, direction.normalize()),
          length,
          radius,
          at,
        };
      }),
    [members],
  );

  const mesh = useRef<InstancedMesh>(null);
  const growth = useRef<Float32Array>(null);

  useFrame(() => {
    const instanced = mesh.current;
    if (!instanced) return;
    if (growth.current?.length !== prepared.length) growth.current = new Float32Array(prepared.length).fill(-1);
    const progress = drive.current.progress;
    let changed = false;
    prepared.forEach((member, index) => {
      const grown = ease(span(progress, member.at[0], member.at[1]));
      if (growth.current![index] === grown) return;
      growth.current![index] = grown;
      if (grown === 0) scale.setScalar(0);
      else scale.set(member.radius, member.length * grown, member.radius);
      instanced.setMatrixAt(index, matrix.compose(member.position, member.quaternion, scale));
      changed = true;
    });
    if (changed) instanced.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, material, prepared.length]}
      castShadow
      receiveShadow
      frustumCulled={false}
    />
  );
}

/**
 * Scales its children into place during a progress window: along Y from the group's origin
 * (rising from the ground), across X and Z (spreading, like a slab being cast) or uniformly.
 * `drop` lowers the part from above as it appears. Hidden entirely before its window, so it
 * casts no shadow and costs no draw call.
 */
export function Grow({
  drive,
  at,
  axis = "y",
  drop = 0,
  children,
  ...group
}: Omit<ThreeElements["group"], "ref"> & {
  drive: RefObject<SceneDrive>;
  at: [start: number, end: number];
  axis?: "y" | "xz" | "all";
  drop?: number;
  children: ReactNode;
}) {
  const ref = useRef<Group>(null);
  const baseY = useRef<number | null>(null);

  useFrame(() => {
    const node = ref.current;
    if (!node) return;
    baseY.current ??= node.position.y;
    const grown = ease(span(drive.current.progress, at[0], at[1]));
    node.visible = grown > 0;
    const amount = Math.max(grown, 1e-4);
    if (axis === "y") node.scale.set(1, amount, 1);
    else if (axis === "xz") node.scale.set(amount, 1, amount);
    else node.scale.setScalar(amount);
    node.position.y = baseY.current + (1 - grown) * drop;
  });

  return (
    <group ref={ref} {...group}>
      {children}
    </group>
  );
}
