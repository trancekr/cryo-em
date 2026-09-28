# Byeori 구조생물학 저널 목록 (초안)

[joonan-lab/byeori](https://github.com/joonan-lab/byeori) 의 저널 정책
(`src/byeori/policies/journals.json`)에 cryo-EM·구조생물학 저널을 추가하기 위한 초안.
Byeori 기본 목록 65종은 유전체·암·신경과학 중심이라 Structure, Molecular Cell, eLife, IUCrJ,
JSB 등이 빠져 있다.

## 이 목록이 하는 일

| 경로 | 목록에 없으면 |
|---|---|
| **직접 업로드한 PDF** (`upload-pdf`) | 그대로 들어간다. MDPI·Frontiers 등 금지 출판사만 거부. 다만 OpenAlex 신원 확인이 끝날 때까지 `fulltext_ready_unclassified`로 대기 |
| **OpenAlex 탐색·수집** (`search`, `candidate-add`) | 수집 대상 아님. 주제 검색 결과에 "목록 밖" 경고가 붙음 |

즉 목록은 "읽을 수 있는가"보다 **"자동으로 찾아오고 바로 처리할 것인가"** 를 정한다.

## 포함 저널 (21종)

| 분류 (`family`) | 저널 |
|---|---|
| Structural biology | Structure, Molecular Cell, eLife, PNAS, Science Advances, EMBO J, J Mol Biol, Nucleic Acids Res, J Biol Chem, JACS |
| Structural methods | J Struct Biol, IUCrJ, Acta Cryst D (구 *Biological Crystallography* ISSN 포함), Acta Cryst F, Ultramicroscopy, Microscopy and Microanalysis, Protein Science, Biophys J |
| Structural reviews | Curr Opin Struct Biol, Annu Rev Biophys, Q Rev Biophys |

이미 기본 목록에 있는 것: Nature, Science, Cell, NSMB, Nature Methods, Nature Communications,
Nature Chemical Biology, bioRxiv.

넣지 않은 것:
- **Communications Biology**: Byeori 정책이 `nature_portfolio_below_threshold`로 일부러 제외. 넣으려면 그 목록에서도 빼야 한다.
- **Scientific Reports**: Byeori 원래 정책은 금지(`denied_journals`)였으나 2026-09-28 해제(`ALLOW_DENIED`). 직접 올린 논문은 읽히고, 주제 검색에는 "목록 밖" 경고와 함께 나온다. OpenAlex 자동 수집 대상은 아니다.
- **iScience, Heliyon, Oncotarget**: 금지 목록 그대로.
- 후보로 고려할 만한 것: Cell Reports, PLoS Biology, Bioinformatics, Journal of Chemical Information and Modeling.

## 기존 추가 항목 제거

Byeori가 기본으로 넣어 둔 `lab_additions` 7개(ICLR, NeurIPS, ICML, PMLR, AISTATS, COLT,
Journal of Data Science; OpenAlex ID 8개)는 구조생물학과 무관하므로 `--merge` 때 함께 지운다
(`fill_openalex_ids.py`의 `DROP_FAMILIES`, `DROP_KEYS`).

## OpenAlex source ID 한도

Byeori의 주제 검색은 목록의 모든 OpenAlex source ID를 하나의 필터로 보내는데, OpenAlex는
필터당 100개까지만 받는다. 기존 73개 − 제거 8개 + 이 초안 22개 = **87개** (2026-09-28 맥미니에서 확인).

## 맥미니에 적용하기 (한 번에)

맥미니 터미널에서:

```bash
git clone -b claude/byeori-mac-mini-compatibility-0dl60f https://github.com/trancekr/cryo-em ~/cryo-em
bash ~/cryo-em/byeori/setup_macmini.sh
```

`setup_macmini.sh`가 하는 일: macOS·칩 확인 → Homebrew로 git·uv·awscli 설치(없을 때만) →
Byeori(v0.1.0-beta.1)를 `~/byeori`에 clone → `uv sync` → OpenAlex ID 조회 결과 출력 →
**확인 후** `journals.json` 병합, `~/byeori`의 `cryoem-journals` 브랜치에 커밋 → 판정 확인.
AWS에는 아무것도 만들지 않는다. 다시 실행해도 끝난 단계는 건너뛴다.
옵션: `--yes`(묻지 않고 병합), `--with-docker`(colima·docker 설치), `BYEORI_DIR=...`(clone 위치).
Homebrew가 없으면 먼저 https://brew.sh 에서 설치한다.

## 수동으로 하기

초안의 `source_ids`는 2026-09-28 맥미니에서 OpenAlex로 조회한 값이다(21종 모두 확인됨).
`fill_openalex_ids.py`를 다시 실행하면 최신 값으로 다시 조회한다.

```bash
cd cryo-em/byeori
export OPENALEX_API_KEY=...          # 있으면 사용 (없어도 동작)
python3 fill_openalex_ids.py          # ID 조회 → *.filled.json 생성, 결과 보고
# 보고서에서 "??" 줄(찾지 못한 저널)과 dropped 줄을 확인한 뒤:
python3 fill_openalex_ids.py --no-lookup --merge ~/byeori/src/byeori/policies/journals.json
```

`--merge`는 이미 있는 키·금지 저널은 건너뛰고, ID가 100개를 넘으면 거부하며, 원본을
`journals.json.bak`으로 남긴다. Lambda에 반영하려면 `uv run byeori deploy`를 다시 실행한다 (배포는 작업 트리를 그대로
패키징하므로 로컬 수정이 올라간다).

병합 후 Byeori 자체 테스트 중 `tests/test_journal_policy.py`, `tests/test_journal_policy_file.py`의
18개가 실패한다. 개발 연구실의 목록을 그대로 적어 둔 테스트(머신러닝 학회·Journal of Data Science가 있어야 함, eLife·PNAS·
NAR은 목록 밖이어야 함 등)라서 목록을 바꾸면 실패하는 것이 정상이며, 배포는 테스트를 실행하지 않는다.
대신 다음으로 확인한다:

```bash
uv run python -c "from byeori import journal_policy as j; print(len(j.SOURCE_IDS), j.journal_verdict('Structure', ['0969-2126']))"
```
(맥미니의 CLI만 시험하려면 `BYEORI_JOURNAL_POLICY=<병합한 파일>`로 원본을 건드리지 않고 확인할 수 있다. AWS 쪽 함수는 배포된 `journals.json`을 쓰므로 재배포가 필요하다.)
