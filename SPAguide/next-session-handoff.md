# 다음 세션 핸드오프 문서

> 생성: 2026-03-25
> 목적: 새 세션에서 이전 작업을 빠르게 이해하고 이어서 진행하기 위한 종합 정리

---

## 📂 참조해야 할 MD 파일 목록 (우선순위 순)

### 필수 읽기
| 파일 | 위치 | 내용 |
|------|------|------|
| `CLAUDE.md` | `SPAguide/CLAUDE.md` | 프로젝트 규칙, 절대 금지 사항, 워크플로우 |
| `v2-design-work-summary.md` | `SPAguide/` | Section 1 디자인 상태, 커스텀 작업 내역, TODO |
| `section2-work-summary.md` | `SPAguide/` | Section 2 초안 상태, 레퍼런스, TODO |
| `design-principles.md` | `SPAguide/` | 디자인 원칙 10개 섹션 |

### 디자인 레퍼런스
| 파일 | 위치 | 내용 |
|------|------|------|
| `slide-design-reference.md` | `SPAguide/` | CSS/레이아웃 레퍼런스 (22개 소스, 11개 토픽) |
| `research-design-principles.md` | `SPAguide/` | 교육/과학 슬라이드 디자인 (Mayer 이론, EM 이미지 처리) |

### 스킬 파일 (5개)
| 파일 | 위치 | 내용 |
|------|------|------|
| `research.md` | `SPAguide/.claude/skills/` | DOI 검증 + 웹 리소스 조사 스킬 |
| `write.md` | `SPAguide/.claude/skills/` | 슬라이드 생성/수정 스킬 (콘텐츠 분석 5단계 포함) |
| `review.md` | `SPAguide/.claude/skills/` | 4관점 리뷰 스킬 |
| `publish.md` | `SPAguide/.claude/skills/` | 배포 스킬 |
| `slide-status.md` | `SPAguide/.claude/skills/` | 진행 현황 대시보드 |

### 워크로그 (세션 이력)
| 파일 | 위치 | 내용 |
|------|------|------|
| `worklog-cryo-em.md` | `.claude/projects/.../memory/` | 세션 12-13 상세 로그 |
| `worklog-cryo-em-archive.md` | `.claude/projects/.../memory/` | 세션 1-11 아카이브 |

### 리서치 리포트
| 파일 | 위치 | 내용 |
|------|------|------|
| `research-section2-references.md` | `SPAguide/research-reports/` | Section 2 검증 레퍼런스 24개 |
| `section2-comparison-report.md` | `SPAguide/research-reports/` | 원본 vs 새 버전 29장 대조 |
| `research-report-all-doi-verification.md` | `SPAguide/research-reports/` | Section 1 DOI 검증 |

---

## 🎯 스킬 요약

### /research — 레퍼런스 검증
- PubMed/doi.org로 DOI 실존 확인
- 논문 메타데이터 (저자/저널/연도) 대조
- 논문 내용과 슬라이드 내용 매치 확인
- 웹 리소스 조사 (cryoem101, CryoSPARC, RELION 등)

### /write — 슬라이드 생성/수정
- **콘텐츠 분석 5단계** (세션 14에서 추가):
  1. 핵심 메시지 파악
  2. 콘텐츠 유형 분류 (비교/타임라인/쇼케이스/프로필/프로세스/데이터/개념/구조/문제해결)
  3. 템플릿 매칭 (Brandlogy 또는 새로 생성)
  4. 시각적 우선순위 결정 (이미지 주도/텍스트 주도/균등/데이터)
  5. 레이아웃 스케치 → 사용자 승인 후 구현
- 레퍼런스 게이트: 검증 안 된 레퍼런스 있으면 거부
- design-locked-values 변경 금지

### /review — 4관점 리뷰
- 레퍼런스 정확성
- 디자인 원칙 준수
- CSS 일관성
- 콘텐츠 정확성

### /publish — 배포
- 전체 검증 + 백업 + git push

### /slide-status — 진행 현황
- 슬라이드별 상태 대시보드

---

## 📊 전체 프로젝트 현황

### Section 1: Cryo-EM Overview (23 slides)
- **overview.html** (V2): 23장 완성, 슬라이드 1-4 디자인 리뷰 완료, 5-23 기본 배치만
- **brandlogy-section1.html**: Brandlogy 프레임워크 적용 버전 (v2), 다양한 레이아웃
- **상태**: V2 콘텐츠(애니메이션, 화살표, 이미지) + Brandlogy 레이아웃 통합 필요

### Section 2: Sample Preparation (29 slides)
- **sample-prep-new.html**: 초안 (1920x1080 CSS, 29장)
- **상태**: 디자인 대충 잡음. 디테일/콘텐츠 전면 수정 필요
- 레퍼런스 24개 검증 완료
- 슬라이드 1-2만 상세 검토, 3-29 미검토

### Section 3: Imaging — 미착수
### Section 4: Data Processing — 미착수

---

## ⚠️ 핵심 규칙 (반복 실수 방지)

1. **V2 콘텐츠를 버리지 말 것** — 디자인 변경 시 기존 애니메이션, 화살표, 이미지 배치 보존
2. **에디터 출력 그대로 적용** — 선별 적용, 단위 변환 금지
3. **검증 없이 레퍼런스 추가 금지** — DOI 확인 필수
4. **같은 유형 콘텐츠 = 같은 레이아웃** — 폰트/크기/간격 일관성
5. **콘텐츠에 맞는 레이아웃 선택** — 카드 박스에 우겨넣기 금지
6. **수정 시 디자인 원칙 레퍼런스 함께 알려줄 것** — 사용자 요청
7. **시킨 작업을 하라** — 하겠다고 하고 안 하기 금지

---

## 🔧 기술 환경

| 항목 | 값 |
|------|-----|
| 뷰포트 | 1920×1080 고정 + CSS zoom |
| 프리뷰 | localhost:8502, cwd: coding/ |
| 크롬 뷰포트 | resize_window(1920, 1253) → 실제 1080 |
| 에디터 | editor.js (E키 토글), flex/absolute 분기 |
| GitHub | https://github.com/trancekr/cryo-em |
| GitHub Pages | https://trancekr.github.io/cryo-em/SPAguide/ |

---

## 다음 세션 작업 순서 (제안)

1. **V2 + Brandlogy 통합** — overview.html의 콘텐츠를 Brandlogy 경계 시스템에 맞추되, 기존 커스텀 작업 모두 보존
2. **Section 1 슬라이드 5-23 디자인 리뷰** — 하나씩 검토, 빈 공간/폰트/간격 통일
3. **Section 2 콘텐츠 수정** — 29장 전체 검토, 원본 대조, 검증 안 된 텍스트 수정
4. **Section 3, 4 착수**
