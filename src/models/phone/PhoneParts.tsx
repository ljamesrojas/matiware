import { memo } from "react";
import { Box, Cyl, Ring } from "../primitives";
import { C, METAL } from "../palette";

const COPPER = { color: C.copper, roughness: 0.5, metalness: 0.2 } as const;
const FACE_Z = [Math.PI / 2, 0, 0] as [number, number, number]; // cylinder axis along z

/** Thin copper vapor chamber that spreads heat from the SoC. */
export const VaporChamber = memo(function VaporChamber() {
  return <Box size={[2.2, 3.0, 0.02]} {...COPPER} />;
});

/** Single-cell battery with label, pull tabs and flex cable to the board. */
export const PhoneBattery = memo(function PhoneBattery() {
  return (
    <group>
      <Box size={[3.1, 3.9, 0.16]} color={C.dark} />
      <Box size={[2.6, 2.9, 0.004]} position={[0, 0.2, 0.082]} color={C.panel} noEdges />
      <Box size={[0.3, 0.25, 0.004]} position={[-0.8, -2.0, 0.08]} color={C.panelLight} noEdges />
      <Box size={[0.3, 0.25, 0.004]} position={[0.8, -2.0, 0.08]} color={C.panelLight} noEdges />
      <Box size={[0.4, 0.5, 0.01]} position={[0.72, 1.9, 0.09]} color={C.darker} />
    </group>
  );
});

/** Logic board with shield cans and connectors (the SoC, RAM and storage are separate parts). */
export const PhoneBoard = memo(function PhoneBoard() {
  return (
    <group>
      <Box size={[1.95, 2.4, 0.05]} color={C.pcb} />
      <Box size={[0.6, 0.5, 0.04]} position={[0.55, 0.65, 0.045]} {...METAL} />
      <Box size={[0.7, 0.45, 0.04]} position={[-0.4, -0.65, 0.045]} {...METAL} />
      <Box size={[0.35, 0.12, 0.04]} position={[0, -1.1, 0.045]} color={C.darker} />
      <Box size={[0.3, 0.12, 0.04]} position={[0.3, 0.95, 0.045]} color={C.darker} />
      <Box size={[0.12, 0.3, 0.04]} position={[-0.85, 0.5, 0.045]} color={C.darker} />
      {[
        [-0.8, 1.05],
        [0.85, -1.05],
      ].map(([x, y]) => (
        <Cyl key={`${x}${y}`} radius={0.05} height={0.01} segments={14} position={[x, y, 0.03]} rotation={FACE_Z} {...METAL} noEdges />
      ))}
    </group>
  );
});

/** SoC package on its substrate. */
export const PhoneSoc = memo(function PhoneSoc() {
  return (
    <group>
      <Box size={[0.7, 0.7, 0.015]} position={[0, 0, -0.0125]} color={C.slot} />
      <Box size={[0.62, 0.62, 0.025]} position={[0, 0, 0.007]} color={C.darker} roughness={0.35} />
    </group>
  );
});

/** LPDDR5X memory package, stacked on the SoC. */
export const PhoneRam = memo(function PhoneRam() {
  return (
    <group>
      <Box size={[0.62, 0.62, 0.035]} color={C.dark} />
      <Cyl radius={0.03} height={0.004} segments={10} position={[-0.24, -0.24, 0.019]} rotation={FACE_Z} color={C.panel} noEdges />
    </group>
  );
});

/** UFS storage chip. */
export const PhoneStorage = memo(function PhoneStorage() {
  return (
    <group>
      <Box size={[0.55, 0.45, 0.035]} color={C.darker} roughness={0.35} />
      <Cyl radius={0.025} height={0.004} segments={10} position={[-0.2, -0.15, 0.019]} rotation={FACE_Z} color={C.panel} noEdges />
    </group>
  );
});

/** USB-C sub-board at the bottom, with the flex cable running up to the logic board. */
export const UsbCPort = memo(function UsbCPort() {
  return (
    <group>
      <Box size={[1.4, 0.5, 0.04]} color={C.pcb} />
      <Box size={[0.4, 0.14, 0.12]} position={[0, -0.22, 0.03]} {...METAL} />
      <Box size={[0.12, 4.1, 0.01]} position={[1.62, 2.35, 0.05]} color={C.darker} noEdges />
    </group>
  );
});

/** Rear camera module: two lenses with metal rings, a flash and a flex cable. */
export const CameraModule = memo(function CameraModule() {
  return (
    <group>
      <Box size={[1.3, 1.7, 0.22]} color={C.dark} />
      {[0.42, -0.42].map((y) => (
        <group key={y}>
          <Cyl radius={0.33} height={0.1} segments={32} position={[0, y, 0.14]} rotation={FACE_Z} {...METAL} />
          <Cyl radius={0.24} height={0.13} segments={32} position={[0, y, 0.155]} rotation={FACE_Z} color="#22303A" roughness={0.25} />
        </group>
      ))}
      <Cyl radius={0.08} height={0.06} segments={16} position={[0.45, 0, 0.13]} rotation={FACE_Z} color={C.panelLight} noEdges />
      <Box size={[0.5, 0.12, 0.01]} position={[0.75, 0.15, 0]} color={C.darker} noEdges />
    </group>
  );
});

/** Back glass with the camera bump and the wireless charging coil on its inside face. */
export const BackGlass = memo(function BackGlass() {
  return (
    <group>
      <Box size={[3.7, 7.5, 0.03]} color={C.glass} roughness={0.3} />
      <Box size={[1.5, 1.9, 0.04]} position={[-1.0, 2.6, 0.035]} color={C.glass} roughness={0.3} />
      <Ring radius={0.7} tube={0.05} position={[0, -0.3, -0.03]} color={C.copper} />
      <Ring radius={0.45} tube={0.05} position={[0, -0.3, -0.03]} color={C.copper} />
    </group>
  );
});
