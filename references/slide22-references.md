# Slide 22 Reference Index

슬라이드 22 (Challenges & Improvements)에서 인용한 논문 + 크로스체크용 논문의 핵심 내용 정리.
각 불릿이 어느 논문의 어디에 근거하는지 추적 가능하도록 인덱스.

---

## 인용 논문 (슬라이드 하단 레퍼런스 라인)

### 1. Hirst et al. (2024)
- **제목**: CryoEM grid preparation: a closer look at advancements and impact of preparation mode and new approaches
- **저널**: Biochemical Society Transactions, 52:1529-1537
- **DOI**: 10.1042/BST20231553
- **PMC**: PMC11346429
- **로컬 PDF**: `Hirst_2024_CryoEM_grid_preparation.pdf`
- **핵심 내용**:
  - Sample prep은 "technical process that takes time to master" (p.1530)
  - Standard blotting 장비에서 4단계 중 2단계만 자동화 (p.1530)
  - 같은 조건에서도 grid-to-grid ice quality 다름 (p.1530, 직접 인용)
  - AWI: denaturation, preferred orientation, subunit dissociation (p.1531)
  - <150 kDa: lower contrast, difficult to align (Future Directions)
  - Particle discard: "significant proportion discarded as badly behaved" (p.1529)
  - Data storage strain 언급 (p.1529)
  - Blotting-free 장비: Table 1 — Chameleon, VitroJet, cryoWriter, CryoGenium
  - Real-time ice monitoring 기능 설명
  - Graphene, GO, amorphous carbon 지지막; affinity grids (His-tag)
  - Streptavidin crystals (ref 32), PEGylated gold (ref 34)
  - **없는 내용**: Ni-NTA 명시 안함, microscopy hardware, data processing 도구

### 2. Chua et al. (2022)
- **제목**: Better, Faster, Cheaper: Recent Advances in Cryo-Electron Microscopy
- **저널**: Annual Review of Biochemistry, 91:1-32
- **DOI**: 10.1146/annurev-biochem-032620-110705
- **PMC**: PMC10393189
- **핵심 내용**:
  - Sample prep: "largest hurdles for most projects"
  - AWI: 100-1000 collisions, denaturation, preferred orientation, complex dissociation
  - 5,000-10,000 micrographs per structure (DATA section)
  - Grid screening: "current bottleneck", "several hours", operator experience 필요
  - Semi-supervised deep learning for square selection: "not yet a general solution for unattended data collection"
  - Cost: "300-keV microscopes ($4-10 million)"
  - Aberrations: Cs, Cc, beam tilt, coma, trefoil, tetrafoil
  - Cold FEG: "0.3 eV energy spread" → "better signal-to-noise ratio"
  - AFIS: "up to approximately 40 high-magnification exposure images per stage movement"
  - 100-200 keV TEMs: "affordable" alternative (Tundra 100keV 언급). **구체적 가격($1-5M) 미명시**
  - Graphene/GO on holey grids; Ni-NTA, Protein G, streptavidin 명시
  - crYOLO, TOPAZ 언급 (CNN-based particle pickers)
  - cryoDRGN, variability analysis (3DVA 개념) 언급
  - CryoSPARC: refinement 도구로 언급, **CryoSPARC Live 미언급**
  - **없는 내용**: Blush, ModelAngelo, DynaMight, Smart EPU

### 3. Vilas et al. (2022)
- **제목**: Emerging Themes in CryoEM - Single Particle Analysis Image Processing
- **저널**: Chemical Reviews, 122:13915-13951
- **DOI**: 10.1021/acs.chemrev.1c00850
- **PMC**: PMC9479088
- **핵심 내용**:
  - Dose: "low total dose regime, between 30 and 60 e/A2"
  - Beam-induced movement (BIM) 설명
  - CTF: "modeling the microscope aberrations, including the defocus"
  - Higher-order aberrations: beam tilt, coma, trefoil
  - Particles: "several hundred thousands to several millions"
  - GPU acceleration: TensorFlow/PyTorch 언급
  - "identical copies assumption" — flexibility가 function에 연결
  - crYOLO, TOPAZ 언급
  - Raw data: "easily measured in terabytes"
  - **없는 내용**: sample prep 상세, microscopy hardware 스펙, 가격, 최신 도구들

---

## 크로스체크 논문 (슬라이드 레퍼런스 라인에 미포함)

### 4. Toader et al. (2023)
- **제목**: Methods for Cryo-EM Single Particle Reconstruction of Macromolecules Having Continuous Heterogeneity
- **저널**: Journal of Structural Biology
- **PMC**: PMC10164696
- **핵심 내용**:
  - "it is likely that (valid) particle images from rare conformations are discarded, too"
  - "information from particles on the boundary between different 'discrete' structures... is lost"
  - Continuous heterogeneity 방법이 이 문제를 완화
  - **용도**: Wasted particles 불릿 근거

### 5. Zhong et al. (2023) — cryoDRGN protocol
- **제목**: Uncovering structural ensembles from single particle cryo-EM data using cryoDRGN
- **저널**: Nature Protocols
- **PMC**: PMC10049411
- **핵심 내용**:
  - Traditional classification에서 "overlooked" 된 rare structural states 발견
  - "forgoing stringent particle filtering" → wider heterogeneity 학습
  - **용도**: Wasted particles 불릿 근거, cryoDRGN 기능 확인

---

## 불릿별 레퍼런스 매핑

### 상단 카드: Challenges

| 불릿 | Hirst 2024 | Chua 2022 | Vilas 2022 | 기타 | 검증 |
|------|:---:|:---:|:---:|:---:|:---:|
| SP1 Slow (iterative cycles) | O | O | - | | 2/3 |
| SP2 Manual (vitrification) | O | O | - | | 2/3 |
| SP3 Non-reproducible (grid-to-grid) | O | O | - | | 2/3 |
| SP4 AWI (denaturation etc.) | O | O | - | | 2/3 |
| SP5 Size limitation (<150 kDa) | O | - | - | | 1/3 * |
| M1 Slow (5k-10k micrographs) | partial | O | - | | 2/3 |
| M2 Manual (target selection) | O | O | - | | 2/3 |
| M3 Grid dependent | O | O | - | | 2/3 |
| M4 Beam effects (30-60 e/A2) | partial | partial | O | | 2/3 |
| M5 Aberrations (CTF etc.) | - | O | O | | 2/3 |
| M6 Cost ($4-10M, queues) | partial | O | - | | 2/3 |
| DP1 Slow (millions, GPU) | partial | O | O | | 3/3 |
| DP2 Manual (2D selection) | - | partial | partial | | 2/3 |
| DP3 Heterogeneity | O | O | O | | 3/3 |
| DP4 Wasted particles | partial | - | - | Toader, Zhong | 1/3 + 2 |
| DP5 Data management (TB) | O | O | O | | 3/3 |

### 하단 카드: What's Improving

| 불릿 | Hirst 2024 | Chua 2022 | Vilas 2022 | 기타 | 검증 |
|------|:---:|:---:|:---:|:---:|:---:|
| ISP1 Blotting-free devices | O | O | - | | 2/3 |
| ISP2 Grids (graphene, affinity) | O | O | - | | 2/3 |
| IM1 Cold FEG (0.3 eV) | - | O | - | | 1/3 * |
| IM2 AFIS (~40 exposures) | - | O | - | | 1/3 * |
| IM3 Compact TEMs (100-200 keV) | - | O | - | | 1/3 * |
| IM4 Automated screening (Smart EPU) | - | partial | - | | 1/3 * |
| IDP1 Live processing (CryoSPARC Live) | - | - | - | | 0/3 ** |
| IDP2 AI (crYOLO, TOPAZ, Blush, ModelAngelo) | - | partial | partial | | crYOLO/TOPAZ: 2/3, Blush/ModelAngelo: 0/3 ** |
| IDP3 Heterogeneity (3DVA, cryoDRGN, DynaMight) | - | partial | - | | 3DVA/cryoDRGN: 1/3, DynaMight: 0/3 ** |

`*` = 1개 소스지만 hardware spec/사실 확인 가능
`**` = 인용 논문에 없음, 별도 인용 필요

---

## 미해결 이슈

1. **SP5 Size limitation** — Hirst만 지적. 커뮤니티 상식이지만 인용 논문 1개뿐
2. **IM1-4 Microscopy improvements** — Chua 1편에만 의존. Hardware spec이라 사실 확인은 가능
3. **IDP1-3 Data Processing improvements** — CryoSPARC Live, Blush, ModelAngelo, DynaMight, Smart EPU 는 인용 3개 논문에 없음. 별도 인용 추가 필요
4. **Compact TEM 가격** — "$1-5M" 삭제, "lower-cost alternative" 로 변경 완료
