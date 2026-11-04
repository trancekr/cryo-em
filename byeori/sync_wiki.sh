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
aws s3 sync "s3://$AWS_KIRO_WIKI_BUCKET/wiki/" "$WIKI_DIR/" --delete --exclude ".obsidian/*" --only-show-errors
for d in sources concepts overviews questions; do
  [ -d "$WIKI_DIR/$d" ] && printf '  %-10s %s pages\n' "$d" "$(find "$WIKI_DIR/$d" -name '*.md' | wc -l | tr -d ' ')"
done
SITE_DIR="${SITE_DIR:-$HOME/ByeoriWiki-site}"
# Answers from hk 5 → a (local Claude Code) live outside the S3 copy, so a sync never deletes them.
LOCAL_DIR="${LOCAL_DIR:-$HOME/ByeoriWiki-local}"
uv run --quiet --no-project --with markdown python "$(dirname "$0")/wiki_site.py" "$WIKI_DIR" "$SITE_DIR" "$LOCAL_DIR"
echo "open in a browser:  open $SITE_DIR/index.html"
