import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import * as THREE from "three";
import { sceneState } from "./sceneState";
import { useExplorerStore, type PartRole } from "../../store/useExplorerStore";
import type { Part } from "../../types";

const LINE_COLOR = "#8A95A1";

function Leader({ part, role }: { part: Part; role: PartRole }) {
  const fade = useRef({ opacity: 0.85 });
  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
    const material = new THREE.LineDashedMaterial({
      color: LINE_COLOR,
      dashSize: 0.09,
      gapSize: 0.07,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const l = new THREE.Line(geometry, material);
    l.frustumCulled = false;
    l.raycast = () => {};
    return l;
  }, []);

  useEffect(
    () => () => {
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    },
    [line],
  );

  useFrame((_, dt) => {
    const e = sceneState.explode;
    const [px, py, pz] = part.position;
    const [ox, oy, oz] = part.explodeOffset;
    const attr = line.geometry.getAttribute("position") as THREE.BufferAttribute;
    attr.setXYZ(0, px, py, pz);
    attr.setXYZ(1, px + ox * e, py + oy * e, pz + oz * e);
    attr.needsUpdate = true;
    line.computeLineDistances();

    const target = role === "hidden" ? 0 : role === "faded" ? 0.25 : 0.85;
    const f = fade.current;
    if (useExplorerStore.getState().reducedMotion) f.opacity = target;
    else easing.damp(f, "opacity", target, 0.14, dt);
    (line.material as THREE.LineDashedMaterial).opacity = f.opacity;
    line.visible = e > 0.02 && f.opacity > 0.01;
  });

  return <primitive object={line} />;
}

/** Dashed lines from each moved part back to its slot. */
export function LeaderLines({ parts, roles }: { parts: Part[]; roles: Record<string, PartRole> }) {
  const moving = parts.filter((p) => p.explodeOffset.some((v) => v !== 0));
  return (
    <group>
      {moving.map((p) => (
        <Leader key={p.id} part={p} role={roles[p.id]} />
      ))}
    </group>
  );
}
