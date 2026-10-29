# Roadmap

What's next for caleb.me. Check items off as they ship.

## Next steps

- [ ] **Link the resume.** Add a PDF resume (e.g. `assets/caleb-hart-resume.pdf`) and link it from the side panel next to LinkedIn, GitHub and email, for anyone who wants more context.
- [ ] **Blog posts for school projects.** One post per project: the problem, what was built, the tools used, and what was learned. Link each one under the skill pills it uses.
- [x] **Blog post: Hart2Chart.** The story and the work behind it.
- [ ] **Blog post: poker career.** Expected value, bankroll management, reading tendencies and making calls with incomplete information map cleanly onto data work and forecasting. A strong, memorable "why I think this way" post.
- [ ] **Atlas Research Desk products.** Write up what the desk produces (research posts, cycle reviews, the QA pipeline) and how it works, then link it from the Research Desk tab and the Claude / Multi-Agent Systems pills.
- [ ] **Backtest mobile compatibility.** Check every tab and every blog post on real phones (iOS Safari, Android Chrome) at 360–430px wide: the tab bar, skill pills, project stats, holdings table and post pages. Fix anything that overflows or is hard to tap.
- [ ] **Check the existing blog posts for typos.** Known ones to start with: "its great" → "it's great", and "It's second innovation" → "Its second innovation".

## Quick wins

Small changes with an outsized effect on how the site comes across to recruiters and hiring managers.

- [ ] **Link preview image.** Add `og:image` (and `twitter:card`) so links shared on LinkedIn, Slack and text show the giraffe and name instead of a blank card. Needs a 1200×630 PNG.
- [ ] **Canonical URL and custom domain.** Point `caleb.me` (or the chosen domain) at GitHub Pages and add a `<link rel="canonical">`.
- [ ] **One-line "open to" status** in the side panel (e.g. roles, consulting, speaking) so visitors know what to reach out about.
- [ ] **Fill the Fine-tuned LLMs tab.** It's a placeholder today. Even one short write-up of a fine-tune (data, base model, eval results) makes the tab worth clicking.
- [ ] **Certifications and courses list.** The LinkedIn facilitation course and any others, with links, as proof points next to the skills.
- [ ] **Pin repos on GitHub.** Pin AtlasResearchDesk, AgentStockPortfolio and caleb.me on the DataChart profile, each with a README and a link back here.
- [ ] **Cross-post.** Add a "Read the full post at caleb.me" line to the LinkedIn originals so traffic flows to the site.
- [ ] **Accessibility and speed pass.** Run Lighthouse on the main page and one post and aim for 95+ on accessibility, best practices and SEO.

## Later

- [ ] **Speaking and teaching page.** Talks, workshops and classes, with slides or recordings where they exist.
- [ ] **Case-study format for projects.** Problem, approach, result, with a number wherever possible (time saved, accuracy, users).
- [ ] **RSS feed** (`feed.xml`) for the blog, and a `sitemap.xml`.
- [ ] **A 404 page** with the giraffe.
- [ ] **Refresh the snapshot numbers** in `index.html` for Atlas and the portfolio every month or so (see the README's live data section). Could be automated with a scheduled GitHub Action.
- [ ] **Privacy-friendly analytics** (e.g. GoatCounter or Plausible) to see which posts and projects people actually open.
