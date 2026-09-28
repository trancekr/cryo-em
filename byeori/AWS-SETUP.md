# Byeori AWS 설치 런북 (맥미니)

맥미니의 Claude Code 세션이 이 문서를 따라 Byeori를 AWS(us-east-1)에 설치한다.
사람(사용자)과 에이전트(Claude Code)의 몫을 나누고, 단계마다 **체크포인트**에서 결과를 판단해
`~/cryo-em/byeori/SETUP-LOG.md`에 기록한다.

시작: 맥미니에서
```bash
cd ~/cryo-em && git pull && claude
```
후 Claude Code에 **"byeori/AWS-SETUP.md 를 읽고 에이전트 규칙대로 CP0부터 진행해줘"** 라고 입력한다.
중단했다가 이어갈 때는 "SETUP-LOG.md 보고 이어서 진행해줘".

---

## 에이전트에게: 진행 규칙

1. **한 번에 한 체크포인트.** 각 체크포인트의 명령을 실행하고, "판단 기준" 표로 PASS / FAIL / 사용자 확인
   필요 중 하나를 정한다. FAIL이면 "대응"을 따르고, 대응에 없는 상황이면 멈추고 사용자에게 묻는다.
2. **돈이 드는 단계 전에는 반드시 사용자 확인.** 표시: 💰. 비용과 되돌리는 방법을 한 줄로 말하고 "진행할까요?"를 묻는다.
3. **비밀값을 다루지 않는다.** 액세스 키, OpenAlex 키를 채팅에 붙여 달라고 하지 않는다. 키 입력이 필요한 명령
   (`aws configure`, `read -rs`)은 사용자가 **별도 터미널 창**에서 직접 실행하도록 안내하고, 에이전트는 결과만 확인한다.
4. **리전과 프로필.** Byeori 명령은 항상 `cd ~/byeori && source .byeori.env` 후 실행한다(`.byeori.env`가
   `AWS_PROFILE`, `AWS_REGION=us-east-1`을 설정). CP2 이전의 `aws` 명령에는 `--profile "$PROFILE" --region us-east-1`을 붙인다.
5. **💰 명령은 자동 모드가 막을 수 있다.** 막히면 우회하지 말고, 사용자에게 새 터미널에서 직접 실행할 명령을 한 줄씩 주고 결과를 받아 판단한다 (2026-09-28 CP4에서 발생).
6. **배포는 항상 `bash ~/cryo-em/byeori/deploy_byeori.sh`로.** `uv run byeori deploy`를 직접 쓰면 비용 설정이 기본값(Opus 5,
   추론 high)으로 돌아간다.
7. **기록.** 체크포인트가 끝날 때마다 `SETUP-LOG.md`에 아래 형식으로 추가한다. 계정 번호는 뒤 4자리만, 키 값은 절대 기록하지 않는다.
   ```markdown
   ## CP<n> <이름> — PASS | FAIL | 보류   (YYYY-MM-DD HH:MM)
   - 확인한 것: ...
   - 판단: ...
   - 다음: ...
   ```
   로그 파일은 **`~/cryo-em/byeori/SETUP-LOG.md`** 하나뿐이다(`~/cryo-em/byeori/.gitignore`에 이미 있음).
   **커밋하지 않는다.** `~/byeori`(joonan-lab/byeori 클론)의 파일은 읽기만 하고 수정·커밋하지 않는다
   (`.gitignore` 포함; 저널 목록은 이미 `cryoem-journals` 브랜치에 반영됨). 사용자가 클라우드 세션에
   공유하고 싶으면 로그 내용을 붙여 넣게 한다.
8. **요약.** 체크포인트마다 사용자에게 3줄 이내로 요약한다: 결과, 다음에 할 일, 사용자가 할 일(있으면).

---

## 설치 전 결정 사항 (기본값)

| 항목 | 값 | 비고 |
|---|---|---|
| 리전 | `us-east-1` | Byeori 검증 리전. 모델은 `global.` 경로라 서울을 골라도 처리 위치는 해외일 수 있음 |
| AWS 프로필 | `default` (사용자 `hanseonk`) | 프로필 기본 리전(ap-northeast-2)은 무시됨. Byeori는 `.byeori.env`의 리전을 씀 |
| 스택 이름 | `byeori` | |
| VPC | 새로 만듦(`true`) | 퍼블릭 서브넷만, NAT 없음 → 유휴 비용 0 |
| 노트 모델 | **Sonnet 5** (2026-09-28 전환), `IngestReasoning=default`, 예비 모델 Opus 5 | 실측 Sonnet $0.067 / Opus $0.25 (cryo-EM 논문 각 1편, 수치 정확도 동등) (+추출 $0.02) |
| 질문 상한 | `QuestionBudgetUsd=5` | |
| 그림 추출 이미지 | 건너뜀 | Docker 없음. 텍스트·노트에는 영향 없음 |

---

## CP0. 사전 점검 (에이전트)

```bash
sw_vers -productVersion; uname -m
uv --version; aws --version; git --version
git -C ~/byeori branch --show-current
git -C ~/byeori log -1 --oneline
aws configure list-profiles
```
Byeori에 쓸 프로필은 **`default`** (2026-09-28 확인: `default`·`cryosparc`는 같은 사용자, 권한 시뮬레이션 17개 모두 allowed). `PROFILE=default`로 두고:
```bash
aws sts get-caller-identity --profile "$PROFILE"
aws iam simulate-principal-policy --profile "$PROFILE" \
  --policy-source-arn "$(aws sts get-caller-identity --profile "$PROFILE" --query Arn --output text)" \
  --action-names iam:CreateRole iam:PutRolePolicy iam:AttachRolePolicy iam:PassRole \
    iam:CreateServiceLinkedRole ecs:CreateCluster ecs:RegisterTaskDefinition \
    ecr:CreateRepository states:CreateStateMachine events:PutRule cloudtrail:CreateTrail \
    ssm:PutParameter bedrock:InvokeModel s3:CreateBucket lambda:CreateFunction \
    dynamodb:CreateTable ec2:CreateVpc \
  --query "EvaluationResults[].[EvalActionName,EvalDecision]" --output table
```

| 판단 기준 | PASS |
|---|---|
| 칩 | `arm64` |
| 도구 | uv, aws(v2), git 버전이 나옴 |
| Byeori 브랜치 | `cryoem-journals`, 최근 커밋이 "Structural-biology journal list for the lab" |
| 자격 증명 | `get-caller-identity`가 계정·ARN 출력 |
| 권한 | 시뮬레이션 결과 전부 `allowed` (조직 SCP는 시뮬레이션에 안 잡히므로 CP4에서 최종 확인) |

| 대응 | |
|---|---|
| 브랜치가 다름 | `bash ~/cryo-em/byeori/setup_macmini.sh` 재실행 |
| `ExpiredToken` / SSO | 사용자가 `aws sso login --profile "$PROFILE"` |
| 계정이 의도와 다름 (개인/기관) | 멈추고 사용자에게 확인 |

---

## CP1. 콘솔 준비 (사용자) + 확인 (에이전트)

사용자가 AWS 콘솔(**오른쪽 위 리전을 us-east-1로**)과 openalex.org에서 할 일:

1. **Bedrock 모델 권한**: Bedrock → Model access(또는 Model catalog)에서 Anthropic **Claude Opus 5**, **Claude Sonnet 5**
   요청. 사용 목적 양식이 나오면 "Research – summarizing scientific papers for an internal lab knowledge base".
2. **예산 알림**: Billing → Budgets → 월 $20, 80%·100% 이메일 알림.
3. **OpenAlex 키**: openalex.org 가입 → Settings/API → 키 복사 (아직 어디에도 붙이지 않는다).

에이전트 확인:
```bash
aws bedrock list-inference-profiles --region us-east-1 --profile "$PROFILE" \
  --query "inferenceProfileSummaries[?contains(inferenceProfileId,'claude')].inferenceProfileId" --output text
aws budgets describe-budgets --account-id "$(aws sts get-caller-identity --profile "$PROFILE" --query Account --output text)" \
  --profile "$PROFILE" --region us-east-1 --query "Budgets[].{name:BudgetName,limit:BudgetLimit.Amount}" --output table
```

| 판단 기준 | PASS |
|---|---|
| 모델 | 목록에 `global.anthropic.claude-opus-5` 포함 (실제 호출 권한은 CP5에서 확정) |
| 예산 | 예산이 1개 이상 |
| OpenAlex 키 | 사용자가 "발급했다"고 확인 |

예산이 없으면 경고만 하고 진행 가능(사용자 선택).

---

## CP2. `byeori init` (에이전트)

사용자에게 연락 이메일(비워도 됨)을 묻고:
```bash
cd ~/byeori
uv run byeori init --non-interactive \
  --set AWS_PROFILE="$PROFILE" --set AWS_REGION=us-east-1 --set KIRO_WIKI_STACK=byeori \
  --set KIRO_WIKI_OPENALEX_PARAMETER=/byeori/openalex-api-key \
  --set KIRO_WIKI_CONTACT_EMAIL="<이메일 또는 빈 값>" --set KIRO_WIKI_CREATE_VPC=true
cat .byeori.env
```

| 판단 기준 | PASS |
|---|---|
| `.byeori.env` | `AWS_PROFILE`, `AWS_REGION=us-east-1`, `KIRO_WIKI_STACK=byeori`, `KIRO_WIKI_CREATE_VPC=true` 포함 |

---

## CP3. OpenAlex 키 저장 (사용자) + 확인 (에이전트)

사용자가 **별도 터미널 창**에서 (키가 화면·기록에 남지 않음):
```bash
cd ~/byeori && source .byeori.env
read -rs KEY          # 키 붙여넣고 Enter
curl -s "https://api.openalex.org/sources?filter=issn:0969-2126&api_key=$KEY" | grep -o '"display_name":"Structure"' | head -1
aws ssm put-parameter --name "$KIRO_WIKI_OPENALEX_PARAMETER" --type SecureString --value "$KEY"
unset KEY
```
에이전트 확인 (값은 읽지 않음):
```bash
cd ~/byeori && source .byeori.env
aws ssm describe-parameters --parameter-filters "Key=Name,Values=$KIRO_WIKI_OPENALEX_PARAMETER" \
  --query "Parameters[].{name:Name,type:Type,modified:LastModifiedDate}" --output table
```

| 판단 기준 | PASS |
|---|---|
| curl | 사용자가 `"display_name":"Structure"`가 보였다고 확인 |
| SSM | 파라미터 1개, Type `SecureString` |

---

## CP4. 💰 배포 (에이전트, 사용자 확인 후)

사용자에게: "S3·DynamoDB·Lambda·Fargate·Step Functions 등이 us-east-1에 생깁니다. 유휴 시 월 $1~2.
되돌리기: CloudFormation 스택 삭제(데이터 버킷은 남음). 약 5분. 진행할까요?"

```bash
bash ~/cryo-em/byeori/deploy_byeori.sh 2>&1 | tail -30
cd ~/byeori && source .byeori.env
aws cloudformation describe-stacks --stack-name "$KIRO_WIKI_STACK" --query "Stacks[0].StackStatus" --output text
grep -E "AWS_KIRO_WIKI_BUCKET|AWS_KIRO_WIKI_TABLE|AWS_KIRO_WIKI_INGEST_FUNCTION" .byeori.env
```

| 판단 기준 | PASS |
|---|---|
| 스택 상태 | `CREATE_COMPLETE` 또는 `UPDATE_COMPLETE` |
| `.byeori.env` | 버킷·테이블·함수 이름이 채워짐 |

| 대응 | |
|---|---|
| 실패 | 첫 실패 원인 확인: `aws cloudformation describe-stack-events --stack-name "$KIRO_WIKI_STACK" --query "StackEvents[?contains(ResourceStatus,'FAILED')].[LogicalResourceId,ResourceStatusReason]" --output text \| tail -5` |
| `ROLLBACK_COMPLETE` (첫 생성 실패) | 원인 해결 후 `aws cloudformation delete-stack --stack-name "$KIRO_WIKI_STACK" && aws cloudformation wait stack-delete-complete --stack-name "$KIRO_WIKI_STACK"` → 다시 배포 (삭제는 사용자 확인 후) |
| 권한 오류 (`not authorized`, `AccessDenied`) | 프로필 권한 부족. 멈추고 사용자에게 관리자 권한 요청 |
| OpenAlex 파라미터 관련 | CP3 재확인 |

---

## CP5. `byeori doctor` (에이전트)

```bash
cd ~/byeori && source .byeori.env && uv run byeori doctor
```

| 필드 | PASS | FAIL 시 |
|---|---|---|
| `python`, `uv` | 버전 / `true` | — |
| `aws.credentials` | `true` | CP0 자격 증명 |
| `aws.bucket_configured`, `table_configured`, `ingest_function_configured` | `true` | `.byeori.env` 재확인, CP4 |
| `openalex_live` | `true` | `openalex_error` 확인 → CP3 |
| `bedrock` | 모델마다 `"ok"` | `AccessDeniedException` → CP1의 모델 권한(us-east-1인지) |
| `openalex_api_key`, `kiro_cli` | `false`여도 됨 | — |

---

## CP6. 💰 첫 논문 (에이전트 + 사용자)

사용자에게 PDF 경로를 받는다. 조건: Structure·eLife·JSB 등의 **일반 연구 논문**, 제목·DOI가 분명한 것
(코멘터리·레터 제외). 비용 약 $0.15임을 알리고 확인받는다.

stem 규칙: 소문자·숫자·하이픈, `<제1저자>-<연도>-<제목 단어 2~3개>` (예: `nakane-2020-atomic-resolution`).

```bash
cd ~/byeori && source .byeori.env
STEM=<stem>
uv run byeori upload-pdf "<PDF 경로>" --stem "$STEM"
uv run byeori aws-extract --stems "$STEM" --tasks 1
uv run byeori aws-extract-status        # 2~3분 간격으로 최대 15분 반복
```

| 추출 상태 | 판단 |
|---|---|
| `fulltext_ready` | PASS → 노트 작성으로 |
| `pdf_uploaded` / 진행 중 | 대기 후 재확인 |
| asset 작업 `CannotPullContainerError` | **정상**(그림 추출 이미지 없음). 무시 |
| `fulltext_ready_unclassified` | 식별 대기 또는 실패. 5분 더 기다려 재확인. 계속이면 논문 선택 문제 → 다른 논문으로 (이 베타엔 개별 수정 방법 없음) |
| `extract_failed` | `aws-extract` 한 번 재실행. 또 실패하면 멈추고 보고 |

노트 작성과 확인:
```bash
uv run byeori aws-source-note "$STEM"          # "status": "source_ready" 기대
uv run byeori validate
uv run byeori build-index
uv run byeori wiki-read note "$STEM" | head -80
uv run byeori wiki-search "<논문의 핵심 구절>"
```

| 판단 기준 | PASS |
|---|---|
| 노트 | `source_ready` |
| validate | `AWS validation passed for the published S3 wiki` |
| 검색 | 결과에 `$STEM` 포함 |

에이전트는 노트 내용을 원문 PDF와 대조해 **수치 3개**(해상도, 입자 수, 대칭 등)를 골라 일치하는지 확인하고 로그에 적는다.

---

## CP7. 마무리 (에이전트)

```bash
cd ~/byeori && source .byeori.env
uv run byeori cost-ledger 2>/dev/null | tail -20
git -C ~/byeori status --short
```
`SETUP-LOG.md` 끝에 요약을 쓴다:
- 설치 결과(스택, 리전, 모델 설정)
- 첫 논문 결과와 수치 대조 결과
- 남은 선택지: Docker 설치 후 `build-workers`(그림 추출), 여러 논문 일괄 처리(`aws-pipeline-stems`), 학생 서비스(선택)
- 비용 확인 방법: 하루 뒤 콘솔 Billing → Cost Explorer, 서비스별 그룹

사용자에게 로그 요약을 보여 주고, 클라우드 세션에 붙여 넣어 검토받을 수 있다고 안내한다.

---

## 되돌리기 (필요할 때만, 사용자 확인 후)

```bash
cd ~/byeori && source .byeori.env
aws cloudformation delete-stack --stack-name "$KIRO_WIKI_STACK"
aws cloudformation wait stack-delete-complete --stack-name "$KIRO_WIKI_STACK"
```
데이터 버킷(논문·위키)은 삭제되지 않고 남는다. 완전히 지우려면 `~/byeori/docs/INSTALL.md` 10단계.

---

## 설치 후: 논문 여러 편 넣기

폴더 하나의 PDF를 한 번에 넣는다 (새 터미널에서, 사용자가 직접):
```bash
bash ~/cryo-em/byeori/ingest_batch.sh <PDF 폴더>
```
- 계획(추가·건너뜀 목록, 예상 비용)을 보여 주고 한 번만 묻는다. `--yes`면 묻지 않는다.
- 이미 Byeori에 있는 PDF(같은 SHA-256)는 파일 이름이 달라도 건너뛴다. 같은 폴더에 다시 돌려도 중복되지 않는다.
- stem은 파일 이름을 소문자·하이픈으로 바꾼 것(`s41467-026-71934-7`). 노트 제목은 논문에서 온다.
- 업로드 → 추출(최대 40분 대기) → 노트(배포된 모델, Sonnet 5) → 색인 재생성 → validate → 논문별 상태 표.
- 논문당 약 $0.10 (노트 $0.07 + 추출 $0.02 안팎).
