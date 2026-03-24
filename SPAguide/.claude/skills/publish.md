---
name: publish
description: 전체 검증, 백업 생성, git commit, GitHub 배포
user_invocable: true
---

# /publish — 배포 스킬

## 실행 방법
- `/publish overview` — overview 섹션 배포
- `/publish all` — 전체 배포

## 실행 전 게이트

1. `presentation-spec.md` 읽기
2. 대상 섹션의 **모든 슬라이드**가 `status: complete`인지 확인
3. 하나라도 `complete`가 아니면 **거부** → 어떤 슬라이드가 미완료인지 보고

## 배포 프로세스

### 1. 전체 검증
- `check-slide-design.js` 전체 실행 (가능한 경우)
- 모든 DOI 링크 일괄 확인 (HTML에서 href 추출 → 존재 확인)
- 모든 이미지 src 경로가 실제 파일로 존재하는지 확인
- 이미지 중복 사용 체크 (같은 파일이 여러 슬라이드에 사용되지 않는지)
- 슬라이드 번호 연속성 확인 (data-n="1" ~ data-n="N")
- 네비게이션 정상 동작 확인 (N 변수, prev/next 버튼)

### 2. 백업 생성
```bash
cp overview.html overview_backup_$(date +%Y%m%d_%H%M%S).html
```

### 3. Git 커밋
```bash
git add overview.html presentation-spec.md
git commit -m "publish: {섹션} slides {범위} - {변경 요약}"
```

### 4. GitHub 푸시 (사용자 확인 후)
- 푸시 전 사용자에게 확인 요청
- `git push origin main`

### 5. 상태 업데이트
- `presentation-spec.md` 대상 슬라이드 status → `published`

## 출력
```markdown
# Publish Report

## 검증 결과
- DOI 링크: {N}/{total} 정상
- 이미지 파일: {N}/{total} 존재
- 이미지 중복: 없음 / {목록}
- 슬라이드 번호: 1~{N} 연속

## 배포
- 백업: overview_backup_{timestamp}.html
- 커밋: {hash}
- 푸시: 완료 / 대기
```
