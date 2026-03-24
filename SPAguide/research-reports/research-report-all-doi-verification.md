# Research Report: 전체 DOI 검증 (슬라이드 3-23)

> 생성일: 2026-03-24 | 검증 도구: PubMed MCP, WebFetch, WebSearch

---

## 요약

| 항목 | 수치 |
|------|------|
| 총 DOI | 33개 |
| ✅ 존재 + 메타데이터 매치 | 27개 |
| 🔴 DOI 잘못됨 (다른 논문) | 4개 |
| 🟡 DOI 존재하나 매치 미확인 | 1개 |
| ❌ 논문 자체가 존재하지 않음 | 1개 (Turk & Bhatt) |

---

## 🔴 필수 수정 (4건 — DOI가 잘못된 논문을 가리킴)

### 1. 슬라이드 8: Penczek, Grassucci & Frank, Ultramicroscopy (1994)
- **현재 DOI**: `10.1016/0304-3991(94)90003-5`
- **실제 논문**: "Three-dimensional reconstruction from random projections: orientational alignment via Radon transforms" (다른 저자)
- **올바른 DOI**: `10.1016/0304-3991(94)90038-8`
- **올바른 논문**: "The ribosome at improved resolution: new techniques for merging and orientation refinement in 3D cryo-EM" — Penczek PA, Grassucci RA, Frank J

### 2. 슬라이드 9: Yu, Jin & Zhou, Nature (2008)
- **현재 DOI**: `10.1038/nature06923`
- **실제 논문**: Fuller et al. "Midzone activation of aurora B in anaphase" (세포분열 — cryo-EM 무관)
- **올바른 DOI**: `10.1038/nature06893`
- **올바른 논문**: "3.88 Å structure of cytoplasmic polyhedrosis virus by cryo-electron microscopy" — Yu X, Jin L, Zhou ZH

### 3. 슬라이드 12: Bai, McMullan & Scheres, TiBS (2015)
- **현재 DOI**: `10.1016/j.tibs.2015.08.005`
- **실제 논문**: Cotter et al. "Recent Insights into V-ATPases" (V-ATPase 리뷰 — cryo-EM 무관)
- **올바른 DOI**: `10.1016/j.tibs.2014.10.005`
- **올바른 논문**: "How cryo-EM is revolutionizing structural biology" — Bai XC, McMullan G, Scheres SHW

### 4. 슬라이드 16: Current Opinion in Structural Biology 64 (2020)
- **현재 DOI**: `10.1016/j.sbi.2020.06.007`
- **실제 논문**: "Molecular dynamics simulations of DNA-DNA and DNA-protein interactions" (MD 시뮬레이션 — cryo-EM 무관)
- **해결 필요**: 슬라이드 16 내용에 맞는 실제 논문 DOI 찾기 필요

---

## ❌ 가짜 레퍼런스 (1건)

### 슬라이드 18: Turk & Bhatt, Nat Rev Mol Cell Biol (2024)
- **상태**: DOI 없음, 논문 존재하지 않음
- **해결**: 대체 논문 검색 필요 (/research topic으로)

---

## ✅ 검증 통과 상세

### 슬라이드 3 (3/3 통과)
| display | DOI | 실제 저자 | 실제 저널 | 실제 연도 |
|---------|-----|----------|----------|----------|
| Dubochet et al., Q Rev Biophys (1988) | 10.1017/s0033583500004297 | ✅ Dubochet J 외 6명 | ✅ Q Rev Biophys | ✅ 1988 |
| Glaeser, J Ultrastruct Res (1971) | 10.1016/S0022-5320(71)80118-1 | ✅ Glaeser RM | ✅ J Ultrastruct Res | ✅ 1971 |
| Taylor & Glaeser, Science (1974) | 10.1126/science.186.4168.1036 | ✅ Taylor KA, Glaeser RM | ✅ Science | ✅ 1974 |

### 슬라이드 4 (1/1 통과)
| display | DOI | 실제 저자 | 실제 저널 | 실제 연도 |
|---------|-----|----------|----------|----------|
| Passmore & Russo, Methods Enzymol (2016) | 10.1016/bs.mie.2016.04.011 | ✅ Passmore LA, Russo CJ | ✅ Methods Enzymol | ✅ 2016 |

### 슬라이드 5 (2/2 통과)
| display | DOI | 실제 저자 | 실제 저널 | 실제 연도 |
|---------|-----|----------|----------|----------|
| McMullan et al., Ultramicroscopy (2009) | 10.1016/j.ultramic.2009.04.002 | ✅ McMullan G 외 3명 | ✅ Ultramicroscopy | ✅ 2009 |
| Faruqi & McMullan, Q Rev Biophys (2011) | 10.1017/S0033583511000035 | ✅ Faruqi AR, McMullan G | ✅ Q Rev Biophys | ✅ 2011 |

### 슬라이드 6 (3/3 통과)
| display | DOI | 실제 저자 | 실제 저널 | 실제 연도 |
|---------|-----|----------|----------|----------|
| Kühlbrandt, Science (2014) | 10.1126/science.1251652 | ✅ Kühlbrandt W | ✅ Science | ✅ 2014 |
| Li et al., Nat Methods (2013) | 10.1038/nmeth.2472 | ✅ Li X 외 7명 | ✅ Nat Methods | ✅ 2013 |
| Bai et al., TiBS (2015) | 10.1016/j.tibs.2014.10.005 | ✅ Bai XC, McMullan G, Scheres SHW | ✅ TiBS | ✅ 2015 (pub 2014-11) |

### 슬라이드 7 (3/3 통과)
| display | DOI | 존재 | 비고 |
|---------|-----|------|------|
| DeRosier & Klug, Nature (1968) | 10.1038/217130a0 | ✅ | PubMed에 없으나 DOI 존재 |
| Taylor & Glaeser, Science (1974) | 10.1126/science.186.4168.1036 | ✅ | 슬라이드 3과 동일 |
| Dubochet & McDowall, J Microsc (1982) | 10.1111/j.1365-2818.1981.tb02483.x | ✅ | PubMed에 없으나 DOI 존재 |

### 슬라이드 8 (2/3 — Penczek DOI 수정 필요)
| display | DOI | 존재 | 비고 |
|---------|-----|------|------|
| van Heel, Ultramicroscopy (1987) | 10.1016/0304-3991(87)90078-7 | ✅ | van Heel M, angular reconstitution |
| Henderson et al., J Mol Biol (1990) | 10.1016/S0022-2836(05)80271-2 | ✅ | PubMed에 없으나 DOI 존재 |
| 🔴 Penczek et al. (1994) | 10.1016/0304-3991(94)90003-5 | ❌ 다른 논문 | → 10.1016/0304-3991(94)90038-8 |

### 슬라이드 9 (3/4 — Yu DOI 수정 필요)
| display | DOI | 존재 | 비고 |
|---------|-----|------|------|
| Böttcher et al., Nature (1997) | 10.1038/386088a0 | ✅ | HBV capsid 7.4 Å |
| Conway et al., Nature (1997) | 10.1038/386091a0 | ✅ | HBV 4-helix bundle 9 Å |
| Sigworth, J Struct Biol (1998) | 10.1006/jsbi.1998.4014 | ✅ | ML approach single-particle |
| 🔴 Yu, Jin & Zhou, Nature (2008) | 10.1038/nature06923 | ❌ 다른 논문 | → 10.1038/nature06893 |

### 슬라이드 10 (3/3 통과)
| display | DOI | 실제 저자 | 비고 |
|---------|-----|----------|------|
| Li et al., Nat Methods (2013) | 10.1038/nmeth.2472 | ✅ Li X 외 7명 | electron counting + motion correction |
| Bai et al., eLife (2013) | 10.7554/eLife.00461 | ✅ Bai XC 외 3명 | ribosome near-atomic, ~30,000 particles |
| Liao et al., Nature (2013) | 10.1038/nature12822 | ✅ Liao M 외 3명 | TRPV1 3.4 Å |

### 슬라이드 11 (3/3 통과)
| display | DOI | 실제 저자 | 비고 |
|---------|-----|----------|------|
| Bai et al., Nature (2015) | 10.1038/nature14892 | ✅ Bai XC 외 8명 | γ-secretase 3.4 Å |
| Campbell et al., eLife (2015) | 10.7554/eLife.06380 | ✅ Campbell MG 외 4명 | T20S proteasome 2.8 Å |
| Bartesaghi et al., Science (2015) | 10.1126/science.aab1576 | ✅ Bartesaghi A 외 6명 | β-galactosidase 2.2 Å |

### 슬라이드 12 (2/3 — Bai TiBS DOI 수정 필요)
| display | DOI | 비고 |
|---------|-----|------|
| Kühlbrandt, Science (2014) | 10.1126/science.1251652 | ✅ |
| 🔴 Bai, McMullan & Scheres, TiBS (2015) | 10.1016/j.tibs.2015.08.005 | ❌ V-ATPase 리뷰 → 10.1016/j.tibs.2014.10.005 |
| Callaway, Nature (2015) | 10.1038/525172a | ✅ DOI 존재 (News article) |

### 슬라이드 18 (1/3)
| display | DOI | 비고 |
|---------|-----|------|
| Chakraborty et al., Protein Science (2020) | 10.1002/pro.3858 | ✅ cryo-ET cytoskeleton review |
| Kühlbrandt, Science (2014) | 10.1126/science.1251652 | ✅ (중복 사용) |
| ❌ Turk & Bhatt (2024) | 없음 | 가짜 |

### 슬라이드 19 (1/1 통과)
| display | DOI | 비고 |
|---------|-----|------|
| Gangwar et al., STAR Protoc (2021) | 10.1016/j.xpro.2021.100855 | ✅ GLR3.4 purification + cryo-EM |

### 슬라이드 20 (2/2 통과)
| display | DOI | 비고 |
|---------|-----|------|
| Cheng et al., Cell (2015) | 10.1016/j.cell.2015.03.050 | ✅ "A primer to single-particle cryo-EM" |
| Passmore & Russo (2016) | 10.1016/bs.mie.2016.04.011 | ✅ (중복 사용) |

### 슬라이드 21 (3/3 — DOI 존재 확인, 메타데이터 WebSearch로 확인)
| display | DOI | 비고 |
|---------|-----|------|
| Halfon et al., Faraday Discuss (2022) | 10.1039/d2fd00129b | ✅ DOI 존재 |
| Weissenberger et al., Nat Methods (2021) | 10.1038/s41592-021-01130-6 | ✅ sample preparation review |
| Drulyte et al., Acta Cryst D (2018) | 10.1107/s2059798318006496 | ✅ particle distributions |

### 슬라이드 22 (3/3 통과)
| display | DOI | 비고 |
|---------|-----|------|
| Glaeser, Nat Methods (2016) | 10.1038/nmeth.3695 | ✅ "How good can cryo-EM become?" |
| Drulyte et al. (2018) | 10.1107/s2059798318006496 | ✅ (중복) |
| Henderson, PNAS (2013) | 10.1073/pnas.1314449110 | ✅ "Einstein from noise" |

### 슬라이드 23 (2/2 통과)
| display | DOI | 비고 |
|---------|-----|------|
| Glaeser (2016) | 10.1038/nmeth.3695 | ✅ (중복) |
| Drulyte et al. (2018) | 10.1107/s2059798318006496 | ✅ (중복) |

---

## 다음 단계
1. 🔴 4개 DOI 수정 → presentation-spec.md 업데이트
2. ❌ 슬라이드 18 Turk & Bhatt 대체 논문 검색
3. 🔴 슬라이드 16 올바른 DOI 찾기
4. 내용 매치(content-match) 검증 → overview.html 읽고 각 슬라이드 텍스트와 대조
