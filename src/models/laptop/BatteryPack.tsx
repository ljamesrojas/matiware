import { memo } from "react";
import { Box } from "../primitives";
import { C } from "../palette";

/** Three-cell battery pack across the front of the case, with its cable to the board. */
export const BatteryPack = memo(function BatteryPack() {
  return (
    <group>
      <Box size={[4.6, 0.18, 1.8]} color={C.dark} />
      {[-1.5, 0, 1.5].map((x) => (
        <Box key={x} size={[1.42, 0.01, 1.6]} position={[x, 0.095, 0]} color="#41464C" noEdges />
      ))}
      <Box size={[1.0, 0.006, 0.6]} position={[1.5, 0.102, 0.25]} color={C.panel} noEdges />
      <Box size={[0.3, 0.015, 0.55]} position={[0, 0.0, -1.17]} color={C.darker} noEdges />
    </group>
  );
});
