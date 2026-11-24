import { memo } from "react";
import { Box, Fan, Ring } from "../primitives";
import { C } from "./palette";

/** ATX power supply at the bottom rear: fan grille on top, label on the open side, socket at the back. */
export const PowerSupply = memo(function PowerSupply() {
  return (
    <group>
      <Box size={[1.5, 0.85, 1.4]} color={C.dark} />

      {/* fan and grille on top */}
      <Fan size={1.12} depth={0.06} frame={false} position={[0.05, 0.39, 0]} rotation={[-Math.PI / 2, 0, 0]} frameColor={C.darker} />
      <group position={[0.05, 0.428, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {[0.14, 0.27, 0.4, 0.53].map((r) => (
          <Ring key={r} radius={r} tube={0.012} color={C.edge} />
        ))}
      </group>
      <Box size={[1.08, 0.008, 0.024]} position={[0.05, 0.43, 0]} color={C.edge} noEdges />
      <Box size={[0.024, 0.008, 1.08]} position={[0.05, 0.43, 0]} color={C.edge} noEdges />

      {/* label */}
      <Box size={[0.9, 0.48, 0.006]} position={[0.1, 0, 0.703]} color={C.panel} />
      {[0.12, 0.03, -0.06, -0.15].map((y, i) => (
        <Box key={y} size={[i === 0 ? 0.42 : 0.66, 0.025, 0.004]} position={[0.1 - (i === 0 ? 0.12 : 0), y, 0.707]} color={C.edge} noEdges />
      ))}

      {/* power socket and switch at the back */}
      <Box size={[0.02, 0.2, 0.3]} position={[-0.76, 0.15, -0.3]} color={C.darker} noEdges />
      <Box size={[0.02, 0.12, 0.08]} position={[-0.76, 0.15, 0.05]} color={C.darker} noEdges />
    </group>
  );
});
