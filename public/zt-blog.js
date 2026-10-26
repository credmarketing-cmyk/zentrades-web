// Behaviour for the blog article layout (lib/blog.ts): reading progress,
// table of contents that follows the reader, smooth scrolling.
(function () {
  function init(root) {
    var article = root.querySelector('article');
    var sections = Array.prototype.slice.call(root.querySelectorAll('.prose > section[data-sec]'));
    var items = Array.prototype.slice.call(root.querySelectorAll('.toc-item'));
    var top = root.querySelector('.progress-top span');
    var mini = root.querySelector('.mini span');
    var pct = root.querySelector('.pct');
    var subs = Array.prototype.slice.call(root.querySelectorAll('.toc-subs a'));
    var ticking = false;

    function update() {
      ticking = false;
      if (!article) return;
      var rect = article.getBoundingClientRect();
      var total = rect.height - window.innerHeight * 0.6;
      var p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : rect.top < 0 ? 1 : 0;
      var w = Math.round(p * 100) + '%';
      if (top) top.style.width = w;
      if (mini) mini.style.width = w;
      if (pct) pct.textContent = Math.round(p * 100) + '%';

      var line = 140;
      var active = -1;
      sections.forEach(function (s, i) {
        if (s.getBoundingClientRect().top <= line) active = i;
      });
      items.forEach(function (it, i) {
        it.classList.toggle('active', i === active);
        it.classList.toggle('done', i < active || (i === active && p >= 0.999));
      });
      var current = null;
      subs.forEach(function (a) {
        var target = document.getElementById(a.getAttribute('href').slice(1));
        if (target && target.getBoundingClientRect().top <= line) current = a;
      });
      subs.forEach(function (a) {
        a.classList.toggle('on', a === current);
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    root.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var target = document.getElementById(a.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.replaceState(null, '', a.getAttribute('href'));
    });
  }

  function start() {
    document.querySelectorAll('[data-zt-blog]').forEach(function (root) {
      if (root.dataset.ready) return;
      root.dataset.ready = '1';
      init(root);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
