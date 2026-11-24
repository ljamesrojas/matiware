import type { Part, Vec3 } from "../../types";

/**
 * Per-frame values shared by the 3D components. Kept outside React state so
 * animating them does not re-render anything.
 */
export const sceneState = {
  /** Smoothed global explode amount. */
  explode: 0.7,
  /**
   * Smoothed explode amount per part. Usually equal to `explode`; in the Assemble quiz,
   * placed parts go to 0 while the rest stay exploded.
   */
  parts: {} as Record<string, number>,
};

/** Current (animated) explode amount for one part. */
export function partExplode(id: string): number {
  return sceneState.parts[id] ?? sceneState.explode;
}

/** Center of a part at a given explode amount. */
export function partCenter(part: Part, explode: number): Vec3 {
  const [px, py, pz] = part.position;
  const [ox, oy, oz] = part.explodeOffset;
  return [px + ox * explode, py + oy * explode, pz + oz * explode];
}
