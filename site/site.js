/* Hallmark · site behaviour: dot-matrix steps start when seen; buyer / supplier side switch. */
(function () {
  if (window.AxDotMatrix) {
    var cs = document.querySelectorAll('canvas.dm');
    var start = function (c) { if (c.dataset.on) return; c.dataset.on = '1'; var icon = c.classList.contains('icon'); AxDotMatrix(c, { shape: c.dataset.shape, theme: c.dataset.theme || 'paper', seed: 5, icon: icon, cells: +c.dataset.cells || (icon ? 16 : 64) }); };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { start(e.target); io.unobserve(e.target); } }); }, { threshold: 0.3 });
      cs.forEach(function (c) { io.observe(c); });
    } else cs.forEach(start);
  }
  // buyers / suppliers: one side for the whole page. The switch in "What you get" and the tabs in
  // "How it works" stay in step, and the new panel arrives from the side of the tab you pressed.
  var lists = document.querySelectorAll('[role=tablist][data-side]');
  var side = null, still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function setSide(next) {
    var from = side && side !== next ? (next === 'sell' ? 1 : -1) : 0;
    lists.forEach(function (list) {
      list.querySelectorAll('[role=tab]').forEach(function (x) {
        var on = x.dataset.for === next, panel = document.getElementById(x.getAttribute('aria-controls'));
        x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; panel.hidden = !on;
        if (on && from && !still) {
          panel.style.setProperty('--from', from); panel.classList.add('enter');
          panel.getBoundingClientRect(); panel.classList.remove('enter');
        }
      });
    });
    side = next;
    document.dispatchEvent(new CustomEvent('ax:side', { detail: next }));
  }
  lists.forEach(function (list) {
    var tabs = list.querySelectorAll('[role=tab]');
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { setSide(t.dataset.for); });
      t.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; setSide(n.dataset.for); n.focus();
      });
    });
  });
  if (lists.length) setSide(location.hash === '#suppliers' ? 'sell' : 'buy');
  window.addEventListener('hashchange', function () { if (location.hash === '#suppliers') setSide('sell'); if (location.hash === '#buyers') setSide('buy'); });

})();

/* "Where you are born": 100 dots per figure, lit as the section arrives; numbers count up; photo eases in on scroll */
(function () {
  var sec = document.querySelector('.split'); if (!sec) return;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  sec.querySelectorAll('.dotfig').forEach(function (f) {
    var n = +f.dataset.n, box = f.querySelector('.dots'), html = '';
    // 25 columns x 4 rows, counted column by column, so each figure reads as a bar on the same 100-dot scale
    for (var i = 0; i < 100; i++) {
      var c = i % 25, r = Math.floor(i / 25), k = c * 4 + r;
      html += '<i class="' + (k < n ? 'lit' : '') + '" style="--d:' + (c * 40) + 'ms"></i>';
    }
    box.innerHTML = html;
  });
  function count(el) {
    var to = +el.dataset.to, t0 = performance.now();
    (function tick(now) { var k = Math.min(1, (now - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); })(t0);
  }
  if (still || !('IntersectionObserver' in window)) { sec.classList.add('in'); }
  else {
  sec.classList.add('arm');
  sec.querySelectorAll('[data-to]').forEach(function (el) { el.textContent = '0'; });
  new IntersectionObserver(function (es, io) {
    if (es[0].isIntersecting) { sec.classList.add('in'); sec.querySelectorAll('[data-to]').forEach(count); io.disconnect(); }
  }, { threshold: 0.35 }).observe(sec);
  }
  // the photo as the brand dot grid: plain grey dots like the figures, which resolve into an indigo halftone of the photo
  var shot = sec.querySelector('.shot'), cv = sec.querySelector('.sp-dots'), ctx = cv.getContext('2d'), raf = 0;
  var css = getComputedStyle(document.documentElement);
  function rgb(n) { var d = document.createElement('i'); d.style.color = css.getPropertyValue(n); document.body.appendChild(d); var m = getComputedStyle(d).color.match(/\d+/g); d.remove(); return m.slice(0, 3).map(Number); }
  var LINE = rgb('--line'), INK = rgb('--indigo');
  var px = null, cols = 0, rows = 0, cell = 0, W = 0, H = 0, kNow = still ? 1 : 0;
  function ease(x) { x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); }
  function size() {
    var r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cell = W < 360 ? 6 : 7; cols = Math.floor(W / cell); rows = Math.floor(H / cell);
    var img = cv._img; if (!img) return;
    var o = document.createElement('canvas'); o.width = cols; o.height = rows;
    var oc = o.getContext('2d'); oc.drawImage(img, 0, 0, cols, rows); px = oc.getImageData(0, 0, cols, rows).data;
    draw();
  }
  function draw() {
    if (!px) return;
    ctx.clearRect(0, 0, W, H);
    var ox = (W - cols * cell) / 2, oy = (H - rows * cell) / 2;
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
      var i = (y * cols + x) * 4, R = px[i], G = px[i + 1], B = px[i + 2];
      var dark = 1 - (0.299 * R + 0.587 * G + 0.114 * B) / 255;
      var kk = kNow * 1.4 - ((x / cols) * 0.15 + (y / rows) * 0.25);          // a soft sweep from top-left
      var a = ease(kk);
      var r0 = cell * 0.16, rh = cell * 0.5 * Math.min(1, 0.14 + Math.pow(dark, 0.8) * 1.1);
      var rad = r0 + (rh - r0) * a;
      ctx.fillStyle = 'rgb(' + Math.round(LINE[0] + (INK[0] - LINE[0]) * a) + ',' + Math.round(LINE[1] + (INK[1] - LINE[1]) * a) + ',' + Math.round(LINE[2] + (INK[2] - LINE[2]) * a) + ')';
      ctx.beginPath(); ctx.arc(ox + x * cell + cell / 2, oy + y * cell + cell / 2, rad, 0, 6.2832); ctx.fill();
    }
  }
  function reveal() {
    raf = 0;
    if (!still) { var r = shot.getBoundingClientRect(); kNow = ease((innerHeight * 0.85 - r.top) / (innerHeight * 0.75)); }
    shot.style.setProperty('--k', kNow.toFixed(3));
    draw();
  }
  var im = new Image(); im.onload = function () { cv._img = im; size(); reveal(); }; im.src = cv.dataset.src;
  addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(reveal); }, { passive: true });
  addEventListener('resize', size);
  size(); reveal();
})();

/* how it works: one order, start to finish. Wide screens with motion pin the section and map vertical scroll to a
   sideways move of the track; narrow screens and reduced motion swipe the track natively. Either way the rail
   fills with progress, marks the current step, and jumps to a step when pressed. */
(function () {
  var sec = document.querySelector('.hw'); if (!sec) return;
  var wide = matchMedia('(min-width: 961px)'), still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement, raf = 0;
  function panel() { return sec.querySelector('.panel:not([hidden])'); }
  function pinned() { return wide.matches && !still; }
  function mark(pn, p) {   // p: 0..1 progress through the four steps
    var steps = pn.querySelectorAll('.hw-step'), n = steps.length, k = Math.round(p * (n - 1));
    pn.querySelector('.hw-fill').style.setProperty('--p', p.toFixed(4));   // fills continuously; the stop marks the nearest step
    steps.forEach(function (s, i) { s.classList.toggle('on', i === k); });
    pn.querySelectorAll('.hw-rail button').forEach(function (b, i) { if (i === k) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
  }
  function frame() {
    raf = 0; var pn = panel(); if (!pn) return;
    var track = pn.querySelector('.hw-track');
    if (pinned()) {
      var r = sec.getBoundingClientRect(), run = r.height - innerHeight;
      var p = run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
      var step = track.querySelector('.hw-step'), gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      var dist = (step.offsetWidth + gap) * (track.children.length - 1);
      track.style.transform = 'translate3d(' + (-p * dist).toFixed(1) + 'px,0,0)';
      mark(pn, p);
    } else {
      track.style.transform = '';
      var max = track.scrollWidth - track.clientWidth;
      mark(pn, max > 0 ? track.scrollLeft / max : 0);
    }
  }
  function ask() { if (!raf) raf = requestAnimationFrame(frame); }
  function arm() { root.classList.toggle('hw-on', pinned()); ask(); }
  arm(); wide.addEventListener ? wide.addEventListener('change', arm) : wide.addListener(arm);
  addEventListener('scroll', ask, { passive: true });
  addEventListener('resize', ask);
  sec.querySelectorAll('.hw-track').forEach(function (t) { t.addEventListener('scroll', ask, { passive: true }); });
  document.addEventListener('ax:side', function () { requestAnimationFrame(frame); });
  sec.querySelectorAll('.hw-rail button').forEach(function (b) {
    b.addEventListener('click', function () {
      var pn = b.closest('.panel'), k = +b.dataset.k, n = pn.querySelectorAll('.hw-step').length;
      if (pinned()) {
        var top = sec.getBoundingClientRect().top + scrollY, run = sec.offsetHeight - innerHeight;
        scrollTo({ top: top + run * k / (n - 1) + 1, behavior: 'smooth' });
      } else {
        var t = pn.querySelector('.hw-track'), s = t.children[k];
        t.scrollTo({ left: s.offsetLeft - (t.clientWidth - s.offsetWidth) / 2, behavior: still ? 'auto' : 'smooth' });
      }
    });
  });
})();

/* impact: one wave in, figures count up once */
(function () {
  var sec = document.querySelector('.impact'); if (!sec) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  sec.classList.add('arm');
  var nums = sec.querySelectorAll('[data-to]');
  nums.forEach(function (el) { el.textContent = (+el.dataset.dec ? (0).toFixed(1) : '0'); });
  function count(el) {
    var to = +el.dataset.to, dec = +el.dataset.dec || 0, t0 = performance.now();
    (function tick(now) { var k = Math.min(1, (now - t0) / 1600), v = to * (1 - Math.pow(1 - k, 4)); el.textContent = v.toFixed(dec); if (k < 1) requestAnimationFrame(tick); })(t0);
  }
  new IntersectionObserver(function (es, io) {
    if (es[0].isIntersecting) { sec.classList.add('in'); nums.forEach(count); io.disconnect(); }
  }, { threshold: 0.3 }).observe(sec);
})();

/* what you get: tiles rise once the section is in view */
(function () {
  var sec = document.querySelector('.get'); if (!sec) return;
  // the suppliers' globe: starts the first time it is actually on screen (its panel may be hidden at load)
  var gx = sec.querySelector('canvas.gx');
  if (gx && window.AxDotMatrix && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es, io) {
      if (es[0].isIntersecting) { AxDotMatrix(gx, { shape: 'globe', theme: 'paper', seed: 4, cells: 44, icon: true }); io.disconnect(); }
    }, { threshold: 0.2 }).observe(gx);
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  sec.classList.add('arm');
  new IntersectionObserver(function (es, io) {
    if (es[0].isIntersecting) { sec.classList.add('in'); io.disconnect(); }
  }, { threshold: 0.2 }).observe(sec);
})();

/* partner stories: the active partner's bar runs as a 9 s timer (CSS); when it fills, the next quote comes in.
   Auto-advance only while the section is in view, pauses on hover or focus, and stops for good once someone picks. */
(function () {
  var sec = document.querySelector('.voices'); if (!sec) return;
  var qs = sec.querySelectorAll('.vo-q'), bs = sec.querySelectorAll('.vo-pick button');
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  qs.forEach(function (q) {   // words as spans, so a quote can arrive word by word
    var p = q.querySelector('p'), words = p.textContent.trim().split(/\s+/);
    p.textContent = '';
    words.forEach(function (w, i) {
      var s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--i', i); s.textContent = w;
      p.appendChild(s); if (i < words.length - 1) p.appendChild(document.createTextNode(' '));
    });
  });
  // each partner's dot-matrix drawing re-assembles when their story comes in; only the visible one runs
  var art = null;
  function draw(q) {
    var c = q.querySelector('.vo-dm'); if (!c || !window.AxDotMatrix) return;
    if (art) art.stop();
    art = AxDotMatrix(c, { shape: c.dataset.shape, theme: 'indigo', seed: 6, cells: 56 });
  }
  function show(k) {
    qs.forEach(function (q, i) { q.classList.toggle('on', i === k); q.setAttribute('aria-hidden', i !== k); });
    bs.forEach(function (b, i) { b.setAttribute('aria-pressed', i === k); });
    if (sec.classList.contains('seen') || still) draw(qs[k]);
  }
  bs.forEach(function (b, i) { b.addEventListener('click', function () { sec.classList.remove('auto'); show(i); }); });
  show(0);
  if (still || !('IntersectionObserver' in window)) { sec.classList.add('seen'); return; }
  sec.classList.add('arm', 'auto');
  sec.querySelector('.vo-pick').addEventListener('animationend', function (e) {
    if (e.animationName !== 'vo-timer' || !sec.classList.contains('auto')) return;
    show(([].indexOf.call(bs, e.target.parentNode) + 1) % bs.length);
  });
  ['mouseenter', 'focusin'].forEach(function (ev) { sec.addEventListener(ev, function () { sec.classList.add('hold'); }); });
  sec.addEventListener('mouseleave', function () { sec.classList.remove('hold'); });
  sec.addEventListener('focusout', function (e) { if (!sec.contains(e.relatedTarget)) sec.classList.remove('hold'); });
  new IntersectionObserver(function (es) {
    var on = es[0].isIntersecting; sec.classList.toggle('live', on);
    if (on && !sec.classList.contains('seen')) { sec.classList.add('seen'); draw(sec.querySelector('.vo-q.on')); }
  }, { threshold: 0.15 }).observe(sec);
})();

/* close: Africa as a dot matrix (dm/dotmap.js, built by scripts/make-dotmap.py from Natural Earth).
   Base dots are drawn once to an offscreen canvas; each frame copies it and adds the few glinting dots. */
(function () {
  var cv = document.querySelector('.cl-map'), M = window.AX_DOTMAP; if (!cv || !M) return;
  var css = getComputedStyle(document.documentElement);
  var INK = css.getPropertyValue('--on-indigo').trim(), CY = css.getPropertyValue('--cyan').trim();
  var rows = M.rows, R = rows.length, C = rows[0].length;
  var NBO = [Math.round((M.lat1 - -1.29) / M.step), Math.round((36.82 - M.lon0) / M.step)]; // Nairobi, row / col
  var cells = [], africa = [];
  for (var r = 0; r < R; r++) for (var c = 0; c < C; c++) {
    var ch = rows[r][c], d = Math.hypot(r - NBO[0], c - NBO[1]);
    cells.push({ r: r, c: c, k: ch, d: d });
    if (ch === 'a') africa.push(cells.length - 1);
  }
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctx = cv.getContext('2d'), base = document.createElement('canvas'), bctx = base.getContext('2d');
  var W = 0, H = 0, cell = 0, dpr = 1, t0 = 0, raf = 0, live = false, glints = [], RIPPLE = 1800;
  function alphaOf(k) { return k === 'a' ? 0.5 : k === 'l' ? 0.16 : 0.05; }
  function radiusOf(k) { return k === '.' ? cell * 0.12 : cell * 0.26; }
  function dot(g, x, y, rad, col, a) { g.globalAlpha = a; g.fillStyle = col; g.beginPath(); g.arc(x, y, rad, 0, 6.2832); g.fill(); }
  function size() {
    dpr = Math.min(2, devicePixelRatio || 1);
    W = cv.clientWidth; H = cv.clientHeight; cell = W / C;
    cv.width = base.width = Math.round(W * dpr); cv.height = base.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bctx.clearRect(0, 0, W, H);
    cells.forEach(function (q) { dot(bctx, (q.c + .5) * cell, (q.r + .5) * cell, radiusOf(q.k), INK, alphaOf(q.k)); });
  }
  function draw(now) {
    var t = now - t0;
    ctx.clearRect(0, 0, W, H);
    if (t < RIPPLE + 600) {   // arrival: each dot fades in as the ring from Nairobi passes it
      var front = t / RIPPLE * 70;
      cells.forEach(function (q) {
        var k = Math.min(1, Math.max(0, (front - q.d) / 6)); if (!k) return;
        dot(ctx, (q.c + .5) * cell, (q.r + .5) * cell, radiusOf(q.k) * (0.6 + 0.4 * k), INK, alphaOf(q.k) * k);
      });
    } else {
      ctx.globalAlpha = 1; ctx.drawImage(base, 0, 0, W, H);
    }
    if (t > RIPPLE * 0.6) {   // glints: a dozen African dots at a time, each breathing in and out over ~2.4 s
      while (glints.length < 12) glints.push({ i: africa[(Math.random() * africa.length) | 0], s: now + Math.random() * 1600 });
      glints = glints.filter(function (g) {
        var u = (now - g.s) / 2400; if (u >= 1) return false; if (u < 0) return true;
        var q = cells[g.i], a = Math.sin(u * Math.PI);
        dot(ctx, (q.c + .5) * cell, (q.r + .5) * cell, cell * 0.3, CY, a);
        return true;
      });
    }
    ctx.globalAlpha = 1;
    raf = live ? requestAnimationFrame(draw) : 0;
  }
  function start() { if (!raf) raf = requestAnimationFrame(draw); }
  size();
  addEventListener('resize', function () { size(); if (still) { ctx.clearRect(0, 0, W, H); ctx.drawImage(base, 0, 0, W, H); } });
  if (still || !('IntersectionObserver' in window)) { ctx.drawImage(base, 0, 0, W, H); return; }
  var seen = false;
  new IntersectionObserver(function (es) {
    live = es[0].isIntersecting;
    if (live && !seen) { seen = true; t0 = performance.now(); }
    if (live) start();
  }, { threshold: 0.25 }).observe(cv);
})();


// Footer sign-off: the header's logo SVG is rendered off-screen, sampled on a grid, and each filled
// cell becomes a square in the logo's own colour. On first view the cells gather from close by and
// settle into the mark, left to right: many pieces pooled into one.
// Motion follows the site tokens (--ease-out, --dur-scene). Cells that have landed are painted once
// into a cached layer, so each frame only draws what is still moving.
(function () {
  var cv = document.querySelector('.ft-px'), src = document.querySelector('.nav .logo');
  if (!cv || !src) return;
  var root = getComputedStyle(document.documentElement);
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches, img = new Image();
  var FLIGHT = parseFloat(root.getPropertyValue('--dur-scene')) || 640, SPREAD = 520;   // ms
  var ease = bezier(root.getPropertyValue('--ease-out'));
  var G = null, shown = false, t0 = 0, raf = 0, builtW = 0;

  // cubic-bezier(x1,y1,x2,y2) from the token, solved for y at a given x (Newton, then bisection)
  function bezier(tok) {
    var m = /cubic-bezier\(([^)]+)\)/.exec(tok || ''), v = m ? m[1].split(',').map(parseFloat) : [0.23, 1, 0.32, 1];
    function f(a, b, t) { return 3 * a * t * (1 - t) * (1 - t) + 3 * b * t * t * (1 - t) + t * t * t; }
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      var t = x;
      for (var i = 0; i < 6; i++) { var d = f(v[0], v[2], t) - x, s = (f(v[0], v[2], t + 1e-4) - f(v[0], v[2], t)) / 1e-4; if (Math.abs(d) < 1e-4 || !s) break; t -= d / s; }
      return f(v[1], v[3], Math.max(0, Math.min(1, t)));
    };
  }
  function rnd(s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

  function build() {
    var w = cv.clientWidth, h = cv.clientHeight; if (!w || !img.complete) return false;
    builtW = w;
    var step = w < 600 ? 5 : w < 1000 ? 7 : 9, size = step - (step > 6 ? 2 : 1);
    var cols = Math.floor(w / step), rows = Math.floor(h / step), S = 4;
    var off = document.createElement('canvas'); off.width = cols * S; off.height = rows * S;
    var o = off.getContext('2d', { willReadFrequently: true }), scale = off.width / 108;
    o.drawImage(img, 0, (off.height - 42 * scale) / 2, off.width, 42 * scale);
    var px = o.getImageData(0, 0, off.width, off.height).data, R = rnd(7), list = [];
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
      var a = 0, r = 0, g = 0, b = 0;
      for (var j = 0; j < S; j++) for (var i = 0; i < S; i++) {
        var k = ((y * S + j) * off.width + x * S + i) * 4, al = px[k + 3] / 255;
        a += al; r += px[k] * al; g += px[k + 1] * al; b += px[k + 2] * al;
      }
      if (a / (S * S) < 0.42) continue;
      // snap to a 32-step colour grid so neighbouring cells share a fillStyle
      var q = function (n) { return Math.round(n / a / 32) * 32; };
      var rgb = [Math.min(255, q(r)), Math.min(255, q(g)), Math.min(255, q(b))];
      list.push({ x: x, y: y, rgb: rgb, c: 'rgb(' + rgb.join(',') + ')',
        a: R() < 0.1 ? 0.7 : 1,
        sx: (R() - 0.5) * cols * 0.3, sy: (R() - 0.5) * rows * 0.9,       // starts close by, not across the page
        dl: x / cols * SPREAD + R() * 140, done: false });                 // the left of the mark leads
    }
    list.sort(function (p, q2) { return p.c < q2.c ? -1 : p.c > q2.c ? 1 : 0; });   // one fillStyle change per colour
    var dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    var settled = document.createElement('canvas'); settled.width = cv.width; settled.height = cv.height;
    G = { list: list, step: step, size: size, cols: cols, rows: rows, ox: (w - cols * step) / 2, w: w, h: h, dpr: dpr, ready: false,
      settled: settled, sctx: settled.getContext('2d'), end: SPREAD + 140 + FLIGHT };
    G.sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // the ghost grid: every cell position as a faint square in the footer's line colour, so the logo
    // is drawn out of a grid that belongs to the footer rather than floating below it
    G.sctx.fillStyle = root.getPropertyValue('--line').trim() || '#E6E8EF';
    // it fades out toward every edge, thinning as well as lightening, so there is no box outline
    var GR = rnd(3), band = Math.max(4, Math.round(rows * 0.3));
    for (var gy = 0; gy < rows; gy++) for (var gx = 0; gx < cols; gx++) {
      var e = Math.min(gx, cols - 1 - gx, gy, rows - 1 - gy) / band; if (e >= 1) e = 1;
      if (GR() > e * 1.15) continue;
      G.sctx.globalAlpha = 0.25 + 0.75 * e; G.sctx.fillRect(G.ox + gx * step, gy * step, size, size);
    }
    G.sctx.globalAlpha = 1;
    return true;
  }
  function land(c) {   // paint a cell into the cached layer for good
    c.done = true; G.sctx.globalAlpha = c.a; G.sctx.fillStyle = c.c;
    G.sctx.fillRect(G.ox + c.x * G.step, c.y * G.step, G.size, G.size);
  }
  function finish() { G.list.forEach(function (c) { if (!c.done) land(c); }); G.ready = true; paint([]); }
  function paint(moving) {
    var ctx = cv.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(G.settled, 0, 0);
    ctx.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
    var fill = '';
    moving.forEach(function (m) {
      if (m.c.c !== fill) { fill = m.c.c; ctx.fillStyle = fill; }
      ctx.globalAlpha = m.al; ctx.fillRect(m.x, m.y, G.size, G.size);
    });
    ctx.globalAlpha = 1;
  }
  function frame(now) {
    var t = now - t0, moving = [];
    G.list.forEach(function (c) {
      if (c.done) return;
      var k = (t - c.dl) / FLIGHT; if (k <= 0) return;
      if (k >= 1) { land(c); return; }
      var e = ease(k);
      moving.push({ c: c, al: c.a * Math.min(1, k * 3),        // fades in over the first third of its flight
        x: G.ox + (c.x + c.sx * (1 - e)) * G.step, y: (c.y + c.sy * (1 - e)) * G.step });
    });
    paint(moving);
    raf = t < G.end ? requestAnimationFrame(frame) : 0;
    if (!raf) finish();
  }
  function play() {
    if (still) { finish(); return; }
    shown = true; t0 = performance.now(); raf = requestAnimationFrame(frame);
  }

  // Hover: near the pointer the logo's squares turn into patients, each larger than the square it
  // replaces and largest at the cursor, in a light tint of its own colour. Every other square on a
  // 2 x 2 lattice becomes a patient and the squares between them clear, so each one has room to grow.
  // The copyright line under the logo swaps for an impact line while they show.
  // Mouse only, once the logo has assembled. The pointer handler paints directly; rAF only runs
  // the fade, so the patients keep up with the cursor even where frames are throttled.
  var HOVER_MS = parseFloat(root.getPropertyValue('--dur-ui')) || 220;
  var foot = cv.closest('footer') || document, tip = foot.querySelector('.ft-tip'), legal = foot.querySelector('.ft-legal');
  var mx = 0, my = 0, glow = 0, want = 0, hraf = 0, last = 0;
  function lite(rgb, f) { return 'rgb(' + rgb.map(function (v) { return Math.round(v + (255 - v) * f); }).join(',') + ')'; }
  function person(ctx, cx, cy, k) {   // head and shoulders, k = height in px, centred on (cx, cy)
    ctx.beginPath(); ctx.arc(cx, cy - k * 0.24, k * 0.22, 0, Math.PI * 2);
    ctx.moveTo(cx + k * 0.42, cy + k * 0.5); ctx.ellipse(cx, cy + k * 0.5, k * 0.42, k * 0.42, 0, 0, Math.PI, true);
    ctx.fill();
  }
  function render() {
    paint([]);
    if (tip) tip.style.opacity = glow.toFixed(3);
    if (legal) legal.style.opacity = (1 - glow).toFixed(3);
    if (glow <= 0) return;
    var ctx = cv.getContext('2d'), R = Math.max(110, G.w * 0.12), s = G.step, people = [];
    ctx.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
    G.list.forEach(function (c) {
      var cx = G.ox + c.x * s + G.size / 2, cy = c.y * s + G.size / 2, d = Math.hypot(cx - mx, cy - my); if (d > R) return;
      var f = Math.pow(1 - d / R, 0.7) * glow;
      ctx.clearRect(G.ox + c.x * s - 0.5, c.y * s - 0.5, G.size + 1, G.size + 1);   // the square makes way
      if (c.x % 2 || c.y % 2) {                                           // squares between patients fade back as glow drops
        ctx.globalAlpha = Math.max(0, 1 - f * 3); ctx.fillStyle = 'rgb(' + c.rgb.join(',') + ')';
        ctx.fillRect(G.ox + c.x * s, c.y * s, G.size, G.size); ctx.globalAlpha = 1; return;
      }
      people.push({ cx: cx + s / 2, cy: cy + s / 2, f: f, c: c, d: d });   // centred on its 2 x 2 block
    });
    people.sort(function (a, b) { return b.d - a.d; });                   // the nearest draw last, on top
    people.forEach(function (p) {
      ctx.fillStyle = lite(p.c.rgb, 0.45 * p.f);
      person(ctx, p.cx, p.cy, G.size * (1 + 1.5 * p.f));                  // from one square up to about two
    });
  }
  function hoverFrame(now) {
    var dt = last ? now - last : 16; last = now;
    glow += (want - glow) * Math.min(1, dt / HOVER_MS * 2.2);            // eases toward on/off over about --dur-ui
    if (Math.abs(want - glow) < 0.01) glow = want;
    render();
    if (glow !== want) hraf = requestAnimationFrame(hoverFrame); else { hraf = 0; last = 0; }
  }
  function fade() { if (!hraf) hraf = requestAnimationFrame(hoverFrame); }
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    cv.addEventListener('pointermove', function (e) {
      if (!G || !G.ready || e.pointerType !== 'mouse') return;
      var r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; want = 1;
      if (glow === want) render(); else fade();                           // settled: follow the cursor now
    });
    cv.addEventListener('pointerleave', function () { if (G && G.ready) { want = 0; fade(); } });
  }
  img.onload = function () {
    if (!build()) return;
    paint([]);
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; io.disconnect(); play();
    }, { threshold: 0.4 });
    io.observe(cv);
  };
  var svg = src.cloneNode(true); svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('width', '1080'); svg.setAttribute('height', '420');
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
  // only a real width change rebuilds the grid (phones fire resize when the address bar moves)
  var rt; addEventListener('resize', function () {
    clearTimeout(rt); rt = setTimeout(function () {
      if (!G || cv.clientWidth === builtW) return;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      if (build() && (shown || still)) finish();
    }, 150);
  });
})();
