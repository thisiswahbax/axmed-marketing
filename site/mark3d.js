/* Axmed mark, explained by scroll (three.js r128, already on the page for the hero).
   1. Two ribbons apart: buyers and suppliers.
   2. They pull together and twist into a double helix; cyan links grow between them, one by one.
   3. The helix resolves into the Axmed mark itself (extruded from brand/logo/mark-paths.json):
      three ribbons fly in, then the four cyan links click into place.
   Scroll drives the story; the only free motion is a slow wave on the ribbons while the section is on screen.
   No WebGL or reduced motion: the copy stands as three short paragraphs and the canvas is hidden. */
(function () {
  var root = document.querySelector('.mk');
  if (!root || root.hidden || !window.THREE) return;   // parked sections stay off
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gl = (function () { try { var c = document.createElement('canvas'); return !!(c.getContext('webgl') || c.getContext('experimental-webgl')); } catch (e) { return false; } })();
  if (!gl || reduce) return;
  document.documentElement.classList.add('mk-on');

  var MARK = {"main": ["M105.28 425.66C104.36 421.29 104.07 418.72 104.88 415.29L172.24 214.54C172.24 214.54 183.39 167.69 217.7 165.92 224.41 165.57 231.13 167.15 237.1 170.23 244.6 174.1 254.51 181.73 258.94 196.07 258.94 196.07 228.71 167.98 213.83 225.64L124.38 503.35 124.9 505.38C124.9 505.38 123.98 505.36 123.64 504.28L105.28 425.66Z", "M378.34 56.92C372.29 53.85 365.53 52.27 358.75 52.51 324.53 53.76 314.05 97.74 314.05 97.74L187.82 530.66C172.94 588.32 140.42 565.89 140.42 565.89 144.85 580.23 154.98 587.88 162.65 591.77 169.48 595.23 177.07 596.68 184.7 596.05 216.68 593.37 225.82 555.69 225.82 555.69L353.21 117.88C368.09 60.22 400.56 82.8 400.56 82.8 396.13 68.46 386 60.81 378.33 56.92Z", "M435.7 223.04C436.62 227.41 436.91 229.98 436.1 233.41L368.74 434.16C368.74 434.16 357.59 481.01 323.28 482.78 316.57 483.13 309.85 481.55 303.88 478.47 296.38 474.6 286.47 466.97 282.04 452.63 282.04 452.63 312.27 480.72 327.15 423.06L416.6 145.35 416.08 143.32C416.08 143.32 417 143.34 417.34 144.42L435.7 223.04Z"], "accent": ["M179.61 552.45 148.1 429.74 124.39 503.35 124.91 505.38 124.91 505.38 140.42 565.9C140.42 565.9 163.44 581.77 179.61 552.46Z", "M271.31 244.32 258.94 196.06C258.94 196.06 235.33 174.16 219.57 208.88L248.61 322.18 271.31 244.32Z", "M416.6 145.35 400.57 82.81C400.57 82.81 377.53 66.79 361.37 96.2L392.89 218.96 416.6 145.35Z", "M321.41 439.82 292.44 326.76 269.76 404.7 282.04 452.63C282.04 452.63 305.65 474.53 321.41 439.82Z"]};   // brand/logo/mark-paths.json;
  var T = THREE, canvas = root.querySelector('canvas'), scenes = root.querySelectorAll('.mk-s');
  var labA = root.querySelector('.mk-lab .a'), labB = root.querySelector('.mk-lab .b');
  var css = getComputedStyle(document.documentElement);
  function tok(n, f) { return new T.Color(css.getPropertyValue(n).trim() || f); }
  var C = { white: tok('--on-indigo', '#F4F2FD'), cyan: tok('--cyan', '#0CC4FF'), soft: tok('--on-indigo-soft', '#C9C4EC') };

  var renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  var scene = new T.Scene(), camera = new T.PerspectiveCamera(30, 1, 0.1, 60);
  camera.position.set(0, 0, 9.5);
  scene.add(new T.AmbientLight(0xffffff, 0.62));
  var key = new T.DirectionalLight(0xffffff, 0.75); key.position.set(3, 4, 6); scene.add(key);
  var rim = new T.PointLight(C.cyan.getHex(), 0.9, 14); rim.position.set(-3, -2, 3); scene.add(rim);
  var stage = new T.Group(); scene.add(stage);

  function c01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function ease(x) { x = c01(x); return x * x * (3 - 2 * x); }
  function span(p, a, b) { return ease((p - a) / (b - a)); }

  // ---------- two ribbons, rebuilt every frame from (apart, radius, twist) ----------
  var SEG = 150, H = 3.6, W = 0.11, TURNS = 1.6;
  var ribbonMat = new T.MeshStandardMaterial({ color: C.white, roughness: 0.45, metalness: 0.08, side: T.DoubleSide, transparent: true });
  function ribbon() {
    var g = new T.BufferGeometry(), pos = new Float32Array((SEG + 1) * 2 * 3), idx = [];
    for (var i = 0; i < SEG; i++) { var a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    g.setIndex(idx); g.setAttribute('position', new T.BufferAttribute(pos, 3));
    var m = new T.Mesh(g, ribbonMat); stage.add(m); return m;
  }
  var ribs = [ribbon(), ribbon()];
  var helix = { d: 1.7, r: 0, spin: 0, wave: 1, t: 0 };
  function strandAt(j, u, out) {
    var th = u * TURNS * Math.PI * 2 + j * Math.PI + helix.spin;
    var side = j ? 1 : -1;
    var wv = helix.wave * 0.22 * Math.sin(u * 5.5 + helix.t * 0.9 + j * 1.7);
    out.set(side * helix.d + helix.r * Math.cos(th) + wv, (u - 0.5) * H, helix.r * Math.sin(th));
    return th;
  }
  var P = new T.Vector3(), Q = new T.Vector3(), TG = new T.Vector3(), WD = new T.Vector3(), RAD = new T.Vector3(), Z = new T.Vector3(0, 0, 1);
  function buildRibbons() {
    ribs.forEach(function (m, j) {
      var a = m.geometry.attributes.position.array;
      for (var i = 0; i <= SEG; i++) {
        var u = i / SEG, th = strandAt(j, u, P);
        strandAt(j, Math.min(u + 1 / SEG, 1), Q); if (i === SEG) { strandAt(j, u - 1 / SEG, Q); TG.subVectors(P, Q); } else TG.subVectors(Q, P);
        TG.normalize();
        // flat to the viewer while apart; lying on the helix cylinder once twisted (so it turns edge-on at the sides)
        RAD.set(Math.cos(th), 0, Math.sin(th));
        WD.crossVectors(TG, Z).normalize().lerp(Q.crossVectors(TG, RAD).normalize(), c01(helix.r / 0.55)).normalize().multiplyScalar(W);
        a.set([P.x - WD.x, P.y - WD.y, P.z - WD.z, P.x + WD.x, P.y + WD.y, P.z + WD.z], i * 6);
      }
      m.geometry.attributes.position.needsUpdate = true; m.geometry.computeVertexNormals(); m.geometry.computeBoundingSphere();
    });
  }

  // ---------- cyan links between the strands ----------
  var LINKS = 9, linkMat = new T.MeshBasicMaterial({ color: C.cyan, transparent: true });
  var linkGeo = new T.CylinderGeometry(0.035, 0.035, 1, 10, 1, false);
  var links = [];
  for (var k = 0; k < LINKS; k++) { var lm = new T.Mesh(linkGeo, linkMat); lm.userData.u = 0.08 + k * (0.84 / (LINKS - 1)); stage.add(lm); links.push(lm); }
  var UP = new T.Vector3(0, 1, 0), A = new T.Vector3(), B = new T.Vector3(), D = new T.Vector3();
  function placeLinks(grow) {
    links.forEach(function (l, k) {
      var gk = c01(grow * (LINKS + 3) / LINKS - k * 0.32 / LINKS * 3);   // one after another, top to bottom
      gk = ease(gk);
      strandAt(0, l.userData.u, A); strandAt(1, l.userData.u, B);
      D.subVectors(B, A); var len = D.length();
      l.visible = gk > 0.001;
      l.position.copy(A).addScaledVector(D, 0.5);
      l.quaternion.setFromUnitVectors(UP, D.normalize());
      l.scale.set(1, Math.max(len * gk, 0.0001), 1);
    });
  }

  // ---------- the mark: SVG paths (M L C Z, absolute) -> extruded shapes ----------
  function shapeOf(d) {
    var s = new T.Shape(), tk = d.match(/[MLCZ]|-?\d*\.?\d+(?:e-?\d+)?/g), i = 0, cmd = '', x = 0, y = 0;
    function n() { return parseFloat(tk[i++]); }
    while (i < tk.length) {
      if (/[MLCZ]/.test(tk[i])) cmd = tk[i++];
      if (cmd === 'M') { x = n(); y = n(); s.moveTo(x, -y); cmd = 'L'; }
      else if (cmd === 'L') { x = n(); y = n(); s.lineTo(x, -y); }
      else if (cmd === 'C') { var a1 = n(), a2 = n(), b1 = n(), b2 = n(); x = n(); y = n(); s.bezierCurveTo(a1, -a2, b1, -b2, x, -y); }
      else if (cmd === 'Z') { s.closePath(); }
    }
    return s;
  }
  var mark = new T.Group(); stage.add(mark);
  var S = 3.4 / 560, CX = 270, CY = -325;   // viewBox 95 45 350 560, centred and 3.4 units tall
  var mainMat = new T.MeshStandardMaterial({ color: C.white, roughness: 0.4, metalness: 0.1, transparent: true });
  var accMat = new T.MeshStandardMaterial({ color: C.cyan, emissive: C.cyan, emissiveIntensity: 0.45, roughness: 0.35, transparent: true });
  function piece(d, mat, depth) {
    var g = new T.ExtrudeGeometry(shapeOf(d), { depth: depth, bevelEnabled: true, bevelThickness: 3, bevelSize: 2, bevelSegments: 2, curveSegments: 14 });
    g.translate(-CX, -CY, -depth / 2);
    var m = new T.Mesh(g, mat); m.scale.setScalar(S);
    var holder = new T.Group(); holder.add(m); mark.add(holder); return holder;
  }
  var mains = MARK.main.map(function (d) { return piece(d, mainMat, 26); });
  var accs = MARK.accent.map(function (d) { return piece(d, accMat, 34); });
  // where each ribbon flies in from: the helix strands' general direction
  var FROM = [[-2.4, -1.4, -1.5, 0.9], [0, 2.6, -2.2, -1.1], [2.4, 1.2, -1.5, 0.9]];

  // ---------- one frame of the story ----------
  var progress = 0, last = -1, small = false;
  function frame(t) {
    var p = progress;
    helix.t = t;
    var join = span(p, 0.2, 0.5);
    helix.d = 1.7 * (1 - join);
    helix.r = 0.55 * join;
    helix.spin = p * 5.5;
    helix.wave = 1 - join;
    var out = span(p, 0.56, 0.7);                 // helix hands over to the mark
    ribbonMat.opacity = linkMat.opacity = 1 - out;
    var hs = 1 - out * 0.35; ribs.forEach(function (m) { m.scale.setScalar(hs); });
    stage.rotation.y = (1 - out) * (-0.35 + p * 0.5);
    if (ribbonMat.opacity > 0.01) { buildRibbons(); placeLinks(span(p, 0.3, 0.56)); }
    ribs.forEach(function (m) { m.visible = ribbonMat.opacity > 0.01; });
    links.forEach(function (l) { l.visible = l.visible && ribbonMat.opacity > 0.01; l.scale.x = l.scale.z = hs; l.position.multiplyScalar(hs); });

    var inM = span(p, 0.58, 0.78);
    mainMat.opacity = inM;
    mains.forEach(function (h, i) {
      var f = FROM[i], e = ease((p - 0.58 - i * 0.025) / 0.2);
      h.position.set(f[0] * (1 - e), f[1] * (1 - e), f[2] * (1 - e));
      h.rotation.set(0, f[3] * (1 - e), f[3] * 0.4 * (1 - e));
    });
    accs.forEach(function (h, i) {
      var e = ease((p - 0.76 - i * 0.03) / 0.08);
      h.visible = e > 0.001;
      h.scale.setScalar(0.6 + 0.4 * e);
      h.position.z = (1 - e) * 0.8;
    });
    accMat.opacity = span(p, 0.76, 0.8);
    mark.visible = inM > 0.001;
    mark.rotation.y = 0.55 * (1 - span(p, 0.6, 0.9)) - 0.12 * span(p, 0.9, 1);
    mark.rotation.x = 0.1 * (1 - span(p, 0.6, 0.9));
    stage.position.x = small ? 0 : 1.55;
    stage.position.y = small ? 0.95 : 0;
    stage.scale.setScalar(small ? 0.78 : 1);
    renderer.render(scene, camera);

    // labels follow the two strands while they are apart
    var la = 1 - span(p, 0.18, 0.3);
    [[labA, 0, 0.9], [labB, 1, 0.12]].forEach(function (L) {
      strandAt(L[1], L[2], P); P.multiplyScalar(hs); P.applyMatrix4(stage.matrixWorld).project(camera);
      L[0].style.opacity = la.toFixed(3);
      L[0].style.transform = 'translate(' + ((P.x * 0.5 + 0.5) * canvas.clientWidth).toFixed(1) + 'px,' + ((-P.y * 0.5 + 0.5) * canvas.clientHeight).toFixed(1) + 'px)';
    });
    var s = p < 0.28 ? 0 : p < 0.62 ? 1 : 2;
    if (s !== last) { last = s; scenes.forEach(function (el, k) { el.classList.toggle('on', k === s); el.setAttribute('aria-hidden', k === s ? 'false' : 'true'); }); }
  }

  function size() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    small = w < 760;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.position.z = small ? 11.5 : 9.5; camera.updateProjectionMatrix();
  }
  function read() { var r = root.getBoundingClientRect(), run = r.height - innerHeight; progress = run > 0 ? c01(-r.top / run) : 0; }

  // render only while the section is on screen
  var raf = 0, live = false, t0 = performance.now();
  function loop(now) { read(); frame((now - t0) / 1000); raf = live ? requestAnimationFrame(loop) : 0; }
  new IntersectionObserver(function (es) {
    live = es[0].isIntersecting;
    if (live && !raf) raf = requestAnimationFrame(loop);
  }).observe(root);
  addEventListener('resize', function () { size(); if (!raf) { read(); frame((performance.now() - t0) / 1000); } });
  size(); read(); frame(0);
  window.mkAt = function (v) { var r = root.getBoundingClientRect(); scrollTo(0, scrollY + r.top + (r.height - innerHeight) * v); };
})();
