/* Hallmark · Axmed scroll hero. A dot-matrix globe on a light mist field.
   Stage 1: facilities across the globe (indigo dots).
   Stage 2: supplier routes draw in to one hub, where Sina sits.
   Stage 3: cyan routes draw out and facilities light up.
   Scroll drives everything; nothing loops except a slow drift in stage 1.
   Illustrative: dot positions are not real facility locations. */
(function () {
  var root = document.querySelector('.h3d');
  if (!root) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = root.querySelector('canvas');
  var hubEl = root.querySelector('.hub');
  var steps = root.querySelectorAll('.scene');
  var bar = root.querySelector('.bar i');

  var ok = !!window.THREE && (function () {
    try { var c = document.createElement('canvas'); return !!(c.getContext('webgl') || c.getContext('experimental-webgl')); } catch (e) { return false; }
  })();
  if (!ok) return; // CSS keeps the poster and the first step
  document.documentElement.classList.add('h3d-on');
  if (reduce) root.classList.add('still');

  var T = THREE;
  var css = getComputedStyle(document.documentElement);
  function tok(n, f) { var v = css.getPropertyValue(n).trim(); return new T.Color(v || f); }
  var C = { indigo: tok('--indigo', '#261C7A'), app: tok('--indigo-app', '#392AB0'), cyan: tok('--cyan', '#0CC4FF'), soft: tok('--on-indigo-soft', '#C9C4EC') };

  var renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  var scene = new T.Scene();
  var camera = new T.PerspectiveCamera(32, 1, 0.1, 50);
  var globe = new T.Group();
  scene.add(globe);

  var small = window.innerWidth < 760;
  var N = small ? 1500 : 2600;
  var HUB = new T.Vector3(0, 0.22, 1).normalize(); // local; rotation brings it to the front

  // fibonacci sphere, the same grid logic as brand/dot-matrix
  var pos = new Float32Array(N * 3), size = new Float32Array(N), kind = new Float32Array(N), seed = new Float32Array(N);
  var pts = [];
  var ga = Math.PI * (3 - Math.sqrt(5));
  for (var i = 0; i < N; i++) {
    var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = ga * i;
    var v = new T.Vector3(Math.cos(th) * r, y, Math.sin(th) * r);
    pts.push(v);
    pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z;
    var h = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
    seed[i] = h;
    size[i] = 0.55 + h * 0.5;
  }

  // pick facilities (light cyan in stage 3) and suppliers (route origins)
  function rand(a) { return Math.abs(Math.sin(a * 78.233) * 43758.5453) % 1; }
  var fac = [], sup = [];
  for (i = 0; i < N; i++) {
    var p = pts[i], d = p.dot(HUB);
    if (d > 0.4 && d < 0.95 && rand(i) > (small ? 0.93 : 0.955)) fac.push(i);
    if (d < 0.3 && d > -0.2 && rand(i + 7) > 0.982) sup.push(i);
  }
  fac.forEach(function (k, j) { kind[k] = 2; size[k] = 1.25; seed[k] = j / fac.length; });
  sup.forEach(function (k) { kind[k] = 1; size[k] = 1.5; });

  var g = new T.BufferGeometry();
  g.setAttribute('position', new T.BufferAttribute(pos, 3));
  g.setAttribute('size', new T.BufferAttribute(size, 1));
  g.setAttribute('kind', new T.BufferAttribute(kind, 1));
  g.setAttribute('seed', new T.BufferAttribute(seed, 1));
  var dotMat = new T.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uPx: { value: 1 }, uLit: { value: 0 }, uSup: { value: 0 }, uA: { value: C.indigo }, uB: { value: C.app }, uC: { value: C.cyan } },
    vertexShader: [
      'attribute float size; attribute float kind; attribute float seed;',
      'uniform float uPx; uniform float uLit; uniform float uSup;',
      'varying vec3 vCol; varying float vA; varying float vLit;',
      'uniform vec3 uA; uniform vec3 uB; uniform vec3 uC;',
      'void main(){',
      ' vec4 mv = modelViewMatrix * vec4(position,1.);',
      ' vec3 n = normalize(normalMatrix * position);',
      ' float face = smoothstep(-.35, .55, n.z);',
      ' float lit = kind > 1.5 ? smoothstep(seed*.8, seed*.8+.2, uLit) : 0.;',
      ' float s = kind > .5 && kind < 1.5 ? uSup : 0.;',
      ' vCol = mix(mix(uA, uB, s), uC, lit); vLit = lit;',
      ' vA = mix(.10, .62, face) + lit*.35*face + s*.3;',
      ' gl_PointSize = size * uPx * (1. + lit*.9 + s*.6) * (5.2 / -mv.z);',
      ' gl_Position = projectionMatrix * mv; }'
    ].join('\n'),
    fragmentShader: [
      'varying vec3 vCol; varying float vA; varying float vLit;',
      'void main(){ vec2 c = gl_PointCoord-.5; float d = length(c);',
      ' float a = smoothstep(.5,.38,d);',
      ' float ring = vLit * smoothstep(.5,.46,d) * (1.-smoothstep(.36,.3,d)) * .0;',
      ' if(a < .01) discard; gl_FragColor = vec4(vCol, (a+ring)*vA); }'
    ].join('\n')
  });
  globe.add(new T.Points(g, dotMat));

  // arcs: lifted great circles, merged into one geometry per direction
  function arcs(pairs, lift) {
    var SEG = 48, P = [], A = [], D = [];
    pairs.forEach(function (pr, j) {
      var a = pr[0], b = pr[1], ang = a.angleTo(b);
      var prev = null;
      for (var s = 0; s <= SEG; s++) {
        var t = s / SEG;
        var q = new T.Vector3().copy(a).lerp(b, t).normalize(); // close enough to slerp at these angles
        q.multiplyScalar(1.004 + Math.sin(Math.PI * t) * lift * (0.35 + ang * 0.5));
        if (prev) { P.push(prev.x, prev.y, prev.z, q.x, q.y, q.z); A.push((s - 1) / SEG, t); D.push(pr[2], pr[2]); }
        prev = q;
      }
    });
    var ge = new T.BufferGeometry();
    ge.setAttribute('position', new T.Float32BufferAttribute(P, 3));
    ge.setAttribute('prog', new T.Float32BufferAttribute(A, 1));
    ge.setAttribute('delay', new T.Float32BufferAttribute(D, 1));
    return ge;
  }
  function lineMat(col, alpha) {
    return new T.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uDraw: { value: 0 }, uCol: { value: col }, uAlpha: { value: alpha } },
      vertexShader: 'attribute float prog; attribute float delay; varying float vP; varying float vD; varying float vZ;\n' +
        'void main(){ vP = prog; vD = delay; vec4 mv = modelViewMatrix*vec4(position,1.); vZ = normalize(normalMatrix*position).z; gl_Position = projectionMatrix*mv; }',
      fragmentShader: 'uniform float uDraw; uniform vec3 uCol; uniform float uAlpha; varying float vP; varying float vD; varying float vZ;\n' +
        'void main(){ float local = clamp((uDraw - vD*.55)/.45, 0., 1.); if(vP > local) discard;\n' +
        ' float head = smoothstep(local-.18, local, vP) * step(local, .999);\n' +
        ' float face = smoothstep(-.4,.4,vZ);\n' +
        ' gl_FragColor = vec4(uCol, (uAlpha + head*.5) * mix(.15,1.,face)); }'
    });
  }
  var hubV = HUB.clone();
  var inPairs = sup.map(function (k, j) { return [pts[k], hubV, j / Math.max(1, sup.length - 1)]; });
  var outPairs = fac.map(function (k, j) { return [hubV, pts[k], seed[k]]; });
  var inMat = lineMat(C.app, 0.55), outMat = lineMat(C.cyan, 0.75);
  globe.add(new T.LineSegments(arcs(inPairs, 0.2), inMat));
  globe.add(new T.LineSegments(arcs(outPairs, 0.16), outMat));

  // thin latitude rings, a quiet nod to the strata lines
  var ringMat = new T.LineBasicMaterial({ color: C.app, transparent: true, opacity: 0.09 });
  [-0.6, -0.3, 0, 0.3, 0.6].forEach(function (yy) {
    var rr = Math.sqrt(1 - yy * yy) * 1.001, rp = [];
    for (var s = 0; s <= 128; s++) { var a = s / 128 * Math.PI * 2; rp.push(new T.Vector3(Math.cos(a) * rr, yy, Math.sin(a) * rr)); }
    globe.add(new T.Line(new T.BufferGeometry().setFromPoints(rp), ringMat));
  });

  // layout
  var W = 0, H = 0;
  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr); renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    small = W < 760;
    dotMat.uniforms.uPx.value = dpr * (small ? 2.6 : 3.2);
    frame();
  }

  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function ease(x) { x = clamp01(x); return x * x * (3 - 2 * x); }
  var prog = 0, shown = -1, t0 = performance.now();

  function progress() {
    if (reduce) return 1;
    var r = root.getBoundingClientRect();
    var run = r.height - window.innerHeight;
    return run > 0 ? clamp01(-r.top / run) : 0;
  }

  var hubW = new T.Vector3();
  function frame() {
    var p = prog;
    var t = (performance.now() - t0) / 1000;
    var drift = reduce ? 0 : (1 - ease(p / 0.3)) * t * 0.05;
    globe.rotation.y = -1.25 + ease(p / 0.7) * 1.25 + drift;
    globe.rotation.x = 0.28 - ease(p / 0.7) * 0.12;
    var gx = small ? 0 : 0.95 - ease((p - 0.1) / 0.6) * 0.15;
    var gy = small ? 0.85 : 0;
    globe.position.set(gx, gy, 0);
    camera.position.set(0, 0, (small ? 9.2 : 5.1) - ease(p / 0.8) * (small ? 1.0 : 0.6));
    camera.lookAt(0, small ? -0.2 : 0, 0);

    var sIn = ease((p - 0.22) / 0.3), sOut = ease((p - 0.55) / 0.38);
    inMat.uniforms.uDraw.value = sIn;
    dotMat.uniforms.uSup.value = sIn;
    outMat.uniforms.uDraw.value = sOut;
    dotMat.uniforms.uLit.value = sOut;
    renderer.render(scene, camera);

    // Sina sits on the hub
    globe.updateMatrixWorld();
    hubW.copy(HUB).multiplyScalar(1.02).applyMatrix4(globe.matrixWorld).project(camera);
    var hx = (hubW.x * 0.5 + 0.5) * W, hy = (-hubW.y * 0.5 + 0.5) * H;
    hubEl.style.transform = 'translate(' + hx.toFixed(1) + 'px,' + hy.toFixed(1) + 'px) translate(-50%,-50%) scale(' + (0.6 + ease((p - 0.2) / 0.3) * 0.4).toFixed(3) + ')';
    hubEl.style.opacity = ease((p - 0.2) / 0.2).toFixed(3);

    var s = reduce ? 0 : p < 0.3 ? 0 : p < 0.62 ? 1 : 2;
    if (s !== shown) {
      steps.forEach(function (el, k) { el.classList.toggle('on', k === s); el.setAttribute('aria-hidden', k === s ? 'false' : 'true'); });
      shown = s;
    }
    if (bar) bar.style.transform = 'scaleX(' + p.toFixed(3) + ')';
  }

  var raf = 0, visible = true;
  function loop() {
    raf = 0;
    prog = progress();
    frame();
    if (!reduce && visible && prog < 0.3) raf = requestAnimationFrame(loop); // drift only while stage 1 is up
  }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', resize);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) kick(); }).observe(root);
  }
  // test hook: window.h3dAt(0..1) renders a given scroll position
  window.h3dAt = function (v) { prog = v; frame(); };
  resize();
  kick();
  // let the first frame paint, then play the opening scene (lead first, support follows)
  requestAnimationFrame(function () { requestAnimationFrame(function () { document.documentElement.classList.add('ready'); }); });
})();
