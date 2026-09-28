# 노트 큐레이션: 분야 분류와 개념 정리 (맥미니 Claude Code용)

Byeori의 자동 분류(`aws-classify-notes`)는 **제목만** 보고, 개념 후보는 노트의 **Glossary 용어를 글자 그대로**
센다. 그래서 같은 개념이 여러 이름으로 갈리고(cryo-electron microscopy / electron cryo-microscopy …),
분야는 제목만으로 정해진다. 이 작업은 맥미니의 Claude Code(Max, API 비용 없음)가 노트 본문을 읽고
두 파일을 만든다. 사람이 확인한 뒤 `apply_curation.sh`로 반영한다.

시작: `cd ~/cryo-em && git pull && claude` 후 **"byeori/CURATE.md 대로 큐레이션 해줘"**.

---

## 에이전트에게

- AWS에 쓰는 명령은 실행하지 않는다. 이 작업의 결과물은 아래 두 파일뿐이다. 반영은 사용자가 한다.
- 노트는 `byeori/curation/notes/`에 받은 사본만 읽는다(`.gitignore`에 있음).
- 판단이 애매한 논문은 추측하지 말고 `fields.tsv`의 keywords 칸 끝에 `?확인필요: 이유`를 적는다.

### 1. 노트 받기 (읽기 전용)

```bash
cd ~/byeori && source .byeori.env
aws s3 sync "s3://$AWS_KIRO_WIKI_BUCKET/wiki/sources/" ~/cryo-em/byeori/curation/notes/ \
  --exclude "*" --include "*.md" --exclude "failed/*" --only-show-errors
ls ~/cryo-em/byeori/curation/notes/ | wc -l
```

### 2. 분야 분류 → `byeori/curation/fields.tsv`

각 노트의 `## One-line Summary`, `## 2. Key Contributions`, `## 3. Methodology and Architecture` 앞부분을 읽고
한 줄씩 쓴다. 탭 구분, 첫 줄은 `#`로 시작하는 머리글.

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

Byeori가 뽑은 개념 후보(정확한 slug)와, 참고용 전체 Glossary 용어표를 받는다.

```bash
cd ~/byeori && source .byeori.env
aws s3 cp "s3://$AWS_KIRO_WIKI_BUCKET/runs/synthesis/concepts/candidates.json" ~/cryo-em/byeori/curation/candidates.json --only-show-errors
python3 ~/cryo-em/byeori/glossary_terms.py ~/cryo-em/byeori/curation/notes --min 3 > ~/cryo-em/byeori/curation/terms.tsv
```

- **slug는 `candidates.json`의 `concepts[].slug`를 그대로 쓴다.** Byeori는 용어를 자체 규칙(끝의 복수 s 제거 등)으로
  slug로 바꾸므로, `terms.tsv`의 slug는 대략적인 참고용이다. `candidates.json`에 없는 용어를 merge할 때는
  `terms.tsv`의 slug에서 끝의 복수 `s`를 뺀 형태도 함께 적는다.
- `candidates.json`의 `aliases`, `members`(논문 목록)를 보면 이미 합쳐진 것과 아닌 것을 알 수 있다.

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
`fields.tsv`에 없는 stem만 추가하면 된다. 단백질 종류별 분야는 `cryoem-structures`의 한 `protein_class`가
15~20편이 되면 연다: `apply_curation.sh`의 `field_scope`에 한 줄 추가하고, 해당 논문의 field 칸을 바꾼다.
