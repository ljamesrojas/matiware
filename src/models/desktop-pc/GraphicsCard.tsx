import { memo } from "react";
import { Box, Fan } from "../primitives";
import { C, METAL } from "./palette";

/**
 * Two-slot graphics card plugged into the main PCIe slot.
 * Card length runs along x, its height away from the board (z). As in a real tower,
 * the two fans face down (−y); orbit below the model to see them.
 */
export const GraphicsCard = memo(function GraphicsCard() {
  return (
    <group>
      {/* PCB and backplate (top, near the slot) */}
      <Box size={[2.4, 0.03, 1.0]} position={[0.08, 0.17, -0.04]} color={C.slot} />
      <Box size={[2.4, 0.02, 1.0]} position={[0.08, 0.2, -0.04]} color={C.dark} />

      {/* shroud */}
      <Box size={[2.5, 0.38, 1.06]} position={[0.1, -0.03, -0.02]} color={C.dark} />
      {/* accent strip on the side facing the open panel */}
      <Box size={[1.8, 0.035, 0.008]} position={[0.2, 0.02, 0.515]} color={C.edge} noEdges />

      {/* two fans on the underside */}
      <Fan size={0.92} depth={0.08} frame={false} position={[-0.5, -0.225, -0.02]} rotation={[Math.PI / 2, 0, 0]} />
      <Fan size={0.92} depth={0.08} frame={false} position={[0.62, -0.225, -0.02]} rotation={[Math.PI / 2, 0, 0]} />

      {/* power connector on the top edge */}
      <Box size={[0.24, 0.1, 0.1]} position={[0.95, 0.12, 0.55]} color={C.darker} />

      {/* metal bracket with display outputs */}
      <Box size={[0.03, 0.46, 1.15]} position={[-1.33, 0.0, -0.02]} {...METAL} />
      {[-0.32, -0.08, 0.16].map((z) => (
        <Box key={z} size={[0.02, 0.07, 0.15]} position={[-1.35, 0.05, z]} color={C.darker} noEdges />
      ))}
    </group>
  );
});
