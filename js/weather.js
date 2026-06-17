import * as THREE from "three";
import { Config } from "./config.js";

// 创建雨滴与风沙粒子系统（初始透明）
export function createWeather(scene) {
  // 雨滴粒子
  const rainGeo = new THREE.BufferGeometry();
  const rainCount = 1000;
  const rainPos = new Float32Array(rainCount * 3);
  for (let i = 0; i < rainCount; i++) {
    rainPos[i * 3] = (Math.random() - 0.5) * 30;
    rainPos[i * 3 + 1] = Math.random() * 20;
    rainPos[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }
  rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPos, 3));
  const rain = new THREE.Points(
    rainGeo,
    new THREE.PointsMaterial({
      color: 0x88ccff,
      size: 0.08,
      transparent: true,
      opacity: 0,
    }),
  );
  scene.add(rain);

  // 风沙粒子
  const windGeo = new THREE.BufferGeometry();
  const windCount = 800;
  const windPos = new Float32Array(windCount * 3);
  for (let i = 0; i < windCount; i++) {
    windPos[i * 3] = (Math.random() - 0.5) * 30;
    windPos[i * 3 + 1] = Math.random() * 5 + 0.5;
    windPos[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }
  windGeo.setAttribute("position", new THREE.BufferAttribute(windPos, 3));
  const wind = new THREE.Points(
    windGeo,
    new THREE.PointsMaterial({
      color: 0xd4c4a8,
      size: 0.1,
      transparent: true,
      opacity: 0,
    }),
  );
  scene.add(wind);

  return { rain, wind };
}

// 根据进度更新雨滴与风沙（湖泊阶段下雨，侵蚀阶段起风）
export function updateWeather({ rain, wind }, p) {
  // 雨滴 (湖泊阶段)
  let rainOp = 0;
  if (p > 0.2 && p < 0.5) rainOp = Math.min(0.6, (p - 0.2) * 3);
  if (p > 0.4) rainOp = Math.max(0, 0.6 - (p - 0.4) * 3);
  rain.material.opacity = rainOp;
  if (rainOp > 0) {
    const pos = rain.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i) - 0.3;
      if (y < -2) y = 18;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  }

  // 风沙 (侵蚀阶段)
  let windOp = 0;
  if (p > 0.6) windOp = Math.min(0.7, (p - 0.6) * 2);
  wind.material.opacity = windOp;
  if (windOp > 0) {
    const pos = wind.geometry.attributes.position;
    const speed = Config.erosionIntensity * 0.15;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i) + speed;
      if (x > 15) x = -15;
      pos.setX(i, x);
      pos.setY(i, pos.getY(i) + (Math.random() - 0.5) * 0.05);
    }
    pos.needsUpdate = true;
  }
}
