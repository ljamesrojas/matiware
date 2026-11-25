import type { DeviceModelSet, PartModel } from "../types";
import { BottomCase } from "./BottomCase";
import { LogicBoard } from "./LogicBoard";
import { MobileCpu } from "./MobileCpu";
import { SoDimm } from "./SoDimm";
import { LaptopSsd } from "./LaptopSsd";
import { WifiCard } from "./WifiCard";
import { BatteryPack } from "./BatteryPack";
import { LaptopCooler } from "./LaptopCooler";
import { TopCase } from "./TopCase";
import { DisplayLid } from "./DisplayLid";

/** Part geometry keyed by part id (see src/data/devices/laptop.ts). */
export const laptopModels: Record<string, PartModel> = {
  chassis: { Component: BottomCase, labelOffset: [2.9, 0.1, 2.35], focusSize: 6.4, castShadow: false },
  battery: { Component: BatteryPack, compareRotation: [Math.PI / 2, 0, 0], labelOffset: [-1.6, 0.25, 0.9], focusSize: 4.6 },
  mb: { Component: LogicBoard, compareRotation: [Math.PI / 2, 0, 0], labelOffset: [1.6, 0.1, 0.85], focusSize: 4.4 },
  cpu: { Component: MobileCpu, compareRotation: [Math.PI / 2, 0, 0], labelOffset: [0, 0.16, 0.35], focusSize: 1.2 },
  ram: { Component: SoDimm, compareRotation: [Math.PI / 2, 0, 0], labelOffset: [0, 0.12, 0.4], focusSize: 1.5 },
  ssd: { Component: LaptopSsd, compareRotation: [Math.PI / 2, 0, 0], labelOffset: [0.3, 0.12, 0.32], focusSize: 1.6 },
  wifi: { Component: WifiCard, compareRotation: [Math.PI / 2, 0, 0], labelOffset: [0.4, 0.12, -0.35], focusSize: 1.0 },
  cooler: { Component: LaptopCooler, compareRotation: [Math.PI / 2, 0, 0], labelOffset: [-0.7, 0.3, 0.8], focusSize: 3.0 },
  keyboard: { Component: TopCase, labelOffset: [-2.5, 0.12, 2.0], focusSize: 6.2 },
  display: { Component: DisplayLid, labelOffset: [-2.6, 1.95, -0.45], focusSize: 6.2 },
};

export const laptopModelSet: DeviceModelSet = {
  parts: laptopModels,
  cmPerUnit: 5,
  view: {
    azimuth: 28,
    elevation: 22,
    target: (e) => [-0.06 + 0.46 * e, 2.13 + 0.99 * e, -0.6 + 0.6 * e],
    size: (e) => [(8.0 + 1.9 * e) * 1.08, (6.1 + 2.5 * e) * 1.08],
    shadow: { position: [0, -0.03, -0.6], scale: [13, 11], far: 6, opacity: 0.3 },
  },
};
