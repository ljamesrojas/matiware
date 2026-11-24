import { getDevice, getFlow } from "../data/devices";
import { useExplorerStore } from "../store/useExplorerStore";
import type { Flow, FlowStep } from "../types";

export interface ActiveFlowStep {
  flow: Flow;
  step: FlowStep;
  index: number;
  total: number;
  playing: boolean;
}

/** The flow step currently shown, or null when flow mode is off. */
export function useFlowStep(): ActiveFlowStep | null {
  const deviceId = useExplorerStore((s) => s.deviceId);
  const active = useExplorerStore((s) => s.flow.active);
  const kind = useExplorerStore((s) => s.flow.kind);
  const index = useExplorerStore((s) => s.flow.step);
  const playing = useExplorerStore((s) => s.flow.playing);
  if (!active) return null;
  const flow = getFlow(getDevice(deviceId), kind);
  const step = flow?.steps[index];
  if (!flow || !step) return null;
  return { flow, step, index, total: flow.steps.length, playing };
}
