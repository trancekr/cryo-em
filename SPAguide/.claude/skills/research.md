---
name: research
description: 슬라이드 레퍼런스 DOI 검증, 웹 리소스 조사, 논문/사이트 내용과 슬라이드 매치 확인, 관련 자료 검색
user_invocable: true
---

# /research — 레퍼런스 검증 + 웹 리소스 조사 스킬

## 실행 방법
- `/research 3` — 슬라이드 3의 레퍼런스 검증 + 관련 웹 리소스 조사
- `/research all` — 전체 슬라이드 검증
- `/research section:overview` — overview 섹션 전체 검증
- `/research topic:vitrification` — 특정 주제 관련 자료 검색 (새 슬라이드 준비용)

## 실행 순서

### 1. 파일 읽기
- `presentation-spec.md` 읽기 → 대상 슬라이드의 references 확인
- `overview.html` 읽기 → 해당 슬라이드의 실제 HTML 내용 확인

### 2. DOI 레퍼런스 검증
각 DOI에 대해:

**a) DOI 존재 확인**
- PubMed `search_articles` 또는 `get_article_metadata`로 검색
- 또는 `WebFetch`로 `https://doi.org/{DOI}` 접근하여 리다이렉트 확인
- DOI가 실존하는 논문으로 연결되는지 확인

**b) 메타데이터 매치**
- 논문 제목, 저자, 저널, 연도가 slide-ref 텍스트와 일치하는지 대조
- 불일치 항목 기록 (예: 저널명 틀림, 연도 다름)

**c) 내용 매치**
- 논문 abstract/title을 읽고 슬라이드 내용과 관련성 확인
- 슬라이드가 논문에서 주장하지 않는 내용을 표시하고 있지 않은지 체크
- 특히: 수치 데이터, Nobel Prize 귀속, 방법론 설명의 정확성

### 3. 웹 리소스 조사
슬라이드 내용과 관련된 교육/소프트웨어 사이트 조사:

**주요 cryo-EM 리소스 (우선 확인)**:
- https://cryoem101.org — cryo-EM 교육 자료
- https://guide.cryosparc.com — CryoSPARC 공식 가이드
- https://relion.readthedocs.io — RELION 문서
- https://cryosparc.com/docs — CryoSPARC 문서
- https://www.rcsb.org — PDB 데이터베이스
- https://www.ebi.ac.uk/emdb — EMDB
- https://myscope.training — MyScope 교육 사이트
- https://www.coursera.org/learn/cryo-em — Cryo-EM Coursera 강좌

**조사 항목**:
- 슬라이드 주제에 대해 위 사이트들에서 관련 콘텐츠가 있는지 확인
- 슬라이드의 설명/수치가 이 사이트들의 정보와 일치하는지 대조
- 새 슬라이드 작성 시 참고할 수 있는 추가 자료/이미지/다이어그램 존재 여부
- 각 사이트의 라이선스/인용 조건 확인

**웹 리소스 검증 방법**:
- `WebFetch`로 해당 페이지 내용 확인
- `WebSearch`로 "cryo-EM {슬라이드주제} tutorial" 검색
- 찾은 자료의 URL, 내용 요약, 슬라이드와의 관련성 기록

### 4. 결과 출력
`research-reports/research-report-s{N}.md` 파일 생성:

```markdown
# Research Report: Slide {N}

## 슬라이드 제목: {title}

### Reference 1: {author}, {journal} ({year})
- DOI: {doi}
- **존재 확인**: ✅ 실존 / ❌ 미존재
- **저자 매치**: ✅ / ❌ (실제: {actual_authors})
- **저널 매치**: ✅ / ❌ (실제: {actual_journal})
- **연도 매치**: ✅ / ❌ (실제: {actual_year})
- **내용 매치**: ✅ / ⚠️ 부분 / ❌ 불일치
- **논문 제목**: {actual_title}
- **비고**: {notes}

### 웹 리소스
| 사이트 | URL | 관련 내용 | 슬라이드 활용 |
|--------|-----|-----------|--------------|
| {name} | {url} | {summary} | {how to use} |

### 종합
- DOI 검증 통과: {N}/{total}
- 웹 리소스: {N}건 확인
- 🔴 필수 수정: {list}
- 🟡 권장 수정: {list}
```

### 5. presentation-spec.md 업데이트
- 각 reference의 `verified`, `content-match` 필드 업데이트
- 슬라이드 상태를 `research` → `writing`으로 변경 (모두 통과 시)

## 절대 금지
- DOI를 찾을 수 없을 때 비슷한 DOI를 추측하여 대체하기
- 논문 내용을 읽지 않고 "content-match: true" 표시
- PubMed/doi.org 검증 없이 "verified: true" 표시
