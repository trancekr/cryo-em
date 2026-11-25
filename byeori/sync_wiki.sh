#!/usr/bin/env bash
# Copy the published wiki from S3 into a local folder, then build browser pages from it
# (~/ByeoriWiki-site/index.html; wiki_site.py). The Markdown folder also opens as an Obsidian vault.
#
#   bash ~/cryo-em/byeori/sync_wiki.sh            # into ~/ByeoriWiki
#   WIKI_DIR=~/somewhere bash ~/cryo-em/byeori/sync_wiki.sh
#
# The wiki links pages as [[sources/...]], [[concepts/...]], [[overviews/...]], [[questions/...]],
# which Obsidian resolves when the folder is opened as a vault. Read-only: edits made locally are
# overwritten by the next sync and never go back to S3. Obsidian's own settings (.obsidian/) are kept.
set -euo pipefail

BYEORI_DIR="${BYEORI_DIR:-$HOME/byeori}"
WIKI_DIR="${WIKI_DIR:-$HOME/ByeoriWiki}"
# shellcheck disable=SC1091
source "$BYEORI_DIR/.byeori.env"

mkdir -p "$WIKI_DIR"
# Guard: the local copy is the last backup if the bucket is emptied (2026-11-25 an agent deleted the
# whole bucket; a plain sync --delete would have wiped this copy too). Refuse when S3 holds far fewer
# notes than the local copy, and keep a dated snapshot before every sync that removes anything.
remote="$(aws s3 ls "s3://$AWS_KIRO_WIKI_BUCKET/wiki/sources/" --region "${AWS_REGION:-us-east-1}" 2>/dev/null | wc -l | tr -d ' ')"
local_n="$(find "$WIKI_DIR/sources" -name '*.md' 2>/dev/null | wc -l | tr -d ' ')"
if [ "$local_n" -gt 10 ] && [ "$remote" -lt $((local_n / 2)) ]; then
  echo "중단: S3 노트 ${remote}개 < 로컬 ${local_n}개의 절반. 버킷이 비었을 수 있어 로컬 사본을 지우지 않습니다." >&2
  echo "확인: aws s3 ls s3://$AWS_KIRO_WIKI_BUCKET/wiki/sources/ --region us-east-1 | wc -l" >&2
  exit 1
fi
if [ "$local_n" -gt 0 ] && aws s3 sync "s3://$AWS_KIRO_WIKI_BUCKET/wiki/" "$WIKI_DIR/" --delete --exclude ".obsidian/*" --dryrun --region "${AWS_REGION:-us-east-1}" | grep -q '^(dryrun) delete'; then
  snap="$WIKI_DIR-snapshots/$(date +%Y%m%d-%H%M)"; mkdir -p "$snap" && cp -a "$WIKI_DIR/." "$snap/" && echo "  지울 파일이 있어 먼저 스냅샷: $snap"
fi
aws s3 sync "s3://$AWS_KIRO_WIKI_BUCKET/wiki/" "$WIKI_DIR/" --delete --exclude ".obsidian/*" --only-show-errors --region "${AWS_REGION:-us-east-1}"
for d in sources concepts overviews questions; do
  [ -d "$WIKI_DIR/$d" ] && printf '  %-10s %s pages\n' "$d" "$(find "$WIKI_DIR/$d" -name '*.md' | wc -l | tr -d ' ')"
done
SITE_DIR="${SITE_DIR:-$HOME/ByeoriWiki-site}"
# Answers from hk 5 → a (local Claude Code) live outside the S3 copy, so a sync never deletes them.
LOCAL_DIR="${LOCAL_DIR:-$HOME/ByeoriWiki-local}"
uv run --quiet --no-project --with markdown python "$(dirname "$0")/wiki_site.py" "$WIKI_DIR" "$SITE_DIR" "$LOCAL_DIR"
echo "open in a browser:  open $SITE_DIR/index.html"
