import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { easing } from "maath";
import * as THREE from "three";
import { partCenter } from "./sceneState";
import { getModelSet } from "../../models";
import { COMPARE_VIEW } from "./CompareLayer";
import { getDevice, getPart } from "../../data/devices";
import { identifyTargetId, useExplorerStore, type StageInsets } from "../../store/useExplorerStore";

export const CAMERA_FOV = 32;
const MIN_DISTANCE = 3.5;
const MAX_DISTANCE = 42;

/** Space kept free at the top of the stage for the hint / status pills. */
const TOP_INSET = 56;

/** Camera distance that fits a box of the given world size into the area not covered by UI. */
function fitDistance(width: number, height: number, insets: StageInsets, boxW: number, boxH: number) {
  const t = 2 * Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2));
  const fw = Math.max(0.3, (width - insets.right) / width);
  const fh = Math.max(0.3, (height - insets.bottom - TOP_INSET) / height);
  const aspect = width / height;
  const d = Math.max(boxH / (t * fh), boxW / (t * aspect * fw));
  return THREE.MathUtils.clamp(d, MIN_DISTANCE, MAX_DISTANCE);
}

/**
 * Orbit / zoom controls plus all scripted camera moves: focus on the selected part,
 * ease back on deselect, zoom steps and reset. Respects reduced motion.
 */
export function CameraRig() {
  const controls = useRef<CameraControls>(null!);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);

  // The camera focuses on the selected part, or on the part asked about in the Identify quiz.
  const selectedId = useExplorerStore((s) => s.selectedPartId ?? identifyTargetId(s.quiz));
  const explode = useExplorerStore((s) => s.explode);
  const insets = useExplorerStore((s) => s.insets);
  const zoom = useExplorerStore((s) => s.zoom);
  const resetId = useExplorerStore((s) => s.resetId);
  const reducedMotion = useExplorerStore((s) => s.reducedMotion);

  const ready = useRef(false);
  const viewOffset = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const deviceId = useExplorerStore((s) => s.deviceId);
  const device = getDevice(deviceId);
  const comparing = useExplorerStore((s) => s.compare.active);
  const { parts: models, view: deviceView } = getModelSet(deviceId);
  const view = comparing ? COMPARE_VIEW : deviceView;
  const animate = !reducedMotion;

  // Device view: orbit target and the world size to fit, both depending on the explode amount.
  const defaultTarget = (e: number) => view.target(e);
  const defaultDistance = (e: number) => {
    const [w, h] = view.size(e);
    return fitDistance(size.width, size.height, insets, w, h);
  };

  const focusFor = (id: string) => {
    const part = getPart(device, id);
    if (!part) return null;
    const box = models[id]?.focusSize ?? 2;
    // Frame the part with some of its surroundings so students keep their bearings.
    const extent = Math.max(box * 1.9, 4.6);
    return {
      target: partCenter(part, explode),
      distance: fitDistance(size.width, size.height, insets, extent, extent),
    };
  };

  const setDefaultView = (transition: boolean) => {
    const c = controls.current;
    const [tx, ty, tz] = defaultTarget(explode);
    const d = defaultDistance(explode);
    const az = THREE.MathUtils.degToRad(view.azimuth);
    const el = THREE.MathUtils.degToRad(view.elevation);
    c.setLookAt(
      tx + d * Math.sin(az) * Math.cos(el),
      ty + d * Math.sin(el),
      tz + d * Math.cos(az) * Math.cos(el),
      tx,
      ty,
      tz,
      transition,
    );
  };

  // First frame: place the camera without animation.
  useEffect(() => {
    setDefaultView(false);
    ready.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Selection: ease toward the part, or back to the device view.
  useEffect(() => {
    if (!ready.current) return;
    const c = controls.current;
    const focus = selectedId ? focusFor(selectedId) : null;
    if (focus) {
      c.moveTo(...focus.target, animate);
      c.dollyTo(focus.distance, animate);
    } else {
      c.moveTo(...defaultTarget(explode), animate);
      c.dollyTo(defaultDistance(explode), animate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // Explode changes: keep the orbit target on the selected part / model center.
  useEffect(() => {
    if (!ready.current) return;
    const focus = selectedId ? focusFor(selectedId) : null;
    controls.current.moveTo(...(focus ? focus.target : defaultTarget(explode)), animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [explode]);

  // Floating UI changed size (resize, bottom sheet): re-frame the current view.
  useEffect(() => {
    if (!ready.current) return;
    const focus = selectedId ? focusFor(selectedId) : null;
    controls.current.dollyTo(focus ? focus.distance : defaultDistance(explode), animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insets.right, insets.bottom, size.width, size.height]);

  // Zoom − / + buttons.
  useEffect(() => {
    if (!zoom.id) return;
    const c = controls.current;
    c.dolly(c.distance * 0.2 * zoom.step, animate);
  }, [zoom, animate]);

  // Reset view (also runs when switching devices and entering or leaving Compare mode).
  // If a part is selected at the same time (jumping to a part from Compare), focus on it.
  useEffect(() => {
    if (!resetId) return;
    setDefaultView(animate);
    const focus = selectedId ? focusFor(selectedId) : null;
    if (focus) {
      controls.current.moveTo(...focus.target, animate);
      controls.current.dollyTo(focus.distance, animate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetId]);

  // Shift the projection so the model is centered in the area not covered by the inspector / sheet.
  useFrame((_, dt) => {
    const v = viewOffset.current;
    const tx = insets.right / 2;
    const ty = (insets.bottom - TOP_INSET) / 2;
    if (reducedMotion) {
      v.x = tx;
      v.y = ty;
    } else {
      easing.damp(v, "x", tx, 0.25, dt);
      easing.damp(v, "y", ty, 0.25, dt);
    }
    const changed =
      Math.abs((camera.view?.offsetX ?? -1) - v.x) > 0.1 ||
      Math.abs((camera.view?.offsetY ?? -1) - v.y) > 0.1 ||
      v.w !== size.width ||
      v.h !== size.height;
    if (changed) {
      v.w = size.width;
      v.h = size.height;
      camera.setViewOffset(size.width, size.height, v.x, v.y, size.width, size.height);
    }
  });

  return (
    <CameraControls
      ref={controls}
      makeDefault
      minDistance={MIN_DISTANCE}
      maxDistance={MAX_DISTANCE}
      minPolarAngle={0.12}
      maxPolarAngle={Math.PI * 0.82}
      smoothTime={reducedMotion ? 0.0001 : 0.32}
      draggingSmoothTime={reducedMotion ? 0.0001 : 0.12}
    />
  );
}
