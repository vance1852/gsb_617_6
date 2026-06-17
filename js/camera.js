import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { camera, renderer } from './scene.js';

let controls;
let autoRotate = false;

const viewPresets = {
  top: { x: 0, y: 25, z: 0.1 },
  front: { x: 0, y: 8, z: 20 },
  side: { x: 20, y: 8, z: 0 },
  free: { x: 15, y: 12, z: 15 }
};

export function initControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 50;
  return controls;
}

export function setView(view, btnElement) {
  document.querySelectorAll('.view-btn').forEach(function(b) { b.classList.remove('active'); });
  if (btnElement) btnElement.classList.add('active');
  const target = viewPresets[view];
  animateCam(target);
}

function animateCam(target) {
  const start = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
  const startTime = Date.now();
  (function update() {
    const elapsed = Math.min(1, (Date.now() - startTime) / 800);
    const ease = 1 - Math.pow(1 - elapsed, 3);
    camera.position.set(
      start.x + (target.x - start.x) * ease,
      start.y + (target.y - start.y) * ease,
      start.z + (target.z - start.z) * ease
    );
    camera.lookAt(0, 0, 0);
    if (elapsed < 1) requestAnimationFrame(update);
  })();
}

export function toggleRotate() {
  autoRotate = !autoRotate;
  document.getElementById('rotateBtn').classList.toggle('active', autoRotate);
}

export function updateCamera(time) {
  if (autoRotate) {
    const a = time * 0.2;
    camera.position.x = Math.sin(a) * 18;
    camera.position.z = Math.cos(a) * 18;
    camera.lookAt(0, 0, 0);
  }
  controls.update();
}

export { controls, autoRotate };
