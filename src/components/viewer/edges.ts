import * as THREE from "three";

const noRaycast = () => {};

/**
 * Adds outline edges to every mesh under `root` (skipping meshes marked `noEdges`) and
 * returns the meshes' materials plus a cleanup function.
 */
export function addPartEdges(
  root: THREE.Object3D,
  edgeMaterial: THREE.LineBasicMaterial,
): { materials: THREE.Material[]; dispose: () => void } {
  const created: THREE.LineSegments[] = [];
  const materials: THREE.Material[] = [];
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    materials.push(...(Array.isArray(mesh.material) ? mesh.material : [mesh.material]));
    mesh.receiveShadow = true;
    if (mesh.userData.noEdges) return;
    const lines = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 25), edgeMaterial);
    lines.raycast = noRaycast;
    lines.userData.isEdge = true;
    mesh.add(lines);
    created.push(lines);
  });
  return {
    materials,
    dispose: () =>
      created.forEach((l) => {
        l.removeFromParent();
        l.geometry.dispose();
      }),
  };
}
