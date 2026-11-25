import type { DeviceModelSet } from "./types";
import { desktopPcModelSet } from "./desktop-pc";
import { laptopModelSet } from "./laptop";
import { phoneModelSet } from "./phone";

/** 3D models and camera framing per device id (see src/data/devices). */
export const deviceModels: Record<string, DeviceModelSet> = {
  "desktop-pc": desktopPcModelSet,
  laptop: laptopModelSet,
  phone: phoneModelSet,
};

export function getModelSet(deviceId: string): DeviceModelSet {
  return deviceModels[deviceId] ?? desktopPcModelSet;
}
