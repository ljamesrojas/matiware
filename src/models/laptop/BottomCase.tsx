import { memo } from "react";
import { Box, Cyl } from "../primitives";
import { C } from "../palette";

/** Bottom case: base plate, side walls with port openings and vents, feet and hinge mounts. */
export const BottomCase = memo(function BottomCase() {
  return (
    <group>
      <Box size={[6.2, 0.04, 4.4]} position={[0, 0.02, 0]} color={C.panelDark} />
      <Box size={[6.2, 0.28, 0.04]} position={[0, 0.18, 2.18]} color={C.panelDark} />
      <Box size={[6.2, 0.28, 0.04]} position={[0, 0.18, -2.18]} color={C.panelDark} />
      <Box size={[0.04, 0.28, 4.32]} position={[-3.08, 0.18, 0]} color={C.panelDark} />
      <Box size={[0.04, 0.28, 4.32]} position={[3.08, 0.18, 0]} color={C.panelDark} />

      {/* exhaust vent behind the fan */}
      {Array.from({ length: 9 }, (_, i) => (
        <Box key={i} size={[0.07, 0.12, 0.012]} position={[-2.85 + i * 0.13, 0.18, -2.205]} color={C.darker} noEdges />
      ))}

      {/* port openings on the right side: 2 × USB-C, USB-A, HDMI */}
      <Box size={[0.012, 0.06, 0.18]} position={[3.105, 0.17, -0.65]} color={C.darker} noEdges />
      <Box size={[0.012, 0.06, 0.18]} position={[3.105, 0.17, -0.95]} color={C.darker} noEdges />
      <Box size={[0.012, 0.1, 0.28]} position={[3.105, 0.17, -1.35]} color={C.darker} noEdges />
      <Box size={[0.012, 0.1, 0.3]} position={[3.105, 0.17, -1.8]} color={C.darker} noEdges />

      {/* hinge mounts */}
      <Box size={[0.5, 0.08, 0.25]} position={[-2.2, 0.28, -2.02]} color={C.dark} />
      <Box size={[0.5, 0.08, 0.25]} position={[2.2, 0.28, -2.02]} color={C.dark} />

      {/* rubber feet */}
      {[-2.6, 2.6].flatMap((x) =>
        [-1.8, 1.8].map((z) => (
          <Cyl key={`${x}${z}`} radius={0.18} height={0.03} position={[x, -0.005, z]} color={C.dark} noEdges />
        )),
      )}
    </group>
  );
});
