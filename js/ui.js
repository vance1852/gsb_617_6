import { Config, stageData, getStageIndex, stageJumpPoints } from './config.js';

let isPlaying = false;

export function setupUI(onUpdate) {
  document.getElementById('progress-slider').addEventListener('input', function(e) {
    Config.progress = parseFloat(e.target.value) / 100;
    updateUI();
    if (onUpdate) onUpdate();
  });
  document.getElementById('subsidence-slider').addEventListener('input', function(e) {
    Config.subsidenceDepth = parseFloat(e.target.value);
    document.getElementById('subsidence-val').textContent = e.target.value + 'm';
  });
  document.getElementById('water-slider').addEventListener('input', function(e) {
    Config.waterLevel = parseFloat(e.target.value);
    document.getElementById('water-val').textContent = e.target.value + 'm';
  });
  document.getElementById('sediment-slider').addEventListener('input', function(e) {
    Config.sedimentThickness = parseFloat(e.target.value);
    document.getElementById('sediment-val').textContent = e.target.value + 'm';
  });
  document.getElementById('arid-slider').addEventListener('input', function(e) {
    Config.aridRate = parseFloat(e.target.value);
    document.getElementById('arid-val').textContent = e.target.value + 'x';
  });
  document.getElementById('erosion-slider').addEventListener('input', function(e) {
    Config.erosionIntensity = parseFloat(e.target.value);
    document.getElementById('erosion-val').textContent = e.target.value;
  });
  document.getElementById('density-slider').addEventListener('input', function(e) {
    Config.ridgeDensity = parseInt(e.target.value);
    document.getElementById('density-val').textContent = e.target.value;
  });
  document.getElementById('playBtn').addEventListener('click', togglePlay);
  document.getElementById('resetBtn').addEventListener('click', function() {
    resetSim();
    if (onUpdate) onUpdate();
  });
  document.querySelectorAll('.stage-dot').forEach(function(dot) {
    dot.addEventListener('click', function() {
      const s = parseInt(dot.dataset.stage);
      Config.progress = stageJumpPoints[s];
      document.getElementById('progress-slider').value = Config.progress * 100;
      updateUI();
      if (onUpdate) onUpdate();
    });
  });
}

export function togglePlay() {
  isPlaying = !isPlaying;
  document.getElementById('playBtn').textContent = isPlaying ? '⏸ 暂停' : '▶ 播放';
  document.getElementById('playBtn').classList.toggle('active', isPlaying);
}

export function resetSim() {
  isPlaying = false;
  Config.progress = 0;
  document.getElementById('progress-slider').value = 0;
  document.getElementById('playBtn').textContent = '▶ 播放';
  document.getElementById('playBtn').classList.remove('active');
  updateUI();
}

export function updateUI() {
  const p = Config.progress;
  document.getElementById('progress-val').textContent = Math.round(p * 100) + '%';
  document.getElementById('sim-time').textContent = Math.round(p * 500) + ' 万年';
  const stage = getStageIndex(p);
  const data = stageData[stage];
  document.getElementById('sim-stage').textContent = data.name;
  document.getElementById('explanation-box').innerHTML = '<b>当前：</b>' + data.name + '<br><br>' + data.text;

  const tempAdjust = (stage >= 3) ? (Config.aridRate - 1) * 8 : 0;
  const humidAdjust = (stage >= 3) ? (Config.aridRate - 1) * -10 : 0;
  const temp = Math.round(data.baseTemp + tempAdjust);
  const humid = Math.max(5, Math.round(data.baseHumid + humidAdjust));

  document.getElementById('temp-val').textContent = temp + '°C';
  document.getElementById('humid-val').textContent = humid + '%';
  document.getElementById('wind-val').textContent = data.wind + ' m/s';

  document.querySelectorAll('.stage-dot').forEach(function(dot, i) {
    dot.classList.remove('active', 'completed');
    if (i < stage) dot.classList.add('completed');
    else if (i === stage) dot.classList.add('active');
  });
}

export function updateProgressFromPlay() {
  if (isPlaying && Config.progress < 1) {
    Config.progress += 0.0006;
    document.getElementById('progress-slider').value = Config.progress * 100;
    updateUI();
  }
}

export { isPlaying };
