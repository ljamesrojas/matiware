import { useEffect } from "react";
import { FLOW_STEP_MS, useExplorerStore } from "../../store/useExplorerStore";

/** Moves flow mode to the next step while it is playing. Renders nothing. */
export function FlowTimer() {
  const active = useExplorerStore((s) => s.flow.active);
  const playing = useExplorerStore((s) => s.flow.playing);
  const step = useExplorerStore((s) => s.flow.step);
  const kind = useExplorerStore((s) => s.flow.kind);
  const advanceFlow = useExplorerStore((s) => s.advanceFlow);

  useEffect(() => {
    if (!active || !playing) return;
    const timer = window.setTimeout(advanceFlow, FLOW_STEP_MS);
    return () => window.clearTimeout(timer);
  }, [active, playing, step, kind, advanceFlow]);

  return null;
}
