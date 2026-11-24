import { Rotate3d } from "lucide-react";
import styles from "./StagePills.module.css";
import { getDevice, getPart } from "../../data/devices";
import { useFlowStep } from "../../hooks/useFlowStep";
import { useExplorerStore } from "../../store/useExplorerStore";

export function StagePills() {
  const device = getDevice(useExplorerStore((s) => s.deviceId));
  const part = getPart(device, useExplorerStore((s) => s.selectedPartId));
  const isolate = useExplorerStore((s) => s.isolate);
  const explode = useExplorerStore((s) => s.explode);

  const flowStep = useFlowStep();
  const quiz = useExplorerStore((s) => s.quiz);

  const status = quiz.active
    ? `Quiz · ${quiz.mode ? (quiz.finished ? `${quiz.mode} · Results` : quiz.mode) : "Choose a mode"}`
    : flowStep
    ? `View · ${flowStep.flow.name} · ${flowStep.index + 1}/${flowStep.total}${flowStep.playing ? "" : " · Paused"}`
    : part
      ? `View · ${isolate ? "Isolating" : "Inspecting"} ${part.code}`
    : explode < 0.01
      ? "View · Assembled"
      : `View · Exploded ${Math.round(explode * 100)}%`;

  return (
    <>
      <div className={`${styles.pill} ${styles.hint}`}>
        <Rotate3d size={14} strokeWidth={1.8} aria-hidden="true" />
        <span className={styles.desktopOnly}>Drag to rotate · Scroll to zoom</span>
        <span className={styles.mobileOnly}>Drag to rotate · Pinch to zoom</span>
      </div>
      <div className={`${styles.pill} ${styles.status} mono-label`} aria-hidden="true">
        {status}
      </div>
    </>
  );
}
