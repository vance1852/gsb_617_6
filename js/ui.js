import { Config, stageData, stageProgressPoints } from "./config.js";
import { togglePlay, resetSim, setProgress } from "./simulation.js";
import { setView, toggleAutoRotate } from "./camera.js";

let onProgressChange = null;

export function setOnProgressChange(callback) {
  onProgressChange = callback;
}

export function setupUI(camera) {
  document
    .getElementById("progress-slider")
    .addEventListener("input", function (e) {
      Config.progress = parseFloat(e.target.value) / 100;
      updateUI();
      if (onProgressChange) onProgressChange();
    });

  document
    .getElementById("subsidence-slider")
    .addEventListener("input", function (e) {
      Config.subsidenceDepth = parseFloat(e.target.value);
      document.getElementById("subsidence-val").textContent =
        e.target.value + "m";
    });

  document
    .getElementById("water-slider")
    .addEventListener("input", function (e) {
      Config.waterLevel = parseFloat(e.target.value);
      document.getElementById("water-val").textContent = e.target.value + "m";
    });

  document
    .getElementById("sediment-slider")
    .addEventListener("input", function (e) {
      Config.sedimentThickness = parseFloat(e.target.value);
      document.getElementById("sediment-val").textContent =
        e.target.value + "m";
    });

  document
    .getElementById("arid-slider")
    .addEventListener("input", function (e) {
      Config.aridRate = parseFloat(e.target.value);
      document.getElementById("arid-val").textContent = e.target.value + "x";
    });

  document
    .getElementById("erosion-slider")
    .addEventListener("input", function (e) {
      Config.erosionIntensity = parseFloat(e.target.value);
      document.getElementById("erosion-val").textContent = e.target.value;
    });

  document
    .getElementById("density-slider")
    .addEventListener("input", function (e) {
      Config.ridgeDensity = parseInt(e.target.value);
      document.getElementById("density-val").textContent = e.target.value;
    });

  document.getElementById("playBtn").addEventListener("click", function () {
    const playing = togglePlay();
    updatePlayButton(playing);
  });

  document.getElementById("resetBtn").addEventListener("click", function () {
    resetSim();
    document.getElementById("progress-slider").value = 0;
    updatePlayButton(false);
    updateUI();
    if (onProgressChange) onProgressChange();
  });

  document.querySelectorAll(".stage-dot").forEach(function (dot) {
    dot.addEventListener("click", function () {
      const s = parseInt(dot.dataset.stage);
      const progress = stageProgressPoints[s];
      setProgress(progress);
      document.getElementById("progress-slider").value = progress * 100;
      updateUI();
      if (onProgressChange) onProgressChange();
    });
  });

  document.querySelectorAll(".view-btn").forEach(function (btn) {
    if (btn.id === "rotateBtn") {
      btn.addEventListener("click", function () {
        const enabled = toggleAutoRotate();
        document
          .getElementById("rotateBtn")
          .classList.toggle("active", enabled);
      });
    } else {
      btn.addEventListener("click", function (e) {
        document.querySelectorAll(".view-btn").forEach(function (b) {
          b.classList.remove("active");
        });
        e.currentTarget.classList.add("active");
        const viewKey = e.currentTarget.dataset.view;
        setView(camera, viewKey);
      });
    }
  });
}

function updatePlayButton(playing) {
  const btn = document.getElementById("playBtn");
  btn.textContent = playing ? "⏸ 暂停" : "▶ 播放";
  btn.classList.toggle("active", playing);
}

export function updateUI() {
  const p = Config.progress;
  document.getElementById("progress-val").textContent =
    Math.round(p * 100) + "%";
  document.getElementById("sim-time").textContent =
    Math.round(p * 500) + " 万年";

  let stage = 0;
  if (p >= 0.75) stage = 4;
  else if (p >= 0.52) stage = 3;
  else if (p >= 0.35) stage = 2;
  else if (p >= 0.15) stage = 1;

  const data = stageData[stage];
  document.getElementById("sim-stage").textContent = data.name;
  document.getElementById("explanation-box").innerHTML =
    "<b>当前：</b>" + data.name + "<br><br>" + data.text;

  const tempAdjust = stage >= 3 ? (Config.aridRate - 1) * 8 : 0;
  const humidAdjust = stage >= 3 ? (Config.aridRate - 1) * -10 : 0;
  const temp = Math.round(data.baseTemp + tempAdjust);
  const humid = Math.max(5, Math.round(data.baseHumid + humidAdjust));

  document.getElementById("temp-val").textContent = temp + "°C";
  document.getElementById("humid-val").textContent = humid + "%";
  document.getElementById("wind-val").textContent = data.wind + " m/s";

  document.querySelectorAll(".stage-dot").forEach(function (dot, i) {
    dot.classList.remove("active", "completed");
    if (i < stage) dot.classList.add("completed");
    else if (i === stage) dot.classList.add("active");
  });
}

export function syncSliderFromProgress() {
  document.getElementById("progress-slider").value = Config.progress * 100;
}
