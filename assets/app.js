// Volt legal site — minimal, dependency-free. Scroll progress, back-to-top,
// mobile menu, gentle reveal, and TOC scroll-spy. No background/media effects.
(function () {
  "use strict";
  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll progress + back-to-top
  var bar = document.querySelector(".progress");
  var toTop = document.querySelector(".to-top");
  function onScroll() {
    var el = document.documentElement;
    var max = el.scrollHeight - el.clientHeight;
    if (bar) bar.style.width = (max > 0 ? (el.scrollTop / max) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("show", window.scrollY > 520);
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  // Mobile menu
  var mb = document.querySelector(".menu-btn");
  var links = document.querySelector(".nav-links");
  if (mb && links) {
    mb.addEventListener("click", function () { links.classList.toggle("open"); });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") links.classList.remove("open");
    });
  }

  // Gentle reveal on scroll
  var rev = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && rev.length && !reduce) {
    var ro = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    rev.forEach(function (el) { ro.observe(el); });
  } else { rev.forEach(function (el) { el.classList.add("in"); }); }

  // TOC scroll-spy
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
