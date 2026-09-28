#!/usr/bin/env bash
# Prepare the office Mac mini for Byeori and apply the structural-biology journal list.
#
# Run from a clone of this repository (cryo-em), on the Mac mini:
#
#   bash byeori/setup_macmini.sh              # check tools, clone Byeori, fill ids, ask before merging
#   bash byeori/setup_macmini.sh --yes        # same, merge without asking
#   bash byeori/setup_macmini.sh --with-docker  # also install colima + docker (for build-workers)
#
# What it does, in order:
#   1. checks macOS and the chip (Apple Silicon builds Byeori's worker image natively)
#   2. installs the missing command-line tools with Homebrew: git, uv, awscli
#   3. clones joonan-lab/byeori at the pinned release into $BYEORI_DIR (default ~/byeori)
#   4. uv sync (Byeori's Python environment)
#   5. looks up the journals' OpenAlex ids and prints the report
#   6. merges the list into Byeori's journals.json on a local branch and commits it there
#   7. checks the result with Byeori's own journal_policy module
#
# It creates nothing in AWS and costs nothing. `byeori init` and `byeori deploy` stay separate.
# Safe to run again: a finished step is skipped.
set -euo pipefail

BYEORI_DIR="${BYEORI_DIR:-$HOME/byeori}"
BYEORI_REF="${BYEORI_REF:-v0.1.0-beta.1}"
BRANCH="cryoem-journals"
HERE="$(cd "$(dirname "$0")" && pwd)"
YES=0
WITH_DOCKER=0
for arg in "$@"; do
  case "$arg" in
    --yes) YES=1 ;;
    --with-docker) WITH_DOCKER=1 ;;
    *) echo "unknown option: $arg" >&2; exit 2 ;;
  esac
done

step() { printf '\n==> %s\n' "$1"; }

step "1. macOS and chip"
if [ "$(uname -s)" != "Darwin" ]; then
  echo "this script is for macOS; found $(uname -s)" >&2
  exit 1
fi
arch="$(uname -m)"
echo "macOS $(sw_vers -productVersion), $arch"
if [ "$arch" != "arm64" ]; then
  echo "note: Intel Mac. Everything here works, but 'byeori build-workers' would need arm64 emulation."
fi

step "2. command-line tools"
if ! command -v brew >/dev/null 2>&1; then
  echo "Homebrew is missing. Install it first (https://brew.sh), then run this script again." >&2
  exit 1
fi
for tool in git uv aws; do
  if command -v "$tool" >/dev/null 2>&1; then
    echo "ok  $tool"
  else
    formula="$tool"
    [ "$tool" = "aws" ] && formula="awscli"
    echo "installing $formula"
    brew install "$formula"
  fi
done
if command -v docker >/dev/null 2>&1; then
  echo "ok  docker"
elif [ "$WITH_DOCKER" = 1 ]; then
  echo "installing colima and docker"
  brew install colima docker
  echo "start it with: colima start"
else
  echo "--  docker not installed (only 'byeori build-workers' needs it; rerun with --with-docker)"
fi

step "3. Byeori clone ($BYEORI_DIR)"
if [ -d "$BYEORI_DIR/.git" ]; then
  echo "already cloned: $(git -C "$BYEORI_DIR" describe --tags --always) on $(git -C "$BYEORI_DIR" branch --show-current)"
else
  git -c advice.detachedHead=false clone --branch "$BYEORI_REF" https://github.com/joonan-lab/byeori "$BYEORI_DIR"
fi

step "4. uv sync"
(cd "$BYEORI_DIR" && uv sync --quiet)
echo "ok"

POLICY="$BYEORI_DIR/src/byeori/policies/journals.json"
if git -C "$BYEORI_DIR" rev-parse --verify --quiet "$BRANCH" >/dev/null; then
  step "5-6. journal list"
  echo "already applied on branch '$BRANCH' in $BYEORI_DIR; skipping the lookup and the merge"
else
  step "5. OpenAlex ids"
  (cd "$BYEORI_DIR" && uv run --quiet python "$HERE/fill_openalex_ids.py")

  step "6. merge into $POLICY"
  if [ "$YES" != 1 ]; then
    printf 'Merge this list (and remove the ML conferences and Journal of Data Science)? [y/N] '
    read -r answer
    case "$answer" in
      y|Y|yes) ;;
      *) echo "stopped before merging; nothing in $BYEORI_DIR was changed"; exit 0 ;;
    esac
  fi
  if [ -n "$(git -C "$BYEORI_DIR" status --porcelain -- src/byeori/policies/journals.json)" ]; then
    echo "journals.json has uncommitted changes in $BYEORI_DIR; commit or discard them first" >&2
    exit 1
  fi
  # Merge first: it refuses before writing anything if the id cap would be exceeded, so a failure
  # leaves neither a changed file nor an empty branch behind.
  (cd "$BYEORI_DIR" && uv run --quiet python "$HERE/fill_openalex_ids.py" --no-lookup --merge "$POLICY")
  rm -f "$POLICY.bak"   # git keeps the original; the branch is the record of the change
  git -C "$BYEORI_DIR" switch --quiet -c "$BRANCH"
  git -C "$BYEORI_DIR" add src/byeori/policies/journals.json
  identity=()
  if [ -z "$(git -C "$BYEORI_DIR" config user.email || true)" ]; then
    identity=(-c "user.name=$(id -un)" -c "user.email=$(id -un)@$(hostname -s)")
  fi
  git -C "$BYEORI_DIR" ${identity[@]+"${identity[@]}"} commit --quiet -m "Structural-biology journal list for the lab

Adds 21 cryo-EM and structural-biology journals to lab_additions and removes the
machine-learning conferences and Journal of Data Science (from trancekr/cryo-em byeori/)."
  echo "committed on branch '$BRANCH' in $BYEORI_DIR"
fi

step "7. check"
(cd "$BYEORI_DIR" && uv run --quiet python -c "
from byeori import journal_policy as j
print('source ids in the search filter:', len(j.SOURCE_IDS), 'of 100')
for name, issn in [('Structure', '0969-2126'), ('eLife', '2050-084X'), ('IUCrJ', '2052-2525')]:
    print(f'{name:10s}', j.journal_verdict(name, [issn])['verdict'])
print('ICLR      ', j.journal_verdict('International Conference on Learning Representations')['verdict'])
")

cat <<EOF

Done. Nothing was created in AWS.
Next, when you decide how to run Byeori (see $HERE/README.md):
  cd $BYEORI_DIR
  aws configure --profile byeori
  uv run byeori init
  source .byeori.env && uv run byeori deploy
EOF
