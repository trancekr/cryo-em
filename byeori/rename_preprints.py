#!/usr/bin/env python3
"""Give bioRxiv/medRxiv downloads a readable name before they go into Byeori.

    python3 rename_preprints.py <stage dir> <folder|pdf> [...]

A download such as 2026.10.07.757472v1.full.pdf carries its DOI (10.1101/2026.10.07.757472) in the
name; Byeori would turn it into the stem 2026-10-07-757472v1-full. This looks the DOI up (Crossref,
then the bioRxiv API) and copies the file into <stage dir> as Surname_Year_short-title.pdf. A
supplement named <download name>_SI.pdf (or -supp, -media-1 ...) follows its paper's new name.
Prints the paths to hand to ingest_batch.sh: the stage dir when something was renamed, otherwise
the inputs unchanged. Originals are never modified. Standard library only.
"""
from __future__ import annotations

import json
import re
import shutil
import sys
import subprocess
from pathlib import Path

PREPRINT = re.compile(r"^(\d{4}\.\d{2}\.\d{2}\.\d{5,})(v\d+)?(\.full)?(?P<rest>[-_].*)?\.pdf$", re.I)
STOP = {"a", "an", "the", "of", "for", "and", "in", "on", "by", "with", "to", "using", "from", "at", "via", "into"}


def fetch(url: str) -> dict | None:
    # curl, not urllib: macOS Python builds often lack CA certificates and fail every HTTPS request
    # (2026-10-21, both lookups "failed"); the system curl uses the keychain.
    try:
        out = subprocess.run(["curl", "-sSL", "--max-time", "20", "-A", "cryo-em-hk-wiki/1", url],
                             capture_output=True, text=True, timeout=30)
        if out.returncode != 0:
            print(f"    {url}: {out.stderr.strip()[:120]}", file=sys.stderr)
            return None
        return json.loads(out.stdout)
    except Exception as e:
        print(f"    {url}: {type(e).__name__} {str(e)[:100]}", file=sys.stderr)
        return None


def lookup(doi: str) -> tuple[str, str, str] | None:
    """(first author surname, year, title) for a 10.1101 DOI."""
    m = (fetch(f"https://api.crossref.org/works/{doi}") or {}).get("message")
    if m and m.get("title"):
        fam = (m.get("author") or [{}])[0].get("family", "")
        parts = (m.get("posted") or m.get("created") or {}).get("date-parts", [[None]])[0]
        return fam, str(parts[0] or doi.split("/")[1][:4]), m["title"][0]
    c = ((fetch(f"https://api.biorxiv.org/details/biorxiv/{doi}") or {}).get("collection") or [None])[-1]
    if c and c.get("title"):
        return c.get("authors", "").split(";")[0].split(",")[0].strip(), c.get("date", "")[:4], c["title"]
    return None


def new_name(surname: str, year: str, title: str) -> str:
    sur = re.sub(r"[^A-Za-z-]", "", surname.replace(" ", "-")) or "Unknown"
    words = [w for w in re.findall(r"[A-Za-z0-9]+", title.lower()) if w not in STOP][:4]
    return f"{sur}_{year}_{'-'.join(words) or 'preprint'}"


def main() -> None:
    stage, inputs = Path(sys.argv[1]), [Path(a).expanduser() for a in sys.argv[2:]]
    pdfs: list[Path] = []
    for p in inputs:
        pdfs += sorted(x for x in p.iterdir() if x.suffix.lower() == ".pdf") if p.is_dir() else [p]
    names: dict[str, str] = {}
    for p in pdfs:
        m = PREPRINT.match(p.name)
        if m and not m.group("rest") and m.group(1) not in names:
            found = lookup(f"10.1101/{m.group(1)}")
            if found:
                names[m.group(1)] = new_name(*found)
                print(f"  {p.name} -> {names[m.group(1)]}.pdf  ({found[2][:90]})", file=sys.stderr)
            else:
                print(f"  {p.name}: DOI 조회 실패, 원래 이름으로 넣음", file=sys.stderr)
    if not names:
        print("\n".join(str(p) for p in inputs))
        return
    stage.mkdir(parents=True, exist_ok=True)
    for p in pdfs:
        m = PREPRINT.match(p.name)
        base = names.get(m.group(1)) if m else None
        target = f"{base}{m.group('rest') or ''}.pdf" if base else p.name
        shutil.copy2(p, stage / target)
    print(stage)


if __name__ == "__main__":
    main()
