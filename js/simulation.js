import { Config } from "./config.js";
import { updateTerrainUniforms } from "./terrain.js";
import { updateWater } from "./water.js";
import { updateWeatherEffects } from "./weather.js";

let isPlaying = false;

export function isSimPlaying() {
  return isPlaying;
}

export function togglePlay() {
  isPlaying = !isPlaying;
  return isPlaying;
}

export function resetSim() {
  isPlaying = false;
  Config.progress = 0;
  return isPlaying;
}

export function setProgress(value) {
  Config.progress = value;
}

export function updateSim(
  terrainUniforms,
  water,
  rainParticles,
  windParticles,
) {
  updateTerrainUniforms(terrainUniforms);
  updateWater(water);
  updateWeatherEffects(rainParticles, windParticles);
}

export function advanceProgress(delta) {
  if (Config.progress < 1) {
    Config.progress += delta;
    if (Config.progress > 1) Config.progress = 1;
    return true;
  }
  return false;
}
