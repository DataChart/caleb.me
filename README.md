# caleb.me

Personal portfolio site for Caleb Hart: AI, automation, business intelligence and education.

Plain HTML, CSS and a little JavaScript. No framework, no build step, no dependencies.

## Run it locally

Open `index.html` in a browser, or serve the folder so the live project data can load:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

The site is static, so GitHub Pages can serve it straight from `main`:
**Settings → Pages → Deploy from a branch → `main` / root**.

## Layout

```
index.html              Main page: header, tabs and every tab panel
blog/*.html             One page per blog post
assets/css/style.css    All styles, with light and dark theme tokens at the top
assets/js/main.js       Tabs, theme toggle and live project data
assets/js/skills-matrix.js  Skills data and the matrix built from it
assets/img/             The 16-bit giraffe portraits: sunset for dark mode (also the favicon), sunrise for light mode
tools/make_giraffe.py   Script that draws the giraffe
```

## How the page works

- **Tabs** are hash-routed (`#main`, `#research`, `#finance`, `#llms`, `#blog`). With JS off, every panel stacks on one page.
- **Skills** is a matrix generated from `LEVELS` and `DATA` at the top of `assets/js/skills-matrix.js`. Each skill has a level from 1 (Hobbyist) to 5 (Master), a project count and optional `certs`: a count from 1 to 3, or a list of up to three certificate names (shown as a tooltip), each drawn as its own check mark. The KPI strip, legend, two-column table and "Selected engagements" cards are all built from that data, so editing it is the only upkeep. Hover or tap a skill to see the projects that use it, and the reverse. A project that names a skill that doesn't exist logs a warning in the console.
- **Theme** follows the system setting. The footer button overrides it, and the choice is saved in `localStorage`.

## Live project data

The Research Desk and Finance tabs show projects that redeploy daily, so their cards fetch fresh data on page load:

| Card | Source |
|---|---|
| Atlas Research Desk | `https://datachart.github.io/AtlasResearchDesk/api/metrics.json` and `/api/posts.json` |
| Agent Stock Portfolio | `https://datachart.github.io/AgentStockPortfolio/data/portfolio.json` |
| "Last commit" line on both | GitHub API, `repos/DataChart/<repo>/commits?per_page=1` |

The HTML holds a snapshot of every figure. If a request fails (for example mid-redeploy, or with JS off), the snapshot stays in place and the "last commit" line hides itself. Refresh the snapshot numbers in `index.html` now and then so they don't drift too far.

## Add a blog post

1. Copy one of the files in `blog/` and rename it with a short slug, e.g. `blog/my-new-post.html`.
2. Change the `<title>`, the meta description, the tag, the `<h1>`, the "Originally posted on LinkedIn" link (or delete that box), and the `<article>` body.
3. Add a card for it to the `<ol class="post-cards">` list in the Blog panel of `index.html`.

## Regenerate the giraffe

```sh
pip install numpy pillow
python3 tools/make_giraffe.py assets/img/giraffe-16bit              # sunset, shown in dark mode
python3 tools/make_giraffe.py assets/img/giraffe-16bit-day sunrise  # sunrise, shown in light mode
```

Each run writes the SVG plus a 10x PNG preview. Delete the preview before committing.

## Roadmap

Planned work and quick wins are in [ROADMAP.md](ROADMAP.md).

## Easter eggs

Open the browser console.
