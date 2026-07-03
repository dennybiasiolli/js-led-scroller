(function () {
  "use strict";

  var STORAGE_KEY = "led-scroller-settings";
  var DEFAULTS = {
    text: "HELLO WORLD",
    textColor: "#00ff41",
    bgColor: "#0a0a0a",
    speed: 100,
    fontSize: 0,
  };

  var track = document.getElementById("scroller-track");
  var settingsToggle = document.getElementById("settings-toggle");
  var settingsPanel = document.getElementById("settings-panel");
  var closeSettings = document.getElementById("close-settings");
  var textInput = document.getElementById("text-input");
  var textColorInput = document.getElementById("text-color");
  var bgColorInput = document.getElementById("bg-color");
  var speedInput = document.getElementById("speed");
  var speedValue = document.getElementById("speed-value");
  var fontSizeInput = document.getElementById("font-size");
  var fontSizeValue = document.getElementById("font-size-value");

  var state = loadSettings();
  var offset = 0;
  var lastTime = 0;
  var textWidth = 0;
  var rafId = null;

  function loadSettings() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return Object.assign({}, DEFAULTS, JSON.parse(saved));
      }
    } catch (e) {
      /* ignore */
    }
    return Object.assign({}, DEFAULTS);
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* ignore */
    }
  }

  function applyColors() {
    document.documentElement.style.setProperty("--text-color", state.textColor);
    document.documentElement.style.setProperty("--bg-color", state.bgColor);
    document.querySelector('meta[name="theme-color"]').setAttribute("content", state.bgColor);
  }

  function computeAutoFontSize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var isLandscape = w > h;
    if (isLandscape) {
      return h * 0.72;
    }
    return Math.min(w * 0.14, h * 0.12);
  }

  function applyFontSize() {
    var sizePx;
    if (state.fontSize > 0) {
      var minDim = Math.min(window.innerWidth, window.innerHeight);
      sizePx = (state.fontSize / 100) * minDim;
    } else {
      sizePx = computeAutoFontSize();
    }
    document.documentElement.style.setProperty("--font-size", sizePx + "px");
  }

  function buildTrack() {
    var content = (state.text.trim() || DEFAULTS.text).toUpperCase();
    track.textContent = "";

    var spanA = document.createElement("span");
    spanA.className = "led-text";
    spanA.textContent = content;

    var spanB = document.createElement("span");
    spanB.className = "led-text";
    spanB.textContent = content;

    track.appendChild(spanA);
    track.appendChild(spanB);

    textWidth = spanA.offsetWidth;
    if (textWidth === 0) {
      textWidth = spanA.scrollWidth;
    }
  }

  function pixelsPerSecond() {
    var w = window.innerWidth;
    var minDim = Math.min(w, window.innerHeight);
    return state.speed * 2 * (w / minDim);
  }

  function tick(now) {
    if (!lastTime) {
      lastTime = now;
    }
    var delta = (now - lastTime) / 1000;
    lastTime = now;

    offset -= pixelsPerSecond() * delta;

    if (-offset >= textWidth) {
      offset += textWidth;
    }

    track.style.transform = "translateX(" + offset + "px)";
    rafId = requestAnimationFrame(tick);
  }

  function startScroll() {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
    lastTime = 0;
    rafId = requestAnimationFrame(tick);
  }

  function syncInputs() {
    textInput.value = state.text;
    textColorInput.value = state.textColor;
    bgColorInput.value = state.bgColor;
    speedInput.value = state.speed;
    speedValue.textContent = String(state.speed);
    fontSizeInput.value = state.fontSize;
    fontSizeValue.textContent = state.fontSize > 0 ? state.fontSize + "%" : "Auto";
  }

  function render() {
    applyColors();
    applyFontSize();
    buildTrack();
    offset = window.innerWidth;
    track.style.transform = "translateX(" + offset + "px)";
    startScroll();
  }

  function updateState(key, value) {
    state[key] = value;
    saveSettings();
    render();
  }

  textInput.addEventListener("input", function () {
    updateState("text", textInput.value);
  });

  textColorInput.addEventListener("input", function () {
    updateState("textColor", textColorInput.value);
  });

  bgColorInput.addEventListener("input", function () {
    updateState("bgColor", bgColorInput.value);
  });

  speedInput.addEventListener("input", function () {
    state.speed = Number(speedInput.value);
    speedValue.textContent = String(state.speed);
    saveSettings();
  });

  fontSizeInput.addEventListener("input", function () {
    state.fontSize = Number(fontSizeInput.value);
    fontSizeValue.textContent = state.fontSize > 0 ? state.fontSize + "%" : "Auto";
    saveSettings();
    applyFontSize();
    buildTrack();
  });

  function openSettings() {
    settingsPanel.hidden = false;
    settingsToggle.setAttribute("aria-expanded", "true");
  }

  function closeSettingsPanel() {
    settingsPanel.hidden = true;
    settingsToggle.setAttribute("aria-expanded", "false");
  }

  settingsToggle.addEventListener("click", openSettings);
  closeSettings.addEventListener("click", closeSettingsPanel);

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(render, 150);
  });

  window.addEventListener("orientationchange", function () {
    setTimeout(render, 300);
  });

  syncInputs();
  render();
})();