/* Blog tab: search, category filter and sort. Cards carry data-date (YYYY-MM-DD) and data-category. */
(() => {
  const list = document.querySelector(".post-cards");
  const q = document.getElementById("blog-q");
  const sort = document.getElementById("blog-sort");
  if (!list || !q || !sort) return;
  const chips = [...document.querySelectorAll(".blog-filter .chip")];
  const count = document.getElementById("blog-count");
  const empty = document.getElementById("blog-empty");
  // Remember each card's original position so same-day posts keep a stable order.
  const cards = [...list.querySelectorAll(".post-card")].map((el, i) => ({
    el, i,
    date: el.dataset.date || "",
    cat: el.dataset.category || "",
    title: el.querySelector("h3").textContent.trim(),
    text: el.textContent.toLowerCase(),
  }));
  let cat = "";

  const order = {
    new: (a, b) => b.date.localeCompare(a.date) || b.i - a.i,
    old: (a, b) => a.date.localeCompare(b.date) || a.i - b.i,
    az:  (a, b) => a.title.localeCompare(b.title),
    za:  (a, b) => b.title.localeCompare(a.title),
  };

  function render() {
    const terms = q.value.toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    [...cards].sort(order[sort.value] || order.new).forEach(c => {
      const hit = (!cat || c.cat === cat) && terms.every(t => c.text.includes(t));
      c.el.hidden = !hit;
      if (hit) shown++;
      list.appendChild(c.el);
    });
    count.textContent = `Showing ${shown} of ${cards.length} posts`;
    empty.hidden = shown > 0;
  }

  chips.forEach(btn => btn.addEventListener("click", () => {
    cat = btn.dataset.cat;
    chips.forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
    render();
  }));
  q.addEventListener("input", render);
  sort.addEventListener("change", render);
  render();
})();
