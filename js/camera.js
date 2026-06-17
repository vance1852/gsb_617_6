import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let autoRotateEnabled = false;

export function createCamera(container) {
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  );
  camera.position.set(15, 12, 15);
  return camera;
}

export function createControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 50;
  return controls;
}

const viewPositions = {
  top: { x: 0, y: 25, z: 0.1 },
  front: { x: 0, y: 8, z: 20 },
  side: { x: 20, y: 8, z: 0 },
  free: { x: 15, y: 12, z: 15 },
};

export function setView(camera, view) {
  const target = viewPositions[view];
  if (!target) return;
  animateCamera(camera, target);
}

function animateCamera(camera, target) {
  const start = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  };
  const startTime = Date.now();
  (function update() {
    const elapsed = Math.min(1, (Date.now() - startTime) / 800);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    camera.position.set(
      start.x + (target.x - start.x) * eased,
      start.y + (target.y - start.y) * eased,
      start.z + (target.z - start.z) * eased,
    );
    camera.lookAt(0, 0, 0);
    if (elapsed < 1) requestAnimationFrame(update);
  })();
}

export function toggleAutoRotate() {
  autoRotateEnabled = !autoRotateEnabled;
  return autoRotateEnabled;
}

export function isAutoRotateEnabled() {
  return autoRotateEnabled;
}

export function updateAutoRotate(camera, time) {
  if (!autoRotateEnabled) return;
  const angle = time * 0.2;
  camera.position.x = Math.sin(angle) * 18;
  camera.position.z = Math.cos(angle) * 18;
  camera.lookAt(0, 0, 0);
}

export function handleResize(camera, renderer, container) {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}
