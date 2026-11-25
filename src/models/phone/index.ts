import type { DeviceModelSet, PartModel } from "../types";
import { PhoneFrame } from "./PhoneFrame";
import { OledDisplay } from "./OledDisplay";
import {
  BackGlass,
  CameraModule,
  PhoneBattery,
  PhoneBoard,
  PhoneRam,
  PhoneSoc,
  PhoneStorage,
  UsbCPort,
  VaporChamber,
} from "./PhoneParts";

/** Part geometry keyed by part id (see src/data/devices/phone.ts). */
export const phoneModels: Record<string, PartModel> = {
  frame: { Component: PhoneFrame, labelOffset: [1.95, 0, 0.2], focusSize: 7.6 },
  display: { Component: OledDisplay, labelOffset: [1.2, 3.95, 0], focusSize: 7.6 },
  back: { Component: BackGlass, labelOffset: [-1.2, 3.95, 0.05], focusSize: 7.6, castShadow: false },
  battery: { Component: PhoneBattery, labelOffset: [0, -2.2, 0.1], focusSize: 4.0 },
  mb: { Component: PhoneBoard, labelOffset: [1.15, 0.6, 0.05], focusSize: 2.4 },
  cooling: { Component: VaporChamber, labelOffset: [-1.3, 0.2, 0], focusSize: 3.0 },
  soc: { Component: PhoneSoc, labelOffset: [-0.45, -0.5, 0.05], focusSize: 1.0 },
  ram: { Component: PhoneRam, labelOffset: [0.45, 0.45, 0.05], focusSize: 1.0 },
  storage: { Component: PhoneStorage, labelOffset: [0.35, -0.4, 0.05], focusSize: 0.9 },
  port: { Component: UsbCPort, labelOffset: [0, -0.45, 0.05], focusSize: 1.4 },
  camera: { Component: CameraModule, labelOffset: [-0.85, 0, 0.15], focusSize: 1.7 },
};

export const phoneModelSet: DeviceModelSet = {
  parts: phoneModels,
  view: {
    azimuth: 40,
    elevation: 10,
    target: (e) => [0, 3.85, 1.9 * e],
    size: (e) => [(3.8 + 7.0 * e) * 1.1, 8.6 * 1.1],
    shadow: { position: [-0.6, -0.01, 0.8], scale: [13, 9], far: 8, opacity: 0.3 },
  },
};
