#!/usr/bin/env bash
# Apply the curation written by a Claude Code session (see CURATE.md) to Byeori.
#
#   bash ~/cryo-em/byeori/apply_curation.sh            # show what would change, change nothing
#   bash ~/cryo-em/byeori/apply_curation.sh --apply    # file the notes, push the overrides, re-plan
#
# Reads ~/cryo-em/byeori/curation/fields.tsv (stem<TAB>field<TAB>protein_class<TAB>keywords) and
# ~/cryo-em/byeori/curation/overrides.json ({"exclude": [...], "merge": {...}, "title": {...}}).
# No model is called except by the final synthesis plan (well under a dollar).
set -euo pipefail

APPLY=0
[ "${1:-}" = "--apply" ] && APPLY=1
HERE="$(cd "$(dirname "$0")" && pwd)"
FIELDS="$HERE/curation/fields.tsv"
OVERRIDES="$HERE/curation/overrides.json"
BYEORI_DIR="${BYEORI_DIR:-$HOME/byeori}"
[ -f "$FIELDS" ] || { echo "missing $FIELDS; see CURATE.md" >&2; exit 1; }
cd "$BYEORI_DIR"
# shellcheck disable=SC1091
source .byeori.env

# Field slugs and what belongs in them. A field must be open before notes can be filed into it.
field_scope() {
  case "$1" in
    cryoem-processing) echo "cryo-EM methods from images to validated atomic models: motion correction, CTF, particle picking, 2D/3D classification, reconstruction, heterogeneity, resolution estimation, map sharpening, model building, refinement, validation, software" ;;
    cryoem-structures) echo "papers reporting new experimental cryo-EM structures of specific proteins or complexes" ;;
    *) echo "" ;;
  esac
}

fields="$(grep -v '^#' "$FIELDS" | awk -F'\t' 'NF>=2 && $2!="" {print $2}' | sort -u)"
echo "==> fields in $FIELDS"
for f in $fields; do
  n="$(grep -v '^#' "$FIELDS" | awk -F'\t' -v f="$f" '$2==f' | wc -l | tr -d ' ')"
  echo "  $f: $n paper(s)"
done

if [ "$APPLY" = 1 ]; then
  echo "==> opening fields"
  for f in $fields; do
    scope="$(field_scope "$f")"
    [ -n "$scope" ] || { echo "  $f has no scope line in apply_curation.sh; add one first" >&2; exit 1; }
    uv run --quiet byeori aws-fields --open "$f:$scope" >/dev/null
  done
fi

echo "==> filing notes$([ "$APPLY" = 1 ] || echo ' (dry run)')"
for f in $fields; do
  # shellcheck disable=SC2207
  stems=($(grep -v '^#' "$FIELDS" | awk -F'\t' -v f="$f" '$2==f {print $1}'))
  flag=(); [ "$APPLY" = 1 ] && flag=(--apply)
  uv run --quiet byeori aws-file-notes "$f" --stems "${stems[@]}" ${flag[@]+"${flag[@]}"} \
    | tr -d '\n' | sed 's/  */ /g'; echo
done

if [ -f "$OVERRIDES" ]; then
  echo "==> concept overrides: $(uv run --quiet --no-project python -c "
import json,sys; d=json.load(open(sys.argv[1])); print(len(d.get('merge',{})),'merges,',len(d.get('exclude',[])),'excluded,',len(d.get('title',{})),'titles')" "$OVERRIDES")"
fi

if [ "$APPLY" != 1 ]; then
  echo
  echo "dry run: nothing was changed. Run again with --apply."
  exit 0
fi

if [ -f "$OVERRIDES" ]; then
  uv run --quiet byeori aws-synthesis-manifest --kind overrides --content "$(cat "$OVERRIDES")" | tail -3
fi
# Order matters: the sync copies each note's field from the search index into the catalog, so the
# index has to be rebuilt from the refiled notes first. Synced from a stale index, every note's
# catalog field went back to "other" (2026-09-29).
echo "==> rebuilding the search index"
uv run --quiet byeori build-index | tail -3
echo "==> making the catalog agree with the notes (the synthesis planner reads the catalog)"
uv run --quiet byeori aws-sync-note-categories --apply | tail -8
echo "==> planning synthesis again (plan only; no pages written)"
uv run --quiet byeori aws-synthesis-plan --scope all | tail -5
echo
echo "In a few minutes: uv run byeori aws-synthesis-manifest --scope all | head -80"
