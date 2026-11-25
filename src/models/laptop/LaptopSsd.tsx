import { memo } from "react";
import { Ssd } from "../desktop-pc/Ssd";

/** The same M.2 2280 stick as in the desktop, laid flat (it is 1.6 × 0.44 at the laptop's scale). */
export const LaptopSsd = memo(function LaptopSsd() {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} scale={2}>
      <Ssd />
    </group>
  );
});
