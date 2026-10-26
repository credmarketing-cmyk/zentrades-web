// Behaviour for the site navigation rendered by lib/chrome.ts: desktop
// dropdowns (hover, click, keyboard), and the mobile menu.
(function () {
  function init(nav) {
    if (nav.dataset.ready) return;
    nav.dataset.ready = '1';
    var openLi = null;
    var timer;

    function close() {
      clearTimeout(timer);
      if (!openLi) return;
      openLi.querySelector('.trigger').setAttribute('aria-expanded', 'false');
      openLi.querySelector('.drop').hidden = true;
      openLi = null;
    }

    function open(li) {
      clearTimeout(timer);
      if (openLi === li) return;
      close();
      var drop = li.querySelector('.drop');
      if (!drop) return;
      drop.hidden = false;
      drop.style.transform = '';
      li.querySelector('.trigger').setAttribute('aria-expanded', 'true');
      openLi = li;
      // Keep the panel on screen.
      var over = drop.getBoundingClientRect().right - (document.documentElement.clientWidth - 20);
      if (over > 0) drop.style.transform = 'translateX(' + -over + 'px)';
    }

    function closeSoon() {
      clearTimeout(timer);
      timer = setTimeout(close, 140);
    }

    nav.querySelectorAll('.menu > li').forEach(function (li) {
      var trigger = li.querySelector('.trigger');
      if (!li.querySelector('.drop')) {
        li.addEventListener('mouseenter', closeSoon);
        return;
      }
      li.addEventListener('mouseenter', function () {
        open(li);
      });
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        if (openLi === li) close();
        else open(li);
      });
      trigger.addEventListener('focus', function () {
        open(li);
      });
    });
    nav.addEventListener('mouseleave', closeSoon);

    var burger = nav.querySelector('.burger');
    var sheet = nav.querySelector('.sheet');
    function setSheet(on) {
      if (!sheet || !burger) return;
      sheet.hidden = !on;
      burger.setAttribute('aria-expanded', String(on));
      nav.classList.toggle('is-open', on);
      document.documentElement.style.overflow = on ? 'hidden' : '';
      if (on) nav.style.setProperty('--zt-nav-h', Math.max(nav.getBoundingClientRect().bottom, 0) + 'px');
    }
    if (burger) {
      burger.addEventListener('click', function () {
        setSheet(sheet.hidden);
      });
    }
    nav.querySelectorAll('.acc-btn[aria-expanded]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var on = btn.getAttribute('aria-expanded') !== 'true';
        nav.querySelectorAll('.acc-btn[aria-expanded="true"]').forEach(function (other) {
          if (other === btn) return;
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.hidden = true;
        });
        btn.setAttribute('aria-expanded', String(on));
        btn.nextElementSibling.hidden = !on;
      });
    });
    if (sheet) {
      sheet.addEventListener('click', function (e) {
        if (e.target.closest('a')) setSheet(false);
      });
    }

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        close();
        setSheet(false);
      }
    });
  }

  function start() {
    document.querySelectorAll('[data-zt-nav]').forEach(init);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
