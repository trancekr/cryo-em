# Cryo-EM HK Wiki: 로컬 질문 답변 규칙

이 폴더(`~/ByeoriWiki-local`)에서 Claude Code는 연구실 위키를 근거로 질문에 답한다. `hk` → 5 → a 가
이 파일을 매번 새로 복사해 둔다(직접 고친 내용은 덮어써진다; 고치려면 `~/cryo-em/byeori/local_qa/CLAUDE.md`).

## 근거: 위키 사본 `~/ByeoriWiki` (읽기만)

| 폴더 | 내용 |
|---|---|
| `sources/<stem>.md` | 논문 노트(논문당 하나). 앞부분 front matter에 title, journal, year, doi. 본문: One-line Summary, Key Contributions, Methodology, Results, Limitations, Glossary |
| `concepts/<slug>.md` | 개념 페이지 (여러 논문을 묶은 요약) |
| `overviews/<분야>/index.md`, `overviews/<분야>/<소주제>.md` | 분야 개요와 소주제 페이지 |
| `questions/*.md` | Byeori로 했던 질문과 답 |

`redirect:`가 있는 페이지는 옮겨진 빈 페이지다. 근거로 쓰지 않는다.

## 찾는 순서

1. 관련 분야의 `overviews/<분야>/index.md`와 소주제 페이지에서 어떤 논문이 관련 있는지 본다.
2. 질문의 핵심어(도구 이름, 단백질, 지표, 수치 단위 kDa·Å 등)를 `sources/`에서 Grep으로 찾는다. 동의어·약어도 함께.
3. 후보 노트는 **본문을 직접 읽는다.** 개요·개념 페이지의 요약만으로 수치를 인용하지 않는다.
4. 근거가 부족하면 "위키에 없다"고 말한다. 위키 밖 지식으로 메운 부분은 그렇다고 표시한다.

## 답변 형식

- 질문한 언어로 답한다(한국어 질문이면 한국어, 기술 용어는 영어 그대로).
- 수치·결론마다 출처를 위키 링크로: `[[sources/<stem>]]`. 개요·개념을 인용할 때는 `[[overviews/...]]`, `[[concepts/...]]`.
- 논문 사이에 결과가 다르면 나란히 적고, 조건(시료 질량·대칭·장비·처리법)이 어떻게 다른지 밝힌다.
- 마지막에 "위키가 답하지 못하는 것" 몇 줄.

## 저장

답을 화면에 보여 준 뒤 `questions/<YYYY-MM-DD>-<짧은-영문-슬러그>.md`로 저장한다. 같은 이름이 있으면 `-2`를 붙인다.

```markdown
---
title: "질문 원문 (한 줄)"
kind: "local-question"
date: "YYYY-MM-DD"
---

## Question
질문 원문

## Answer
(화면에 보인 답 그대로, 링크 포함)
```

이어지는 추가 질문은 같은 파일 아래에 `## Follow-up: <질문>` 절로 덧붙인다.
`~/ByeoriWiki`와 AWS는 고치지 않는다. 비용이 드는 명령(`uv run byeori aws-...`)은 실행하지 않는다.
