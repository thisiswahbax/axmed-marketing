/* Hallmark · Axmed scroll hero, "one order, many sites". Isometric line style: flat faces in three
   tones (lit top, left face, shaded right face), crisp indigo outlines, cyan as the only accent,
   soft halos for shadows, a faint grid. Same family as the marketplace's landing art.
   Stage 1: six sites (hospitals, stores, clinics), each with its own small stack of orders.
   Stage 2: cyan lanes draw in, the orders pool on one pallet in the middle, three suppliers'
            stacks rise behind it and one is picked.
   Stage 3: the cartons ride the lanes back out, now cyan (delivered), and each site's roof lights.
   Scroll drives everything; nothing loops. Illustrative, not real sites or volumes. */
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
  if (!ok) return; // CSS keeps the mist field and the first step
  document.documentElement.classList.add('h3d-on');
  if (reduce) root.classList.add('still');

  var T = THREE;
  var css = getComputedStyle(document.documentElement);
  function tok(n, f) { return (css.getPropertyValue(n).trim() || f); }
  var INK = tok('--indigo', '#261C7A'), CYAN = tok('--cyan', '#0CC4FF');
  // face tones: top (lit), left (+z face), right (+x face, in shade)
  var M = {
    // cool, near-neutral whites and greys (the marketplace art's tones), so indigo and cyan carry the colour
    ice: { top: '#ffffff', left: '#eef3fc', right: '#d9e2f3' },
    carton: { top: '#fbfcff', left: '#e9eef9', right: '#d2dcef' },
    slab: { top: '#f7f9fd', left: '#e7ecf6', right: '#d6deec' },
    wood: { top: '#e6ebf7', left: '#d0d9ed', right: '#bac6e1' },
    steel: { top: '#f4f6fb', left: '#dfe4ef', right: '#c5cde0' },
    cyan: { top: '#c9f1ff', left: '#86defe', right: '#3fcbfb' },
    indigo: { top: '#5a4fb2', left: '#3a2e96', right: '#261c7a' }
  };

  var renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  var scene = new T.Scene();
  var camera = new T.OrthographicCamera(-1, 1, 1, -1, -500, 500);
  var ISO = new T.Vector3(1, 1, 1).normalize();

  // outlines: fat lines when the r128 line helpers loaded, plain 1px lines otherwise
  var fat = !!(T.LineSegments2 && T.LineSegmentsGeometry && T.LineMaterial);
  var lineMat = fat ? new T.LineMaterial({ color: INK, linewidth: 1.15, transparent: true, opacity: 0.9 })
    : new T.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.9 });
  function lines(arr) {
    if (fat) { var g = new T.LineSegmentsGeometry(); g.setPositions(arr); return new T.LineSegments2(g, lineMat); }
    var b = new T.BufferGeometry(); b.setAttribute('position', new T.Float32BufferAttribute(arr, 3)); return new T.LineSegments(b, lineMat);
  }
  function edgesOf(geo, x, y, z) {
    var e = new T.EdgesGeometry(geo), p = e.attributes.position, out = [];
    for (var i = 0; i < p.count; i++) out.push(p.getX(i) + x, p.getY(i) + y, p.getZ(i) + z);
    e.dispose();
    return out;
  }
  function mats(tone) {
    var o = { polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 };
    var r = new T.MeshBasicMaterial(Object.assign({ color: tone.right }, o));
    var t = new T.MeshBasicMaterial(Object.assign({ color: tone.top }, o));
    var l = new T.MeshBasicMaterial(Object.assign({ color: tone.left }, o));
    return { r: r, t: t, l: l, list: [r, r, t, r, l, r] };
  }

  // static blocks share one outline mesh
  var still = [];
  function block(tone, w, h, d, x, y, z, parent) {
    var geo = new T.BoxGeometry(w, h, d), m = mats(tone);
    var mesh = new T.Mesh(geo, m.list);
    mesh.position.set(x, y + h / 2, z);
    (parent || scene).add(mesh);
    if (!parent) still.push.apply(still, edgesOf(geo, x, y + h / 2, z));
    mesh.userData.m = m;
    return mesh;
  }

  // soft halo under things, and a cyan ring for the picked supplier
  function tex(paint) { var c = document.createElement('canvas'); c.width = c.height = 128; paint(c.getContext('2d')); return new T.CanvasTexture(c); }
  var haloTex = tex(function (g) {
    var r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(40,52,90,0.16)'); r.addColorStop(0.6, 'rgba(40,52,90,0.05)'); r.addColorStop(1, 'rgba(40,52,90,0)');
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  });
  var ringTex = tex(function (g) {
    var r = g.createRadialGradient(64, 64, 26, 64, 64, 64);
    r.addColorStop(0, 'rgba(12,196,255,0)'); r.addColorStop(0.55, 'rgba(12,196,255,0.5)'); r.addColorStop(1, 'rgba(12,196,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  });
  function flat(w, d, x, y, z, map, opacity) {
    var m = new T.Mesh(new T.PlaneGeometry(w, d).rotateX(-Math.PI / 2), new T.MeshBasicMaterial({ map: map, transparent: true, opacity: opacity == null ? 1 : opacity, depthWrite: false }));
    m.position.set(x, y, z); scene.add(m); return m;
  }

  // --- ground ---------------------------------------------------------------------------------------
  var grid = new T.GridHelper(220, 55, 0xe2e7f1, 0xedf0f6);
  grid.position.y = -0.62; grid.material.transparent = true; grid.material.opacity = 0.7;
  scene.add(grid);
  flat(70, 70, 2, -0.6, 2, haloTex, 0.55);
  block(M.slab, 46, 0.6, 46, 0, -0.6, 0);

  // --- the six sites, round the middle --------------------------------------------------------------
  var SITES = [
    { a: -2.35, r: 17, w: 7, d: 6, h: 6.5 },   // hospital, tall
    { a: -1.55, r: 18, w: 6, d: 5, h: 3.6 },
    { a: -0.75, r: 17, w: 5, d: 5, h: 4.4 },
    { a: 0.05, r: 18.5, w: 7, d: 5, h: 3.2 },  // central store, long and low
    { a: 0.85, r: 17, w: 5, d: 6, h: 5.4 },
    { a: 1.65, r: 17.5, w: 5, d: 4, h: 3.4 }
  ];
  var roofs = [], pads = [];
  SITES.forEach(function (s) {
    var x = Math.cos(s.a) * s.r, z = Math.sin(s.a) * s.r;
    // the building sits behind its pad, seen from the middle
    var bx = x * 1.12, bz = z * 1.12;
    flat(s.w * 2.2, s.d * 2.2, bx, 0.02, bz, haloTex, 0.9);
    block(M.ice, s.w, s.h, s.d, bx, 0, bz);
    roofs.push(block(M.steel, s.w + 0.6, 0.5, s.d + 0.6, bx, s.h, bz));
    // a door on whichever face looks at the camera more
    if (Math.abs(x) > Math.abs(z)) block(M.indigo, 0.25, 2.4, 1.6, bx + (x > 0 ? -1 : 1) * (s.w / 2 + 0.05), 0, bz);
    else block(M.indigo, 1.6, 2.4, 0.25, bx, 0, bz + (z > 0 ? -1 : 1) * (s.d / 2 + 0.05));
    block(M.slab, 5.4, 0.15, 5.4, x * 0.84, 0, z * 0.84);   // the site's loading pad
    pads.push(new T.Vector3(x * 0.84, 0.15, z * 0.84));
  });

  // the pallet in the middle
  flat(16, 16, 0, 0.03, 0, haloTex, 1);
  [-2.2, 0, 2.2].forEach(function (dz) { block(M.wood, 7.4, 0.55, 1, 0, 0, dz); });
  for (var s5 = 0; s5 < 5; s5++) block(M.wood, 1.3, 0.3, 6.4, -3 + s5 * 1.5, 0.55, 0);
  var DECK = 0.85;

  // three suppliers' stacks behind the pallet; they rise in stage 2
  // in the gaps between the lanes, so they never sit on a site
  var SUP = [[-1.95, 3], [-1.15, 4], [2.6, 2]].map(function (q) { return { x: Math.cos(q[0]) * 8.5, z: Math.sin(q[0]) * 8.5, n: q[1] }; });
  var supGroups = SUP.map(function (s) {
    var g = new T.Group(); g.position.set(s.x, 0, s.z); scene.add(g);
    for (var k = 0; k < s.n; k++) block(M.indigo, 2.6, 1.7, 2.6, 0, k * 1.75, 0, g);
    var e = [];
    for (k = 0; k < s.n; k++) e.push.apply(e, edgesOf(new T.BoxGeometry(2.6, 1.7, 2.6), 0, k * 1.75 + 0.85, 0));
    g.add(lines(e));
    return g;
  });
  var pick = flat(7, 7, SUP[1].x, 0.04, SUP[1].z, ringTex, 0);

  // cyan lanes from each pad to the pallet; they draw in during stage 2
  var laneMat = new T.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.55, depthWrite: false });
  var lanes = pads.map(function (p) {
    var len = Math.hypot(p.x, p.z) - 4.5;
    var m = new T.Mesh(new T.PlaneGeometry(1, 0.6).translate(0.5, 0, 0).rotateX(-Math.PI / 2), laneMat);
    m.position.set(p.x, 0.05, p.z);
    m.rotation.y = -Math.atan2(-p.z, -p.x);
    m.scale.x = 0.0001; m.userData.len = len;
    scene.add(m);
    return m;
  });

  scene.add(lines(still));

  // --- the cartons: start on a site's pad, pool on the pallet, go back out delivered ---------------
  var CW = 2.1, CH = 1.5, CD = 2.1, PER = 5;
  var cGeo = new T.BoxGeometry(CW, CH, CD);
  var cEdge = edgesOf(cGeo, 0, 0, 0);
  var cartons = [], slot = 0;
  var orderTone = new T.Color(), cA = { t: new T.Color(M.carton.top), l: new T.Color(M.carton.left), r: new T.Color(M.carton.right) },
    cB = { t: new T.Color(M.cyan.top), l: new T.Color(M.cyan.left), r: new T.Color(M.cyan.right) };
  pads.forEach(function (p, si) {
    var n = PER - (si % 2);
    for (var k = 0; k < n; k++) {
      var m = mats(M.carton);
      var mesh = new T.Mesh(cGeo, m.list);
      mesh.add(lines(cEdge));
      scene.add(mesh);
      // a 2 x 2 footprint per layer on the pad
      var a = new T.Vector3(p.x + (k % 2 - 0.5) * (CW + 0.15), p.y + CH / 2 + Math.floor(k / 4) * (CH + 0.05), p.z + (Math.floor(k / 2) % 2 - 0.5) * (CD + 0.15));
      var ix = slot % 3, iz = Math.floor(slot / 3) % 3, iy = Math.floor(slot / 9);
      var b = new T.Vector3((ix - 1) * (CW + 0.15), DECK + CH / 2 + iy * (CH + 0.05), (iz - 1) * (CD + 0.15));
      cartons.push({ mesh: mesh, m: m, a: a, b: b, lag: (si * 0.13 + k * 0.04) % 0.6 });
      slot++;
    }
  });

  // --- layout -------------------------------------------------------------------------------------
  var W = 0, H = 0, small = false;
  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.setSize(W, H, false);
    if (fat) lineMat.resolution.set(W, H);
    small = W < 760;
    frame();
  }
  // where the scene's centre sits on screen (fractions) and how wide it reads
  function frameCamera(zoom, lift) {
    var cx = small ? 0.5 : 0.76, cy = small ? 0.3 : 0.5;
    var span = small ? 66 : 120;                        // world units across the canvas width
    var w = span / zoom, h = w * H / W;
    camera.left = -cx * w; camera.right = (1 - cx) * w; camera.top = cy * h; camera.bottom = -(1 - cy) * h;
    camera.position.copy(ISO).multiplyScalar(100).add(new T.Vector3(0, lift, 0));
    camera.lookAt(0, lift, 0);
    camera.updateProjectionMatrix();
  }

  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function ease(x) { x = clamp01(x); return x * x * (3 - 2 * x); }
  var prog = 0, shown = -1, v = new T.Vector3();

  function frame() {
    if (!W) return;
    var p = prog;
    var s2 = ease((p - 0.16) / 0.3), s3 = ease((p - 0.56) / 0.32);
    frameCamera(1 + s2 * 0.18 * (1 - s3), 0);   // a small push in while the orders pool

    lanes.forEach(function (l, i) { l.scale.x = Math.max(0.0001, l.userData.len * ease((p - 0.14 - i * 0.025) / 0.2)); });
    laneMat.opacity = 0.35 + s3 * 0.35;
    supGroups.forEach(function (g, i) { var r = ease((p - 0.24 - i * 0.04) / 0.18) * (1 - ease((p - 0.6) / 0.15)); g.scale.set(1, Math.max(0.001, r), 1); g.visible = r > 0.01; });
    pick.material.opacity = ease((p - 0.42) / 0.12) * (1 - s3);

    cartons.forEach(function (c) {
      var ab = ease((p - 0.18 - c.lag * 0.3) / 0.24), bc = ease((p - 0.58 - c.lag * 0.3) / 0.24);
      v.copy(c.a).lerp(c.b, ab).lerp(c.a, bc);
      v.y += Math.sin(Math.PI * ab) * 2.2 * (1 - bc) + Math.sin(Math.PI * bc) * 2.2;   // a hop along the lane
      c.mesh.position.copy(v);
      c.m.t.color.copy(cA.t).lerp(cB.t, bc); c.m.l.color.copy(cA.l).lerp(cB.l, bc); c.m.r.color.copy(cA.r).lerp(cB.r, bc);
    });
    roofs.forEach(function (r, i) {
      var on = ease((p - 0.78 - i * 0.025) / 0.12), m = r.userData.m;
      m.t.color.set(M.steel.top).lerp(orderTone.set(M.cyan.top), on);
      m.l.color.set(M.steel.left).lerp(orderTone.set(M.cyan.left), on);
      m.r.color.set(M.steel.right).lerp(orderTone.set(M.cyan.right), on);
    });
    renderer.render(scene, camera);

    var st = reduce ? 0 : p < 0.34 ? 0 : p < 0.64 ? 1 : 2;
    if (st !== shown) {
      steps.forEach(function (el, k) { el.classList.toggle('on', k === st); el.setAttribute('aria-hidden', k === st ? 'false' : 'true'); });
      shown = st;
    }
    if (bar) bar.style.transform = 'scaleX(' + p.toFixed(3) + ')';
  }

  function progress() {
    if (reduce) return 0;
    var r = root.getBoundingClientRect(), run = r.height - window.innerHeight;
    return run > 0 ? clamp01(-r.top / run) : 0;
  }
  var raf = 0;
  function loop() { raf = 0; prog = progress(); frame(); }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', resize);
  // test hook: window.h3dAt(0..1) renders a given scroll position
  window.h3dAt = function (x) { prog = x; frame(); };
  resize();
  kick();
  function ready() { document.documentElement.classList.add('ready'); }
  requestAnimationFrame(function () { requestAnimationFrame(ready); });
  setTimeout(ready, 600);
})();
