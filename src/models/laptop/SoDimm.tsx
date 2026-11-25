import { memo } from "react";
import { Box } from "../primitives";
import { C } from "../palette";

/** SO-DIMM memory module lying flat in its slot, chips on top, contacts on the back edge. */
export const SoDimm = memo(function SoDimm() {
  return (
    <group>
      <Box size={[1.39, 0.02, 0.6]} color={C.pcb} />
      {[-0.48, -0.16, 0.16, 0.48].map((x) => (
        <Box key={x} size={[0.26, 0.02, 0.2]} position={[x, 0.02, 0.06]} color={C.dark} noEdges />
      ))}
      <Box size={[1.3, 0.021, 0.06]} position={[0, 0, -0.27]} color={C.gold} noEdges />
    </group>
  );
});
