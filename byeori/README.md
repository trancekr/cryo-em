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
- **Scientific Reports, iScience**: 금지 목록.
- 후보로 고려할 만한 것: Cell Reports, PLoS Biology, Bioinformatics, Journal of Chemical Information and Modeling.

## 주의: OpenAlex source ID 한도

Byeori의 주제 검색은 목록의 모든 OpenAlex source ID를 하나의 필터로 보내는데, OpenAlex는
필터당 100개까지만 받는다. 현재 73개 + 이 초안 21~22개 ≈ **94~95개**로 여유가 거의 없다.
기본 목록의 머신러닝 학회 항목(ICLR, NeurIPS, ICML, PMLR, AISTATS, COLT, J Data Science; 8개 ID)
이 필요 없으면 지워서 자리를 확보할 수 있다.

## 사용법 (맥미니에서)

초안의 `source_ids`는 비어 있다. 작성 환경에서 OpenAlex에 접속할 수 없었기 때문이며, ISSN도
OpenAlex로 한 번 확인하는 것이 좋다.

```bash
cd cryo-em/byeori
export OPENALEX_API_KEY=...          # 있으면 사용 (없어도 동작)
python3 fill_openalex_ids.py          # ID 조회 → *.filled.json 생성, 결과 보고
# 보고서에서 "??" 줄(찾지 못한 저널)과 dropped 줄을 확인한 뒤:
python3 fill_openalex_ids.py --no-lookup --merge ~/byeori/src/byeori/policies/journals.json
```

`--merge`는 이미 있는 키·금지 저널은 건너뛰고, ID가 100개를 넘으면 거부하며, 원본을
`journals.json.bak`으로 남긴다. 병합 후 Byeori 저장소에서 `uv run pytest tests/test_journal_policy*.py`
로 확인하고, Lambda에 반영하려면 `uv run byeori deploy`를 다시 실행한다.
(맥미니의 CLI만 시험하려면 `BYEORI_JOURNAL_POLICY=<병합한 파일>`로 원본을 건드리지 않고 확인할 수 있다. AWS 쪽 함수는 배포된 `journals.json`을 쓰므로 재배포가 필요하다.)
