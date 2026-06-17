import { Config, stageData } from "./config.js";
import { state } from "./state.js";
import { viewPresets, animateCameraTo } from "./camera.js";

// 缓存的 DOM 引用与相机句柄
let dom = {};
let cameraRef = null;

// 绑定所有控件事件（替代原内联 onclick）
export function setupUI({ camera }) {
  cameraRef = camera;
  dom = {
    progressSlider: document.getElementById("progress-slider"),
    progressVal: document.getElementById("progress-val"),
    subsidenceSlider: document.getElementById("subsidence-slider"),
    subsidenceVal: document.getElementById("subsidence-val"),
    waterSlider: document.getElementById("water-slider"),
    waterVal: document.getElementById("water-val"),
    sedimentSlider: document.getElementById("sediment-slider"),
    sedimentVal: document.getElementById("sediment-val"),
    aridSlider: document.getElementById("arid-slider"),
    aridVal: document.getElementById("arid-val"),
    erosionSlider: document.getElementById("erosion-slider"),
    erosionVal: document.getElementById("erosion-val"),
    densitySlider: document.getElementById("density-slider"),
    densityVal: document.getElementById("density-val"),
    playBtn: document.getElementById("playBtn"),
    resetBtn: document.getElementById("resetBtn"),
    stageDots: document.querySelectorAll(".stage-dot"),
    viewBtns: document.querySelectorAll(".view-btn"),
    rotateBtn: document.getElementById("rotateBtn"),
    simTime: document.getElementById("sim-time"),
    simStage: document.getElementById("sim-stage"),
    explanationBox: document.getElementById("explanation-box"),
    tempVal: document.getElementById("temp-val"),
    humidVal: document.getElementById("humid-val"),
    windVal: document.getElementById("wind-val"),
  };

  dom.progressSlider.addEventListener("input", function (e) {
    Config.progress = parseFloat(e.target.value) / 100;
    updateUI();
  });
  dom.subsidenceSlider.addEventListener("input", function (e) {
    Config.subsidenceDepth = parseFloat(e.target.value);
    dom.subsidenceVal.textContent = e.target.value + "m";
  });
  dom.waterSlider.addEventListener("input", function (e) {
    Config.waterLevel = parseFloat(e.target.value);
    dom.waterVal.textContent = e.target.value + "m";
  });
  dom.sedimentSlider.addEventListener("input", function (e) {
    Config.sedimentThickness = parseFloat(e.target.value);
    dom.sedimentVal.textContent = e.target.value + "m";
  });
  dom.aridSlider.addEventListener("input", function (e) {
    Config.aridRate = parseFloat(e.target.value);
    dom.aridVal.textContent = e.target.value + "x";
  });
  dom.erosionSlider.addEventListener("input", function (e) {
    Config.erosionIntensity = parseFloat(e.target.value);
    dom.erosionVal.textContent = e.target.value;
  });
  dom.densitySlider.addEventListener("input", function (e) {
    Config.ridgeDensity = parseInt(e.target.value);
    dom.densityVal.textContent = e.target.value;
  });
  dom.playBtn.addEventListener("click", togglePlay);
  dom.resetBtn.addEventListener("click", resetSim);
  dom.stageDots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      const s = parseInt(dot.dataset.stage);
      Config.progress = [0, 0.15, 0.35, 0.52, 0.75][s];
      dom.progressSlider.value = Config.progress * 100;
      updateUI();
    });
  });
  dom.viewBtns.forEach(function (btn) {
    if (btn.id === "rotateBtn") {
      btn.addEventListener("click", toggleRotate);
    } else {
      const view = btn.dataset.view;
      btn.addEventListener("click", function () {
        setView(view, btn);
      });
    }
  });
}

function togglePlay() {
  state.isPlaying = !state.isPlaying;
  dom.playBtn.textContent = state.isPlaying ? "⏸ 暂停" : "▶ 播放";
  dom.playBtn.classList.toggle("active", state.isPlaying);
}

function resetSim() {
  state.isPlaying = false;
  Config.progress = 0;
  dom.progressSlider.value = 0;
  dom.playBtn.textContent = "▶ 播放";
  dom.playBtn.classList.remove("active");
  updateUI();
}

// 预设视角切换：清除所有视角按钮高亮，高亮当前按钮并平滑移动相机
function setView(view, btn) {
  dom.viewBtns.forEach(function (b) {
    b.classList.remove("active");
  });
  btn.classList.add("active");
  animateCameraTo(cameraRef, viewPresets[view]);
}

function toggleRotate() {
  state.autoRotate = !state.autoRotate;
  dom.rotateBtn.classList.toggle("active", state.autoRotate);
}

// 供模拟循环写入进度条滑块
export function setProgressSliderValue(v) {
  dom.progressSlider.value = v;
}

// 刷新所有信息面板（进度、阶段、讲解、天气、阶段指示点）
export function updateUI() {
  const p = Config.progress;
  dom.progressVal.textContent = Math.round(p * 100) + "%";
  dom.simTime.textContent = Math.round(p * 500) + " 万年";
  let stage = 0;
  if (p >= 0.75) stage = 4;
  else if (p >= 0.52) stage = 3;
  else if (p >= 0.35) stage = 2;
  else if (p >= 0.15) stage = 1;
  const data = stageData[stage];
  dom.simStage.textContent = data.name;
  dom.explanationBox.innerHTML =
    "<b>当前：</b>" + data.name + "<br><br>" + data.text;

  // 温度和湿度根据干旱化速率动态调整
  const tempAdjust = stage >= 3 ? (Config.aridRate - 1) * 8 : 0;
  const humidAdjust = stage >= 3 ? (Config.aridRate - 1) * -10 : 0;
  const temp = Math.round(data.baseTemp + tempAdjust);
  const humid = Math.max(5, Math.round(data.baseHumid + humidAdjust));

  dom.tempVal.textContent = temp + "°C";
  dom.humidVal.textContent = humid + "%";
  dom.windVal.textContent = data.wind + " m/s";

  dom.stageDots.forEach(function (dot, i) {
    dot.classList.remove("active", "completed");
    if (i < stage) dot.classList.add("completed");
    else if (i === stage) dot.classList.add("active");
  });
}
