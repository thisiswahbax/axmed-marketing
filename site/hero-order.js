/* Hallmark · Axmed scroll hero, "your order list becomes a delivery". Isometric line style on white:
   flat faces in cool near-neutral tones, fat indigo outlines, indigo and cyan as the only colour.
   Few, large objects, and the camera follows the story.
   Stage 1: an order sheet lies on the floor, six lines on it.
   Stage 2: the lines lift off and become cartons, stacked on one pallet; three suppliers' stacks
            rise behind it and one is picked; the sheet folds away.
   Stage 3: a truck, a ship and a plane rise round the pallet, take two cartons each and leave by
            land, sea and air (cyan road, waterway, dashed flight path), all toward the right; the camera
            pulls back to a raised dot map of Africa where pins drop on illustrative stops and dashed routes light.
   Scroll drives everything; nothing loops. Illustrative. */
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
  if (!ok) return;
  document.documentElement.classList.add('h3d-on');
  if (reduce) root.classList.add('still');

  var T = THREE;
  var css = getComputedStyle(document.documentElement);
  function tok(n, f) { return (css.getPropertyValue(n).trim() || f); }
  var INK = tok('--indigo', '#261C7A'), CYAN = tok('--cyan', '#0CC4FF');
  // face tones: top (lit), left (+z face), right (+x face, in shade)
  var M = {
    ice: { top: '#ffffff', left: '#eef3fc', right: '#d9e2f3' },
    carton: { top: '#fbfcff', left: '#e9eef9', right: '#d2dcef' },
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

  var fat = !!(T.LineSegments2 && T.LineSegmentsGeometry && T.LineMaterial);
  var lineMat = fat ? new T.LineMaterial({ color: INK, linewidth: 1.4, transparent: true, opacity: 0.92 })
    : new T.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.92 });
  function lines(arr) {
    if (fat) { var g = new T.LineSegmentsGeometry(); g.setPositions(arr); return new T.LineSegments2(g, lineMat); }
    var b = new T.BufferGeometry(); b.setAttribute('position', new T.Float32BufferAttribute(arr, 3)); return new T.LineSegments(b, lineMat);
  }
  function edgesOf(geo, x, y, z, angle) {
    var e = new T.EdgesGeometry(geo, angle || 1), p = e.attributes.position, out = [];
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

  // A rig is a group with its own outline mesh, so it can move as one.
  function rig(x, y, z) {
    var g = new T.Group(); g.position.set(x || 0, y || 0, z || 0); scene.add(g);
    g.userData.edges = [];
    return g;
  }
  function seal(g) { if (g.userData.edges.length) g.add(lines(g.userData.edges)); return g; }
  function block(g, tone, w, h, d, x, y, z) {
    var geo = new T.BoxGeometry(w, h, d), m = mats(tone);
    var mesh = new T.Mesh(geo, m.list);
    mesh.position.set(x, y + h / 2, z);
    g.add(mesh);
    g.userData.edges.push.apply(g.userData.edges, edgesOf(geo, x, y + h / 2, z));
    mesh.userData.m = m;
    return mesh;
  }
  function wheel(g, x, y, z) {
    var geo = new T.CylinderGeometry(0.95, 0.95, 0.7, 24).rotateX(Math.PI / 2);
    var mesh = new T.Mesh(geo, new T.MeshBasicMaterial({ color: M.indigo.right }));
    mesh.position.set(x, y, z); g.add(mesh);
    g.userData.edges.push.apply(g.userData.edges, edgesOf(geo, x, y, z, 40));
    var hub = new T.Mesh(new T.CircleGeometry(0.38, 16), new T.MeshBasicMaterial({ color: M.steel.top }));
    hub.position.set(x, y, z + 0.36); g.add(hub);
  }

  function tex(paint) { var c = document.createElement('canvas'); c.width = c.height = 128; paint(c.getContext('2d')); return new T.CanvasTexture(c); }
  var haloTex = tex(function (g) {
    var r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(40,52,90,0.18)'); r.addColorStop(0.6, 'rgba(40,52,90,0.06)'); r.addColorStop(1, 'rgba(40,52,90,0)');
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  });
  var ringTex = tex(function (g) {
    var r = g.createRadialGradient(64, 64, 26, 64, 64, 64);
    r.addColorStop(0, 'rgba(12,196,255,0)'); r.addColorStop(0.55, 'rgba(12,196,255,0.55)'); r.addColorStop(1, 'rgba(12,196,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  });
  function flat(parent, w, d, x, y, z, map, opacity) {
    var m = new T.Mesh(new T.PlaneGeometry(w, d).rotateX(-Math.PI / 2), new T.MeshBasicMaterial({ map: map, transparent: true, opacity: opacity == null ? 1 : opacity, depthWrite: false }));
    m.position.set(x, y, z); parent.add(m); return m;
  }

  // --- ground: a faint grid only, on the page's white --------------------------------------------
  var grid = new T.GridHelper(260, 65, 0xe2e7f1, 0xedf0f6);
  grid.position.y = -0.02; grid.material.transparent = true; grid.material.opacity = 0.8;
  scene.add(grid);

  // --- the order sheet ------------------------------------------------------------------------------
  var SX = -9, SZ = -1;
  var sheet = rig(SX, 0, SZ);
  flat(sheet, 26, 32, 0, 0.01, 0, haloTex, 1);
  block(sheet, M.ice, 15, 0.45, 21, 0, 0, 0);
  block(sheet, M.indigo, 15, 0.12, 2.6, 0, 0.45, -9.2);              // the header band
  for (var c = 0; c < 3; c++) block(sheet, M.cyan, 1.6, 0.12, 0.7, -5.6 + c * 2.2, 0.57, -9.2);
  seal(sheet);

  // --- the pallet, where the order is pooled -------------------------------------------------------
  var PX = 6, PZ = -2;
  var load = rig(PX, 0, PZ);
  flat(load, 15, 15, 0, 0.02, 0, haloTex, 1);
  [-2.6, 0, 2.6].forEach(function (dz) { block(load, M.wood, 7.4, 0.6, 1.1, 0, 0, dz); });
  for (var s = 0; s < 5; s++) block(load, M.wood, 1.25, 0.32, 7.2, -3 + s * 1.5, 0.6, 0);
  seal(load);
  var DECK = 0.92;

  // --- suppliers behind the pallet ------------------------------------------------------------------
  var SUP = [[-1, -12, 3], [6, -13.5, 4], [13, -11, 2]];
  var sups = SUP.map(function (q) {
    var g = rig(q[0], 0, q[1]);
    for (var i = 0; i < q[2]; i++) block(g, M.indigo, 3, 2, 3, 0, i * 2.05, 0);
    return seal(g);
  });
  var pick = flat(scene, 9, 9, SUP[1][0], 0.03, SUP[1][1], ringTex, 0);

  // --- three ways out: land, sea, air. Each leaves toward the right of the screen (+x or -z). ------
  function trail(w, len, x, z, angleY, opacity) {
    var m = new T.Mesh(new T.PlaneGeometry(1, w).translate(0.5, 0, 0).rotateX(-Math.PI / 2),
      new T.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: opacity, depthWrite: false }));
    m.position.set(x, 0.03, z); m.rotation.y = angleY; m.scale.x = 0.0001; m.userData.len = len; scene.add(m); return m;
  }
  // land: a truck in front of the pallet, heading +x along a road
  var TRK = new T.Vector3(PX - 4, 0, PZ + 10);
  var truck = rig(TRK.x, 0, TRK.z);
  flat(truck, 22, 11, 2, 0.02, 0, haloTex, 1);
  block(truck, M.steel, 9, 0.7, 4.6, -1, 1.3, 0);
  block(truck, M.indigo, 3.6, 4, 4.6, 5.3, 1.3, 0);
  block(truck, M.cyan, 0.12, 1.5, 3.6, 7.16, 3.4, 0);
  block(truck, M.cyan, 2.2, 1.3, 0.12, 5.4, 3.5, 2.36);
  seal(truck);
  wheel(truck, -3.8, 0.95, 2.4); wheel(truck, 0.4, 0.95, 2.4); wheel(truck, 5.3, 0.95, 2.4);
  var truckSlots = [new T.Vector3(-3.3, 2.0 + CH0(), 0), new T.Vector3(0.2, 2.0 + CH0(), 0)];
  var road = trail(2, 40, TRK.x + 7, TRK.z, 0, 0.42);

  // sea: a ship to the right of the pallet, heading -z along a waterway
  var SHP = new T.Vector3(PX + 14, 0, PZ + 2);
  var water = trail(9, 40, SHP.x, SHP.z + 8, Math.PI / 2, 0.3);        // a wide, pale channel under it
  var ship = rig(SHP.x, 0, SHP.z);
  block(ship, M.indigo, 5.2, 1.8, 13, 0, 0, 0);                          // hull
  block(ship, M.indigo, 3.6, 1.2, 1.8, 0, 0.6, -7.2);                    // bow
  block(ship, M.ice, 5.2, 0.3, 13, 0, 1.8, 0);                           // deck
  block(ship, M.ice, 4, 3.2, 3, 0, 2.1, 4.6);                            // bridge, at the stern
  block(ship, M.cyan, 3, 0.8, 0.12, 0, 3.9, 3.06);
  block(ship, M.steel, 1, 2.4, 1, 0, 5.3, 5);                            // funnel
  seal(ship);
  var shipSlots = [new T.Vector3(0, 2.1 + CH0(), -1.4), new T.Vector3(0, 2.1 + CH0(), -5)];

  // air: a plane behind the pallet, taking off toward +x and up
  var PLN = new T.Vector3(PX - 8, 0, PZ - 22);
  var plane = rig(PLN.x, 0, PLN.z);
  var planeHalo = flat(scene, 24, 18, PLN.x, 0.02, PLN.z, haloTex, 1);
  block(plane, M.ice, 13, 2.6, 2.8, 0, 0.6, 0);                          // fuselage
  block(plane, M.ice, 2.4, 1.6, 2.2, 7.6, 1.0, 0);                       // nose
  block(plane, M.cyan, 0.12, 0.8, 1.8, 8.86, 1.9, 0);                    // cockpit glass
  block(plane, M.indigo, 3.4, 0.35, 16, 0.6, 1.6, 0);                    // wings
  block(plane, M.indigo, 2, 0.3, 6.4, -5.8, 2.6, 0);                     // tailplane
  block(plane, M.indigo, 2.4, 3.2, 0.3, -5.8, 2.9, 0);                   // fin
  seal(plane);
  var planeSlots = [new T.Vector3(-2, 1.9, 0), new T.Vector3(1, 1.9, 0)];
  // a dashed flight path, drawn as short cyan dashes
  var flightPts = [];
  for (var d = 0; d < 14; d++) {
    var t0 = d / 14, t1 = t0 + 0.035;
    [t0, t1].forEach(function (t) { var q = flightAt(t); flightPts.push(q.x + PLN.x, q.y, q.z + PLN.z); });
  }
  var flightMat = fat ? new T.LineMaterial({ color: CYAN, linewidth: 2.4, transparent: true, opacity: 0 }) : new T.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0 });
  var flight;
  if (fat) { var fg = new T.LineSegmentsGeometry(); fg.setPositions(flightPts); flight = new T.LineSegments2(fg, flightMat); }
  else { var fb = new T.BufferGeometry(); fb.setAttribute('position', new T.Float32BufferAttribute(flightPts, 3)); flight = new T.LineSegments(fb, flightMat); }
  scene.add(flight);
  function flightAt(t) { return new T.Vector3(t * 22, Math.pow(t, 1.3) * 25, -t * 12); }   // climbs steeply, clear of the ship
  function CH0() { return 2.5 / 2; }

  // --- six lines on the sheet become six cartons ----------------------------------------------------
  var CW = 3.3, CH = 2.5, CD = 3.3;
  var cGeo = new T.BoxGeometry(CW, CH, CD), cEdge = edgesOf(cGeo, 0, 0, 0);
  var tGeo = new T.BoxGeometry(CW * 0.28, 0.06, CD + 0.02), tEdge = edgesOf(tGeo, 0, 0, 0);
  var cartons = [];
  var ways = [[truck, truckSlots], [truck, truckSlots], [ship, shipSlots], [ship, shipSlots], [plane, planeSlots], [plane, planeSlots]];
  for (var k = 0; k < 6; k++) {
    var m = mats(M.carton);
    var mesh = new T.Mesh(cGeo, m.list);
    mesh.add(lines(cEdge));
    var tape = new T.Mesh(tGeo, mats(M.cyan).list); tape.position.y = CH / 2 + 0.03; tape.add(lines(tEdge)); mesh.add(tape);
    scene.add(mesh);
    // on the sheet: a flat row (the line of the order)
    var a = new T.Vector3(SX + 0.8, 0.45 + 0.1, SZ - 5.6 + k * 2.75);
    var aScale = new T.Vector3(11.5 / CW, 0.2 / CH, 1.7 / CD);
    // on the pallet: 2 x 2, then 2 on top
    var layer = k < 4 ? 0 : 1, ix = k % 2, iz = k < 4 ? Math.floor(k / 2) : 0.5;
    var b = new T.Vector3(PX + (ix - 0.5) * (CW + 0.12), DECK + CH / 2 + layer * (CH + 0.04), PZ + (iz - 0.5) * (CD + 0.12));
    cartons.push({ mesh: mesh, a: a, aScale: aScale, b: b, lag: k * 0.035, way: ways[k][0], slot: ways[k][1][k % 2], lag2: (k % 2) * 0.02 + Math.floor(k / 2) * 0.02, air: k >= 4 });
  }

  // --- where it goes: Africa as a dot map (dm/dotmap.js, Natural Earth), with destination pins ------
  // Cities are illustrative stops, not a list of Axmed deliveries.
  // The map lies on the ground but is turned so north is straight up on screen, and stretched along
  // the view axis by 1/sin(35.26deg) so the iso camera's foreshortening cancels: it reads as a printed map.
  var MAP = window.AX_DOTMAP, MX = PX + 52, MZ = PZ - 26, U = 0.9, MC = 41, MR = 34.5;   // centre cell of Africa
  var FORE = 1 / Math.sqrt(1 / 3), EAST = new T.Vector3(1, 0, -1).normalize(), SOUTH = new T.Vector3(1, 0, 1).normalize();
  var tiles = null, tileBase = [], pins = [], mapRoutes = null, mapRouteMat = null;
  function cellOf(lon, lat) { return { c: (lon - MAP.lon0) / MAP.step, r: (MAP.lat1 - lat) / MAP.step }; }
  function worldOf(c, r) {   // east is screen-right, south is screen-down
    return new T.Vector3(MX, 0, MZ).addScaledVector(EAST, (c - MC) * U).addScaledVector(SOUTH, (r - MR) * U * FORE);
  }
  if (MAP) {
    var cells = [];
    MAP.rows.forEach(function (row, r) { for (var c = 0; c < row.length; c++) if (row[c] === 'a') cells.push([c, r]); });
    // one low box per cell, square on screen, top lit and sides shaded like the scene, no outlines
    var tg = new T.BoxGeometry(U * 0.66, 0.3, U * 0.66 * FORE), cols = [], fc = [new T.Color(M.wood.right), new T.Color(M.wood.right), new T.Color(M.wood.top), new T.Color(M.wood.right), new T.Color(M.wood.left), new T.Color(M.wood.right)];
    for (var f = 0; f < 6; f++) for (var q = 0; q < 4; q++) cols.push(fc[f].r, fc[f].g, fc[f].b);
    tg.setAttribute('color', new T.Float32BufferAttribute(cols, 3));
    tiles = new T.InstancedMesh(tg, new T.MeshBasicMaterial({ vertexColors: true }), cells.length);
    tiles.instanceMatrix.setUsage(T.DynamicDrawUsage);
    cells.forEach(function (cr) { var w0 = worldOf(cr[0], cr[1]); tileBase.push({ p: w0, d: Math.hypot(cr[0] - MC, cr[1] - MR) }); });
    scene.add(tiles);
    var CITIES = [[-17.4, 14.7], [3.4, 6.5], [15.3, -4.3], [32.6, 0.3], [38.7, 9.0], [28.0, -26.2], [39.3, -6.8]];
    var routePts = [], hub = worldOf(cellOf(30, 2).c, cellOf(30, 2).r);
    CITIES.forEach(function (ll, i) {
      var cc = cellOf(ll[0], ll[1]), at = worldOf(cc.c, cc.r);
      var g = rig(at.x, 0, at.z);
      block(g, M.indigo, 0.9, 4.2, 0.9, 0, 0.5, 0);
      block(g, M.cyan, 1.7, 1.2, 1.7, 0, 4.7, 0);
      seal(g);
      var ring = flat(scene, 5, 5, at.x, 0.36, at.z, ringTex, 0);
      pins.push({ g: g, ring: ring, d: i / CITIES.length });
      // a dashed arc from the middle of the map to each stop
      var prev = null;
      for (var sgm = 0; sgm <= 24; sgm++) {
        var t = sgm / 24, pt = hub.clone().lerp(at, t); pt.y = 0.6 + Math.sin(Math.PI * t) * (3 + at.distanceTo(hub) * 0.12);
        if (prev && sgm % 2) routePts.push(prev.x, prev.y, prev.z, pt.x, pt.y, pt.z);
        prev = pt;
      }
    });
    mapRouteMat = fat ? new T.LineMaterial({ color: CYAN, linewidth: 2, transparent: true, opacity: 0 }) : new T.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0 });
    if (fat) { var rg = new T.LineSegmentsGeometry(); rg.setPositions(routePts); mapRoutes = new T.LineSegments2(rg, mapRouteMat); }
    else { var rb = new T.BufferGeometry(); rb.setAttribute('position', new T.Float32BufferAttribute(routePts, 3)); mapRoutes = new T.LineSegments(rb, mapRouteMat); }
    scene.add(mapRoutes);
  }
  var dummy = new T.Object3D();
  function drawMap(rise) {
    if (!tiles) return;
    tileBase.forEach(function (b, i) {
      var r = ease((rise * 1.6) - b.d / 60);                                // rises from the middle outwards
      dummy.position.set(b.p.x, 0.15 * r - 0.15 * (1 - r), b.p.z);
      dummy.rotation.set(0, Math.PI / 4, 0);                                // box x along EAST, z along SOUTH
      dummy.scale.set(1, Math.max(0.001, r), 1);
      dummy.updateMatrix(); tiles.setMatrixAt(i, dummy.matrix);
    });
    tiles.instanceMatrix.needsUpdate = true;
    tiles.visible = rise > 0.001;
  }

  // --- layout ------------------------------------------------------------------------------------
  var W = 0, H = 0, small = false;
  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.setSize(W, H, false);
    if (fat) { lineMat.resolution.set(W, H); flightMat.resolution.set(W, H); if (mapRouteMat) mapRouteMat.resolution.set(W, H); }
    small = W < 760;
    frame();
  }
  var target = new T.Vector3();
  function frameCamera(span, toMap) {
    var m = toMap || 0, cx = small ? 0.5 : 0.72 + m * 0.04, cy = small ? 0.3 - m * 0.02 : 0.52 + m * 0.02;
    var w = span, h = w * H / W;
    camera.left = -cx * w; camera.right = (1 - cx) * w; camera.top = cy * h; camera.bottom = -(1 - cy) * h;
    camera.position.copy(ISO).multiplyScalar(200).add(target);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }

  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function ease(x) { x = clamp01(x); return x * x * (3 - 2 * x); }
  var prog = 0, shown = -1, v = new T.Vector3(), w3 = new T.Vector3(), sc = new T.Vector3(), one = new T.Vector3(1, 1, 1);
  var T1 = new T.Vector3(SX + 2, 0, SZ), T2 = new T.Vector3(PX - 1, 2, PZ - 2), T3 = new T.Vector3(PX + 10, 8, PZ - 10), T4 = new T.Vector3(MX, 2, MZ);

  function frame() {
    if (!W) return;
    var p = prog;
    var s2 = ease((p - 0.14) / 0.3), go = ease((p - 0.7) / 0.16);

    // camera: the sheet, then the pallet, then pull back to see all three ways out
    var toMap = ease((p - 0.8) / 0.18);
    target.copy(T1).lerp(T2, s2).lerp(T3, ease((p - 0.58) / 0.22)).lerp(T4, toMap);
    var span = (small ? 48 : 64) + ease((p - 0.6) / 0.2) * (small ? 44 : 46);
    frameCamera(span + toMap * ((small ? 66 : 118) - span), toMap);   // end on the whole map, sized to fit

    // the map rises, then the stops drop in and the routes to them light
    drawMap(ease((p - 0.78) / 0.16));
    pins.forEach(function (pn) {
      var d = ease((p - 0.88 - pn.d * 0.08) / 0.06);
      pn.g.position.y = (1 - d) * 8; pn.g.visible = d > 0.001; pn.ring.material.opacity = d;
    });
    if (mapRouteMat) mapRouteMat.opacity = ease((p - 0.9) / 0.08) * 0.9;

    // the sheet folds away once its lines have left
    var fold = ease((p - 0.34) / 0.12);
    sheet.scale.set(1 - fold * 0.999, 1, 1 - fold * 0.999);
    sheet.visible = fold < 0.995;

    sups.forEach(function (g, i) { var r = ease((p - 0.24 - i * 0.04) / 0.14) * (1 - ease((p - 0.5) / 0.08)); g.scale.set(1, Math.max(0.001, r), 1); g.visible = r > 0.01; });
    pick.material.opacity = ease((p - 0.4) / 0.08) * (1 - ease((p - 0.5) / 0.06));

    // the three vehicles rise into place, then leave together
    // ...and sink away as the camera reaches the map, so nothing sits under the headline at the end
    var away = 1 - ease((p - 0.8) / 0.1), rise = ease((p - 0.54) / 0.1) * away;
    [truck, ship, plane, load].forEach(function (g, i) { var r = i < 3 ? rise : away; g.scale.set(1, Math.max(0.001, r), 1); g.visible = r > 0.001; });
    truck.position.x = TRK.x + go * 28;
    ship.position.z = SHP.z - go * 24;
    var f = flightAt(ease((p - 0.7) / 0.16));
    plane.position.set(PLN.x + f.x, f.y, PLN.z + f.z);
    plane.rotation.z = Math.min(0.22, f.y * 0.05);
    planeHalo.material.opacity = rise * (1 - ease((p - 0.7) / 0.06));
    road.scale.x = Math.max(0.0001, road.userData.len * ease((p - 0.66) / 0.12) * away);
    water.scale.x = Math.max(0.0001, water.userData.len * ease((p - 0.56) / 0.1) * away);
    flightMat.opacity = ease((p - 0.68) / 0.08) * 0.9 * away;

    cartons.forEach(function (c) {
      var t = ease((p - 0.16 - c.lag) / 0.2), t2 = ease((p - 0.64 - c.lag2) / 0.1);
      v.copy(c.a).lerp(c.b, t);
      v.y += Math.sin(Math.PI * t) * 5;                                    // lifts off the sheet
      c.way.updateMatrixWorld();
      w3.copy(c.slot).applyMatrix4(c.way.matrixWorld);                     // its place on the vehicle, as it moves
      v.lerp(w3, t2);
      v.y += Math.sin(Math.PI * t2) * 3;
      c.mesh.position.copy(v);
      sc.copy(c.aScale).lerp(one, ease((p - 0.16 - c.lag) / 0.1));
      if (c.air) sc.multiplyScalar(1 - t2 * 0.999);                        // loaded into the hold
      sc.multiplyScalar(Math.max(0.001, away));                            // leaves with its vehicle
      c.mesh.scale.copy(sc);
      c.mesh.visible = sc.y > 0.002;
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
  var held = null;
  function loop() { raf = 0; prog = held == null ? progress() : held; frame(); }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', resize);
  window.h3dAt = function (x) { held = x; prog = x == null ? progress() : x; frame(); };   // h3dAt(null) lets scroll drive again
  resize();
  kick();
  function ready() { document.documentElement.classList.add('ready'); }
  requestAnimationFrame(function () { requestAnimationFrame(ready); });
  setTimeout(ready, 600);
})();
