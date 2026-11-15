/* Hallmark · Sina scene, scrubbed by scroll (nothing on a timer):
   a format leaves the orbit and flows into the live orb, the orb works, and the result card grows out of it.
   Reduced motion or no JS: the copy and all four cards sit still. */
(function () {
  var root = document.querySelector('.sx');
  if (!root) return;
  // the six formats are dot-matrix icons (dm/dotmatrix.js). Scroll drives their assembly; reduced motion draws them still.
  var icons = [].map.call(root.querySelectorAll('.sx-node .fmt'), function (c, i) {
    return window.AxDotMatrix ? AxDotMatrix(c, { shape: c.dataset.shape, theme: 'indigo', icon: true, cells: 28, seed: 3 + i, manual: true }) : null;
  }), iconT = icons.map(function () { return -1; });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('sx-on');
  var stage = root.querySelector('.sx-stage'), nodes = [].slice.call(root.querySelectorAll('.sx-node')),
      cards = [].slice.call(root.querySelectorAll('.sx-card')), steps = root.querySelectorAll('.sx-steps li'),
      rail = root.querySelector('.sx-rail i'), canvas = root.querySelector('.sx-orb'),
      coreEl = root.querySelector('.sx-core'), hiEl = root.querySelector('.sx-hi'), glow = root.querySelector('.sx-ring.r3'),
      svg = root.querySelector('.sx-svg'), links = svg.querySelector('.links'), orbit = svg.querySelector('.orbit'), inner = svg.querySelector('.inner');
  var NS = 'http://www.w3.org/2000/svg', lines = nodes.map(function () { var l = document.createElementNS(NS, 'line'); l.setAttribute('pathLength', '1'); links.appendChild(l); return l; });
  var orb = null;
  try { if (window.createSinaOrb) { orb = createSinaOrb(canvas); if (canvas.dataset.error) orb = null; } } catch (e) { orb = null; }
  root.classList.toggle('live', !!orb);
  var A = .34, L = .165;                                   // intro (grow, greet, connect) until A, then four stages of L
  var ABSORB = { 0: 0, 5: 1 };                             // Excel flows in at stage 0, the catalogue at stage 1
  var STATE = ['listening', 'working', 'speaking', 'idle'];
  function c01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function ease(x) { x = c01(x); return x * x * (3 - 2 * x); }
  var raf = 0, lastS = -2, lastState = '';
  function frame() {
    raf = 0;
    var r = root.getBoundingClientRect(), run = r.height - innerHeight, p = run > 0 ? c01(-r.top / run) : 0;
    var W = stage.offsetWidth, R = W / 2, small = innerWidth < 960;
    var s = p < A ? -1 : Math.min(3, Math.floor((p - A) / L)), t = s < 0 ? 0 : (p - A - s * L) / L;
    var rot = -90 + p * 120;
    // intro: Sina grows from a point, the orbit draws in, formats arrive one by one and connect
    var grow = ease(p / .07), ring = ease((p - .17) / .07);
    // greeting: rises in as Sina reaches full size, holds, then clears before the orbit draws
    var hiIn = ease((p - .05) / .05), hiOut = ease((p - .15) / .04), hi = hiIn * (1 - hiOut);
    hiEl.style.opacity = hi.toFixed(3);
    hiEl.style.transform = 'translate(-50%, ' + ((1 - hiIn) * 14 - hiOut * 8).toFixed(1) + 'px)';
    hiEl.style.filter = hi < .98 ? 'blur(' + ((1 - hi) * 2).toFixed(2) + 'px)' : 'none';
    var g = .25 + .75 * grow;
    orbit.style.strokeDashoffset = (1 - ring).toFixed(3); inner.style.strokeDashoffset = (1 - ease((p - .16) / .06)).toFixed(3);
    nodes.forEach(function (n, i) {
      var a = (rot + i * 60) * Math.PI / 180, x = Math.cos(a) * R, y = Math.sin(a) * R, f = 0;
      if (i in ABSORB) f = ease((p - (A + ABSORB[i] * L)) / (L * .32));
      var appear = ease((p - .21 - i * .014) / .035), link = ease((p - .225 - i * .014) / .035);
      var lx = x * 100 / R, ly = y * 100 / R, ln = lines[i];
      ln.setAttribute('x1', (lx * .36).toFixed(2)); ln.setAttribute('y1', (ly * .36).toFixed(2));
      ln.setAttribute('x2', (lx * (1 - f) * .86 + lx * f * .36).toFixed(2)); ln.setAttribute('y2', (ly * (1 - f) * .86 + ly * f * .36).toFixed(2));
      ln.style.strokeDashoffset = (1 - link * (1 - f)).toFixed(3);
      ln.classList.toggle('on', (i in ABSORB) && f > 0.02 && f < 1);
      x *= 1 - f; y *= 1 - f;
      n.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%,-50%) scale(' + ((1 - f * .7) * (.4 + .6 * appear)).toFixed(3) + ')';
      n.style.opacity = ((1 - f * f) * appear).toFixed(3);
      n.classList.toggle('on', (i in ABSORB) && f > 0.02 && f < 1);
      var it = Math.round(appear * 2.2 * 50) / 50;          // 2.2 s of engine time = fully assembled, before its scan starts
      if (icons[i] && it !== iconT[i]) { iconT[i] = it; icons[i].drawAt(it); }
    });
    cards.forEach(function (c, k) {
      var fx = small ? 0 : (k % 2 ? 1 : -1) * (R + 120), fy = small ? R * .78 : (k < 2 ? -R * .12 : R * .12);
      var sk = A + k * L, e = ease((p - (sk + L * .28)) / (L * .32)), x = k < 3 ? ease((p - (sk + L * 1.08)) / (L * .18)) : 0;
      c.style.transform = 'translate(-50%,-50%) translate(' + (fx * e).toFixed(1) + 'px,' + (fy * e - x * 40).toFixed(1) + 'px) scale(' + (.3 + .7 * e).toFixed(3) + ')';
      c.style.filter = e < 1 ? 'blur(' + ((1 - e) * 10).toFixed(1) + 'px)' : 'none';
      c.style.opacity = (e * (1 - x)).toFixed(3);
    });
    var core = (s >= 0 && t > .2 && t < .6) ? 1 : 0;
    coreEl.style.transform = 'translate(-50%,-50%) scale(' + (g * (1 + core * .06)).toFixed(3) + ')';
    glow.style.opacity = (.5 + core * .5);
    if (s !== lastS) { lastS = s; steps.forEach(function (li, k) { li.classList.toggle('on', k === s); li.classList.toggle('past', k < s); }); }
    var st = s < 0 ? (hi > .2 ? 'speaking' : 'idle') : (s === 0 && t < .3 ? 'listening' : STATE[s]);
    if (orb && st !== lastState) { orb.setState(st); lastState = st; }
    if (rail) rail.style.transform = 'scaleY(' + p.toFixed(3) + ')';
  }
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', kick);
  window.sxAt = function (v) { var r = root.getBoundingClientRect(); scrollTo(0, scrollY + r.top + (r.height - innerHeight) * v); frame(); };
  frame();
})();
