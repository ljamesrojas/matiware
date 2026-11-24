import { memo } from "react";
import { Fan } from "../primitives";

/** Two 120 mm intake fans on the inside of the front panel, facing ±x. */
export const CaseFans = memo(function CaseFans() {
  return (
    <group>
      <Fan size={1.2} depth={0.25} position={[0, 0.65, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Fan size={1.2} depth={0.25} position={[0, -0.65, 0]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
});
