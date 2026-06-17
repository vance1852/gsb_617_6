import * as THREE from 'three';
import { initScene, scene, camera, render, onResize } from './scene.js';
import { initControls, setView, toggleRotate, updateCamera } from './camera.js';
import { createTerrain, updateTerrain } from './terrain.js';
import { createWater, updateWater } from './water.js';
import { createWeatherEffects, createStarfield, updateWeather } from './weather.js';
import { setupUI, updateUI, updateProgressFromPlay } from './ui.js';

const clock = new THREE.Clock();

function init() {
  const container = document.getElementById('right-panel');

  initScene(container);
  initControls();
  createTerrain(scene);
  createWater(scene);
  createWeatherEffects(scene);
  createStarfield(scene);

  document.getElementById('loading').style.display = 'none';

  window.addEventListener('resize', function() {
    onResize(container);
  });

  setupUI();
  updateUI();

  window.setView = function(view) {
    setView(view, event.target);
  };
  window.toggleRotate = toggleRotate;

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  updateProgressFromPlay();
  updateTerrain(time);
  updateWater();
  updateWeather();
  updateCamera(time);
  render();
}

if (typeof THREE === 'undefined') {
  document.getElementById('loading').innerHTML = 
    '<div style="color:#ff6b6b;text-align:center;">' +
    '<div style="font-size:32px;margin-bottom:15px;">⚠</div>' +
    '<div style="margin-bottom:10px;">3D引擎加载失败</div>' +
    '<div style="font-size:12px;color:#888;">请检查网络连接后刷新页面</div>' +
    '</div>';
  throw new Error('Three.js failed to load');
}

init();
