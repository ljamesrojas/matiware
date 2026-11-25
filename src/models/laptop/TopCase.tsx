import { memo } from "react";
import { Box } from "../primitives";
import { C } from "../palette";

const KEY = 0.36;
const PITCH = 0.4;
const KEY_Y = 0.035;

/** Top case (palm rest) with keyboard and touchpad. */
export const TopCase = memo(function TopCase() {
  const keys: { x: number; z: number; w: number }[] = [];
  // Four full rows of 13 keys.
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 13; col++) keys.push({ x: -2.4 + col * PITCH, z: -1.8 + row * PITCH, w: KEY });
  }
  // Bottom row: modifiers, space bar, arrows.
  for (const x of [-2.4, -2.0, -1.6, -1.2, 1.2, 1.6, 2.0, 2.4]) keys.push({ x, z: -0.2, w: KEY });
  keys.push({ x: 0, z: -0.2, w: 1.96 });

  return (
    <group>
      <Box size={[6.2, 0.04, 4.4]} color={C.panelDark} />
      {keys.map((k, i) => (
        <Box key={i} size={[k.w, 0.03, KEY]} position={[k.x, KEY_Y, k.z]} color={C.darker} noEdges />
      ))}
      {/* touchpad */}
      <Box size={[2.4, 0.01, 1.3]} position={[0, 0.025, 1.05]} color={C.panel} />
    </group>
  );
});
