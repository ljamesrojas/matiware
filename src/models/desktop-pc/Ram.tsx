import { memo } from "react";
import { Box } from "../primitives";
import { C } from "./palette";

const CHIP_Y = [-0.48, -0.16, 0.16, 0.48];

function Stick({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0]}>
      <Box size={[0.025, 1.33, 0.31]} color={C.pcb} />
      {CHIP_Y.flatMap((y) =>
        [-1, 1].map((side) => (
          <Box
            key={`${y}${side}`}
            size={[0.012, 0.22, 0.12]}
            position={[side * 0.018, y, 0.04]}
            color={C.dark}
            noEdges
          />
        )),
      )}
    </group>
  );
}

/** Two DIMM sticks standing in their slots (planes face ±x). */
export const Ram = memo(function Ram() {
  return (
    <group>
      <Stick x={-0.07} />
      <Stick x={0.07} />
    </group>
  );
});
