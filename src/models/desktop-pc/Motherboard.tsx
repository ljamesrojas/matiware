import { memo } from "react";
import { Box, Cyl } from "../primitives";
import { C, METAL } from "./palette";

const Z = 0.025; // front face of the board (local)

/** ATX board, 2.44 × 3.05. Local origin is the board center; parts sit on the +z face. */
export const Motherboard = memo(function Motherboard() {
  return (
    <group>
      <Box size={[2.44, 3.05, 0.05]} color={C.pcb} />

      {/* CPU socket: dark base with a metal retention frame */}
      <Box size={[0.58, 0.58, 0.015]} position={[0.15, 0.8, Z + 0.0075]} color={C.slot} noEdges />
      <Box size={[0.66, 0.05, 0.04]} position={[0.15, 1.115, Z + 0.02]} {...METAL} />
      <Box size={[0.66, 0.05, 0.04]} position={[0.15, 0.485, Z + 0.02]} {...METAL} />
      <Box size={[0.05, 0.58, 0.04]} position={[-0.155, 0.8, Z + 0.02]} {...METAL} />
      <Box size={[0.05, 0.58, 0.04]} position={[0.455, 0.8, Z + 0.02]} {...METAL} />

      {/* VRM heatsinks */}
      <Box size={[0.9, 0.2, 0.2]} position={[0.08, 1.33, Z + 0.1]} color={C.dark} />
      <Box size={[0.2, 0.8, 0.2]} position={[-0.42, 0.78, Z + 0.1]} color={C.dark} />

      {/* capacitors */}
      {[
        [-0.25, 0.32],
        [-0.12, 0.32],
        [0.55, 0.42],
        [0.55, 0.56],
        [0.55, 1.05],
      ].map(([x, y]) => (
        <Cyl
          key={`${x}${y}`}
          radius={0.035}
          height={0.09}
          segments={14}
          position={[x, y, Z + 0.045]}
          rotation={[Math.PI / 2, 0, 0]}
          color={C.darker}
          noEdges
        />
      ))}

      {/* two DIMM slots with latches */}
      {[0.85, 0.99].map((x) => (
        <group key={x}>
          <Box size={[0.07, 1.4, 0.08]} position={[x, 0.7, Z + 0.04]} color={C.slot} />
          <Box size={[0.075, 0.06, 0.12]} position={[x, 1.43, Z + 0.06]} color={C.panelDark} noEdges />
          <Box size={[0.075, 0.06, 0.12]} position={[x, -0.03, Z + 0.06]} color={C.panelDark} noEdges />
        </group>
      ))}

      {/* 24-pin power connector */}
      <Box size={[0.12, 0.5, 0.14]} position={[1.14, 0.2, Z + 0.07]} color={C.darker} />

      {/* M.2 slot and standoff */}
      <Box size={[0.05, 0.24, 0.05]} position={[-0.48, -0.03, Z + 0.025]} color={C.slot} />
      <Cyl radius={0.03} height={0.035} segments={12} position={[0.36, -0.03, Z + 0.018]} rotation={[Math.PI / 2, 0, 0]} {...METAL} noEdges />

      {/* PCIe slots: main x16 (reinforced), x1, second x16 */}
      <Box size={[0.9, 0.07, 0.09]} position={[-0.6, -0.4, Z + 0.045]} color={C.slot} />
      <Box size={[0.92, 0.085, 0.03]} position={[-0.6, -0.4, Z + 0.075]} {...METAL} noEdges />
      <Box size={[0.25, 0.06, 0.08]} position={[-0.92, -0.75, Z + 0.04]} color={C.slot} />
      <Box size={[0.9, 0.07, 0.09]} position={[-0.6, -1.05, Z + 0.045]} color={C.slot} />

      {/* chipset heatsink */}
      <Box size={[0.45, 0.45, 0.07]} position={[0.6, -1.15, Z + 0.035]} color={C.dark} />
      <Box size={[0.3, 0.05, 0.075]} position={[0.6, -1.15, Z + 0.04]} {...METAL} noEdges />

      {/* rear I/O block and shield */}
      <Box size={[0.55, 0.95, 0.32]} position={[-1.3, 0.97, Z + 0.16]} color={C.dark} />
      <Box size={[0.02, 1.0, 0.4]} position={[-1.585, 0.97, Z + 0.18]} {...METAL} />

      {/* screw holes */}
      {[
        [-1.1, 1.4],
        [1.1, 1.4],
        [-1.1, -1.4],
        [1.1, -1.4],
        [0.15, 0.1],
      ].map(([x, y]) => (
        <Cyl
          key={`${x}${y}`}
          radius={0.045}
          height={0.006}
          segments={16}
          position={[x, y, Z + 0.003]}
          rotation={[Math.PI / 2, 0, 0]}
          {...METAL}
          noEdges
        />
      ))}
    </group>
  );
});
