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
tools/build_seo.py      Regenerates SEO tags, sitemap.xml, feed.xml, llms.txt, llms-full.txt
robots.txt              Lets search engines and AI crawlers in; points to the sitemap
humans.txt              Who made the site
assets/img/og-card.png  1200×630 link-preview image
```

## How the page works

- **Tabs** are hash-routed (`#main`, `#research`, `#finance`, `#llms`, `#blog`). With JS off, every panel stacks on one page.
- **Skills** is a matrix generated from `LEVELS` and `DATA` at the top of `assets/js/skills-matrix.js`. Each skill has a level from 1 (Hobbyist) to 5 (Master), and a project count. Certifications live once each in `DATA.certifications`, with the skills they cover: each skill gets one check mark per certification that names it (up to three, names shown as a tooltip), and the same list draws the full-width Certifications section below the skills. The KPI strip, two-column table, "Selected engagements" cards and Certifications section are all built from that data, so editing it is the only upkeep. Hover or tap a skill to see the projects that use it, and the reverse. A project that names a skill that doesn't exist logs a warning in the console.
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
2. Change the `<title>`, the meta description, the tag, the `<h1>`, the "Posted" date under it, the "Originally posted on LinkedIn" link (or delete that box), and the `<article>` body.
3. Add a card for it to the `<ol class="post-cards">` list in the Blog panel of `index.html`. Give the `<li>` a `data-date="YYYY-MM-DD"` (used for sorting) and a `data-category` matching one of the filter chips (`Projects`, `Work`, `Leadership` or `AI notes`), and put the same date in the card's `<time class="post-date">`. Card order in the file doesn't matter; the Blog tab sorts newest first.
4. Run `python3 tools/build_seo.py`. It adds the canonical URL, Open Graph, Twitter card and JSON-LD to the new post, and rebuilds `sitemap.xml`, `feed.xml`, `llms.txt` and `llms-full.txt`.

## Search and AI discoverability

- Every page has a `<!-- seo:start -->` block written by `tools/build_seo.py`. Don't edit it by hand; change the script (names, roles, keywords, skills) and rerun it.
- The home page carries `Person`, `WebSite`, `ProfilePage` and `Blog` structured data. Each post carries `BlogPosting` and `BreadcrumbList`.
- `llms.txt` (the [llmstxt.org](https://llmstxt.org) format) is a short map of the site for AI assistants; `llms-full.txt` has the full text of every post.
- **Base URL.** `SITE_URL` in the script is `https://datachart.github.io/caleb.me/`. When a custom domain is set up, change it there, update the `Sitemap:` line in `robots.txt`, and rerun.
- **robots.txt caveat.** Crawlers only read `robots.txt` at a host's root, so on a GitHub project page (`/caleb.me/`) it isn't picked up. That's fine (GitHub Pages already allows crawling), but it starts working once the site has its own domain.
- **After deploying**, submit `sitemap.xml` in [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters) (Bing also feeds ChatGPT and Copilot search).

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
