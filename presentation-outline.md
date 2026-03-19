# Cryo-EM Tutorial: Complete Slide Outline (Draft v2 — PDF 기반)

**원본:** `서울대_기기원_cryoEM_워크샵_cryoEM_김한성_final.pdf` (132 slides)
**대상:** Cryo-EM 입문 대학원생 (구조생물학 배경, cryo-EM 실험 경험 없음)
**목표:** cryo-EM의 전체 맥락 이해 + SPA 실험의 핵심 디테일 습득
**총 HTML 슬라이드:** ~85장 (PDF 132장을 논리적으로 통합)

> **원칙:**
> 1. PDF 원본의 **주제 순서와 흐름**을 따른다. 슬라이드 수는 내용 밀도에 맞게 자유롭게 조절.
> 2. 한 슬라이드에 한 가지 포인트. 내용이 압축되어 있으면 여러 장으로 나누고, 반복이면 합친다.
> 3. **실제 이미지 우선.** PPTX에서 추출한 참고문헌 figure, 실제 micrograph, 장비 사진을 적재적소에 배치.
>    어설픈 프로그래밍 그래픽(Canvas/SVG) 대신 원본 이미지가 훨씬 효과적.
> 4. 이미지 소스: `cryo-slides-img/` (Sample_prep_v0.92.pptx에서 추출한 234개 이미지, `s{PDF번호}_{순번}.png`)
> 5. 추가 이미지가 필요하면 다른 PPTX에서 추출하여 사용.

---

## 참고 소스 파일

| # | 파일명 | 슬라이드 수 | 용도 |
|---|--------|-----------|------|
| 1 | `서울대_기기원_cryoEM_워크샵_cryoEM_김한성_final.pdf` | 132 | **PRIMARY** — 전체 구조 및 흐름 |
| 2 | `서울대_기기원_cryoEM_워크샵_Sample_prep_v0.92.pptx` | 143 | 전체 4섹션 + speaker notes (한국어) |
| 3 | `서울대_기기원_cryoEM_교육_v0.3.pptx` | 110 | EM 기초 + Cryo-EM 개론 (한국어) |
| 4 | `What_is_cryoEM.pptx` | 30 | 회사 소개 + drug discovery |
| 5 | `KBSI_231024_BaobabAiBIO_H.Kim_v1.2.pptx` | 63 | Sub-100 kDa, X-ray vs Cryo-EM |
| 6 | `GPCR_Ag-Ab_v0.85.pptx` | 63 | GPCR + 항체 구조 |
| 7 | `EMBL_Cryo-EM_in_acedemian_and_industry_2024.01.pptx` | 297 | 산업계 + 학계 (이미지 위주) |
| 8 | `BAB_Celltrion_IR_24.04.26_v0.95.pptx` | 48 | 제약사 IR (X-ray vs Cryo-EM) |
| 9 | `2022_ASK_김한성_02.pptx` | 72 | Resolution revolution + 자체 결과 |

---

## Section 1: Cryo-EM Overview & History (~25 HTML slides ← PDF 1-35)

> **목표:** "cryo-EM이 왜 중요한지, 어떻게 여기까지 왔는지, 앞으로 어디로 가는지" 맥락 잡기
> **강의 시간:** ~40분

### S1-01. Title Slide
- **PDF:** #1, #3
- **제목:** Cryo-EM: From Blobs to Atoms
- **콘텐츠:** 강의 제목, 강사 소개, 날짜, 기관 로고
- **비주얼:** Hero 이미지 (cryo-EM micrograph 배경 + 제목 오버레이)
- **보충:** 교육_v0.3 slide 1-2

### S1-02. What is Cryo-EM?
- **PDF:** #4
- **제목:** What is Cryo-EM?
- **콘텐츠:**
  - Bjorn Forsberg 인용: "Cryo-EM is a bit of an imaging miracle..."
  - 100 nm → 1 nm 스케일 시각화
  - 핵심 메시지: 2D 이미지 수천 장 → 3D 분자 구조
- **비주얼:** 3D 구조 이미지 + 인용문 + 스케일 비교
- **보충:** 교육_v0.3 slide 3 (전자현미경이란?)

### S1-03. Electron Microscope & Biological Samples — The Problem
- **PDF:** #5
- **제목:** Electron Microscope & Biological Samples
- **콘텐츠:**
  - Vacuum: 수분 증발 → Chemical fixation & dehydration → Structural changes
  - Electron Beam: Sample thickness, Low contrast, Non-conductive
  - 핵심: EM의 진공+방사선 환경이 생체 시료에 치명적
- **비주얼:** TEM column diagram + 문제점 목록
- **보충:** 교육_v0.3 slide 4-5 (전자현미경 원리), Sample_prep slide 6

### S1-04. Conventional TEM vs Cryo-EM
- **PDF:** #6
- **제목:** Conventional TEM vs Cryo-EM
- **콘텐츠:**
  - Conventional TEM 장점: Simple prep, Good SNR, Radiation resistant
  - Conventional TEM 단점: Staining/dehydration artifacts, Non-native environment
  - Cryo-EM 장점: No fixation/dehydration/staining, Preservation of native state
  - Cryo-EM 단점: Technical demands, Low SNR, Freezing artifacts, Radiation sensitivity
- **비주얼:** 2-column 비교 테이블
- **보충:** 교육_v0.3 slide 6-8 (TEM vs SEM), BAB_Celltrion slide 5-8

### S1-05. Cryo-Electron Microscope — Key Components
- **PDF:** #7
- **제목:** Cryo-Electron Microscope
- **콘텐츠:**
  - Cryo holder / Autoloader system: 시료를 -180°C로 유지
  - Energy filter: inelastic scattering 전자 제거 → 콘트라스트 향상
  - Direct electron detector (DED): electron counting + movie mode
- **비주얼:** 3-column (장비 이미지 + 설명)
- **보충:** 교육_v0.3 slide 14-16, Sample_prep slide 8

### S1-06. Resolution Revolution — Before & After
- **PDF:** #8
- **제목:** From Blobs to High Resolution
- **콘텐츠:**
  - Resolution before 2013 vs Resolution at present
  - 동일 구조의 해상도 비교 (blob → atomic detail)
  - DED 도입이 game-changer
- **비주얼:** Before/After 구조 비교 (대형 이미지)
- **보충:** 2022_ASK slide 3-8 (resolution revolution)

### S1-07. The Foundations (1968–1994)
- **PDF:** #9, #10
- **제목:** From Blobs to High Resolution — Foundations (1968–1994)
- **콘텐츠:**
  - 1968 DeRosier & Klug: 최초 3D EM reconstruction (T4 phage tail)
  - 1974 Taylor & Glaeser: frozen hydrated protein crystal → hydration이 핵심
  - 1981 Dubochet et al.: vitrification 발명 (liquid ethane plunge-freezing)
  - 1987 van Heel: angular reconstitution → symmetry 없이 3D 가능
  - 1990 Henderson et al.: bacteriorhodopsin 3.5Å → EM 최초 atomic resolution
  - 1994 Penczek/Frank: projection matching → single particle의 시작
- **비주얼:** 타임라인 (6 milestones, 논문 이미지 + 핵심 기여)
- **보충:** Sample_prep slide 10-11, 교육_v0.3 slide 17-20

### S1-08. The Resolution Revolution (1997–2015)
- **PDF:** #11
- **제목:** From Blobs to High Resolution — Resolution Revolution (1997–2015)
- **콘텐츠:**
  - 1997 Böttcher/Crowther: 10Å virus structure
  - 1998 Sigworth: 2D Maximum likelihood
  - 2008 Zhou et al.: virus de novo tracing
  - 2012 Grigorieff et al.: DED cameras + motion correction
  - 2013 Cheng/Julius: TRPV1 3.4Å → 최초 near-atomic membrane protein by SPA
  - 2015 Scheres/Shi: de novo tracing <200 kDa
- **비주얼:** 타임라인 (6 milestones, 2012 DED 하이라이트)
- **보충:** 2022_ASK slide 9-15, KBSI slide 8-12

### S1-09. The Resolution Revolution — Key Publications
- **PDF:** #12
- **제목:** The Resolution Revolution — Landmark Papers
- **콘텐츠:**
  - Nature "Resolution Revolution" 기사들
  - "The revolution will not be crystallized" 헤드라인
  - cryo-EM이 mainstream structural biology로 전환된 시점
- **비주얼:** 논문/기사 이미지 콜라주
- **보충:** 2022_ASK slide 16-18

### S1-10. Nobel Prize in Chemistry 2017
- **PDF:** #13
- **제목:** Nobel Prize in Chemistry 2017
- **콘텐츠:**
  - Jacques Dubochet: vitrification (1981)
  - Joachim Frank: single-particle image processing (1975~)
  - Richard Henderson: bacteriorhodopsin 3.5Å (1990)
  - "for developing cryo-electron microscopy for the high-resolution structure determination of biomolecules in solution"
- **비주얼:** 3-column 수상자 카드 + 수상 문구
- **보충:** 교육_v0.3 slide 21-22, Sample_prep slide 13

### S1-11. PDB Entries — Growth by Method
- **PDF:** #14, #16
- **제목:** PDB Entries Categorized by Method
- **콘텐츠:**
  - Number of Released PDB Structures per Year (line chart)
  - X-ray 여전히 주류지만 cryo-EM 급성장
  - 연도별 bar chart: cryo-EM 비중 증가 추세
- **비주얼:** 상단 line chart + 하단 bar chart
- **보충:** KBSI slide 13-14, BAB_Celltrion slide 9-10

### S1-12. PDB Entries — Current Breakdown
- **PDF:** #15, #17
- **제목:** PDB Entries — Method & Size Distribution
- **콘텐츠:**
  - 방법별 pie chart (by 2024)
  - 방법별 cumulative graph
  - Molecular weight distribution: X-ray vs cryo-EM vs NMR
  - cryo-EM이 큰 분자에서 강세
- **비주얼:** 상단 pie chart + 하단 MW distribution
- **보충:** KBSI slide 15-16

### S1-13. Cryo-EM Methodology — 5 Approaches
- **PDF:** #18
- **제목:** Cryo-EM Methodology
- **콘텐츠:**
  - Imaging 계열: CryoEM Tomography (5-10Å), Single Particle Analysis (0.9Å)
  - Crystal-based 계열: 2D Electron Crystallography (1.2Å), MicroED
  - 비교: X-ray Crystallography
  - 각 방법의 Advantages / Challenges
- **비주얼:** 5-column 방법론 비교 카드
- **보충:** 교육_v0.3 slide 23-25

### S1-14. Recent Development — Atomic Resolution
- **PDF:** #19
- **제목:** Recent Development — Approaching True Atomic Resolution
- **콘텐츠:**
  - Mitochondria respiratory chain (대형 complex)
  - 33 kDa protein at 0.9Å (small protein도 가능)
  - Cold-FEG, Falcon 4/K3, energy filters의 기여
- **비주얼:** 2-column (대형 complex vs 작은 단백질) + map 이미지
- **보충:** 2022_ASK slide 19-22 (자체 결과: apoferritin 1.91Å, β-gal 2.19Å)

### S1-15. Sizing Up Cryo-EM
- **PDF:** #20
- **제목:** Sizing Up Cryo-EM — Technique vs Structure Size
- **콘텐츠:**
  - 구조 크기 vs 사용 가능한 방법 차트
  - 1Å ~ 1mm 스케일: Light Microscopy → X-ray → cryo-EM → NMR 등
  - Single Particle Cryo-TEM: ~10nm 영역
  - Cryo-ET: ~100nm-1μm 영역
  - MicroED: 결정 기반
- **비주얼:** 가로 스케일 차트 (FEI/ThermoFisher 스타일)
- **보충:** 교육_v0.3 slide 26

### S1-16. A Structural Biologist's Dream
- **PDF:** #21
- **제목:** A Structural Biologist's Dream — Structural Cell Biology
- **콘텐츠:**
  - SPA를 넘어 cryo-ET, in situ, cellular structural biology로 확장
  - Structural Cell Biology: 세포 내 단백질 구조를 직접 관찰하는 꿈
  - 다양한 스케일에서의 구조 이미지 (virus, ribosome, 세포)
- **비주얼:** "Structural Cell Biology" 중앙 타이틀 + 주변 구조 이미지
- **보충:** 교육_v0.3 slide 27

### S1-17. SPA Workflow Overview
- **PDF:** #22, #23
- **제목:** Single Particle Analysis (SPA) Workflow
- **콘텐츠:**
  - 전체 과정 한눈에: Sample Prep → Imaging → Processing → Model
  - 단백질 정제 (2-3개월) → 샘플 스크린 (2주) → 초기 데이터 → 고해상도 모델
  - 주요 장비/단계 다이어그램
- **비주얼:** 수평 파이프라인 + timeline
- **보충:** Sample_prep slide 24-25

### S1-18. SPA Workflow — Detailed Steps
- **PDF:** #24
- **제목:** SPA Workflow — From Protein to Structure
- **콘텐츠:**
  - A: Protein purification → Molecular characterization → Grid preparation
  - B: Screening → Data collection
  - C: Pre-processing → Classification → Refinement → Model building
  - Halfon et al. 2022 Faraday Discuss. reference
- **비주얼:** 3-row process diagram (Preparation / Microscopy / Processing)
- **보충:** Sample_prep slide 25

### S1-19. Problems and Limitations
- **PDF:** #25, #26
- **제목:** Problems and Limitations of Cryo-EM
- **콘텐츠:**
  - **Sample:** Size-limitation, Requires highly purified sample, Vitrification process
  - **Microscopy:** Beam damage, Low dose imaging, Noisy images (low SNR), Imperfect imaging
  - **Data processing:** Complex image processing, Heterogeneous conformations, Multiple interpretation, Computing power
  - The process: Slow, Manual, Non-reproducible (sample prep / microscopy / data processing)
- **비주얼:** 3-category 문제 카드 + process overview
- **보충:** Sample_prep slide 29-30

### S1-20. Cryo-EM Success Stories — TRPV1
- **PDF:** #27
- **제목:** From Blobs to High Resolution — TRPV1
- **콘텐츠:**
  - TRPV1 ion channel: cryo-EM의 landmark structure
  - Nature 2013: Structure of the TRPV1 ion channel (Liao, Cao, Julius, Cheng)
  - TRPV1 structures in multiple conformations (2 articles)
  - Julius → Nobel Prize 2021 (Temperature/Touch sensation)
- **비주얼:** 논문 figure + 구조 이미지
- **보충:** KBSI slide 20-22

### S1-21. Cryo-EM in Big Pharma
- **PDF:** #28
- **제목:** Cryo-EM in Big Pharmas
- **콘텐츠:**
  - Pfizer: First Titan Krios 2016, Cryo-EM lab
  - Genentech: First Titan Krios 2018, 2 Krios / 1 Glacios
  - GSK: Cryo-EM lab
  - Novartis: 2 Glacios
  - Astex: 1 Krios / 2 Glacios
  - AstraZeneca: 1 Krios / 2 Glacios
  - Amgen, Merck, Sanofi, J&J
- **비주얼:** 제약사 로고 그리드 + 장비 현황
- **보충:** What_is_cryoEM slide 15-16, BAB_Celltrion slide 20-22

### S1-22. Drug Targets — Membrane Proteins
- **PDF:** #29
- **제목:** Drug Targets — Membrane Proteins
- **콘텐츠:**
  - GPCR (G-protein coupled receptors) — 승인 약물의 ~34% target
  - Ion channel — voltage/ligand-gated
  - Transporter — ABC/SLC families
  - 구조 이미지 예시: 각 타입별 cryo-EM 구조
- **비주얼:** 3-column (GPCR / Ion channel / Transporter) + 구조 이미지
- **보충:** GPCR_Ag-Ab slide 3-15, What_is_cryoEM slide 10-12

### S1-23. Drug Targets — PROTAC & E3 Ligases
- **PDF:** #30
- **제목:** Drug Targets — E3 Ligases / PROTAC
- **콘텐츠:**
  - PROTAC mechanism: Ternary complex (E3 ligase + linker + target)
  - Ternary complex >200 kDa → 결정화 어려움 → cryo-EM
  - 구조 예시: PROTAC-induced degradation complex
- **비주얼:** PROTAC 메커니즘 다이어그램 + cryo-EM 구조
- **보충:** What_is_cryoEM slide 13-14, BAB_Celltrion slide 25-28

### S1-24. Drug Targets — De Novo Protein Design
- **PDF:** #31, #32
- **제목:** Drug Targets — Biologics & De Novo Protein Design
- **콘텐츠:**
  - Different platforms: small molecules, mAbs, ADCs, de novo protein 등
  - Chroma (Generate Biomedicines): De novo binder → Target → <1.0 Å RMSD
  - cryo-EM으로 designed protein의 실제 접힘 확인
- **비주얼:** 2-column (platforms overview / Chroma 사례)
- **보충:** What_is_cryoEM slide 17-20

### S1-25. Cryo-EM in Korea & Industry
- **PDF:** #33, #34, #35
- **제목:** Cryo-EM — Korean Landscape & Industry Trends
- **콘텐츠:**
  - 국내 제약: Samsung Bioepis, Celltrion, LG화학, 종근당, 대웅제약, 한국콜마, GC녹십자 + 바이오 벤처/스타트업
  - Cryo-EM CRO: 외주 서비스 업체들
  - Data processing in "Cloud": cloud 기반 데이터 처리 트렌드
- **비주얼:** 상단 국내 기업 로고 + 하단 CRO/Cloud 패널
- **보충:** BAB_Celltrion slide 30-35, KBSI slide 55-60

---

## Section 2: Sample Preparation (~25 HTML slides ← PDF 36-75)

> **목표:** "좋은 시료가 좋은 데이터의 시작" — sample prep의 모든 단계와 실패 원인 이해
> **강의 시간:** ~45분

### S2-01. Section Title
- **PDF:** #36
- **제목:** Sample Preparation
- **비주얼:** cryo-EM micrograph 배경 + 섹션 제목
- **포맷:** 다크 배경 hero 이미지

### S2-02. Time & Cost of SPA Pipeline — Sample Prep
- **PDF:** #37
- **제목:** Time & Cost of a Single Particle Cryo-EM Pipeline
- **콘텐츠:**
  - 전체 파이프라인에서 Sample Preparation 단계 하이라이트
  - Sample prep이 가장 시간이 오래 걸리고 불확실한 단계
  - Halfon et al. 2022 reference
- **비주얼:** Pipeline 다이어그램 (sample prep 영역 강조)
- **보충:** Sample_prep slide 34

### S2-03. Goal of Sample Preparation
- **PDF:** #38
- **제목:** Goal of Sample Preparation
- **콘텐츠:**
  - ✓ Preserve the biological specimen in a **native state** such that it will give **maximum contrast**
  - To obtain a high resolution structure:
    - Best specimen
    - Use optimal magnification
    - Use detector with best DQE possible
    - Obtain best micrographs possible
  - → **Leading to highest resolution structure with least data**
- **비주얼:** 체크리스트 텍스트 (핵심 문구 하이라이트)
- **보충:** Sample_prep slide 35-36

### S2-04. Sample & Grid Preparation — Common Problems
- **PDF:** #39
- **제목:** Sample and Grid Preparation — Common Problems
- **콘텐츠:**
  - NIS 설문 조사 결과 (pie chart):
    - Preferred orientation (29.1%)
    - Homogeneity (16.5%)
    - Instability (21.3%)
    - Particle size (10.1%)
    - Low concentration (3.8%)
    - Flexibility (8.9%)
    - Clumping/Aggregation (3.5%)
    - Well behaved (7.6%)
  - 핵심: 시료 문제가 실패의 92% 이상 차지
- **비주얼:** 도넛 차트 + 문제 유형 라벨
- **보충:** Sample_prep slide 37

### S2-05. The Circle of Cryo-EM Sample Preparation
- **PDF:** #40
- **제목:** The Circle of Cryo-EM Sample Preparation
- **콘텐츠:**
  - 순환 다이어그램: Additives → Detergents → Stock → Foil → Continuous film → Plasma cleaning → pH → Buffer → Construct → Crosslinking → Purification → Plunging → Blotting → Vitrification → Grid coating
  - Zhou et al. 2019 Nat. Struct. Mol. Biol. reference
  - 핵심: 매우 많은 변수가 관여 → 체계적 접근 필수
- **비주얼:** Circular flowchart
- **보충:** Sample_prep slide 38

### S2-06. Homogenous Sample — Quality Assessment
- **PDF:** #41
- **제목:** Homogenous Sample — Quality Check
- **콘텐츠:**
  - Size exclusion chromatography (SEC): monodisperse peak 확인
  - SEC-MALS: 절대 분자량 측정
  - Dynamic light scattering (DLS): hydrodynamic radius 분포
  - Mass photometry: 단일 분자 수준 MW 측정
  - SDS-PAGE: 순도 확인
  - 핵심: monodisperse + homogeneous + 적정 농도
- **비주얼:** 4-panel (각 방법의 차트/그래프)
- **보충:** Sample_prep slide 39, 교육_v0.3 slide 35-37

### S2-07. Negative Staining vs. Vitrification
- **PDF:** #42, #43
- **제목:** Negative Staining vs. Vitrification (Cryo-EM)
- **콘텐츠:**
  - Negative stain: Heavy metal stain 코팅, Carbon support film (continuous)
  - Cryo-EM: Vitreous ice, Carbon support film (holey)
  - 비교 표:
    - **Negative staining:** Faster & easier, Less expensive, Higher contrast/low resolution, Artifacts from staining, Can be done at room temp → Useful for QC (aggregation, disassociation, heterogeneity)
    - **Cryo-EM (Vitrification):** Slower & difficult, Expensive, Lower contrast/high resolution, Retain almost native state
- **비주얼:** 좌우 비교 다이어그램 + 비교 테이블
- **보충:** Sample_prep slide 40-41, 교육_v0.3 slide 38-40

### S2-08. Small Proteins and Cryo-EM — The Challenge
- **PDF:** #44
- **제목:** Small Proteins and Cryo-EM
- **콘텐츠:**
  - Small proteins are abundant but challenging for cryo-EM SPA
  - UniProtKB size distribution vs EMDB entries (큰 gap)
  - 3가지 핵심 난제:
    - Low signal-to-noise ratio
    - Radiation sensitivity
    - Few morphological features
  - MW 분포 pie chart: <100 kDa가 대부분
- **비주얼:** 상단 크기 분포 차트 + 하단 3가지 난제 카드
- **보충:** KBSI slide 25-30, Sample_prep slide 42

### S2-09. Small Protein Strategies — Overview
- **PDF:** #45, #46
- **제목:** Strategies for Small Proteins
- **콘텐츠:**
  - Target-based sample optimization strategies:
    - Rigid Fab / Nanobody scaffolds
    - Legobody approach
    - Phase plate
    - Support films (graphene, GO)
  - Two approaches: enlarge effective mass vs enhance contrast
- **비주얼:** 전략 overview 다이어그램 + 예시 구조들
- **보충:** KBSI slide 31-40

### S2-10. Rigid Fab as Structural Chaperone
- **PDF:** #47
- **제목:** Rigid Fab (as a Structural Chaperone)
- **콘텐츠:**
  - Total 74 kDa → Total 69 kDa → Total 54 kDa (Genentech 사례)
  - Fab fragment가 target에 결합 → 겉보기 크기 증가
  - 비대칭성 부여 → alignment 개선
  - XP20 (126 kDa) + EP21 (21 kDa) → 결합체 구조
- **비주얼:** 구조 비교 이미지 (Fab + target complex)
- **보충:** KBSI slide 35-38

### S2-11. Ordered Mass, Not MW
- **PDF:** #48, #49, #50
- **제목:** Ordered Mass, Not MW — What Matters for Cryo-EM
- **콘텐츠:**
  - 핵심 개념: MW가 아니라 **ordered (rigid) mass**가 중요
  - Flexible domain은 평균화되어 사라짐
  - 예시: 큰 MW여도 flexible하면 effective mass↓
  - 반대: 작은 MW여도 rigid하면 구조 해결 가능
  - Scaffold 전략: 2D 어레이, 올리고머화 등
- **비주얼:** 개념 다이어그램 (flexible vs rigid) + 예시 사례
- **보충:** KBSI slide 41-45

### S2-12. How Low Can We Go? — Henderson Limit
- **PDF:** #51, #52
- **제목:** How Low Can We Go for Single Particle Cryo-EM?
- **콘텐츠:**
  - **38 kDa** — Henderson의 이론적 최소 크기
  - Sigworth 2016 논문: "Principles of cryo-EM single-particle image processing"
  - "Future EM improvements in a factor of 2-3 in resolution per particle, thereby enabling the molecular characterization of systems well below 100 kDa"
  - 현재 상태 vs 미래 전망 테이블
- **비주얼:** Henderson limit 표 + Sigworth 논문 인용
- **보충:** KBSI slide 46-48, 2022_ASK slide 30-35

### S2-13. Minimum Molecular Mass & Current Status
- **PDF:** #53, #54
- **제목:** Minimum Molecular Mass & EMDB Entries
- **콘텐츠:**
  - Minimum molecular mass identifiable in situ (graph)
  - 카메라 세대별 개선 (K2 → K3 → Falcon 4 등)
  - EMDB entries: Size vs Resolution scatter plot ("Are we there yet?")
  - 작은 단백질도 점점 해결 가능해지는 추세
- **비주얼:** 상단 mass limit graph + 하단 scatter plot
- **보충:** KBSI slide 49-52

### S2-14. Cryo-EM Grid — Structure & Materials
- **PDF:** #55
- **제목:** Cryo-EM Grid — Structure & Materials
- **콘텐츠:**
  - **Grid:** Cu, Au, Ni, Ti / **Mesh:** 200, 300, 400, hexagonal
  - **Foil:** amorphous C, Au, Ni/Ti
    - Continuous or holey
    - Hole size/spacing: 1.2/1.3, 2/1, 1/1, 0.6/1
    - HexAuFoil 0.3/0.3
    - Lacey carbon
  - **Support film:** amorphous carbon, Graphene, GO
  - 3-level zoom: Grid (3mm) → Square (~50μm) → Hole (1-2μm)
- **비주얼:** Grid 구조 다이어그램 + 재질 비교
- **보충:** Sample_prep slide 53-55, 교육_v0.3 slide 41-43

### S2-15. Grid Handling
- **PDF:** #56
- **제목:** Grid Handling
- **콘텐츠:**
  - Grid 취급 시 주의사항
  - Tweezers 사용법, 그리드 보관
  - 실물 이미지
- **비주얼:** Grid 핸들링 이미지
- **보충:** Sample_prep slide 54

### S2-16. Grid Preparation — Vitrification Process
- **PDF:** #57
- **제목:** Grid Preparation — Vitrification
- **콘텐츠:**
  - Step 1: Increase hydrophilicity — Glow discharge, Particle behavior
  - Step 2: Vitrification — Blotting vs Dipping vs Jetting, Time/Force/Humidity, Speed
  - Step 3: Ice contamination — Humidity (>95%)
  - 핵심 파라미터: blot force, blot time, humidity, temperature
- **비주얼:** 3-step process + 장비 이미지
- **보충:** Sample_prep slide 55-57, 교육_v0.3 slide 44-46

### S2-17. Automated Grid Preparation
- **PDF:** #58, #59
- **제목:** Automated Grid Preparation — Chameleon & VitroJet
- **콘텐츠:**
  - Chameleon (TTP Labtech): 자동 blotting, fast plunge
  - VitroJet: 자동화된 vitrification, pin printing
  - 기존 Vitrobot 대비 장점: 재현성, 속도, AWI 최소화
- **비주얼:** 2-column (Chameleon / VitroJet) 장비 이미지
- **보충:** Sample_prep slide 56-57

### S2-18. Grid Preparation & Screening Time
- **PDF:** #60
- **제목:** Grid Preparation and Screening Time
- **콘텐츠:**
  - Step 1: Make 1 grid for every condition → 3x sample & 1x time in the lab
  - Step 2: Need to screen all the grids → 0.5 ~ screening time + data collection
  - Step 3: The samples may not work → back to step 1 (2x or more)
  - 워크플로우: 1 sample → 3 grids → screen → 1 best grid → data collection
- **비주얼:** Flowchart (screening workflow with time estimates)
- **보충:** Sample_prep slide 58

### S2-19. Grid Screening — Atlas View
- **PDF:** #61
- **제목:** Grid Screening — Atlas View
- **콘텐츠:**
  - Atlas: 전체 grid에서 ice 분포 확인
  - Good atlas: 균일한 ice coverage
  - Contrast zones, Damaged areas 식별
  - "General ice quality of the specimen"
- **비주얼:** Atlas 이미지 예시 (좋은/나쁜 비교)
- **보충:** Sample_prep slide 59

### S2-20. Grid Screening — Square & Hole View
- **PDF:** #62, #63
- **제목:** Grid Screening — Square & Hole View
- **콘텐츠:**
  - **Square view:** Good looking / Cracked / Contaminated / Small, thick ice
  - "Confirming ice quality of the grid"
  - **Hole view - Ideal:** 균일한 particle 분포, 적절한 ice 두께
  - 다양한 magnification에서의 ideal hole 이미지
- **비주얼:** 상단 4-column (Square 예시) + 하단 Ideal hole 이미지
- **보충:** Sample_prep slide 60-61

### S2-21. Hole View — Common Problems
- **PDF:** #64, #65, #66, #67, #68
- **제목:** Hole View — Recognizing Problems
- **콘텐츠:**
  - **Crystalline ice:** Bragg spots, 동심원 패턴 → 재준비 필요
  - **Particle aggregation:** 응집체 → 농도/buffer 조절
  - **Concentration issue:** Too few / Too many particles
  - **Contamination:** ice crystals, 먼지, 유기물
  - **Other ice issues:** 불균일, 두꺼운 얼음, ethane 잔류
- **비주얼:** 6-card 문제 갤러리 (각 이미지 + 문제 설명)
- **보충:** Sample_prep slide 62-66, 교육_v0.3 slide 50-52

### S2-22. Grid Screening — Evaluation Criteria
- **PDF:** #69
- **제목:** Grid Screening — How to Evaluate
- **콘텐츠:**
  - 평가 4요소:
    - Imaging area available
    - Quality and thickness of the ice
    - Sample appearance
    - Particle concentration and distribution
  - → Evaluate Grid Quality → Decision (collect / re-optimize / discard)
- **비주얼:** 중앙 "Evaluate Grid Quality" + 4방향 평가 기준
- **보충:** Sample_prep slide 67

### S2-23. Air-Water Interface (AWI) Problem
- **PDF:** #70
- **제목:** Air-Water Interface (AWI)
- **콘텐츠:**
  - Good AWI: particles distributed in ice
  - Poor AWI: particles at interface → denaturation, aggregation, preferred orientation
  - AWI interface with clumping & aggregation
  - Time scale: 180~1100 ms이면 대부분 AWI에 흡착
  - "At the AWI, proteins can undergo denaturation, aggregation or preferred orientation"
  - "Negatively impacts the final image quality"
- **비주얼:** AWI 단면 다이어그램 (Good vs Poor) + 경고 메시지
- **보충:** Sample_prep slide 68-69, 교육_v0.3 slide 53-55

### S2-24. AWI Solutions — Fast Plunging
- **PDF:** #71, #72
- **제목:** Spot-to-Plunge Time Effect (with Chameleon)
- **콘텐츠:**
  - Hemagglutinin: ~1s → 500ms → 100ms (2D class 개선)
  - Insulin receptor: 500ms → 250ms
  - 핵심 데이터:
    - Particles can move 100 nm within 1 sec on ice
    - Once absorbed, denaturation may follow in as little as a few ms
  - Spot-to-plunge time: 580 ms, 170 ms 비교
- **비주얼:** 좌우 비교 (시간별 2D class averages) + 데이터 차트
- **보충:** Sample_prep slide 70-71

### S2-25. AWI Solutions — Support Films
- **PDF:** #73
- **제목:** Continuous Support Films
- **콘텐츠:**
  - Apoferritin on Artificial Single Layer Graphene
  - Ferritinase on Artificial Graphene Oxide
  - Apoferritin on Single Layer Graphene
  - Bramtella on Graphene Oxide
  - Lipid Nanoparticles on amorphous Carbon
  - Land Nanoparticles on amorphous Carbon
  - Support film → AWI 접촉 차단
- **비주얼:** 6-panel grid (각 support film type의 micrograph)
- **보충:** Sample_prep slide 71-72

### S2-26. Grid Optimization Summary
- **PDF:** #74
- **제목:** Grid Optimization and...
- **콘텐츠:**
  - 최적화 파라미터 정리:
    - **particle coverage:** concentration, support films
    - **air-water interface:** high-CMC surfactant, support films
    - **detergent residue:** concentration
    - **protein aggregation:** salt concentration, pH, support films
    - **ice thickness:** blotting conditions, surfactant
  - Different vitrification procedures / Functionalized grids
  - Longer data collection / Tilted data collection
- **비주얼:** 파라미터 요약 다이어그램 + checklist
- **보충:** Sample_prep slide 72-73

### S2-27. Sample Requirements for SPA
- **PDF:** #75
- **제목:** Sample Requirements for SPA
- **콘텐츠:**
  - **Size:** >38 kDa of ordered mass, 50 mM ~ 5 nM concentration
  - **Quantity (concentration):** 0.01~1 mg protein
  - **Reagents (Buffer):** Most buffers are fine, but DMSO >0.5%, high sucrose, chemicals, cryoprotectants are exceptions
  - 실용적 체크리스트
- **비주얼:** 3-column (Size / Quantity / Reagents) 카드
- **보충:** Sample_prep slide 73-74

---

## Section 3: Imaging & Data Collection (~15 HTML slides ← PDF 76-93)

> **목표:** 현미경 앞에서 "왜 이 세팅인지" 이해하고 적절한 데이터 수집
> **강의 시간:** ~40분

### S3-01. Section Title
- **PDF:** #76
- **제목:** Imaging...
- **비주얼:** cryo-EM micrograph 배경 + 섹션 제목
- **포맷:** 다크 배경 hero 이미지

### S3-02. Time & Cost — Imaging Phase
- **PDF:** #77
- **제목:** Time & Cost of SPA Pipeline — Imaging
- **콘텐츠:**
  - 전체 파이프라인에서 Imaging 단계 하이라이트
  - 현미경 시간 = 가장 비싼 리소스
- **비주얼:** Pipeline 다이어그램 (imaging 영역 강조)

### S3-03. Proteins Are Dynamic Molecules
- **PDF:** #78
- **제목:** Proteins Are Dynamic Molecules
- **콘텐츠:**
  - Dan Shi: micrograph 예시 (particle 이미지)
  - Pat Bhatt/Ward: 입자별 다른 conformation
  - 핵심: 동일 시료에서도 다양한 상태가 공존
  - cryo-EM의 장점: 이 다양성을 capture 가능
- **비주얼:** 2-column (micrograph + 다양한 conformation 예시)
- **보충:** BAB_Celltrion slide 12-15

### S3-04. Single Particle Analysis — Micrographs
- **PDF:** #79
- **제목:** Single Particle Analysis — From Micrographs to Particles
- **콘텐츠:**
  - 10³-10⁴ Micrographs 수집
  - 각 micrograph에서 수십-수백 particles
  - 최종: 10⁴-10⁶ particle images
- **비주얼:** Micrograph 예시 배열 (→ "......")
- **보충:** Sample_prep slide 96-97

### S3-05. Data Collection Workflow
- **PDF:** #80
- **제목:** Data Collection Workflow
- **콘텐츠:**
  - Atlas → Square selection → Hole selection → Adjusted defocus → Target areas
  - 각 단계의 이미지 예시
  - 500 µm 스케일에서 시작 → 개별 hole까지 zoom
- **비주얼:** 5-step workflow (Atlas → Square → Hole → Defocus → Target)
- **보충:** Sample_prep slide 80

### S3-06. User Decisions — Magnification (Pixel Size)
- **PDF:** #81
- **제목:** User Decisions — Magnification (Pixel Size)
- **콘텐츠:**
  - The number of particles vs the achievable resolution
  - **High mag:** Few pixel sizes, few particles → Larger box size → More processing power → Better resolution potential
  - **Low mag:** Critical pixel size → Limit achievable resolution → More particles per image
  - 다양한 mag에서의 micrograph 비교
- **비주얼:** 좌우 비교 (High mag vs Low mag) + micrograph 예시
- **보충:** Sample_prep slide 81

### S3-07. User Decisions — Defocus Range
- **PDF:** #82, #83, #84, #85, #86, #87
- **제목:** Defocus Range — Finding the Sweet Spot
- **콘텐츠:**
  - Defocus 범위에 따른 contrast vs resolution trade-off
  - **-0.75 μm:** Close to focus → 높은 resolution 잠재력, 낮은 contrast
  - **-1.5 μm:** 일반적 setting, 적절한 balance
  - **-3.0 μm:** 높은 contrast, resolution 손실
  - **At focus:** 시료 거의 안 보임 (amplitude contrast만 ~5%)
  - **+3.0 μm (overfocus):** contrast 반전
  - Ribosome vs Small protein: 입자 크기에 따라 최적 defocus 다름
  - 실무 범위: 0.5 ~ 2.0 μm underfocus
- **비주얼:** 6-panel defocus 비교 (각 defocus에서의 micrograph + power spectrum)
- **보충:** Sample_prep slide 82-87, 교육_v0.3 slide 60-62

### S3-08. User Decisions — Hole Targeting Strategy
- **PDF:** #88
- **제목:** Hole Targeting Strategy
- **콘텐츠:**
  - Conventional targeting: 1 hole per stage movement
  - Multi-hole targeting with beam-image shift: 4-9 holes per movement
  - Multi-shot per hole: 여러 위치에서 촬영
  - Trade-off: resolution ↔ illumination area ↔ drift ↔ magnification
- **비주얼:** 3-column (conventional / multi-hole / multi-shot) 다이어그램
- **보충:** Sample_prep slide 88

### S3-09. User Decisions — Summary
- **PDF:** #89
- **제목:** User Decisions — Summary
- **콘텐츠:**
  - 4가지 핵심 결정:
    1. Magnification (pixel size)
    2. Total electron exposure (total dose)
    3. Defocus range
    4. Hole targeting
  - → **Maximize the number of high-quality images per unit time**
- **비주얼:** 4-card 요약 + 핵심 메시지 배너
- **보충:** Sample_prep slide 89

### S3-10. Data Collection Setting — Typical vs High-Res
- **PDF:** #90
- **제목:** Data Collection Setting
- **콘텐츠:**
  - **Typical data collection setting:**
    - Pixel size ~1 Å
    - Defocus range -1 to -2 μm
    - 40-60 electrons/Å²
    - Multi-shot
  - **Better than 2Å resolution:**
    - Pixel size <1 Å
    - Defocus range -1 to -3 μm
    - 40-60 electrons/Å²
    - Single-shot
- **비주얼:** 2-column 비교 테이블
- **보충:** Sample_prep slide 90

### S3-11. Minimum Molecular Mass — Camera Improvements
- **PDF:** #91
- **제목:** Minimum Molecular Mass Identifiable In Situ
- **콘텐츠:**
  - 카메라 세대별 minimum mass 한계 변화 (graph)
  - K2 → K3 → Falcon 4: 점진적 개선
  - 새 카메라 + 에너지 필터 조합의 효과
- **비주얼:** Mass limit graph + 카메라 이미지
- **보충:** KBSI slide 49-52

### S3-12. Laser Phase Plate
- **PDF:** #92, #93
- **제목:** Laser Phase Plate — Enhanced Contrast
- **콘텐츠:**
  - Laser Phase Plate: Laser off vs Laser on 비교
  - Laser on → 작은 입자도 선명하게 보임
  - Dual Laser Phase Plate (CBI, E01 TKO collaboration)
  - 미래 기술: 작은 단백질 imaging의 breakthrough 가능성
- **비주얼:** Before/After (Laser off/on) + Dual LPP 장비 이미지
- **보충:** KBSI slide 53-55

---

## Section 4: Data Processing (~22 HTML slides ← PDF 94-132)

> **목표:** raw movie부터 atomic model까지 각 단계의 "왜"와 "어떻게" 이해
> **강의 시간:** ~45분

### S4-01. Section Title
- **PDF:** #94
- **제목:** Data Processing
- **비주얼:** cryo-EM micrograph 배경 + 섹션 제목

### S4-02. Time & Cost — Data Processing Phase
- **PDF:** #95
- **제목:** Time & Cost of SPA Pipeline — Data Processing
- **콘텐츠:**
  - 전체 파이프라인에서 Data Processing 단계 하이라이트
  - 컴퓨팅 파워 필요: GPU cluster
- **비주얼:** Pipeline 다이어그램 (data processing 영역 강조)

### S4-03. From Micrographs to Particles
- **PDF:** #96, #97
- **제목:** Single Particle Analysis — The Numbers
- **콘텐츠:**
  - 10³-10⁴ Micrographs → 10⁴-10⁵ particle images → extract individual particles
  - 과정: micrograph → particle picking → extraction → stacks
- **비주얼:** Micrograph 배열 → 확대 → 개별 particle 이미지
- **보충:** Sample_prep slide 96-97

### S4-04. Images to 3D Maps — 4 Challenges
- **PDF:** #98
- **제목:** Images to 3D Maps — Challenges
- **콘텐츠:**
  - 10⁴-10⁵ particle images → (Utilizing ~10% of particles) → Cryo-EM map
  - 4가지 도전:
    1. Unknown particle poses (방향 모름)
    2. Low signal to noise ratio (SNR)
    3. Imperfect imaging (artifacts)
    4. Heterogeneous/dynamic nature
- **비주얼:** 2D → 3D 변환 다이어그램 + 4가지 challenge 리스트
- **보충:** Sample_prep slide 98

### S4-05. Some Terminology — Power Spectrum
- **PDF:** #99, #100
- **제목:** Power Spectrum — What It Tells You
- **콘텐츠:**
  - Power spectrum: FFT of the image (spatial frequency distribution)
  - Low frequencies (large features): low resolution → 중심 근처
  - High frequencies (small features): high resolution → 가장자리
  - 다양한 undesirable effects (beam misalignment, drift, contamination)가 power spectrum에서 더 명확히 보임
  - Power spectrum of micrograph vs 2D power spectrum of micrograph 비교
- **비주얼:** Power spectrum 설명 다이어그램 + 이미지 예시
- **보충:** Sample_prep slide 99-100, 교육_v0.3 slide 70-72

### S4-06. Some Terminology — CTF
- **PDF:** #101
- **제목:** Contrast Transfer Function (CTF)
- **콘텐츠:**
  - CTF: a measure of how much the **phase shift (defocus)** and the **spatial frequency** affect contrast
  - Microscope aberrations (envelope function) have corrupted the image
  - Oscillations within the CTF are easily seen by examining the **power spectrum** (Thon rings)
  - Thon rings represent the alternation of high and low contrast transfer as a function of spatial frequency
  - CTF 수식 + Thon ring 이미지
- **비주얼:** CTF 곡선 그래프 + Thon ring 이미지 + 수식
- **보충:** Sample_prep slide 101, 교육_v0.3 slide 73-75

### S4-07. Understanding Raw Cryo-EM Data
- **PDF:** #102
- **제목:** Understanding Raw Cryo-EM Data
- **콘텐츠:**
  - Aligned, summed micrograph (SPA → 최종 사용하는 이미지)
  - A single frame from input movie (1 프레임 = 매우 noisy)
  - Magnified region of single movie frame
  - "Raw cryo-EM data corresponds to a stack of Fourier frames, where each frame is a spectral image over landing doses and covers"
- **비주얼:** 3-column (summed micrograph / single frame / magnified)
- **보충:** Sample_prep slide 102

### S4-08. Pre-processing — Motion Correction
- **PDF:** #103, #104
- **제목:** Pre-processing — Motion Correction
- **콘텐츠:**
  - Long exposure time per "image" → High total dose exposure needed
  - But particles move due to physical drift and "beam-induced motion"
  - Fractionation into frames ("movie") allows correction of drift and rotation
  - The re-aligned frames can then be summed into a single, de-blurred micrograph
  - HexAuFoil: beam-induced motion trajectory 비교
  - Global vs Local motion correction
- **비주얼:** Before/After (blurry → sharp) + motion trajectory 다이어그램
- **보충:** Sample_prep slide 103-104, 교육_v0.3 slide 76-78

### S4-09. Pre-processing — Dose Weighting
- **PDF:** #105, #106
- **제목:** Pre-processing — Dose Weighting
- **콘텐츠:**
  - To optimize the signal-to-noise ratio across all frequencies in the micrograph
  - The electron beam damages the sample during the course of exposure
  - Cryo-EM movie frames accumulate an increasing amount of electron dose
  - **The earliest frames:** avoid intact information, most electrons → limited contrast
  - **low electrons → limited contrast**
  - **The early frames** → retained high res. info
  - **The later frames** → limited to low res. info
  - Frames 1-5: 완전한 고해상도 → Frames 21-25: 저해상도만
- **비주얼:** Frame별 damage 다이어그램 + 해상도-프레임 매핑
- **보충:** Sample_prep slide 105-106

### S4-10. Pre-processing — CTF Estimation
- **PDF:** #107, #108, #109, #110
- **제목:** Pre-processing — CTF Estimation
- **콘텐츠:**
  - Estimation of CTF parameters to enable the computational correction of the CTF for each image
  - The most important task in CTF estimation is to **determine the true defocus of each image**
  - CTF modeling is also an effective way to screen the data
  - Phase CTF = -2 sin[π(λΔzq² - C_sλ³q⁴/2)]
    - C_s = spherical aberration coefficient
    - Δz = defocus
    - q = spatial frequency
    - λ = electron wavelength
  - 0 μm defocus vs 2 μm defocus: Thon ring 비교
  - CTF sub-structure function fitting: 2D plot of defocus vs resolution
  - Cross-correlation and resolution limit of CTF fitting → 품질 지표
- **비주얼:** CTF formula + Thon ring 비교 (0/2 μm) + fitting 예시
- **보충:** Sample_prep slide 107-110, 교육_v0.3 slide 79-82

### S4-11. Particle Selection and Extraction
- **PDF:** #111, #112, #113, #114
- **제목:** Particle Selection and Extraction
- **콘텐츠:**
  - 방법 비교:
    1. Enhance the signal
    2. Manual picking
    3. Blob picking
    4. Template picking
    5. ML approach (Topaz, crYOLO, SPRNet, DeepCryoPicker etc.)
  - **Topaz:** general model, requires training per new project and setup (or pre-trained model)
  - **Warp:** general model but typically requires user-on training with specific sample types
  - **crYOLO:** general model that works without retraining for a variety of sample types
  - Extraction: box size = 1.5-2x particle diameter → particle stacks
- **비주얼:** Micrograph + picking overlay + 방법론 비교 카드
- **보충:** Sample_prep slide 111-114, 교육_v0.3 slide 83-85

### S4-12. 2D Classification
- **PDF:** #115, #116
- **제목:** 2D Classification
- **콘텐츠:**
  - Raw particle images → Classification → Averaging → Clean class averages
  - 과정: Identification and sorting of individual "views" → Increase the SN ratio
  - junk particle 제거 (ice, aggregation, carbon edge)
  - 구조적 heterogeneity 초기 판단
- **비주얼:** Raw → Sorted → Clean averages flow + check/X marks
- **보충:** Sample_prep slide 115-116, 교육_v0.3 slide 86-88

### S4-13. 2D Classes — Good vs Bad
- **PDF:** #117
- **제목:** 2D Classes — Interpretation Guide
- **콘텐츠:**
  - **Good targets:** High resolution details, multiple views
  - **Sample is poor (too few, too small):** No high-resolution details, small particles, fuzzy
  - **Sample needs improvement:** No high-resolution details, multiple species, fuzzy particles
  - **Sample is good but has preferred orientation:** High resolution details, only one or maybe two views
  - 각 경우의 2D class average 이미지 비교
- **비주얼:** 2×2 grid (4가지 case 각각의 2D class 예시)
- **보충:** Sample_prep slide 117

### S4-14. 3D Reconstruction — Fourier Slice Theorem
- **PDF:** #118
- **제목:** 3D Reconstruction — Principle
- **콘텐츠:**
  - The Fourier transform of each of the 2D class average (projection) is a section of the Fourier transform of the 3D real object
  - All Projections → Different Orientations → Fill Fourier Space → Inverse FFT → Reconstructed 3D object → 3D Map
  - The inverse FT of the combined sections generates the initial objects
- **비주얼:** Fourier Slice Theorem 다이어그램 + 3D reconstruction flow
- **보충:** Sample_prep slide 118, 교육_v0.3 slide 89-91

### S4-15. 3D Reconstruction — Initial Map
- **PDF:** #119, #120
- **제목:** 3D Reconstruction — Initial Map (Ab Initio)
- **콘텐츠:**
  - Object → Projection → Reconstruction (iterative)
  - 좋은 initial map: 구조 특징이 잘 보임
  - 나쁜 initial map: 특징 없는 blob (red circle → 재시도 필요)
  - Ab initio reconstruction: reference 없이 초기 3D 모델 생성
- **비주얼:** Good vs Bad initial map 비교 + iterative 과정
- **보충:** Sample_prep slide 119-120

### S4-16. 3D Reconstruction — Map Optimization Pipeline
- **PDF:** #121, #122
- **제목:** Map Optimization — Refinement Pipeline
- **콘텐츠:**
  - Pipeline: Ab initio → Homogeneous refinement → Non-uniform refinement → Post-processing
  - Post-processing: Map sharpening, Map enhancement, Validation, Analysis
  - 추가 단계:
    - 3D classification → Heterogeneous refinement → CTF refinement
    - Conformational analysis
    - Picking & extraction (재추출)
- **비주얼:** Pipeline flowchart (2단계: 기본 + 확장)
- **보충:** Sample_prep slide 121-122, 교육_v0.3 slide 92-94

### S4-17. Resolution — Definition & Measurement
- **PDF:** #123
- **제목:** Resolution — How Do We Measure It?
- **콘텐츠:**
  - **X-ray crystallography:** Resolution is calculated using Bragg's law → the smallest lattice planes that can be resolved (d = λ/2sinθ)
  - **Cryo-EM:** Resolution is determined by calculating the Fourier Shell Correlation (FSC) between two independently reconstructed half maps → FSC = 0.143 criterion
  - 두 방법의 resolution 의미 차이
- **비주얼:** X-ray (Bragg pattern) vs Cryo-EM (FSC curve) 비교
- **보충:** Sample_prep slide 123, 교육_v0.3 slide 95-97

### S4-18. Resolution — What Can You See?
- **PDF:** #124, #125
- **제목:** Map Resolution — What You Can See at Each Level
- **콘텐츠:**
  - 실제 구조 예시 (color-coded resolution map):
    - ~4.0Å → ~3.5Å → ~3.0Å → ~2.5Å → ~2.0Å → ~1.5Å
  - 해상도별 map 시각화:
    - 3Å: Side chain identity and orientation
    - 5Å: α-helices, Some side chains
    - 10Å: Large features
    - 15Å: Subunit orientations and boundaries
    - 20Å: Overall shape
- **비주얼:** 상단 color-coded 구조 + 하단 해상도별 map 비교
- **보충:** Sample_prep slide 124-125, 교육_v0.3 slide 98-99

### S4-19. Conformational Variability Analysis
- **PDF:** #126, #127
- **제목:** Conformational Variability & 3D Variability Analysis
- **콘텐츠:**
  - Homogeneous Refinement → 3D Variability Analysis
  - 입자 수 분류: 99,042 → 46,065 / 37,909 particles
  - Local Refinement: 3.3Å → further classification
  - 91,223 particles → 6,841 particles (최종 subset)
  - 3DVA: 연속적 움직임을 component별로 분해
- **비주얼:** Classification tree diagram + 구조 비교
- **보충:** Sample_prep slide 126-127, 교육_v0.3 slide 100-102

### S4-20. Rosenthal Plot — Particles vs Resolution
- **PDF:** #128
- **제목:** Rosenthal Plot (Particles vs Resolution)
- **콘텐츠:**
  - log(Particles) vs 1/d² plot
  - InF (information per particle) 개념
  - Resolution ∝ 1/√N 관계
  - 다양한 단백질/complex의 위치
- **비주얼:** Rosenthal plot 그래프
- **보충:** Sample_prep slide 128, 교육_v0.3 slide 103

### S4-21. How Many Particles Do We Need?
- **PDF:** #129
- **제목:** How Much Particles Do We Need???
- **콘텐츠:**
  - EMDB entries scatter plot: particle number vs resolution
  - 다양한 landmark structure의 위치
  - Rule of thumb: 3Å를 원하면 최소 50k-200k good particles
  - 입자만 많다고 안 됨 — 시료 품질이 더 중요
- **비주얼:** Scatter plot + landmark 표시
- **보충:** Sample_prep slide 129

### S4-22. Problems and Limitations — Recap
- **PDF:** #130
- **제목:** Problems and Limitations — Summary
- **콘텐츠:**
  - **Sample:** Size-limitation, Highly purified sample 필요, Vitrification process
  - **Microscopy:** Beam damage, Low dose imaging, Noisy images, Imperfect imaging
  - **Data processing:** Complex processing, Heterogeneous conformations, Multiple interpretation, Computing power
  - 강의 전체 핵심 메시지 요약
- **비주얼:** 3-category 요약 카드 (S1-19와 callback)

### S4-23. Closing — Thank You
- **PDF:** #131, #132
- **제목:** 감사합니다
- **콘텐츠:**
  - Bjorn Forsberg 인용 (S1-02와 callback — 시작과 끝이 연결)
  - 3D 구조 이미지 (100 nm → 1 nm)
  - 감사합니다 / Thank you
- **비주얼:** Hero 이미지 + 감사 메시지

---

## 슬라이드 수 요약

| 섹션 | HTML 슬라이드 | PDF 슬라이드 | 비고 |
|------|------------|-----------|------|
| Section 1: Overview & History | 25 | 1-35 | Big pharma, drug targets, de novo 포함 |
| Section 2: Sample Preparation | 27 | 36-75 | Small protein, grid screening, AWI 상세 |
| Section 3: Imaging | 12 | 76-93 | Defocus 6장→1장, laser phase plate 포함 |
| Section 4: Data Processing | 23 | 94-132 | CTF 4장→1장, particle picking 4장→1장 |
| **합계** | **87** | **132** | |

---

## PDF→HTML 슬라이드 매핑 테이블

| HTML | PDF | 제목 |
|------|-----|------|
| **Section 1** | | |
| S1-01 | 1,3 | Title Slide |
| S1-02 | 4 | What is Cryo-EM? |
| S1-03 | 5 | EM & Biological Samples — Problem |
| S1-04 | 6 | Conventional TEM vs Cryo-EM |
| S1-05 | 7 | Cryo-Electron Microscope Components |
| S1-06 | 8 | Resolution Revolution — Before & After |
| S1-07 | 9,10 | Foundations (1968-1994) |
| S1-08 | 11 | Resolution Revolution (1997-2015) |
| S1-09 | 12 | Key Publications |
| S1-10 | 13 | Nobel Prize 2017 |
| S1-11 | 14,16 | PDB Entries — Growth |
| S1-12 | 15,17 | PDB Entries — Breakdown |
| S1-13 | 18 | Cryo-EM Methodology |
| S1-14 | 19 | Recent Development |
| S1-15 | 20 | Sizing Up Cryo-EM |
| S1-16 | 21 | Structural Biologist's Dream |
| S1-17 | 22,23 | SPA Workflow Overview |
| S1-18 | 24 | SPA Workflow — Detailed |
| S1-19 | 25,26 | Problems and Limitations |
| S1-20 | 27 | TRPV1 Success Story |
| S1-21 | 28 | Big Pharma |
| S1-22 | 29 | Drug Targets — Membrane Proteins |
| S1-23 | 30 | Drug Targets — PROTAC |
| S1-24 | 31,32 | Drug Targets — De Novo Design |
| S1-25 | 33,34,35 | Korea & Industry Trends |
| **Section 2** | | |
| S2-01 | 36 | Section Title |
| S2-02 | 37 | Time & Cost — Sample Prep |
| S2-03 | 38 | Goal of Sample Preparation |
| S2-04 | 39 | Common Problems (NIS survey) |
| S2-05 | 40 | Circle of Sample Preparation |
| S2-06 | 41 | Homogenous Sample — QC |
| S2-07 | 42,43 | Negative Staining vs Vitrification |
| S2-08 | 44 | Small Proteins — Challenge |
| S2-09 | 45,46 | Small Protein Strategies |
| S2-10 | 47 | Rigid Fab |
| S2-11 | 48,49,50 | Ordered Mass, Not MW |
| S2-12 | 51,52 | Henderson Limit |
| S2-13 | 53,54 | Minimum Mass & Current Status |
| S2-14 | 55 | Grid Structure & Materials |
| S2-15 | 56 | Grid Handling |
| S2-16 | 57 | Vitrification Process |
| S2-17 | 58,59 | Automated Grid Prep |
| S2-18 | 60 | Screening Time |
| S2-19 | 61 | Atlas View |
| S2-20 | 62,63 | Square & Hole View |
| S2-21 | 64,65,66,67,68 | Hole View — Problems |
| S2-22 | 69 | Screening Evaluation |
| S2-23 | 70 | AWI Problem |
| S2-24 | 71,72 | AWI — Fast Plunging |
| S2-25 | 73 | AWI — Support Films |
| S2-26 | 74 | Grid Optimization |
| S2-27 | 75 | Sample Requirements |
| **Section 3** | | |
| S3-01 | 76 | Section Title |
| S3-02 | 77 | Time & Cost — Imaging |
| S3-03 | 78 | Dynamic Molecules |
| S3-04 | 79 | SPA — Micrographs |
| S3-05 | 80 | Data Collection Workflow |
| S3-06 | 81 | Magnification (Pixel Size) |
| S3-07 | 82-87 | Defocus Range |
| S3-08 | 88 | Hole Targeting Strategy |
| S3-09 | 89 | User Decisions Summary |
| S3-10 | 90 | Data Collection Setting |
| S3-11 | 91 | Camera Improvements |
| S3-12 | 92,93 | Laser Phase Plate |
| **Section 4** | | |
| S4-01 | 94 | Section Title |
| S4-02 | 95 | Time & Cost — Processing |
| S4-03 | 96,97 | Micrographs to Particles |
| S4-04 | 98 | 4 Challenges |
| S4-05 | 99,100 | Power Spectrum |
| S4-06 | 101 | CTF Concept |
| S4-07 | 102 | Raw Cryo-EM Data |
| S4-08 | 103,104 | Motion Correction |
| S4-09 | 105,106 | Dose Weighting |
| S4-10 | 107-110 | CTF Estimation |
| S4-11 | 111-114 | Particle Picking |
| S4-12 | 115,116 | 2D Classification |
| S4-13 | 117 | 2D Classes — Good vs Bad |
| S4-14 | 118 | 3D Reconstruction Principle |
| S4-15 | 119,120 | Initial Map |
| S4-16 | 121,122 | Map Optimization |
| S4-17 | 123 | Resolution Definition |
| S4-18 | 124,125 | Resolution — What You See |
| S4-19 | 126,127 | Conformational Variability |
| S4-20 | 128 | Rosenthal Plot |
| S4-21 | 129 | How Many Particles? |
| S4-22 | 130 | Problems — Recap |
| S4-23 | 131,132 | Thank You |

---

## 현재 v3 상태 vs 새 아웃라인 비교

| 현재 v3 overview.html | 새 아웃라인 대응 | 상태 |
|---------------------|-------------|------|
| Slide 1: Title | S1-01 | 유지 |
| Slide 2: Why Cryo-EM | S1-03, S1-04 | 분리 필요 |
| Slide 3: Inside Cryo-EM | S1-05 | 유지 |
| Slide 4: Foundations 1968 | S1-07 (통합) | 구조 변경 |
| Slide 5: Foundations 1974 | S1-07 (통합) | 구조 변경 |
| Slide 6: Foundations 1981-1994 | S1-07 (통합) | 구조 변경 |
| Slide 7: Resolution Rev 1997-2008 | S1-08 (통합) | 구조 변경 |
| Slide 8: DED Revolution 2012-2015 | S1-08 (통합) | 구조 변경 |
| Slide 9: Nobel Prize 2017 | S1-10 | 유지 |
| Slide 10: PDB Growth | S1-11 | 유지 |
| Slide 11: Method Comparison | S1-12 | 유지 |
| Slide 12: SPA overview | S1-13 | 변경 필요 |
| Slide 13: SPA Workflow | S1-17 | 유지 |
| Slide 14: Resolution Milestones | S1-14 | 변경 필요 |
| Slide 15: Future | S1-16 | 유지 |
| Slide 16: Applications Membrane | S1-22 | 유지 |
| Slide 17: Applications PROTAC | S1-23 | 유지 |
| Slide 18: Applications Pharma | S1-21 | 유지 |
| Slide 19: Applications Emerging | S1-24 | 유지 |
| Slide 20: De Novo Design | S1-24 (통합) | 통합 |
| Slide 21: Industry Landscape | S1-25 | 유지 |
| *없음* | S1-02, S1-06, S1-08, S1-09, S1-15, S1-18, S1-19, S1-20 | **신규 추가 필요** |

> **Section 1 작업량:** 기존 21장 → 25장. ~8장 신규 추가 + ~4장 구조 변경 + ~13장 유지/수정
> **Section 2-4:** 전체 신규 작업

---

## 구현 우선순위

1. **Section 1 보완** (기존 v3 overview.html 기반 — 신규 8장 추가 + 구조 변경)
2. **Section 2 신규** (sample-prep.html — 27장)
3. **Section 3 신규** (imaging.html — 12장)
4. **Section 4 신규** (processing.html — 23장)
