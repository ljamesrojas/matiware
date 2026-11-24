import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { easing } from "maath";
import * as THREE from "three";
import { useExplorerStore, type PartRole } from "../../store/useExplorerStore";
import { sceneState } from "./sceneState";
import type { PartModel } from "../../models/types";
import type { Part } from "../../types";

const EDGE_DEFAULT = new THREE.Color("#8C8F8A");
const EDGE_HOVER = new THREE.Color("#55534D");
const EDGE_SELECTED = new THREE.Color("#2F6B57");

const OPACITY: Record<PartRole, number> = {
  normal: 1,
  selected: 1,
  connected: 1,
  faded: 0.2,
  hidden: 0.04,
};

const noRaycast = () => {};

interface Props {
  part: Part;
  model: PartModel;
  role: PartRole;
  hovered: boolean;
}

/**
 * Shared wrapper for every part: explode offset, hover, click, fade / isolate and outline.
 * Part models only describe geometry.
 */
export function PartMesh({ part, model, role, hovered }: Props) {
  const group = useRef<THREE.Group>(null!);
  const materials = useRef<THREE.Material[]>([]);
  const fade = useRef({ opacity: 1, applied: -1 });
  const edgeMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: EDGE_DEFAULT, transparent: true, opacity: 0.5, depthWrite: false }),
    [],
  );
  const select = useExplorerStore((s) => s.select);
  const hover = useExplorerStore((s) => s.hover);
  const { Component } = model;

  // Collect materials and add outline edges to each mesh once the geometry is mounted.
  useLayoutEffect(() => {
    const created: THREE.LineSegments[] = [];
    const mats: THREE.Material[] = [];
    group.current.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mats.push(...(Array.isArray(mesh.material) ? mesh.material : [mesh.material]));
      mesh.receiveShadow = true;
      if (mesh.userData.noEdges) return;
      const lines = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 25), edgeMaterial);
      lines.raycast = noRaycast;
      lines.userData.isEdge = true;
      mesh.add(lines);
      created.push(lines);
    });
    materials.current = mats;
    fade.current.applied = -1;
    return () => {
      created.forEach((l) => {
        l.removeFromParent();
        l.geometry.dispose();
      });
    };
  }, [edgeMaterial]);

  useEffect(() => () => edgeMaterial.dispose(), [edgeMaterial]);

  // Hidden parts ignore the pointer; faded and hidden parts stop casting shadows.
  useEffect(() => {
    const hidden = role === "hidden";
    const cast = model.castShadow !== false && role !== "hidden" && role !== "faded";
    group.current.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.raycast = hidden ? noRaycast : THREE.Mesh.prototype.raycast;
      mesh.castShadow = cast;
    });
  }, [role, model.castShadow]);

  useFrame((_, dt) => {
    const e = sceneState.explode;
    const [px, py, pz] = part.position;
    const [ox, oy, oz] = part.explodeOffset;
    group.current.position.set(px + ox * e, py + oy * e, pz + oz * e);

    const f = fade.current;
    const target = OPACITY[role];
    if (useExplorerStore.getState().reducedMotion) f.opacity = target;
    else easing.damp(f, "opacity", target, 0.14, dt);

    if (Math.abs(f.opacity - f.applied) > 0.001) {
      const transparent = f.opacity < 0.995;
      for (const m of materials.current) {
        if (m.transparent !== transparent) {
          m.transparent = transparent;
          m.depthWrite = !transparent;
          m.needsUpdate = true;
        }
        m.opacity = f.opacity;
      }
      f.applied = f.opacity;
    }

    const selected = role === "selected";
    edgeMaterial.color.copy(selected ? EDGE_SELECTED : hovered ? EDGE_HOVER : EDGE_DEFAULT);
    edgeMaterial.opacity = (selected ? 1 : hovered ? 0.95 : 0.5) * f.opacity;
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    if (e.pointerType === "touch") return;
    e.stopPropagation();
    hover(part.id);
    document.body.style.cursor = "pointer";
  };

  const onOut = () => {
    if (useExplorerStore.getState().hoveredPartId === part.id) hover(null);
    document.body.style.cursor = "";
  };

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 4) return; // it was a drag
    e.stopPropagation();
    select(part.id);
  };

  return (
    <group ref={group} name={part.id} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
      <Component />
    </group>
  );
}
