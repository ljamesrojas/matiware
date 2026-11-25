import { memo } from "react";
import { Box, Cyl } from "../primitives";
import { C, METAL } from "../palette";

const Y = 0.02; // top face of the board (local)

/** Laptop motherboard, 4.4 × 1.6, with slots, ports on the right edge and power circuits. */
export const LogicBoard = memo(function LogicBoard() {
  return (
    <group>
      <Box size={[4.4, 0.04, 1.6]} color={C.pcb} />

      {/* SO-DIMM slot, M.2 slots for the SSD and Wi-Fi card */}
      <Box size={[1.45, 0.05, 0.1]} position={[0.25, Y + 0.025, -0.58]} color={C.slot} />
      <Box size={[0.08, 0.05, 0.26]} position={[0.6, Y + 0.025, 0.4]} color={C.slot} />
      <Cyl radius={0.04} height={0.03} segments={14} position={[2.15, Y + 0.015, 0.4]} {...METAL} noEdges />
      <Box size={[0.06, 0.05, 0.24]} position={[1.4, Y + 0.025, -0.4]} color={C.slot} />

      {/* voltage regulators (chokes) beside the processor */}
      {[-1.9, -1.7, -1.5, -1.1, -0.9].map((x) => (
        <Box key={x} size={[0.14, 0.08, 0.14]} position={[x, Y + 0.04, 0.5]} color={C.dark} />
      ))}

      {/* controller chips */}
      <Box size={[0.25, 0.02, 0.25]} position={[0.9, Y + 0.01, 0.45]} color={C.darker} />
      <Box size={[0.3, 0.02, 0.2]} position={[-0.2, Y + 0.01, 0.5]} color={C.darker} />
      <Box size={[0.2, 0.02, 0.2]} position={[1.6, Y + 0.01, 0.55]} color={C.darker} />

      {/* ports on the right edge: 2 × USB-C, USB-A, HDMI */}
      <Box size={[0.18, 0.06, 0.16]} position={[2.12, Y + 0.03, 0.6]} {...METAL} />
      <Box size={[0.18, 0.06, 0.16]} position={[2.12, Y + 0.03, 0.3]} {...METAL} />
      <Box size={[0.24, 0.1, 0.28]} position={[2.08, Y + 0.05, -0.1]} {...METAL} />
      <Box size={[0.22, 0.1, 0.3]} position={[2.09, Y + 0.05, -0.55]} color={C.dark} />

      {/* display (eDP) and battery connectors */}
      <Box size={[0.3, 0.04, 0.1]} position={[-0.5, Y + 0.02, -0.72]} color={C.darker} />
      <Box size={[0.35, 0.05, 0.1]} position={[-0.5, Y + 0.025, 0.72]} color={C.darker} />

      {/* screw holes */}
      {[
        [-2.05, -0.65],
        [2.05, -0.7],
        [-2.05, 0.65],
        [0.0, 0.0],
      ].map(([x, z]) => (
        <Cyl key={`${x}${z}`} radius={0.045} height={0.006} segments={16} position={[x, Y + 0.003, z]} {...METAL} noEdges />
      ))}
    </group>
  );
});
