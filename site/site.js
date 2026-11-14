/* Hallmark · site behaviour: dot-matrix steps start when seen; partner rail buttons. */
(function () {
  if (window.AxDotMatrix) {
    var cs = document.querySelectorAll('canvas.dm');
    var start = function (c) { if (c.dataset.on) return; c.dataset.on = '1'; var icon = c.classList.contains('icon'); AxDotMatrix(c, { shape: c.dataset.shape, theme: 'paper', seed: 5, icon: icon, cells: icon ? 16 : 64 }); };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { start(e.target); io.unobserve(e.target); } }); }, { threshold: 0.3 });
      cs.forEach(function (c) { io.observe(c); });
    } else cs.forEach(start);
  }
  // buyers / suppliers tabs
  var tabs = document.querySelectorAll('[role=tab]');
  function show(t) {
    tabs.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; document.getElementById(x.getAttribute('aria-controls')).hidden = !on; });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(t); });
    t.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; show(n); n.focus(); } });
  });
  if (tabs.length) show(location.hash === '#suppliers' ? tabs[1] : tabs[0]);
  window.addEventListener('hashchange', function () { if (location.hash === '#suppliers') show(tabs[1]); if (location.hash === '#buyers') show(tabs[0]); });

  var rail = document.querySelector('.rail');
  document.querySelectorAll('.railnav button').forEach(function (b) {
    b.addEventListener('click', function () {
      var card = rail.querySelector('.card');
      rail.scrollBy({ left: Number(b.dataset.dir) * (card.offsetWidth + 32), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  });
})();

/* "Where you are born": 100 dots per figure, lit as the section arrives; numbers count up; photo eases in on scroll */
(function () {
  var sec = document.querySelector('.split'); if (!sec) return;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  sec.querySelectorAll('.dotfig').forEach(function (f) {
    var n = +f.dataset.n, box = f.querySelector('.dots'), html = '';
    for (var i = 0; i < 100; i++) html += '<i class="' + (i < n ? 'lit' : '') + '" style="--d:' + (i * 14) + 'ms"></i>';
    box.innerHTML = html;
  });
  function count(el) {
    var to = +el.dataset.to, t0 = performance.now();
    (function tick(now) { var k = Math.min(1, (now - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); })(t0);
  }
  if (still || !('IntersectionObserver' in window)) { sec.classList.add('in'); return; }
  sec.classList.add('arm');
  sec.querySelectorAll('[data-to]').forEach(function (el) { el.textContent = '0'; });
  new IntersectionObserver(function (es, io) {
    if (es[0].isIntersecting) { sec.classList.add('in'); sec.querySelectorAll('[data-to]').forEach(count); io.disconnect(); }
  }, { threshold: 0.35 }).observe(sec);
  var img = sec.querySelector('.shot img'), raf = 0;
  function zoom() { raf = 0; var r = sec.getBoundingClientRect(), k = Math.min(1, Math.max(0, 1 - (r.top + r.height) / (innerHeight + r.height))); img.style.transform = 'scale(' + (1.14 - k * 0.14).toFixed(3) + ')'; }
  addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(zoom); }, { passive: true });
  zoom();
})();
