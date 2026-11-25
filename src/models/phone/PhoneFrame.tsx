import { memo } from "react";
import { Box } from "../primitives";
import { C, METAL } from "../palette";

/** Aluminum side rails with antenna splits and buttons, plus the midframe plate. */
export const PhoneFrame = memo(function PhoneFrame() {
  return (
    <group>
      <Box size={[0.12, 7.5, 0.4]} position={[-1.79, 0, 0]} {...METAL} />
      <Box size={[0.12, 7.5, 0.4]} position={[1.79, 0, 0]} {...METAL} />
      <Box size={[3.46, 0.12, 0.4]} position={[0, 3.69, 0]} {...METAL} />
      <Box size={[3.46, 0.12, 0.4]} position={[0, -3.69, 0]} {...METAL} />
      <Box size={[3.46, 7.26, 0.04]} position={[0, 0, -0.1]} color={C.panelDark} />

      {/* antenna splits in the rails */}
      {[-1.79, 1.79].flatMap((x) =>
        [-3.0, 3.0].map((y) => (
          <Box key={`${x}${y}`} size={[0.125, 0.04, 0.405]} position={[x, y, 0]} color={C.darker} noEdges />
        )),
      )}

      {/* buttons */}
      <Box size={[0.05, 0.5, 0.12]} position={[-1.875, 1.4, 0]} {...METAL} />
      <Box size={[0.05, 0.5, 0.12]} position={[-1.875, 0.7, 0]} {...METAL} />
      <Box size={[0.05, 0.8, 0.12]} position={[1.875, 1.1, 0]} {...METAL} />
    </group>
  );
});
