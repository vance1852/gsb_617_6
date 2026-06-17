import * as THREE from 'three';
import { terrainVertexShader, terrainFragmentShader } from './terrainShaders.js';
import { Config } from './config.js';

let terrain, terrainUniforms;

export function createTerrain(scene) {
  const geo = new THREE.PlaneGeometry(20, 20, 256, 256);
  geo.rotateX(-Math.PI / 2);
  terrainUniforms = {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uSubsidenceDepth: { value: Config.subsidenceDepth },
    uErosionIntensity: { value: Config.erosionIntensity },
    uRidgeDensity: { value: Config.ridgeDensity },
    uSedimentThickness: { value: Config.sedimentThickness },
    uAridRate: { value: Config.aridRate }
  };
  terrain = new THREE.Mesh(geo, new THREE.ShaderMaterial({
    vertexShader: terrainVertexShader,
    fragmentShader: terrainFragmentShader,
    uniforms: terrainUniforms,
    side: THREE.DoubleSide
  }));
  terrain.receiveShadow = true;
  scene.add(terrain);
}

export function updateTerrain(time) {
  if (!terrainUniforms) return;
  terrainUniforms.uTime.value = time;
  terrainUniforms.uProgress.value = Config.progress;
  terrainUniforms.uSubsidenceDepth.value = Config.subsidenceDepth;
  terrainUniforms.uErosionIntensity.value = Config.erosionIntensity;
  terrainUniforms.uRidgeDensity.value = Config.ridgeDensity;
  terrainUniforms.uSedimentThickness.value = Config.sedimentThickness;
  terrainUniforms.uAridRate.value = Config.aridRate;
}

export { terrain, terrainUniforms };
