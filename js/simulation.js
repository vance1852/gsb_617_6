import * as THREE from "three";
import { Config } from "./config.js";
import { state } from "./state.js";
import * as ui from "./ui.js";
import { applyAutoRotate } from "./camera.js";
import { updateWater } from "./water.js";
import { updateWeather } from "./weather.js";

const clock = new THREE.Clock();
let ctx = null;

// 启动渲染循环，context 携带所有场景资源
export function startLoop(context) {
  ctx = context;
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  const { terrain, camera, controls, renderer, scene } = ctx;

  if (terrain) terrain.setTime(time);

  if (state.isPlaying && Config.progress < 1) {
    Config.progress += 0.0006;
    ui.setProgressSliderValue(Config.progress * 100);
    ui.updateUI();
  }

  if (state.autoRotate) {
    applyAutoRotate(camera, time);
  }

  updateSim();
  controls.update();
  renderer.render(scene, camera);
}

// 每帧同步地形 uniforms、水面与天气
function updateSim() {
  const p = Config.progress;
  const { terrain, water, weather } = ctx;

  if (terrain) {
    terrain.setProgress(p);
    terrain.syncParams();
  }
  updateWater(water, p);
  updateWeather(weather, p);
}
