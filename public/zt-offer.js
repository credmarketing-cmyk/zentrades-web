// Spooky Season Deal popup, shown on every page (loaded from lib/tracking.ts).
// Styles are scoped to #zt-offer so the WordPress/Elementor CSS can't override them.
// Opens a few seconds after the page loads, once per visitor, and stops
// appearing after the deal ends at midnight on Halloween (US Eastern).
(function () {
  var ENDS = new Date('2026-11-01T00:00:00-04:00').getTime();
  var KEY = 'zt-offer-spooky-2026';
  var DELAY = 4000;
  var UTM = 'utm_source=website&utm_medium=popup&utm_campaign=spooky-season-2026';

  if (Date.now() >= ENDS) return;
  try {
    if (localStorage.getItem(KEY)) return;
  } catch (e) {}

  var CSS =
    '#zt-offer, #zt-offer *:not(svg, svg *) { all: revert; box-sizing: border-box; }' +
    '#zt-offer { position: fixed; inset: 0; z-index: 2147483000; display: grid; place-items: center; padding: 16px; background: rgba(1,1,1,.72); backdrop-filter: blur(4px); font-family: "Inter", system-ui, sans-serif; -webkit-font-smoothing: antialiased; opacity: 0; transition: opacity .25s ease; }' +
    '#zt-offer.on { opacity: 1; }' +
    '#zt-offer .card { position: relative; width: min(520px, 100%); max-height: calc(100vh - 32px); overflow: auto; background: #010101; color: #fff; border-radius: 24px; padding: 40px 36px 32px; box-shadow: 0 0 0 1px #2A2726, 0 40px 80px -30px rgba(0,0,0,.7); transform: translateY(12px) scale(.98); transition: transform .3s cubic-bezier(.2,.7,.2,1); text-align: left; }' +
    '#zt-offer.on .card { transform: none; }' +
    '#zt-offer .glow { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; background: radial-gradient(420px 220px at 100% 0%, rgba(245,130,32,.28), transparent 70%), radial-gradient(360px 200px at 0% 100%, rgba(238,85,102,.22), transparent 70%); }' +
    '#zt-offer .tag { position: relative; display: inline-flex; align-items: center; gap: 8px; margin: 0 0 18px; padding: 6px 12px; border-radius: 999px; background: #1C1A19; box-shadow: inset 0 0 0 1px #3A2A1C; color: #F7A35C; font-family: "Geist Mono", ui-monospace, monospace; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; }' +
    '#zt-offer h2 { position: relative; margin: 0 0 14px; color: #fff; font-size: clamp(24px, 5vw, 32px); line-height: 1.12; font-weight: 600; letter-spacing: -.03em; }' +
    '#zt-offer p { position: relative; margin: 0 0 24px; color: #CFC9C4; font-size: 16px; line-height: 1.55; }' +
    '#zt-offer p strong { color: #fff; font-weight: 600; }' +
    '#zt-offer .count { position: relative; display: block; margin: -8px 0 24px; color: #8F8984; font-family: "Geist Mono", ui-monospace, monospace; font-size: 12px; letter-spacing: .06em; }' +
    '#zt-offer .actions { position: relative; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; }' +
    '#zt-offer .go { display: inline-flex; align-items: center; gap: 8px; height: 50px; padding: 0 24px; border-radius: 14px; background: #EE5566; color: #fff; font-size: 16px; font-weight: 600; text-decoration: none; transition: background .2s, transform .2s; }' +
    '#zt-offer .go:hover { background: #F7A35C; color: #010101; transform: translateY(-1px); }' +
    '#zt-offer .more { color: #CFC9C4; font-size: 15px; font-weight: 500; text-decoration: underline; text-underline-offset: 4px; }' +
    '#zt-offer .more:hover { color: #fff; }' +
    '#zt-offer .x { position: absolute; top: 14px; right: 14px; width: 36px; height: 36px; display: grid; place-items: center; border: 0; border-radius: 50%; background: #1C1A19; color: #fff; font-size: 20px; line-height: 1; cursor: pointer; }' +
    '#zt-offer .x:hover { background: #2E2B29; }' +
    '#zt-offer a:focus-visible, #zt-offer button:focus-visible { outline: 2px solid #F7A35C; outline-offset: 3px; }' +
    '@media (max-width: 480px) { #zt-offer .card { padding: 36px 22px 24px; } #zt-offer .go { width: 100%; justify-content: center; } }' +
    '@media (prefers-reduced-motion: reduce) { #zt-offer, #zt-offer .card { transition: none; } }';

  // An SVG rather than the emoji: WordPress's emoji script swaps emoji for images.
  var PUMPKIN =
    '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 4.2c.2-1.4.9-2.4 2-2.9" fill="none" stroke="#7BA05B" stroke-width="1.4" stroke-linecap="round"/>' +
    '<ellipse cx="5.2" cy="9.6" rx="3.6" ry="5" fill="#E8761E"/><ellipse cx="10.8" cy="9.6" rx="3.6" ry="5" fill="#E8761E"/><ellipse cx="8" cy="9.6" rx="3.4" ry="5.2" fill="#F7A35C"/></svg>';

  function withUtm(href) {
    try {
      var u = new URL(href, location.href);
      UTM.split('&').forEach(function (kv) {
        var p = kv.split('=');
        u.searchParams.set(p[0], p[1]);
      });
      return u.href;
    } catch (e) {
      return href;
    }
  }

  function timeLeft() {
    var ms = ENDS - Date.now();
    var d = Math.floor(ms / 864e5);
    var h = Math.floor((ms % 864e5) / 36e5);
    var m = Math.floor((ms % 36e5) / 6e4);
    return 'Ends in ' + (d ? d + 'd ' : '') + h + 'h ' + m + 'm';
  }

  function track(action) {
    if (typeof window.gtag === 'function') window.gtag('event', 'offer_popup', { offer: 'spooky-season-2026', action: action });
  }

  function show() {
    if (document.getElementById('zt-offer') || Date.now() >= ENDS) return;
    // Each vertical's own Book a Demo page (from the site nav), else the main one.
    var cta = document.querySelector('[data-zt-nav] .cta');
    var demo = withUtm((cta && cta.getAttribute('href')) || '/book-demo');
    var contact = withUtm('/contact-us');

    var style = document.createElement('style');
    style.textContent = CSS;
    var root = document.createElement('div');
    root.id = 'zt-offer';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'zt-offer-title');
    root.innerHTML =
      '<div class="card"><div class="glow" aria-hidden="true"></div>' +
      '<button class="x" type="button" aria-label="Close">×</button>' +
      '<span class="tag">' + PUMPKIN + 'Spooky Season Deal</span>' +
      '<h2 id="zt-offer-title">Missed Jobs and Lost Invoices Are Scary. This Deal Isn’t.</h2>' +
      '<p>Lock in a 12-month ZenTrades plan and get <strong>3 months free</strong>. Disappears at midnight on Halloween.</p>' +
      '<span class="count" aria-live="off">' + timeLeft() + '</span>' +
      '<div class="actions"><a class="go" href="' + demo + '">Unlock the Deal <span aria-hidden="true">→</span></a>' +
      '<a class="more" href="' + contact + '">I am interested</a></div></div>';

    var lastFocus = document.activeElement;
    var prevOverflow = document.documentElement.style.overflow;
    var tick = setInterval(function () {
      root.querySelector('.count').textContent = timeLeft();
    }, 30000);

    function close() {
      clearInterval(tick);
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prevOverflow;
      root.remove();
      style.remove();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function onKey(e) {
      if (e.key === 'Escape') {
        track('close');
        close();
      }
    }

    root.addEventListener('click', function (e) {
      if (e.target === root || e.target.closest('.x')) {
        track('close');
        close();
      }
    });
    root.querySelector('.go').addEventListener('click', function () {
      track('unlock');
    });
    root.querySelector('.more').addEventListener('click', function () {
      track('interested');
    });
    document.addEventListener('keydown', onKey);

    try {
      localStorage.setItem(KEY, String(Date.now()));
    } catch (e) {}

    document.head.appendChild(style);
    document.body.appendChild(root);
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      root.classList.add('on');
    });
    root.querySelector('.go').focus({ preventScroll: true });
    track('view');
  }

  function start() {
    setTimeout(show, DELAY);
  }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
