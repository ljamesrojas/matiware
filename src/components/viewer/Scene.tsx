import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { easing } from "maath";
import * as THREE from "three";
import styles from "./Scene.module.css";
import { CameraRig, CAMERA_FOV } from "./CameraRig";
import { sceneState } from "./sceneState";
import { FlowLayer } from "./FlowLayer";
import { DesktopPC } from "../../models/desktop-pc/DesktopPC";
import { DEFAULT_EXPLODE, useExplorerStore } from "../../store/useExplorerStore";

sceneState.explode = DEFAULT_EXPLODE;

/** Smooths the explode value once per frame for everything that reads sceneState. */
function ExplodeDriver() {
  useFrame((_, dt) => {
    const { explode, reducedMotion } = useExplorerStore.getState();
    if (reducedMotion) sceneState.explode = explode;
    else easing.damp(sceneState, "explode", explode, 0.1, dt);
  });
  return null;
}

export function Scene() {
  const select = useExplorerStore((s) => s.select);

  return (
    <div className={styles.canvas}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
        camera={{ fov: CAMERA_FOV, near: 0.1, far: 200, position: [9, 4, 12] }}
        onPointerMissed={(e) => {
          if (e.type === "click" && useExplorerStore.getState().selectedPartId) select(null);
        }}
        aria-label="Interactive 3D model of a desktop PC. Use the parts list to select parts with the keyboard."
      >
        <hemisphereLight args={["#ffffff", "#d6d3ca", 1.25]} />
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[6, 10, 9]}
          intensity={2.1}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0005}
          shadow-normalBias={0.02}
          shadow-radius={4}
          shadow-camera-left={-7}
          shadow-camera-right={7}
          shadow-camera-top={7}
          shadow-camera-bottom={-7}
          shadow-camera-near={1}
          shadow-camera-far={40}
        />
        <directionalLight position={[-6, 3, -4]} intensity={0.5} />

        <ExplodeDriver />
        <DesktopPC />
        <FlowLayer />

        <ContactShadows
          position={[0.6, -2.56, 0.9]}
          scale={[14, 10]}
          resolution={512}
          blur={2.6}
          far={5}
          opacity={0.38}
          color="#1C1C1A"
        />
        <CameraRig />
      </Canvas>
    </div>
  );
}
