import { memo } from "react";
import { Box, Cyl } from "../primitives";
import { C, METAL } from "./palette";

/** M.2 2280 stick lying flat on the board, with a label, controller and contacts. */
export const Ssd = memo(function Ssd() {
  return (
    <group>
      <Box size={[0.8, 0.22, 0.02]} color={C.slot} />
      <Box size={[0.5, 0.18, 0.004]} position={[0.08, 0, 0.012]} color={C.panelLight} />
      <Box size={[0.3, 0.012, 0.002]} position={[0.03, 0.04, 0.015]} color={C.edge} noEdges />
      <Box size={[0.2, 0.012, 0.002]} position={[-0.02, 0.0, 0.015]} color={C.edge} noEdges />
      <Box size={[0.13, 0.13, 0.02]} position={[-0.26, 0, 0.012]} color={C.dark} />
      <Box size={[0.04, 0.2, 0.022]} position={[-0.385, 0, 0]} {...METAL} noEdges />
      <Cyl radius={0.03} height={0.01} segments={14} position={[0.385, 0, 0.012]} rotation={[Math.PI / 2, 0, 0]} {...METAL} noEdges />
    </group>
  );
});
