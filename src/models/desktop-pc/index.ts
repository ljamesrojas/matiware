import type { PartModel } from "../types";
import { Chassis } from "./Chassis";
import { Motherboard } from "./Motherboard";
import { Cpu } from "./Cpu";
import { CpuCooler } from "./CpuCooler";
import { Ram } from "./Ram";
import { Ssd } from "./Ssd";
import { GraphicsCard } from "./GraphicsCard";
import { HardDrive } from "./HardDrive";
import { PowerSupply } from "./PowerSupply";
import { CaseFans } from "./CaseFans";

/** Part geometry keyed by part id (see src/data/devices/desktop-pc.ts). */
export const desktopPcModels: Record<string, PartModel> = {
  chassis: { Component: Chassis, labelOffset: [2.2, -0.75, 1.0], focusSize: 5.4, castShadow: false },
  mb: { Component: Motherboard, labelOffset: [1.0, -1.42, 0.12], focusSize: 3.4 },
  cpu: { Component: Cpu, labelOffset: [0, 0.34, 0.06], focusSize: 1.4 },
  cooler: { Component: CpuCooler, labelOffset: [0, 0.82, 0.45], focusSize: 1.9 },
  ram: { Component: Ram, labelOffset: [0.08, 0.84, 0.12], focusSize: 1.6 },
  ssd: { Component: Ssd, labelOffset: [0, -0.24, 0.06], focusSize: 1.3 },
  gpu: { Component: GraphicsCard, labelOffset: [0.95, -0.42, 0.55], focusSize: 2.8 },
  hdd: { Component: HardDrive, labelOffset: [0, 0.32, 0.55], focusSize: 1.8 },
  psu: { Component: PowerSupply, labelOffset: [0, 0.64, 0.5], focusSize: 1.9 },
  fans: { Component: CaseFans, labelOffset: [0, 1.42, 0.25], focusSize: 2.6 },
};
