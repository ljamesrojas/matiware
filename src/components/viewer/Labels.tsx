import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Group } from "three";
import styles from "./Labels.module.css";
import { sceneState } from "./sceneState";
import { CategoryDot } from "../common/CategoryDot";
import { useExplorerStore, type PartRole } from "../../store/useExplorerStore";
import type { PartModel } from "../../models/types";
import type { Part } from "../../types";

function PartLabel({ part, model, role }: { part: Part; model: PartModel; role: PartRole }) {
  const ref = useRef<Group>(null!);
  const showLabels = useExplorerStore((s) => s.showLabels);
  const hovered = useExplorerStore((s) => s.hoveredPartId === part.id);
  const select = useExplorerStore((s) => s.select);
  const hover = useExplorerStore((s) => s.hover);

  useFrame(() => {
    const e = sceneState.explode;
    const [px, py, pz] = part.position;
    const [ox, oy, oz] = part.explodeOffset;
    const [lx, ly, lz] = model.labelOffset;
    ref.current.position.set(px + ox * e + lx, py + oy * e + ly, pz + oz * e + lz);
  });

  const visible = showLabels && role !== "hidden";

  return (
    <group ref={ref}>
      <Html center zIndexRange={[10, 0]} className={styles.anchor}>
        <button
          type="button"
          tabIndex={-1}
          className={styles.label}
          data-visible={visible || undefined}
          data-selected={role === "selected" || undefined}
          data-dim={role === "faded" || undefined}
          data-hovered={hovered || undefined}
          onClick={() => select(part.id)}
          onPointerEnter={(e) => e.pointerType === "mouse" && hover(part.id)}
          onPointerLeave={() => hover(null)}
          aria-hidden="true"
        >
          <CategoryDot category={part.category} size={7} />
          {part.name}
        </button>
      </Html>
    </group>
  );
}

/** Floating pill labels (white pill, category dot, name). Hidden with the Labels toggle or Isolate. */
export function Labels({
  parts,
  models,
  roles,
}: {
  parts: Part[];
  models: Record<string, PartModel>;
  roles: Record<string, PartRole>;
}) {
  return (
    <group>
      {parts.map((p) =>
        models[p.id] ? <PartLabel key={p.id} part={p} model={models[p.id]} role={roles[p.id]} /> : null,
      )}
    </group>
  );
}
