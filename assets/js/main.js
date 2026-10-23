(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- tabs (hash routed) ---------- */
  var panels = {};
  document.querySelectorAll('[data-panel]').forEach(function (el) { panels[el.dataset.panel] = el; });
  var tabs = document.querySelectorAll('.tab');
  var order = Array.prototype.map.call(tabs, function (t) { return t.dataset.tab; });
  var nav = document.querySelector('.tabs');

  function show(name, opts) {
    if (!panels[name]) name = 'main';
    Object.keys(panels).forEach(function (k) { panels[k].classList.toggle('is-active', k === name); });
    tabs.forEach(function (t) {
      if (t.dataset.tab === name) t.setAttribute('aria-current', 'page');
      else t.removeAttribute('aria-current');
    });
    if (opts && opts.focus) {
      // Bring the tab bar back into view when jumping from further down the page.
      if (nav.getBoundingClientRect().top < 0) nav.scrollIntoView({ block: 'start' });
      panels[name].focus({ preventScroll: true });
    }
  }

  function fromHash() { return (location.hash || '#main').slice(1); }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var name = a.getAttribute('href').slice(1);
    if (!panels[name]) return;
    e.preventDefault();
    if (fromHash() !== name) history.pushState(null, '', '#' + name);
    show(name, { focus: true });
  });
  window.addEventListener('popstate', function () { show(fromHash()); });
  window.addEventListener('hashchange', function () { show(fromHash()); });
  show(fromHash());

  // Press 1-5 to switch tabs.
  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    var i = parseInt(e.key, 10);
    if (i >= 1 && i <= order.length) {
      var name = order[i - 1];
      if (fromHash() !== name) history.pushState(null, '', '#' + name);
      show(name);
    }
  });

  /* ---------- skill filters ---------- */
  var active = { sw: true, lang: true, soft: true };
  document.querySelectorAll('.legend-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var type = btn.dataset.filter;
      active[type] = !active[type];
      // Never filter everything away: turning the last one off turns all back on.
      if (!active.sw && !active.lang && !active.soft) active = { sw: true, lang: true, soft: true };
      document.querySelectorAll('.legend-btn').forEach(function (b) {
        b.setAttribute('aria-pressed', String(active[b.dataset.filter]));
      });
      document.querySelectorAll('.skill').forEach(function (s) {
        s.classList.toggle('is-hidden', !active[s.dataset.type]);
      });
    });
  });

  /* ---------- theme toggle ---------- */
  var themeBtn = document.getElementById('theme-btn');
  var mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

  function effectiveTheme() {
    return root.dataset.theme || (mql && mql.matches ? 'light' : 'dark');
  }
  function syncThemeUi() {
    var light = effectiveTheme() === 'light';
    root.classList.toggle('is-light', light);
    themeBtn.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
  }
  themeBtn.addEventListener('click', function () {
    var next = effectiveTheme() === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncThemeUi();
  });
  if (mql && mql.addEventListener) mql.addEventListener('change', syncThemeUi);
  syncThemeUi();

  /* ---------- for whoever opens devtools ---------- */
  var giraffe = [
    '   ^^',
    '  (o >',
    '   \\ \\',
    '    \\ \\       hi, fellow developer.',
    '     \\ \\      >>> import caleb',
    '      \\ \\___  source: github.com/DataChart/caleb.me',
    '      (     )',
    '       || ||',
  ].join('\n');
  try { console.log('%c' + giraffe, 'font-family: monospace; color: #a78bfa'); } catch (e) {}
})();
