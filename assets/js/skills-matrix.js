/* Skills matrix: edit LEVELS and DATA below. The KPIs, legend, table and cards are all generated from them.
   Certifications: `certs` is a count (1–3) or a list of up to three certificate names, e.g.
   certs: ["AZ-900", "DP-100"]. Names show as a tooltip on the check marks. */

const LEVELS = [
  { name: "Hobbyist", color: "#85B7EB", desc: "Personal or learning projects; working knowledge." },
  { name: "Junior",   color: "#378ADD", desc: "Delivered production work with guidance." },
  { name: "Senior",   color: "#7F77DD", desc: "Leads delivery independently; mentors others." },
  { name: "Expert",   color: "#D4537E", desc: "Go-to person; designs systems and sets standards." },
  { name: "Master",   color: "#E24B4A", desc: "Deep authority; teaches, publishes, or certifies others." },
];

const DATA = {
  // Manually set: total projects ever delivered (not all are listed as cards).
  projectsDelivered: 42,
  yearsLeading: 2,

  areas: [
    { name: "Data engineering", skills: [
      { name: "SSMS",   level: 4, projects: 18 },
      { name: "SSIS",   level: 3, projects: 15 },
      { name: "Pandas", level: 4, projects: 12, certs: 1 },
      { name: "Polars", level: 1, projects: 4 },
      { name: "ArcGIS", level: 2, projects: 4 },
      { name: "SQL",    level: 5, projects: 0, certs: 1 },  // project count not given yet
      { name: "Power BI",        level: 3, projects: 20, certs: 1 },
      { name: "Dashboards",      level: 3, projects: 35 },
      { name: "Data governance", level: 3, projects: 1 },
      { name: "API integration", level: 2, projects: 4 },
    ]},
    { name: "Cloud and platforms", skills: [
      { name: "Azure",         level: 3, projects: 12 },
    ]},
    { name: "Software development", skills: [
      { name: "Python",     level: 5, projects: 22, certs: 1 },
      { name: "C++",        level: 2, projects: 11 },
      { name: "JavaScript", level: 3, projects: 11 },
      { name: "HTML",       level: 5, projects: 10 },
      { name: "R",          level: 3, projects: 10 },
      { name: "C#",         level: 3, projects: 4 },
      { name: "PowerShell", level: 2, projects: 0 },
      { name: "Git",        level: 3, projects: 0 },
      { name: "Web dev",    level: 3, projects: 11 },  // Hart2Chart: 5 sites + 6 dashboards
      { name: "Rust",       level: 1, projects: 0 },
    ]},
    { name: "Applied AI", skills: [
      { name: "Machine learning",    level: 4, projects: 6 },
      { name: "Claude",              level: 5, projects: 13 },
      { name: "ChatGPT",             level: 2, projects: 12 },
      { name: "Agent orchestration", level: 3, projects: 4 },
      { name: "RAG",                 level: 2, projects: 1 },
      { name: "Copilot",             level: 2, projects: 1 },
    ]},
    { name: "Leadership", skills: [
      { name: "Project management", level: 3, projects: 16 },
      { name: "Public speaking",    level: 5, projects: 10 },
      { name: "Teaching",           level: 3, projects: 2 },
    ]},
  ],

  // Featured projects. `skills` must use names that exactly match skill names above.
  projects: [
    { title: "USDA production forecasting", outcome: "Forecasts up to 1 year ahead; flagged 1.2% of data as outliers",
      linkLabel: "Blog post", url: "blog/usda-meat-poultry-forecasting.html",
      skills: ["Python", "Machine learning"] },
    { title: "Minesweeper RL agent", outcome: "Deep RL beat Q-learning, converging in about 900 episodes",
      linkLabel: "Blog post", url: "blog/minesweeper-reinforcement-learning.html",
      skills: ["Python", "Machine learning"] },
    { title: "Store sales forecasting", outcome: "Automated forecast emails saved 10 hours a week",
      linkLabel: "Blog post", url: "blog/store-sales-gradient-boosting.html",
      skills: ["Machine learning", "Dashboards"] },
    { title: "RuneScape hiscores analysis", outcome: "Modeled 2 million players; random forest reached R² 0.76",
      linkLabel: "Blog post", url: "blog/runescape-hiscores-analysis.html",
      skills: ["Python", "Machine learning"] },
    { title: "Solar for rural Kenya", outcome: "Co-led a solar install that lit 24 rural homes",
      linkLabel: "Blog post", url: "blog/kenya-solar-installation.html",
      skills: ["Project management", "Teaching"] },
    { title: "Writing tracker", outcome: "Tracked 151,170 words over six months in R Shiny",
      linkLabel: "Blog post", url: "blog/writing-tracker-shiny-app.html",
      skills: ["R"] },
    { title: "Code commenter", outcome: "Fine-tuned T5 to write Python docstrings; rated 1.43 of 2",
      linkLabel: "Blog post", url: "blog/code-commenting-llm.html",
      skills: ["Python", "Machine learning"] },
    { title: "Card price scanner", outcome: "Designed a photo-to-price card app with full UML",
      linkLabel: "Blog post", url: "blog/trading-card-price-scanner.html",
      skills: ["Project management"] },
    { title: "Poudre Valley REA", outcome: "8 automations saving 200+ hours a year; AI training for 60 staff",
      linkLabel: "Blog post", url: "blog/my-time-at-poudre-valley-rea.html",
      skills: ["Power BI", "SQL", "Dashboards", "Data governance", "API integration", "Python", "PowerShell", "C#", "Git", "Azure", "RAG", "Copilot", "Teaching"] },
    { title: "Poker RL research", outcome: "10M simulated games; Deep CFR beat tabular by 40% on bb/100",
      linkLabel: "Blog post", url: "blog/my-time-as-a-poker-data-scientist.html",
      skills: ["Python", "Machine learning"] },
    { title: "Hart2Chart", outcome: "Ran a web and dashboard practice with a 5-star rating",
      linkLabel: "Blog post", url: "blog/my-time-at-hart2chart.html",
      skills: ["Web dev", "HTML", "JavaScript", "Dashboards", "Project management"] },
  ],
};

(() => {
  const $ = (id) => document.getElementById(id);
  if (!$("sm-cols")) return;
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  const allSkills = DATA.areas.flatMap(a => a.skills);
  const MAX_CERTS = 3;
  const certsOf = s => {
    const c = Array.isArray(s.certs) ? s.certs : Array(Math.max(0, s.certs | 0)).fill("");
    return c.slice(0, MAX_CERTS);
  };
  const skillNames = new Set(allSkills.map(s => s.name));

  // Validation (warn only)
  allSkills.forEach(s => {
    if (!(s.level >= 1 && s.level <= 5)) console.warn(`[skills] ${s.name}: level must be 1–5`);
    const n = Array.isArray(s.certs) ? s.certs.length : (s.certs | 0);
    if (n > MAX_CERTS) console.warn(`[skills] ${s.name}: at most ${MAX_CERTS} certifications are shown`);
  });
  DATA.projects.forEach(p => p.skills.forEach(n => { if (!skillNames.has(n)) console.warn(`[skills] "${p.title}" references unknown skill "${n}"`); }));

  // KPIs
  const kpis = [
    [DATA.projectsDelivered, "Projects delivered"],
    [allSkills.length, "Core competencies"],
    [allSkills.reduce((n, s) => n + certsOf(s).length, 0), "Certifications"],
    [`${DATA.yearsLeading} yrs`, "Leading delivery"],
  ];
  $("sm-kpis").innerHTML = kpis.map(([v, l]) => `<div class="sm-kpi"><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join("");

  // Legend
  $("sm-legend").innerHTML =
    `<span class="sm-legend-scale">Hobbyist ${LEVELS.map(l => `<i style="background:${l.color}"></i>`).join("")} Master</span>` +
    `<span><span class="sm-cert" aria-hidden="true">✓</span> One per certification</span>`;

  // Balance areas into two columns
  const rowsOf = a => a.skills.length + 1;
  const total = DATA.areas.reduce((n, a) => n + rowsOf(a), 0);
  let best = 1, bestDiff = Infinity, run = 0;
  DATA.areas.forEach((a, i) => {
    run += rowsOf(a);
    const diff = Math.abs(total - 2 * run);
    if (i < DATA.areas.length - 1 && diff < bestDiff) { bestDiff = diff; best = i + 1; }
  });
  const columns = [DATA.areas.slice(0, best), DATA.areas.slice(best)];

  const headerHTML = `<div class="sm-head" aria-hidden="true"><span></span>` +
    LEVELS.map((l, i) => `<span><em data-level="${i}">${l.name}</em></span>`).join("") +
    `<span><em>Projects</em></span><span></span></div>`;

  const certHTML = s => {
    const c = certsOf(s);
    if (!c.length) return `<span class="sm-cert"></span>`;
    const names = c.filter(Boolean).join(", ");
    return `<span class="sm-cert"${names ? ` title="${esc(names)}"` : ""}><span aria-hidden="true">${"✓".repeat(c.length)}</span></span>`;
  };
  const rowHTML = s => {
    const blocks = LEVELS.map((l, i) =>
      `<span class="sm-block"${i < s.level ? ` style="background:${l.color};border-color:${l.color}"` : ""}></span>`).join("");
    const c = certsOf(s), names = c.filter(Boolean).join(", ");
    const certText = c.length ? `, ${c.length} certification${c.length > 1 ? "s" : ""}${names ? ` (${names})` : ""}` : "";
    const label = `${s.name}: ${LEVELS[s.level - 1].name}, ${s.projects} projects${certText}`;
    return `<div class="sm-row" role="button" tabindex="0" aria-pressed="false" data-skill="${esc(s.name)}" aria-label="${esc(label)}">` +
      `<span class="sm-name">${esc(s.name)}</span>${blocks}` +
      `<span class="sm-count">${s.projects || "–"}</span>` +
      certHTML(s) + `</div>`;
  };

  $("sm-cols").innerHTML = columns.map(areas =>
    `<div>${headerHTML}${areas.map(a => `<div class="sm-area">${esc(a.name)}</div>${a.skills.map(rowHTML).join("")}`).join("")}</div>`
  ).join("");

  // Cards
  $("sm-cards").innerHTML = DATA.projects.map((p, i) =>
    `<div class="sm-card" role="button" tabindex="0" aria-pressed="false" data-project="${i}">` +
      `<div class="sm-card-top"><span class="sm-card-title">${esc(p.title)}</span>` +
      `<a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.linkLabel)} ↗</a></div>` +
      `<div class="sm-outcome">${esc(p.outcome)}</div>` +
      `<div class="sm-skills">${p.skills.map(esc).join(" · ")}</div></div>`
  ).join("");

  // ---- Two-way linking ----
  const root = document.querySelector(".sm");
  const rows = [...root.querySelectorAll(".sm-row")];
  const cards = [...root.querySelectorAll(".sm-card")];
  let pinned = null; // the pinned row or card element

  function clear() {
    [...rows, ...cards].forEach(e => e.classList.remove("is-dim", "is-on"));
  }
  function showSkill(row) {
    const name = row.dataset.skill;
    rows.forEach(r => r.classList.toggle("is-dim", r !== row));
    row.classList.add("is-on");
    cards.forEach((c, i) => {
      const hit = DATA.projects[i].skills.includes(name);
      c.classList.toggle("is-dim", !hit);
      c.classList.toggle("is-on", hit);
    });
  }
  function showProject(card) {
    const skills = DATA.projects[+card.dataset.project].skills;
    cards.forEach(c => c.classList.toggle("is-dim", c !== card));
    card.classList.add("is-on");
    rows.forEach(r => {
      const hit = skills.includes(r.dataset.skill);
      r.classList.toggle("is-dim", !hit);
      r.classList.toggle("is-on", hit);
    });
  }
  const show = el => (el.classList.contains("sm-row") ? showSkill(el) : showProject(el));
  function restore() { clear(); if (pinned) show(pinned); }

  function togglePin(el) {
    if (pinned) { pinned.classList.remove("is-pinned"); pinned.setAttribute("aria-pressed", "false"); }
    if (pinned === el) { pinned = null; clear(); return; }
    pinned = el;
    el.classList.add("is-pinned"); el.setAttribute("aria-pressed", "true");
    clear(); show(el);
  }

  [...rows, ...cards].forEach(el => {
    el.addEventListener("mouseenter", () => { clear(); show(el); });
    el.addEventListener("mouseleave", restore);
    el.addEventListener("focus", () => { clear(); show(el); });
    el.addEventListener("blur", restore);
    el.addEventListener("click", e => { if (e.target.closest("a")) return; togglePin(el); });
    el.addEventListener("keydown", e => {
      if (e.target !== el) return; // let Enter on the card's link open it
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); togglePin(el); }
    });
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && pinned) togglePin(pinned); });
  document.addEventListener("click", e => { if (pinned && !e.target.closest(".sm-row, .sm-card")) togglePin(pinned); });

  // ---- Level definition tooltips on rotated headers ----
  const tip = document.createElement("div");
  tip.className = "sm-tip"; tip.hidden = true; tip.setAttribute("role", "tooltip");
  document.body.appendChild(tip);
  root.querySelectorAll(".sm-head em[data-level]").forEach(em => {
    const l = LEVELS[+em.dataset.level];
    em.addEventListener("mouseenter", () => {
      tip.innerHTML = `<b>${esc(l.name)}</b><br>${esc(l.desc)}`;
      tip.hidden = false;
      const r = em.getBoundingClientRect();
      tip.style.left = `${r.left + window.scrollX}px`;
      tip.style.top = `${r.top + window.scrollY - tip.offsetHeight - 6}px`;
    });
    em.addEventListener("mouseleave", () => { tip.hidden = true; });
  });
})();
