# References Index

fact-checker가 참조할 때 이 인덱스를 먼저 읽고 관련 파일 선별 후, **`parsed/*.md`를 Grep으로 직접 검색** (가장 빠르고 토큰 저렴).
매치된 마크다운을 Read로 확인. 페이지/bbox 필요 시 동명 `.json` 참조. 마크다운 품질 부족 시에만 원본 PDF를 `Read(pages: "N-N+5")`로 fallback.

> 41개 PDF는 모두 `parsed/`에 MD+JSON+이미지 형태로 변환됨 (2026-04-15, OpenDataLoader PDF).

## Sample Preparation — 논문/리뷰 (Section 2 핵심)

### 종합 리뷰
| 파일 | 저자 | 저널/연도 | DOI | 내용 |
|------|------|-----------|-----|------|
| `1-s2.0-S0959440X25001502-main.pdf` | Tcherner Elad et al. | Curr Opin Struct Biol, 2025 | 10.1016/j.sbi.2025.103132 | 최신 종합 — support fabrication, micropatterning, cryo-FIB, 자동화 |
| `Hirst_2024_CryoEM_grid_preparation.pdf` | Hirst, Muench et al. | Biochem Soc Trans, 2024 | 10.1042/BST20231553 | Grid type, AWI, blotting-free, nanomagnetic beads |
| `advancing-cryo-em-and-cryo-et-through-...pdf` | Premaraj et al. | Anal Chem, 2025 | 10.1021/acs.analchem.5c01534 | Sample carrier 혁신 — gold, graphene, Ti autogrids |
| `s41592-021-01130-6.pdf` | Weissenberger et al. | Nat Methods, 2021 | 10.1038/s41592-021-01130-6 | 4단계 종합 리뷰 (Circle 다이어그램 출처) |
| `Wang_2024_CryoEM_sample_preparation.pdf` | Wang & Zimanyi | Acta Cryst F, 2024 | 10.1107/S2053230X24002553 | Practical advice, ideal specimen 기준 |
| `Peters_2021_Understanding_the_invisible_hands_of.pdf` | Weissenberger et al. | Nat Methods, 2021 | 10.1038/s41592-021-01130-6 | 동일 논문 (파일명 다름) |

### AWI (Air-Water Interface)
| 파일 | 저자 | 저널/연도 | DOI | 내용 |
|------|------|-----------|-----|------|
| `annurev-biochem-072020-020231.pdf` | Glaeser | Annu Rev Biochem, 2021 | 10.1146/annurev-biochem-072020-020231 | AWI 체계적 리뷰 |
| `1-s2.0-S0022283622005538-main.pdf` | Liu & Wang H-W | J Mol Biol, 2023 | 10.1016/j.jmb.2022.167926 | AWI 메커니즘 + 해결 전략 |
| `rr5238.pdf` | Yadav & Vinothkumar | Acta Cryst D, 2024 | 10.1107/S2059798324005229 | Orientation 영향 인자 |
| `1-s2.0-S0969212620302823-main.pdf` | Klebl, Muench et al. | Structure, 2020 | 10.1016/j.str.2020.07.018 | Vitrobot vs Chameleon vs 6ms |

### AWI 해결 — 최신 기법
| 파일 | 저자 | 저널/연도 | DOI | 내용 |
|------|------|-----------|-----|------|
| `s41592-025-02796-y.pdf` | Straub et al. | Nat Methods, 2025 | 10.1038/s41592-025-02796-y | Laser flash melting + revitrification |
| `s41467-025-61270-7.pdf` | Zhang, Russo, Löwe | Nat Commun, 2025 | 10.1038/s41467-025-61270-7 | Foam film vitrification |
| `s41592-024-02247-0.pdf` | Yang, Wang H-W et al. | Nat Methods, 2024 | 10.1038/s41592-024-02247-0 | ESI-cryoPrep (electrospray) |
| `pgae284.pdf` | Esfahani, Stagg et al. | PNAS Nexus, 2024 | 10.1093/pnasnexus/pgae284 | SPOT-RASTR — lipid nanotube |

### 특화 시료
| 파일 | 저자 | 저널/연도 | DOI | 내용 |
|------|------|-----------|-----|------|
| `1-s2.0-S0959440X2500065X-main (1).pdf` | Chien, Chiu et al. | Curr Opin Struct Biol, 2025 | 10.1016/j.sbi.2025.103047 | 막단백질 — detergent, nanodisc, amphipol |
| `s41596-024-01072-1.pdf` | Nat Protoc | Nat Protoc, 2024 | 10.1038/s41596-024-01072-1 | RNA sample optimization |
| `1-s2.0-S1047847725000863-main.pdf` | Bajaj | J Struct Biol, 2025 | 10.1016/j.jsb.2025.108251 | 막단백질 expression → purification → mimetics |

### 기타 논문
| 파일 | 저자 | 저널/연도 | DOI | 내용 |
|------|------|-----------|-----|------|
| `henderson-2013-avoiding-the-pitfalls...pdf` | Henderson | PNAS, 2013 | — | Einstein from noise, 크라이오EM 함정 |
| `Three-dimensional_organization_of_the_cytoskeleton.pdf` | — | — | — | 세포골격 3D 구조 (Cryo-ET) |
| `zha5001.pdf` | — | — | — | 미확인 |

---

## 교재/워크샵
| 파일 | 내용 |
|------|------|
| `서울대_기기원_cryoEM_워크샵_cryoEM_김한성_final.pdf` | 원본 워크샵 슬라이드 (Section 1-2 소스) |
| `교재-기초지식편_최종본_250530 (3).pdf` | 한국어 Cryo-EM 기초 교재 |
| `교재-프로토콜편_최종본_250530 (3).pdf` | 한국어 Cryo-EM 프로토콜 교재 |
| `cryoSPARC_Fundamentals.pdf` | CryoSPARC 기초 (대용량 123M) |
| `SLAC 2024.pdf` | SLAC S2C2 워크샵 2024 (48M) |
| `S2C2_2025_SKB_JWF.pptx.pdf` | S2C2 워크샵 2025 (19M) |
| `Kretsch_S2C2_workshop_2025_v1.pdf` | Kretsch S2C2 워크샵 |

## 소프트웨어/모델빌딩
| 파일 | 내용 |
|------|------|
| `Coot-SLAC-S2C2-2025-v2.pdf` | Coot 모델 빌딩 (93M) |
| `Moorhen_LC.pdf` | Moorhen 웹 기반 모델 빌딩 (45M) |
| `Restraints Talk.pdf` | 정제 Restraints (27M) |
| `Sobolev_refinement.pptx.pdf` | Sobolev 정제 (26M) |
| `goddard_animations_oct2025.pdf` | ChimeraX 애니메이션 |
| `encftn_keynote_17sep2024_allbuilds.pdf` | 키노트 발표 (70M) |

## 장비/디자인
| 파일 | 내용 |
|------|------|
| `krios-g4-ecfeg-brochure-br0129 (1).pdf` | ThermoFisher Krios G4 브로셔 |
| `Brandlogy_Template_01.pdf` | 슬라이드 디자인 템플릿 |
| `facility_04010101_01.pdf` | 시설 관련 문서 |

---

## 미보유 — 추가 확보 권장 논문

| 저자 | 저널/연도 | DOI | 내용 |
|------|-----------|-----|------|
| Drulyte et al. | Acta Cryst D, 2018 | 10.1107/S2059798318006496 | Approaches to altering particle distributions in cryo-EM |
| D'Imprima et al. | eLife, 2019 | 10.7554/eLife.42747 | Protein denaturation at AWI + graphene solution |
| Noble et al. | eLife, 2018 | 10.7554/eLife.34257 | Routine single particle cryo-EM — reducing time from grid to structure |
| Carragher et al. | J Microsc, 2019 | 10.1111/jmi.12767 | Current outcomes when optimizing 'standard' sample prep for cryo-EM |
| Chen et al. | Nat Methods, 2022 | 10.1038/s41592-022-01632-z | Eliminating effects of particle adsorption to AWI |
| Naydenova & Russo | Nat Commun, 2017 | 10.1038/s41467-017-00782-3 | Measuring ice thickness — technique paper |
| Razinkov et al. | J Struct Biol, 2016 | 10.1016/j.jsb.2016.07.006 | Spotiton — new sample vitrification device |
| Dandey et al. | J Struct Biol, 2018 | 10.1016/j.jsb.2018.07.003 | Spotiton — time-resolved cryo-EM |
| Tan & Bhella | Acta Cryst D, 2023 | 10.1107/S2059798323009464 | cryo-EM comprehensive practical guide |
| Passmore & Russo | Methods Enzymol, 2016 | 10.1016/bs.mie.2016.04.011 | Specimen preparation for high-resolution cryo-EM |

---

## 참고 웹사이트

| 사이트 | URL | 내용 |
|--------|-----|------|
| cryoEM 101 | https://cryoem101.org | 초보자용 cryo-EM 튜토리얼 |
| MyScope | https://myscope.training | EM 기초~고급 |
| CryoSPARC Guide | https://guide.cryosparc.com | CryoSPARC 공식 문서 |
| RELION Wiki | https://relion.readthedocs.io | RELION 공식 문서 |
| ThermoFisher Sample Prep | https://www.thermofisher.com/.../sample-preparation-equipment-em.html | Vitrobot 등 |
| SPT Labtech | https://www.sptlabtech.com/products/chameleon | Chameleon |
| NanoImaging Services | https://nanoimagingservices.com | 상업 cryo-EM, grid production 가이드 |
| Creative Biostructure | https://www.creative-biostructure.com/resource-cryo-em-grid-preparation-guide.htm | Grid prep 가이드 |

---

## 사용법
- fact-checker는 이 INDEX를 먼저 읽고 관련 PDF를 판단
- 대용량 PDF(>50M)는 목차 페이지(1-3)를 먼저 읽고 필요한 섹션만 추가 로드
- "미보유" 논문은 필요 시 웹에서 확인 가능 (DOI 링크)
