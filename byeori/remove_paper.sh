#!/usr/bin/env bash
# Remove papers from Byeori by stem: the catalog row, papers/{stem}/, and the note.
#
#   bash ~/cryo-em/byeori/remove_paper.sh <stem> [<stem> ...]
#
# Byeori has no delete command; this is for a paper that went in by mistake (a supplement uploaded
# as a paper, a second copy of the same paper). It lists what exists for each stem, asks once, then
# deletes and rebuilds the search index. The bucket is not versioned: a deleted object is gone.
# The PDF on your computer is not touched, so the paper can be added again with ingest_batch.sh.
set -euo pipefail

[ "$#" -gt 0 ] || { echo "usage: remove_paper.sh <stem> [<stem> ...]" >&2; exit 2; }
BYEORI_DIR="${BYEORI_DIR:-$HOME/byeori}"
cd "$BYEORI_DIR"
# shellcheck disable=SC1091
source .byeori.env
B="$AWS_KIRO_WIKI_BUCKET"

found=()
for stem in "$@"; do
  row="$(aws dynamodb get-item --table-name "$AWS_KIRO_WIKI_TABLE" --key "{\"work_id\":{\"S\":\"$stem\"}}" \
    --projection-expression "ingest_status,source_note_status,doi" \
    --query "Item.[ingest_status.S,source_note_status.S,doi.S]" --output text)"
  objects="$(aws s3 ls "s3://$B/papers/$stem/" --recursive | wc -l | tr -d ' ')"
  notes=""
  for key in "wiki/sources/$stem.md" "wiki/sources/failed/$stem.md" "wiki/drafts/$stem.md"; do
    aws s3 ls "s3://$B/$key" >/dev/null 2>&1 && notes="$notes $key"
  done
  if [ "$row" = "None" ] || [ -z "$row" ]; then
    [ "$objects" -eq 0 ] && [ -z "$notes" ] && { echo "  $stem: not in Byeori, nothing to do"; continue; }
    row="(no catalog row)"
  fi
  echo "  $stem"
  echo "      catalog: $row"
  echo "      papers/$stem/: $objects object(s)"
  echo "      notes:${notes:- none}"
  found+=("$stem")
done

[ "${#found[@]}" -gt 0 ] || exit 0
printf 'Delete these %d paper(s) permanently? [y/N] ' "${#found[@]}"
read -r answer
case "$answer" in y|Y|yes) ;; *) echo "stopped; nothing was deleted"; exit 0 ;; esac

for stem in "${found[@]}"; do
  aws s3 rm "s3://$B/papers/$stem/" --recursive --only-show-errors
  for key in "wiki/sources/$stem.md" "wiki/sources/failed/$stem.md" "wiki/drafts/$stem.md"; do
    aws s3 rm "s3://$B/$key" --only-show-errors 2>/dev/null || true
  done
  aws dynamodb delete-item --table-name "$AWS_KIRO_WIKI_TABLE" --key "{\"work_id\":{\"S\":\"$stem\"}}"
  echo "  removed $stem"
done

echo "==> rebuilding the search index"
uv run --quiet byeori build-index | tail -3
