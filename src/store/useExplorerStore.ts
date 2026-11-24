import { create } from "zustand";
import type { ReadingLevel } from "../types";
import { defaultDeviceId, getDevice } from "../data/devices";

export const DEFAULT_EXPLODE = 0.7;
const EXPLODE_TWEEN_MS = 420;

export type SheetState = "peek" | "half" | "full";

/** Space covered by floating UI, so the camera can center the model in what is left. */
export interface StageInsets {
  right: number;
  bottom: number;
}

interface ExplorerState {
  deviceId: string;
  selectedPartId: string | null;
  hoveredPartId: string | null;
  /** Explode amount, 0 (assembled) to 1 (fully exploded). */
  explode: number;
  showLabels: boolean;
  isolate: boolean;
  level: ReadingLevel;
  /** Zoom step requests for the camera rig. `id` changes on every request. */
  zoom: { step: number; id: number };
  /** Increments on every "Reset view". */
  resetId: number;
  reducedMotion: boolean;
  drawerOpen: boolean;
  sheetState: SheetState;
  insets: StageInsets;

  select: (id: string | null) => void;
  hover: (id: string | null) => void;
  setExplode: (value: number) => void;
  animateExplode: (to: number) => void;
  toggleLabels: () => void;
  toggleIsolate: () => void;
  setLevel: (level: ReadingLevel) => void;
  zoomBy: (step: number) => void;
  resetView: () => void;
  stepPart: (direction: 1 | -1) => void;
  setReducedMotion: (value: boolean) => void;
  setDrawerOpen: (open: boolean) => void;
  setSheetState: (state: SheetState) => void;
  setInsets: (insets: StageInsets) => void;
}

let tweenFrame = 0;
function cancelTween() {
  if (tweenFrame) cancelAnimationFrame(tweenFrame);
  tweenFrame = 0;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const useExplorerStore = create<ExplorerState>()((set, get) => ({
  deviceId: defaultDeviceId,
  selectedPartId: null,
  hoveredPartId: null,
  explode: DEFAULT_EXPLODE,
  showLabels: true,
  isolate: false,
  level: "beginner",
  zoom: { step: 0, id: 0 },
  resetId: 0,
  reducedMotion: false,
  drawerOpen: false,
  sheetState: "half",
  insets: { right: 0, bottom: 0 },

  select: (id) => {
    // A new selection (or going back to the overview) opens the mobile sheet at half height.
    const changed = id !== get().selectedPartId;
    set({ selectedPartId: id, drawerOpen: false, ...(changed ? { sheetState: "half" as const } : {}) });
  },

  hover: (id) => {
    if (get().hoveredPartId !== id) set({ hoveredPartId: id });
  },

  setExplode: (value) => {
    cancelTween();
    set({ explode: clamp01(value) });
  },

  animateExplode: (to) => {
    cancelTween();
    const target = clamp01(to);
    const from = get().explode;
    if (get().reducedMotion || Math.abs(target - from) < 0.001) {
      set({ explode: target });
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / EXPLODE_TWEEN_MS);
      set({ explode: from + (target - from) * easeOutCubic(t) });
      tweenFrame = t < 1 ? requestAnimationFrame(tick) : 0;
    };
    tweenFrame = requestAnimationFrame(tick);
  },

  toggleLabels: () => set((s) => ({ showLabels: !s.showLabels })),
  toggleIsolate: () => set((s) => ({ isolate: !s.isolate })),
  setLevel: (level) => set({ level }),
  zoomBy: (step) => set((s) => ({ zoom: { step, id: s.zoom.id + 1 } })),

  resetView: () => {
    set((s) => ({
      selectedPartId: null,
      hoveredPartId: null,
      showLabels: true,
      isolate: false,
      sheetState: "half",
      resetId: s.resetId + 1,
    }));
    get().animateExplode(DEFAULT_EXPLODE);
  },

  stepPart: (direction) => {
    const parts = getDevice(get().deviceId).parts;
    const index = parts.findIndex((p) => p.id === get().selectedPartId);
    const next =
      index === -1
        ? direction === 1
          ? 0
          : parts.length - 1
        : (index + direction + parts.length) % parts.length;
    get().select(parts[next].id);
  },

  setReducedMotion: (value) => set({ reducedMotion: value }),
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  setSheetState: (state) => set({ sheetState: state }),
  setInsets: (insets) => {
    const cur = get().insets;
    if (Math.abs(cur.right - insets.right) > 0.5 || Math.abs(cur.bottom - insets.bottom) > 0.5) set({ insets });
  },
}));

/** How a part should look given the current selection. */
export type PartRole = "normal" | "selected" | "connected" | "faded" | "hidden";

export function getPartRole(
  partId: string,
  selectedId: string | null,
  selectedConnects: string[] | undefined,
  isolate: boolean,
): PartRole {
  if (!selectedId) return "normal";
  if (partId === selectedId) return "selected";
  if (selectedConnects?.includes(partId)) return "connected";
  return isolate ? "hidden" : "faded";
}
