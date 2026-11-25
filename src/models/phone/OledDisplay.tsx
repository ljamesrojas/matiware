import { memo } from "react";
import { Box, Cyl } from "../primitives";
import { C } from "../palette";

/** OLED panel. The screen faces −z (away from the default camera); its back faces +z. */
export const OledDisplay = memo(function OledDisplay() {
  return (
    <group>
      <Box size={[3.6, 7.4, 0.06]} color={C.darker} />

      {/* screen side: a simple lock screen */}
      <Box size={[3.4, 7.2, 0.004]} position={[0, 0, -0.031]} color={C.screen} roughness={0.4} noEdges />
      <Box size={[1.4, 0.4, 0.003]} position={[0, 2.3, -0.034]} color={C.screenUi} roughness={0.4} noEdges />
      <Box size={[3.0, 1.1, 0.003]} position={[0, 0.9, -0.034]} color="#3A464C" roughness={0.4} noEdges />
      {[-1.2, -0.4, 0.4, 1.2].map((x) => (
        <Box key={x} size={[0.55, 0.55, 0.003]} position={[x, -3.0, -0.034]} color={C.screenUi} roughness={0.4} noEdges />
      ))}
      <Cyl radius={0.08} height={0.006} segments={16} position={[0, 3.4, -0.034]} rotation={[Math.PI / 2, 0, 0]} color={C.darker} noEdges />

      {/* back of the panel: graphite sheet and flex cable */}
      <Box size={[3.3, 6.9, 0.004]} position={[0, 0, 0.031]} color="#4A4F55" noEdges />
      <Box size={[0.5, 0.9, 0.01]} position={[0.6, 2.6, 0.04]} color={C.dark} />
    </group>
  );
});
