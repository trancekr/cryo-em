#!/usr/bin/env python3
"""List every Glossary term across the downloaded notes, with how many notes carry it.

Byeori's concept candidates are Glossary terms that 5 or more notes share; the same idea written
three ways (cryo-electron microscopy / electron cryo-microscopy / cryogenic electron microscopy)
counts as three terms. This prints the raw terms so a reader can decide which to merge or drop.

    python3 glossary_terms.py <notes dir> [--min 2]

Output, one line per slug, most notes first:  count<TAB>slug<TAB>spellings seen<TAB>stems
Standard library only; the slug rule matches synthesis_terms.slugify closely enough to group.
"""
from __future__ import annotations

import argparse
import re
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path

GLOSSARY = re.compile(r"^## 7\. Glossary\s*$", re.M)
TERM = re.compile(r"^\s*[-*]\s+\*\*(.+?)\*\*\s*[:：]", re.M)


def slug(term: str) -> str:
    term = re.sub(r"\s*\([^)]*\)", "", term)          # "Q-score (Q)" -> "Q-score"
    term = unicodedata.normalize("NFKD", term).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", term.lower()).strip("-")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("notes", type=Path)
    parser.add_argument("--min", type=int, default=2, help="only terms in at least this many notes")
    args = parser.parse_args()
    stems: dict[str, set[str]] = defaultdict(set)
    spellings: dict[str, set[str]] = defaultdict(set)
    for path in sorted(args.notes.glob("*.md")):
        text = path.read_text(encoding="utf-8", errors="replace")
        match = GLOSSARY.search(text)
        if not match:
            continue
        section = text[match.end():]
        following = re.search(r"^## ", section, re.M)
        section = section[: following.start()] if following else section
        for raw in TERM.findall(section):
            key = slug(raw)
            if key:
                stems[key].add(path.stem)
                spellings[key].add(raw.strip())
    rows = sorted(((len(v), k) for k, v in stems.items() if len(v) >= args.min), reverse=True)
    for count, key in rows:
        print(f"{count}\t{key}\t{' | '.join(sorted(spellings[key]))}\t{' '.join(sorted(stems[key]))}")
    print(f"# {len(rows)} terms in {args.min}+ notes; {len(list(args.notes.glob('*.md')))} notes read",
          file=sys.stderr)


if __name__ == "__main__":
    main()
