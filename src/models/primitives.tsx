import { DoubleSide } from "three";
import type { Vec3 } from "../types";

/**
 * Small building blocks for low-poly part models.
 * Every mesh gets its own material so PartMesh can fade each part on its own.
 * `noEdges` skips the outline edges PartMesh adds (for tiny or curved details).
 */

interface MatProps {
  color: string;
  roughness?: number;
  metalness?: number;
}

interface PlaceProps {
  position?: Vec3;
  rotation?: Vec3;
  noEdges?: boolean;
}

const edgeData = (noEdges?: boolean) => (noEdges ? { noEdges: true } : undefined);

export function Box({
  size,
  color,
  roughness = 0.8,
  metalness = 0,
  position,
  rotation,
  noEdges,
}: { size: Vec3 } & MatProps & PlaceProps) {
  return (
    <mesh position={position} rotation={rotation} userData={edgeData(noEdges)}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}

/** Cylinder whose axis runs along local Y unless rotated. */
export function Cyl({
  radius,
  height,
  segments = 32,
  open = false,
  color,
  roughness = 0.8,
  metalness = 0,
  position,
  rotation,
  noEdges,
}: { radius: number; height: number; segments?: number; open?: boolean } & MatProps & PlaceProps) {
  return (
    <mesh position={position} rotation={rotation} userData={edgeData(noEdges)}>
      <cylinderGeometry args={[radius, radius, height, segments, 1, open]} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        side={open ? DoubleSide : undefined}
      />
    </mesh>
  );
}

/** Thin ring lying in the local XY plane. */
export function Ring({
  radius,
  tube = 0.012,
  color,
  position,
  rotation,
}: { radius: number; tube?: number } & MatProps & Omit<PlaceProps, "noEdges">) {
  return (
    <mesh position={position} rotation={rotation} userData={{ noEdges: true }}>
      <torusGeometry args={[radius, tube, 6, 64]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  );
}

interface FanProps extends PlaceProps {
  /** Outer size (square frame width, or ring diameter when frameless). */
  size?: number;
  depth?: number;
  frame?: boolean;
  blades?: number;
  frameColor?: string;
  bladeColor?: string;
}

/** Axial fan facing local +Z: optional square frame, round shroud, hub and tilted blades. */
export function Fan({
  size = 1.2,
  depth = 0.25,
  frame = true,
  blades = 7,
  frameColor = "#363B40",
  bladeColor = "#2A2E33",
  position,
  rotation,
}: FanProps) {
  const r = size * 0.46;
  const hub = size * 0.15;
  const bladeLen = r - hub - 0.02;
  const bar = size * 0.07;

  return (
    <group position={position} rotation={rotation}>
      {frame && (
        <>
          {/* square frame: four bars plus corner blocks */}
          <Box size={[size, bar, depth]} position={[0, size / 2 - bar / 2, 0]} color={frameColor} />
          <Box size={[size, bar, depth]} position={[0, -size / 2 + bar / 2, 0]} color={frameColor} />
          <Box size={[bar, size - 2 * bar, depth]} position={[size / 2 - bar / 2, 0, 0]} color={frameColor} />
          <Box size={[bar, size - 2 * bar, depth]} position={[-size / 2 + bar / 2, 0, 0]} color={frameColor} />
          {[-1, 1].flatMap((sx) =>
            [-1, 1].map((sy) => (
              <Box
                key={`${sx}${sy}`}
                size={[size * 0.16, size * 0.16, depth * 0.96]}
                position={[sx * (size / 2 - size * 0.1), sy * (size / 2 - size * 0.1), 0]}
                color={frameColor}
                noEdges
              />
            )),
          )}
        </>
      )}
      {/* round shroud */}
      <Cyl
        radius={r + 0.015}
        height={depth * 0.98}
        open
        segments={48}
        color={frameColor}
        rotation={[Math.PI / 2, 0, 0]}
      />
      {/* hub */}
      <Cyl
        radius={hub}
        height={depth * 0.7}
        segments={28}
        color={bladeColor}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, depth * 0.05]}
      />
      {/* blades */}
      {Array.from({ length: blades }, (_, i) => (
        <group key={i} rotation={[0, 0, (i / blades) * Math.PI * 2]}>
          <Box
            size={[bladeLen, size * 0.17, 0.012]}
            position={[hub + bladeLen / 2, 0, depth * 0.05]}
            rotation={[0.5, 0, 0]}
            color={bladeColor}
            noEdges
          />
        </group>
      ))}
    </group>
  );
}
