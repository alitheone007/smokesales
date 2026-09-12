(function () {
  "use strict";

  /* ---------- theme toggle (light / dark, persisted) ---------- */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem("sw-theme"); } catch (e) {}
  if (stored === "light" || stored === "dark") {
    root.setAttribute("data-theme", stored);
  }

  function currentTheme() {
    var attr = root.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") return attr;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function setTheme(mode) {
    root.setAttribute("data-theme", mode);
    try { localStorage.setItem("sw-theme", mode); } catch (e) {}
    syncToggle();
  }

  function syncToggle() {
    var mode = currentTheme();
    var btns = document.querySelectorAll(".theme-toggle button");
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute("aria-pressed", btns[i].getAttribute("data-mode") === mode ? "true" : "false");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    syncToggle();
    var btns = document.querySelectorAll(".theme-toggle button");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        setTheme(this.getAttribute("data-mode"));
      });
    }

    /* ---------- mobile nav ---------- */
    var burger = document.getElementById("navBurger");
    var links = document.getElementById("navLinks");
    if (burger && links) {
      burger.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    /* ---------- account + wholesale registration forms ---------- */
    var signupForm = document.getElementById("signupForm");
    var signupNote = document.getElementById("signupNote");
    if (signupForm) {
      signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (signupNote) {
          signupNote.textContent = "Account created — you can browse and check out with live pricing right away.";
          signupNote.classList.add("on");
        }
        signupForm.reset();
      });
    }

    var wholesaleForm = document.getElementById("wholesaleForm");
    var wholesaleNote = document.getElementById("wholesaleNote");
    if (wholesaleForm) {
      wholesaleForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (wholesaleNote) {
          wholesaleNote.textContent = "Thanks — your resale certificate has been queued for review. Tax-exempt wholesale pricing and net terms unlock once verified, usually within one business day.";
          wholesaleNote.classList.add("on");
        }
        wholesaleForm.reset();
      });
    }

    /* ---------- add to cart (visual only) ---------- */
    var cartButtons = document.querySelectorAll(".tbtn[data-add]");
    var cartToast = document.getElementById("cartToast");
    var cartToastTimer;
    for (var k = 0; k < cartButtons.length; k++) {
      cartButtons[k].addEventListener("click", function (e) {
        e.preventDefault();
        if (cartToast) {
          cartToast.textContent = "Added “" + this.getAttribute("data-add") + "” to cart";
          cartToast.classList.add("on");
          clearTimeout(cartToastTimer);
          cartToastTimer = setTimeout(function () { cartToast.classList.remove("on"); }, 1800);
        }
      });
    }

    /* ---------- smooth in-page anchor scroll ---------- */
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var j = 0; j < anchors.length; j++) {
      anchors[j].addEventListener("click", function (e) {
        var id = this.getAttribute("href");
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          if (links) links.classList.remove("open");
        }
      });
    }
  });
})();
