import { memo } from "react";
import { Box, Fan } from "../primitives";
import { C } from "../palette";

const COPPER = { color: C.copper, roughness: 0.5, metalness: 0.2 } as const;

/**
 * Cold plate on the CPU, two flat copper heat pipes routed around the blower fan,
 * and a fin stack at the back vent. Local origin sits near the fan.
 */
export const LaptopCooler = memo(function LaptopCooler() {
  return (
    <group>
      {/* cold plate over the processor */}
      <Box size={[0.7, 0.03, 0.6]} position={[0.85, -0.05, 0.15]} {...COPPER} />

      {/* heat pipes: from the cold plate, around the fan, along the fin stack */}
      <Box size={[1.0, 0.04, 0.1]} position={[0.35, -0.03, 0.1]} {...COPPER} />
      <Box size={[0.1, 0.04, 0.6]} position={[-0.15, -0.03, -0.2]} {...COPPER} />
      <Box size={[1.05, 0.04, 0.1]} position={[-0.68, -0.03, -0.5]} {...COPPER} />
      <Box size={[0.9, 0.04, 0.1]} position={[0.4, -0.03, 0.25]} {...COPPER} />
      <Box size={[0.1, 0.04, 0.85]} position={[-0.05, -0.03, -0.18]} {...COPPER} />
      <Box size={[1.15, 0.04, 0.1]} position={[-0.63, -0.03, -0.6]} {...COPPER} />

      {/* fin stack at the back vent */}
      {Array.from({ length: 14 }, (_, i) => (
        <Box
          key={i}
          size={[0.02, 0.18, 0.22]}
          position={[-1.18 + i * 0.075, 0, -0.56]}
          {...COPPER}
          noEdges={i !== 0 && i !== 13}
        />
      ))}

      {/* blower fan, facing up */}
      <Fan size={1.0} depth={0.16} frame={false} position={[-0.7, 0, 0.2]} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  );
});
