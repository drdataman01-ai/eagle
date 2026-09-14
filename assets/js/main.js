(function () {
  "use strict";

  /* ---------- theme toggle (day / night) ---------- */
  var root = document.documentElement;
  var THEME_KEY = "eagle-theme";

  function applyTheme(theme) {
    if (theme === "night") {
      root.setAttribute("data-theme", "night");
    } else {
      root.removeAttribute("data-theme");
    }
  }

  var saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) { /* ignore */ }

  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("night");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var isNight = root.getAttribute("data-theme") === "night";
        var next = isNight ? "day" : "night";
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
      });
    }

    /* ---------- contents drawer ---------- */
    var drawer = document.querySelector("[data-drawer]");
    var scrim = document.querySelector("[data-drawer-scrim]");
    var openBtns = document.querySelectorAll("[data-drawer-open]");
    var closeBtns = document.querySelectorAll("[data-drawer-close]");

    function openDrawer() {
      if (!drawer) return;
      drawer.classList.add("open");
      if (scrim) scrim.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeDrawer() {
      if (!drawer) return;
      drawer.classList.remove("open");
      if (scrim) scrim.classList.remove("open");
      document.body.style.overflow = "";
    }

    openBtns.forEach(function (b) { b.addEventListener("click", openDrawer); });
    closeBtns.forEach(function (b) { b.addEventListener("click", closeDrawer); });
    if (scrim) scrim.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDrawer();
    });

    /* ---------- read aloud (chapter text-to-speech) ---------- */
    var bar = document.querySelector("[data-read-aloud]");
    var textEl = document.querySelector(".chapter-body .prose");

    if (bar && textEl) {
      if (!("speechSynthesis" in window)) {
        bar.textContent = bar.getAttribute("data-ra-unsupported") ||
          "Read-aloud isn't supported in this browser.";
        bar.classList.add("is-unsupported");
      } else {
        (function () {
          var btnPlay = bar.querySelector("[data-ra-play]");
          var btnPause = bar.querySelector("[data-ra-pause]");
          var btnStop = bar.querySelector("[data-ra-stop]");
          var voiceSelect = bar.querySelector("[data-ra-voice]");
          var speedInput = bar.querySelector("[data-ra-speed]");
          var statusEl = bar.querySelector("[data-ra-status]");
          var pauseTextEl = btnPause ? btnPause.querySelector("[data-ra-pause-text]") : null;

          var pauseLabel = bar.getAttribute("data-ra-pause-label") || "Pause";
          var resumeLabel = bar.getAttribute("data-ra-resume-label") || "Resume";
          var statusReading = bar.getAttribute("data-ra-status-reading") || "Reading…";
          var statusPaused = bar.getAttribute("data-ra-status-paused") || "Paused";

          var pageLang = (document.documentElement.lang || "en").toLowerCase();
          var isChinese = pageLang.indexOf("zh") === 0;
          var langPrefix = isChinese ? "zh" : "en";
          var utteranceLang = isChinese ? "zh-TW" : "en-US";

          var chapterText = textEl.innerText || textEl.textContent;
          var utterance = null;
          var voices = [];

          function populateVoices() {
            var all = window.speechSynthesis.getVoices();
            voices = all.filter(function (v) {
              return v.lang && v.lang.toLowerCase().indexOf(langPrefix) === 0;
            });
            if (voices.length === 0) voices = all;
            if (!voiceSelect) return;
            voiceSelect.innerHTML = "";
            voices.forEach(function (v, i) {
              var opt = document.createElement("option");
              opt.value = i;
              opt.textContent = v.name + (v.lang ? " (" + v.lang + ")" : "");
              voiceSelect.appendChild(opt);
            });
            var preferredIdx = voices.findIndex(function (v) {
              return /Google|Natural|Meijia|Mei-?Jia|Sinji|Yating|Samantha|Aria|Siri/i.test(v.name);
            });
            if (preferredIdx >= 0) voiceSelect.value = preferredIdx;
          }

          populateVoices();
          if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = populateVoices;
          }

          function setPlayingUI(playing, paused) {
            if (btnPlay) btnPlay.disabled = playing && !paused;
            if (btnPause) btnPause.disabled = !playing;
            if (btnStop) btnStop.disabled = !playing;
            if (pauseTextEl) pauseTextEl.textContent = paused ? resumeLabel : pauseLabel;
            if (statusEl) statusEl.textContent = playing ? (paused ? statusPaused : statusReading) : "";
          }

          if (btnPlay) {
            btnPlay.addEventListener("click", function () {
              window.speechSynthesis.cancel();
              utterance = new SpeechSynthesisUtterance(chapterText);
              var idx = voiceSelect ? parseInt(voiceSelect.value, 10) : -1;
              if (voices[idx]) {
                utterance.voice = voices[idx];
                utterance.lang = voices[idx].lang;
              } else {
                utterance.lang = utteranceLang;
              }
              utterance.rate = (speedInput && parseFloat(speedInput.value)) || 1;
              utterance.onend = function () { setPlayingUI(false, false); };
              utterance.onerror = function () { setPlayingUI(false, false); };
              window.speechSynthesis.speak(utterance);
              setPlayingUI(true, false);
            });
          }

          if (btnPause) {
            btnPause.addEventListener("click", function () {
              if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
                setPlayingUI(true, false);
              } else if (window.speechSynthesis.speaking) {
                window.speechSynthesis.pause();
                setPlayingUI(true, true);
              }
            });
          }

          if (btnStop) {
            btnStop.addEventListener("click", function () {
              window.speechSynthesis.cancel();
              setPlayingUI(false, false);
            });
          }

          window.addEventListener("beforeunload", function () {
            window.speechSynthesis.cancel();
          });
        })();
      }
    }
  });
})();
