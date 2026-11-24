import { memo } from "react";
import { Box, Cyl } from "../primitives";
import { C, METAL } from "./palette";

/** Square package with a raised metal heat spreader on top (+z). */
export const Cpu = memo(function Cpu() {
  return (
    <group>
      <Box size={[0.42, 0.42, 0.02]} position={[0, 0, -0.01]} color={C.pcb} />
      <Box size={[0.34, 0.34, 0.035]} position={[0, 0, 0.0175]} {...METAL} />
      {/* pin-1 marker */}
      <Cyl
        radius={0.015}
        height={0.004}
        segments={10}
        position={[-0.185, -0.185, 0.002]}
        rotation={[Math.PI / 2, 0, 0]}
        color="#B9A46A"
        noEdges
      />
    </group>
  );
});
