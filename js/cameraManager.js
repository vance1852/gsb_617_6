import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { viewPresets } from "./config.js";
import { SimState } from "./state.js";

export function createCameraManager(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 50;

  let animatingCam = false;

  function setView(viewName) {
    const target = viewPresets[viewName];
    if (!target) return;
    SimState.currentView = viewName;
    animateCam(target);
  }

  function animateCam(target) {
    const start = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };
    const startTime = Date.now();
    animatingCam = true;

    function update() {
      const elapsed = Math.min(1, (Date.now() - startTime) / 800);
      const ease = 1 - Math.pow(1 - elapsed, 3);
      camera.position.set(
        start.x + (target.x - start.x) * ease,
        start.y + (target.y - start.y) * ease,
        start.z + (target.z - start.z) * ease,
      );
      camera.lookAt(0, 0, 0);
      if (elapsed < 1) {
        requestAnimationFrame(update);
      } else {
        animatingCam = false;
      }
    }
    update();
  }

  function toggleRotate() {
    SimState.autoRotate = !SimState.autoRotate;
    return SimState.autoRotate;
  }

  function update(time) {
    if (SimState.autoRotate) {
      const angle = time * 0.2;
      camera.position.x = Math.sin(angle) * 18;
      camera.position.z = Math.cos(angle) * 18;
      camera.lookAt(0, 0, 0);
    }
    if (!animatingCam) {
      controls.update();
    }
  }

  return {
    controls,
    setView,
    toggleRotate,
    update,
  };
}
