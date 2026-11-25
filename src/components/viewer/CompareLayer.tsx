import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { easing } from "maath";
import * as THREE from "three";
import styles from "./CompareLayer.module.css";
import { addPartEdges } from "./edges";
import { CategoryDot } from "../common/CategoryDot";
import { getCompareTopic } from "../../data/compare";
import { deviceTiles, getDevice, getPart } from "../../data/devices";
import { getModelSet } from "../../models";
import { useExplorerStore } from "../../store/useExplorerStore";
import type { DeviceView } from "../../models/types";

const SPACING = 3.6; // distance between the compared parts
const FIT = 2.6; // largest dimension of each part in the "same size" view
const FLOOR = -FIT / 2; // parts stand on this height

/** Camera framing for Compare mode. */
export const COMPARE_VIEW: DeviceView = {
  azimuth: 12,
  elevation: 12,
  target: () => [0, -0.2, 0],
  size: () => [3 * SPACING + 0.6, 4.4],
  shadow: { position: [0, FLOOR - 0.02, 0], scale: [15, 6], far: 3, opacity: 0.3 },
};

const EDGE_DEFAULT = new THREE.Color("#8C8F8A");
const EDGE_HOVER = new THREE.Color("#55534D");

/** Bounding box of everything under `root`, in the coordinate space of `space`. */
function measure(root: THREE.Object3D, space: THREE.Object3D) {
  space.updateWorldMatrix(true, true);
  const inv = space.matrixWorld.clone().invert();
  const box = new THREE.Box3();
  const tmp = new THREE.Box3();
  const m = new THREE.Matrix4();
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || mesh.userData.isEdge) return;
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
    m.multiplyMatrices(inv, mesh.matrixWorld);
    tmp.copy(mesh.geometry.boundingBox!).applyMatrix4(m);
    box.union(tmp);
  });
  const size = box.getSize(new THREE.Vector3());
  return { maxDim: Math.max(size.x, size.y, size.z) || 1, height: size.y || 1, center: box.getCenter(new THREE.Vector3()) };
}

interface ItemProps {
  deviceId: string;
  partId: string;
  index: number;
  scale: number;
  onMeasure: (deviceId: string, maxDim: number, height: number) => void;
}

function CompareItem({ deviceId, partId, index, scale, onMeasure }: ItemProps) {
  const outer = useRef<THREE.Group>(null!);
  const center = useRef<THREE.Group>(null!);
  const content = useRef<THREE.Group>(null!);
  const height = useRef(FIT);
  const [hovered, setHovered] = useState(false);
  const openPartIn = useExplorerStore((s) => s.openPartIn);

  const model = getModelSet(deviceId).parts[partId];
  const part = getPart(getDevice(deviceId), partId);
  const tile = deviceTiles.find((t) => t.id === deviceId);
  const edgeMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: EDGE_DEFAULT, transparent: true, opacity: 0.5, depthWrite: false }),
    [],
  );

  // Measure once mounted: center the part on its own origin and report its size.
  useLayoutEffect(() => {
    const m = measure(content.current, outer.current);
    center.current.position.copy(m.center).multiplyScalar(-1);
    height.current = m.height;
    onMeasure(deviceId, m.maxDim, m.height);
    const { dispose } = addPartEdges(content.current, edgeMaterial);
    content.current.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = true;
    });
    return dispose;
  }, [deviceId, partId, edgeMaterial, onMeasure]);

  useEffect(() => () => edgeMaterial.dispose(), [edgeMaterial]);

  useFrame((state, dt) => {
    const reduced = useExplorerStore.getState().reducedMotion;
    const o = outer.current;
    // Stand on the shared floor: lift the part by half its scaled height.
    const y = FLOOR + (height.current * scale) / 2;
    if (reduced) {
      o.scale.setScalar(scale);
      o.position.y = y;
      o.rotation.y = 0;
    } else {
      easing.damp(o.scale, "x", scale, 0.25, dt);
      o.scale.y = o.scale.z = o.scale.x;
      easing.damp(o.position, "y", y, 0.25, dt);
      o.rotation.y = 0.35 * Math.sin(state.clock.elapsedTime * 0.5 + index * 1.3);
    }
    edgeMaterial.color.copy(hovered ? EDGE_HOVER : EDGE_DEFAULT);
    edgeMaterial.opacity = hovered ? 0.95 : 0.5;
  });

  if (!model || !part) return null;
  const { Component } = model;
  const open = () => openPartIn(deviceId, partId);

  return (
    <group position={[(index - 1) * SPACING, 0, 0]}>
      <group
        ref={outer}
        position={[0, 0, 0]}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          if (e.delta > 4) return;
          e.stopPropagation();
          open();
        }}
      >
        <group ref={center}>
          <group ref={content} rotation={model.compareRotation}>
            <Component />
          </group>
        </group>
      </group>
      <group position={[0, FLOOR - 0.75, 0]}>
        <Html center zIndexRange={[10, 0]} className={styles.anchor}>
          <button type="button" tabIndex={-1} aria-hidden="true" className={styles.label} data-hovered={hovered || undefined} onClick={open}>
            <span className={styles.device}>{tile?.name ?? deviceId}</span>
            <span className={styles.part}>
              <CategoryDot category={part.category} size={7} />
              {part.name}
            </span>
          </button>
        </Html>
      </group>
    </group>
  );
}

/** Compare mode: the same kind of part from each device, side by side. */
export function CompareLayer() {
  const topic = getCompareTopic(useExplorerStore((s) => s.compare.topic));
  const trueScale = useExplorerStore((s) => s.compare.trueScale);
  const entries = deviceTiles.filter((t) => topic.parts[t.id]).map((t) => ({ deviceId: t.id, partId: topic.parts[t.id] }));
  const [sizes, setSizes] = useState<Record<string, number>>({});

  const onMeasure = useCallback((deviceId: string, maxDim: number) => {
    setSizes((s) => (s[deviceId] === maxDim ? s : { ...s, [deviceId]: maxDim }));
  }, []);

  // Same size: each part fills the same box. True scale: one shared factor, using each
  // device's real centimeters per scene unit, so the largest part fills the box.
  const realSize = (id: string) => (sizes[id] ?? 1) * getModelSet(id).cmPerUnit;
  const largest = Math.max(...entries.map((e) => realSize(e.deviceId)));
  const scaleFor = (id: string) =>
    trueScale ? (FIT / largest) * getModelSet(id).cmPerUnit : FIT / (sizes[id] ?? FIT);

  return (
    <group key={topic.id}>
      {entries.map((e, i) => (
        <CompareItem
          key={`${topic.id}-${e.deviceId}`}
          deviceId={e.deviceId}
          partId={e.partId}
          index={i}
          scale={sizes[e.deviceId] ? scaleFor(e.deviceId) : 0.001}
          onMeasure={onMeasure}
        />
      ))}
    </group>
  );
}
