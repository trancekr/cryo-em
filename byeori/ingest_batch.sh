#!/usr/bin/env bash
# Put every PDF in one folder into Byeori: upload, extract, write the notes, check.
#
#   bash ~/cryo-em/byeori/ingest_batch.sh <folder>          # shows the plan and asks once
#   bash ~/cryo-em/byeori/ingest_batch.sh <folder> --yes    # no question
#
# - Only the PDFs directly in <folder> (not subfolders). The files are only read.
# - A PDF whose bytes are already in Byeori (same SHA-256, under any name) is skipped, so running
#   it again on the same folder, or on Downloads with papers already added, adds nothing twice.
# - The stem is the file name in lowercase with other characters turned into hyphens
#   (s41467-026-71934-7.pdf -> s41467-026-71934-7). The note's title comes from the paper itself.
# - Notes are written by the deployed NoteModelId (Sonnet 5 via deploy_byeori.sh), about $0.07-0.10
#   a paper plus about $0.02 for extraction.
# - Waits for extraction (up to 40 minutes), then runs aws-pipeline-stems, which rebuilds the
#   search index at the end.
set -euo pipefail

FOLDER="${1:?usage: ingest_batch.sh <folder> [--yes]}"
YES=0
[ "${2:-}" = "--yes" ] && YES=1
BYEORI_DIR="${BYEORI_DIR:-$HOME/byeori}"
COST_PER_PAPER="0.10"

[ -d "$FOLDER" ] || { echo "no such folder: $FOLDER" >&2; exit 1; }
FOLDER="$(cd "$FOLDER" && pwd)"
cd "$BYEORI_DIR"
# shellcheck disable=SC1091
source .byeori.env

status_of() {
  aws dynamodb get-item --table-name "$AWS_KIRO_WIKI_TABLE" --key "{\"work_id\":{\"S\":\"$1\"}}" \
    --projection-expression ingest_status --query "Item.ingest_status.S" --output text 2>/dev/null
}
# The note has its own field: a noted paper keeps ingest_status fulltext_ready.
note_of() {
  aws dynamodb get-item --table-name "$AWS_KIRO_WIKI_TABLE" --key "{\"work_id\":{\"S\":\"$1\"}}" \
    --projection-expression source_note_status --query "Item.source_note_status.S" --output text 2>/dev/null
}

echo "==> reading what Byeori already holds"
known="$(aws dynamodb scan --table-name "$AWS_KIRO_WIKI_TABLE" --projection-expression pdf_sha256 \
  --query "Items[].pdf_sha256.S" --output text | tr '\t' '\n')"

echo "==> PDFs in $FOLDER"
plan_files=()
plan_stems=()
skipped=0
for pdf in "$FOLDER"/*.pdf "$FOLDER"/*.PDF; do
  [ -f "$pdf" ] || continue
  digest="$(shasum -a 256 "$pdf" | cut -d' ' -f1)"
  name="$(basename "$pdf")"
  # Supplementary files carry the paper's DOI, so one would be identified as the paper itself and
  # could take its place. They are left out; Byeori keeps supplements apart from papers.
  if printf '%s' "${name%.*}" | grep -qiE '(^|[^a-z])(si|esm|supp|suppl|supplement|supplementary|supporting)([^a-z]|$)'; then
    echo "  skip  $name (looks like supplementary material)"
    skipped=$((skipped + 1))
    continue
  fi
  if printf '%s\n' "$known" | grep -qx "$digest"; then
    echo "  skip  $name (already in Byeori)"
    skipped=$((skipped + 1))
    continue
  fi
  stem="$(printf '%s' "${name%.*}" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//')"
  [ "${#stem}" -ge 3 ] || stem="paper-$stem"
  echo "  add   $name -> $stem"
  plan_files+=("$pdf")
  plan_stems+=("$stem")
done

count="${#plan_stems[@]}"
if [ "$count" -eq 0 ]; then
  echo "nothing new to add ($skipped already in Byeori)"
  exit 0
fi
estimate="$(awk -v n="$count" -v c="$COST_PER_PAPER" 'BEGIN { printf "%.2f", n * c }')"
echo
echo "$count new paper(s), $skipped skipped. Estimated cost: about \$$estimate (notes by $(aws lambda get-function-configuration \
  --function-name "$AWS_KIRO_WIKI_INGEST_FUNCTION" --query Environment.Variables.NOTE_MODEL_ID --output text))."
if [ "$YES" != 1 ]; then
  printf 'Proceed? [y/N] '
  read -r answer
  case "$answer" in y|Y|yes) ;; *) echo "stopped; nothing was uploaded"; exit 0 ;; esac
fi

echo "==> 1/4 upload"
stems=()
i=0
while [ "$i" -lt "$count" ]; do
  out="$(uv run --quiet byeori upload-pdf "${plan_files[$i]}" --stem "${plan_stems[$i]}" 2>&1)" || true
  state="$(printf '%s' "$out" | grep -o '"state": *"[a-z_]*"' | head -1 | sed 's/.*"\([a-z_]*\)"$/\1/')"
  echo "  ${plan_stems[$i]}: ${state:-error}"
  case "$state" in uploaded|already_present) stems+=("${plan_stems[$i]}") ;; *) printf '%s\n' "$out" | tail -3 ;; esac
  i=$((i + 1))
done
[ "${#stems[@]}" -gt 0 ] || { echo "no upload succeeded" >&2; exit 1; }

tasks="${#stems[@]}"; [ "$tasks" -gt 4 ] && tasks=4
echo "==> 2/4 extract (${#stems[@]} paper(s), $tasks Fargate task(s))"
uv run --quiet byeori aws-extract --stems "${stems[@]}" --tasks "$tasks" >/dev/null

echo "==> 3/4 wait for extraction (checks every minute, up to 40 minutes)"
deadline=$(( $(date +%s) + 2400 ))
settle_until=0
while :; do
  waiting=0; ready=0; parked=0; failed=0
  for s in "${stems[@]}"; do
    case "$(status_of "$s")" in
      fulltext_ready|source_ready) ready=$((ready + 1)) ;;
      fulltext_ready_unclassified) parked=$((parked + 1)) ;;
      extract_failed) failed=$((failed + 1)) ;;
      *) waiting=$((waiting + 1)) ;;
    esac
  done
  echo "  $(date +%H:%M)  ready $ready  parked $parked  failed $failed  waiting $waiting"
  now=$(date +%s)
  if [ "$waiting" -eq 0 ]; then
    # A parked paper is often released by identity resolution a few minutes later.
    [ "$parked" -eq 0 ] && break
    [ "$settle_until" -eq 0 ] && settle_until=$(( now + 300 ))
    [ "$now" -ge "$settle_until" ] && break
  fi
  [ "$now" -ge "$deadline" ] && { echo "  stopped waiting after 40 minutes"; break; }
  sleep 60
done

ready_stems=()
for s in "${stems[@]}"; do
  [ "$(status_of "$s")" = "fulltext_ready" ] && [ "$(note_of "$s")" != "source_ready" ] && ready_stems+=("$s")
done
if [ "${#ready_stems[@]}" -gt 0 ]; then
  echo "==> 4/4 notes for ${#ready_stems[@]} paper(s) (then the index is rebuilt)"
  uv run --quiet byeori aws-pipeline-stems --stems "${ready_stems[@]}" | tail -15 || true
  uv run --quiet byeori validate | tail -3 || true
else
  echo "==> 4/4 no paper reached fulltext_ready; no notes written"
fi

echo
echo "==> result"
for s in "${stems[@]}"; do
  note="$(note_of "$s")"
  if [ "$note" = "source_ready" ]; then shown="source_ready"; else shown="$(status_of "$s")"; [ "$note" != "None" ] && [ -n "$note" ] && shown="$shown (note: $note)"; fi
  printf '  %-45s %s\n' "$s" "$shown"
done
cat <<'EOF'

source_ready                  note written and searchable
fulltext_ready_unclassified   paper not identified at OpenAlex; parked, no note (try another copy, or leave it)
extract_failed                GROBID could not read it; try: uv run byeori aws-extract --stems <stem> --preprocess ocr
fulltext_ready                text ready, no note yet; rerun this script, or: uv run byeori aws-pipeline-stems --stems <stem>
EOF
