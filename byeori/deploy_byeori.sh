#!/usr/bin/env bash
# Deploy Byeori with this lab's cost settings, every time.
#
# `byeori deploy` does not remember Key=Value overrides: a plain deploy puts back Opus 5 with
# IngestReasoning=high (about $0.30 a paper). Notes are written by Sonnet 5 since 2026-09-28: on two
# cryo-EM papers it matched Opus 5 on every number checked, at about a third of the cost
# (Opus $0.25 a paper measured). The fallback for a declined note stays Opus 5.
# Deploy through this script so the lab's settings are always passed. Extra Key=Value arguments
# are added after them and win.
#
#   bash ~/cryo-em/byeori/deploy_byeori.sh
#   bash ~/cryo-em/byeori/deploy_byeori.sh NoteModelId=global.anthropic.claude-opus-5   # back to Opus
set -euo pipefail

BYEORI_DIR="${BYEORI_DIR:-$HOME/byeori}"
LAB_SETTINGS=(
  NoteModelId=global.anthropic.claude-sonnet-5   # about $0.07-0.10 a paper
  IngestReasoning=default      # no thinking for notes
  SynthesisReasoning=medium
  QuestionBudgetUsd=5          # ceiling per research question, in dollars
)

cd "$BYEORI_DIR"
[ -f .byeori.env ] || { echo "no .byeori.env in $BYEORI_DIR; run 'uv run byeori init' first" >&2; exit 1; }
# shellcheck disable=SC1091
source .byeori.env
echo "deploying stack ${KIRO_WIKI_STACK:-?} in ${AWS_REGION:-?} with: ${LAB_SETTINGS[*]} $*"
uv run byeori deploy "${LAB_SETTINGS[@]}" "$@"
