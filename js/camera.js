import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 透视相机
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

// 轨道控制器
export function createControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 50;
  return controls;
}

// 预设视角
export const viewPresets = {
  top: { x: 0, y: 25, z: 0.1 },
  front: { x: 0, y: 8, z: 20 },
  side: { x: 20, y: 8, z: 0 },
  free: { x: 15, y: 12, z: 15 },
};

// 相机平滑过渡到目标位置（800ms 三次缓出）
export function animateCameraTo(camera, target) {
  const start = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  };
  const startTime = Date.now();
  (function update() {
    const e = Math.min(1, (Date.now() - startTime) / 800);
    const ez = 1 - Math.pow(1 - e, 3);
    camera.position.set(
      start.x + (target.x - start.x) * ez,
      start.y + (target.y - start.y) * ez,
      start.z + (target.z - start.z) * ez,
    );
    camera.lookAt(0, 0, 0);
    if (e < 1) requestAnimationFrame(update);
  })();
}

// 自动旋转：每帧根据时间设置相机环绕位置
export function applyAutoRotate(camera, time) {
  const a = time * 0.2;
  camera.position.x = Math.sin(a) * 18;
  camera.position.z = Math.cos(a) * 18;
  camera.lookAt(0, 0, 0);
}
