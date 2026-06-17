import * as THREE from "three";
import {
  createScene,
  createRenderer,
  setupLights,
  setupStarfield,
} from "./sceneSetup.js";
import {
  createCamera,
  createControls,
  updateAutoRotate,
  handleResize,
} from "./camera.js";
import { createTerrain } from "./terrain.js";
import { createWater } from "./water.js";
import { createWeatherEffects } from "./weather.js";
import { isSimPlaying, advanceProgress, updateSim } from "./simulation.js";
import { setupUI, updateUI, syncSliderFromProgress } from "./ui.js";

let scene, camera, renderer, controls;
let terrainUniforms, water, rainParticles, windParticles;
let clock;

function init() {
  const container = document.getElementById("right-panel");

  scene = createScene();
  camera = createCamera(container);
  renderer = createRenderer(container);
  controls = createControls(camera, renderer.domElement);

  setupLights(scene);
  setupStarfield(scene);

  const terrainResult = createTerrain(scene);
  terrainUniforms = terrainResult.uniforms;

  water = createWater(scene);

  const weather = createWeatherEffects(scene);
  rainParticles = weather.rainParticles;
  windParticles = weather.windParticles;

  clock = new THREE.Clock();

  setupUI(camera);
  updateUI();

  document.getElementById("loading").style.display = "none";

  window.addEventListener("resize", function () {
    handleResize(camera, renderer, container);
  });

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();

  if (terrainUniforms) terrainUniforms.uTime.value = time;

  if (isSimPlaying()) {
    advanceProgress(0.0006);
    syncSliderFromProgress();
    updateUI();
  }

  updateAutoRotate(camera, time);

  updateSim(terrainUniforms, water, rainParticles, windParticles);

  controls.update();
  renderer.render(scene, camera);
}

init();
