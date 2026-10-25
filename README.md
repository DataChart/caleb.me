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
assets/js/main.js       Tabs, skill filters, theme toggle and live project data
assets/img/             The 16-bit giraffe portrait (also the favicon)
tools/make_giraffe.py   Script that draws the giraffe
```

## How the page works

- **Tabs** are hash-routed (`#main`, `#research`, `#finance`, `#llms`, `#blog`). With JS off, every panel stacks on one page.
- **Skills** sit in three tiers. Each pill's shape and color give its type: orange circle for software, white square for languages, purple diamond for soft skills. The legend buttons filter by type.
- **Project links under a pill** are the small numbered buttons. Each one links to a blog post or project that uses the skill. A pill with nothing to show yet has no buttons.
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
4. Optionally, add a numbered `.ln` button under any skill pill it relates to.

## Regenerate the giraffe

```sh
pip install numpy pillow
python3 tools/make_giraffe.py assets/img/giraffe-16bit
```

This writes `giraffe-16bit.svg` plus a 10x PNG preview. Delete the preview before committing.

## Roadmap

Planned work and quick wins are in [ROADMAP.md](ROADMAP.md).

## Easter eggs

Open the browser console.
