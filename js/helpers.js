import * as THREE from "three";

export function createHelpers(scene) {
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(400 * 3);
  for (let i = 0; i < 400; i++) {
    const t = Math.random() * Math.PI * 2;
    const p = Math.random() * Math.PI;
    const r = 70 + Math.random() * 30;
    starPos[i * 3] = r * Math.sin(p) * Math.cos(t);
    starPos[i * 3 + 1] = r * Math.cos(p) * 0.5 + 15;
    starPos[i * 3 + 2] = r * Math.sin(p) * Math.sin(t);
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0x8ab4f8, size: 0.4 }),
  );
  scene.add(stars);

  return { stars };
}
