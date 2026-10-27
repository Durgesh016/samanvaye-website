/* Samanvaye page runtime: scroll/pointer state, photo hover and slide effects, counters, marquee,
   mobile menu helpers, and the A-Frame mount for the 3D hero. Plain browser JavaScript; it is loaded
   only on the client by components/SiteEffects.tsx (never during server rendering). */
(function () {
  'use strict';
  var SV = window.SV = window.SV || {};
  var root = document.documentElement;
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqDark = window.matchMedia('(prefers-color-scheme: dark)');
  var mqFine = window.matchMedia('(hover: hover) and (pointer: fine)');
  SV.reduced = mqReduce.matches;
  SV.fine = mqFine.matches;
  SV.AFRAME_SRC = 'https://cdn.jsdelivr.net/npm/aframe@1.7.1/dist/aframe-v1.7.1.min.js';
  var each = function (sel, fn, scope) { Array.prototype.forEach.call((scope || document).querySelectorAll(sel), fn); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  SV.clamp = clamp;

  /* ---------- theme tokens ---------- */
  SV.tok = function (name, fallback) {
    var v = getComputedStyle(root).getPropertyValue(name).trim();
    return v || fallback || '#888888';
  };
  SV.isDark = function () {
    var t = root.getAttribute('data-theme');
    if (t === 'dark') return true;
    if (t === 'light') return false;
    return mqDark.matches;
  };
  var themeFns = [];
  SV.onTheme = function (fn) { themeFns.push(fn); };
  function themeChanged() {
    requestAnimationFrame(function () {
      themeFns.forEach(function (fn) { try { fn(); } catch (e) { console.warn(e); } });
      window.dispatchEvent(new CustomEvent('sv-theme'));
      if (SV.sceneEl && SV.frozen) SV.renderOnce();
    });
  }
  if (mqDark.addEventListener) mqDark.addEventListener('change', themeChanged);
  new MutationObserver(themeChanged).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  /* ---------- scroll + pointer state ---------- */
  SV.progress = 0; SV.vel = 0; SV.scrollY = window.scrollY;
  SV.pointer = { x: 0, y: 0, px: window.innerWidth / 2, py: window.innerHeight / 2, active: false };
  var watchers = [], lastY = window.scrollY, sTick = false;
  SV.watch = function (el, fn) { watchers.push({ el: el, fn: fn }); measure(); };
  SV.prog = function (el) { /* 0 when el's top meets the viewport bottom, 1 when its bottom leaves the top */
    var r = el.getBoundingClientRect(), vh = window.innerHeight;
    return clamp((vh - r.top) / (vh + r.height), 0, 1);
  };
  SV.pin = function (el) { /* 0..1 while a tall element scrolls past a pinned viewport */
    var r = el.getBoundingClientRect(), span = r.height - window.innerHeight;
    return span > 0 ? clamp(-r.top / span, 0, 1) : 0;
  };
  function measure() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    SV.scrollY = window.scrollY;
    SV.progress = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    root.style.setProperty('--page', SV.progress.toFixed(4));
    for (var i = 0; i < watchers.length; i++) {
      var w = watchers[i], p = SV.prog(w.el);
      if (w.last !== p) { w.last = p; w.el.style.setProperty('--p', p.toFixed(4)); if (w.fn) w.fn(p, w.el); }
    }
  }
  SV.measure = measure;
  window.addEventListener('scroll', function () {
    if (sTick) return;
    sTick = true;
    requestAnimationFrame(function () {
      sTick = false;
      var y = window.scrollY;
      SV.vel = SV.vel * 0.6 + (y - lastY) * 0.4;
      lastY = y;
      measure();
    });
  }, { passive: true });
  window.addEventListener('resize', function () { requestAnimationFrame(measure); });
  var pTick = false, pointerVars = false;
  window.addEventListener('pointermove', function (e) {
    var P = SV.pointer;
    P.px = e.clientX; P.py = e.clientY; P.active = true;
    P.x = e.clientX / window.innerWidth * 2 - 1;
    P.y = e.clientY / window.innerHeight * 2 - 1;
    if (pointerVars && !pTick) {
      pTick = true;
      requestAnimationFrame(function () {
        pTick = false;
        root.style.setProperty('--mx', ((P.x + 1) / 2).toFixed(3));
        root.style.setProperty('--my', ((P.y + 1) / 2).toFixed(3));
        root.style.setProperty('--mxp', P.px + 'px');
        root.style.setProperty('--myp', P.py + 'px');
      });
    }
  }, { passive: true });

  /* ---------- page behaviour ---------- */
  function photos() {
    each('img[data-ph]', function (img) {
      function fail() { var f = img.closest('.ph'); if (f) f.classList.add('ph-empty'); img.remove(); }
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fail();
      else img.addEventListener('error', fail, { once: true });
    });
  }
  function menus() {
    each('details.menu', function (d) {
      d.addEventListener('click', function (e) { if (e.target.closest('a')) d.open = false; });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && d.open) { d.open = false; d.querySelector('summary').focus(); } });
      document.addEventListener('click', function (e) { if (d.open && !d.contains(e.target)) d.open = false; });
    });
  }
  /* ---------- effects (data-fx) ---------- */
  var FX = SV.fx = {};
  FX.tilt = function (el) {
    if (!SV.fine || SV.reduced) return;
    var max = parseFloat(el.getAttribute('data-tilt') || 9);
    if (!el.querySelector(':scope > .glare')) { var g = document.createElement('span'); g.className = 'glare'; g.setAttribute('aria-hidden', 'true'); el.appendChild(g); }
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.classList.add('is-tilting');
      el.style.setProperty('--tx', x.toFixed(3)); el.style.setProperty('--ty', y.toFixed(3));
      el.style.transform = 'perspective(1000px) rotateY(' + ((x - 0.5) * max).toFixed(2) + 'deg) rotateX(' + ((0.5 - y) * max).toFixed(2) + 'deg) scale(1.015)';
    });
    el.addEventListener('pointerleave', function () { el.classList.remove('is-tilting'); el.style.transform = ''; });
  };
  FX.reveal = function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--rx', (e.clientX - r.left).toFixed(0) + 'px');
      el.style.setProperty('--ry', (e.clientY - r.top).toFixed(0) + 'px');
    });
  };
  var peekEl = null, peekPos = { x: 0, y: 0, tx: 0, ty: 0 }, peekRAF = 0;
  function peekLoop() {
    peekPos.x += (peekPos.tx - peekPos.x) * 0.18; peekPos.y += (peekPos.ty - peekPos.y) * 0.18;
    peekEl.style.transform = 'translate3d(' + peekPos.x.toFixed(1) + 'px,' + peekPos.y.toFixed(1) + 'px,0)';
    peekRAF = peekEl.classList.contains('on') ? requestAnimationFrame(peekLoop) : 0;
  }
  FX.peek = function (el) {
    if (!SV.fine) return;
    if (!peekEl) {
      peekEl = document.createElement('div');
      peekEl.className = 'peek'; peekEl.setAttribute('aria-hidden', 'true');
      peekEl.innerHTML = '<figure class="ph"><img alt="" referrerpolicy="no-referrer"></figure>';
      document.body.appendChild(peekEl);
      var pimg = peekEl.querySelector('img');
      pimg.addEventListener('error', function () { peekEl.querySelector('.ph').classList.add('ph-empty'); pimg.style.visibility = 'hidden'; });
      pimg.addEventListener('load', function () { peekEl.querySelector('.ph').classList.remove('ph-empty'); pimg.style.visibility = ''; });
    }
    el.addEventListener('pointerenter', function (e) {
      var img = peekEl.querySelector('img'), src = el.getAttribute('data-peek');
      if (img.getAttribute('src') !== src) img.setAttribute('src', src);
      peekEl.querySelector('.ph').setAttribute('data-cap', 'Photo: ' + (el.getAttribute('data-peek-alt') || ''));
      peekPos.x = peekPos.tx = e.clientX + 24; peekPos.y = peekPos.ty = e.clientY - 80;
      peekEl.classList.add('on');
      if (!peekRAF) peekRAF = requestAnimationFrame(peekLoop);
    });
    el.addEventListener('pointermove', function (e) { peekPos.tx = e.clientX + 24; peekPos.ty = e.clientY - 80; });
    el.addEventListener('pointerleave', function () { peekEl.classList.remove('on'); });
  };
  FX.magnet = function (el) {
    if (!SV.fine || SV.reduced) return;
    var k = parseFloat(el.getAttribute('data-magnet') || 0.28);
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * k).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * k).toFixed(1) + 'px)';
    });
    el.addEventListener('pointerleave', function () { el.style.transform = ''; });
  };
  FX.spot = function (el) {
    var set = function (x, y) { el.style.setProperty('--sx', x + 'px'); el.style.setProperty('--sy', y + 'px'); };
    var r0 = el.getBoundingClientRect(); set(Math.round(r0.width * 0.5), Math.round(Math.min(r0.height * 0.35, 320)));
    el.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect(); set((e.clientX - r.left).toFixed(0), (e.clientY - r.top).toFixed(0)); });
  };
  FX.marquee = function (el) {
    var track = el.querySelector('.mq-track');
    if (!track || track.getAttribute('data-dup')) return;
    track.setAttribute('data-dup', '1');
    Array.prototype.slice.call(track.children).forEach(function (n) { var c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); });
  };
  FX.hscroll = function (el) {
    var pin = el.querySelector('.hs-pin'), track = el.querySelector('.hs-track');
    if (!pin || !track) return;
    var on = false;
    function layout() {
      on = window.innerWidth >= 900 && SV.fine && !SV.reduced;
      el.classList.toggle('hs-on', on);
      if (!on) { el.style.height = ''; track.style.transform = ''; return; }
      var dist = Math.max(0, track.scrollWidth - window.innerWidth);
      el.style.height = (window.innerHeight + dist) + 'px';
      el._hsDist = dist;
      update();
    }
    function update() {
      if (!on) return;
      var p = SV.pin(el);
      el.style.setProperty('--hp', p.toFixed(4));
      track.style.transform = 'translate3d(' + (-p * el._hsDist).toFixed(1) + 'px,0,0)';
    }
    layout();
    window.addEventListener('resize', layout);
    window.addEventListener('load', layout);
    SV.watch(el, update);
  };
  FX.draw = function (el) { /* el is an <svg>; every [data-draw] path draws as the svg scrolls through view */
    var paths = el.querySelectorAll('[data-draw]');
    var from = parseFloat(el.getAttribute('data-from') || 0.05), to = parseFloat(el.getAttribute('data-to') || 0.75);
    Array.prototype.forEach.call(paths, function (p) {
      var L = p.getTotalLength();
      p.style.strokeDasharray = L + ' ' + L;
      p._L = L;
      p.style.strokeDashoffset = SV.reduced ? 0 : L;
    });
    if (SV.reduced) return;
    SV.watch(el, function (pr) {
      var k = clamp((pr - from) / (to - from), 0, 1);
      Array.prototype.forEach.call(paths, function (p) { p.style.strokeDashoffset = (p._L * (1 - k)).toFixed(1); });
    });
  };
  FX.slides = function (el) { /* slide-on-hover photo stack: data-mode="auto|scrub" */
    var items = el.querySelectorAll('.sl-i'), n = items.length;
    if (n < 2) return;
    var dots = el.querySelectorAll('.sl-dots i'), i = 0, timer = 0, mode = el.getAttribute('data-mode') || 'auto';
    var gap = +(el.getAttribute('data-interval') || 1300);
    /* the photos after the first stay out of the layout until .sl-live, so they are not downloaded with the
       page: they come in once the stack is on screen after the page has loaded, or as soon as it plays */
    var live = false;
    function wake() { if (!live) { live = true; el.classList.add('sl-live'); } }
    if (!SV.reduced) {
      var watch = function () {
        if (!('IntersectionObserver' in window)) return wake();
        var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); wake(); } });
        io.observe(el);
      };
      if (document.readyState === 'complete') watch(); else window.addEventListener('load', watch, { once: true });
    }
    var calls = 0;
    function show(k) {
      k = ((k % n) + n) % n;
      var call = ++calls;
      if (k === i) return;
      if (!live) { /* let the photos enter the layout for a frame first, so this one still slides in */
        wake();
        requestAnimationFrame(function () { requestAnimationFrame(function () { if (call === calls) show(k); }); });
        return;
      }
      var prev = items[i];
      prev.classList.remove('on'); prev.classList.add('was');
      setTimeout(function () { if (!prev.classList.contains('on')) prev.classList.remove('was'); }, 900);
      i = k;
      items[i].classList.remove('was'); items[i].classList.add('on');
      el.style.setProperty('--si', i);
      Array.prototype.forEach.call(dots, function (d, j) { d.classList.toggle('on', j === i); });
    }
    el._show = show;
    if (mode === 'scrub') {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        show(Math.max(0, Math.min(n - 1, Math.floor((e.clientX - r.left) / r.width * n))));
      });
      el.addEventListener('pointerleave', function () { show(0); });
      return;
    }
    var host = el.closest('[data-slide-host]') || el;
    function start() { if (SV.reduced || timer) return; show(i + 1); timer = setInterval(function () { show(i + 1); }, gap); }
    function stop() { clearInterval(timer); timer = 0; show(0); }
    host.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') start(); });
    host.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch') stop(); });
    host.addEventListener('focusin', start);
    host.addEventListener('focusout', function (e) { if (!host.contains(e.relatedTarget)) stop(); });
    if (!SV.fine && !SV.reduced && 'IntersectionObserver' in window) { /* phones: play while on screen */
      var auto = 0;
      new IntersectionObserver(function (en) {
        if (en[0].isIntersecting && !auto) auto = setInterval(function () { show(i + 1); }, gap + 1200);
        else if (!en[0].isIntersecting && auto) { clearInterval(auto); auto = 0; }
      }, { threshold: 0.6 }).observe(el);
    }
  };
  FX.count = function (el) { /* counts up to data-to when it scrolls into view; final value is already in the HTML */
    var to = parseFloat(el.getAttribute('data-to'));
    if (SV.reduced || !('IntersectionObserver' in window) || !(to > 0)) return;
    var io = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      io.disconnect();
      var t0 = performance.now(), dur = 1300;
      (function f(now) {
        var k = Math.min(1, (now - t0) / dur); k = 1 - Math.pow(1 - k, 3);
        el.textContent = String(Math.round(to * k));
        if (k < 1) requestAnimationFrame(f);
      })(t0);
    }, { threshold: 0.7 });
    io.observe(el);
  };
  FX.map = function (el) { /* adds the Google map iframe (data-src, data-title) once it is within 600px of the screen */
    var add = function () {
      var f = document.createElement('iframe');
      f.src = el.getAttribute('data-src'); f.title = el.getAttribute('data-title') || '';
      f.referrerPolicy = 'no-referrer-when-downgrade'; f.allowFullscreen = true;
      el.appendChild(f);
    };
    if (!('IntersectionObserver' in window)) return add();
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { io.disconnect(); add(); }
    }, { rootMargin: '600px 0px' });
    io.observe(el);
  };
  function parallax(el) {
    if (SV.reduced) return;
    var sp = parseFloat(el.getAttribute('data-speed') || 0);
    SV.watch(el, function (p) { el.style.transform = 'translate3d(0,' + ((p - 0.5) * sp).toFixed(1) + 'px,0)'; });
  }

  /* ---------- 2D particles (embers, pollen, seeds, petals, stars) ---------- */
  SV.particles = function (canvas, o) {
    o = o || {};
    var ctx = canvas.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1), W = 0, H = 0, parts = [], run = true, raf = 0;
    var rnd = SV.rand(o.seed || 3), n = o.count || 60;
    var col = function () { return o.color && o.color.indexOf('--') === 0 ? SV.tok(o.color) : (o.color || '#ffffff'); };
    var color = col();
    SV.onTheme(function () { color = col(); if (SV.reduced) frame(performance.now()); });
    function size() { var r = canvas.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = Math.max(1, W * dpr); canvas.height = Math.max(1, H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function spawn(p, initial) {
      p.x = rnd() * W; p.y = initial ? rnd() * H : (o.dir === 'down' ? -10 : H + 10);
      p.r = (o.min || 1) + rnd() * ((o.max || 3) - (o.min || 1));
      p.v = (o.speed || 18) * (0.5 + rnd());
      p.ph = rnd() * 6.28; p.a = 0.25 + rnd() * 0.75; p.rot = rnd() * 6.28;
    }
    size();
    for (var i = 0; i < n; i++) { var p = {}; spawn(p, true); parts.push(p); }
    var last = performance.now();
    function frame(now) {
      var dt = Math.min(50, now - last) / 1000; last = now;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = color;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.ph += dt * (o.wobble || 0.8);
        var dy = o.dir === 'down' ? p.v * dt : (o.dir === 'float' ? Math.sin(p.ph) * 4 * dt : -p.v * dt);
        p.y += dy; p.x += Math.sin(p.ph) * (o.drift || 10) * dt; p.rot += dt * 0.6;
        if (p.y < -12 || p.y > H + 12) spawn(p, false);
        if (p.x < -12) p.x = W + 10;
        if (p.x > W + 12) p.x = -10;
        var fade = o.fade ? clamp(o.dir === 'down' ? 1 - p.y / H : p.y / H, 0, 1) : 1;
        ctx.globalAlpha = p.a * fade * (o.alpha || 0.8);
        if (o.shape === 'petal') {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.beginPath(); ctx.ellipse(0, 0, p.r * 1.8, p.r, 0, 0, 6.283); ctx.fill(); ctx.restore();
        } else if (o.shape === 'seed') {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.beginPath(); ctx.ellipse(0, 0, p.r * 0.6, p.r * 1.5, 0, 0, 6.283); ctx.fill(); ctx.restore();
        } else {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = run && !SV.reduced ? requestAnimationFrame(frame) : 0;
    }
    window.addEventListener('resize', size);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) {
      run = en[0].isIntersecting;
      if (run && !raf && !SV.reduced) { last = performance.now(); raf = requestAnimationFrame(frame); }
    }).observe(canvas);
    raf = requestAnimationFrame(frame);
  };

  /* ---------- 3D ---------- */
  function webgl() {
    try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); }
    catch (e) { return false; }
  }
  function loadScript(src, ok) {
    var s = document.createElement('script');
    s.src = src; s.async = true; s.onload = ok;
    s.onerror = function () { console.info('[Samanvaye] 3D library unavailable; showing the still artwork instead.'); };
    document.head.appendChild(s);
  }
  SV.renderOnce = function () { var s = SV.sceneEl; if (s && s.renderer && s.camera) s.renderer.render(s.object3D, s.camera); };
  function setRunning(sceneEl, on) {
    if (!sceneEl.renderer || !sceneEl.renderStarted || SV.frozen) return;
    if (sceneEl.is && sceneEl.is('vr-mode')) return;
    if (on && sceneEl._svOn === false) {
      sceneEl.clock.getDelta();
      sceneEl.renderer.setAnimationLoop(sceneEl.render);
      sceneEl.play();
      sceneEl._svOn = true;
    } else if (!on && sceneEl._svOn !== false) {
      sceneEl.renderer.setAnimationLoop(null);
      sceneEl.pause();
      sceneEl._svOn = false;
    }
  }

  /* soft radial glow (sun, moon, flame, lantern halos) */
  SV.glowTex = function (THREE) {
    if (SV._glowTex) return SV._glowTex;
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.22, 'rgba(255,255,255,0.6)');
    r.addColorStop(0.55, 'rgba(255,255,255,0.14)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    SV._glowTex = t; return t;
  };
  SV.glow = function (THREE, color, size, opacity) {
    var m = new THREE.SpriteMaterial({ map: SV.glowTex(THREE), color: color, transparent: true, depthWrite: false, fog: false, opacity: opacity == null ? 1 : opacity });
    var s = new THREE.Sprite(m); s.scale.set(size, size, 1); return s;
  };
  /* photo textures inlined at build time as data URIs: window.SV_TEX = { key: { src, ar } } */
  SV.texAR = function (key) { var t = (window.SV_TEX || {})[key]; return t ? t.ar : 1.5; };
  SV.tex = function (THREE, key) {
    SV._tx = SV._tx || {};
    if (SV._tx[key]) return SV._tx[key];
    var t = (window.SV_TEX || {})[key];
    if (!t) return null;
    var tx = new THREE.TextureLoader().load(t.src, function () { if (SV.frozen) SV.renderOnce(); });
    tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4;
    SV._tx[key] = tx; return tx;
  };
  SV.photoMat = function (THREE, key, opts) { /* unlit photo material (true colours) */
    opts = opts || {};
    return new THREE.MeshBasicMaterial(Object.assign({ map: SV.tex(THREE, key), side: THREE.DoubleSide, toneMapped: false }, opts));
  };
  SV.color = function (name) { return new window.AFRAME.THREE.Color(SV.tok(name)); };
  SV.rand = function (seed) { var s = seed || 1; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };
  SV.themed = function (mat, prop, token) { /* keep a THREE material colour in sync with a CSS token */
    var f = function () { mat[prop].set(SV.tok(token)); }; f(); window.addEventListener('sv-theme', f); return f;
  };

  function registerShared(AFRAME) {
    if (AFRAME.components['sv-spin']) return;
    var D2R = Math.PI / 180;
    AFRAME.registerComponent('sv-spin', {
      schema: { axis: { default: 'y' }, speed: { default: 8 } },
      tick: function (t, dt) { if (dt) this.el.object3D.rotation[this.data.axis] += this.data.speed * D2R * Math.min(dt, 50) / 1000; }
    });
    AFRAME.registerComponent('sv-bob', {
      schema: { amp: { default: 0.08 }, speed: { default: 0.25 }, phase: { default: 0 }, axis: { default: 'y' } },
      tick: function (t) {
        var o = this.el.object3D, d = this.data;
        if (this.base === undefined) this.base = o.position[d.axis];
        o.position[d.axis] = this.base + Math.sin(t / 1000 * d.speed * Math.PI * 2 + d.phase) * d.amp;
      }
    });
    AFRAME.registerComponent('sv-tilt', { /* pointer parallax; put it on a parent rig */
      schema: { max: { default: 5 }, ease: { default: 0.05 }, shift: { default: 0 } },
      tick: function () {
        var o = this.el.object3D, d = this.data, P = SV.pointer;
        if (!this.b) { this.b = { rx: o.rotation.x, ry: o.rotation.y, px: o.position.x, py: o.position.y }; this.cx = 0; this.cy = 0; }
        var tx = SV.reduced ? 0 : P.x, ty = SV.reduced ? 0 : P.y;
        this.cx += (tx - this.cx) * d.ease; this.cy += (ty - this.cy) * d.ease;
        o.rotation.y = this.b.ry + this.cx * d.max * D2R;
        o.rotation.x = this.b.rx + this.cy * d.max * 0.6 * D2R;
        if (d.shift) { o.position.x = this.b.px + this.cx * d.shift; o.position.y = this.b.py - this.cy * d.shift; }
      }
    });
    AFRAME.registerComponent('sv-fov', { /* widen the lens on tall, narrow screens */
      schema: { base: { default: 40 }, portrait: { default: 60 } },
      init: function () { this.fit = this.fit.bind(this); window.addEventListener('resize', this.fit); },
      update: function () { this.fit(); },
      remove: function () { window.removeEventListener('resize', this.fit); },
      fit: function () {
        var c = this.el.sceneEl && this.el.sceneEl.canvas;
        var r = c && c.clientHeight ? c.clientWidth / c.clientHeight : (window.innerWidth / window.innerHeight);
        var k = clamp((1.25 - r) / 0.7, 0, 1);
        this.el.setAttribute('camera', 'fov', this.data.base + (this.data.portrait - this.data.base) * k);
      }
    });
    AFRAME.registerComponent('sv-glow', {
      schema: { color: { default: '--accent' }, size: { default: 4 }, opacity: { default: 0.8 } },
      init: function () {
        var self = this;
        this.sprite = SV.glow(AFRAME.THREE, this.col(), this.data.size, this.data.opacity);
        this.el.setObject3D('glow', this.sprite);
        this.onTheme = function () { self.sprite.material.color.set(self.col()); };
        window.addEventListener('sv-theme', this.onTheme);
      },
      col: function () { var c = this.data.color; return c.indexOf('--') === 0 ? SV.tok(c) : c; },
      update: function () { if (this.sprite) { this.sprite.scale.set(this.data.size, this.data.size, 1); this.sprite.material.opacity = this.data.opacity; this.onTheme(); } },
      remove: function () { window.removeEventListener('sv-theme', this.onTheme); this.el.removeObject3D('glow'); }
    });
    AFRAME.registerComponent('sv-tc', { /* theme colours: sv-tc="material.color: --accent; light.color: --fg" */
      schema: { type: 'string' },
      init: function () { this.apply = this.apply.bind(this); window.addEventListener('sv-theme', this.apply); },
      update: function () { this.apply(); },
      remove: function () { window.removeEventListener('sv-theme', this.apply); },
      apply: function () {
        var el = this.el;
        String(this.data || '').split(';').forEach(function (pair) {
          var i = pair.indexOf(':');
          if (i < 0) return;
          var key = pair.slice(0, i).trim(), val = pair.slice(i + 1).trim();
          var color = val.indexOf('--') === 0 ? SV.tok(val) : val;
          var parts = key.split('.');
          if (parts.length === 2) el.setAttribute(parts[0], parts[1], color); else el.setAttribute(parts[0], color);
        });
      }
    });
  }

  function mount(stage) {
    var AFRAME = window.AFRAME, THREE = AFRAME.THREE;
    registerShared(AFRAME);
    if (SV.scene.register) SV.scene.register(AFRAME, THREE, SV);
    var tpl = document.createElement('template');
    tpl.innerHTML = SV.scene.markup.trim();
    var sc = tpl.content.querySelector('a-scene');
    if (!sc) return;
    var defaults = {
      'embedded': '',
      'renderer': 'alpha: true; antialias: true; colorManagement: true; maxCanvasWidth: 1920; maxCanvasHeight: 1920',
      'xr-mode-ui': 'enabled: false',
      'loading-screen': 'enabled: false',
      'device-orientation-permission-ui': 'enabled: false',
      'keyboard-shortcuts': 'enterVR: false; exitVR: true'
    };
    Object.keys(defaults).forEach(function (k) { if (!sc.hasAttribute(k)) sc.setAttribute(k, defaults[k]); });
    if (window.SV_TEX) {
      var assets = sc.querySelector('a-assets');
      if (!assets) { assets = document.createElement('a-assets'); sc.insertBefore(assets, sc.firstChild); }
      Object.keys(window.SV_TEX).forEach(function (k) {
        var im = document.createElement('img'); im.id = 'tx-' + k; im.alt = ''; im.src = window.SV_TEX[k].src; assets.appendChild(im);
      });
    }
    var holder = document.createElement('div');
    holder.className = 'stage-3d';
    if (stage.getAttribute('aria-hidden') !== 'false') holder.setAttribute('aria-hidden', 'true');
    holder.appendChild(tpl.content);
    stage.appendChild(holder);
    var sceneEl = holder.querySelector('a-scene');
    SV.sceneEl = sceneEl;
    sceneEl.addEventListener('loaded', function () {
      if (SV.scene.ready) { try { SV.scene.ready(sceneEl, THREE, SV); } catch (e) { console.warn('[Samanvaye] scene setup:', e); } }
    });
    sceneEl.addEventListener('renderstart', function () {
      requestAnimationFrame(function () { stage.classList.add('is-live'); document.body.classList.add('sv-3d-live'); });
      if (SV.reduced) {
        setTimeout(function () {
          SV.frozen = true; sceneEl.pause(); sceneEl.renderer.setAnimationLoop(null); SV.renderOnce();
          window.addEventListener('resize', function () { setTimeout(SV.renderOnce, 60); });
        }, 1400);
      }
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) { entries.forEach(function (en) { setRunning(sceneEl, en.isIntersecting); }); }, { threshold: 0 }).observe(stage);
      }
    });
  }

  SV.start = function () {
    if (SV._started) return;          /* React may mount twice in development */
    SV._started = true;
    pointerVars = document.body.hasAttribute('data-pointer');
    photos(); menus();
    each('[data-fx]', function (el) {
      el.getAttribute('data-fx').split(/\s+/).forEach(function (name) { if (FX[name]) { try { FX[name](el); } catch (e) { console.warn('fx', name, e); } } });
    });
    each('[data-speed]', parallax);
    each('[data-progress]', function (el) { SV.watch(el); });
    if (SV.pageInit) { try { SV.pageInit(SV); } catch (e) { console.warn(e); } }
    measure();
    var stage = document.querySelector('[data-stage]');
    if (stage) SV.watch(stage, function (p) { SV.stageP = p; });
  };

  /* The 3D hero. SiteEffects calls this after the page has loaded and A-Frame (npm package) is in;
     if that import failed, the same version comes from the CDN. */
  SV.start3d = function () {
    var stage = document.querySelector('[data-stage]');
    if (SV._3d || !stage || !SV.scene || !SV.scene.markup || !webgl()) return;
    SV._3d = true;
    var run = function () { try { mount(stage); } catch (e) { console.warn('[Samanvaye] 3D scene skipped:', e); } };
    if (window.AFRAME) run(); else loadScript(SV.AFRAME_SRC, run);
  };
})();
