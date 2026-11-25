export type Category =
  | "processing"
  | "memory"
  | "storage"
  | "power"
  | "cooling"
  | "connectivity"
  | "io"
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
  flows?: Flow[]; // step-by-step flow animations (Phase 2)
  quiz?: QuizContent; // build-it quiz (Phase 3)
}

/* ---------- Compare mode (Phase 5) ---------- */

/** One part type compared side by side across devices. */
export interface CompareTopic {
  id: string; // "memory"
  name: string; // "Memory"
  title: string; // "Memory across devices"
  question: string;
  /** Which part represents this topic in each device (device id → part id). */
  parts: Record<string, string>;
  /** Comparison rows; values keyed by device id. */
  rows: { label: string; values: Record<string, string> }[];
  takeaway: LeveledText;
}

/* ---------- Build-it quiz (Phase 3) ---------- */

export type QuizMode = "identify" | "assemble";

/** A part that can only go in after other parts are in place. */
export interface AssembleRule {
  part: string;
  after: string[];
  reason: string;
}

export interface QuizContent {
  /** Number of answer options per Identify question (including the right one). */
  optionsPerQuestion: number;
  /** Short how-to shown when a part is placed in Assemble mode. */
  installTips: Record<string, string>;
  /** Order rules for Assemble mode. Parts without a rule can go in at any time. */
  rules: AssembleRule[];
}

/* ---------- Flow mode (Phase 2) ---------- */

export type FlowKind = "data" | "power";

/**
 * One point on a flow path.
 * - `world`: a fixed scene position.
 * - `part`: follows that part. Uses its current (exploded) center, or its assembled
 *   center when `assembled` is true, plus an optional `offset`.
 */
export interface FlowPoint {
  part?: string;
  assembled?: boolean;
  offset?: Vec3;
  world?: Vec3;
}

export type FlowMarkerIcon = "monitor" | "plug";

export interface FlowMarker {
  label: string;
  icon: FlowMarkerIcon;
}

export interface FlowStep {
  id: string;
  /** Short route, e.g. "Storage → RAM". */
  route: string;
  /** Card heading, e.g. "Load the app". */
  title: string;
  caption: LeveledText;
  /** What travels along the path, or the approximate power. */
  badge: string;
  /** End-point parts, highlighted with the accent outline. */
  focus: string[];
  /** Parts the flow passes through, kept at full opacity. */
  via?: string[];
  path: FlowPoint[];
  startMarker?: FlowMarker;
  endMarker?: FlowMarker;
}

export interface Flow {
  id: FlowKind;
  name: string; // "Data flow"
  shortName: string; // "Data"
  question: string; // "What happens when you open an app?"
  intro: string;
  /** Label for the badge row in the card, e.g. "Carries" or "Approx. power". */
  badgeLabel: string;
  steps: FlowStep[];
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
