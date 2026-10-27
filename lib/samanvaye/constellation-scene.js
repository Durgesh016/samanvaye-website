/* 20 Constellation: the foundation's photos are stars. Round photo discs (always facing you, never stretched)
   sit in a slowly turning 3D constellation with small plain stars, joined by glowing lines; light pulses
   travel along the lines. Hovering a photo star (A-Frame cursor + raycaster, rayOrigin: mouse) brightens it
   and its neighbours. The layout re-forms for portrait screens. A twinkling 2D starfield sits behind the
   whole page, and the gallery photos orbit their title. */
(function () {
  'use strict';
  var SV = window.SV;
  var D2R = Math.PI / 180;

  /* nodes: photo stars (k = texture key, f = horizontal focus for the square crop) and plain stars.
     L = landscape position (normalised to the frame, z = depth), P = portrait position. */
  var NODES = [
    { k: 'hero1',    f: .40, r: .62, L: [-.76, .36, .8],   P: [-.5, .46, .7] },
    { k: 'who1',     f: .47, r: .62, L: [.75, .36, .9],     P: [.52, .52, .5] },
    { k: 'edu',      f: .50, r: .5,  L: [-.66, -.57, .2],   P: [-.56, -.42, .3] },
    { k: 'g_tailor', f: .56, r: .52, L: [.67, -.57, .3],   P: [.5, -.5, .4] },
    { k: 'g_vayo',   f: .50, r: .44, L: [-.86, -.1, -1.2], P: [0, .02, -.3] },
    { k: 'why',      f: .46, r: .44, L: [.87, -.12, -1.1],  P: [.86, -.02, -1.3] },
    { k: 'vol2',     f: .50, r: .4,  L: [-.42, .82, -1.6],  P: [-.86, .04, -1.3] },
    { k: 'poor',     f: .55, r: .4,  L: [.43, .84, -1.5],  P: [.04, .88, -1.6] },
    { s: .5, c: 'a', L: [-.22, .9, -.6],  P: [-.3, .9, -.8] },
    { s: .38, c: 'q', L: [.06, .94, -1.0], P: [.36, .94, -1.0] },
    { s: .5, c: 'a', L: [.26, .86, -.4],  P: [.86, .74, -.6] },
    { s: .44, c: 'a', L: [-.24, -.88, -.5], P: [-.26, -.86, -.5] },
    { s: .36, c: 'q', L: [.04, -.93, -1.0], P: [.06, -.62, -.9] },
    { s: .5, c: 'a', L: [.28, -.86, -.3],  P: [.3, -.9, -.4] },
    { s: .4, c: 'q', L: [-.98, .62, -.8],  P: [-.9, .74, -.9] },
    { s: .42, c: 'a', L: [.97, .66, -.9],  P: [.9, -.78, -.9] },
    { s: .38, c: 'q', L: [-.97, -.72, -.6], P: [-.9, -.8, -.7] },
    { s: .4, c: 'q', L: [.96, -.74, -.7],  P: [.94, .3, -1.0] }
  ];
  var EDGES = [[0, 4], [0, 6], [0, 2], [4, 2], [4, 14], [14, 6], [6, 8], [8, 9], [9, 10], [10, 7], [7, 1], [1, 5], [1, 3], [5, 3],
    [5, 15], [15, 7], [2, 11], [11, 12], [12, 13], [13, 3], [4, 16], [16, 2], [5, 17], [17, 3]];

  SV.scene = {
    markup:
      '<a-scene cursor="rayOrigin: mouse; mouseCursorStylesEnabled: false" raycaster="objects: .cn-node; interval: 60; far: 80">' +
        '<a-entity camera="fov: 40; near: .1; far: 100" position="0 0 10" sv-fov="base: 40; portrait: 50"></a-entity>' +
        '<a-entity sv-tilt="max: 4; ease: .04"><a-entity cn-graph></a-entity></a-entity>' +
      '</a-scene>',

    /* keep the page smooth on machines without a GPU (software WebGL): render the sky at a slow cadence there */
    ready: function (sceneEl) {
      var soft = false;
      try {
        var gl = sceneEl.renderer.getContext(), ext = gl.getExtension('WEBGL_debug_renderer_info');
        soft = /swiftshader|llvmpipe|softpipe|software|basic render/i.test(ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '');
      } catch (e) { /* keep defaults */ }
      if (!soft) return;
      var orig = sceneEl.render, last = -1e9, budget = 5, tmr = 0;
      var wake = function () { budget = Math.max(budget, 2); };
      window.addEventListener('scroll', function () { clearTimeout(tmr); tmr = setTimeout(wake, 140); }, { passive: true });
      window.addEventListener('resize', wake);
      sceneEl.render = function (t, frame) { if (budget <= 0 || t - last < 600) return; last = t; budget--; orig(t, frame); };
      var hook = function () { sceneEl.renderer.setAnimationLoop(sceneEl.render); };
      if (sceneEl.renderStarted) hook(); else sceneEl.addEventListener('renderstart', hook);
    },

    register: function (AFRAME, THREE, SV) {
      var GOLD = new THREE.Color(SV.tok('--accent')), AQUA = new THREE.Color(SV.tok('--aqua'));
      var noRay = function () {};

      AFRAME.registerComponent('cn-graph', {
        init: function () {
          var self = this, el = this.el;
          this.nodes = NODES.map(function (n, i) {
            var g = new THREE.Group(), o = { i: i, g: g, photo: !!n.k, r: n.k ? n.r : n.s * .2, lv: .35, sc: 1, pos: new THREE.Vector3(), tgt: new THREE.Vector3(), bob: Math.random() * 6.28 };
            if (n.k) {
              var tx = SV.tex(THREE, n.k), ar = SV.texAR(n.k);
              if (tx) {
                if (ar >= 1) { tx.repeat.set(1 / ar, 1); tx.offset.set(Math.min(1 - 1 / ar, Math.max(0, n.f - .5 / ar)), 0); }
                else { tx.repeat.set(1, ar); tx.offset.set(0, (1 - ar) / 2); }
              }
              o.glow = SV.glow(THREE, GOLD, n.r * 5.2, .26); o.glow.raycast = noRay; o.glow.position.z = -.02; g.add(o.glow);
              o.halo = new THREE.Mesh(new THREE.RingGeometry(n.r * 1.17, n.r * 1.19, 96), new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: .22, depthWrite: false }));
              o.halo.raycast = noRay; g.add(o.halo);
              o.ring = new THREE.Mesh(new THREE.RingGeometry(n.r * 1.015, n.r * 1.075, 96), new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: .85 }));
              o.ring.raycast = noRay; g.add(o.ring);
              o.disc = new THREE.Mesh(new THREE.CircleGeometry(n.r, 72), new THREE.MeshBasicMaterial({ map: tx, toneMapped: false }));
              g.add(o.disc);
              /* each photo star is its own entity with class cn-node so the scene's raycaster cursor can find it */
              var ent = document.createElement('a-entity');
              ent.className = 'cn-node';
              ent.addEventListener('loaded', function () { ent.setObject3D('mesh', g); });
              ent.addEventListener('mouseenter', function () { self.hover = i; });
              ent.addEventListener('mouseleave', function () { if (self.hover === i) self.hover = -1; });
              el.appendChild(ent);
              o.ent = ent;
            } else {
              var col = n.c === 'q' ? AQUA : GOLD;
              o.glow = SV.glow(THREE, col, n.s * 2.2, .55); o.glow.raycast = noRay; g.add(o.glow);
              o.core = SV.glow(THREE, new THREE.Color('#ffffff'), n.s * .42, .95); o.core.raycast = noRay; g.add(o.core);
              el.object3D.add(g);
            }
            return o;
          });
          /* adjacency for hover highlighting and pulse walks */
          this.adj = this.nodes.map(function () { return []; });
          EDGES.forEach(function (e, k) { self.adj[e[0]].push({ to: e[1], k: k }); self.adj[e[1]].push({ to: e[0], k: k }); });
          /* glowing lines: one geometry, per-vertex colour so single edges can brighten */
          var geo = new THREE.BufferGeometry();
          this.lpos = new Float32Array(EDGES.length * 6); this.lcol = new Float32Array(EDGES.length * 6);
          geo.setAttribute('position', new THREE.BufferAttribute(this.lpos, 3));
          geo.setAttribute('color', new THREE.BufferAttribute(this.lcol, 3));
          this.lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
          this.lines.raycast = noRay; this.lines.frustumCulled = false;
          el.object3D.add(this.lines);
          this.elv = EDGES.map(function () { return .3; });
          /* light pulses travelling along the lines */
          this.pulses = [0, 1, 2, 3, 4].map(function (q) {
            var sp = SV.glow(THREE, q % 2 ? AQUA : GOLD, .42, .9); sp.raycast = noRay; el.object3D.add(sp);
            var e = EDGES[(q * 5) % EDGES.length];
            return { sp: sp, a: e[0], b: e[1], t: Math.random(), v: .16 + Math.random() * .1 };
          });
          this.hover = -1; this.aspect = 0; this.first = true;
          this.qc = new THREE.Quaternion(); this.qp = new THREE.Quaternion(); this.A = new THREE.Vector3(); this.B = new THREE.Vector3(); this.D = new THREE.Vector3();
        },
        layout: function () {
          var cam = this.el.sceneEl.camera; if (!cam) return;
          var asp = cam.aspect, portrait = asp < 1.05, tanH = Math.tan(cam.fov * D2R / 2), camZ = 10;
          if (Math.abs(asp - this.aspect) < .001 && cam.fov === this.fov) return;
          this.aspect = asp; this.fov = cam.fov;
          this.nodes.forEach(function (o, i) {
            var p = portrait ? NODES[i].P : NODES[i].L, z = p[2], hh = (camZ - z) * tanH, hw = hh * asp;
            o.tgt.set(p[0] * hw * (portrait ? .8 : .9), p[1] * hh * (portrait ? .8 : .84), z);
          });
          if (this.first) { this.nodes.forEach(function (o) { o.pos.copy(o.tgt); }); this.first = false; }
        },
        tick: function (t, dt) {
          var s = t / 1000, k = Math.min(1, (dt || 16) / 1000 * 5), self = this, el = this.el;
          this.layout();
          var calm = SV.reduced ? 0 : 1;
          el.object3D.rotation.y = Math.sin(s * 2 * Math.PI / 46) * .13 * calm;
          el.object3D.rotation.x = Math.sin(s * 2 * Math.PI / 67) * .04 * calm;
          var h = this.hover, nb = h >= 0 ? this.adj[h].map(function (a) { return a.to; }) : [];
          /* billboard: photo discs always face the camera, so they stay perfectly round */
          var cam = el.sceneEl.camera;
          cam.getWorldQuaternion(this.qc); el.object3D.getWorldQuaternion(this.qp); this.qp.invert().multiply(this.qc);
          this.nodes.forEach(function (o, i) {
            o.pos.lerp(o.tgt, k * .5);
            var lvT = h < 0 ? .4 : (i === h ? 1 : (nb.indexOf(i) >= 0 ? .78 : .12));
            o.lv += (lvT - o.lv) * k;
            var bob = Math.sin(s * .5 + o.bob) * .06 * calm;
            if (o.photo) {
              var scT = h === i ? 1.2 : (nb.indexOf(i) >= 0 ? 1.07 : 1);
              o.sc += (scT - o.sc) * k;
              o.g.position.set(o.pos.x, o.pos.y + bob, o.pos.z);
              o.g.quaternion.copy(self.qp);
              o.g.scale.setScalar(o.sc);
              o.glow.material.opacity = .12 + o.lv * .55;
              o.halo.material.opacity = .1 + o.lv * .55;
              o.ring.material.opacity = .55 + o.lv * .45;
              o.disc.material.color.setScalar(h < 0 ? 1 : .52 + o.lv * .48);
            } else {
              var tw = .75 + .25 * Math.sin(s * 1.7 + o.bob * 3);
              o.g.position.set(o.pos.x, o.pos.y + bob, o.pos.z);
              o.glow.material.opacity = (.25 + o.lv * .6) * tw;
              o.core.material.opacity = .5 + o.lv * .5;
            }
          });
          /* lines: start and end at the rim of each star */
          for (var e = 0; e < EDGES.length; e++) {
            var a = this.nodes[EDGES[e][0]], b = this.nodes[EDGES[e][1]];
            this.A.copy(a.g.position); this.B.copy(b.g.position); this.D.subVectors(this.B, this.A);
            var len = this.D.length(); this.D.divideScalar(len || 1);
            var ra = (a.photo ? a.r * 1.22 * a.sc : .05), rb = (b.photo ? b.r * 1.22 * b.sc : .05);
            this.A.addScaledVector(this.D, Math.min(ra, len * .45)); this.B.addScaledVector(this.D, -Math.min(rb, len * .45));
            this.lpos.set([this.A.x, this.A.y, this.A.z, this.B.x, this.B.y, this.B.z], e * 6);
            var on = h >= 0 && (EDGES[e][0] === h || EDGES[e][1] === h), near = h >= 0 && (nb.indexOf(EDGES[e][0]) >= 0 && nb.indexOf(EDGES[e][1]) >= 0);
            var lvT = h < 0 ? .34 : (on ? 1 : (near ? .5 : .1));
            this.elv[e] += (lvT - this.elv[e]) * k;
            var c = this.elv[e];
            this.lcol.set([GOLD.r * c, GOLD.g * c, GOLD.b * c, GOLD.r * c, GOLD.g * c, GOLD.b * c], e * 6);
          }
          this.lines.geometry.attributes.position.needsUpdate = true;
          this.lines.geometry.attributes.color.needsUpdate = true;
          /* pulses walk the network */
          var sdt = Math.min(.05, (dt || 16) / 1000) * calm;
          this.pulses.forEach(function (p) {
            p.t += p.v * sdt;
            if (p.t >= 1) {
              var opts = self.adj[p.b], pick = opts[Math.floor(Math.random() * opts.length)];
              p.a = p.b; p.b = pick.to; p.t = 0;
            }
            var A = self.nodes[p.a].g.position, B = self.nodes[p.b].g.position;
            p.sp.position.lerpVectors(A, B, p.t);
            p.sp.material.opacity = Math.sin(p.t * Math.PI) * (h < 0 ? .85 : .5);
          });
        }
      });
    }
  };

  SV.pageInit = function (SV) {
    /* no GPU? keep the decoration still (see .cn-soft in style.css) */
    try {
      var tc = document.createElement('canvas'), tg = tc.getContext('webgl'), te = tg && tg.getExtension('WEBGL_debug_renderer_info');
      if (!tg || /swiftshader|llvmpipe|softpipe|software|basic render/i.test(te ? String(tg.getParameter(te.UNMASKED_RENDERER_WEBGL)) : '')) document.documentElement.classList.add('cn-soft');
      var lose = tg && tg.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
    } catch (e) { /* ignore */ }

    /* header tucks away while reading down, returns on scroll up */
    var hd = document.querySelector('.cn-header'), menu = hd && hd.querySelector('details'), lastY = window.scrollY, hidden = false;
    if (hd) window.addEventListener('scroll', function () {
      var y = window.scrollY, dy = y - lastY;
      if (Math.abs(dy) < 6) return;
      lastY = y;
      var hide = dy > 0 && y > 360 && !(menu && menu.open) && !hd.contains(document.activeElement);
      if (hide !== hidden) { hidden = hide; hd.classList.toggle('is-hidden', hide); }
    }, { passive: true });

    /* starfield behind the page: drawn once (cheap), with a handful of tiny stars that twinkle in CSS */
    var sky = document.querySelector('.cn-sky');
    if (sky && sky.getContext) {
      var ctx = sky.getContext('2d'), rnd = SV.rand(2020), tmr = 0;
      var neb = function (x, y, r, rgb, a) {
        var g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(' + rgb + ',' + a + ')'); g.addColorStop(1, 'rgba(' + rgb + ',0)');
        ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
      };
      var paint = function () {
        var W = window.innerWidth, H = window.innerHeight, dpr = Math.min(2, window.devicePixelRatio || 1), r2 = SV.rand(2020);
        sky.width = W * dpr; sky.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
        /* soft nebula glows, painted once */
        neb(W * .12, H * .08, Math.max(W, H) * .55, '127,216,204', .07);
        neb(W * .88, H * .45, Math.max(W, H) * .5, '118,104,255', .09);
        neb(W * .4, H * 1.0, Math.max(W, H) * .5, '127,216,204', .05);
        var n = Math.round(Math.min(240, W * H / 7000));
        for (var i = 0; i < n; i++) {
          var r = r2(), x = r2() * W, y = r2() * H, rad = r < .86 ? .35 + r2() * .7 : .9 + r2() * .8, a = .2 + r2() * .6;
          ctx.fillStyle = 'rgba(' + (r > .95 ? '243,201,105' : (r > .9 ? '127,216,204' : '230,236,255')) + ',' + a.toFixed(2) + ')';
          ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.283); ctx.fill();
        }
      };
      paint();
      window.addEventListener('resize', function () { clearTimeout(tmr); tmr = setTimeout(paint, 180); });
      var tw = document.createElement('div');
      tw.className = 'cn-twinkles'; tw.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < 16; i++) {
        var st = document.createElement('i');
        st.style.left = (rnd() * 100).toFixed(2) + '%'; st.style.top = (rnd() * 100).toFixed(2) + '%';
        st.style.animationDelay = (-rnd() * 6).toFixed(2) + 's'; st.style.animationDuration = (3 + rnd() * 4).toFixed(2) + 's';
        if (rnd() > .6) st.className = 'q';
        tw.appendChild(st);
      }
      sky.parentNode.insertBefore(tw, sky.nextSibling);
    }

    /* gallery: photos orbit the title; hovering stops the orbit and brings that photo forward */
    var orbit = document.querySelector('[data-orbit]');
    if (orbit) {
      var items = Array.prototype.slice.call(orbit.querySelectorAll('.cn-orb-i')), n = items.length;
      var ang = Math.PI * .5 - Math.PI * 2 / n * .5, paused = false, hov = -1, vis = false, raf = 0, prev = 0;
      var small = window.matchMedia('(max-width: 760px)');
      items.forEach(function (it, i) {
        it._s = 1; it._o = 1;
        it.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') { paused = true; hov = i; } });
        it.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch') { paused = false; hov = -1; } });
        it.addEventListener('focusin', function () { paused = true; hov = i; });
        it.addEventListener('focusout', function () { paused = false; hov = -1; });
      });
      var frame = function (t) {
        var dt = Math.min(50, t - (prev || t)) / 1000; prev = t;
        if (small.matches) {
          items.forEach(function (it) { it.style.transform = ''; it.style.zIndex = ''; it.style.opacity = ''; });
        } else {
          if (!paused && !SV.reduced) ang += dt * .14;
          var rx = orbit.clientWidth * .41, ry = orbit.clientHeight * .37;
          items.forEach(function (it, i) {
            var th = ang + i * Math.PI * 2 / n, x = Math.cos(th) * rx, y = Math.sin(th) * ry, depth = (Math.sin(th) + 1) / 2;
            var sT = .74 + .3 * depth, oT = .45 + .55 * depth;
            if (hov >= 0) { if (i === hov) { sT = 1.22; oT = 1; } else { oT *= .5; } }
            it._s += (sT - it._s) * .14; it._o += (oT - it._o) * .14;
            it.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) scale(' + it._s.toFixed(3) + ')';
            it.style.zIndex = i === hov ? 100 : Math.round(depth * 40);
            it.style.opacity = it._o.toFixed(3);
          });
        }
        raf = vis ? requestAnimationFrame(frame) : 0;
      };
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (en) {
          vis = en[0].isIntersecting;
          if (vis && !raf) { prev = 0; raf = requestAnimationFrame(frame); }
        }).observe(orbit);
      } else { vis = true; raf = requestAnimationFrame(frame); }
      frame(performance.now());
    }

    /* touch: photos light up as they pass the middle of the screen */
    if (!SV.fine && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (e) { e.target.classList.toggle('is-on', e.isIntersecting); });
      }, { rootMargin: '-38% 0px -38% 0px' });
      Array.prototype.forEach.call(document.querySelectorAll('.cn-tw'), function (m) { io.observe(m); });
    }
  };
})();
