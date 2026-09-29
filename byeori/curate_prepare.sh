#!/usr/bin/env bash
# Get everything the curation session reads, into ~/cryo-em/byeori/curation/. Run it yourself in a
# terminal (it reads AWS; the Claude Code session then only reads local files).
#
#   bash ~/cryo-em/byeori/curate_prepare.sh
#
# Writes:
#   curation/notes/*.md        the notes, as stored (git-ignored)
#   curation/digest.md         per note: title, journal, year, one-line summary, the first key
#                              contributions -- about 400 tokens a note, so 100 notes fit one session
#   curation/candidates.tsv    Byeori's concept candidates: notes, slug, title, aliases
#   curation/terms.tsv         every Glossary term in 3+ notes, for spotting spellings to merge
#   curation/fields.tsv        a template with every stem, field left empty (kept if it exists)
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/curation"
BYEORI_DIR="${BYEORI_DIR:-$HOME/byeori}"
mkdir -p "$OUT/notes"
cd "$BYEORI_DIR"
# shellcheck disable=SC1091
source .byeori.env

echo "==> notes"
aws s3 sync "s3://$AWS_KIRO_WIKI_BUCKET/wiki/sources/" "$OUT/notes/" \
  --exclude "*" --include "*.md" --exclude "failed/*" --only-show-errors
echo "  $(ls "$OUT/notes" | wc -l | tr -d ' ') notes"

echo "==> concept candidates"
aws s3 cp "s3://$AWS_KIRO_WIKI_BUCKET/runs/synthesis/concepts/candidates.json" "$OUT/candidates.json" --only-show-errors \
  || echo "  (no candidates yet; run: uv run byeori aws-synthesis-plan --scope all)"

python3 - "$OUT" <<'PY'
import json, re, sys
from pathlib import Path

out = Path(sys.argv[1])
notes = sorted((out / "notes").glob("*.md"))

def section(text, heading):
    m = re.search(rf"^## {re.escape(heading)}\s*$", text, re.M)
    if not m:
        return ""
    rest = text[m.end():]
    nxt = re.search(r"^## ", rest, re.M)
    return (rest[: nxt.start()] if nxt else rest).strip()

def field(text, name):
    m = re.search(rf'^{name}:\s*"?(.*?)"?\s*$', text.split("\n---\n", 1)[0], re.M)
    return m.group(1) if m else ""

lines = ["# Note digest for curation", ""]
for p in notes:
    t = p.read_text(encoding="utf-8", errors="replace")
    summary = section(t, "One-line Summary")
    contrib = section(t, "2. Key Contributions")
    bullets = [b.strip() for b in re.findall(r"^\s*[-*]\s+(.*)$", contrib, re.M)][:4]
    lines += [f"## {p.stem}",
              f"{field(t, 'title')} — {field(t, 'journal')} {field(t, 'year')}".strip(),
              f"Summary: {summary[:600]}"]
    lines += [f"- {b[:300]}" for b in bullets]
    lines.append("")
(out / "digest.md").write_text("\n".join(lines), encoding="utf-8")
print(f"==> digest.md: {len(notes)} notes")

cand = out / "candidates.json"
if cand.exists():
    data = json.loads(cand.read_text())
    rows = ["#notes\tslug\ttitle\taliases"]
    for c in sorted(data.get("concepts", []), key=lambda c: -c.get("count_total", 0)):
        rows.append(f"{c.get('count_total')}\t{c['slug']}\t{c.get('title','')}\t{'; '.join(c.get('aliases') or [])}")
    (out / "candidates.tsv").write_text("\n".join(rows) + "\n", encoding="utf-8")
    print(f"==> candidates.tsv: {len(rows) - 1} concepts")

fields = out / "fields.tsv"
have = set()
if fields.exists():
    have = {l.split("\t", 1)[0] for l in fields.read_text().splitlines() if l and not l.startswith("#")}
new = [p.stem for p in notes if p.stem not in have]
with fields.open("a", encoding="utf-8") as f:
    if not have:
        f.write("#stem\tfield\tprotein_class\tkeywords\n")
    for s in new:
        f.write(f"{s}\t\t\t\n")
print(f"==> fields.tsv: {len(new)} stem(s) added to fill in")
PY

python3 "$HERE/glossary_terms.py" "$OUT/notes" --min 3 > "$OUT/terms.tsv"
echo "==> terms.tsv: $(grep -vc '^#' "$OUT/terms.tsv") terms"
echo
echo "Next, in Claude Code (cd ~/cryo-em && claude):  byeori/CURATE.md 대로 큐레이션 해줘"
