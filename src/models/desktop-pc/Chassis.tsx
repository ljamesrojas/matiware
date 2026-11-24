import { memo } from "react";
import { Box, Cyl, Ring } from "../primitives";
import { C } from "./palette";

/** Open-side mid tower. Outer size 4.4 (x) × 4.6 (y) × 2.1 (z); the +z side panel is removed. */
export const Chassis = memo(function Chassis() {
  return (
    <group>
      {/* motherboard tray / far side panel */}
      <Box size={[4.4, 4.6, 0.05]} position={[0, 0, -1.025]} color={C.panel} />
      {/* top and bottom */}
      <Box size={[4.4, 0.05, 2.1]} position={[0, 2.275, 0]} color={C.panelLight} />
      <Box size={[4.4, 0.05, 2.1]} position={[0, -2.275, 0]} color={C.panelLight} />
      {/* front panel with a vented insert */}
      <Box size={[0.1, 4.6, 2.1]} position={[2.15, 0, 0]} color={C.panelLight} />
      <Box size={[0.02, 3.1, 1.3]} position={[2.205, 0.45, 0]} color={C.panelDark} />
      {/* rear panel */}
      <Box size={[0.05, 4.6, 2.1]} position={[-2.175, 0, 0]} color={C.panelDark} />

      {/* rear details: exhaust grille, expansion slot covers, PSU opening */}
      <group position={[-2.205, 1.5, 0.25]} rotation={[0, Math.PI / 2, 0]}>
        {[0.16, 0.28, 0.4, 0.5].map((r) => (
          <Ring key={r} radius={r} tube={0.014} color={C.edge} />
        ))}
      </group>
      {Array.from({ length: 7 }, (_, i) => (
        <Box
          key={i}
          size={[0.015, 0.07, 0.9]}
          position={[-2.207, 0.38 - i * 0.2, -0.35]}
          color={C.panel}
          noEdges
        />
      ))}
      <Box size={[0.012, 0.78, 1.3]} position={[-2.205, -1.82, 0]} color={C.darker} noEdges />

      {/* top: vent and front I/O */}
      <Box size={[2.2, 0.008, 1.2]} position={[-0.4, 2.302, 0]} color={C.panelDark} noEdges />
      <Cyl radius={0.09} height={0.03} position={[1.75, 2.315, 0.45]} color={C.dark} />
      <Box size={[0.07, 0.02, 0.2]} position={[1.4, 2.31, 0.45]} color={C.darker} noEdges />
      <Box size={[0.07, 0.02, 0.2]} position={[1.25, 2.31, 0.45]} color={C.darker} noEdges />

      {/* drive cage at the front bottom */}
      <Box size={[1.25, 0.04, 1.7]} position={[1.47, -1.55, 0.05]} color={C.panelDark} />
      <Box size={[1.25, 0.7, 0.03]} position={[1.47, -1.9, -0.83]} color={C.panelDark} />
      <Box size={[0.04, 0.7, 0.04]} position={[0.87, -1.9, 0.86]} color={C.panelDark} />
      <Box size={[1.2, 0.03, 0.05]} position={[1.47, -2.095, -0.6]} color={C.panelDark} noEdges />
      <Box size={[1.2, 0.03, 0.05]} position={[1.47, -2.095, 0.7]} color={C.panelDark} noEdges />

      {/* feet */}
      {[-1.8, 1.8].flatMap((x) =>
        [-0.75, 0.75].map((z) => (
          <Cyl key={`${x}${z}`} radius={0.16} height={0.25} position={[x, -2.425, z]} color={C.dark} />
        )),
      )}
    </group>
  );
});
