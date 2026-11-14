/* Hallmark · site behaviour: dot-matrix steps start when seen; partner rail buttons. */
(function () {
  if (window.AxDotMatrix) {
    var cs = document.querySelectorAll('canvas.dm');
    var start = function (c) { if (c.dataset.on) return; c.dataset.on = '1'; AxDotMatrix(c, { shape: c.dataset.shape, theme: 'paper', seed: 5 }); };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { start(e.target); io.unobserve(e.target); } }); }, { threshold: 0.3 });
      cs.forEach(function (c) { io.observe(c); });
    } else cs.forEach(start);
  }
  var rail = document.querySelector('.rail');
  document.querySelectorAll('.railnav button').forEach(function (b) {
    b.addEventListener('click', function () {
      var card = rail.querySelector('.card');
      rail.scrollBy({ left: Number(b.dataset.dir) * (card.offsetWidth + 32), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  });
})();
