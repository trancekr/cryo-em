#!/usr/bin/env bash
# Copy the published wiki from S3 into a local folder to read in Obsidian (or any Markdown viewer).
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
aws s3 sync "s3://$AWS_KIRO_WIKI_BUCKET/wiki/" "$WIKI_DIR/" --delete --exclude ".obsidian/*" --only-show-errors
for d in sources concepts overviews questions; do
  [ -d "$WIKI_DIR/$d" ] && printf '  %-10s %s pages\n' "$d" "$(find "$WIKI_DIR/$d" -name '*.md' | wc -l | tr -d ' ')"
done
echo "wiki in $WIKI_DIR (open this folder as a vault in Obsidian; start from index.md)"
