import { PartMesh } from "../../components/viewer/PartMesh";
import { Labels } from "../../components/viewer/Labels";
import { LeaderLines } from "../../components/viewer/LeaderLines";
import { desktopPcModels } from ".";
import { getDevice, getPart } from "../../data/devices";
import { getPartRole, useExplorerStore, type PartRole } from "../../store/useExplorerStore";

/** Assembles the Desktop PC from its part models, plus labels and leader lines. */
export function DesktopPC() {
  const device = getDevice("desktop-pc");
  const selectedId = useExplorerStore((s) => s.selectedPartId);
  const hoveredId = useExplorerStore((s) => s.hoveredPartId);
  const isolate = useExplorerStore((s) => s.isolate);
  const connects = getPart(device, selectedId)?.connectsTo;

  const roles: Record<string, PartRole> = {};
  for (const p of device.parts) roles[p.id] = getPartRole(p.id, selectedId, connects, isolate);

  return (
    <group>
      {device.parts.map((part) => {
        const model = desktopPcModels[part.id];
        if (!model) return null;
        return (
          <PartMesh key={part.id} part={part} model={model} role={roles[part.id]} hovered={hoveredId === part.id} />
        );
      })}
      <LeaderLines parts={device.parts} roles={roles} />
      <Labels parts={device.parts} models={desktopPcModels} roles={roles} />
    </group>
  );
}
