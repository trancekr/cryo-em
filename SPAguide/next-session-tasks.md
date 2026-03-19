# 다음 세션 작업 목록 (2026-03-18 기준)

> 이전 세션에서 미해결된 이슈들. 우선순위 순서대로 처리.

---

## 1. 이미지 크롭 문제 (최우선)

### 방법: 모든 이미지에 대해 backup_originals/ 원본과 현재 파일 크기 비교 먼저 수행

### 1-1. s011_19 (Böttcher 1997)
- **상태**: 원본(1824×923) 복원 완료. sharp 재생성 완료.
- **문제**: 패널 a/b 분할을 mid=w//2(=912px)로 단순 반분할 — 실제 경계 확인 안 함
- **할 일**: 원본 이미지에서 shell(panel a)과 colored close-up(panel b) 경계를 정확히 찾아서 재크롭
- **참고**: Böttcher et al., Nature 386 (1997) — Figure 1

### 1-2. s011_22 (2012 DED motion correction)
- **상태**: 사용자가 "너무 많이 잘랐다" 반복 지적. 미해결.
- **할 일**: `backup_originals/s011_22.png` vs `s011_22.png` 크기 비교 → 원본 복원 필요 시 복원 + sharp 재생성
- **참고**: Li et al., Nat Methods (2013) — panels A/B

### 1-3. s011_20 (1998 ML refinement)
- **상태**: 사용자가 논문 PDF 제공하며 원본과 비교하라고 함. 미수행.
- **할 일**: Sigworth 1998 Figure 4 (논문 p.335) vs s011_20_sharp.png 비교 → 크롭 누락 부분 확인
- **논문 PDF**: `~/Downloads/1-s2.0-S104784779894014X-main (1).pdf`

### 1-4. s011_27 (Conway 1997)
- **상태**: stereo pair (4장) 이미지 사용 중. 단일 뷰(s011_27_b_single.png)로 변경 시도 → 사용자 "더 나빠졌다"
- **할 일**: 사용자와 상의하여 다른 접근법 결정 (원본 유지? 다른 크롭?)

---

## 2. 슬라이드 10 구조 변경

### 현재: 2012 / 2013 / 2015 (3컬럼)
### 목표: 2012 / 2013(1) / 2013(2) (3컬럼) + **새 슬라이드**: 2015(1) / 2015(2)

- 원본 강의 자료에서 2013이 2개, 2015도 2개
- 2013(1) = Li et al. (DED + motion correction) — 현재 2012로 표시된 것이 사실 2013 논문
- 2013(2) = Liao et al. (TRPV1 3.4 Å) — 현재 2013
- 2015(1) = Bai et al. (γ-secretase) — 현재 2015
- 2015(2) = ? (원본 자료에서 확인 필요)
- 현재 슬라이드 11 (Landmark Papers) 이후 번호 밀림 주의

---

## 3. 슬라이드 9-10 디자인 원칙 위반 수정

### §4 content-card ↔ img-card 중복
| 카드 | 중복 내용 |
|------|----------|
| 2012 | "electron counting + movie-mode" 위아래 반복 |
| 2013 Bai | "~30,000 particles" 위아래 반복 |
| 2013 TRPV1 | "~300 kDa, C4 symmetry" 위아래 반복 |

### §4 이미지 설명 = 단순 묘사 → 의미 연결 필요
- "A: Before correction — particles blurred" → 보면 아는 내용
- img-card는 그 이미지가 **왜 중요한지** 설명해야 함

---

## 4. 참고 자료

### 논문 PDF (Downloads/)
- `386088a0 (1).pdf` — Böttcher et al., Nature 386 (1997)
- `386091a0 (1).pdf` — Conway et al., Nature 386 (1997)
- `1-s2.0-S104784779894014X-main (1).pdf` — Sigworth, J Struct Biol 122 (1998)

### 디자인 원칙
- `coding/cryo-em/v3/design-principles.md`

### 슬라이드 레이아웃 사양
- history-grid: `position:absolute;left:24px;top:122px;width:1856px;height:957px`
- 3열: left:48px / 643px / 1237px, width:571px
- 슬라이드 9 (no citation): content-card height:195px, img-card top:225px height:682px
- 슬라이드 10 (with citation): content-card height:233px, img-card top:260px height:647px

---

## 5. 이후 작업
- 슬라이드 11-25 디자인 리뷰
- 섹션 2-4 제작
