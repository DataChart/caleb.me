/* Skills matrix: edit LEVELS and DATA below. The KPIs, table, cards and the Certifications section are all generated from them.
   Certifications: list each one once in DATA.certifications with the skill names it covers. Each skill gets one
   check mark per certification that names it (up to three), and the names show as a tooltip on the checks.
   Layout: each area has `column: "left"` or `column: "right"`; areas render top-to-bottom in the order listed. */

const LEVELS = [
  { name: "Hobbyist", color: "#85B7EB", desc: "Personal or learning projects; working knowledge." },
  { name: "Junior",   color: "#378ADD", desc: "Delivered production work with guidance." },
  { name: "Senior",   color: "#7F77DD", desc: "Leads delivery independently; mentors others." },
  { name: "Expert",   color: "#D4537E", desc: "Go-to person; designs systems and sets standards." },
  { name: "Master",   color: "#E24B4A", desc: "Deep authority; teaches, publishes, or certifies others." },
];

const DATA = {
  // Manually set: total projects ever delivered (not all are listed as cards).
  projectsDelivered: 110,
  yearsLeading: 2,

  areas: [
    // ---- Left column ----
    { name: "Leadership", column: "left", skills: [
      { name: "Public speaking",    level: 5, projects: 18 },
      { name: "Project management", level: 3, projects: 40 },
      { name: "Teaching",           level: 3, projects: 9 },
      { name: "Data governance",    level: 3, projects: 3 },
    ]},
    { name: "Cloud Services", column: "left", skills: [
      { name: "Azure",        level: 3, projects: 8 },
      { name: "AWS",          level: 1, projects: 0 },
      { name: "Google Cloud", level: 1, projects: 0 },
    ]},
    { name: "Data engineering", column: "left", skills: [
      { name: "Power BI",        level: 5, projects: 38 },
      { name: "SSMS",            level: 5, projects: 38 },
      { name: "Pandas",          level: 4, projects: 21 },
      { name: "SSIS",            level: 3, projects: 12 },
      { name: "API integration", level: 3, projects: 4 },
      { name: "ArcGIS",          level: 2, projects: 12 },
      { name: "Polars",          level: 1, projects: 2 },
    ]},

    // ---- Right column ----
    { name: "Applied AI", column: "right", skills: [
      { name: "Claude",              level: 5, projects: 13 },
      { name: "Copilot",             level: 5, projects: 12 },
      { name: "Machine learning",    level: 4, projects: 12 },
      { name: "Agent orchestration", level: 3, projects: 4 },
      { name: "ChatGPT",             level: 2, projects: 3 },
      { name: "RAG",                 level: 2, projects: 8 },
    ]},
    { name: "Software development", column: "right", skills: [
      { name: "SQL",              level: 5, projects: "50+" },
      { name: "Python",           level: 5, projects: 22 },
      { name: "HTML",             level: 5, projects: 35 },
      { name: "R",                level: 4, projects: 10 },
      { name: "Git",              level: 4, projects: 30 },
      { name: "JavaScript",       level: 3, projects: 35 },
      { name: "C#",               level: 3, projects: 12 },
      { name: "CSS",              level: 2, projects: 18 },
      { name: "C++",              level: 2, projects: 8 },
      { name: "PowerShell(Bash)", level: 2, projects: 7 },
      { name: "Rust",             level: 1, projects: 1 },
      { name: "COBOL",            level: 1, projects: 1 },
      { name: "Java",             level: 1, projects: 1 },
    ]},
  ],

  // Certifications, shown as check marks on the skills above and as cards in the Certifications section.
  // `skills` must use names that exactly match skill names above (or be empty). `issuer`, `issued`, `expires`,
  // `credentialId` and `url` are optional.
  // `issued` and `expires` are display text such as "Nov 2026". Newest first.
  certifications: [
    { name: "Microsoft Certified: Azure AI Fundamentals (AI-900)", issuer: "Microsoft", issued: "Nov 2026",
      skills: ["Azure", "Machine learning"] },
    { name: "Microsoft Certified: Azure Fundamentals (AZ-900)", issuer: "Microsoft", issued: "Oct 2026",
      credentialId: "6BE9B7EF7103213A", skills: ["Azure"] },
    { name: "Facilitation Skills for Managers and Leaders", issuer: "LinkedIn", issued: "Aug 2026", skills: [] },
    { name: "Advanced SQL", issuer: "Kaggle", issued: "Aug 2026", skills: ["SQL"] },
    { name: "Irreplaceable: The Art of Standing Out in the Age of AI", issuer: "LinkedIn", issued: "Aug 2026", skills: [] },
    { name: "Complete Guide to Power BI for Data Analysts by Microsoft Press (2024)", issuer: "LinkedIn", issued: "Aug 2026",
      skills: ["Power BI"] },
    { name: "Data Cleaning", issuer: "Kaggle", issued: "Jun 2023", skills: ["Pandas"] },
    { name: "Pandas", issuer: "Kaggle", issued: "Nov 2021", skills: ["Pandas"] },
    { name: "Python", issuer: "Kaggle", issued: "Nov 2021", skills: ["Python"] },
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
      skills: ["Machine learning"] },
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
      skills: ["Power BI", "SQL", "Data governance", "API integration", "Python", "PowerShell(Bash)", "C#", "Git", "Azure", "RAG", "Copilot", "Teaching"] },
    { title: "Poker RL research", outcome: "10M simulated games; Deep CFR beat tabular by 40% on bb/100",
      linkLabel: "Blog post", url: "blog/my-time-as-a-poker-data-scientist.html",
      skills: ["Python", "Machine learning"] },
    { title: "Hart2Chart", outcome: "Ran a web and dashboard practice with a 5-star rating",
      linkLabel: "Blog post", url: "blog/my-time-at-hart2chart.html",
      skills: ["HTML", "JavaScript", "Project management"] },
    { title: "Atlas Research Desk", outcome: "Three agents published 68 posts; 3,405 claims checked, 0 fabricated sources",
      linkLabel: "Blog post", url: "blog/atlas-research-desk-month-of-agents.html",
      skills: ["Claude", "Agent orchestration"] },
    { title: "Interview RAG demo", outcome: "Local chatbot over 247 web pages and 73 PDFs, built for an interview",
      linkLabel: "Blog post", url: "blog/rag-interview-demo.html",
      skills: ["Python", "RAG", "Machine learning"] },
  ],
};

(() => {
  const $ = (id) => document.getElementById(id);
  if (!$("sm-cols")) return;
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  const allSkills = DATA.areas.flatMap(a => a.skills);
  const MAX_CERTS = 3;
  const CERTS = DATA.certifications || [];
  const allCertsOf = s => CERTS.filter(c => c.skills.includes(s.name)).map(c => c.name);
  const certsOf = s => allCertsOf(s).slice(0, MAX_CERTS);
  const skillNames = new Set(allSkills.map(s => s.name));

  // Validation (warn only)
  allSkills.forEach(s => {
    if (!(s.level >= 1 && s.level <= 5)) console.warn(`[skills] ${s.name}: level must be 1–5`);
    if (allCertsOf(s).length > MAX_CERTS) console.warn(`[skills] ${s.name}: at most ${MAX_CERTS} certifications are shown`);
  });
  DATA.areas.forEach(a => {
    if (a.column !== "left" && a.column !== "right") console.warn(`[skills] area "${a.name}": column must be "left" or "right"`);
  });
  DATA.projects.forEach(p => p.skills.forEach(n => { if (!skillNames.has(n)) console.warn(`[skills] "${p.title}" references unknown skill "${n}"`); }));
  CERTS.forEach(c => c.skills.forEach(n => { if (!skillNames.has(n)) console.warn(`[skills] certification "${c.name}" references unknown skill "${n}"`); }));

  // KPIs
  const kpis = [
    [DATA.projectsDelivered, "Projects delivered"],
    [allSkills.length, "Core competencies"],
    [CERTS.length, "Certifications"],
    [`${DATA.yearsLeading} yrs`, "Leading delivery"],
  ];
  $("sm-kpis").innerHTML = kpis.map(([v, l]) => `<div class="sm-kpi"><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join("");

  // Fixed two-column layout (set by each area's `column` property)
  const columns = [
    DATA.areas.filter(a => a.column === "left"),
    DATA.areas.filter(a => a.column === "right"),
  ];

  const headerHTML = `<div class="sm-head" aria-hidden="true"><span></span>` +
    LEVELS.map((l, i) => `<span><em data-level="${i}">${l.name}</em></span>`).join("") +
    `<span><em>Projects</em></span><span><em>Certifications</em></span></div>`;

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

  // Certifications section (full width, below the skills)
  const certList = $("cert-list");
  if (certList) {
    certList.innerHTML = CERTS.map(c => {
      const meta = [c.issuer, c.issued && `Issued ${c.issued}`, c.expires && `Expires ${c.expires}`,
        c.credentialId && `ID ${c.credentialId}`].filter(Boolean).join(" · ");
      const title = c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.name)} <span aria-hidden="true">↗</span></a>` : esc(c.name);
      return `<li class="cert-card"><span class="cert-check" aria-hidden="true">✓</span>` +
        `<div><div class="cert-name">${title}</div>` +
        (meta ? `<div class="cert-meta">${esc(meta)}</div>` : "") +
        (c.skills.length ? `<div class="cert-skills">${c.skills.map(esc).join(" · ")}</div>` : "") + `</div></li>`;
    }).join("");
  }

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
