---
name: write
description: 검증된 레퍼런스 기반으로 HTML/CSS 슬라이드 생성 또는 수정. design-principles.md 준수 필수.
user_invocable: true
---

# /write — 슬라이드 생성/수정 스킬

## 실행 방법
- `/write 24` — 슬라이드 24 신규 생성
- `/write 23 fix` — 슬라이드 23 수정

## 실행 전 필수 확인 (게이트)

### 레퍼런스 게이트
1. `presentation-spec.md`에서 대상 슬라이드의 references 확인
2. `verified: false`인 레퍼런스가 하나라도 있으면 **거부**
3. 거부 시 메시지: "슬라이드 {N}의 레퍼런스가 검증되지 않았습니다. `/research {N}`을 먼저 실행하세요."

### 디자인 원칙 로드
1. `design-principles.md` 읽기 (10개 섹션)
2. `slide-design-reference.md` 읽기 (CSS 패턴)
3. `next-session-tasks.md` 읽기 (반복 실수 확인)

## 슬라이드 작성 규칙

### HTML 구조
- 기존 `overview.html`의 `<div class="slide" data-n="N">` 패턴 사용
- 기존 CSS 클래스 활용: `slide-title`, `slide-subtitle`, `slide-body`, `slide-ref`
- 레이아웃별 클래스: `history-card`, `topic-card`, `layout-two-cards`, `info-panel` 등
- 새 인라인 스타일로 기존 클래스 기능 재구현 금지

### 레퍼런스 표기
- `presentation-spec.md`에 등록된 레퍼런스만 사용
- DOI 하이퍼링크 형식: `<a href="https://doi.org/{DOI}" target="_blank" style="color:inherit">{저자}, {저널} ({연도})</a>`
- 등록되지 않은 레퍼런스를 임의로 추가 금지

### 이미지
- `presentation-spec.md`의 `images` 섹션에 등록된 이미지만 사용
- `used-on` 필드 확인하여 다른 슬라이드에서 이미 사용 중인 이미지 재사용 금지
- 이미지 경로: `../cryo-slides-img/{filename}`

### design-locked-values
- `presentation-spec.md`의 `design-locked-values` 확인
- 해당 CSS 속성은 **절대 변경 금지**
- 사용자가 에디터로 설정한 값임

## 작성 후 체크리스트
1. `check-slide-design.js` 실행 (가능한 경우)
2. 슬라이드 N 전후 슬라이드와의 톤/스타일 일관성 확인
3. `presentation-spec.md` 상태를 `writing` → `review`로 업데이트
4. 변경 내용을 사용자에게 요약 보고

## 에디터 출력 적용 시
1. 사용자가 붙여넣은 에디터 CSS를 **전부** 적용
2. 선별 적용 금지
3. flex 자식의 `position:absolute`는 제외 (에디터 ensureAbsolute 버그)
4. width/height만 있고 position이 없는 변경은 그대로 적용
5. 적용한 값을 `design-locked-values`에 기록
