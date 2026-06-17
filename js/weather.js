import * as THREE from "three";
import { Config } from "./config.js";

export function createWeatherEffects(scene) {
  const rainGeo = new THREE.BufferGeometry();
  const rainCount = 1000;
  const rainPos = new Float32Array(rainCount * 3);
  for (let i = 0; i < rainCount; i++) {
    rainPos[i * 3] = (Math.random() - 0.5) * 30;
    rainPos[i * 3 + 1] = Math.random() * 20;
    rainPos[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }
  rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPos, 3));
  const rainParticles = new THREE.Points(
    rainGeo,
    new THREE.PointsMaterial({
      color: 0x88ccff,
      size: 0.08,
      transparent: true,
      opacity: 0,
    }),
  );
  scene.add(rainParticles);

  const windGeo = new THREE.BufferGeometry();
  const windCount = 800;
  const windPos = new Float32Array(windCount * 3);
  for (let i = 0; i < windCount; i++) {
    windPos[i * 3] = (Math.random() - 0.5) * 30;
    windPos[i * 3 + 1] = Math.random() * 5 + 0.5;
    windPos[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }
  windGeo.setAttribute("position", new THREE.BufferAttribute(windPos, 3));
  const windParticles = new THREE.Points(
    windGeo,
    new THREE.PointsMaterial({
      color: 0xd4c4a8,
      size: 0.1,
      transparent: true,
      opacity: 0,
    }),
  );
  scene.add(windParticles);

  return { rainParticles, windParticles };
}

export function updateWeatherEffects(rainParticles, windParticles) {
  const p = Config.progress;

  let rainOp = 0;
  if (p > 0.2 && p < 0.5) rainOp = Math.min(0.6, (p - 0.2) * 3);
  if (p > 0.4) rainOp = Math.max(0, 0.6 - (p - 0.4) * 3);
  rainParticles.material.opacity = rainOp;
  if (rainOp > 0) {
    const pos = rainParticles.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i) - 0.3;
      if (y < -2) y = 18;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  }

  let windOp = 0;
  if (p > 0.6) windOp = Math.min(0.7, (p - 0.6) * 2);
  windParticles.material.opacity = windOp;
  if (windOp > 0) {
    const pos = windParticles.geometry.attributes.position;
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
