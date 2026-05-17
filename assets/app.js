// Volt legal site — dependency-free enhancement: particle field, optional
// banner media, scroll progress, TOC scroll-spy, reveal, nav, back-to-top.
(function () {
  "use strict";
  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Optional real banner: assets/banner.(mp4|webm) then (webp|jpg|png) -- */
  // Drop a file at volt-legal/assets/banner.* and it's used automatically;
  // otherwise the pure-CSS scene stays. Probed so a 404 never breaks layout.
  (function bannerMedia() {
    var bg = document.querySelector(".bg");
    var v = document.getElementById("bgVideo");
    if (!bg || !v) return;
    var vids = ["assets/banner.mp4", "assets/banner.webm",
                "../assets/banner.mp4", "../assets/banner.webm"];
    var imgs = ["assets/banner.webp", "assets/banner.jpg", "assets/banner.png",
                "../assets/banner.webp", "../assets/banner.jpg", "../assets/banner.png"];
    function tryImage(i) {
      if (i >= imgs.length) return;
      var im = new Image();
      im.onload = function () {
        v.outerHTML = '<div class="bg-media" style="background:#000 center/cover url(' +
          imgs[i] + ')"></div>';
        bg.classList.add("has-media");
      };
      im.onerror = function () { tryImage(i + 1); };
      im.src = imgs[i];
    }
    function tryVideo(i) {
      if (reduce || i >= vids.length) { tryImage(0); return; }
      var s = document.createElement("source");
      s.src = vids[i];
      var done = false;
      v.onloadeddata = function () {
        done = true; bg.classList.add("has-media");
        var p = v.play(); if (p && p.catch) p.catch(function () {});
      };
      v.onerror = function () { if (!done) { v.removeChild(s); tryVideo(i + 1); } };
      v.appendChild(s);
      v.load();
      setTimeout(function () { if (!done && !bg.classList.contains("has-media")) {
        try { v.removeChild(s); } catch (e) {} tryVideo(i + 1);
      } }, 2600);
    }
    tryVideo(0);
  })();

  /* ---- Gold particle field ------------------------------------------------ */
  (function particles() {
    var c = document.getElementById("fx");
    if (!c || reduce) return;
    var ctx = c.getContext("2d"), w, h, dots = [], raf = null, vis = true;
    function size() {
      w = c.width = innerWidth; h = c.height = innerHeight;
      var n = Math.min(150, Math.round((w * h) / 17000));
      dots = [];
      for (var i = 0; i < n; i++) dots.push({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.16,
        vy: -(Math.random() * 0.28 + 0.05),
        a: Math.random() * 0.5 + 0.12,
        tw: Math.random() * Math.PI * 2
      });
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx; d.y += d.vy; d.tw += 0.02;
        if (d.y < -10) { d.y = h + 10; d.x = Math.random() * w; }
        if (d.x < -10) d.x = w + 10; else if (d.x > w + 10) d.x = -10;
        var al = d.a * (0.6 + 0.4 * Math.sin(d.tw));
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, 6.2832);
        ctx.fillStyle = "rgba(245,210,128," + al.toFixed(3) + ")";
        ctx.shadowColor = "rgba(231,181,74,.7)";
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf && vis) frame(); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    addEventListener("resize", size, { passive: true });
    document.addEventListener("visibilitychange", function () {
      vis = !document.hidden; vis ? start() : stop();
    });
    size(); start();
  })();

  /* ---- Scroll progress + back-to-top ------------------------------------- */
  var bar = document.querySelector(".progress");
  var toTop = document.querySelector(".to-top");
  function onScroll() {
    var el = document.documentElement;
    var max = el.scrollHeight - el.clientHeight;
    if (bar) bar.style.width = (max > 0 ? (el.scrollTop / max) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("show", window.scrollY > 560);
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  /* ---- Mobile menu -------------------------------------------------------- */
  var mb = document.querySelector(".menu-btn");
  var links = document.querySelector(".nav-links");
  if (mb && links) {
    mb.addEventListener("click", function () { links.classList.toggle("open"); });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") links.classList.remove("open");
    });
  }

  /* ---- Reveal on scroll --------------------------------------------------- */
  var rev = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && rev.length && !reduce) {
    var ro = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    rev.forEach(function (el) { ro.observe(el); });
  } else { rev.forEach(function (el) { el.classList.add("in"); }); }

  /* ---- TOC scroll-spy ----------------------------------------------------- */
  var tl = [].slice.call(document.querySelectorAll(".toc a"));
  if (tl.length && "IntersectionObserver" in window) {
    var map = {};
    tl.forEach(function (a) {
      var id = a.getAttribute("href").replace("#", "");
      if (document.getElementById(id)) map[id] = a;
    });
    var spy = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) {
          tl.forEach(function (a) { a.classList.remove("active"); });
          if (map[e.target.id]) map[e.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-42% 0px -54% 0px" });
    Object.keys(map).forEach(function (id) { spy.observe(document.getElementById(id)); });
  }
})();
