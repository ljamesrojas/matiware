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

/** How the camera frames a device and where its floor shadow sits. */
export interface DeviceView {
  /** Camera angle around the model (degrees, 0 = looking from +z) and above it. */
  azimuth: number;
  elevation: number;
  /** Orbit target for the device view at a given explode amount (0–1). */
  target: (explode: number) => Vec3;
  /** World width and height to fit on screen at a given explode amount. */
  size: (explode: number) => [number, number];
  /** Soft contact shadow under the model. */
  shadow: { position: Vec3; scale: [number, number]; far: number; opacity?: number };
}

/** Everything the viewer needs to draw one device. */
export interface DeviceModelSet {
  parts: Record<string, PartModel>;
  view: DeviceView;
}
