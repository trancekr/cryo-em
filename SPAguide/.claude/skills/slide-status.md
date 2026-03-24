---
name: slide-status
description: 전체 슬라이드 진행 현황 대시보드 출력
user_invocable: true
---

# /slide-status — 진행 현황

## 실행 방법
- `/slide-status` — 전체 현황
- `/slide-status overview` — overview 섹션만

## 실행 순서

1. `presentation-spec.md` 읽기
2. 각 슬라이드의 status 집계
3. 테이블 출력

## 출력 형식

```
섹션        | 슬라이드  | planned | research | writing | review | complete | published
------------|----------|---------|----------|---------|--------|----------|----------
overview    | 1-23     | 0       | 0        | 2       | 3      | 18       | 0
sample-prep | 24-50    | 27      | 0        | 0       | 0      | 0        | 0
imaging     | 51-62    | 12      | 0        | 0       | 0      | 0        | 0
processing  | 63-85    | 23      | 0        | 0       | 0      | 0        | 0

레퍼런스 현황:
- 검증 완료: {N}/{total}
- 미검증: {N}
- 내용 불일치: {N}

알려진 이슈: {N}건
```

## 추가 정보
- `verified: false`인 레퍼런스가 있는 슬라이드 목록
- `known-issues`가 있는 슬라이드 목록
- `design-locked-values`가 설정된 슬라이드 목록
