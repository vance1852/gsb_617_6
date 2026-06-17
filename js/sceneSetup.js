import * as THREE from "three";

export function createScene() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020408, 0.012);
  return scene;
}

export function createRenderer(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);
  return renderer;
}

export function setupLights(scene) {
  scene.add(new THREE.AmbientLight(0x404050, 1.2));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
  dirLight.position.set(-10, 20, 10);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(2048, 2048);
  scene.add(dirLight);
  const p1 = new THREE.PointLight(0xffaa00, 0.6, 100);
  p1.position.set(20, 15, -20);
  scene.add(p1);
  const p2 = new THREE.PointLight(0x00f3ff, 0.4, 50);
  p2.position.set(-15, 5, 15);
  scene.add(p2);
}

export function setupStarfield(scene) {
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(400 * 3);
  for (let i = 0; i < 400; i++) {
    const t = Math.random() * Math.PI * 2,
      p = Math.random() * Math.PI,
      r = 70 + Math.random() * 30;
    starPos[i * 3] = r * Math.sin(p) * Math.cos(t);
    starPos[i * 3 + 1] = r * Math.cos(p) * 0.5 + 15;
    starPos[i * 3 + 2] = r * Math.sin(p) * Math.sin(t);
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  scene.add(
    new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0x8ab4f8, size: 0.4 }),
    ),
  );
}
