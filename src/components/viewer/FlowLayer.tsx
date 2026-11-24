import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Monitor, Plug, type LucideIcon } from "lucide-react";
import * as THREE from "three";
import styles from "./FlowLayer.module.css";
import { partCenter, sceneState } from "./sceneState";
import { FLOW_COLORS } from "./flowColors";
import { getDevice } from "../../data/devices";
import { useFlowStep } from "../../hooks/useFlowStep";
import { useExplorerStore } from "../../store/useExplorerStore";
import type { Device, FlowKind, FlowMarker, FlowPoint, FlowStep } from "../../types";

const POOL = 72; // max particles per path
const SPACING = 0.24; // world units between particles
const SPEED = 1.4; // world units per second
const SIZE = 0.18; // particle diameter incl. halo (world units)
const MAX_POINTS = 16; // max path points
const BADGE_AT = 0.4; // badge position along the path (0–1), clear of the end markers

const MARKER_ICONS: Record<FlowMarker["icon"], LucideIcon> = { monitor: Monitor, plug: Plug };

const vertexShader = /* glsl */ `
  attribute float aAlpha;
  uniform float uScale;
  uniform float uSize;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * uScale / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

// Solid colored core, a thin white ring (so it reads on the green board too)
// and a soft halo of the flow color.
const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float core = 1.0 - smoothstep(0.3, 0.36, d);
    float ring = 1.0 - smoothstep(0.46, 0.52, d);
    float halo = (1.0 - smoothstep(0.5, 1.0, d)) * 0.3;
    vec3 col = mix(vec3(1.0), uColor, core);
    col = mix(uColor, col, ring);
    float a = max(ring, halo) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(col, a);
  }
`;

const TRACE_COLOR = "#1C1C1A";

/** Resolves path points for the current explode amount, dropping duplicates. */
function resolvePath(device: Device, path: FlowPoint[], explode: number, out: THREE.Vector3[]): number {
  let n = 0;
  for (const p of path) {
    if (n >= MAX_POINTS) break;
    let x = 0,
      y = 0,
      z = 0;
    if (p.world) {
      [x, y, z] = p.world;
    } else if (p.part) {
      const part = device.parts.find((q) => q.id === p.part);
      if (!part) continue;
      [x, y, z] = p.assembled ? part.position : partCenter(part, explode);
    }
    if (p.offset) {
      x += p.offset[0];
      y += p.offset[1];
      z += p.offset[2];
    }
    if (n > 0) {
      const q = out[n - 1];
      if ((q.x - x) ** 2 + (q.y - y) ** 2 + (q.z - z) ** 2 < 1e-4) continue;
    }
    out[n++].set(x, y, z);
  }
  return n;
}

function FlowMarkerPill({ marker }: { marker: FlowMarker }) {
  const Icon = MARKER_ICONS[marker.icon];
  return (
    <div className={styles.marker}>
      <Icon size={13} strokeWidth={1.8} aria-hidden="true" />
      {marker.label}
    </div>
  );
}

function FlowPath({ device, step, kind }: { device: Device; step: FlowStep; kind: FlowKind }) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const color = FLOW_COLORS[kind];

  const startRef = useRef<THREE.Group>(null!);
  const endRef = useRef<THREE.Group>(null!);
  const badgeRef = useRef<THREE.Group>(null!);
  const clock = useRef({ t: 0, appear: 0 });
  const pts = useMemo(() => Array.from({ length: MAX_POINTS }, () => new THREE.Vector3()), []);
  const lengths = useMemo(() => new Float32Array(MAX_POINTS), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const buf = useMemo(() => new THREE.Vector2(), []);

  const { points, trace } = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(POOL * 3), 3));
    geometry.setAttribute("aAlpha", new THREE.BufferAttribute(new Float32Array(POOL), 1));
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uScale: { value: 1 },
        uSize: { value: SIZE },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const pointsObj = new THREE.Points(geometry, material);
    pointsObj.frustumCulled = false;
    pointsObj.renderOrder = 20;
    pointsObj.raycast = () => {};

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(MAX_POINTS * 3), 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: TRACE_COLOR,
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false,
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.frustumCulled = false;
    line.renderOrder = 19;
    line.raycast = () => {};
    return { points: pointsObj, trace: line };
  }, [color]);

  useEffect(
    () => () => {
      points.geometry.dispose();
      (points.material as THREE.Material).dispose();
      trace.geometry.dispose();
      (trace.material as THREE.Material).dispose();
    },
    [points, trace],
  );

  useFrame((_, dt) => {
    const reduced = useExplorerStore.getState().reducedMotion;
    const c = clock.current;
    if (reduced) {
      c.appear = 1;
    } else {
      c.t += dt;
      c.appear = Math.min(1, c.appear + dt / 0.35);
    }

    // Path and its cumulative lengths.
    const n = resolvePath(device, step.path, sceneState.explode, pts);
    if (n < 2) return;
    lengths[0] = 0;
    for (let i = 1; i < n; i++) lengths[i] = lengths[i - 1] + pts[i].distanceTo(pts[i - 1]);
    const total = lengths[n - 1];

    const pointAt = (s: number, out: THREE.Vector3) => {
      let i = 1;
      while (i < n - 1 && lengths[i] < s) i++;
      const seg = lengths[i] - lengths[i - 1] || 1;
      return out.lerpVectors(pts[i - 1], pts[i], (s - lengths[i - 1]) / seg);
    };

    // Trace line.
    const linePos = trace.geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < n; i++) linePos.setXYZ(i, pts[i].x, pts[i].y, pts[i].z);
    linePos.needsUpdate = true;
    trace.geometry.setDrawRange(0, n);
    (trace.material as THREE.LineBasicMaterial).opacity = 0.35 * c.appear;

    // Particles stream from start to end; they fade in and out near the ends.
    const pos = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const alpha = points.geometry.getAttribute("aAlpha") as THREE.BufferAttribute;
    const count = Math.min(POOL, Math.max(2, Math.floor(total / SPACING)));
    const gap = total / count;
    const fadeLen = Math.min(0.3, total / 4);
    for (let i = 0; i < POOL; i++) {
      if (i >= count) {
        alpha.setX(i, 0);
        continue;
      }
      const s = (c.t * SPEED + i * gap) % total;
      pointAt(s, tmp);
      pos.setXYZ(i, tmp.x, tmp.y, tmp.z);
      const edge = Math.min(1, s / fadeLen, (total - s) / fadeLen);
      alpha.setX(i, Math.max(0, edge) * c.appear);
    }
    pos.needsUpdate = true;
    alpha.needsUpdate = true;

    // Point size in pixels: world size × (buffer height / (2·tan(fov/2))) / depth.
    gl.getDrawingBufferSize(buf);
    const mat = points.material as THREE.ShaderMaterial;
    mat.uniforms.uScale.value = buf.y / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));

    // Markers and badge.
    startRef.current?.position.copy(pts[0]);
    endRef.current?.position.copy(pts[n - 1]);
    badgeRef.current?.position.copy(pointAt(total * BADGE_AT, tmp));
  });

  return (
    <group>
      <primitive object={trace} />
      <primitive object={points} />
      {step.startMarker && (
        <group ref={startRef}>
          <Html center zIndexRange={[12, 0]} className={styles.anchor}>
            <FlowMarkerPill marker={step.startMarker} />
          </Html>
        </group>
      )}
      {step.endMarker && (
        <group ref={endRef}>
          <Html center zIndexRange={[12, 0]} className={styles.anchor}>
            <FlowMarkerPill marker={step.endMarker} />
          </Html>
        </group>
      )}
      <group ref={badgeRef}>
        <Html center zIndexRange={[12, 0]} className={styles.anchor}>
          <div className={styles.badge} style={{ borderColor: color, color }}>
            {step.badge}
          </div>
        </Html>
      </group>
    </group>
  );
}

/** Particles flowing along the current flow step's path (Phase 2 flow mode). */
export function FlowLayer() {
  const device = getDevice(useExplorerStore((s) => s.deviceId));
  const active = useFlowStep();
  if (!active) return null;
  return <FlowPath key={`${active.flow.id}-${active.step.id}`} device={device} step={active.step} kind={active.flow.id} />;
}
