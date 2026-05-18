// Volt legal site — minimal, dependency-free. Scroll progress, header
// elevation, back-to-top, mobile menu, gentle reveal, TOC scroll-spy + sliding
// indicator, floating orbs, hero sparks & pointer glow, card tilt/spotlight.
// Fully reduced-motion aware. No background media files.
(function () {
  "use strict";
  var mm = window.matchMedia;
  var reduce = mm && mm("(prefers-reduced-motion: reduce)").matches;
  var fine = mm && mm("(hover: hover) and (pointer: fine)").matches;

  // Scroll progress + header elevation + back-to-top
  var bar = document.querySelector(".progress");
  var head = document.querySelector(".site-head");
  var toTop = document.querySelector(".to-top");
  function onScroll() {
    var el = document.documentElement;
    var max = el.scrollHeight - el.clientHeight;
    var y = el.scrollTop;
    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    if (head) head.classList.toggle("scrolled", y > 8);
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

  // Floating gold orbs (skipped under reduced motion)
  if (!reduce) {
    var fx = document.createElement("div");
    fx.className = "fx";
    fx.innerHTML = '<span class="orb a"></span><span class="orb b"></span><span class="orb c"></span>';
    document.body.appendChild(fx);
  }

  // Hero: sparks + soft pointer glow
  var hero = document.querySelector(".hero");
  if (hero && !reduce) {
    var sp = document.createElement("div");
    sp.className = "sparks";
    var html = "";
    for (var i = 0; i < 18; i++) {
      var x = (Math.random() * 100).toFixed(2);
      var yy = (Math.random() * 100).toFixed(2);
      var d = (3.5 + Math.random() * 4).toFixed(2);
      var dl = (Math.random() * 6).toFixed(2);
      var s = (0.6 + Math.random() * 1.1).toFixed(2);
      html += '<i style="left:' + x + '%;top:' + yy + '%;--d:' + d +
        's;--delay:' + dl + 's;transform:scale(' + s + ')"></i>';
    }
    sp.innerHTML = html;
    hero.insertBefore(sp, hero.firstChild);
  }
  if (hero && fine && !reduce) {
    var glow = document.createElement("div");
    glow.className = "hero-glow";
    hero.insertBefore(glow, hero.firstChild);
    var clamp = function (v) { return v < -40 ? -40 : v > 140 ? 140 : v; };
    var cx = 50, cy = 38, tx = 50, ty = 38, anim = 0;
    function tick() {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      glow.style.setProperty("--mx", cx.toFixed(2) + "%");
      glow.style.setProperty("--my", cy.toFixed(2) + "%");
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        anim = requestAnimationFrame(tick);
      } else { anim = 0; }
    }
    // Track across the whole window so it never hits a dead zone / border
    addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      tx = clamp(((e.clientX - r.left) / r.width) * 100);
      ty = clamp(((e.clientY - r.top) / r.height) * 100);
      if (!anim) anim = requestAnimationFrame(tick);
    }, { passive: true });
  }

  // Card pointer spotlight + subtle 3D tilt
  if (fine) {
    [].slice.call(document.querySelectorAll(".card")).forEach(function (card) {
      var raf = 0;
      card.addEventListener("pointermove", function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width;
          var py = (e.clientY - r.top) / r.height;
          card.style.setProperty("--cx", (px * 100) + "%");
          card.style.setProperty("--cy", (py * 100) + "%");
          if (!reduce) {
            card.style.transform = "translateY(-5px) rotateX(" +
              ((0.5 - py) * 5).toFixed(2) + "deg) rotateY(" +
              ((px - 0.5) * 6).toFixed(2) + "deg)";
          }
        });
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
        card.style.removeProperty("--cx");
        card.style.removeProperty("--cy");
      });
    });
  }

  // Staggered hero entrance (robust to injected decorative layers)
  if (hero && !reduce) {
    [].slice.call(hero.querySelectorAll(".reveal")).forEach(function (el, i) {
      el.style.transitionDelay = (0.05 + i * 0.07).toFixed(2) + "s";
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

  // TOC scroll-spy + sliding indicator
  var toc = document.querySelector(".toc");
  var tl = [].slice.call(document.querySelectorAll(".toc a"));
  if (toc && tl.length && "IntersectionObserver" in window) {
    var ind = document.createElement("div");
    ind.className = "toc-ind";
    toc.insertBefore(ind, toc.firstChild);
    function moveInd(a) {
      ind.style.height = a.offsetHeight + "px";
      ind.style.transform = "translateY(" + a.offsetTop + "px)";
      ind.classList.add("on");
    }
    var map = {}, current = null;
    tl.forEach(function (a) {
      var id = a.getAttribute("href").replace("#", "");
      if (document.getElementById(id)) map[id] = a;
    });
    var spy = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) {
          tl.forEach(function (a) { a.classList.remove("active"); });
          var a = map[e.target.id];
          if (a) { a.classList.add("active"); current = a; moveInd(a); }
        }
      });
    }, { rootMargin: "-42% 0px -54% 0px" });
    Object.keys(map).forEach(function (id) { spy.observe(document.getElementById(id)); });
    addEventListener("resize", function () { if (current) moveInd(current); }, { passive: true });
  }
})();
