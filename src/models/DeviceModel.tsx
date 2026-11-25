import { PartMesh } from "../components/viewer/PartMesh";
import { Labels } from "../components/viewer/Labels";
import { LeaderLines } from "../components/viewer/LeaderLines";
import { getModelSet } from ".";
import { getDevice, getPart } from "../data/devices";
import { useFlowStep } from "../hooks/useFlowStep";
import { getPartRole, identifyTargetId, useExplorerStore, type PartRole } from "../store/useExplorerStore";

/** Assembles the current device from its part models, plus labels and leader lines. */
export function DeviceModel() {
  const deviceId = useExplorerStore((s) => s.deviceId);
  const device = getDevice(deviceId);
  const models = getModelSet(deviceId).parts;
  const selectedId = useExplorerStore((s) => s.selectedPartId);
  const hoveredId = useExplorerStore((s) => s.hoveredPartId);
  const isolate = useExplorerStore((s) => s.isolate);
  const flowStep = useFlowStep();
  const quiz = useExplorerStore((s) => s.quiz);
  const connects = getPart(device, selectedId)?.connectsTo;

  const identifyTarget = identifyTargetId(quiz);
  const assembleHighlight =
    quiz.active && quiz.mode === "assemble"
      ? quiz.hintPartId
        ? [quiz.hintPartId]
        : quiz.feedback?.kind === "blocked"
          ? quiz.feedback.missing
          : []
      : null;

  const roles: Record<string, PartRole> = {};
  for (const p of device.parts) {
    if (identifyTarget) {
      // Identify quiz: only the part in question stands out.
      roles[p.id] = p.id === identifyTarget ? "selected" : isolate ? "hidden" : "faded";
    } else if (assembleHighlight) {
      // Assemble quiz: highlight the hint, or the parts that have to go in first.
      roles[p.id] = assembleHighlight.includes(p.id) ? "selected" : "normal";
    } else if (flowStep) {
      // Flow mode: the step's end points are highlighted, parts it passes through stay solid.
      const { focus, via = [] } = flowStep.step;
      roles[p.id] = focus.includes(p.id)
        ? "selected"
        : via.includes(p.id)
          ? "connected"
          : isolate
            ? "hidden"
            : "faded";
    } else {
      roles[p.id] = getPartRole(p.id, selectedId, connects, isolate);
    }
  }

  return (
    // Keyed by device so switching devices mounts fresh parts.
    <group key={device.id}>
      {device.parts.map((part) => {
        const model = models[part.id];
        if (!model) return null;
        return (
          <PartMesh key={part.id} part={part} model={model} role={roles[part.id]} hovered={hoveredId === part.id} />
        );
      })}
      <LeaderLines parts={device.parts} roles={roles} />
      <Labels parts={device.parts} models={models} roles={roles} />
    </group>
  );
}
