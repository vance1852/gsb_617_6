import { SimState } from "./state.js";
import { stageData, stageProgressPoints } from "./config.js";

export function createUIController(cameraManager) {
  function getCurrentStage(p) {
    if (p >= 0.75) return 4;
    if (p >= 0.52) return 3;
    if (p >= 0.35) return 2;
    if (p >= 0.15) return 1;
    return 0;
  }

  function updateUI() {
    const p = SimState.progress;
    document.getElementById("progress-val").textContent =
      Math.round(p * 100) + "%";
    document.getElementById("sim-time").textContent =
      Math.round(p * 500) + " 万年";

    const stage = getCurrentStage(p);
    const data = stageData[stage];
    document.getElementById("sim-stage").textContent = data.name;
    document.getElementById("explanation-box").innerHTML =
      "<b>当前：</b>" + data.name + "<br><br>" + data.text;

    const tempAdjust = stage >= 3 ? (SimState.aridRate - 1) * 8 : 0;
    const humidAdjust = stage >= 3 ? (SimState.aridRate - 1) * -10 : 0;
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

  function togglePlay() {
    SimState.isPlaying = !SimState.isPlaying;
    const btn = document.getElementById("playBtn");
    btn.textContent = SimState.isPlaying ? "⏸ 暂停" : "▶ 播放";
    btn.classList.toggle("active", SimState.isPlaying);
  }

  function resetSim() {
    SimState.isPlaying = false;
    SimState.progress = 0;
    document.getElementById("progress-slider").value = 0;
    const btn = document.getElementById("playBtn");
    btn.textContent = "▶ 播放";
    btn.classList.remove("active");
    updateUI();
  }

  function jumpToStage(stageIndex) {
    SimState.progress = stageProgressPoints[stageIndex];
    document.getElementById("progress-slider").value = SimState.progress * 100;
    updateUI();
  }

  function setView(viewName) {
    document.querySelectorAll(".view-btn").forEach(function (b) {
      b.classList.remove("active");
    });
    event.target.classList.add("active");
    cameraManager.setView(viewName);
  }

  function toggleRotate() {
    const isActive = cameraManager.toggleRotate();
    document.getElementById("rotateBtn").classList.toggle("active", isActive);
  }

  function setupEvents() {
    document
      .getElementById("progress-slider")
      .addEventListener("input", function (e) {
        SimState.progress = parseFloat(e.target.value) / 100;
        updateUI();
      });

    document
      .getElementById("subsidence-slider")
      .addEventListener("input", function (e) {
        SimState.subsidenceDepth = parseFloat(e.target.value);
        document.getElementById("subsidence-val").textContent =
          e.target.value + "m";
      });

    document
      .getElementById("water-slider")
      .addEventListener("input", function (e) {
        SimState.waterLevel = parseFloat(e.target.value);
        document.getElementById("water-val").textContent = e.target.value + "m";
      });

    document
      .getElementById("sediment-slider")
      .addEventListener("input", function (e) {
        SimState.sedimentThickness = parseFloat(e.target.value);
        document.getElementById("sediment-val").textContent =
          e.target.value + "m";
      });

    document
      .getElementById("arid-slider")
      .addEventListener("input", function (e) {
        SimState.aridRate = parseFloat(e.target.value);
        document.getElementById("arid-val").textContent = e.target.value + "x";
      });

    document
      .getElementById("erosion-slider")
      .addEventListener("input", function (e) {
        SimState.erosionIntensity = parseFloat(e.target.value);
        document.getElementById("erosion-val").textContent = e.target.value;
      });

    document
      .getElementById("density-slider")
      .addEventListener("input", function (e) {
        SimState.ridgeDensity = parseInt(e.target.value);
        document.getElementById("density-val").textContent = e.target.value;
      });

    document.getElementById("playBtn").addEventListener("click", togglePlay);
    document.getElementById("resetBtn").addEventListener("click", resetSim);

    document.querySelectorAll(".stage-dot").forEach(function (dot) {
      dot.addEventListener("click", function () {
        const s = parseInt(dot.dataset.stage);
        jumpToStage(s);
      });
    });

    window.setView = setView;
    window.toggleRotate = toggleRotate;
  }

  function tickPlayback() {
    if (SimState.isPlaying && SimState.progress < 1) {
      SimState.progress += 0.0006;
      document.getElementById("progress-slider").value =
        SimState.progress * 100;
      updateUI();
    }
  }

  setupEvents();
  updateUI();

  return {
    updateUI,
    togglePlay,
    resetSim,
    jumpToStage,
    tickPlayback,
  };
}
