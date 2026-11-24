import type { ComponentType } from "react";
import type { Vec3 } from "../types";

/** Geometry-side info for one part. Learning content lives in src/data. */
export interface PartModel {
  Component: ComponentType;
  /** Where the floating label sits, relative to the part center. */
  labelOffset: Vec3;
  /** Rough size of the part (world units), used to frame the camera on it. */
  focusSize: number;
  /** Large shells (the case) skip casting shadows so the inside stays readable. */
  castShadow?: boolean;
}
