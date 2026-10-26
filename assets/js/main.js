(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- tabs (hash routed) ---------- */
  var panels = {};
  document.querySelectorAll('[data-panel]').forEach(function (el) { panels[el.dataset.panel] = el; });
  var tabs = document.querySelectorAll('.tab');
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
  // Post pages have no panels; their tab links are plain links back to index.html.
  if (Object.keys(panels).length) {
    window.addEventListener('popstate', function () { show(fromHash()); });
    window.addEventListener('hashchange', function () { show(fromHash()); });
    show(fromHash());
  }

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

  /* ---------- live project data ---------- */
  // Both projects redeploy daily, so the cards fetch their public data on page load.
  // The HTML already holds a snapshot; anything that fails to load just leaves it in place.
  var ATLAS = 'https://datachart.github.io/AtlasResearchDesk';
  var ASP = 'https://datachart.github.io/AgentStockPortfolio';

  function getJSON(url) {
    return fetch(url, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error(r.status + ' ' + url);
      return r.json();
    });
  }
  function setText(root, key, text) {
    var el = root && root.querySelector('[data-k="' + key + '"]');
    if (el) el.textContent = text;
  }
  function el(tag, text, attrs) {
    var n = document.createElement(tag);
    if (text != null) n.textContent = text;
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }
  var money = function (v) { return '$' + Math.round(v).toLocaleString('en-US'); };
  var signed = function (pct) { return (pct >= 0 ? '▲ ' : '▼ ') + Math.abs(pct).toFixed(2) + '%'; };
  function shortDate(iso) {
    var d = new Date(iso);
    return isNaN(d) ? '' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  function ago(iso) {
    var mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (!(mins >= 0)) return '';
    if (mins < 60) return mins <= 1 ? 'just now' : mins + ' minutes ago';
    var h = Math.round(mins / 60);
    if (h < 24) return h + (h === 1 ? ' hour ago' : ' hours ago');
    var d = Math.round(h / 24);
    return d + (d === 1 ? ' day ago' : ' days ago');
  }
  function verdict(v) { return v ? String(v).replace(/-/g, ' ') : ''; }

  // Last commit per repo, from the public GitHub API (60 requests/hour per visitor, two used here).
  document.querySelectorAll('[data-gh-repo]').forEach(function (line) {
    var when = line.querySelector('[data-gh-when]');
    var msg = line.querySelector('[data-gh-msg]');
    getJSON('https://api.github.com/repos/' + line.dataset.ghRepo + '/commits?per_page=1')
      .then(function (list) {
        var c = list && list[0] && list[0].commit;
        if (!c) throw new Error('no commits');
        when.textContent = 'last commit ' + ago(c.committer.date);
        when.title = new Date(c.committer.date).toLocaleString();
        msg.textContent = c.message.split('\n')[0];
      })
      .catch(function () { line.hidden = true; });
  });

  // Atlas Research Desk: its /api endpoints exist for exactly this kind of embed.
  var atlasStats = document.getElementById('atlas-stats');
  if (atlasStats) {
    Promise.all([getJSON(ATLAS + '/api/metrics.json'), getJSON(ATLAS + '/api/posts.json')])
      .then(function (res) {
        var m = res[0], posts = res[1];
        setText(atlasStats, 'posts', m.output.research_posts);
        setText(atlasStats, 'reviews', m.output.cycle_reviews);
        setText(atlasStats, 'words', Math.round(m.output.words_published / 1000) + 'k');
        setText(atlasStats, 'clean', (m.pipeline.clean_run_rate * 100).toFixed(1) + '%');
        var list = document.getElementById('atlas-posts');
        var latest = posts.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); }).slice(0, 3);
        if (latest.length) {
          list.textContent = '';
          latest.forEach(function (p) {
            var li = el('li');
            li.appendChild(el('a', p.title, { href: p.url, target: '_blank', rel: 'noopener' }));
            li.appendChild(el('span', shortDate(p.date) + (p.qa_verdict ? ' · QA: ' + verdict(p.qa_verdict) : ''), { class: 'post-meta' }));
            list.appendChild(li);
          });
        }
        document.getElementById('atlas-source').textContent = 'Live from the site’s public API · generated ' + ago(m.generated_at) + '.';
      })
      .catch(function () {});
  }

  // Agent Stock Portfolio: the dashboard publishes its own data folder.
  var aspStats = document.getElementById('asp-stats');
  if (aspStats) {
    getJSON(ASP + '/data/portfolio.json')
      .then(function (p) {
        setText(aspStats, 'value', money(p.total_value));
        setText(aspStats, 'ret', signed(p.return_pct));
        setText(aspStats, 'trades', p.trade_count);
        setText(aspStats, 'cash', money(p.cash));
        var body = document.querySelector('#asp-holdings tbody');
        var rows = (p.positions || []).slice().sort(function (a, b) { return b.market_value - a.market_value; });
        if (rows.length) {
          body.textContent = '';
          rows.forEach(function (x) {
            var tr = el('tr');
            tr.appendChild(el('td', x.ticker));
            tr.appendChild(el('td', money(x.market_value)));
            tr.appendChild(el('td', signed(x.unrealized_pl_pct)));
            body.appendChild(tr);
          });
        }
        document.getElementById('asp-source').textContent = 'Live from the dashboard’s data · as of the ' + shortDate(p.as_of + 'T12:00:00') + ' close.';
      })
      .catch(function () {});
  }

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
