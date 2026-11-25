import { memo } from "react";
import { Box, Cyl } from "../primitives";
import { C, METAL } from "../palette";

/** M.2 2230 Wi-Fi card with a metal shield and two antenna cables running to the back. */
export const WifiCard = memo(function WifiCard() {
  return (
    <group>
      <Box size={[0.6, 0.02, 0.44]} color={C.slot} />
      <Box size={[0.36, 0.03, 0.3]} position={[-0.04, 0.025, 0]} {...METAL} />
      {[-0.1, 0.1].map((z) => (
        <Cyl key={z} radius={0.035} height={0.02} segments={12} position={[0.23, 0.02, z]} color={C.gold} noEdges />
      ))}
      <Box size={[0.025, 0.02, 0.5]} position={[0.23, 0.035, -0.32]} color={C.darker} noEdges />
      <Box size={[0.025, 0.02, 0.5]} position={[0.29, 0.035, -0.27]} color={C.dark} noEdges />
    </group>
  );
});
