import * as THREE from "three";
import { SimState } from "./state.js";

export function createWater(scene) {
  const geometry = new THREE.PlaneGeometry(18, 18, 32, 32);
  geometry.rotateX(-Math.PI / 2);

  const material = new THREE.MeshPhongMaterial({
    color: 0x0088cc,
    transparent: true,
    opacity: 0,
    shininess: 100,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = -10;
  scene.add(mesh);

  function update() {
    const p = SimState.progress;

    const dryStart = 0.48 / SimState.aridRate;
    const dryEnd = 0.62 / SimState.aridRate;

    let targetY = -10;
    let targetOpacity = 0;

    if (p > 0.18 && p <= 0.32) {
      const t = (p - 0.18) / 0.14;
      targetY = -SimState.subsidenceDepth + SimState.waterLevel * t * 0.8;
      targetOpacity = t * 0.65;
    } else if (p > 0.32 && p <= dryStart) {
      targetY = -SimState.subsidenceDepth + SimState.waterLevel * 0.8;
      targetOpacity = 0.65;
    } else if (p > dryStart && p <= dryEnd) {
      const t = 1 - (p - dryStart) / (dryEnd - dryStart);
      targetY = -SimState.subsidenceDepth + SimState.waterLevel * t * 0.8;
      targetOpacity = t * 0.65;
    }

    mesh.position.y += (targetY - mesh.position.y) * 0.08;
    material.opacity += (targetOpacity - material.opacity) * 0.08;
  }

  return {
    mesh,
    material,
    update,
  };
}
