// Behaviour for the native forms rendered by lib/forms.ts: checklists (save
// progress, print / save as PDF), short forms (submit to /api/forms) and the
// quiz.
(function () {
  var STORE = 'zt-form-';

  function storage() {
    try {
      return window.localStorage;
    } catch (e) {
      return null;
    }
  }

  function serialize(form) {
    var data = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      if (el.type === 'radio' || el.type === 'checkbox') {
        if (el.checked) data[el.name] = el.value;
      } else {
        data[el.name] = el.value;
      }
    });
    return data;
  }

  function restore(form, data) {
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || !(el.name in data)) return;
      if (el.type === 'radio' || el.type === 'checkbox') el.checked = el.value === data[el.name];
      else el.value = data[el.name];
    });
  }

  function progress(root) {
    var groups = root.querySelectorAll('ol.items > li');
    var done = 0;
    groups.forEach(function (li) {
      var answered = !!li.querySelector('input:checked');
      li.classList.toggle('done', answered);
      if (answered) done++;
    });
    var bar = root.querySelector('.bar span');
    var count = root.querySelector('.count');
    if (bar) bar.style.width = (groups.length ? (done / groups.length) * 100 : 0) + '%';
    if (count) count.textContent = done + ' / ' + groups.length + ' answered';
    return { done: done, total: groups.length };
  }

  function status(root, text, ok, html) {
    var el = root.querySelector('.status');
    if (!el) return;
    el.hidden = false;
    el.className = 'status ' + (ok ? 'ok' : 'err');
    if (html) el.innerHTML = html;
    else el.textContent = text;
  }

  function sliders(root) {
    root.querySelectorAll('.slider input[type=range]').forEach(function (r) {
      var out = r.parentElement.querySelector('output');
      var sync = function () {
        if (out) out.textContent = r.value;
      };
      r.addEventListener('input', sync);
      sync();
    });
  }

  function submit(root, form, kind) {
    var button = form.querySelector('button[type=submit]');
    if (button) button.disabled = true;
    fetch('/api/forms', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ formId: root.dataset.formId, kind: kind, page: location.pathname, data: serialize(form) }),
    })
      .then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        status(root, root.dataset.thanks || 'Thank you! Your response has been sent.', true);
        if (kind === 'form') form.reset();
      })
      .catch(function () {
        status(root, '', false, 'Sorry, this form couldn’t be sent. Please email <a href="mailto:hello@zentrades.pro">hello@zentrades.pro</a>.');
      })
      .then(function () {
        if (button) button.disabled = false;
      });
  }

  function initChecklist(root) {
    var form = root.querySelector('form');
    var key = STORE + root.dataset.formId;
    var store = storage();
    try {
      var saved = store && store.getItem(key);
      if (saved) restore(form, JSON.parse(saved));
    } catch (e) {}
    progress(root);
    form.addEventListener('input', function () {
      progress(root);
      try {
        if (store) store.setItem(key, JSON.stringify(serialize(form)));
      } catch (e) {}
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submit(root, form, 'checklist');
    });
    root.querySelector('[data-action=clear]').addEventListener('click', function () {
      if (!confirm('Clear all answers on this checklist?')) return;
      form.reset();
      try {
        if (store) store.removeItem(key);
      } catch (e) {}
      progress(root);
    });
    root.querySelector('[data-action=print]').addEventListener('click', function () {
      // Print a copy placed directly on <body> (inputs keep their values and
      // checked state when cloned) so it starts at the top of the page.
      var holder = document.createElement('div');
      holder.className = 'zt-print-root';
      var stamp = document.createElement('p');
      stamp.className = 'printed-on';
      stamp.textContent = location.hostname + location.pathname + ' · ' + new Date().toLocaleDateString();
      holder.appendChild(stamp);
      holder.appendChild(root.cloneNode(true));
      document.body.appendChild(holder);
      document.documentElement.classList.add('zt-printing');
      var cleaned = false;
      var done = function () {
        if (cleaned) return;
        cleaned = true;
        document.documentElement.classList.remove('zt-printing');
        holder.remove();
        window.removeEventListener('afterprint', done);
      };
      // afterprint fires once the dialog closes (all current browsers).
      window.addEventListener('afterprint', done);
      window.print();
    });
  }

  function initForm(root) {
    var form = root.querySelector('form');
    sliders(root);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submit(root, form, 'form');
    });
  }

  function initQuiz(root) {
    var form = root.querySelector('form');
    var results = JSON.parse(root.querySelector('.quiz-data').textContent);
    var out = root.querySelector('.quiz-result');
    progress(root);
    form.addEventListener('input', function () {
      progress(root);
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var p = progress(root);
      if (p.done < p.total) {
        out.hidden = false;
        out.innerHTML = '<p>Answer all ' + p.total + ' questions to see your match (' + p.done + ' so far).</p>';
        return;
      }
      // Personality quiz: the result picked most often wins; ties go to the earliest.
      var tally = {};
      var order = [];
      form.querySelectorAll('input:checked').forEach(function (i) {
        if (!(i.value in tally)) order.push(i.value);
        tally[i.value] = (tally[i.value] || 0) + 1;
      });
      var best = order.reduce(function (a, b) {
        return tally[b] > tally[a] ? b : a;
      }, order[0]);
      var r = results[best];
      if (!r) return;
      out.hidden = false;
      out.innerHTML = '<h3></h3><div class="desc"></div>';
      out.querySelector('h3').textContent = 'Your match: ' + r.title;
      out.querySelector('.desc').innerHTML = r.description;
      out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    root.querySelector('[data-action=clear]').addEventListener('click', function () {
      form.reset();
      out.hidden = true;
      progress(root);
    });
  }

  function start() {
    document.querySelectorAll('[data-zt-form]').forEach(function (root) {
      if (root.dataset.ready) return;
      root.dataset.ready = '1';
      var kind = root.dataset.ztForm;
      if (kind === 'checklist') initChecklist(root);
      else if (kind === 'quiz') initQuiz(root);
      else initForm(root);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
