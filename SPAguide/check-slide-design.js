#!/usr/bin/env node
/**
 * Slide Design Validator
 * 슬라이드 HTML을 14개 디자인 원칙에 대해 검증합니다.
 *
 * Usage: node check-slide-design.js <slide-number>
 *   예: node check-slide-design.js 4
 */

const fs = require('fs');
const path = require('path');

const htmlFile = path.join(__dirname, 'overview.html');
const slideNum = parseInt(process.argv[2]) || 0;

if (!slideNum) {
  console.error('Usage: node check-slide-design.js <slide-number>');
  process.exit(1);
}

const html = fs.readFileSync(htmlFile, 'utf-8');

// Extract specific slide
const slideRegex = new RegExp(`<div class="slide" data-n="${slideNum}">[\\s\\S]*?(?=<div class="slide" data-n="|$)`, 'g');
const match = html.match(slideRegex);
if (!match) {
  console.error(`Slide ${slideNum} not found`);
  process.exit(1);
}
const slideHtml = match[0];

let violations = [];
let warnings = [];
let passed = [];

// ============================================================
// RULE 1: 박스를 가득 채우지 마라 — fr 단위 + flexbox 자동 채움 감지
// ============================================================
const frMatches = slideHtml.match(/grid-template-columns\s*:\s*[^;"]*\d+fr/g);
if (frMatches) {
  violations.push({
    rule: 1,
    name: '박스 가득 채움 금지 (Grid fr)',
    detail: `grid-template-columns에 fr 단위 사용 감지: ${frMatches.join(', ')}`,
    fix: 'fr 대신 auto, max-content, fit-content(), 또는 고정값(px/%) 사용'
  });
} else {
  passed.push({ rule: 1, name: '박스 가득 채움 금지 — fr 단위 없음 ✓' });
}

// RULE 1b: flexbox에서 자식이 남은 공간 자동 채움하는 패턴 감지
// flex child가 flex-grow:0 없이 텍스트 콘텐츠를 담고 있으면 자동으로 늘어남
const hasFlexParent = slideHtml.match(/display\s*:\s*flex[^;"]*(?!column)/g); // row direction flex
const flexChildren = slideHtml.match(/flex-shrink\s*:\s*1/g);
const hasFlexGrow0 = slideHtml.match(/flex-grow\s*:\s*0/g);
const hasFlexNone = slideHtml.match(/flex\s*:\s*(0\s|none)/g);
if (hasFlexParent && flexChildren && !hasFlexGrow0 && !hasFlexNone) {
  violations.push({
    rule: '1b',
    name: '박스 가득 채움 금지 (Flexbox)',
    detail: 'flex-shrink:1이 있지만 flex-grow:0이 없음 — flex child가 남은 공간을 자동으로 채움',
    fix: 'flex:0 1 auto 또는 flex-grow:0 추가, 또는 max-width 제한'
  });
}

// RULE 1c: 텍스트 컨테이너에 너비 제한 없음
const flexDivs = slideHtml.match(/<div[^>]*style="[^"]*display\s*:\s*flex[^"]*flex-direction\s*:\s*column[^"]*">/g) || [];
const hasMaxWidth = slideHtml.match(/max-width\s*:/g);
// slide-body 직접 자식 중 flex row 컨테이너의 자식들 체크
if (flexDivs.length > 0 && !frMatches) {
  // flex column 컨테이너가 있는데 부모가 flex row이고 max-width가 없으면
  const flexRowContainers = slideHtml.match(/display\s*:\s*flex[^;"]*;(?![^"]*flex-direction)/g);
  if (flexRowContainers && !hasMaxWidth) {
    warnings.push({
      rule: '1c',
      name: '텍스트 컨테이너 너비 무제한',
      detail: 'flex row 내 텍스트 컨테이너에 max-width 없음 — 가로로 과도하게 늘어날 수 있음',
      fix: 'max-width: clamp(Xpx, Yvw, Zpx) 추가'
    });
  }
}

// ============================================================
// RULE 2: 빈 공간 과도 방지 — 콘텐츠 양 체크
// ============================================================
const listItems = (slideHtml.match(/<li/g) || []).length;
const paragraphs = (slideHtml.match(/<p[ >]/g) || []).length;
const images = (slideHtml.match(/<img/g) || []).length;
const totalContent = listItems + paragraphs + images;
if (totalContent < 5) {
  warnings.push({
    rule: 2,
    name: '빈 공간 과도 가능성',
    detail: `콘텐츠 요소 ${totalContent}개 (li:${listItems}, p:${paragraphs}, img:${images}) — 슬라이드가 비어보일 수 있음`,
    fix: '중요한 내용 추가, 이미지 추가, 또는 레이아웃 축소'
  });
} else {
  passed.push({ rule: 2, name: `콘텐츠 양 적절 (${totalContent}개 요소) ✓` });
}

// ============================================================
// RULE 3: 이미지에 flex:1 사용 금지
// ============================================================
const imgFlexMatch = slideHtml.match(/<img[^>]*style="[^"]*flex\s*:\s*1/g);
if (imgFlexMatch) {
  violations.push({
    rule: 3,
    name: '이미지 flex:1 금지',
    detail: 'img 태그에 flex:1 사용 — 이미지가 컨테이너 전체를 채우려고 확장됨',
    fix: 'flex:1 제거, max-height/max-width로 제한'
  });
} else {
  passed.push({ rule: 3, name: '이미지 flex:1 없음 ✓' });
}

// ============================================================
// RULE 4: align-items: stretch 단독 사용 주의
// ============================================================
const stretchMatch = slideHtml.match(/align-items\s*:\s*stretch/g);
const alignContentCenter = slideHtml.match(/align-content\s*:\s*center/g);
if (stretchMatch && !alignContentCenter) {
  warnings.push({
    rule: 4,
    name: 'stretch 단독 사용 주의',
    detail: 'align-items:stretch가 align-content:center 없이 사용 — 박스가 전체 높이로 늘어날 수 있음',
    fix: 'align-content:center 추가하거나, stretch 대신 다른 값 사용'
  });
} else if (stretchMatch) {
  passed.push({ rule: 4, name: 'stretch + align-content:center 조합 ✓' });
} else {
  passed.push({ rule: 4, name: 'stretch 미사용 ✓' });
}

// ============================================================
// RULE 5: 과도한 padding 감지
// ============================================================
const largePadding = slideHtml.match(/padding\s*:\s*[^;"]*clamp\(\s*\d{2,}px/g);
if (largePadding) {
  const bigPadding = largePadding.filter(p => {
    const minVal = parseInt(p.match(/clamp\(\s*(\d+)px/)[1]);
    return minVal > 20;
  });
  if (bigPadding.length > 0) {
    warnings.push({
      rule: 5,
      name: '과도한 padding',
      detail: `padding 최소값이 20px 초과: ${bigPadding.join(', ')}`,
      fix: 'padding 줄이기'
    });
  } else {
    passed.push({ rule: 5, name: 'padding 적절 ✓' });
  }
} else {
  passed.push({ rule: 5, name: 'padding 적절 ✓' });
}

// ============================================================
// RULE 6: 폰트 최소값 체크 (프로젝터 가독성)
// ============================================================
const fontSizes = slideHtml.match(/font-size\s*:\s*clamp\(\s*(\d+)px/g);
if (fontSizes) {
  const tooSmall = fontSizes.filter(f => {
    const min = parseInt(f.match(/(\d+)px/)[1]);
    return min < 11;
  });
  if (tooSmall.length > 0) {
    warnings.push({
      rule: 6,
      name: '폰트 너무 작음',
      detail: `font-size clamp 최소값 11px 미만: ${tooSmall.length}개`,
      fix: '최소값을 11px 이상으로'
    });
  } else {
    passed.push({ rule: 6, name: '폰트 최소값 11px 이상 ✓' });
  }
}

// ============================================================
// RULE 7: 인라인 스타일 과다 (유지보수성)
// ============================================================
const inlineStyles = (slideHtml.match(/style="/g) || []).length;
if (inlineStyles > 15) {
  warnings.push({
    rule: 7,
    name: '인라인 스타일 과다',
    detail: `${inlineStyles}개 인라인 스타일 — CSS 클래스 활용 권장`,
    fix: '반복되는 스타일은 CSS 클래스로 추출'
  });
} else {
  passed.push({ rule: 7, name: `인라인 스타일 ${inlineStyles}개 — 적절 ✓` });
}

// ============================================================
// RULE 8: 기존 CSS 클래스 활용 여부
// ============================================================
const usesExistingClasses = slideHtml.match(/class="(topic-card|layout-two-cards|cap-grid|cg\d|timeline)/g);
if (!usesExistingClasses && inlineStyles > 10) {
  warnings.push({
    rule: 8,
    name: '기존 CSS 클래스 미활용',
    detail: '기존 디자인 시스템 클래스를 사용하지 않고 인라인 스타일에 의존',
    fix: 'topic-card, layout-two-cards, cap-grid 등 기존 클래스 활용'
  });
}

// ============================================================
// RULE 9: max-width/max-height 없이 이미지 사용
// ============================================================
const imgTags = slideHtml.match(/<img[^>]*>/g) || [];
imgTags.forEach((img, i) => {
  const hasMaxConstraint = /max-(width|height)/.test(img);
  const hasObjectFit = /object-fit/.test(img);
  if (!hasMaxConstraint) {
    warnings.push({
      rule: 9,
      name: `이미지 ${i + 1} 크기 제한 없음`,
      detail: 'max-width 또는 max-height 없이 이미지 사용 — 오버플로우 가능',
      fix: 'max-width:100%; max-height:XXvh 추가'
    });
  }
});

// ============================================================
// RULE 10: slide-ref 존재 확인
// ============================================================
if (slideHtml.includes('slide-ref')) {
  passed.push({ rule: 10, name: 'Reference 존재 ✓' });
} else {
  violations.push({
    rule: 10,
    name: 'Reference 누락',
    detail: 'slide-ref 클래스가 없음',
    fix: '<div class="slide-ref">...</div> 추가'
  });
}

// ============================================================
// RULE 11: 전체 폭 강제 채움 패턴 감지 (width:100% on containers)
// ============================================================
const fullWidthContainers = slideHtml.match(/(?<!max-)width\s*:\s*100%(?![^<]*<\/img)/g);
// filter out img tags
if (fullWidthContainers && fullWidthContainers.length > 2) {
  warnings.push({
    rule: 11,
    name: '전체 폭 채움 패턴',
    detail: `width:100%가 ${fullWidthContainers.length}회 사용 — 콘텐츠가 늘어날 수 있음`,
    fix: '컨테이너에는 max-width 또는 자연스러운 크기 사용'
  });
}

// ============================================================
// 결과 출력
// ============================================================
console.log(`\n${'='.repeat(60)}`);
console.log(`  슬라이드 ${slideNum} 디자인 검증 결과`);
console.log(`${'='.repeat(60)}\n`);

if (violations.length > 0) {
  console.log(`❌ 위반 (${violations.length}건) — 반드시 수정 필요:`);
  violations.forEach(v => {
    console.log(`  [규칙 ${v.rule}] ${v.name}`);
    console.log(`    → ${v.detail}`);
    console.log(`    💡 ${v.fix}`);
  });
  console.log('');
}

if (warnings.length > 0) {
  console.log(`⚠️  경고 (${warnings.length}건) — 검토 필요:`);
  warnings.forEach(w => {
    console.log(`  [규칙 ${w.rule}] ${w.name}`);
    console.log(`    → ${w.detail}`);
    console.log(`    💡 ${w.fix}`);
  });
  console.log('');
}

if (passed.length > 0) {
  console.log(`✅ 통과 (${passed.length}건):`);
  passed.forEach(p => {
    console.log(`  [규칙 ${p.rule}] ${p.name}`);
  });
  console.log('');
}

const score = passed.length;
const total = passed.length + violations.length + warnings.length;
console.log(`${'─'.repeat(60)}`);
console.log(`  점수: ${score}/${total} (위반 ${violations.length}, 경고 ${warnings.length}, 통과 ${passed.length})`);

if (violations.length > 0) {
  console.log(`  🚫 위반사항 해결 후 다시 검증하세요.`);
} else if (warnings.length > 0) {
  console.log(`  ⚠️  경고사항 검토 후 진행하세요.`);
} else {
  console.log(`  ✅ 모든 원칙 통과!`);
}
console.log(`${'─'.repeat(60)}\n`);

process.exit(violations.length > 0 ? 1 : 0);
