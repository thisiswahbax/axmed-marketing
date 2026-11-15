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
  var current = null;
  function show(t) {
    var from = current ? ([].indexOf.call(tabs, t) > [].indexOf.call(tabs, current) ? 1 : -1) : 0;
    tabs.forEach(function (x) {
      var on = x === t, panel = document.getElementById(x.getAttribute('aria-controls'));
      x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; panel.hidden = !on;
      if (on && from && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        panel.style.setProperty('--from', from); panel.classList.add('enter');
        panel.getBoundingClientRect(); panel.classList.remove('enter');   // arrive from the side of the tab you pressed
      }
    });
    current = t;
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
    for (var i = 0; i < 100; i++) html += '<i class="' + (i < n ? 'lit' : '') + '" style="--d:' + Math.round(1100 * Math.sqrt(i / 100)) + 'ms"></i>';
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

/* how it works: steps follow scroll while the section is pinned (wide screens); click or hover also picks a step */
(function () {
  var sec = document.querySelector('.hw'); if (!sec) return;
  function panelOn() { return sec.querySelector('.panel:not([hidden])') || sec.querySelector('.panel'); }
  function set(panel, k) {
    panel.querySelectorAll('.hw-item').forEach(function (b) { var on = +b.dataset.k === k; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    panel.querySelectorAll('.hw-art .art').forEach(function (a) { a.classList.toggle('on', +a.dataset.k === k); });
  }
  var hold = 0;
  sec.querySelectorAll('.hw-item').forEach(function (b) {
    b.addEventListener('click', function () { hold = performance.now(); set(b.closest('.panel'), +b.dataset.k); });
  });
  var wide = matchMedia('(min-width: 961px)'), still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still) return;
  function arm() { document.documentElement.classList.toggle('hw-on', wide.matches); }
  arm(); wide.addEventListener ? wide.addEventListener('change', arm) : wide.addListener(arm);
  var raf = 0, last = -1;
  function frame() {
    raf = 0; if (!wide.matches || performance.now() - hold < 1500) return;
    var r = sec.getBoundingClientRect(), run = r.height - innerHeight; if (run <= 0) return;
    var p = Math.min(1, Math.max(0, -r.top / run)), k = Math.min(3, Math.floor(p * 4));
    if (k !== last) { last = k; set(panelOn(), k); }
  }
  addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(frame); }, { passive: true });
  sec.querySelectorAll('[role=tab]').forEach(function (t) { t.addEventListener('click', function () { last = -1; frame(); }); });
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
