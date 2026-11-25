import type { Device, DeviceTile, Flow, FlowKind, Part } from "../../types";
import { desktopPC } from "./desktop-pc";
import { laptop } from "./laptop";
import { phone } from "./phone";

/** Devices that have a model and content. */
export const devices: Record<string, Device> = {
  [desktopPC.id]: desktopPC,
  [laptop.id]: laptop,
  [phone.id]: phone,
};

/** Tiles shown at the top of the sidebar, in order. */
export const deviceTiles: DeviceTile[] = [
  { id: "desktop-pc", name: "Desktop", icon: "desktop", available: true },
  { id: "laptop", name: "Laptop", icon: "laptop", available: true },
  { id: "phone", name: "Phone", icon: "phone", available: true },
];

export const defaultDeviceId = desktopPC.id;

export function getDevice(id: string): Device {
  return devices[id] ?? desktopPC;
}

export function getPart(device: Device, id: string | null): Part | undefined {
  if (!id) return undefined;
  return device.parts.find((p) => p.id === id);
}

export function getFlow(device: Device, kind: FlowKind): Flow | undefined {
  return device.flows?.find((f) => f.id === kind);
}

/** Mono subtitle, e.g. "TOWER · ATX · 10 PARTS". */
export function deviceSubtitle(device: Device): string {
  return `${device.meta} · ${device.parts.length} parts`.toUpperCase();
}
