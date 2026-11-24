#!/usr/bin/env python3
"""Find the original PDFs for every paper the wiki had, so a rebuilt Byeori can ingest them again.

    python3 restore_collect.py <backup sources dir> <stage dir> [<search root> ...]

The stems come from the backed-up notes (<backup>/ByeoriWiki/sources/<stem>.md). A PDF's stem is
its file name the way ingest_batch.sh makes it (lowercase, other characters -> "-"), so the same
files give the same stems and the wiki's links stay valid. Supplements (..._SI.pdf etc.) are taken
only from the folder of the chosen paper, so a paper already merged with its SI (Russo 2014 in
russo-fix) does not get the SI twice. When a stem has several copies, the largest file is used.
Copies go into <stage dir> under their own names; nothing is moved or changed. Prints what was
found, what is missing, and which copy was chosen where there was a choice.
"""
from __future__ import annotations

import os
import re
import shutil
import sys
from pathlib import Path

SI = re.compile(r"(^|-)(si|sm|esm|supp|suppl|supplement|supplementary|supporting)(-|[0-9]|$)")
DEFAULT_ROOTS = ["/Volumes/TKR02ex/hanseonk/Downloads", "~/Downloads", "~/Desktop", "~/Documents"]


def stem_of(name: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", name[:-4].lower() if name.lower().endswith(".pdf") else name.lower())
    return s.strip("-")


def main() -> None:
    sources, stage = Path(sys.argv[1]).expanduser(), Path(sys.argv[2]).expanduser()
    roots = [Path(r).expanduser() for r in (sys.argv[3:] or DEFAULT_ROOTS)]
    need = sorted(p.stem for p in sources.glob("*.md"))
    stage_abs = stage.resolve()
    papers: dict[str, list[Path]] = {}
    sis: list[Path] = []
    for root in roots:
        if not root.is_dir():
            print(f"  (없음) {root}", file=sys.stderr)
            continue
        for dirpath, dirnames, filenames in os.walk(root):
            d = Path(dirpath)
            dirnames[:] = [x for x in dirnames if not x.startswith(".") and x != "Library"
                           and (d / x).resolve() != stage_abs]
            for f in filenames:
                if not f.lower().endswith(".pdf"):
                    continue
                p, s = d / f, stem_of(f)
                (sis.append(p) if SI.search(s) else papers.setdefault(s, []).append(p))
    stage.mkdir(parents=True, exist_ok=True)
    found, missing = 0, []
    for s in need:
        cands = papers.get(s, [])
        if not cands:
            missing.append(s)
            continue
        best = max(cands, key=lambda p: p.stat().st_size)
        if len(cands) > 1:
            print(f"  {s}: {len(cands)}개 중 가장 큰 파일 {best}")
        shutil.copy2(best, stage / best.name)
        for q in sis:  # supplements from the same folder whose name starts with this paper's
            base = SI.split(stem_of(q.name))[0].rstrip("-")
            if q.parent == best.parent and base and s.startswith(base):
                shutil.copy2(q, stage / q.name)
                print(f"  {s}: 보충자료 {q.name}")
        found += 1
    print(f"\n찾음 {found}/{len(need)}편 -> {stage}")
    if missing:
        print(f"못 찾음 {len(missing)}편:")
        for s in missing:
            print("  " + s)


if __name__ == "__main__":
    main()
