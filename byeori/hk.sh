#!/usr/bin/env bash
# Cryo-EM HK Wiki: one menu for the everyday Byeori tasks (Mac mini).
#
#   hk                      # menu
#   hk add <folder|pdf...>  # add papers (what the "HK Wiki" app runs when PDFs are dropped on it)
#   hk install              # set up the `hk` command and the "HK Wiki" app (once)
#   hk send <pdf...>        # from any computer with the AWS credentials: put PDFs in the S3 inbox
#   hk inbox                # on the Mac mini: add what is in the inbox
#
# It only calls the scripts next to it and the byeori CLI. Steps that cost money say how much and
# ask first; steps that need judgement (curation, rewriting pages) stop and show a summary.
# Written for macOS bash 3.2 (no associative arrays, no mapfile).
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BYEORI_DIR="${BYEORI_DIR:-$HOME/byeori}"
SITE_DIR="${SITE_DIR:-$HOME/ByeoriWiki-site}"
LOG_DIR="$HERE/logs"
FIELDS="$HERE/curation/fields.tsv"

say()  { printf '\n\033[1m%s\033[0m\n' "$*"; }
ask()  { local a; read -r -p "$1 [y/N] " a; [ "$a" = y ] || [ "$a" = Y ]; }
pause() { read -r -p $'\n(Enter를 누르면 메뉴로)' _; }
env_on() { cd "$BYEORI_DIR" || exit 1; # shellcheck disable=SC1091
  source .byeori.env; }

# Fields with 15 or more papers get overview pages; naming a smaller one fails the whole run.
big_categories() {
  [ -f "$FIELDS" ] || return 0
  grep -v '^#' "$FIELDS" | awk -F'\t' '$2!="" {n[$2]++} END {for (f in n) if (n[f] >= 15) printf "--category %s ", f}'
}

# Turn what was typed or dragged into the terminal (paths with "\ " escapes, quotes, several at
# once) into one path per line.
read_paths() {
  local line; read -r -p "$1" line || return 1
  [ -n "${line// /}" ] || return 1
  eval "set -- $line" 2>/dev/null || { echo "경로를 읽지 못했습니다: $line" >&2; return 1; }
  for p in "$@"; do printf '%s\n' "$p"; done
}

add_papers() {
  say "논문 추가 (편당 약 \$0.1, 30~60분)"
  echo "보충자료는 같은 폴더에 '<본문 파일 이름>_SI.pdf'로 두면 본문에 붙습니다. 파일 이름의 연도는 출판 연도로."
  local args=()
  if [ "$#" -gt 0 ]; then args=("$@")
  else
    local paths; paths="$(read_paths $'PDF 폴더(또는 PDF 파일들)를 이 창에 끌어다 놓고 Enter: ')" || { echo "취소"; return; }
    while IFS= read -r p; do args+=("$p"); done <<< "$paths"
  fi
  # bioRxiv downloads (2026.10.07.757472v1.full.pdf) get Surname_Year_title names from their DOI first.
  local stage; stage="$(mktemp -d)/papers"
  local use=()
  while IFS= read -r p; do [ -n "$p" ] && use+=("$p"); done < <(python3 "$HERE/rename_preprints.py" "$stage" "${args[@]}")
  bash "$HERE/ingest_batch.sh" "${use[@]}"
  echo
  echo "다음: 메뉴 3(분야 정리) → 4(페이지 만들기). 위키에 바로 반영만 하려면 메뉴 6."
}

status() {
  env_on
  say "현재 상태"
  aws dynamodb scan --table-name "$AWS_KIRO_WIKI_TABLE" \
    --projection-expression "work_id,ingest_status,source_note_status,category" --output json |
    uv run --quiet --no-project python -c '
import json, sys, collections
items = [i for i in json.load(sys.stdin)["Items"] if "#" not in i["work_id"]["S"]]
get = lambda i, k: i.get(k, {}).get("S", "")
notes = [i for i in items if get(i, "source_note_status") == "source_ready"]
print(f"  논문 {len(items)}편, 노트 있음 {len(notes)}편")
for f, n in sorted(collections.Counter(get(i, "category") or "(분야 없음)" for i in notes).items()):
    print(f"    {f}: {n}")
odd = [get(i, "work_id") + " (" + get(i, "ingest_status") + ")" for i in items if get(i, "source_note_status") != "source_ready"]
if odd:
    print("  노트 없는 논문 (확인 필요):")
    for o in odd: print("    " + o)'
  echo "  마지막 페이지 작업:"
  uv run --quiet byeori aws-synthesis-status 2>/dev/null | uv run --quiet --no-project python -c '
import json, sys
try: d = json.load(sys.stdin)
except Exception: print("    (기록 없음)"); sys.exit()
print("    " + d.get("status", "?"), d.get("started_at", "")[:16].replace("T", " "), "→", (d.get("stopped_at") or "")[:16].replace("T", " "))'
}

curate() {
  say "분야 정리 (새 논문의 분야 지정, 비용 없음)"
  bash "$HERE/curate_prepare.sh" || return
  local blank; blank="$(grep -v '^#' "$FIELDS" | awk -F'\t' '$2==""' | wc -l | tr -d ' ')"
  if [ "$blank" = 0 ]; then echo "분야가 비어 있는 논문이 없습니다."
  else
    local prompt="byeori/CURATE.md 대로 큐레이션 해줘. fields.tsv에서 field 칸이 빈 ${blank}줄만 분류한다. 새 분야는 만들지 않는다. overrides.json은 새 Glossary 용어 중 merge/exclude가 필요한 것만 추가하고 기존 항목은 건드리지 않는다. 끝나면 분야별 편수와 ?확인필요 목록만 보고해."
    if command -v claude >/dev/null; then
      echo "Claude Code가 열리고 분류를 시작합니다(${blank}편). 보고가 나오면 /exit 로 닫으세요."
      ask "시작할까요?" || return
      (cd "$HERE/.." && claude "$prompt")
    else
      echo "Claude Code(claude)가 없습니다. 다른 터미널에서 cd ~/cryo-em && claude 로 열고 아래를 붙여 넣으세요:"
      echo; echo "$prompt"; echo
      read -r -p "분류가 끝나면 Enter " _
    fi
  fi
  say "반영 미리보기"
  bash "$HERE/apply_curation.sh" || return
  ask "이대로 반영할까요? (페이지 계획만 다시 세움, \$1 미만)" && bash "$HERE/apply_curation.sh" --apply
  echo; echo "다음: 3~5분 뒤 메뉴 4(페이지 만들기)."
}

manifest_summary() {
  uv run --quiet byeori aws-synthesis-manifest --scope all 2>/dev/null | uv run --quiet --no-project python -c '
import json, sys
d = json.load(sys.stdin)
for cat, c in (d.get("categories") or {}).items():
    if not c: continue
    subs = c.get("subtopics") or []
    notes = c.get("notes")
    print(f"  {cat}: 논문 {notes}편, 소주제 {len(subs)}개")
    for slug, n in sorted(subs, key=lambda s: -s[1]):
        flag = "   <- 가장 큰 소주제가 other: 메뉴에서 다시 나누기(r) 고려" if slug.endswith("-other") and n == max(x[1] for x in subs) else ""
        print(f"    {n:3d}  {slug}{flag}")'
}

pages() {
  env_on
  local cats; cats="$(big_categories)"
  say "페이지 만들기"
  echo "현재 계획:"; manifest_summary
  echo
  echo "  y  계획대로 쓰기: 바뀐 페이지만 다시 씀. 보통 \$1~5 (논문 몇 편이면 목록만 갱신, 거의 무료)"
  echo "  r  소주제 다시 나누기: other가 너무 커졌을 때. 그 분야 페이지 전부 새로 씀, \$8~12"
  echo "  n  취소"
  local a; read -r -p "선택 [y/r/n] " a
  case "$a" in
    r) local c; read -r -p "다시 나눌 분야 이름 (예: cryoem-processing): " c
       uv run byeori aws-synthesis-plan --scope all --category "$c" --replan | tail -3
       echo "3~5분 뒤 메뉴 4를 다시 열어 새 계획을 확인하고 y로 쓰세요."
       echo "소주제 이름이 바뀌면 예전 페이지 처리는 CURATE.md의 '소주제를 다시 나눌 때'를 따르세요."
       return ;;
    y|Y) ;;
    *) echo "취소"; return ;;
  esac
  # shellcheck disable=SC2086
  uv run byeori aws-synthesis-run --scope all $cats | tail -3
  echo "진행 중(보통 10~20분). 1분마다 확인합니다. Ctrl+C로 기다리기만 멈출 수 있고, 작업은 AWS에서 계속됩니다."
  local s=""
  while :; do
    sleep 60
    s="$(uv run --quiet byeori aws-synthesis-status 2>/dev/null | uv run --quiet --no-project python -c '
import json, sys
d = json.load(sys.stdin); m = d.get("maps") or []
done = sum(x.get("done", 0) for x in m); tot = sum(x.get("total", 0) for x in m)
print(d.get("status", "?"), f"{done}/{tot}")')"
    printf '  %s  %s\n' "$(date +%H:%M)" "$s"
    case "$s" in RUNNING*) ;; *) break ;; esac
  done
  case "$s" in SUCCEEDED*) bash "$HERE/sync_wiki.sh" >/dev/null && echo "웹 위키를 새로 만들었습니다(메뉴 6으로 열기)." ;; esac
}

LOCAL_DIR="${LOCAL_DIR:-$HOME/ByeoriWiki-local}"

question() {
  say "질문하기"
  echo "  a  무료: 이 컴퓨터의 Claude Code가 위키 사본을 읽고 답함 (Max 요금제, 추가 비용 없음)."
  echo "     답은 웹 위키 'My questions'에 저장. 이어서 추가 질문 가능."
  echo "  b  위키에 저장: Byeori(Bedrock)가 답하고 질문 페이지·관련 페이지까지 고침 (\$1~3, 최대 \$5)."
  echo "     중요한 질문, 위키에 남겨 다른 페이지와 연결할 질문에만."
  local c; read -r -p "선택 [a/b, Enter=a] " c
  case "${c:-a}" in a|A) local_question ;; b|B) bedrock_question ;; *) echo "취소" ;; esac
}

local_question() {
  command -v claude >/dev/null || { echo "Claude Code(claude)가 없습니다. https://claude.com/claude-code 에서 설치한 뒤 다시."; return; }
  echo "위키 사본을 최신으로 맞추는 중..."
  bash "$HERE/sync_wiki.sh" >/dev/null || { echo "위키 동기화 실패"; return; }
  mkdir -p "$LOCAL_DIR/questions"
  cp "$HERE/local_qa/CLAUDE.md" "$LOCAL_DIR/CLAUDE.md"
  local q; read -r -p "질문 (Enter만 누르면 Claude Code에서 직접 입력): " q
  echo "Claude Code가 열립니다. 답이 나오면 추가 질문을 이어서 해도 되고, 끝나면 /exit."
  if [ -n "$q" ]; then
    (cd "$LOCAL_DIR" && claude --add-dir "$HOME/ByeoriWiki" --permission-mode acceptEdits "$q")
  else
    (cd "$LOCAL_DIR" && claude --add-dir "$HOME/ByeoriWiki" --permission-mode acceptEdits)
  fi
  bash "$HERE/sync_wiki.sh" >/dev/null && echo "웹 위키 'My questions'에 반영했습니다(메뉴 6)."
}

bedrock_question() {
  env_on
  say "질문하기: 위키에 저장 (한 번 최대 \$5, 보통 \$1~3, 5~15분)"
  echo "영어로 쓰는 편이 노트 검색이 잘 됩니다. 한 줄로 입력하세요."
  local q; read -r -p "질문: " q
  [ -n "$q" ] || { echo "취소"; return; }
  ask "이 질문을 보낼까요?" || return
  mkdir -p "$LOG_DIR"
  local log; log="$LOG_DIR/answer-$(date +%Y%m%d-%H%M%S).json"
  echo "답변을 만드는 중... 창을 닫지 마세요. (전체 출력: $log)"
  uv run byeori aws-answer "$q" > "$log" 2>&1
  uv run --quiet --no-project python - "$log" <<'PY'
import json, sys
t = open(sys.argv[1]).read()
try: d = json.loads(t[t.index("{"):])
except Exception: print(t[-1500:]); sys.exit()
print(f"\n상태 {d.get('status')}, 비용 ${d.get('estimated_usd', 0):.2f}")
print("질문 페이지:", d.get("question_key", "").replace("wiki/", "").removesuffix(".md"))
pw = [p["key"] for p in d.get("pages_written", [])]
if pw:
    print("함께 고쳐진 페이지:"); [print("  " + k.replace("wiki/", "")) for k in pw]
    if any("/concepts/" in k for k in pw):
        print("  * 개념 페이지가 실제로 새 내용인지 확인: CURATE.md '질문 뒤에 확인할 것'")
PY
  bash "$HERE/sync_wiki.sh" >/dev/null && echo "웹 위키에 반영했습니다. 메뉴 6에서 Questions를 보세요."
}

open_wiki() {
  say "위키 최신으로 맞추고 열기"
  bash "$HERE/sync_wiki.sh" && open "$SITE_DIR/index.html"
}

costs() {
  env_on
  say "이번 달 비용"
  local acc; acc="$(aws sts get-caller-identity --query Account --output text)"
  aws budgets describe-budget --account-id "$acc" --budget-name "Byeori Claude" \
    --query 'Budget.[CalculatedSpend.ActualSpend.Amount, BudgetLimit.Amount, CalculatedSpend.ForecastedSpend.Amount]' \
    --output text 2>/dev/null | awk '{printf "  Byeori Claude 예산: 사용 $%.2f / 한도 $%.0f (월말 예상 $%.2f)\n", $1, $2, $3}'
  local start end
  start="$(date +%Y-%m-01)"; end="$(date -v+1d +%Y-%m-%d 2>/dev/null || date -d tomorrow +%Y-%m-%d)"
  aws ce get-cost-and-usage --time-period "Start=$start,End=$end" --granularity MONTHLY --metrics UnblendedCost \
    --group-by Type=DIMENSION,Key=SERVICE --output json 2>/dev/null | uv run --quiet --no-project python -c '
import json, sys
g = json.load(sys.stdin)["ResultsByTime"][0]["Groups"]
rows = sorted(((x["Keys"][0], float(x["Metrics"]["UnblendedCost"]["Amount"])) for x in g), key=lambda r: -r[1])
for k, v in rows:
    if "Claude" in k and v >= 0.01: print(f"    {k}: ${v:.2f}")
print(f"  계정 전체(cryoSPARC 등 포함): ${sum(v for _, v in rows):.2f}")'
  echo "  (AWS 비용은 하루 늦게 반영됩니다)"
}

install() {
  say "hk 명령과 HK Wiki 앱 설치"
  local rc="$HOME/.zshrc" line="alias hk='bash $HERE/hk.sh'"
  if grep -qF "$line" "$rc" 2>/dev/null; then echo "  hk 명령: 이미 있음"
  else printf '\n# Cryo-EM HK Wiki\n%s\n' "$line" >> "$rc"; echo "  hk 명령: ~/.zshrc에 추가 (새 터미널부터 사용)"; fi
  mkdir -p "$HOME/Applications"
  local app="$HOME/Applications/HK Wiki.app"
  rm -rf "$app"
  osacompile -o "$app" "$HERE/hk_app.applescript" && echo "  앱: $app"
  echo "  Finder에서 ~/Applications 의 'HK Wiki'를 Dock으로 끌어다 두세요."
  echo "  처음 쓸 때 'Terminal 제어 허용' 창이 뜨면 허용을 누르세요."
}

guide() { open "$SITE_DIR/guide.html" 2>/dev/null || open "$HERE/GUIDE.md"; }

# A paper inbox in the Byeori bucket (s3://<bucket>/inbox/): any machine with the AWS credentials can drop
# PDFs there (hk send, no Byeori needed), and the Mac mini adds them later (hk inbox).
data_bucket() {
  aws s3api list-buckets --query "Buckets[?starts_with(Name,'byeori-databucket')].Name | [0]" --output text 2>/dev/null
}

send() {
  local b; b="$(data_bucket)"
  [ -n "$b" ] && [ "$b" != None ] || { echo "Byeori 버킷을 찾지 못했습니다(AWS 자격 증명 확인)." >&2; return 1; }
  local args=()
  if [ "$#" -gt 0 ]; then args=("$@")
  else
    local paths; paths="$(read_paths $'보낼 PDF(또는 폴더)를 이 창에 끌어다 놓고 Enter: ')" || { echo "취소"; return; }
    while IFS= read -r p; do args+=("$p"); done <<< "$paths"
  fi
  local n=0
  for a in "${args[@]}"; do
    if [ -d "$a" ]; then
      aws s3 cp "$a" "s3://$b/inbox/" --recursive --exclude "*" --include "*.pdf" --include "*.PDF" --only-show-errors && n=$((n + 1))
    else
      aws s3 cp "$a" "s3://$b/inbox/$(basename "$a")" --only-show-errors && n=$((n + 1)) && echo "  보냄 $(basename "$a")"
    fi
  done
  echo "받은 논문함에 올렸습니다. 맥미니에서 hk inbox (또는 메뉴 9)로 추가하세요."
}

inbox() {
  env_on
  local b="$AWS_KIRO_WIKI_BUCKET"
  local list; list="$(aws s3 ls "s3://$b/inbox/" 2>/dev/null | grep -iE '\.pdf$' | sed -E 's/^[^ ]+ +[^ ]+ +[^ ]+ +//')"
  if [ -z "$list" ]; then say "받은 논문함이 비어 있습니다."; return; fi
  say "받은 논문함"; printf '  %s\n' "$list"
  local d; d="$(mktemp -d)/inbox"; mkdir -p "$d"
  aws s3 cp "s3://$b/inbox/" "$d/" --recursive --exclude "*/*" --only-show-errors
  add_papers "$d"
  ask "받은 논문함을 비울까요? (결과가 source_ready인지 확인한 뒤 y)" && \
    while IFS= read -r f; do aws s3 mv "s3://$b/inbox/$f" "s3://$b/inbox/done/$f" --only-show-errors; done <<< "$list" && echo "비웠습니다(inbox/done/에 보관)."
}

# Everything an over-eager cleanup broke on 2026-11-25, checked in one pass (read-only).
check() {
  env_on
  local R="--region ${AWS_REGION:-us-east-1}" bad=0 v
  say "Byeori 점검 (us-east-1, 읽기만)"
  ok()   { printf '  \033[32mOK\033[0m   %s\n' "$*"; }
  fail() { printf '  \033[31m문제\033[0m %s\n' "$*"; bad=$((bad + 1)); }
  # shellcheck disable=SC2086
  v="$(aws cloudformation describe-stacks --stack-name "$KIRO_WIKI_STACK" $R --query 'Stacks[0].[StackStatus,EnableTerminationProtection]' --output text 2>/dev/null)"
  case "$v" in *COMPLETE*True*) ok "스택 $v" ;; *) fail "스택: ${v:-없음} (종료 보호 꺼짐 또는 스택 없음)" ;; esac
  # shellcheck disable=SC2086
  v="$(aws s3api get-bucket-versioning --bucket "$AWS_KIRO_WIKI_BUCKET" $R --query Status --output text 2>&1)"
  [ "$v" = Enabled ] && ok "데이터 버킷, 버전 관리 켜짐" || fail "데이터 버킷: $v"
  # shellcheck disable=SC2086
  v="$(aws s3 ls "s3://$AWS_KIRO_WIKI_BUCKET/wiki/sources/" $R 2>/dev/null | wc -l | tr -d ' ')"
  [ "$v" -gt 0 ] && ok "노트 ${v}개" || fail "노트 0개 (버킷이 비었음: 로컬 ~/ByeoriWiki 를 지우지 말 것)"
  # shellcheck disable=SC2086
  v="$(aws s3api get-bucket-notification-configuration --bucket "$AWS_KIRO_WIKI_BUCKET" $R --output json 2>/dev/null | grep -c EventBridgeConfiguration)"
  [ "$v" -gt 0 ] && ok "버킷 EventBridge 알림" || fail "버킷 EventBridge 알림 꺼짐"
  # shellcheck disable=SC2086
  v="$(aws dynamodb describe-continuous-backups --table-name "$AWS_KIRO_WIKI_TABLE" $R --query 'ContinuousBackupsDescription.PointInTimeRecoveryDescription.PointInTimeRecoveryStatus' --output text 2>&1)"
  [ "$v" = ENABLED ] && ok "카탈로그 테이블, PITR 켜짐" || fail "카탈로그 테이블/PITR: $v"
  local f c
  # shellcheck disable=SC2086
  for f in $(aws lambda list-functions $R --query "Functions[?starts_with(FunctionName,'$KIRO_WIKI_STACK-')].FunctionName" --output text); do
    c="$(aws lambda get-function-concurrency --function-name "$f" $R --query ReservedConcurrentExecutions --output text 2>/dev/null)"
    [ "$c" = 0 ] && fail "$f 동시 실행 0 (정지됨): aws lambda delete-function-concurrency --function-name $f $R" || ok "${f%-*} 실행 가능"
  done
  # shellcheck disable=SC2086
  while read -r n st; do
    [ -n "$n" ] || continue
    [ "$st" = ENABLED ] && ok "규칙 ${n%-*}" || fail "규칙 $n $st: aws events enable-rule --name $n $R"
  done < <(aws events list-rules $R --query "Rules[?starts_with(Name,'$KIRO_WIKI_STACK-')].[Name,State]" --output text)
  # shellcheck disable=SC2086
  v="$(aws cloudtrail get-trail-status --name "$KIRO_WIKI_STACK-wiki-edits" $R --query '[IsLogging,LatestDeliveryError]' --output text 2>&1)"
  case "$v" in True*None*|"True	") ok "감사 기록(CloudTrail) 정상" ;; *) fail "감사 기록: $v" ;; esac
  [ "$bad" = 0 ] && say "모두 정상" || say "문제 ${bad}건: 위 줄의 명령으로 고치거나 AWS-SETUP.md '사고 기록' 참고"
}

menu() {
  while :; do
    printf '\n\033[1m=== Cryo-EM HK Wiki ===\033[0m\n'
    echo "  1) 논문 추가"
    echo "  2) 현재 상태"
    echo "  3) 분야 정리 (새 논문 분류)"
    echo "  4) 페이지 만들기"
    echo "  5) 질문하기 (a 무료 / b 위키에 저장)"
    echo "  6) 위키 열기 (최신으로 맞춤)"
    echo "  7) 이번 달 비용"
    echo "  8) 사용 안내"
    echo "  9) 받은 논문함 추가 (다른 컴퓨터에서 hk send로 보낸 PDF)"
    echo "  c) AWS 점검 (버킷·Lambda·규칙·백업이 살아 있는지)"
    echo "  0) 끝"
    local c; read -r -p "번호: " c
    case "$c" in
      1) add_papers; pause ;; 2) status; pause ;; 3) curate; pause ;; 4) pages; pause ;;
      5) question; pause ;; 6) open_wiki ;; 7) costs; pause ;; 8) guide ;; 9) inbox; pause ;; c|C) check; pause ;;
      0|q|"") return ;; *) echo "1~9 또는 0" ;;
    esac
  done
}

case "${1:-}" in
  add) shift; add_papers "$@"; read -r -p $'\n끝났습니다. Enter를 누르면 창을 닫아도 됩니다.' _ ;;
  install) install ;;
  send) shift; send "$@" ;;
  inbox) inbox ;;
  check) check ;;
  status) status ;; costs) costs ;; wiki) open_wiki ;;
  "") menu ;;
  *) echo "usage: hk [add <folder|pdf...> | send <pdf...> | inbox | check | status | costs | wiki | install]" >&2; exit 2 ;;
esac
