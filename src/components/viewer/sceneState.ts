import type { Part, Vec3 } from "../../types";

/**
 * Per-frame values shared by the 3D components. Kept outside React state so
 * animating them does not re-render anything.
 */
export const sceneState = {
  /** Smoothed explode amount that parts, labels and leader lines read every frame. */
  explode: 0.7,
};

/** Center of a part at a given explode amount. */
export function partCenter(part: Part, explode: number): Vec3 {
  const [px, py, pz] = part.position;
  const [ox, oy, oz] = part.explodeOffset;
  return [px + ox * explode, py + oy * explode, pz + oz * explode];
}
