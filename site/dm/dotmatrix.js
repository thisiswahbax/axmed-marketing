// Axmed dot-matrix engine: draws a shape as pixel dots on a construction grid, with motion.
// Usage: AxDotMatrix(canvas, { shape: "shield", theme: "night", motion: true, seed: 3 })
// Motion: dots assemble, then a soft scan passes and a few dots glint. prefers-reduced-motion = a still frame.
(function () {
  const THEMES = {
    night: { bg: "#14113A", grid: "rgba(201,196,236,.10)", mark: "rgba(201,196,236,.35)", dot: [118, 112, 168], hi: [12, 196, 255], soft: [159, 230, 255] },
    paper: { bg: "#F7F6F3", grid: "rgba(38,28,122,.08)", mark: "rgba(38,28,122,.30)", dot: [120, 114, 170], hi: [12, 160, 214], soft: [38, 28, 122] },
    indigo: { bg: "#261C7A", grid: "rgba(244,242,253,.10)", mark: "rgba(244,242,253,.35)", dot: [150, 142, 210], hi: [12, 196, 255], soft: [200, 240, 255] },
  };
  function rnd(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
  function mask(W, H, shape, kind, stroke) {
    const c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
    const [bx, by, bw, bh] = shape.box || [0, 0, 100, 100]; const s = Math.min(W, H) * 0.78 / Math.max(bw, bh);
    x.translate(W / 2, H / 2); x.scale(s, s); x.translate(-(bx + bw / 2), -(by + bh / 2));
    x.lineJoin = x.lineCap = "round"; x.fillStyle = x.strokeStyle = "#fff";
    const list = shape[kind] || (kind === "edge" ? shape.fill : []);
    for (const d of list) {
      const p = new Path2D(d);
      if (kind === "fill") x.fill(p);
      else { x.lineWidth = (stroke || 3.2) * (shape.box ? bw / 100 : 1); x.stroke(p); if (kind === "accent" && !shape.accentStroke) x.fill(p); }
    }
    if (kind === "edge" && shape.lines) { x.lineWidth = 3; for (const d of shape.lines) x.stroke(new Path2D(d)); }
    return x.getImageData(0, 0, W, H).data;
  }
  window.AxDotMatrix = function (canvas, opt = {}) {
    const shape = window.AX_SHAPES[opt.shape || "shield"], th = THEMES[opt.theme || "night"], R = rnd(opt.seed || 7);
    const W = canvas.width, H = canvas.height, g = Math.round(Math.min(W, H) / (opt.cells || 64));
    const F = mask(W, H, shape, "fill"), E = mask(W, H, shape, "edge"), A = mask(W, H, shape, "accent", shape.accentStroke);
    const dots = [];
    for (let y = g / 2; y < H; y += g) for (let x = g / 2; x < W; x += g) {
      const i = (Math.floor(y) * W + Math.floor(x)) * 4, f = F[i + 3] > 128, e = E[i + 3] > 128, a = A[i + 3] > 128, r = R();
      if (a && r > .06) dots.push({ x, y, kind: r > .45 ? 2 : 1, size: r > .45 ? .78 : .6, r });
      else if (e && r > .12) dots.push({ x, y, kind: 1, size: .62 + R() * .2, r });
      else if (f && r > .58) dots.push({ x, y, kind: 0, size: .32 + R() * .26, r });
      else if (!f && r > .997) dots.push({ x, y, kind: 0, size: .25, r, stray: true });
    }
    dots.forEach(d => { const a = R() * 6.283, k = (0.4 + R()) * W * .35; d.sx = d.x + Math.cos(a) * k; d.sy = d.y + Math.sin(a) * k; d.delay = R() * .9; });
    const ctx = canvas.getContext("2d");
    const still = opt.motion === false || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = t => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
    function grid() {
      ctx.fillStyle = th.bg; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = th.grid; ctx.lineWidth = 1; const step = g * 8;
      for (let x = step / 2; x < W; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = step / 2; y < H; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.strokeStyle = th.mark; ctx.lineWidth = 1.5;
      for (const [x, y] of [[step * 1.5, step * 1.5], [W - step * 1.5, step * 1.5], [step * 1.5, H - step * 1.5], [W - step * 1.5, H - step * 1.5]]) {
        ctx.beginPath(); ctx.moveTo(x - 7, y); ctx.lineTo(x + 7, y); ctx.moveTo(x, y - 7); ctx.lineTo(x, y + 7); ctx.stroke();
      }
    }
    function frame(t) {
      grid();
      const scan = ((t - 2.2) % 4.2) / 4.2;                       // a soft diagonal scan after assembly
      for (const d of dots) {
        const k = still ? 1 : ease((t - d.delay) / 1.4), x = d.sx + (d.x - d.sx) * k, y = d.sy + (d.y - d.sy) * k;
        let c = d.kind === 2 ? th.hi : th.dot, al = d.kind === 0 ? .55 : d.kind === 1 ? .85 : 1;
        if (!still && t > 2.2) {
          const band = Math.abs((d.x + d.y) / (W + H) - scan); if (band < .035 && d.kind !== 0) { c = th.soft; al = 1; }
          if (d.kind === 2) al = .75 + .25 * Math.sin(t * 3 + d.r * 20);
        }
        if (d.stray) al *= .5;
        const s = g * d.size; ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${al * Math.max(k, .05)})`;
        ctx.fillRect(Math.round(x - s / 2), Math.round(y - s / 2), Math.round(s), Math.round(s));
      }
    }
    let t0 = null, raf = 0;
    if (still) { frame(10); return { drawAt: frame, stop() {} }; }
    const loop = now => { t0 ??= now; frame((now - t0) / 1000); raf = requestAnimationFrame(loop); };
    if (!opt.manual) raf = requestAnimationFrame(loop);
    return { drawAt: frame, stop() { cancelAnimationFrame(raf); } };
  };
})();
