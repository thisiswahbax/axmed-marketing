/* Hallmark · Axmed scroll hero, "pooling". Hundreds of small blocks stand for orders.
   Stage 1: orders from many buyers, scattered and drifting (indigo, violet, cyan).
   Stage 2: they pool into one funnel: one tender, suppliers compete for it.
   Stage 3: the stream lands as columns on a grid: deliveries to facilities, tops lit cyan.
   Scroll drives the morph; only a slow spin loops. Illustrative, not real volumes.
   Replaces hero3d.js (the globe), which is kept for reference. */
(function () {
  var root = document.querySelector('.h3d');
  if (!root) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = root.querySelector('canvas');
  var steps = root.querySelectorAll('.scene');
  var bar = root.querySelector('.bar i');

  var ok = !!window.THREE && (function () {
    try { var c = document.createElement('canvas'); return !!(c.getContext('webgl') || c.getContext('experimental-webgl')); } catch (e) { return false; }
  })();
  if (!ok) return; // CSS keeps the dark field and the first step
  document.documentElement.classList.add('h3d-on');
  if (reduce) root.classList.add('still');

  var T = THREE;
  var css = getComputedStyle(document.documentElement);
  function tok(n, f) { var v = css.getPropertyValue(n).trim(); return new T.Color(v || f); }
  var C = { ink: tok('--indigo-ink', '#1E1662'), app: tok('--indigo-app', '#392AB0'), cyan: tok('--cyan', '#0CC4FF'), on: tok('--on-indigo', '#F4F2FD') };
  var violet = C.app.clone().lerp(C.on, 0.42);      // a lifted indigo, still brand
  var white = C.cyan.clone().lerp(C.on, 0.55);       // the hot core of the stream

  var renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  var scene = new T.Scene();
  scene.fog = new T.Fog(C.ink, 8, 13);
  var camera = new T.PerspectiveCamera(34, 1, 0.1, 60);
  var group = new T.Group();
  scene.add(group);

  scene.add(new T.HemisphereLight(C.on, C.app, 1.15));
  var key = new T.DirectionalLight(C.on, 1.2); key.position.set(-3, 5, 6); scene.add(key);
  var glow = new T.PointLight(C.cyan, 2.2, 7, 2); scene.add(glow);

  var small = window.innerWidth < 760;
  var N = small ? 520 : 900;
  function rnd(a) { return Math.abs(Math.sin(a * 12.9898 + 4.1) * 43758.5453) % 1; }

  // three layouts per block: A scattered, B funnel, C columns
  var A = [], B = [], Cc = [], QA = [], col = [], hot = [], lag = [];
  var COLS = small ? 7 : 10, SP = 0.3, STEP = 0.062;
  var heights = [], cells = COLS * COLS;
  for (var k = 0; k < cells; k++) heights.push(0);
  // share blocks across columns unevenly, so the skyline reads as real demand
  var wts = [], wsum = 0;
  for (k = 0; k < cells; k++) { var w = 0.25 + Math.pow(rnd(k + 91), 2.2) * 2; wts.push(w); wsum += w; }
  var slot = [];
  for (k = 0; k < cells; k++) { var n = Math.round(wts[k] / wsum * N); for (var j = 0; j < n; j++) slot.push(k); }
  while (slot.length < N) slot.push(Math.floor(rnd(slot.length) * cells));
  var topOf = [];
  for (var i = 0; i < N; i++) {
    var r1 = rnd(i), r2 = rnd(i + 17), r3 = rnd(i + 33);
    // A: a wide, loose cloud
    var th = r1 * Math.PI * 2, ph = Math.acos(2 * r2 - 1), rr = 0.7 + Math.pow(r3, 0.7) * 1.2;
    A.push(new T.Vector3(Math.sin(ph) * Math.cos(th) * rr * 1.25, Math.cos(ph) * rr * 0.85, Math.sin(ph) * Math.sin(th) * rr * 0.8));
    QA.push(new T.Quaternion().setFromEuler(new T.Euler(r1 * 6.28, r2 * 6.28, r3 * 6.28)));
    // B: a spiral funnel, wide at the top, one point at the bottom
    var t = i / (N - 1), ang = t * Math.PI * 2 * (small ? 9 : 12) + r3 * 0.4;
    var rad = 0.06 + Math.pow(1 - t, 1.35) * 1.55;
    B.push(new T.Vector3(Math.cos(ang) * rad, 1.5 - t * 2.9, Math.sin(ang) * rad));
    // C: columns on a grid
    var cell = slot[i], h = heights[cell]++;
    var cx = (cell % COLS - (COLS - 1) / 2) * SP, cz = (Math.floor(cell / COLS) - (COLS - 1) / 2) * SP;
    Cc.push(new T.Vector3(cx, -1.3 + h * STEP, cz));
    topOf.push(cell);
    lag.push(r2 * 0.35);
    // colour in the cloud: mostly indigo/violet, some cyan
    col.push(r1 < 0.3 ? C.app.clone().lerp(C.on, 0.18) : r1 < 0.62 ? violet.clone() : r1 < 0.9 ? C.cyan.clone() : white.clone());
  }
  for (i = 0; i < N; i++) hot.push(Cc[i].y > -1.3 + (heights[topOf[i]] - 1.5) * STEP ? 1 : 0); // top block of each column

  var geo = new T.BoxGeometry(0.085, 0.085, 0.085);
  var mat = new T.MeshStandardMaterial({ roughness: 0.38, metalness: 0.15, vertexColors: false });
  var mesh = new T.InstancedMesh(geo, mat, N);
  mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
  for (i = 0; i < N; i++) mesh.setColorAt(i, col[i]);
  group.add(mesh);

  // a thin ground grid that fades in under the columns
  var gridMat = new T.LineBasicMaterial({ color: C.cyan, transparent: true, opacity: 0 });
  var gp = [], half = COLS / 2 * SP;
  for (k = 0; k <= COLS; k++) {
    var o = -half + k * SP;
    gp.push(new T.Vector3(o, 0, -half), new T.Vector3(o, 0, half), new T.Vector3(-half, 0, o), new T.Vector3(half, 0, o));
  }
  var grid = new T.LineSegments(new T.BufferGeometry().setFromPoints(gp), gridMat);
  grid.position.y = -1.34;
  group.add(grid);

  var W = 0, H = 0;
  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    small = W < 760;
    frame();
  }

  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function ease(x) { x = clamp01(x); return x * x * x * (x * (x * 6 - 15) + 10); }
  var prog = 0, shown = -1, t0 = performance.now();
  function progress() {
    if (reduce) return 0;
    var r = root.getBoundingClientRect(), run = r.height - window.innerHeight;
    return run > 0 ? clamp01(-r.top / run) : 0;
  }

  var dummy = new T.Object3D(), qI = new T.Quaternion(), v = new T.Vector3(), cc = new T.Color();
  function frame() {
    var p = prog, time = (performance.now() - t0) / 1000;
    var spin = reduce ? 0 : time * 0.12;
    for (var i = 0; i < N; i++) {
      var ab = ease((p - 0.16 - lag[i] * 0.4) / 0.3);      // cloud to funnel
      var bc = ease((p - 0.56 - lag[i] * 0.4) / 0.3);      // funnel to columns
      v.copy(A[i]).lerp(B[i], ab).lerp(Cc[i], bc);
      if (ab > 0 && bc < 1) v.y += Math.sin(Math.PI * bc) * 0.6;   // a small lift as they jump
      dummy.position.copy(v);
      dummy.quaternion.copy(QA[i]).slerp(qI, Math.max(ab, bc));
      var s = 1 - ab * 0.25 * (1 - bc);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      // colour: cloud mix, then hot cyan-white in the funnel, then indigo columns with cyan tops
      cc.copy(col[i]).lerp(i % 3 ? C.cyan : white, ab * (1 - bc) * 0.85);
      if (bc > 0) cc.lerp(hot[i] ? white : (Cc[i].y > -0.75 ? C.cyan : violet), bc);
      mesh.setColorAt(i, cc);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;

    var mid = ease((p - 0.16) / 0.3) * (1 - ease((p - 0.56) / 0.3));
    var end = ease((p - 0.56) / 0.35);
    group.rotation.y = spin * (1 - end * 0.7) + end * 0.65;
    group.rotation.x = end * 0.3;
    gridMat.opacity = end * 0.28;
    glow.intensity = 1.2 + mid * 2.4;
    glow.position.set(group.position.x, -1.2 + end * 0.2, 0.6);

    var gx = small ? 0 : 1.75, gy = small ? 1.15 : -0.05;
    group.position.set(gx, gy + end * 0.4, 0);   // lift the grid clear of the progress bar
    camera.position.set(0, end * 0.5, (small ? 10.5 : 7.4) - mid * 0.4);
    camera.lookAt(0, small ? 0.3 : 0, 0);
    renderer.render(scene, camera);

    var st = reduce ? 0 : p < 0.34 ? 0 : p < 0.64 ? 1 : 2;
    if (st !== shown) {
      steps.forEach(function (el, k) { el.classList.toggle('on', k === st); el.setAttribute('aria-hidden', k === st ? 'false' : 'true'); });
      shown = st;
    }
    if (bar) bar.style.transform = 'scaleX(' + p.toFixed(3) + ')';
  }

  var raf = 0, visible = true;
  function loop() {
    raf = 0;
    prog = progress();
    frame();
    if (!reduce && visible) raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', resize);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) kick(); }).observe(root);
  }
  // test hook: window.h3dAt(0..1) renders a given scroll position
  window.h3dAt = function (x) { prog = x; frame(); };
  resize();
  kick();
  // let the first frame paint, then play the opening copy; the timer covers tabs that never run a frame
  function ready() { document.documentElement.classList.add('ready'); }
  requestAnimationFrame(function () { requestAnimationFrame(ready); });
  setTimeout(ready, 600);
})();
