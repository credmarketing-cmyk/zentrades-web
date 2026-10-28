// Spooky Season Deal popup, shown on every page (loaded from lib/tracking.ts),
// from the "Halloween Popup" design: a night scene (ghost, pumpkin, bats,
// tombstones) beside the offer, a countdown, and an "Unlock the Deal" step that
// reveals the promo code.
// Styles are scoped to #zt-offer so the WordPress/Elementor CSS can't override them.
// Opens a few seconds after the page loads, once per visitor, and stops
// appearing after the deal ends at midnight on Halloween (US Eastern).
(function () {
  var ENDS = new Date('2026-11-01T00:00:00-04:00').getTime();
  var KEY = 'zt-offer-spooky-2026';
  var DELAY = 4000;
  var CODE = 'BOO3FREE';
  var UTM = 'utm_source=website&utm_medium=popup&utm_campaign=spooky-season-2026';
  var FONTS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Pirata+One&family=Caveat:wght@600;700&display=swap';

  if (Date.now() >= ENDS) return;
  try {
    if (localStorage.getItem(KEY)) return;
  } catch (e) {}

  var INK = '#0B0B0B', CREAM = '#F7EEDD', NIGHT = '#0E0D0C', ORANGE = '#E8702A', STONE = '#2A2726', MUTED = '#8A8174';

  var CSS =
    '#zt-offer, #zt-offer *:not(svg, svg *) { all: revert; box-sizing: border-box; }' +
    '#zt-offer { position: fixed; inset: 0; z-index: 2147483000; display: flex; align-items: center; justify-content: center; padding: 24px; background: rgba(11,11,11,.62); backdrop-filter: blur(3px); font-family: Inter, system-ui, sans-serif; color: ' + INK + '; -webkit-font-smoothing: antialiased; animation: zto-fade .4s ease both; }' +
    '#zt-offer .card { position: relative; width: 100%; max-width: 960px; max-height: calc(100vh - 48px); overflow: auto; display: flex; flex-wrap: wrap; border-radius: 28px; background: ' + CREAM + '; box-shadow: 0 40px 120px rgba(0,0,0,.5); animation: zto-in .6s cubic-bezier(.2,.9,.25,1.2) both; text-align: left; }' +
    // Night scene
    '#zt-offer .scene { position: relative; flex: 1 1 360px; min-height: 520px; background: ' + NIGHT + '; overflow: hidden; }' +
    '#zt-offer .scene > * { position: absolute; }' +
    '#zt-offer .moon { top: 44px; right: 46px; width: 92px; height: 92px; border-radius: 50%; background: #F3D9A4; box-shadow: 0 0 60px 10px rgba(243,217,164,.25); }' +
    '#zt-offer .moon-cut { top: 30px; right: 30px; width: 92px; height: 92px; border-radius: 50%; background: ' + NIGHT + '; }' +
    '#zt-offer .star { border-radius: 50%; background: ' + CREAM + '; animation: zto-twinkle 2.4s infinite; }' +
    '#zt-offer .bat { animation: zto-bat 5s ease-in-out infinite; }' +
    '#zt-offer .bat svg { animation: zto-flap .35s infinite; transform-origin: center; display: block; }' +
    '#zt-offer .stone { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; background: ' + STONE + '; border: 1.5px solid #3D3833; transition: transform .35s cubic-bezier(.3,1.6,.5,1); }' +
    '#zt-offer .stone b { font-family: "Pirata One", serif; font-weight: 400; font-size: 30px; color: ' + CREAM + '; line-height: 1; }' +
    '#zt-offer .stone span { font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: #B8AE9F; text-align: center; line-height: 1.35; }' +
    '#zt-offer .stone-l { bottom: 54px; left: 28px; width: 118px; height: 140px; border-radius: 60px 60px 6px 6px; transform: rotate(-6deg); }' +
    '#zt-offer .stone-l:hover { transform: rotate(-14deg) translateY(-6px); }' +
    '#zt-offer .stone-r { bottom: 50px; right: 24px; width: 112px; height: 128px; border-radius: 56px 56px 6px 6px; transform: rotate(5deg); }' +
    '#zt-offer .stone-r:hover { transform: rotate(13deg) translateY(-6px); }' +
    '#zt-offer .ghost { left: 50%; bottom: 92px; margin-left: -78px; width: 156px; animation: zto-float 4s ease-in-out infinite; }' +
    '#zt-offer .ghost svg { display: block; overflow: visible; }' +
    '#zt-offer .pupils { transition: transform .15s; transform: translate(-2px, 2px); }' +
    '#zt-offer .pumpkin { position: absolute; right: -30px; bottom: 18px; animation: zto-glow 2.2s infinite; }' +
    '#zt-offer .ground { left: 0; right: 0; bottom: 0; height: 60px; background: ' + NIGHT + '; border-top: 1.5px dashed #3D3833; }' +
    '#zt-offer .sign { left: 24px; bottom: 18px; font-family: Caveat, cursive; font-size: 22px; color: #B8AE9F; }' +
    // Content
    '#zt-offer .content { position: relative; flex: 1.25 1 420px; padding: 52px 48px 40px; display: flex; flex-direction: column; gap: 22px; overflow: hidden; }' +
    '#zt-offer .web-corner { position: absolute; bottom: -1px; right: -1px; transform: rotate(180deg); opacity: .35; }' +
    '#zt-offer .x { position: absolute; top: 18px; right: 18px; z-index: 3; width: 40px; height: 40px; border-radius: 50%; border: 1.5px solid rgba(11,11,11,.15); background: transparent; color: ' + INK + '; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; transition: all .25s; }' +
    '#zt-offer .x:hover { background: ' + INK + '; color: ' + CREAM + '; transform: rotate(90deg); }' +
    '#zt-offer .spider { position: absolute; top: 0; right: 96px; z-index: 2; animation: zto-drop 1.4s .5s cubic-bezier(.3,1,.4,1) both; }' +
    '#zt-offer .spider > div { transform-origin: top center; animation: zto-sway 3.5s 2s ease-in-out infinite; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform .5s; }' +
    '#zt-offer .spider > div:hover { transform: translateY(-50px); }' +
    '#zt-offer .thread { width: 1px; height: 78px; background: ' + INK + '; }' +
    '#zt-offer .tag { display: flex; align-items: center; gap: 8px; align-self: flex-start; padding: 7px 14px 7px 10px; border-radius: 999px; background: ' + INK + '; color: ' + CREAM + '; font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }' +
    '#zt-offer .step { display: flex; flex-direction: column; gap: 22px; }' +
    '#zt-offer .step[hidden] { display: none; }' +
    '#zt-offer .step.reveal { gap: 20px; animation: zto-up .5s both; }' +
    '#zt-offer h2 { margin: 0; font-size: 40px; line-height: 1.04; font-weight: 800; letter-spacing: -.035em; text-wrap: balance; max-width: 440px; color: ' + INK + '; }' +
    '#zt-offer .scary { font-family: "Pirata One", serif; font-weight: 400; font-size: 52px; letter-spacing: 0; color: ' + ORANGE + '; }' +
    '#zt-offer .hand { font-family: Caveat, cursive; font-weight: 700; font-size: 44px; letter-spacing: 0; display: inline-block; transform: rotate(-2deg); margin-top: 6px; }' +
    '#zt-offer p { margin: 0; font-size: 16px; line-height: 1.6; color: #4A443D; max-width: 420px; text-wrap: pretty; }' +
    '#zt-offer p strong { color: ' + INK + '; font-weight: 700; }' +
    '#zt-offer .label { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: ' + MUTED + '; }' +
    '#zt-offer .timer { display: flex; gap: 8px; margin-top: 10px; }' +
    '#zt-offer .cell { min-width: 64px; padding: 10px 8px 8px; border-radius: 14px; background: #fff; border: 1.5px solid ' + INK + '; box-shadow: 3px 3px 0 ' + INK + '; display: flex; flex-direction: column; align-items: center; gap: 2px; }' +
    '#zt-offer .cell b { font-size: 26px; font-weight: 800; letter-spacing: -.02em; font-variant-numeric: tabular-nums; line-height: 1; }' +
    '#zt-offer .cell span { font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: ' + MUTED + '; }' +
    '#zt-offer .actions { display: flex; align-items: center; gap: 18px 22px; flex-wrap: wrap; margin-top: 6px; }' +
    '#zt-offer .go { display: flex; align-items: center; gap: 12px; padding: 17px 26px; border-radius: 999px; border: none; background: ' + INK + '; color: ' + CREAM + '; font: 700 16px Inter, system-ui, sans-serif; text-decoration: none; cursor: pointer; transition: all .25s; }' +
    '#zt-offer .go:hover { background: ' + ORANGE + '; color: ' + INK + '; transform: translateY(-2px); box-shadow: 0 12px 30px rgba(232,112,42,.45); }' +
    '#zt-offer .go.small { padding: 16px 24px; font-size: 15px; gap: 10px; }' +
    '#zt-offer .more { font-size: 15px; font-weight: 600; color: ' + INK + '; text-decoration: underline; text-decoration-color: ' + ORANGE + '; text-decoration-thickness: 2px; text-underline-offset: 5px; }' +
    '#zt-offer .more:hover { color: ' + ORANGE + '; }' +
    '#zt-offer .coupon { display: flex; align-items: stretch; border: 1.5px dashed ' + INK + '; border-radius: 16px; overflow: hidden; max-width: 400px; background: #fff; }' +
    '#zt-offer .coupon b { flex: 1; padding: 16px 20px; font-family: "Pirata One", serif; font-weight: 400; font-size: 32px; letter-spacing: .06em; line-height: 1; }' +
    '#zt-offer .coupon button { padding: 0 22px; border: none; border-left: 1.5px dashed ' + INK + '; background: ' + CREAM + '; color: ' + INK + '; font: 700 14px Inter, system-ui, sans-serif; cursor: pointer; }' +
    '#zt-offer .coupon button:hover { background: ' + ORANGE + '; }' +
    '#zt-offer .back { font-size: 14px; font-weight: 600; color: ' + MUTED + '; text-decoration: underline; cursor: pointer; background: none; border: 0; padding: 0; font-family: inherit; }' +
    '#zt-offer .expires { font-size: 13px; color: ' + MUTED + '; }' +
    '#zt-offer a:focus-visible, #zt-offer button:focus-visible { outline: 2px solid ' + ORANGE + '; outline-offset: 3px; }' +
    // Phones: a shorter scene above the offer.
    '@media (max-width: 760px) { #zt-offer { padding: 12px; } #zt-offer .card { max-height: calc(100vh - 24px); border-radius: 22px; }' +
    ' #zt-offer .scene { flex-basis: 100%; min-height: 250px; } #zt-offer .ghost { bottom: 40px; transform-origin: bottom center; } #zt-offer .ghost > svg { width: 110px; height: 124px; } #zt-offer .pumpkin { right: -26px; bottom: 8px; } #zt-offer .pumpkin svg { width: 46px; height: 42px; } #zt-offer .ghost { margin-left: -55px; width: 110px; }' +
    ' #zt-offer .stone-l { width: 82px; height: 98px; bottom: 36px; left: 18px; } #zt-offer .stone-r { width: 78px; height: 90px; bottom: 34px; right: 16px; } #zt-offer .stone b { font-size: 22px; } #zt-offer .stone span { font-size: 9px; }' +
    ' #zt-offer .ground { height: 34px; } #zt-offer .sign { font-size: 17px; bottom: 6px; left: 16px; } #zt-offer .moon, #zt-offer .moon-cut { width: 64px; height: 64px; } #zt-offer .moon { top: 26px; right: 30px; } #zt-offer .moon-cut { top: 16px; right: 18px; }' +
    ' #zt-offer .content { flex-basis: 100%; padding: 30px 22px 28px; gap: 18px; } #zt-offer .spider { display: none; } #zt-offer h2 { font-size: 30px; } #zt-offer .scary { font-size: 40px; } #zt-offer .hand { font-size: 34px; }' +
    ' #zt-offer .cell { min-width: 0; flex: 1; } #zt-offer .cell b { font-size: 22px; } #zt-offer .go { width: 100%; justify-content: center; } #zt-offer .coupon b { font-size: 26px; } }' +
    '@media (prefers-reduced-motion: reduce) { #zt-offer, #zt-offer * { animation: none !important; transition: none !important; } }' +
    '@keyframes zto-float { 0%,100% { transform: translateY(0) rotate(-2deg) } 50% { transform: translateY(-12px) rotate(2deg) } }' +
    '@keyframes zto-drop { 0% { transform: translateY(-220px) } 70% { transform: translateY(14px) } 85% { transform: translateY(-6px) } 100% { transform: translateY(0) } }' +
    '@keyframes zto-sway { 0%,100% { transform: rotate(-5deg) } 50% { transform: rotate(5deg) } }' +
    '@keyframes zto-bat { 0% { transform: translate(0,0) scale(1) } 25% { transform: translate(14px,-10px) scale(.92,1) } 50% { transform: translate(28px,4px) scale(1) } 75% { transform: translate(10px,10px) scale(.92,1) } 100% { transform: translate(0,0) scale(1) } }' +
    '@keyframes zto-flap { 0%,100% { transform: scaleY(1) } 50% { transform: scaleY(.45) } }' +
    '@keyframes zto-in { 0% { opacity: 0; transform: translateY(28px) scale(.96) } 100% { opacity: 1; transform: none } }' +
    '@keyframes zto-fade { from { opacity: 0 } to { opacity: 1 } }' +
    '@keyframes zto-twinkle { 0%,100% { opacity: .25 } 50% { opacity: 1 } }' +
    '@keyframes zto-glow { 0%,100% { filter: drop-shadow(0 0 6px rgba(240,122,43,.55)) } 50% { filter: drop-shadow(0 0 18px rgba(240,122,43,.95)) } }' +
    '@keyframes zto-up { 0% { opacity: 0; transform: translateY(10px) } 100% { opacity: 1; transform: none } }';

  var BAT = '<path d="M0 6Q6 0 10 4Q12 0 14 4Q16 0 18 4Q22 0 28 6Q22 6 20 11Q17 7 14 11Q11 7 8 11Q6 6 0 6Z" fill="currentColor"/>';
  var WEB = '<path d="M0 0L100 30M0 0L80 70M0 0L30 100M0 0L60 95"/><path d="M24 7Q22 16 19 22Q14 23 7 24"/><path d="M46 14Q40 32 36 44Q26 46 13 48"/><path d="M68 20Q60 46 54 64Q40 68 20 72"/>';

  var SCENE =
    '<div class="scene" aria-hidden="true">' +
    '<svg width="150" height="150" viewBox="0 0 100 100" style="top:0;left:0;opacity:.55" fill="none" stroke="' + CREAM + '" stroke-width=".6">' + WEB + '<path d="M88 26Q78 58 70 84Q52 90 27 94"/></svg>' +
    '<div class="moon"></div><div class="moon-cut"></div>' +
    '<div class="star" style="top:96px;left:150px;width:4px;height:4px"></div>' +
    '<div class="star" style="top:170px;left:60px;width:3px;height:3px;animation-duration:3.1s;animation-delay:.6s"></div>' +
    '<div class="star" style="top:60px;left:240px;width:3px;height:3px;animation-duration:2s;animation-delay:1s"></div>' +
    '<div class="star" style="top:210px;right:50px;width:4px;height:4px;animation-duration:2.8s;animation-delay:.3s"></div>' +
    '<div class="bat" style="top:150px;left:180px;color:' + ORANGE + '"><svg width="40" height="20" viewBox="0 0 28 14">' + BAT + '</svg></div>' +
    '<div class="bat" style="top:110px;left:70px;color:' + CREAM + ';animation-duration:6.5s;animation-delay:1s"><svg width="26" height="13" viewBox="0 0 28 14" style="animation-duration:.3s">' + BAT + '</svg></div>' +
    '<div class="stone stone-l"><b>RIP</b><span>Missed<br>Jobs</span></div>' +
    '<div class="stone stone-r"><b>RIP</b><span>Lost<br>Invoices</span></div>' +
    '<div class="ghost"><svg width="156" height="176" viewBox="0 0 120 136">' +
    '<path d="M14 128Q10 18 60 14Q110 18 106 128L96 118L86 130L74 118L60 130L46 118L34 130L24 118Z" fill="' + CREAM + '" stroke="' + NIGHT + '" stroke-width="2"/>' +
    '<ellipse cx="44" cy="58" rx="9" ry="12" fill="' + NIGHT + '"/><ellipse cx="76" cy="58" rx="9" ry="12" fill="' + NIGHT + '"/>' +
    '<g class="pupils"><circle cx="46" cy="54" r="3" fill="' + CREAM + '"/><circle cx="78" cy="54" r="3" fill="' + CREAM + '"/></g>' +
    '<ellipse cx="32" cy="74" rx="6" ry="3.5" fill="#F2A7A0" opacity=".7"/><ellipse cx="88" cy="74" rx="6" ry="3.5" fill="#F2A7A0" opacity=".7"/>' +
    '<ellipse class="mouth-o" cx="60" cy="80" rx="5" ry="6" fill="' + NIGHT + '"/>' +
    '<path class="mouth-smile" d="M50 76Q60 88 70 76" fill="none" stroke="' + NIGHT + '" stroke-width="3" stroke-linecap="round" style="display:none"/>' +
    '</svg>' +
    '<div class="pumpkin"><svg width="64" height="58" viewBox="0 0 64 58"><path d="M32 10Q34 2 40 2" fill="none" stroke="#3B2A1A" stroke-width="4" stroke-linecap="round"/>' +
    '<ellipse cx="32" cy="34" rx="30" ry="22" fill="' + ORANGE + '"/><path d="M20 14Q14 34 20 54M44 14Q50 34 44 54" fill="none" stroke="#C85A1C" stroke-width="2"/>' +
    '<path d="M18 28L25 22L28 31Z M46 28L39 22L36 31Z" fill="' + NIGHT + '"/><path d="M18 38Q32 50 46 38L42 42L38 38L34 43L30 38L26 43L22 38Z" fill="' + NIGHT + '"/></svg></div>' +
    '</div>' +
    '<div class="ground"></div><div class="sign">spooky season ♡ ZenTrades</div>' +
    '</div>';

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

  function track(action) {
    if (typeof window.gtag === 'function') window.gtag('event', 'offer_popup', { offer: 'spooky-season-2026', action: action });
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function show() {
    if (document.getElementById('zt-offer') || Date.now() >= ENDS) return;
    // Each vertical's own Book a Demo page (from the site nav), else the main one.
    var cta = document.querySelector('[data-zt-nav] .cta');
    var demo = withUtm((cta && cta.getAttribute('href')) || '/book-demo');
    // "I am interested" emails the sales team.
    var interested = 'mailto:anubhav.raghav@zentrades.pro?subject=' + encodeURIComponent('Spooky Season Deal') + '&body=' + encodeURIComponent('I am interested');

    var fonts = document.createElement('link');
    fonts.rel = 'stylesheet';
    fonts.href = FONTS;
    var style = document.createElement('style');
    style.textContent = CSS;
    var root = document.createElement('div');
    root.id = 'zt-offer';
    root.innerHTML =
      '<div class="card" role="dialog" aria-modal="true" aria-labelledby="zt-offer-title">' +
      SCENE +
      '<div class="content">' +
      '<svg class="web-corner" width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="' + INK + '" stroke-width=".6" aria-hidden="true">' + WEB + '</svg>' +
      '<button class="x" type="button" aria-label="Close"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
      '<div class="spider" aria-hidden="true"><div><div class="thread"></div><svg width="44" height="44" viewBox="0 0 44 44">' +
      '<g stroke="' + INK + '" stroke-width="2" fill="none" stroke-linecap="round"><path d="M18 20L8 12L4 18M18 24L6 22L2 28M18 27L8 32L6 40M19 29L12 38"/><path d="M26 20L36 12L40 18M26 24L38 22L42 28M26 27L36 32L38 40M25 29L32 38"/></g>' +
      '<ellipse cx="22" cy="18" rx="6" ry="6" fill="' + INK + '"/><ellipse cx="22" cy="28" rx="8" ry="9" fill="' + INK + '"/><circle cx="20" cy="17" r="1.4" fill="' + ORANGE + '"/><circle cx="24" cy="17" r="1.4" fill="' + ORANGE + '"/></svg></div></div>' +
      '<div class="tag"><svg width="22" height="11" viewBox="0 0 28 14" style="color:' + ORANGE + '">' + BAT + '</svg>Spooky Season Deal</div>' +
      // Step 1: the offer.
      '<div class="step offer">' +
      '<h2 id="zt-offer-title">Missed Jobs and Lost Invoices Are <span class="scary">Scary.</span><br><span class="hand">This Deal Isn’t.</span></h2>' +
      '<p>Lock in a 12-month ZenTrades plan and get <strong>3 months free</strong>. Disappears at midnight on Halloween.</p>' +
      '<div><div class="label">Vanishes in</div><div class="timer" aria-live="off">' +
      ['Days', 'Hrs', 'Min', 'Sec'].map(function (l) { return '<div class="cell"><b>00</b><span>' + l + '</span></div>'; }).join('') +
      '</div></div>' +
      '<div class="actions"><button class="go unlock" type="button"><svg width="18" height="18" viewBox="0 0 64 58" aria-hidden="true"><ellipse cx="32" cy="34" rx="30" ry="22" fill="currentColor"/><path d="M32 10Q34 2 40 2" fill="none" stroke="currentColor" stroke-width="5"/></svg>Unlock the Deal <span aria-hidden="true">→</span></button>' +
      '<a class="more" href="' + interested + '">I am interested</a></div>' +
      '</div>' +
      // Step 2: the code.
      '<div class="step reveal" hidden>' +
      '<h2>The deal is <span class="scary">yours.</span></h2>' +
      '<p>3 months free on any 12-month ZenTrades plan. Use this code at checkout or share it with your rep.</p>' +
      '<div class="coupon"><b>' + CODE + '</b><button class="copy" type="button">Copy</button></div>' +
      '<div class="actions"><a class="go small claim" href="' + demo + '">Claim on a 12-month plan →</a><button class="back" type="button">Back</button></div>' +
      '<div class="expires">Expires Oct 31, 11:59 PM ET</div>' +
      '</div>' +
      '</div></div>';

    var card = root.querySelector('.card');
    var offer = root.querySelector('.offer');
    var reveal = root.querySelector('.reveal');
    var cells = root.querySelectorAll('.cell b');
    var pupils = root.querySelector('.pupils');
    var ghost = root.querySelector('.ghost');

    function tick() {
      var ms = Math.max(0, ENDS - Date.now());
      var v = [Math.floor(ms / 864e5), Math.floor(ms / 36e5) % 24, Math.floor(ms / 6e4) % 60, Math.floor(ms / 1e3) % 60];
      for (var i = 0; i < 4; i++) cells[i].textContent = pad(v[i]);
    }
    tick();
    var timer = setInterval(tick, 1000);

    function setStep(unlocked) {
      offer.hidden = unlocked;
      reveal.hidden = !unlocked;
      root.querySelector('.mouth-o').style.display = unlocked ? 'none' : '';
      root.querySelector('.mouth-smile').style.display = unlocked ? '' : 'none';
      (unlocked ? reveal.querySelector('.copy') : offer.querySelector('.unlock')).focus({ preventScroll: true });
    }

    // The ghost's eyes follow the pointer.
    function onMove(e) {
      var r = ghost.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * 0.4);
      var d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 200);
      pupils.style.transform = 'translate(' + ((dx / d) * 4 * k - 2) + 'px,' + ((dy / d) * 5 * k + 2) + 'px)';
    }

    var lastFocus = document.activeElement;
    var prevOverflow = document.documentElement.style.overflow;

    function close() {
      clearInterval(timer);
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

    root.addEventListener('mousemove', onMove);
    root.addEventListener('click', function (e) {
      if (e.target === root || e.target.closest('.x')) {
        track('close');
        close();
      }
    });
    card.querySelector('.unlock').addEventListener('click', function () {
      track('unlock');
      setStep(true);
    });
    card.querySelector('.back').addEventListener('click', function () {
      setStep(false);
    });
    card.querySelector('.copy').addEventListener('click', function () {
      var btn = this;
      track('copy');
      try {
        navigator.clipboard.writeText(CODE);
      } catch (e) {}
      btn.textContent = 'Copied!';
    });
    card.querySelector('.claim').addEventListener('click', function () {
      track('claim');
    });
    card.querySelector('.more').addEventListener('click', function () {
      track('interested');
    });
    document.addEventListener('keydown', onKey);

    try {
      localStorage.setItem(KEY, String(Date.now()));
    } catch (e) {}

    document.head.appendChild(fonts);
    document.head.appendChild(style);
    document.body.appendChild(root);
    document.documentElement.style.overflow = 'hidden';
    card.querySelector('.unlock').focus({ preventScroll: true });
    track('view');
  }

  function start() {
    setTimeout(show, DELAY);
  }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
