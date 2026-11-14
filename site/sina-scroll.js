/* Hallmark · Sina scroll scene: an orbit of the formats buyers send, turning as you scroll.
   Each stage lights one format and floats one card out. Reduced motion: a still layout with all cards. */
(function () {
  var root = document.querySelector('.sx');
  if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('sx-on');
  var stage = root.querySelector('.sx-stage'), nodes = root.querySelectorAll('.sx-node'), cards = root.querySelectorAll('.sx-card');
  var LIT = [0, 1, 5, -1];                // which format each card belongs to
  var shown = -1, raf = 0;
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function frame() {
    raf = 0;
    var r = root.getBoundingClientRect(), run = r.height - innerHeight;
    var p = run > 0 ? clamp(-r.top / run) : 0;
    var R = stage.offsetWidth / 2, rot = -90 - p * 240;
    nodes.forEach(function (n, i) {
      var a = (rot + i * 60) * Math.PI / 180;
      n.style.transform = 'translate(' + (Math.cos(a) * R).toFixed(1) + 'px,' + (Math.sin(a) * R).toFixed(1) + 'px) translate(-50%,-50%)';
    });
    stage.style.setProperty('--spin', (p * 240) + 'deg');
    var s = p < 0.08 ? -1 : Math.min(3, Math.floor((p - 0.08) / 0.23));
    if (s !== shown) {
      shown = s;
      cards.forEach(function (c, k) { c.classList.toggle('on', k === s); });
      nodes.forEach(function (n, i) { n.classList.toggle('on', s >= 0 && LIT[s] === i); });
      root.classList.toggle('done', s === 3);
    }
  }
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', kick);
  window.sxAt = function (v) { var r = root.getBoundingClientRect(); scrollTo(0, scrollY + r.top + (r.height - innerHeight) * v); frame(); };
  frame();
})();
