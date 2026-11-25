import { memo } from "react";
import { Box, Cyl } from "../primitives";
import { C } from "../palette";

/** Tilt of the open lid back from vertical. */
export const LID_TILT = (15 * Math.PI) / 180;

/** Lid with screen, bezel, webcam and hinge barrel. Local origin is the lid center. */
export const DisplayLid = memo(function DisplayLid() {
  return (
    <group rotation={[-LID_TILT, 0, 0]}>
      <Box size={[6.2, 4.15, 0.09]} position={[0, 0, -0.01]} color={C.panelDark} />
      <Box size={[6.0, 3.95, 0.01]} position={[0, 0, 0.04]} color={C.darker} />
      {/* screen with a simple desktop: a window and a taskbar */}
      <Box size={[5.6, 3.5, 0.004]} position={[0, 0.05, 0.047]} color={C.screen} roughness={0.4} noEdges />
      <Box size={[2.6, 1.6, 0.003]} position={[-0.6, 0.35, 0.05]} color={C.screenUi} roughness={0.4} noEdges />
      <Box size={[5.6, 0.18, 0.003]} position={[0, -1.6, 0.05]} color="#3A464C" roughness={0.4} noEdges />
      {/* webcam */}
      <Cyl radius={0.04} height={0.01} segments={14} position={[0, 1.88, 0.046]} rotation={[Math.PI / 2, 0, 0]} color={C.darker} noEdges />
      {/* hinge barrel */}
      <Cyl radius={0.07} height={4.6} segments={16} position={[0, -2.075, -0.01]} rotation={[0, 0, Math.PI / 2]} color={C.dark} />
    </group>
  );
});
