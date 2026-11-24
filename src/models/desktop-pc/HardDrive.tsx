import { memo } from "react";
import { Box, Cyl } from "../primitives";
import { C, METAL } from "./palette";

/** 3.5" drive lying flat in the drive cage: metal lid with a platter circle, PCB underneath. */
export const HardDrive = memo(function HardDrive() {
  return (
    <group>
      <Box size={[1.02, 0.2, 1.47]} position={[0, 0.03, 0]} {...METAL} />
      <Box size={[0.96, 0.05, 1.3]} position={[0, -0.105, 0]} color={C.slot} />

      {/* platter, spindle and actuator arm */}
      <Cyl radius={0.4} height={0.012} segments={48} position={[0, 0.136, 0.18]} color={C.platter} roughness={0.5} />
      <Cyl radius={0.08} height={0.02} segments={20} position={[0, 0.142, 0.18]} {...METAL} noEdges />
      <Box size={[0.07, 0.014, 0.55]} position={[0.3, 0.145, -0.25]} rotation={[0, 0.45, 0]} color={C.dark} noEdges />
      <Cyl radius={0.06} height={0.02} segments={16} position={[0.38, 0.145, -0.48]} color={C.dark} noEdges />

      {/* SATA data and power connectors at the back */}
      <Box size={[0.16, 0.06, 0.03]} position={[-0.28, -0.05, -0.74]} color={C.darker} noEdges />
      <Box size={[0.3, 0.06, 0.03]} position={[0.08, -0.05, -0.74]} color={C.darker} noEdges />
    </group>
  );
});
