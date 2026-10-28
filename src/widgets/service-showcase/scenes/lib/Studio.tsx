import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Grid } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import {
  CanvasTexture,
  Color,
  DoubleSide,
  type DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  type WebGLRenderer,
} from "three";

import type { DeviceTier } from "@/shared/three";

import { palette } from "./palette";
import { useDisposables } from "./useDisposables";

/**
 * Image-based lighting for the steel and glass: a dark navy room with an overhead softbox, a white
 * key panel, a cyan strip behind the subject (rim reflections) and a cool blue fill strip.
 * Built once with PMREM, so no HDR file is downloaded and Drei's loaders stay out of the bundle.
 */
function createEnvironment(gl: WebGLRenderer) {
  const room = new Scene();
  room.background = new Color(palette.navy900);
  const geometry = new PlaneGeometry(1, 1);
  const materials: MeshBasicMaterial[] = [];
  const panel = (color: string, strength: number, size: [number, number], position: [number, number, number]) => {
    const material = new MeshBasicMaterial({ color: new Color(color).multiplyScalar(strength), side: DoubleSide });
    const mesh = new Mesh(geometry, material);
    mesh.scale.set(size[0], size[1], 1);
    mesh.position.set(...position);
    mesh.lookAt(0, 0, 0);
    materials.push(material);
    room.add(mesh);
  };
  panel(palette.white, 3.2, [12, 12], [0, 10, 2]);
  panel(palette.white, 1.8, [8, 5], [-9, 4, 7]);
  panel(palette.cyan500, 2.6, [2, 10], [10, 3, -6]);
  panel(palette.blue500, 1, [3, 10], [-10, 3, -6]);

  const generator = new PMREMGenerator(gl);
  const target = generator.fromScene(room, 0.03);
  generator.dispose();
  geometry.dispose();
  materials.forEach((material) => material.dispose());
  return target;
}

/** A soft pool of light on the floor (navy-800 fading out), so shadows have something to fall on. */
function createFloorTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const context = canvas.getContext("2d")!;
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, "rgb(26 39 73 / 0.9)");
  gradient.addColorStop(0.45, "rgb(18 28 51 / 0.65)");
  gradient.addColorStop(1, "rgb(18 28 51 / 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export interface StudioProps {
  tier: DeviceTier;
  /** Half-size of the area the key light's shadow covers, in scene units. */
  extent: number;
  /** Distance of the key light from the origin. */
  distance: number;
  /** Grid cell and section sizes and the radius at which the grid has faded out. */
  grid: { cell: number; section: number; fade: number };
  /** Height of the floor (shadow catcher and grid); below 0 when the subject is a cutaway block. */
  floor?: number;
  /** Cyan rim light intensity; lower for close product views with large flat faces. */
  rim?: number;
}

/**
 * Shared look (planning/DESIGN.md §11): white key light with soft PCF shadows, cyan rim light, a
 * faint purple bounce opposite the rim (the only purple in 3D), environment reflections, a shadow
 * catcher and a fading technical grid on a transparent canvas over the section surface.
 */
export function Studio({ tier, extent, distance, grid, floor: floorY = 0, rim = 2.4 }: StudioProps) {
  const gl = useThree((state) => state.gl);
  const environment = useMemo(() => createEnvironment(gl), [gl]);
  useEffect(() => () => environment.dispose(), [environment]);
  const { floor } = useDisposables(() => ({ floor: createFloorTexture() }));
  const keyLight = useRef<DirectionalLight>(null);

  // R3F sets the shadow camera's bounds as plain properties; three only reads them after this.
  useLayoutEffect(() => {
    keyLight.current?.shadow.camera.updateProjectionMatrix();
  }, [extent, distance]);

  const key: [number, number, number] = [-0.45 * distance, 0.8 * distance, 0.4 * distance];
  const mapSize = tier === "high" ? 2048 : 1024;

  return (
    <>
      <primitive object={environment.texture} attach="environment" />
      <hemisphereLight args={[palette.blue100, palette.navy900, 0.45]} />
      <directionalLight
        ref={keyLight}
        position={key}
        intensity={2.6}
        castShadow
        shadow-mapSize={[mapSize, mapSize]}
        shadow-radius={5}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02 * (extent / 10)}
        shadow-camera-left={-extent}
        shadow-camera-right={extent}
        shadow-camera-top={extent}
        shadow-camera-bottom={-extent}
        shadow-camera-near={distance * 0.3}
        shadow-camera-far={distance * 2.2}
      />
      {/* Rim from behind the subject (the cameras look in from +x/+z), so cyan traces edges. */}
      <directionalLight position={[0.3 * distance, 0.4 * distance, -0.85 * distance]} intensity={rim} color={palette.cyan500} />
      <directionalLight position={[-0.85 * distance, 0.15 * distance, -0.3 * distance]} intensity={0.3} color={palette.purple500} />
      <group position-y={floorY}>
        <mesh rotation-x={-Math.PI / 2} renderOrder={-2}>
          <circleGeometry args={[grid.fade, 64]} />
          <meshBasicMaterial map={floor} transparent depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position-y={0.0005 * extent} receiveShadow renderOrder={-1}>
          <planeGeometry args={[extent * 4, extent * 4]} />
          <shadowMaterial transparent opacity={0.55} depthWrite={false} />
        </mesh>
        <Grid
          renderOrder={0}
          position-y={0.002 * extent}
          args={[grid.fade * 2, grid.fade * 2]}
          cellSize={grid.cell}
          cellThickness={0.6}
          cellColor={palette.navy800}
          sectionSize={grid.section}
          sectionThickness={1}
          sectionColor={palette.navy700}
          fadeDistance={grid.fade}
          fadeStrength={1.5}
          fadeFrom={0}
        />
      </group>
    </>
  );
}
