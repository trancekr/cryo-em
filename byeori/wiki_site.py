#!/usr/bin/env python3
"""Turn the synced wiki (Markdown with [[wiki links]]) into plain HTML pages for a web browser.

    uv run --no-project --with markdown python wiki_site.py ~/ByeoriWiki ~/ByeoriWiki-site
    open ~/ByeoriWiki-site/index.html

Every page gets a sidebar (fields, questions, concepts, papers, with a title filter), its [[links]]
turned into relative links showing the target's title, and a "Linked from" list. The output is
static files opened straight from disk: no server, nothing leaves the computer.
"""
from __future__ import annotations

import html
import json
import os
import re
import shutil
import sys
from collections import defaultdict
from pathlib import Path

import markdown

LINK = re.compile(r"\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]")
FRONT = re.compile(r"\A---\n(.*?)\n---\n", re.S)
SITE_NAME = os.environ.get("WIKI_SITE_NAME", "Cryo-EM HK Wiki")
KINDS = [("overviews", "Fields"), ("questions", "Questions"), ("concepts", "Concepts"), ("sources", "Papers")]


def front_matter(text: str) -> tuple[dict[str, str], str]:
    m = FRONT.match(text)
    if not m:
        return {}, text
    meta = {}
    for line in m.group(1).splitlines():
        k, sep, v = line.partition(":")
        if sep and not line.startswith(" "):
            meta[k.strip()] = v.strip().strip('"')
    return meta, text[m.end():]


def page_title(key: str, meta: dict[str, str], body: str) -> str:
    title = meta.get("title", "")
    if not title or title == key.rsplit("/", 1)[-1]:
        h = re.search(r"^#\s+(.+)$", body, re.M)
        title = h.group(1).strip() if h else title
    if not title or title == key.rsplit("/", 1)[-1]:
        if key.startswith("overviews/") and key.endswith("/index"):
            return key.split("/")[1] + " (overview)"
        return key.rsplit("/", 1)[-1].replace("-", " ")
    return title


def main() -> None:
    src, out = Path(sys.argv[1]).expanduser(), Path(sys.argv[2]).expanduser()
    pages: dict[str, dict] = {}
    for p in sorted(src.rglob("*.md")):
        rel = p.relative_to(src)
        if rel.parts[0].startswith("."):
            continue
        key = rel.with_suffix("").as_posix()
        meta, body = front_matter(p.read_text(encoding="utf-8", errors="replace"))
        pages[key] = {"meta": meta, "body": body, "title": page_title(key, meta, body)}

    backlinks: dict[str, set[str]] = defaultdict(set)
    for key, pg in pages.items():
        for target, _ in LINK.findall(pg["body"]):
            target = target.strip().removesuffix(".md")
            if target in pages and target != key:
                backlinks[target].add(key)

    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    (out / "style.css").write_text(CSS, encoding="utf-8")
    nav = []
    for key, pg in pages.items():
        kind = key.split("/", 1)[0]
        if kind not in dict(KINDS):
            continue
        group = key.split("/")[1] if kind == "overviews" and key.count("/") >= 2 else ""
        nav.append({"k": kind, "g": group, "p": key + ".html", "t": pg["title"],
                    "y": pg["meta"].get("year", ""), "i": key.endswith("/index")})
    (out / "nav.js").write_text("window.PAGES=" + json.dumps(nav, ensure_ascii=False) + ";\n" + NAV_JS, encoding="utf-8")

    for key, pg in pages.items():
        here = (out / key).parent

        def link(m: re.Match) -> str:
            target, label = m.group(1).strip().removesuffix(".md"), m.group(2)
            if target not in pages:
                return f'<span class="missing">{html.escape(label or target)}</span>'
            href = os.path.relpath(out / (target + ".html"), here)
            return f'<a href="{html.escape(href)}">{html.escape(label or pages[target]["title"])}</a>'

        body = LINK.sub(link, pg["body"])
        content = markdown.markdown(body, extensions=["tables", "fenced_code", "sane_lists"])
        meta = pg["meta"]
        info = " · ".join(x for x in [meta.get("journal", ""), meta.get("year", ""),
                                      f'DOI <a href="https://doi.org/{html.escape(meta["doi"])}">{html.escape(meta["doi"])}</a>' if meta.get("doi") else ""] if x)
        back = sorted(backlinks.get(key, ()), key=lambda k: pages[k]["title"].lower())
        back_html = "".join(
            f'<li><a href="{html.escape(os.path.relpath(out / (b + ".html"), here))}">{html.escape(pages[b]["title"])}</a>'
            f' <span class="kind">{b.split("/", 1)[0]}</span></li>' for b in back)
        root = os.path.relpath(out, here)
        doc = TEMPLATE.format(
            site=html.escape(SITE_NAME),
            title=html.escape(pg["title"]), root=root, kind=key.split("/", 1)[0],
            info=f'<p class="info">{info}</p>' if info else "", content=content,
            back=f"<section class=back><h2>Linked from ({len(back)})</h2><ul>{back_html}</ul></section>" if back else "")
        dest = out / (key + ".html")
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(doc, encoding="utf-8")

    counts = {k: sum(1 for key in pages if key.startswith(k + "/")) for k, _ in KINDS}
    fields = sorted({key.split("/")[1] for key in pages if key.startswith("overviews/") and key.count("/") >= 2})
    home = "".join(f'<li><a href="overviews/{f}/index.html">{html.escape(f)}</a> '
                   f'<span class="kind">{sum(1 for k in pages if k.startswith(f"overviews/{f}/")) - 1} pages</span></li>'
                   for f in fields if f"overviews/{f}/index" in pages)
    qs = "".join(f'<li><a href="{k}.html">{html.escape(pages[k]["title"])}</a></li>'
                 for k in sorted(pages) if k.startswith("questions/"))
    stats = " · ".join(f"{counts[k]} {label.lower()}" for k, label in KINDS)
    (out / "index.html").write_text(TEMPLATE.format(
        site=html.escape(SITE_NAME),
        title=SITE_NAME, root=".", kind="home", info=f'<p class="info">{stats}</p>',
        content=f"<h2>Fields</h2><ul>{home}</ul><h2>Questions</h2><ul>{qs}</ul>"
                + (markdown.markdown(LINK.sub(lambda m: m.group(2) or m.group(1), pages["index"]["body"]),
                                     extensions=["tables"]) if "index" in pages else ""),
        back="").replace(f"<title>{html.escape(SITE_NAME)} · ", "<title>", 1), encoding="utf-8")
    print(f"{len(pages)} pages -> {out}/index.html")


TEMPLATE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} · {site}</title><link rel="stylesheet" href="{root}/style.css"></head>
<body data-root="{root}"><nav id="side"><a class="home" href="{root}/index.html">{site}</a>
<input id="q" type="search" placeholder="Filter titles…" autocomplete="off"><div id="list"></div></nav>
<main><p class="kind">{kind}</p><h1>{title}</h1>{info}{content}{back}</main>
<script src="{root}/nav.js"></script></body></html>
"""

NAV_JS = r"""
(function () {
  var root = document.body.dataset.root, list = document.getElementById('list'), q = document.getElementById('q');
  // This page's path relative to the site root, e.g. "sources/x.html", to mark it in the list.
  var parts = location.pathname.split('/'), depth = root === '.' ? 0 : root.split('/').length;
  var herePath = decodeURIComponent(parts.slice(-(depth + 1)).join('/'));
  var kinds = [['overviews', 'Fields'], ['questions', 'Questions'], ['concepts', 'Concepts'], ['sources', 'Papers']];
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]; }); }
  function render(filter) {
    var f = (filter || '').toLowerCase(), out = '';
    kinds.forEach(function (k) {
      var items = PAGES.filter(function (p) { return p.k === k[0] && (!f || (p.t + ' ' + p.p).toLowerCase().indexOf(f) >= 0); });
      if (k[0] === 'overviews') items.sort(function (a, b) { return a.g.localeCompare(b.g) || (b.i - a.i) || a.t.localeCompare(b.t); });
      else if (k[0] === 'sources') items.sort(function (a, b) { return a.t.localeCompare(b.t); });
      if (!items.length) return;
      var open = f || k[0] !== 'sources' ? ' open' : '';
      out += '<details' + open + '><summary>' + k[1] + ' <span>' + items.length + '</span></summary><ul>';
      function item(p, label) {
        var cur = p.p === herePath ? ' class="cur"' : '';
        return '<li' + cur + '><a href="' + root + '/' + p.p + '" title="' + esc(p.t) + '">' + label + '</a>' + (p.y ? '<span>' + p.y + '</span>' : '') + '</li>';
      }
      if (k[0] === 'overviews') {
        // One collapsible block per field: the field's landscape page, then its subtopics.
        var groups = {};
        items.forEach(function (p) { (groups[p.g] = groups[p.g] || []).push(p); });
        Object.keys(groups).sort().forEach(function (g) {
          var gi = groups[g], mine = gi.some(function (p) { return p.p === herePath; });
          out += '<li class="grp"><details' + (f || mine ? ' open' : '') + '><summary>' + esc(g || 'other') + ' <span>' + gi.length + '</span></summary><ul>';
          gi.forEach(function (p) { out += item(p, p.i ? 'Overview' : esc(p.t)); });
          out += '</ul></details></li>';
        });
      } else {
        items.forEach(function (p) { out += item(p, esc(p.t)); });
      }
      out += '</ul></details>';
    });
    list.innerHTML = out || '<p class="none">No match</p>';
  }
  var saved = ''; try { saved = sessionStorage.getItem('q') || ''; } catch (e) {}
  q.value = saved; render(saved);
  q.addEventListener('input', function () { try { sessionStorage.setItem('q', q.value); } catch (e) {} render(q.value); });
})();
"""

CSS = """
:root { --bg: #fbfbfa; --fg: #1d1d1f; --muted: #6e6e73; --line: #e3e3e0; --side: #f2f2ef; --link: #0b62c4; --cur: #e2ecf8; }
@media (prefers-color-scheme: dark) { :root { --bg: #1b1b1d; --fg: #e8e8ea; --muted: #9a9aa0; --line: #333337; --side: #232326; --link: #6cb0ff; --cur: #25354a; } }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--fg); font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", sans-serif; display: flex; }
#side { position: sticky; top: 0; height: 100vh; overflow-y: auto; width: 320px; flex: none; background: var(--side); border-right: 1px solid var(--line); padding: 16px 12px; font-size: 14px; }
#side .home { display: block; font-weight: 700; font-size: 17px; color: var(--fg); text-decoration: none; margin-bottom: 10px; }
#q { width: 100%; padding: 7px 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--bg); color: var(--fg); font-size: 14px; margin-bottom: 10px; }
details { margin: 6px 0; } summary { cursor: pointer; font-weight: 600; } summary span, #side li span { color: var(--muted); font-weight: 400; font-size: 12px; }
#side ul { list-style: none; margin: 4px 0 8px; padding: 0; }
#side li { display: flex; gap: 6px; align-items: baseline; padding: 2px 6px; border-radius: 6px; line-height: 1.35; margin: 1px 0; }
#side li > a { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#side li > span { flex: none; }
#side li.grp { display: block; padding: 0 0 0 4px; } #side li.grp summary { font-weight: 500; } #side li.grp ul { margin-left: 12px; }
#side li.cur { background: var(--cur); } #side a { color: var(--fg); text-decoration: none; } #side a:hover { color: var(--link); }
main { flex: 1; min-width: 0; max-width: 900px; padding: 28px 40px 80px; }
main a { color: var(--link); text-decoration: none; } main a:hover { text-decoration: underline; }
h1 { font-size: 26px; line-height: 1.3; margin: 4px 0 6px; } h2 { font-size: 20px; margin-top: 32px; border-bottom: 1px solid var(--line); padding-bottom: 4px; } h3 { font-size: 17px; }
.kind { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; margin: 0; }
.info { color: var(--muted); margin: 0 0 16px; } .missing { color: var(--muted); border-bottom: 1px dotted var(--muted); }
table { border-collapse: collapse; margin: 12px 0; display: block; overflow-x: auto; } th, td { border: 1px solid var(--line); padding: 6px 10px; vertical-align: top; }
code { background: var(--side); padding: 1px 4px; border-radius: 4px; font-size: 90%; } pre { background: var(--side); padding: 12px; border-radius: 8px; overflow-x: auto; }
blockquote { margin: 12px 0; padding: 8px 14px; border-left: 4px solid #d9a400; background: var(--side); }
.back ul { columns: 2; } .back li { break-inside: avoid; }
@media (max-width: 800px) { body { display: block; } #side { position: static; width: auto; height: auto; max-height: 45vh; } main { padding: 20px 16px 60px; } .back ul { columns: 1; } }
"""

if __name__ == "__main__":
    main()
