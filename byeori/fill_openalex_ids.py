#!/usr/bin/env python3
"""Fill the OpenAlex source ids for the structural-biology journal draft, then merge it into Byeori.

The draft (lab_additions_structural_biology.json) carries each journal's ISSNs but empty
``source_ids``, because OpenAlex could not be reached where it was written. Run this on a machine
that can reach api.openalex.org (the office Mac mini):

    python3 fill_openalex_ids.py                      # look up ids, write *.filled.json, print a report
    python3 fill_openalex_ids.py --merge ~/byeori/src/byeori/policies/journals.json

The lookup matches by ISSN, adds any ISSN OpenAlex knows that the draft lacks, and drops sources
with fewer than --min-works works (duplicate or stub records that would waste the search filter).
The merge removes the machine-learning conferences Byeori ships in ``lab_additions`` (ICLR,
NeurIPS, ICML, PMLR, AISTATS, COLT; family "Machine learning conference"), which a structural-
biology lab does not collect from, adds only keys not already in ``journals`` or
``lab_additions``, refuses to go past
OpenAlex's cap of 100 source ids per filter (Byeori's search filter uses every id on its lists),
and keeps a .bak copy of the file it changes.

Standard library only. OPENALEX_API_KEY and KIRO_WIKI_CONTACT_EMAIL are used when set.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
DRAFT = HERE / "lab_additions_structural_biology.json"
FILLED = HERE / "lab_additions_structural_biology.filled.json"
SOURCE_ID_CAP = 100  # OpenAlex's limit of values per filter
DROP_FAMILIES = ("Machine learning conference",)  # Byeori's shipped additions this lab does not want


def lookup(issns: list[str], api_key: str | None, mailto: str | None) -> list[dict]:
    params = {"filter": "issn:" + "|".join(issns),
              "select": "id,display_name,issn,host_organization_name,works_count", "per_page": "50"}
    if api_key:
        params["api_key"] = api_key
    if mailto:
        params["mailto"] = mailto
    url = "https://api.openalex.org/sources?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=30) as response:
        return json.load(response)["results"]


def fill(min_works: int) -> dict:
    draft = json.loads(DRAFT.read_text(encoding="utf-8"))["lab_additions"]
    api_key = os.environ.get("OPENALEX_API_KEY")
    mailto = os.environ.get("KIRO_WIKI_CONTACT_EMAIL")
    problems = 0
    for key, row in draft.items():
        results = lookup(row["issns"], api_key, mailto)
        kept = [r for r in results if (r.get("works_count") or 0) >= min_works]
        dropped = [r for r in results if r not in kept]
        row["source_ids"] = [r["id"].rsplit("/", 1)[-1] for r in kept]
        known = {issn.upper() for r in kept for issn in (r.get("issn") or [])}
        row["issns"] = sorted({issn.upper() for issn in row["issns"]} | known)
        names = "; ".join(f"{r['display_name']} ({r.get('host_organization_name')}, "
                          f"{r.get('works_count')} works)" for r in kept)
        flag = "OK " if kept else "?? "
        if not kept:
            problems += 1
        print(f"{flag}{row['title']}: {row['source_ids'] or 'no source found'} {names}")
        for r in dropped:
            print(f"    dropped {r['id']} {r['display_name']} ({r.get('works_count')} works)")
        time.sleep(0.2)
    FILLED.write_text(json.dumps({"lab_additions": draft}, indent=2, ensure_ascii=False) + "\n",
                      encoding="utf-8")
    print(f"\nwrote {FILLED.name}; {problems} journal(s) need a look" if problems
          else f"\nwrote {FILLED.name}; every journal resolved")
    return draft


def merge(additions: dict, policy_path: Path) -> None:
    policy = json.loads(policy_path.read_text(encoding="utf-8"))
    for k in [k for k, row in policy["lab_additions"].items() if row["family"] in DROP_FAMILIES]:
        del policy["lab_additions"][k]
        print(f"remove {k}")
    taken = set(policy["journals"]) | set(policy["lab_additions"])
    refused = set(policy.get("denied_journals", [])) | set(policy.get("nature_portfolio_below_threshold", []))
    new = {k: v for k, v in additions.items() if k not in taken and k not in refused}
    for k in sorted(set(additions) - set(new)):
        print(f"skip {k}: already on the list or refused by the policy")

    ids = {row["source_id"] for row in policy["journals"].values()}
    ids |= {i for row in policy["lab_additions"].values() for i in row["source_ids"]}
    ids |= {i for row in new.values() for i in row["source_ids"]}
    print(f"source ids after merge: {len(ids)} of {SOURCE_ID_CAP}")
    if len(ids) > SOURCE_ID_CAP:
        sys.exit("refused: Byeori's OpenAlex search filter would exceed 100 source ids; drop some journals")

    shutil.copy2(policy_path, policy_path.with_suffix(".json.bak"))
    policy["lab_additions"].update(new)
    policy_path.write_text(json.dumps(policy, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"added {len(new)} journal(s) to {policy_path} (backup: {policy_path.name}.bak)")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--merge", type=Path, help="Byeori's src/byeori/policies/journals.json")
    parser.add_argument("--min-works", type=int, default=50)
    parser.add_argument("--no-lookup", action="store_true",
                        help="merge the existing *.filled.json without calling OpenAlex again")
    args = parser.parse_args()
    if args.no_lookup:
        additions = json.loads(FILLED.read_text(encoding="utf-8"))["lab_additions"]
    else:
        additions = fill(args.min_works)
    if args.merge:
        if any(not row["source_ids"] for row in additions.values()):
            print("note: journals without a source id still match by ISSN, "
                  "but stay out of OpenAlex topic searches")
        merge(additions, args.merge.expanduser())


if __name__ == "__main__":
    main()
