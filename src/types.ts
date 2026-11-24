export type Category =
  | "processing"
  | "memory"
  | "storage"
  | "power"
  | "cooling"
  | "connectivity"
  | "structure";

export type ReadingLevel = "beginner" | "advanced";

export type Vec3 = [number, number, number];

export interface LeveledText {
  beginner: string;
  advanced: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Part {
  id: string; // "ram"
  code: string; // "MEM-01"
  name: string; // "RAM"
  fullName: string; // "Random access memory"
  category: Category;
  definition: LeveledText;
  function: LeveledText;
  connectsTo: string[]; // part ids
  specs: Spec[];
  failureSigns: string;
  // 3D placement
  position: Vec3; // assembled position
  explodeOffset: Vec3; // added at 100% explode
}

export interface Device {
  id: string; // "desktop-pc"
  name: string; // "Desktop PC"
  meta: string; // "Tower · ATX"
  intro: string;
  description: string;
  parts: Part[]; // in list order
}

export interface CategoryInfo {
  id: Category;
  name: string;
  color: string;
}

export type DeviceIcon = "desktop" | "laptop" | "phone";

export interface DeviceTile {
  id: string;
  name: string;
  icon: DeviceIcon;
  available: boolean;
}
