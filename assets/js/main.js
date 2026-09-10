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
  });
})();
