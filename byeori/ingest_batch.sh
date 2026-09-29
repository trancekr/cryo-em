#!/usr/bin/env bash
# Put every PDF in one folder into Byeori: upload, extract, write the notes, check.
#
#   bash ~/cryo-em/byeori/ingest_batch.sh <folder>          # shows the plan and asks once
#   bash ~/cryo-em/byeori/ingest_batch.sh <folder> --yes    # no question
#   bash ~/cryo-em/byeori/ingest_batch.sh paper.pdf paper_SI.pdf   # or name the files themselves
#
# - Only the PDFs directly in <folder> (not subfolders); other files are listed as skipped.
#   The files are only read.
# - Supplementary PDFs are appended to their paper, not added as papers. A file whose name has
#   si / esm / supp / suppl / supplement(ary) / supporting in it is supplementary; it belongs to the
#   paper whose file name starts with the part before that word:
#       leonarski-2024-si.pdf            -> leonarski-2024-ion-binding-rna-mg.pdf
#       sanchez-garcia-2021-deepemhancer-si.pdf -> sanchez-garcia-2021-deepemhancer.pdf
#   The paper and its supplements are joined into one PDF (paper first) and that is uploaded, so
#   the note is written from both; cryo-EM data and refinement tables are often only in the SI.
#   A supplement that matches no paper, or more than one, is skipped with a message: rename it
#   <paper file name>-si.pdf. (Uploaded on its own, a supplement carries the paper's DOI and is
#   identified as the paper, which parks the real paper.)
# - A paper is skipped when its stem is already in Byeori or its bytes are (same SHA-256), so
#   running this again on the same folder adds nothing twice.
# - The stem is the file name in lowercase with other characters turned into hyphens
#   (s41467-026-71934-7.pdf -> s41467-026-71934-7). The note's title comes from the paper itself.
# - Notes are written by the deployed NoteModelId (Sonnet 5 via deploy_byeori.sh), about $0.07-0.10
#   a paper plus about $0.02 for extraction; a long supplement costs more.
# - Running it again carries on: a paper already in Byeori without a note is picked up again.
# - Waits for extraction (30 minutes plus one per paper), then runs aws-pipeline-stems, which rebuilds the
#   search index at the end.
set -euo pipefail

YES=0
inputs=()
for arg in "$@"; do
  case "$arg" in --yes) YES=1 ;; *) inputs+=("$arg") ;; esac
done
[ "${#inputs[@]}" -gt 0 ] || { echo "usage: ingest_batch.sh <folder> | <file.pdf> [<file_SI.pdf> ...] [--yes]" >&2; exit 2; }
BYEORI_DIR="${BYEORI_DIR:-$HOME/byeori}"
COST_PER_PAPER="0.10"
SI_WORD='(^|-)(si|esm|supp|suppl|supplement|supplementary|supporting)(-|[0-9]|$)'

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
if [ "${#inputs[@]}" -eq 1 ] && [ -d "${inputs[0]}" ]; then
  FOLDER="$(cd "${inputs[0]}" && pwd)"
else
  # Files named one by one: gather them (as links; nothing is copied) and treat that as the folder.
  FOLDER="$WORK/files"
  mkdir -p "$FOLDER"
  for f in "${inputs[@]}"; do
    [ -f "$f" ] || { echo "no such file or folder: $f" >&2; exit 1; }
    ln -s "$(cd "$(dirname "$f")" && pwd)/$(basename "$f")" "$FOLDER/$(basename "$f")"
  done
fi
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
norm() { printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//'; }

echo "==> reading what Byeori already holds"
known="$(aws dynamodb scan --table-name "$AWS_KIRO_WIKI_TABLE" --projection-expression pdf_sha256 \
  --query "Items[].pdf_sha256.S" --output text | tr '\t' '\n')"

# Only PDFs can go in; say what else is in the folder so nothing is left out silently.
for other in "$FOLDER"/*; do
  [ -f "$other" ] || continue
  case "$other" in *.pdf|*.PDF) ;; *.DS_Store) ;; *) echo "  skip  $(basename "$other") (not a PDF; convert it to PDF to include it)" ;; esac
done

main_files=(); main_norms=(); si_files=(); si_bases=()
for pdf in "$FOLDER"/*.pdf "$FOLDER"/*.PDF; do
  [ -f "$pdf" ] || continue
  n="$(norm "$(basename "${pdf%.*}")")"
  if printf '%s' "$n" | grep -qE "$SI_WORD"; then
    si_files+=("$pdf")
    si_bases+=("$(printf '%s' "$n" | sed -E "s/$SI_WORD.*//; s/-+$//")")
  else
    main_files+=("$pdf"); main_norms+=("$n")
  fi
done

# Which paper each supplement belongs to: the one paper whose name starts with its base.
si_owner=()
j=0
while [ "$j" -lt "${#si_files[@]}" ]; do
  base="${si_bases[$j]}"; owner=""; hits=0
  i=0
  while [ "$i" -lt "${#main_files[@]}" ]; do
    case "${main_norms[$i]}" in "$base"*) [ "${#base}" -ge 5 ] && { owner="$i"; hits=$((hits + 1)); } ;; esac
    i=$((i + 1))
  done
  [ "$hits" -eq 1 ] || owner=""
  si_owner+=("${owner:--}")
  if [ -z "$owner" ]; then
    echo "  skip  $(basename "${si_files[$j]}") (supplement: $hits matching papers; rename it <paper file name>-si.pdf)"
  fi
  j=$((j + 1))
done

echo "==> PDFs in $FOLDER"
plan_files=(); plan_stems=(); plan_notes=(); resume_stems=()
skipped=0
i=0
while [ "$i" -lt "${#main_files[@]}" ]; do
  pdf="${main_files[$i]}"; name="$(basename "$pdf")"
  stem="${main_norms[$i]}"; [ "${#stem}" -ge 3 ] || stem="paper-$stem"
  sis=(); j=0
  while [ "$j" -lt "${#si_files[@]}" ]; do
    [ "${si_owner[$j]}" = "$i" ] && sis+=("${si_files[$j]}")
    j=$((j + 1))
  done
  digest="$(shasum -a 256 "$pdf" | cut -d' ' -f1)"
  existing="$(status_of "$stem")"
  # In Byeori already but without a note (an earlier run stopped, or a note failed): carry it on.
  if [ -n "$existing" ] && [ "$existing" != "None" ] && [ "$(note_of "$stem")" != "source_ready" ]; then
    echo "  resume $name ($existing, no note yet)"
    resume_stems+=("$stem"); i=$((i + 1)); continue
  fi
  if printf '%s\n' "$known" | grep -qx "$digest" || { [ -n "$existing" ] && [ "$existing" != "None" ]; }; then
    echo "  skip  $name (already in Byeori, or the same file earlier in this folder)"
    skipped=$((skipped + 1)); i=$((i + 1)); continue
  fi
  known="$known
$digest"   # a second copy of the same file in this folder is skipped too
  upload="$pdf"; extra=""
  if [ "${#sis[@]}" -gt 0 ]; then
    upload="$WORK/$stem.pdf"
    uv run --quiet --no-project --with pypdf python -c '
import sys
from pypdf import PdfWriter
w = PdfWriter()
for p in sys.argv[2:]:
    w.append(p)
w.write(sys.argv[1])' "$upload" "$pdf" "${sis[@]}" 2>"$WORK/merge.log" \
      || { echo "  could not join $name with its supplement:"; tail -3 "$WORK/merge.log"; exit 1; }
    # pypdf's "Annotation sizes differ" warnings are about link annotations, not the text; hidden.
    extra=" +$(for f in "${sis[@]}"; do printf ' %s' "$(basename "$f")"; done)"
  fi
  echo "  add   $name$extra -> $stem"
  plan_files+=("$upload"); plan_stems+=("$stem"); plan_notes+=("${#sis[@]}")
  i=$((i + 1))
done

count="${#plan_stems[@]}"
if [ "$count" -eq 0 ] && [ "${#resume_stems[@]}" -eq 0 ]; then
  echo "nothing new to add ($skipped already in Byeori)"
  exit 0
fi
estimate="$(awk -v n="$((count + ${#resume_stems[@]}))" -v c="$COST_PER_PAPER" 'BEGIN { printf "%.2f", n * c }')"
echo
echo "$count new paper(s), ${#resume_stems[@]} to resume, $skipped skipped. Estimated cost: about \$$estimate (notes by $(aws lambda get-function-configuration \
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
  source_tag="upload-pdf"; [ "${plan_notes[$i]}" -gt 0 ] && source_tag="upload-pdf+supplement"
  out="$(uv run --quiet byeori upload-pdf "${plan_files[$i]}" --stem "${plan_stems[$i]}" --source "$source_tag" 2>&1)" || true
  state="$(printf '%s' "$out" | grep -o '"state": *"[a-z_]*"' | head -1 | sed 's/.*"\([a-z_]*\)"$/\1/')"
  echo "  ${plan_stems[$i]}: ${state:-error}"
  case "$state" in uploaded|already_present) stems+=("${plan_stems[$i]}") ;; *) printf '%s\n' "$out" | tail -3 ;; esac
  i=$((i + 1))
done
stems+=(${resume_stems[@]+"${resume_stems[@]}"})
[ "${#stems[@]}" -gt 0 ] || { echo "no upload succeeded" >&2; exit 1; }

# aws-extract leaves a paper whose text is already stored alone, so resumed papers cost nothing here.
tasks="${#stems[@]}"; [ "$tasks" -gt 8 ] && tasks=8
echo "==> 2/4 extract (${#stems[@]} paper(s), $tasks Fargate task(s))"
uv run --quiet byeori aws-extract --stems "${stems[@]}" --tasks "$tasks" >/dev/null

wait_min=$(( 30 + ${#stems[@]} ))
echo "==> 3/4 wait for extraction (checks every minute, up to $wait_min minutes)"
deadline=$(( $(date +%s) + wait_min * 60 ))
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
  [ "$now" -ge "$deadline" ] && { echo "  stopped waiting after $wait_min minutes; run this again later to carry on"; break; }
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
fulltext_ready                text ready, no note yet; run this script again on the same folder
EOF
