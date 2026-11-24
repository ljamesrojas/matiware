import { memo } from "react";
import { Box, Cyl, Fan } from "../primitives";
import { C, METAL } from "./palette";

const FINS = 14;

/**
 * Tower air cooler. Local origin is the fin-stack center; the base sits on the CPU at z ≈ −0.85.
 * Fins are stacked away from the board; the fan sits on the front (+x) face.
 */
export const CpuCooler = memo(function CpuCooler() {
  return (
    <group>
      {/* contact base and mounting bar */}
      <Box size={[0.4, 0.4, 0.12]} position={[0, 0, -0.85]} {...METAL} />
      <Box size={[0.72, 0.08, 0.04]} position={[0, 0, -0.8]} color={C.dark} />

      {/* heat pipes */}
      {[-0.36, -0.12, 0.12, 0.36].map((y) => (
        <Cyl
          key={y}
          radius={0.035}
          height={1.47}
          segments={12}
          position={[-0.05, y, -0.115]}
          rotation={[Math.PI / 2, 0, 0]}
          {...METAL}
          noEdges
        />
      ))}

      {/* fin stack */}
      {Array.from({ length: FINS }, (_, i) => (
        <Box
          key={i}
          size={[0.5, 1.2, 0.022]}
          position={[-0.05, 0, -0.62 + (i * 1.24) / (FINS - 1)]}
          {...METAL}
          noEdges={i !== 0 && i !== FINS - 1}
        />
      ))}
      <Box size={[0.52, 1.22, 0.04]} position={[-0.05, 0, 0.66]} color={C.dark} />

      {/* fan on the front face */}
      <Fan size={1.2} depth={0.25} position={[0.33, 0, 0.02]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
});
