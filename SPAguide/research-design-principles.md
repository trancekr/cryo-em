# Cryo-EM 교육 슬라이드를 위한 디자인 원칙 리서치

> 2026-03-25 작성 | 대학/연구소 세팅의 Cryo-EM 튜토리얼 프레젠테이션용

---

## 1. 교육 프레젠테이션 디자인 — Mayer의 멀티미디어 학습 이론

### Mayer의 12원칙 (슬라이드 디자인에 적용 가능한 핵심)

| 원칙 | 정의 | 슬라이드 적용 규칙 |
|------|------|---------------------|
| **Multimedia** | 텍스트만보다 텍스트+이미지가 학습 효과 높음 | 모든 슬라이드에 시각 자료 포함. 텍스트만 있는 슬라이드 지양 |
| **Coherence** | 불필요한 요소 제거 시 학습 향상 | 장식적 이미지, 배경 음악, 관련 없는 그래픽 제거. 학습 목표에 직결되는 콘텐츠만 |
| **Signaling** | 핵심 정보를 강조하는 시각적 단서가 학습 도움 | 화살표, 볼드, 하이라이트 박스로 주의 유도 |
| **Redundancy** | 그래픽+나레이션이 그래픽+나레이션+텍스트보다 효과적 | 구두 설명할 내용은 슬라이드에 전문 표기 금지. 키워드만 |
| **Spatial Contiguity** | 관련 텍스트와 이미지는 가까이 배치 | 라벨을 이미지 위 또는 바로 옆에. 범례를 멀리 떨어트리지 말 것 |
| **Temporal Contiguity** | 관련 단어와 그림은 동시에 제시 | 애니메이션으로 순차 빌드 시 텍스트와 해당 이미지 함께 노출 |
| **Segmenting** | 작은 단위로 나눌 때 학습 효과 높음 | 복잡한 워크플로우는 단계별로 분리. 한 슬라이드에 과도한 정보 금지 |
| **Pre-training** | 핵심 용어/개념을 먼저 학습하면 이해도 상승 | 섹션 시작 시 핵심 용어 정의 슬라이드 배치 |
| **Modality** | 시각+음성이 시각+텍스트보다 효과적 | 발표 시 슬라이드에는 이미지 중심, 설명은 구두로 |
| **Personalization** | 대화체가 형식적 문체보다 효과적 | "우리가 보는 것은..." 같은 대화체 사용 |
| **Signaling (강조)** | 시각적 큐로 구조와 조직 강조 | 섹션 번호, 색상 코딩, 진행 표시 바 활용 |

- **출처**: [Digital Learning Institute - Mayer's 12 Principles](https://www.digitallearninginstitute.com/blog/mayers-principles-multimedia-learning)
- **출처**: [Educational Technology - Mayer's Principles](https://educationaltechnology.net/mayers-principles-of-multimedia-learning/)

### 실행 규칙
1. **한 슬라이드 = 하나의 아이디어**. 복합 개념은 여러 슬라이드로 분리
2. **라벨은 이미지 위/옆에** 직접 배치 (별도 범례표 지양)
3. **장식적 요소 제거** — 그라데이션 테두리, 워터마크, 관련 없는 아이콘
4. **시각적 신호** — 화살표, 하이라이트 박스, 컬러 강조로 주의 유도

---

## 2. 인지 부하 이론 (Cognitive Load Theory) — 슬라이드 적용

### 3가지 인지 부하

| 유형 | 설명 | 슬라이드 전략 |
|------|------|---------------|
| **Intrinsic** (고유 부하) | 주제 자체의 복잡도 | 사전 지식 슬라이드로 부하 분산 |
| **Extraneous** (외적 부하) | 불필요한 디자인으로 인한 추가 처리 | 최소화 필수. 불필요한 텍스트/장식 제거 |
| **Germane** (유효 부하) | 실제 학습에 기여하는 처리 | 극대화. 의미 있는 시각화, 비교, 연결 제공 |

### 핵심 전략

1. **슬라이드당 요소 6개 이하** — "Limit total slide elements to 6 or fewer" (PMC8638955)
2. **1분/1슬라이드 규칙** — 20분 발표 = ~20 슬라이드
3. **Split-Attention Effect 방지** — 텍스트와 이미지를 분리하면 시선이 왔다갔다하며 작업 기억 낭비. 통합 배치 필수
4. **Progressive Reveal** — 복잡한 프로세스는 같은 슬라이드에서 단계별 공개 (여러 슬라이드 아님). 이전 단계를 참조점으로 유지
5. **텍스트 최소화** — "the less words on a PowerPoint slide, the better" (Chartered College)
6. **구두 설명 중 동일 텍스트 표시 금지** — 두 언어 채널 동시 처리 불가 (Redundancy 효과)

- **출처**: [Chartered College - Using CLT to improve slideshow presentations](https://my.chartered.college/impact_article/using-cognitive-load-theory-to-improve-slideshow-presentations/)
- **출처**: [PMC - Ten Simple Rules for Effective Presentation Slides](https://pmc.ncbi.nlm.nih.gov/articles/PMC8638955/)
- **출처**: [Seckington - The Art of Slide Design: Understanding Cognitive Load](https://www.seckington.com/the-art-of-slide-design-understanding-cognitive-load/)

### Cryo-EM 튜토리얼 특수 적용
- SPA 워크플로우 (Sample prep → Grid → Imaging → Processing → Reconstruction)는 **한 번에 전체 보여주지 말고 단계별 빌드**
- CTF 보정, 입자 피킹 등 개별 개념은 **별도 슬라이드로 분리**
- 수학적 개념 (Fourier Transform, SNR)은 **사전 용어 슬라이드** 필수

---

## 3. 과학 프레젠테이션 설계 — 저널/학회 가이드라인

### Nature 논문 vs 발표 차이점

"Scientists frequently make presentations as comprehensive as journal articles, resulting in a confused audience befuddled by rapid-fire speaking, too much data and too many opaque slides." — Nature Career Column

**규칙**: 논문 figure를 그대로 슬라이드에 넣지 말 것. 발표용으로 재구성 필요.

- **출처**: [Nature - Why your scientific presentation should not be adapted from a journal article](https://www.nature.com/articles/d41586-020-03300-6)

### PMC 가이드 — 효과적 과학 발표 (2025)

| 항목 | 권장 사항 |
|------|-----------|
| 폰트 크기 | 본문 최소 40pt, 제목 60pt+ |
| 슬라이드 체류 시간 | 한 슬라이드를 2-3분 이상 띄워두지 말 것 |
| 데이터 공개 | 축부터 보여주고, 데이터 점진적 추가 |
| 멀티패널 피겨 | 논문의 멀티패널을 1패널/슬라이드로 분해 |
| 강조 | 밝은 박스, 아웃라인, 투명도 조절로 주의 유도 |
| 사과 금지 | "글씨가 작아서 죄송합니다" → 슬라이드를 수정할 것 |

- **출처**: [PMC - Effective Scientific Presentations Across Formats](https://pmc.ncbi.nlm.nih.gov/articles/PMC12826339/)

### 10가지 효과적 슬라이드 규칙 (PMC8638955)

1. **슬라이드당 하나의 아이디어**
2. **1분/1슬라이드**
3. **제목에 메시지를 담을 것** — "Results" (X) → "CTNND1 is central to metastasis" (O)
4. **말할 내용만 포함** — 설명 안 할 내용은 슬라이드에서 제거
5. **출처 표기** — 인용/크레딧 일관성 있게
6. **그래픽 효과적 활용** — 텍스트만 있는 슬라이드는 거의 없어야 함
7. **인지 과부하 방지** — 요소 6개 이하, 산세리프, 고대비
8. **산만한 청중을 고려한 설계** — 구두 설명 없이도 핵심 메시지 전달 가능해야
9. **반복 연습으로 개선**
10. **기술 장애 대비** — PDF 백업, 애니메이션 자제

- **출처**: [PMC - Ten Simple Rules for Effective Presentation Slides](https://pmc.ncbi.nlm.nih.gov/articles/PMC8638955/)

### 실행 규칙
1. **제목 = 핵심 메시지** ("SPA Workflow" → "Single Particle Analysis: 5 Steps from Grid to Map")
2. **논문 피겨를 그대로 사용 금지** — 축, 라벨을 발표 크기로 재제작
3. **멀티패널 피겨 분해** — 1패널/슬라이드로 설명 후 마지막에 전체 조합

---

## 4. 색상 설계

### 기본 원칙

| 원칙 | 상세 |
|------|------|
| 핵심 색상 2개 | 하나는 어두운 색, 하나는 밝은 색. 전체 발표의 시각적 기반 |
| 일관성 | 동일 그룹/범주는 전체 발표에서 동일 색상 |
| 적-녹 조합 금지 | 남성 8%가 적녹 색맹. 가장 흔한 색각 이상 |
| 회색조 테스트 | 색상 제거해도 구별 가능한지 확인 |
| 패턴 병행 | 색상만이 아닌 점선/실선, 모양 차이로 이중 인코딩 |

### 색맹 안전 팔레트

#### Okabe-Ito 팔레트 (Nature 권장, 범주형 데이터 표준)

| 색상 | Hex | 용도 |
|------|-----|------|
| Orange | `#E69F00` | 범주 1 |
| Sky Blue | `#56B4E9` | 범주 2 |
| Bluish Green | `#009E73` | 범주 3 |
| Yellow | `#F0E442` | 범주 4 (밝은 배경 주의) |
| Blue | `#0072B2` | 범주 5 |
| Vermillion | `#D55E00` | 범주 6 |
| Reddish Purple | `#CC79A7` | 범주 7 |
| Black | `#000000` | 범주 8 |

- **출처**: [ConceptViz - Okabe-Ito Palette](https://conceptviz.app/blog/scientific-color-palette-for-research-papers-and-posters)

#### 현미경 이미지 안전 조합

| 채널 수 | 권장 조합 |
|---------|-----------|
| 2색 | Green/Magenta, Yellow/Blue, Red/Cyan |
| 3색 | Magenta/Yellow/Cyan, Magenta/Green/Blue |
| 4색 | Magenta/Yellow/Green/Blue |

- **출처**: [NKI Netherlands Cancer Institute - Guidelines color blind friendly figures](https://www.nki.nl/about-us/responsible-research/guidelines-color-blind-friendly-figures)

#### 연속형/순차 데이터
- **Viridis 계열** (Viridis, Magma, Plasma, Inferno) — 지각적 균일성, 색맹 안전
- **출처**: [PMC - Choosing color palettes for scientific figures](https://pmc.ncbi.nlm.nih.gov/articles/PMC7040535/)

### 배경색: Dark vs Light

| 항목 | Dark Background | Light Background |
|------|-----------------|------------------|
| 현미경 이미지 | 저대비 이미지가 잘 보임. EM 이미지에 자연스러움 | 밝은 배경이 저대비 이미지를 삼킴 |
| 텍스트 가독성 | 두꺼운 폰트, 충분한 간격 필요 | 일반적으로 더 좋은 가독성 |
| 강의실 환경 | 어두운 방에서 눈 피로 감소 | 밝은 방에서 더 선명 |
| 인쇄 | 잉크 소비 큼, 인쇄에 부적합 | 인쇄 친화적 |
| Edward Tufte 의견 | "light type on dark slides are not easier to read" | 실제 환경에서 테스트 권장 |

**Tufte 핵심 조언**: "You should simply look at the various design solutions under real conditions to see what is going on, and not depend on verbal discussions such as this to decide!"

- **출처**: [Edward Tufte - Recommended Background for Projected Presentations](https://www.edwardtufte.com/notebook/recommended-background-for-projected-presentations/)

### Cryo-EM 튜토리얼 권장

- **이미지 영역**: 어두운 배경 (EM 이미지가 기본적으로 회색조, 어두운 배경에서 자연스러움)
- **텍스트/설명 영역**: 밝은 배경 또는 반투명 밝은 박스 (가독성 확보)
- **하이브리드 접근**: 이미지 패널은 dark, 설명 패널은 light — 또는 전체 dark 배경에 밝은 텍스트 + 충분한 대비

---

## 5. 타이포그래피

### 폰트 선택

| 용도 | 권장 폰트 | 비고 |
|------|-----------|------|
| 프레젠테이션 전반 | Arial, Helvetica, Calibri | 범용 산세리프. Nature가 Helvetica 권장 |
| 스크린 최적화 | Inter, Verdana | 화면 가독성 최적화 |
| 기술적 느낌 | IBM Plex Sans | 모던+기술적 |
| 과학 출판 호환 | TeX Gyre Heros | 학술 출판 표준 |
| **사용 금지** | Comic Sans, Papyrus, 장식체 | 비전문적 인상 |

- **출처**: [ConceptViz - Best Fonts for Scientific Posters](https://conceptviz.app/blog/best-fonts-for-scientific-posters-and-figures)

### 폰트 크기 가이드

| 요소 | 최소 크기 | 대형 강의실 |
|------|-----------|-------------|
| 슬라이드 제목 | 36-40pt | 44-60pt+ |
| 본문 텍스트 | 24pt | 28-40pt |
| 이미지 라벨 | 18pt | 24pt+ |
| 축 라벨/범례 | 18pt | 20pt+ |
| 출처/각주 | 14-16pt | 18pt |
| 슬라이드 번호 | 12-14pt | 16pt |

**검증 방법**: 인쇄물을 1.5-2m 거리에서 읽을 수 있는지 확인. 제목은 3m+ 거리에서.

- **출처**: [Autoppt - Minimum Font Size Best Practices](https://autoppt.com/blog/powerpoint-minimum-font-size-best-practices/)
- **출처**: [EPSC2021 - Scientific Presentation Guidelines](https://www.epsc2021.eu/guidelines/scientific_presentation_guidelines.html)

### 특수 문자 처리

| 문자 유형 | 예시 | 처리 방법 |
|-----------|------|-----------|
| 옹스트롬 | Å (U+00C5) | Unicode 직접 입력 또는 HTML `&#197;` |
| 그리스 문자 | α, β, μ | Unicode 직접 입력. Symbol 폰트 혼용 지양 |
| 단위 | kDa, nm, μm | 본문 폰트와 동일 폰트로 표기 |
| 윗첨자/아래첨자 | cm⁻¹, H₂O | HTML `<sup>`, `<sub>` 태그 사용 |
| 수식 | E = mc² | 간단한 것은 Unicode, 복잡한 것은 이미지로 |

### 실행 규칙
1. **폰트 1-2개만** 사용 (제목용 1개 + 본문용 1개)
2. **이탤릭, 밑줄, 전체 대문자 자제** — 가독성 저하
3. **모든 피겨에서 동일 폰트, 동일 크기** 유지 (Nature 가이드라인)
4. **특수 문자는 본문 폰트로 통일** — Symbol 폰트 전환 금지

---

## 6. 이미지 중심 슬라이드 디자인

### 이미지-텍스트 균형

| 원칙 | 상세 |
|------|------|
| 이미지 우선 | 슬라이드를 이미지 중심으로 구성. 텍스트는 보조 |
| 키워드만 | 짧은 구절로 핵심 메시지. 완전한 문장 금지 |
| 논문 피겨 재제작 | 논문의 축, 라벨이 발표에서는 너무 작음. 대형 버전 별도 제작 |
| 빈 공간 확보 | 패널 사이 충분한 여백으로 시각적 가이드 |

### Scale Bar 가이드라인

| 항목 | 규칙 |
|------|------|
| 필수 여부 | **모든 현미경 이미지에 필수** |
| 색상 | 고대비. 흰 배경 → 검정 바, 검정 배경 → 흰 바. **적/녹/청 금지** (이미지 일부로 오인) |
| 위치 | 하단 좌측 권장. 상단은 종/세포 유형 등 핵심 정보 공간 |
| 단위 | 간단하게: 100μm, 50μm, 10μm, 2μm. 비율 표기(17:4) 지양 |
| 작업 순서 | 최종 크기 조정 후에 추가 (리사이즈 시 왜곡 방지) |
| 두께 | 최종 출력/투사 크기에서 읽을 수 있는 두께 |

- **출처**: [Helena Jambor - How to: image scale information](https://helenajamborwrites.netlify.app/posts/image_how_scale/)
- **출처**: [focalplane.biologists.com - Guidelines for microscopy figures](https://focalplane.biologists.com/2021/05/25/preparing-your-manuscript-guidelines-for-writing-microscopy-methods-and-figures/)

### 어노테이션 (화살표, 라벨)

| 원칙 | 상세 |
|------|------|
| 이중 인코딩 | 색상 + 모양 (화살표 vs 별 vs 점선) 병행. 색맹 대비 |
| 최소한으로 | 너무 많은 어노테이션은 이미지를 가림. 균형 필요 |
| 어노테이션 vs 원본 | 필요시 원본 + 어노테이션 버전을 나란히 배치 |
| 범례 설명 | 사용한 모든 색상, 기호, 화살표를 설명 |
| Inset (확대) | 원본에서 확대 영역을 고대비 선으로 표시 |

- **출처**: [PMC - Creating clear and informative image-based figures](https://pmc.ncbi.nlm.nih.gov/articles/PMC8041175/)
- **출처**: [Bioimaging Guide - Presentation of microscopy images](https://www.bioimagingguide.org/04_Data_presentation/Presentation_images.html)

### 멀티패널 레이아웃

1. **읽기 방향**: 좌→우, 상→하 순서로 패널 배치
2. **패널 간 여백**: 충분한 여백으로 구분
3. **라벨링**: A, B, C... 패널 라벨은 좌상단, 크고 굵게
4. **일관된 크기**: 비교 패널은 동일 배율/크기
5. **발표에서는 분해**: 논문의 멀티패널을 1패널/슬라이드로 → 마지막에 전체 조합

### Before/After 비교 레이아웃

- **좌우 대칭 배치**: Before (좌) | After (우)
- **동일 크기/배율** 유지
- **색상 코딩**: 일관된 색상으로 각 상태 구분
- **라벨 명확히**: 각 패널에 직접 라벨 (범례만에 의존 금지)

---

## 7. 슬라이드 흐름과 내러티브

### 튜토리얼 구조 설계

| 기법 | 설명 | 적용 |
|------|------|------|
| **Progressive Disclosure** | 정보를 점진적으로 공개 | SPA 워크플로우를 1단계씩 빌드 |
| **Pre-training** | 핵심 용어를 먼저 정의 | 섹션 시작에 용어 정의 슬라이드 |
| **Home Slide** | 전체 구조를 보여주는 기준 슬라이드 | 섹션 전환마다 전체 워크플로우 맵으로 복귀, 현재 위치 강조 |
| **Segmenting** | 작은 단위로 분리 | 각 처리 단계 (CTF, Picking, 2D, 3D)를 독립 섹션으로 |
| **Recap Slides** | 핵심 요약 슬라이드 | 각 섹션 끝에 take-home message 요약 |

### 섹션 전환 기법

1. **Home Slide 복귀**: 전체 워크플로우 다이어그램으로 돌아와서 "다음 단계" 하이라이트
2. **연결 문구**: "이제 이미지를 얻었으니, 이 이미지에서 입자를 어떻게 찾는지 알아봅시다"
3. **시각적 전환**: 섹션별 다른 강조 색상 또는 아이콘
4. **진행 표시**: 슬라이드 상/하단에 현재 섹션 위치 표시

- **출처**: [PMC - Effective Scientific Presentations Across Formats](https://pmc.ncbi.nlm.nih.gov/articles/PMC12826339/)

### 데이터 Progressive Reveal 기법

1. **축 먼저** → 데이터 포인트 추가
2. **단순화된 버전 먼저** → 세부사항 추가
3. **질문 제시** → 답을 보여주는 데이터 공개
4. **개별 패널 순차 표시** → 전체 피겨 조합

### Summary Slide 디자인

- 핵심 포인트 3-5개를 명확한 섹션으로 구분
- 핵심 시각 자료(피겨 축소판) 포함
- 큰 폰트의 헤더로 각 영역 구분
- 연락처/참고 자료 포함 (청중이 촬영할 가능성 높음)

---

## 8. Cryo-EM 특수 고려사항

### CryoEM101.org 교육 패턴 분석

| 패턴 | 설명 |
|------|------|
| 계층적 네비게이션 | 사이드바에 8개 섹션 번호 매김, 스크롤 중 고정 |
| Progressive Complexity | 개요 → 특정 응용 → 실전 평가 순서 |
| 멀티미디어 통합 | 전략적 위치에 교육 비디오 삽입 |
| 인터랙티브 요소 | 포커스 조절 슬라이더로 실시간 효과 체험 |
| 비교 그리드 | "좋은 예" vs "나쁜 예"를 나란히 배치하여 직접 시각 비교 |
| 표 기반 데이터 | 복잡한 데이터를 구조화된 표로 정리 |

- **출처**: [CryoEM101.org - Chapter 1](https://cryoem101.org/chapter-1/)

### EM 이미지 특수 처리

1. **회색조 기본**: EM 이미지는 기본적으로 흑백. 전체 luminance 스펙트럼 활용
2. **대비 조정**: 브라이트니스/콘트라스트를 화면 표시에 최적화. 비선형 변환 시 명시
3. **채널 분리**: 다채널 이미지는 개별 채널(회색조) + 합성 이미지 모두 표시
4. **Magenta 대신 Red**: 색맹 안전을 위해 red 대신 magenta 사용
5. **원본 보존**: 조정은 복사본에서만. 원본 파일 보존 필수

### EMBO/EMBL 교육 과정 스타일

- 이론과 실습이 밀접하게 결합
- 단계별 프로토콜 형식
- 비디오 데모와 슬라이드 병행
- TU Delft: Jupyter 노트북으로 인터랙티브 이미지 처리 교육

- **출처**: [EMBO - Image processing for cryo-EM](https://meetings.embo.org/event/23-cryo-em-image-processing)
- **출처**: [TU Delft - Electron Nanoscopy Teaching](https://cryoem.tudelft.nl/teaching/)

---

## 종합: SPAguide 슬라이드 디자인 체크리스트

### A. 콘텐츠

- [ ] 한 슬라이드 = 하나의 핵심 아이디어
- [ ] 제목이 핵심 메시지를 담고 있는가
- [ ] 말할 내용만 슬라이드에 포함했는가
- [ ] 불필요한 장식 요소를 제거했는가
- [ ] 출처/크레딧이 표기되어 있는가

### B. 시각 디자인

- [ ] 요소 6개 이하인가
- [ ] 폰트 크기 최소 24pt (본문) / 36pt (제목)
- [ ] 산세리프 폰트 사용 (1-2종만)
- [ ] 색맹 안전 색상 조합
- [ ] 이미지-텍스트 통합 배치 (Split-Attention 방지)

### C. 이미지

- [ ] 모든 현미경 이미지에 scale bar 포함
- [ ] Scale bar 고대비, 하단 좌측
- [ ] 어노테이션 이중 인코딩 (색상 + 모양)
- [ ] 멀티패널은 읽기 순서(좌→우, 상→하)
- [ ] Inset의 원본 위치 표시

### D. 흐름

- [ ] 섹션 시작에 용어 정의 / Pre-training
- [ ] Home Slide로 전체 구조 상기
- [ ] Progressive Disclosure 적용
- [ ] 각 섹션 끝에 Recap/Summary
- [ ] 비교는 좌우 대칭 배치

### E. 색상

- [ ] 핵심 색상 2개 기반
- [ ] 적-녹 조합 없음
- [ ] 회색조에서도 구별 가능
- [ ] EM 이미지 영역은 어두운 배경 고려
- [ ] 전체 발표에서 일관된 색상 코딩

---

## 참고 자료 전체 목록

### 학습 이론
1. [Mayer's 12 Principles - Digital Learning Institute](https://www.digitallearninginstitute.com/blog/mayers-principles-multimedia-learning)
2. [Mayer's Principles - Educational Technology](https://educationaltechnology.net/mayers-principles-of-multimedia-learning/)
3. [Cognitive Load Theory - Chartered College](https://my.chartered.college/impact_article/using-cognitive-load-theory-to-improve-slideshow-presentations/)
4. [Cognitive Load - Seckington](https://www.seckington.com/the-art-of-slide-design-understanding-cognitive-load/)

### 과학 발표
5. [Nature - Presentations vs Journal Articles](https://www.nature.com/articles/d41586-020-03300-6)
6. [PMC - Ten Simple Rules for Effective Slides](https://pmc.ncbi.nlm.nih.gov/articles/PMC8638955/)
7. [PMC - Effective Scientific Presentations](https://pmc.ncbi.nlm.nih.gov/articles/PMC12826339/)

### 색상
8. [PMC - Choosing color palettes](https://pmc.ncbi.nlm.nih.gov/articles/PMC7040535/)
9. [NKI - Colorblind friendly figures](https://www.nki.nl/about-us/responsible-research/guidelines-color-blind-friendly-figures)
10. [Okabe-Ito Palette - ConceptViz](https://conceptviz.app/blog/scientific-color-palette-for-research-papers-and-posters)
11. [Edward Tufte - Background for Presentations](https://www.edwardtufte.com/notebook/recommended-background-for-projected-presentations/)
12. [David Math Logic - Coloring for Colorblindness](https://davidmathlogic.com/colorblind/)

### 이미지/피겨
13. [PMC - Image-based scientific figures](https://pmc.ncbi.nlm.nih.gov/articles/PMC8041175/)
14. [Bioimaging Guide - Presentation of microscopy images](https://www.bioimagingguide.org/04_Data_presentation/Presentation_images.html)
15. [Helena Jambor - Scale bar best practices](https://helenajamborwrites.netlify.app/posts/image_how_scale/)
16. [focalplane - Microscopy figures guidelines](https://focalplane.biologists.com/2021/05/25/preparing-your-manuscript-guidelines-for-writing-microscopy-methods-and-figures/)

### 타이포그래피
17. [ConceptViz - Fonts for Scientific Posters](https://conceptviz.app/blog/best-fonts-for-scientific-posters-and-figures)
18. [Autoppt - Font Size Best Practices](https://autoppt.com/blog/powerpoint-minimum-font-size-best-practices/)

### Cryo-EM 교육
19. [CryoEM101.org - Chapter 1](https://cryoem101.org/chapter-1/)
20. [Vanderbilt CSB - Cryo-EM Resources](https://www.vanderbilt.edu/csb/facilities/cryo-electron-microscopy/cryo-em-links-resources/)
21. [EMBO - Cryo-EM Image Processing Course](https://meetings.embo.org/event/23-cryo-em-image-processing)
22. [TU Delft - Electron Nanoscopy Teaching](https://cryoem.tudelft.nl/teaching/)
