#!/usr/bin/env python3
"""Regenerate the site's search and AI-discoverability files.

Run from the repo root after adding or editing a blog post:

    python3 tools/build_seo.py

It rewrites, in place:
  * the <!-- seo:start --> ... <!-- seo:end --> block in index.html and every blog/*.html
    (canonical URL, Open Graph, Twitter card, JSON-LD structured data)
  * sitemap.xml   - every page, with last-modified dates, for Google and Bing
  * feed.xml      - RSS feed of blog posts
  * llms.txt      - short Markdown map of the site for AI assistants (llmstxt.org)
  * llms-full.txt - the full plain text of the profile and every post, for AI assistants

Standard library only. Change SITE_URL once a custom domain is pointed at GitHub Pages.
"""

from __future__ import annotations

import datetime as dt
import html
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

SITE_URL = "https://datachart.github.io/caleb.me/"
ROOT = Path(__file__).resolve().parent.parent

NAME = "Caleb Hart"
TAGLINE = "Data Scientist, Data Engineer & AI Solutions Specialist"
JOB_TITLES = [
    "Data Scientist",
    "Data Analyst",
    "Data Engineer",
    "AI Solutions Specialist",
    "Business Intelligence Analyst",
]
SUMMARY = (
    "Caleb Hart is a data scientist and data engineer who builds AI, machine learning, "
    "RAG and business intelligence solutions in Python, SQL and Power BI, and teaches "
    "people how to use AI well."
)
KEYWORDS = [
    "Caleb Hart", "data scientist", "data analyst", "data engineer", "AI solutions specialist",
    "business intelligence analyst", "BI analyst", "BI developer", "machine learning engineer",
    "applied AI", "AI engineer", "Python developer", "SQL", "Power BI", "SSIS", "SSMS", "Azure",
    "pandas", "Polars", "R", "R Shiny", "machine learning", "deep learning",
    "reinforcement learning", "time series forecasting", "XGBoost", "LightGBM", "NLP",
    "large language models", "LLM fine-tuning", "RAG", "retrieval augmented generation",
    "AI agents", "multi-agent systems", "agent orchestration", "Claude", "ChatGPT", "Copilot",
    "data governance", "ETL", "data pipelines", "dashboards", "data visualization",
    "automation", "AI training", "public speaking", "Colorado", "hire data scientist",
    "data science portfolio",
]
KNOWS_ABOUT = [
    "Data science", "Machine learning", "Deep learning", "Reinforcement learning",
    "Time series forecasting", "Natural language processing", "Large language models",
    "Retrieval-augmented generation", "AI agents", "Agent orchestration", "Business intelligence",
    "Data engineering", "ETL", "Data governance", "Data visualization", "Statistics",
    "Python", "SQL", "R", "R Shiny", "JavaScript", "HTML", "C#", "C++", "Git",
    "pandas", "Polars", "XGBoost", "LightGBM", "Power BI", "SSIS", "SSMS",
    "Microsoft Azure", "ArcGIS", "Claude", "ChatGPT", "Microsoft Copilot",
    "Project management", "Public speaking", "Teaching",
]
SAME_AS = [
    "https://www.linkedin.com/in/caleb-e-hart",
    "https://github.com/DataChart",
]
OG_IMAGE = SITE_URL + "assets/img/og-card.png"
OG_IMAGE_ALT = "Caleb Hart: data scientist, data engineer, AI solutions. A 16-bit pixel-art giraffe at sunset."

START, END = "<!-- seo:start -->", "<!-- seo:end -->"
PERSON_ID = SITE_URL + "#person"
WEBSITE_ID = SITE_URL + "#website"


# ---------- page parsing ----------

class TextExtractor(HTMLParser):
    """Collects readable text from a fragment, keeping paragraph and code breaks."""

    BLOCK = {"p", "li", "h1", "h2", "h3", "h4", "pre", "tr", "blockquote", "figcaption", "br", "div"}
    SKIP = {"script", "style", "svg", "button"}

    def __init__(self):
        super().__init__()
        self.parts: list[str] = []
        self.skip = 0
        self.pre = 0

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP:
            self.skip += 1
        elif tag in ("h2", "h3", "h4"):
            self.parts.append("\n\n" + "#" * int(tag[1]) + " ")
        elif tag == "li":
            self.parts.append("\n- ")
        elif tag == "pre":
            self.pre += 1
            self.parts.append("\n\n```\n")
        elif tag in self.BLOCK:
            self.parts.append("\n\n")

    def handle_endtag(self, tag):
        if tag in self.SKIP:
            self.skip = max(0, self.skip - 1)
        elif tag == "pre":
            self.pre = max(0, self.pre - 1)
            self.parts.append("\n```\n")

    def handle_data(self, data):
        if self.skip:
            return
        self.parts.append(data if self.pre else re.sub(r"\s+", " ", data))

    def text(self) -> str:
        out = "".join(self.parts)
        out = re.sub(r"[ \t]+\n", "\n", out)
        out = re.sub(r"\n- \s*\n", "\n", out)
        out = re.sub(r"\n{3,}", "\n\n", out)
        return out.strip()


def first(pattern: str, text: str, default: str = "") -> str:
    m = re.search(pattern, text, re.S)
    return html.unescape(m.group(1).strip()) if m else default


def strip_tags(fragment: str) -> str:
    p = TextExtractor()
    p.feed(fragment)
    return p.text()


def read_post(path: Path) -> dict:
    src = path.read_text(encoding="utf-8")
    title = first(r'<h1 class="post-title">(.*?)</h1>', src) or first(r"<title>(.*?)</title>", src)
    title = re.sub(r"<[^>]+>", "", title)
    body = first(r'<article class="post-body">(.*?)</article>', src)
    return {
        "path": path,
        "slug": path.stem,
        "url": SITE_URL + "blog/" + path.name,
        "title": title,
        "description": first(r'<meta name="description" content="(.*?)">', src),
        "tag": re.sub(r"<[^>]+>", "", first(r'<p class="post-tag">(.*?)</p>', src)),
        "date": first(r'<p class="post-date">.*?<time datetime="([\d-]+)"', src),
        "text": strip_tags(body),
    }


# ---------- head blocks ----------

def meta_block(lines: list[str], graph: list[dict]) -> str:
    ld = json.dumps({"@context": "https://schema.org", "@graph": graph}, indent=2, ensure_ascii=False)
    ld = ld.replace("</", "<\\/")
    return "\n".join([START, *lines, '<script type="application/ld+json">', ld, "</script>", END])


def attr(s: str) -> str:
    return html.escape(s, quote=True)


def social_tags(*, url, title, description, og_type, extra=()) -> list[str]:
    return [
        f'<link rel="canonical" href="{url}">',
        '<meta name="author" content="Caleb Hart">',
        '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">',
        '<meta name="theme-color" content="#0e0c15">',
        f'<link rel="alternate" type="application/rss+xml" title="Caleb Hart · Blog" href="{SITE_URL}feed.xml">',
        f'<link rel="alternate" type="text/markdown" title="llms.txt" href="{SITE_URL}llms.txt">',
        '<meta property="og:site_name" content="Caleb Hart">',
        '<meta property="og:locale" content="en_US">',
        f'<meta property="og:type" content="{og_type}">',
        f'<meta property="og:url" content="{url}">',
        f'<meta property="og:title" content="{attr(title)}">',
        f'<meta property="og:description" content="{attr(description)}">',
        f'<meta property="og:image" content="{OG_IMAGE}">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        '<meta property="og:image:type" content="image/png">',
        f'<meta property="og:image:alt" content="{attr(OG_IMAGE_ALT)}">',
        *extra,
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{attr(title)}">',
        f'<meta name="twitter:description" content="{attr(description)}">',
        f'<meta name="twitter:image" content="{OG_IMAGE}">',
        f'<meta name="twitter:image:alt" content="{attr(OG_IMAGE_ALT)}">',
    ]


def person() -> dict:
    return {
        "@type": "Person",
        "@id": PERSON_ID,
        "name": NAME,
        "givenName": "Caleb",
        "familyName": "Hart",
        "url": SITE_URL,
        "image": OG_IMAGE,
        "description": SUMMARY,
        "jobTitle": JOB_TITLES,
        "hasOccupation": [
            {"@type": "Occupation", "name": t, "occupationLocation": {"@type": "Country", "name": "United States"}}
            for t in JOB_TITLES
        ],
        "knowsAbout": KNOWS_ABOUT,
        "knowsLanguage": "en",
        "alumniOf": {
            "@type": "CollegeOrUniversity",
            "name": "Oregon Institute of Technology",
            "sameAs": "https://www.oit.edu/",
        },
        "memberOf": [
            {"@type": "Organization", "name": "Statistics Without Borders"},
            {"@type": "Organization", "name": "NoCo Cybersecurity"},
            {"@type": "Organization", "name": "Fort Collins AI Group"},
        ],
        "homeLocation": {"@type": "Place", "address": {"@type": "PostalAddress", "addressRegion": "CO", "addressCountry": "US"}},
        "sameAs": SAME_AS,
    }


def website() -> dict:
    return {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        "url": SITE_URL,
        "name": "Caleb Hart",
        "alternateName": "caleb.me",
        "description": SUMMARY,
        "inLanguage": "en-US",
        "author": {"@id": PERSON_ID},
        "publisher": {"@id": PERSON_ID},
    }


def index_block(posts: list[dict]) -> str:
    title = f"{NAME} · {TAGLINE}"
    lines = social_tags(
        url=SITE_URL, title=title, description=SUMMARY, og_type="profile",
        extra=['<meta property="profile:first_name" content="Caleb">',
               '<meta property="profile:last_name" content="Hart">'],
    )
    lines.insert(2, f'<meta name="keywords" content="{attr(", ".join(KEYWORDS))}">')
    graph = [
        person(),
        website(),
        {
            "@type": "ProfilePage",
            "@id": SITE_URL + "#profile",
            "url": SITE_URL,
            "name": title,
            "isPartOf": {"@id": WEBSITE_ID},
            "mainEntity": {"@id": PERSON_ID},
            "about": {"@id": PERSON_ID},
            "primaryImageOfPage": OG_IMAGE,
            "dateModified": max(p["date"] for p in posts),
            "inLanguage": "en-US",
        },
        {
            "@type": "Blog",
            "@id": SITE_URL + "#blog",
            "url": SITE_URL + "#blog",
            "name": "Caleb Hart · Blog",
            "author": {"@id": PERSON_ID},
            "blogPost": [{"@type": "BlogPosting", "headline": p["title"], "url": p["url"], "datePublished": p["date"]}
                         for p in posts],
        },
    ]
    return meta_block(lines, graph)


def post_block(p: dict) -> str:
    lines = social_tags(
        url=p["url"], title=f'{p["title"]} · {NAME}', description=p["description"], og_type="article",
        extra=[f'<meta property="article:published_time" content="{p["date"]}">',
               f'<meta property="article:author" content="{SITE_URL}">',
               f'<meta property="article:section" content="{attr(p["tag"])}">'],
    )
    tags = [t.strip() for t in re.split(r"&|,", p["tag"]) if t.strip()]
    graph = [
        {
            "@type": "BlogPosting",
            "@id": p["url"] + "#post",
            "mainEntityOfPage": p["url"],
            "url": p["url"],
            "headline": p["title"][:110],
            "description": p["description"],
            "datePublished": p["date"],
            "dateModified": p["date"],
            "image": OG_IMAGE,
            "keywords": tags,
            "articleSection": p["tag"],
            "wordCount": len(p["text"].split()),
            "inLanguage": "en-US",
            "author": {"@type": "Person", "@id": PERSON_ID, "name": NAME, "url": SITE_URL},
            "publisher": {"@type": "Person", "@id": PERSON_ID, "name": NAME, "url": SITE_URL},
            "isPartOf": {"@type": "Blog", "@id": SITE_URL + "#blog", "name": "Caleb Hart · Blog"},
        },
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Caleb Hart", "item": SITE_URL},
                {"@type": "ListItem", "position": 2, "name": "Blog", "item": SITE_URL + "#blog"},
                {"@type": "ListItem", "position": 3, "name": p["title"], "item": p["url"]},
            ],
        },
    ]
    return meta_block(lines, graph)


def inject(path: Path, block: str) -> None:
    src = path.read_text(encoding="utf-8")
    if START in src:
        src = re.sub(re.escape(START) + r".*?" + re.escape(END), lambda _: block, src, flags=re.S)
    else:
        anchor = '<meta name="viewport" content="width=device-width, initial-scale=1">'
        if anchor not in src:
            raise SystemExit(f"{path}: no viewport meta to anchor the SEO block")
        src = src.replace(anchor, anchor + "\n" + block, 1)
    path.write_text(src, encoding="utf-8")


# ---------- site files ----------

def write_sitemap(posts: list[dict]) -> None:
    newest = max(p["date"] for p in posts)
    rows = [(SITE_URL, newest, "weekly", "1.0")]
    rows += [(p["url"], p["date"], "monthly", "0.7") for p in sorted(posts, key=lambda p: p["date"], reverse=True)]
    body = "\n".join(
        f"  <url>\n    <loc>{xml_escape(u)}</loc>\n    <lastmod>{d}</lastmod>\n"
        f"    <changefreq>{f}</changefreq>\n    <priority>{pr}</priority>\n  </url>"
        for u, d, f, pr in rows
    )
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + "\n</urlset>\n",
        encoding="utf-8",
    )


def rfc822(d: str) -> str:
    return dt.datetime.strptime(d, "%Y-%m-%d").replace(hour=12, tzinfo=dt.timezone.utc).strftime(
        "%a, %d %b %Y %H:%M:%S +0000")


def write_feed(posts: list[dict]) -> None:
    items = "\n".join(
        "    <item>\n"
        f"      <title>{xml_escape(p['title'])}</title>\n"
        f"      <link>{p['url']}</link>\n"
        f"      <guid isPermaLink=\"true\">{p['url']}</guid>\n"
        f"      <pubDate>{rfc822(p['date'])}</pubDate>\n"
        f"      <category>{xml_escape(p['tag'])}</category>\n"
        f"      <description>{xml_escape(p['description'])}</description>\n"
        "    </item>"
        for p in sorted(posts, key=lambda p: p["date"], reverse=True)
    )
    newest = max(p["date"] for p in posts)
    (ROOT / "feed.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n'
        "    <title>Caleb Hart · Blog</title>\n"
        f"    <link>{SITE_URL}</link>\n"
        f'    <atom:link href="{SITE_URL}feed.xml" rel="self" type="application/rss+xml"/>\n'
        f"    <description>{xml_escape(SUMMARY)}</description>\n"
        "    <language>en-us</language>\n"
        f"    <lastBuildDate>{rfc822(newest)}</lastBuildDate>\n"
        f"{items}\n  </channel>\n</rss>\n",
        encoding="utf-8",
    )


def profile_text() -> str:
    return "\n".join([
        f"# {NAME}",
        "",
        f"> {SUMMARY}",
        "",
        "Roles: " + ", ".join(JOB_TITLES) + ".",
        "",
        "Skills: Python, SQL, R and R Shiny, Power BI, SSIS, SSMS, Azure, pandas, Polars, "
        "machine learning (XGBoost, LightGBM, random forests), deep learning, reinforcement learning, "
        "time series forecasting, NLP and LLM fine-tuning, retrieval-augmented generation (RAG), "
        "AI agents and multi-agent orchestration (Claude, ChatGPT, Copilot), data governance, ETL, "
        "dashboards, JavaScript, HTML, C#, C++, Git. Works in 13 programming languages.",
        "",
        "Also: public speaking coach, programming instructor and AI trainer (trained 60 people at an "
        "electric co-op). Data science degree from Oregon Institute of Technology. Based in Colorado, US. "
        "Member of Statistics Without Borders, NoCo Cybersecurity and Fort Collins AI Group.",
        "",
        "Contact: use the LinkedIn profile or the email link on the home page.",
    ])


def write_llms(posts: list[dict]) -> None:
    by_date = sorted(posts, key=lambda p: p["date"], reverse=True)
    work = [p for p in by_date if p["slug"].startswith("my-time-")]
    other = [p for p in by_date if p not in work]

    def link(p):
        return f"- [{p['title']}]({p['url']}): {p['description']}"

    txt = "\n".join([
        profile_text(),
        "",
        "## Profile",
        "",
        f"- [Home page and skills]({SITE_URL}): portfolio, skills matrix, live projects and blog",
        f"- [LinkedIn]({SAME_AS[0]}): work history",
        f"- [GitHub]({SAME_AS[1]}): source code, including this site",
        f"- [Full text for LLMs]({SITE_URL}llms-full.txt): every post below as plain text",
        "",
        "## Projects",
        "",
        "- [Atlas Research Desk](https://datachart.github.io/AtlasResearchDesk/): frontier AI research written "
        "and checked by a team of AI agents, every claim traceable to a source; redeploys daily",
        "- [Agent Stock Portfolio](https://datachart.github.io/AgentStockPortfolio/): a paper-trading stock "
        "portfolio run entirely by Claude agents, with a live dashboard; trades every US trading day",
        "",
        "## Work experience",
        "",
        *map(link, work),
        "",
        "## Blog posts and case studies",
        "",
        *map(link, other),
        "",
    ])
    (ROOT / "llms.txt").write_text(txt, encoding="utf-8")

    full = [profile_text(), ""]
    for p in by_date:
        full += ["", "---", "", f"## {p['title']}", "",
                 f"URL: {p['url']}  ", f"Published: {p['date']}  ", f"Topic: {p['tag']}", "",
                 p["text"], ""]
    (ROOT / "llms-full.txt").write_text("\n".join(full), encoding="utf-8")


def main() -> None:
    posts = [read_post(p) for p in sorted((ROOT / "blog").glob("*.html"))]
    missing = [p["slug"] for p in posts if not (p["date"] and p["description"])]
    if missing:
        raise SystemExit("Posts missing a <time datetime> or meta description: " + ", ".join(missing))
    inject(ROOT / "index.html", index_block(posts))
    for p in posts:
        inject(p["path"], post_block(p))
    write_sitemap(posts)
    write_feed(posts)
    write_llms(posts)
    print(f"Updated index.html and {len(posts)} posts; wrote sitemap.xml, feed.xml, llms.txt, llms-full.txt")


if __name__ == "__main__":
    main()
