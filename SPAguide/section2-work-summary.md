# Section 2: Sample Preparation — V2 작업 요약 (초안 단계)

> 생성: 2026-03-25
> 상태: **초안** — 디자인만 대충 잡음. 디테일/콘텐츠 전면 수정 필요

---

## 파일 목록

| 파일 | 내용 | 상태 |
|------|------|------|
| `sample-prep.html` | 원본 (구버전 CSS, 29 slides) | 참조용 |
| `sample-prep-new.html` | 새 버전 (1920x1080, 29 slides, 1184줄) | 초안 |
| `research-reports/research-section2-references.md` | 검증된 레퍼런스 24개 (12 토픽, PubMed DOI 확인) | 완료 |
| `research-reports/section2-comparison-report.md` | 원본 vs 새 버전 전 29장 대조 리포트 | 완료 |

---

## 완료된 작업

### 1. 레퍼런스 조사 (research 스킬)
- 12개 토픽에 걸쳐 24개 DOI를 PubMed에서 검증
- 주요 레퍼런스:
  - Dubochet 1988 (vitrification 원조, PMID 3043536)
  - Henderson 1995 (size limit, PMID 7568675)
  - Weissenberger 2021 (sample prep 종합 리뷰)
  - Glaeser 2018 (AWI 문제)
  - Noble 2018 (spot-to-plunge)
  - Russo & Passmore 2016 (gold grids)
  - Henderikx 2024 (VitroJet)

### 2. 원본 vs 새 버전 비교 리포트
- 29장 전체 대조 완료
- 주요 변경사항:
  - CSS: 100vh → 1920x1080 고정 + zoom
  - 레이아웃: text-block+img-grid → topic-card, info-panel, cap-grid 등
  - 섹션 색상: green (#059669)
  - 레퍼런스: 텍스트 → DOI 하이퍼링크
  - 불렛/설명: 대부분 신규 작성 (원본에 없던 내용)

### 3. 슬라이드 제목 검토
- 29장 중 15장 제목 변경됨
- 수정 결정: 슬라이드 8 ("Structural Chaperones" → "Approaches"), 슬라이드 21 ("Common Problems (1)" → 원본 유지) — 2건 원본으로 복원

### 4. 영문 문법 체크
- 29장 전체 확인, 4건 수정 필요:
  - 슬라이드 4: "Polydispersity index < 20% ideal" → "is ideal"
  - 슬라이드 17: "Make 3× grids" → "Prepare 3 replicates"
  - 슬라이드 21: subtitle 제목 중복
  - 슬라이드 29: "high salt" → "high salt concentration"
- 슬라이드 4, 21만 수정 결정 (17, 29는 유지)

### 5. 슬라이드 1-2 상세 검토
- **슬라이드 1 (표지):**
  - "the most critical step in cryo-EM" 서브타이틀 삭제 결정
  - 레퍼런스 삭제 (표지에 불필요)
  - 배경 이미지 — Section 1 배경 임시 사용, 추후 교체
- **슬라이드 2 (Goal):**
  - "Leading to highest resolution structure with least data" 복원 결정
  - 서브타이틀 → Bottom Line으로 이동 검토 → 사용자 선호 아님, 삭제
  - 카드 수직 중앙 정렬 (justify-content:center)
  - 빈 공간 처리: 다른 슬라이드 디자인 참고하여 균형 맞추기

---

## 미완료 작업

### 콘텐츠 검증
- [ ] 슬라이드 3-29 상세 검토 (1-2만 완료)
- [ ] 신규 작성 텍스트 (불렛, 설명)가 논문 내용과 일치하는지 검증
- [ ] 이미지가 해당 슬라이드에 맞는 이미지인지 확인
- [ ] 삭제된 원본 콘텐츠 중 복원 필요한 항목 확인

### 레퍼런스
- [ ] sample-prep-new.html 내 가짜/미검증 레퍼런스 전수 확인 및 교체
- [ ] Zhou 2019 (DOI 404) 삭제 완료 필요
- [ ] 슬라이드 15 습도값 불일치 확인 (원본 "<20%" vs 새 버전 ">90%")

### 디자인
- [ ] 전체 29장 레이아웃 일관성 검토
- [ ] 1920x1080 뷰포트에서 전 슬라이드 확인
- [ ] 해상도 축소 시 깨지는 슬라이드 확인/수정

### 문법 수정
- [ ] 슬라이드 4: "is ideal" 추가
- [ ] 슬라이드 21: subtitle 중복 수정

---

## 주요 결정사항

1. 슬라이드 5 제목: "Negative Staining vs. Vitrification" 유지 (그리드 위 샘플 상태 관점)
2. 표지(슬라이드 1)에 레퍼런스 불필요
3. Bottom Line 스타일: 사용자 비선호 → 사용 지양
4. 디자인 수정 시 적용한 원칙 레퍼런스를 함께 알려줄 것 (사용자 요청)
5. 원본 PPT 텍스트로 되돌릴지 vs 대조 수정할지 → 슬라이드별 개별 판단
