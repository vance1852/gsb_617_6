import * as THREE from "three";
import {
  createScene,
  createRenderer,
  setupLights,
  setupStars,
  onResize,
} from "./scene.js";
import { createCamera, createControls } from "./camera.js";
import { createTerrain } from "./terrain.js";
import { createWater } from "./water.js";
import { createWeather } from "./weather.js";
import * as ui from "./ui.js";
import { startLoop } from "./simulation.js";

function init() {
  // 检查Three.js是否加载成功
  if (typeof THREE === "undefined") {
    document.getElementById("loading").innerHTML =
      '<div style="color:#ff6b6b;text-align:center;">' +
      '<div style="font-size:32px;margin-bottom:15px;">⚠</div>' +
      '<div style="margin-bottom:10px;">3D引擎加载失败</div>' +
      '<div style="font-size:12px;color:#888;">请检查网络连接后刷新页面</div>' +
      "</div>";
    throw new Error("Three.js failed to load");
  }

  const container = document.getElementById("right-panel");

  const scene = createScene();
  const camera = createCamera(container);
  const renderer = createRenderer(container);
  const controls = createControls(camera, renderer.domElement);

  setupLights(scene);
  const terrain = createTerrain(scene);
  const water = createWater(scene);
  const weather = createWeather(scene);
  setupStars(scene);

  document.getElementById("loading").style.display = "none";
  window.addEventListener("resize", function () {
    onResize(camera, renderer, container);
  });
  ui.setupUI({ camera });
  startLoop({ scene, camera, renderer, controls, terrain, water, weather });
}

init();
