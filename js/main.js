import * as THREE from "three";
import { createSceneManager } from "./sceneManager.js";
import { createCameraManager } from "./cameraManager.js";
import { createTerrain } from "./terrain.js";
import { createWater } from "./water.js";
import { createWeatherEffects } from "./weatherEffects.js";
import { createHelpers } from "./helpers.js";
import { createUIController } from "./uiController.js";

if (typeof THREE === "undefined") {
  document.getElementById("loading").innerHTML =
    '<div style="color:#ff6b6b;text-align:center;">' +
    '<div style="font-size:32px;margin-bottom:15px;">⚠</div>' +
    '<div style="margin-bottom:10px;">3D引擎加载失败</div>' +
    '<div style="font-size:12px;color:#888;">请检查网络连接后刷新页面</div>' +
    "</div>";
  throw new Error("Three.js failed to load");
}

const clock = new THREE.Clock();

let sceneMgr, cameraMgr, terrain, water, weather, ui;

function init() {
  const container = document.getElementById("right-panel");

  sceneMgr = createSceneManager(container);
  cameraMgr = createCameraManager(
    sceneMgr.camera,
    sceneMgr.renderer.domElement,
  );

  terrain = createTerrain(sceneMgr.scene);
  water = createWater(sceneMgr.scene);
  weather = createWeatherEffects(sceneMgr.scene);
  createHelpers(sceneMgr.scene);

  ui = createUIController(cameraMgr);

  document.getElementById("loading").style.display = "none";
  window.addEventListener("resize", onResize);

  animate();
}

function onResize() {
  sceneMgr.onResize();
}

function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();

  ui.tickPlayback();

  terrain.update(time);
  water.update();
  weather.update();

  cameraMgr.update(time);
  sceneMgr.render();
}

init();
