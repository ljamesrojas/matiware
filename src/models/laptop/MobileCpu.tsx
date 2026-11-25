import { memo } from "react";
import { Box } from "../primitives";
import { C } from "../palette";

/** Soldered (BGA) laptop processor: substrate with a bare die on top. */
export const MobileCpu = memo(function MobileCpu() {
  return (
    <group>
      <Box size={[0.55, 0.02, 0.45]} position={[0, -0.005, 0]} color={C.slot} />
      <Box size={[0.32, 0.02, 0.24]} position={[-0.04, 0.012, 0]} color={C.darker} roughness={0.35} />
      <Box size={[0.1, 0.018, 0.14]} position={[0.19, 0.011, 0]} color={C.darker} roughness={0.35} noEdges />
    </group>
  );
});
