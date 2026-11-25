import { create } from "zustand";
import type { FlowKind, QuizMode, ReadingLevel } from "../types";
import {
  buildIdentifyQuestions,
  missingPrereqs,
  nextValidPart,
  prePlacedParts,
  assembleParts,
  type AssembleFeedback,
  type IdentifyQuestion,
} from "./quiz";
import { defaultDeviceId, devices, getDevice, getFlow } from "../data/devices";

export const DEFAULT_EXPLODE = 0.7;
const EXPLODE_TWEEN_MS = 420;
/** How long each flow step plays before moving on. */
export const FLOW_STEP_MS = 5000;

export interface FlowState {
  active: boolean;
  kind: FlowKind;
  step: number;
  playing: boolean;
}

export interface QuizState {
  active: boolean;
  /** null while the student is choosing a mode. */
  mode: QuizMode | null;
  finished: boolean;
  // Identify
  questions: IdentifyQuestion[];
  index: number;
  /** Chosen part id per question (null = not answered yet). */
  answers: (string | null)[];
  // Assemble
  /** Parts the student placed, in order. */
  placed: string[];
  /** Out-of-order tries. */
  attempts: { partId: string; missing: string[] }[];
  /** Parts placed after using a hint. */
  hinted: string[];
  hintPartId: string | null;
  feedback: AssembleFeedback | null;
}

const emptyQuiz: QuizState = {
  active: false,
  mode: null,
  finished: false,
  questions: [],
  index: 0,
  answers: [],
  placed: [],
  attempts: [],
  hinted: [],
  hintPartId: null,
  feedback: null,
};

export interface CompareState {
  active: boolean;
  topic: string;
  /** Show the parts at their real relative size instead of the same size. */
  trueScale: boolean;
}

const compareOff = (c: CompareState): CompareState => ({ ...c, active: false });

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
  flow: FlowState;
  quiz: QuizState;
  compare: CompareState;

  /** Switch to another device; resets selection, modes and the view. */
  setDevice: (id: string) => void;
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

  /** Flow mode (Phase 2). */
  startFlow: (kind?: FlowKind) => void;
  stopFlow: () => void;
  setFlowKind: (kind: FlowKind) => void;
  setFlowStep: (step: number) => void;
  stepFlow: (direction: 1 | -1) => void;
  toggleFlowPlay: () => void;
  /** Called by the flow timer when a step has finished playing. */
  advanceFlow: () => void;

  /** Build-it quiz (Phase 3). */
  openQuiz: () => void;
  startQuiz: (mode: QuizMode) => void;
  exitQuiz: () => void;
  answerQuestion: (partId: string) => void;
  nextQuestion: () => void;
  showHint: () => void;
  /** A part was clicked on the model, its label or the parts list. */
  pickPart: (id: string) => void;

  /** Compare mode (Phase 5). */
  openCompare: (topic?: string) => void;
  setCompareTopic: (topic: string) => void;
  setTrueScale: (on: boolean) => void;
  exitCompare: () => void;
  /** Leave Compare mode and open a part in its own device. */
  openPartIn: (deviceId: string, partId: string) => void;
}

/** The part asked about in the Identify quiz, or null when no question is showing. */
export function identifyTargetId(quiz: QuizState): string | null {
  if (!quiz.active || quiz.mode !== "identify" || quiz.finished) return null;
  return quiz.questions[quiz.index]?.partId ?? null;
}

/** Parts in place in Assemble mode: the fixed ones plus what the student placed. */
export function placedSet(deviceId: string, quiz: QuizState): Set<string> {
  return new Set([...prePlacedParts(getDevice(deviceId)), ...quiz.placed]);
}

function flowStepCount(deviceId: string, kind: FlowKind): number {
  return getFlow(getDevice(deviceId), kind)?.steps.length ?? 0;
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
  flow: { active: false, kind: "data", step: 0, playing: false },
  quiz: emptyQuiz,
  compare: { active: false, topic: "memory", trueScale: false },

  setDevice: (id) => {
    if (!devices[id] || id === get().deviceId) return;
    set((s) => ({
      deviceId: id,
      selectedPartId: null,
      hoveredPartId: null,
      isolate: false,
      drawerOpen: false,
      sheetState: "half",
      flow: { ...s.flow, active: false, playing: false, step: 0 },
      quiz: emptyQuiz,
      compare: compareOff(s.compare),
      resetId: s.resetId + 1,
    }));
    get().animateExplode(DEFAULT_EXPLODE);
  },

  select: (id) => {
    // A new selection (or going back to the overview) opens the mobile sheet at half height.
    // Selecting a part leaves flow mode so the inspector can show the part card.
    const s = get();
    const changed = id !== s.selectedPartId;
    set({
      selectedPartId: id,
      drawerOpen: false,
      ...(changed ? { sheetState: "half" as const } : {}),
      ...(id && s.flow.active ? { flow: { ...s.flow, active: false, playing: false } } : {}),
      ...(id && s.quiz.active ? { quiz: emptyQuiz } : {}),
      ...(id && s.compare.active ? { compare: compareOff(s.compare), resetId: s.resetId + 1 } : {}),
    });
  },

  hover: (id) => {
    const { quiz } = get();
    // Hover would reveal part names in Identify mode (tooltip, list highlight).
    if (id && quiz.active && quiz.mode === "identify") id = null;
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
      flow: { ...s.flow, active: false, playing: false },
      quiz: emptyQuiz,
      compare: compareOff(s.compare),
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

  startFlow: (kind) => {
    const s = get();
    const k = kind ?? s.flow.kind;
    if (!flowStepCount(s.deviceId, k)) return;
    set({
      selectedPartId: null,
      hoveredPartId: null,
      drawerOpen: false,
      sheetState: "half",
      flow: { active: true, kind: k, step: 0, playing: true },
      quiz: emptyQuiz,
      ...(s.compare.active ? { compare: compareOff(s.compare), resetId: s.resetId + 1 } : {}),
    });
  },

  stopFlow: () => set((s) => ({ flow: { ...s.flow, active: false, playing: false }, sheetState: "half" })),

  setFlowKind: (kind) => {
    if (!flowStepCount(get().deviceId, kind)) return;
    set((s) => ({ flow: { ...s.flow, kind, step: 0, playing: true } }));
  },

  setFlowStep: (step) => {
    const count = flowStepCount(get().deviceId, get().flow.kind);
    set((s) => ({ flow: { ...s.flow, step: Math.max(0, Math.min(count - 1, step)) } }));
  },

  stepFlow: (direction) => get().setFlowStep(get().flow.step + direction),

  toggleFlowPlay: () => {
    const { flow, deviceId } = get();
    const last = flowStepCount(deviceId, flow.kind) - 1;
    if (flow.playing) set({ flow: { ...flow, playing: false } });
    // Pressing play on the last step starts again from the first.
    else set({ flow: { ...flow, playing: true, step: flow.step >= last ? 0 : flow.step } });
  },

  advanceFlow: () => {
    const { flow, deviceId } = get();
    const last = flowStepCount(deviceId, flow.kind) - 1;
    if (flow.step < last) set({ flow: { ...flow, step: flow.step + 1 } });
    else set({ flow: { ...flow, playing: false } });
  },

  openQuiz: () =>
    set((s) => ({
      selectedPartId: null,
      hoveredPartId: null,
      drawerOpen: false,
      sheetState: "half",
      flow: { ...s.flow, active: false, playing: false },
      quiz: { ...emptyQuiz, active: true },
      ...(s.compare.active ? { compare: compareOff(s.compare), resetId: s.resetId + 1 } : {}),
    })),

  startQuiz: (mode) => {
    const device = getDevice(get().deviceId);
    if (!device.quiz) return;
    const questions = mode === "identify" ? buildIdentifyQuestions(device) : [];
    set((s) => ({
      selectedPartId: null,
      hoveredPartId: null,
      drawerOpen: false,
      sheetState: "half",
      flow: { ...s.flow, active: false, playing: false },
      quiz: { ...emptyQuiz, active: true, mode, questions, answers: questions.map(() => null) },
      ...(s.compare.active ? { compare: compareOff(s.compare), resetId: s.resetId + 1 } : {}),
    }));
    // Identify: spread the parts so each one is easy to see. Assemble: start fully exploded.
    get().animateExplode(mode === "assemble" ? 1 : DEFAULT_EXPLODE);
  },

  exitQuiz: () => {
    const wasAssemble = get().quiz.mode === "assemble";
    set({ quiz: emptyQuiz, hoveredPartId: null, sheetState: "half" });
    if (wasAssemble) get().animateExplode(DEFAULT_EXPLODE);
  },

  answerQuestion: (partId) => {
    const { quiz } = get();
    if (!quiz.active || quiz.mode !== "identify" || quiz.finished) return;
    if (quiz.answers[quiz.index] !== null) return;
    const answers = [...quiz.answers];
    answers[quiz.index] = partId;
    // On mobile, open the sheet fully so the feedback and Next button are visible.
    set({ quiz: { ...quiz, answers }, sheetState: "full" });
  },

  nextQuestion: () => {
    const { quiz } = get();
    if (quiz.mode !== "identify" || quiz.answers[quiz.index] === null) return;
    if (quiz.index >= quiz.questions.length - 1) set({ quiz: { ...quiz, finished: true } });
    else set({ quiz: { ...quiz, index: quiz.index + 1 }, sheetState: "half" });
  },

  showHint: () => {
    const { quiz, deviceId } = get();
    if (quiz.mode !== "assemble" || quiz.finished) return;
    const hint = nextValidPart(getDevice(deviceId), placedSet(deviceId, quiz));
    if (hint) set({ quiz: { ...quiz, hintPartId: hint, feedback: null } });
  },

  pickPart: (id) => {
    const { quiz, deviceId } = get();
    if (!quiz.active) {
      get().select(id);
      return;
    }
    if (quiz.mode !== "assemble" || quiz.finished) return; // Identify answers come from the card

    // Close the mobile drawer so the student sees the part move.
    if (get().drawerOpen) set({ drawerOpen: false });
    const device = getDevice(deviceId);
    const placed = placedSet(deviceId, quiz);
    if (placed.has(id)) {
      set({ quiz: { ...quiz, feedback: { kind: "already", partId: id } } });
      return;
    }
    const { missing, reason } = missingPrereqs(device, id, placed);
    if (missing.length) {
      set({
        quiz: {
          ...quiz,
          attempts: [...quiz.attempts, { partId: id, missing }],
          feedback: { kind: "blocked", partId: id, missing, reason },
        },
      });
      return;
    }
    const nextPlaced = [...quiz.placed, id];
    const hinted = quiz.hintPartId === id ? [...quiz.hinted, id] : quiz.hinted;
    set({
      quiz: {
        ...quiz,
        placed: nextPlaced,
        hinted,
        hintPartId: null,
        feedback: { kind: "placed", partId: id },
        finished: nextPlaced.length >= assembleParts(device).length,
      },
    });
  },

  openCompare: (topic) =>
    set((s) => ({
      selectedPartId: null,
      hoveredPartId: null,
      drawerOpen: false,
      sheetState: "half",
      flow: { ...s.flow, active: false, playing: false },
      quiz: emptyQuiz,
      compare: { ...s.compare, active: true, topic: topic ?? s.compare.topic },
      resetId: s.resetId + 1,
    })),

  setCompareTopic: (topic) => set((s) => ({ compare: { ...s.compare, topic } })),
  setTrueScale: (on) => set((s) => ({ compare: { ...s.compare, trueScale: on } })),

  exitCompare: () =>
    set((s) => ({ compare: compareOff(s.compare), sheetState: "half", resetId: s.resetId + 1 })),

  openPartIn: (deviceId, partId) => {
    if (get().deviceId !== deviceId) get().setDevice(deviceId);
    else set((s) => ({ compare: compareOff(s.compare), resetId: s.resetId + 1 }));
    get().select(partId);
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
