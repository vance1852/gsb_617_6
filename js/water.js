import * as THREE from "three";
import { Config } from "./config.js";

// 创建湖面网格（初始隐藏在画面下方）
export function createWater(scene) {
  const geo = new THREE.PlaneGeometry(18, 18, 32, 32);
  geo.rotateX(-Math.PI / 2);
  const water = new THREE.Mesh(
    geo,
    new THREE.MeshPhongMaterial({
      color: 0x0088cc,
      transparent: true,
      opacity: 0,
      shininess: 100,
      side: THREE.DoubleSide,
    }),
  );
  water.position.y = -10;
  scene.add(water);
  return water;
}

// 根据进度更新水面高度与透明度（干旱化速率影响湖泊干涸速度）
export function updateWater(water, p) {
  const dryStart = 0.48 / Config.aridRate;
  const dryEnd = 0.62 / Config.aridRate;
  let wy = -10,
    wo = 0;
  if (p > 0.18 && p <= 0.32) {
    const t = (p - 0.18) / 0.14;
    wy = -Config.subsidenceDepth + Config.waterLevel * t * 0.8;
    wo = t * 0.65;
  } else if (p > 0.32 && p <= dryStart) {
    wy = -Config.subsidenceDepth + Config.waterLevel * 0.8;
    wo = 0.65;
  } else if (p > dryStart && p <= dryEnd) {
    const t = 1 - (p - dryStart) / (dryEnd - dryStart);
    wy = -Config.subsidenceDepth + Config.waterLevel * t * 0.8;
    wo = t * 0.65;
  }
  water.position.y += (wy - water.position.y) * 0.08;
  water.material.opacity += (wo - water.material.opacity) * 0.08;
}
