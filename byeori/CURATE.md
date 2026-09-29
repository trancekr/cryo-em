# 노트 큐레이션: 분야 분류와 개념 정리 (맥미니 Claude Code용)

Byeori의 자동 분류(`aws-classify-notes`)는 **제목만** 보고, 개념 후보는 노트의 **Glossary 용어를 글자 그대로**
센다. 그래서 같은 개념이 여러 이름으로 갈리고(cryo-electron microscopy / electron cryo-microscopy …),
분야는 제목만으로 정해진다. 이 작업은 맥미니의 Claude Code(Max, API 비용 없음)가 노트 본문을 읽고
두 파일을 만든다. 사람이 확인한 뒤 `apply_curation.sh`로 반영한다.

시작:
```bash
cd ~/cryo-em && git pull
bash ~/cryo-em/byeori/curate_prepare.sh     # 사용자가 터미널에서: 노트·요약본·개념 후보를 받는다 (AWS 읽기만)
claude                                       # 그 다음 Claude Code에서
```
**"byeori/CURATE.md 대로 큐레이션 해줘"**.

---

## 에이전트에게

- AWS에 쓰는 명령은 실행하지 않는다. 이 작업의 결과물은 아래 두 파일뿐이다. 반영은 사용자가 한다.
- 노트는 `byeori/curation/notes/`에 받은 사본만 읽는다(`.gitignore`에 있음).
- **노트 전문을 다 읽지 않는다.** `curation/digest.md`(논문당 제목·요약·주요 기여 몇 줄)로 분류하고, 그것으로
  판단이 안 서는 논문만 `curation/notes/<stem>.md`를 연다. 87편 전문은 한 세션에 다 들어가지 않는다.
- **명령 출력을 화면에 쏟지 않는다.** 긴 내용은 파일로 읽고, 사용자에게는 진행 상황만 한 줄씩 알린다.
- **20편마다 `fields.tsv`에 저장한다.** 중단돼도 이어서 할 수 있게, 빈 field 칸이 남은 줄부터 이어 간다.
- 판단이 애매한 논문은 추측하지 말고 `fields.tsv`의 keywords 칸 끝에 `?확인필요: 이유`를 적는다.

### 1. 재료 확인

사용자가 `curate_prepare.sh`를 돌렸으면 `byeori/curation/`에 `digest.md`, `candidates.tsv`, `terms.tsv`,
`fields.tsv`(stem만 채운 틀)가 있다. 없으면 사용자에게 그 스크립트를 먼저 돌려 달라고 한다.

### 2. 분야 분류 → `byeori/curation/fields.tsv`

`digest.md`를 읽고 `fields.tsv`의 빈 칸(field, protein_class, keywords)을 채운다. 탭 구분.

```
#stem	field	protein_class	keywords
kucukelbir-2013-resmap	cryoem-processing		local resolution; ResMap; likelihood-ratio test; map interpretation
park-2026-small-protein-ligand	cryoem-structures	small soluble protein-ligand complex	sub-50 kDa; ligand density; scaffold-free
```

| field | 넣는 논문 |
|---|---|
| `cryoem-processing` | 영상 처리부터 원자 모델까지의 **방법·소프트웨어·검증**: motion/CTF, picking, 2D/3D classification, reconstruction, heterogeneity(cryoDRGN 등), 해상도 추정, 맵 샤프닝·후처리, model building(수동·자동·AI), refinement, validation, 구조 예측(AlphaFold)과 맵 적합, 데이터베이스·표준(EMDB, wwPDB), 리뷰 |
| `cryoem-structures` | 특정 단백질·복합체의 **새 실험 구조**를 보고하는 논문. 방법 개발이 주목적이고 구조는 예시일 뿐이면 `cryoem-processing` |

- `protein_class`: `cryoem-structures`일 때만 적는다. 나중에 단백질 종류별 분야를 열 때 쓴다
  (예: membrane transporter, GPCR, ribosome/RNA, CRISPR nuclease, kinase, viral protein, small soluble protein).
- `keywords`: 3~8개, `;` 구분. 이 연구실이 나중에 찾을 때 쓸 말로(도구 이름, 방법, 지표, 단백질 종류). 노트에 없는 말은 쓰지 않는다.

### 3. 개념 정리 → `byeori/curation/overrides.json`

`candidates.tsv`(Byeori의 개념 후보, 정확한 slug)와 `terms.tsv`(전체 Glossary 용어, 참고용)를 읽는다.

- **slug는 `candidates.tsv`의 slug를 그대로 쓴다.** Byeori는 용어를 자체 규칙(끝의 복수 s 제거 등)으로
  slug로 바꾸므로, `terms.tsv`의 slug는 대략적인 참고용이다. `candidates.tsv`에 없는 용어를 merge할 때는
  `terms.tsv`의 slug에서 끝의 복수 `s`를 뺀 형태도 함께 적는다.
- `candidates.tsv`의 aliases 칸을 보면 이미 합쳐진 것과 아닌 것을 알 수 있다.

세 가지를 정한다.

- `merge`: 같은 개념의 다른 이름 → 대표 slug. 예: `electron-cryo-microscopy` → `cryo-electron-microscopy`,
  `emdb` → `electron-microscopy-data-bank`, 약어와 풀네임, 단수·복수, 하이픈 차이.
  - 버전·후속작은 합치지 않는다(`refmac5`와 `refmac`는 합쳐도 되지만 `phenix-real-space-refine`와 `phenix`는 다르다).
- `exclude`: 개념 페이지로 만들 가치가 없는 것.
  - 분야 이름 자체: `cryo-electron-microscopy`(합친 대표 slug)
  - 모든 논문이 쓰는 일반어: `resolution`, `atomic-model`, `density-map`, `protein` 류
  - 통계 일반어: `rmsd`, `correlation-coefficient` 류(단, cryo-EM 고유 지표인 `fourier-shell-correlation`, `q-score`는 남긴다)
- `title`: 대표 slug의 보기 좋은 제목. 예: `"fourier-shell-correlation": "Fourier shell correlation (FSC)"`.

```json
{"exclude": ["cryo-electron-microscopy"],
 "merge": {"electron-cryo-microscopy": "cryo-electron-microscopy", "emdb": "electron-microscopy-data-bank"},
 "title": {"electron-microscopy-data-bank": "Electron Microscopy Data Bank (EMDB)"}}
```

### 4. 사용자에게 보고

- 분야별 편수, `?확인필요` 목록
- merge 쌍 목록, exclude 목록(각 한 줄 이유)
- 그 다음 사용자가 할 일:

```bash
bash ~/cryo-em/byeori/apply_curation.sh          # 미리보기
bash ~/cryo-em/byeori/apply_curation.sh --apply  # 반영 + 합성 계획 다시 세우기
```

---

## 새 논문을 넣은 뒤

`ingest_batch.sh`로 들어온 새 논문은 분야가 비어 있다(`other`). 몇십 편 쌓이면 이 작업을 다시 하되,
`curate_prepare.sh`를 다시 돌리면 새 stem만 `fields.tsv` 끝에 빈 줄로 붙는다. 단백질 종류별 분야는 `cryoem-structures`의 한 `protein_class`가
15~20편이 되면 연다: `apply_curation.sh`의 `field_scope`에 한 줄 추가하고, 해당 논문의 field 칸을 바꾼다.

## 개념·개요 페이지 만들기

```bash
uv run byeori aws-synthesis-run --scope all --category cryoem-processing
uv run byeori aws-synthesis-status          # 진행 상황
```

- **`--category`에는 15편 이상인 분야만 넣는다.** 소주제를 3개(각 5편 이상) 못 만드는 분야가 끼면 실행 전체가
  `CategoryPlanningIncomplete`로 멈춘다(2026-09-29, `cryoem-structures` 2편). 개념 페이지는 이 옵션과 상관없이
  모든 노트로 센다.
- 비용: Opus 5 기준 페이지당 약 $0.6 (Q-score 개념 페이지 실측: 입력 86k, 출력 6.7k 토큰).

