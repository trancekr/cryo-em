/**
 * Slide Editor v2 — Clean Rewrite
 * 'E' 키로 토글
 *
 * 핵심 원칙:
 * 1. 모든 레이아웃 수정 → ensureAbsolute() 먼저 (단일 메커니즘)
 * 2. 드래그/리사이즈는 top/left 사용 (translate 아님)
 * 3. freezeSiblingsOf / drift compensation 완전 제거
 */
(function() {
  'use strict';

  /* ── 상태 ── */
  let active = false;
  let selectedEl = null;
  let panel = null;
  let overlay = null;
  let handles = [];
  let infoBar = null;
  let controls = [];
  let changesMap = new Map();
  let originalPositionMap = new Map(); // 원래 position 값 저장 (ensureAbsolute 전)
  let dragState = null;
  let gridOverlay = null;
  let editingEl = null;

  const HANDLE_SIZE = 10;
  const HANDLE_POSITIONS = ['nw','n','ne','e','se','s','sw','w'];

  /* ══════════════════════════════════════
     flex 자식 감지 — flex 레이아웃 보호
     ══════════════════════════════════════ */
  function isFlexChild(el) {
    const parent = el.parentElement;
    if (!parent) return false;
    const d = getComputedStyle(parent).display;
    return d === 'flex' || d === 'inline-flex';
  }

  /* ══════════════════════════════════════
     핵심: ensureAbsolute — 단일 포지셔닝 메커니즘
     ══════════════════════════════════════ */
  function ensureAbsolute(el) {
    const cs = getComputedStyle(el);
    if (cs.position === 'absolute') {
      // 원래부터 absolute인 요소 기록
      if (!originalPositionMap.has(el)) originalPositionMap.set(el, 'absolute');
      absorbTranslate(el);
      return;
    }
    // 원래 position 저장 (최초 1회)
    if (!originalPositionMap.has(el)) originalPositionMap.set(el, cs.position);

    const parent = el.parentElement;
    const container = findContainingBlock(el);
    if (!container) return;

    // 1. 모든 형제 위치 먼저 캡처 (reflow 전)
    const targets = [];
    if (parent) {
      Array.from(parent.children).forEach(child => {
        if (getComputedStyle(child).position !== 'absolute') {
          const r = child.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) targets.push({ el: child, rect: r });
        }
      });
    }
    if (!targets.length) return;

    // 2. 부모를 containing block으로 만들기 + 크기 고정
    if (parent) {
      const pRect = parent.getBoundingClientRect();
      const _pz = parseFloat(document.body.style.zoom) || 1;
      parent.style.minHeight = Math.round(pRect.height / _pz) + 'px';
      parent.style.minWidth = Math.round(pRect.width / _pz) + 'px';
      if (getComputedStyle(parent).position === 'static') {
        parent.style.position = 'relative';
      }
    }

    // 3. 부모 기준 좌표 계산 (부모가 이제 containing block)
    const refEl = parent || container;
    const cRect = refEl.getBoundingClientRect();
    const cCS = getComputedStyle(refEl);
    const bL = parseFloat(cCS.borderLeftWidth) || 0;
    const bT = parseFloat(cCS.borderTopWidth) || 0;

    // 4. 모든 형제를 한번에 absolute로 전환 (다른 박스 밀림 방지)
    const _z = parseFloat(document.body.style.zoom) || 1;
    targets.forEach(({ el: target, rect }) => {
      if (!originalPositionMap.has(target)) originalPositionMap.set(target, getComputedStyle(target).position);
      target.style.position = 'absolute';
      target.style.left = Math.round((rect.left - cRect.left - bL) / _z) + 'px';
      target.style.top = Math.round((rect.top - cRect.top - bT) / _z) + 'px';
      target.style.width = Math.round(rect.width / _z) + 'px';
      target.style.height = Math.round(rect.height / _z) + 'px';
      target.style.flex = 'none';
      target.style.maxWidth = 'none';
      target.style.maxHeight = 'none';
      target.style.margin = '0';
      target.style.zIndex = target.classList.contains('img-label') ? '20' : '10';
      stripTranslate(target);
      // 선택된 요소만 변경 기록 (형제는 레이아웃 유지용이므로 기록 안 함)
      if (target === el) {
        recordChange(target, 'position', 'absolute');
        recordChange(target, 'left', target.style.left);
        recordChange(target, 'top', target.style.top);
        recordChange(target, 'width', target.style.width);
        recordChange(target, 'height', target.style.height);
      }
    });

    if (el === selectedEl) buildSlidersForElement(el);
  }

  // 이미 absolute인 요소의 translate → top/left 흡수
  function absorbTranslate(el) {
    const tx = parseTranslateX(el), ty = parseTranslateY(el);
    if (Math.abs(tx) < 0.5 && Math.abs(ty) < 0.5) return;
    const curLeft = parseFloat(el.style.left) || parseFloat(getComputedStyle(el).left) || 0;
    const curTop = parseFloat(el.style.top) || parseFloat(getComputedStyle(el).top) || 0;
    el.style.left = Math.round(curLeft + tx) + 'px';
    el.style.top = Math.round(curTop + ty) + 'px';
    stripTranslate(el);
    recordChange(el, 'left', el.style.left);
    recordChange(el, 'top', el.style.top);
  }

  function parseTranslateX(el) {
    const t = el.style.transform || '';
    const m = t.match(/translate\(\s*([^,)]+)/);
    if (m) return parseFloat(m[1]) || 0;
    const m2 = t.match(/translateX\(\s*([^)]+)\)/);
    return m2 ? (parseFloat(m2[1]) || 0) : 0;
  }

  function parseTranslateY(el) {
    const t = el.style.transform || '';
    const m = t.match(/translate\([^,]+,\s*([^)]+)/);
    if (m) return parseFloat(m[1]) || 0;
    const m2 = t.match(/translateY\(\s*([^)]+)\)/);
    return m2 ? (parseFloat(m2[1]) || 0) : 0;
  }

  function stripTranslate(el) {
    let t = el.style.transform || '';
    t = t.replace(/translate\([^)]*\)/g, '')
         .replace(/translateX\([^)]*\)/g, '')
         .replace(/translateY\([^)]*\)/g, '')
         .trim();
    el.style.transform = t || '';
  }

  // CSS 스펙상 absolute의 기준점 찾기: position!=static 또는 transform!=none
  function findContainingBlock(el) {
    let parent = el.parentElement;
    while (parent && parent !== document.documentElement) {
      const cs = getComputedStyle(parent);
      if (cs.position !== 'static') return parent;
      if (cs.transform && cs.transform !== 'none') return parent;
      if (cs.filter && cs.filter !== 'none') return parent;
      parent = parent.parentElement;
    }
    return document.documentElement;
  }

  /* ══════════════════════════════════════
     패널 (오른쪽 슬라이더)
     ══════════════════════════════════════ */
  function createPanel() {
    panel = document.createElement('div');
    panel.id = 'slide-editor';
    panel.innerHTML = `
      <div class="se-header">
        <span class="se-title">Slide Editor</span>
        <div class="se-header-btns">
          <button class="se-btn se-save" title="Save All Changes" style="color:#fbbf24;border-color:#fbbf2444;font-weight:700;">💾 Save</button>
          <button class="se-btn se-copy" title="Copy CSS">Copy</button>
          <button class="se-btn se-reset" title="Reset">Reset</button>
          <button class="se-btn se-close" title="Close (E)">✕</button>
        </div>
      </div>
      <div class="se-body"><div class="se-no-slide">Click an element to edit</div></div>
    `;
    document.body.appendChild(panel);

    const style = document.createElement('style');
    style.textContent = `
      #slide-editor {
        position: fixed; top: 50px; right: 12px; width: 280px;
        background: #1a1a2e; color: #e0e0e0; border-radius: 10px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4); z-index: 99999;
        font-family: -apple-system, sans-serif; font-size: 12px;
        display: none; max-height: calc(100vh - 70px); overflow: hidden;
        flex-direction: column;
      }
      #slide-editor.visible { display: flex; }
      .se-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 10px 14px; background: #16213e; border-radius: 10px 10px 0 0;
        cursor: move; user-select: none;
      }
      .se-title { font-weight: 700; font-size: 13px; color: #a78bfa; }
      .se-header-btns { display: flex; gap: 6px; }
      .se-btn {
        background: #2a2a4a; color: #ccc; border: 1px solid #444;
        border-radius: 5px; padding: 3px 10px; cursor: pointer; font-size: 11px;
      }
      .se-btn:hover { background: #3a3a5a; color: #fff; }
      .se-copy { color: #86efac; border-color: #86efac44; }
      .se-reset { color: #f87171; border-color: #f8717144; }
      .se-body {
        padding: 8px 14px 14px; overflow-y: auto; flex: 1;
        max-height: calc(100vh - 120px);
      }
      .se-section { margin-top: 10px; padding-top: 8px; border-top: 1px solid #333; }
      .se-section:first-child { margin-top: 0; border-top: none; padding-top: 0; }
      .se-section-title {
        font-size: 11px; font-weight: 700; color: #7c3aed;
        text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;
      }
      .se-control { margin-bottom: 8px; }
      .se-control-header {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 2px;
      }
      .se-label { font-size: 11px; color: #aaa; }
      .se-value {
        font-size: 11px; color: #86efac; font-family: 'SF Mono', monospace;
        min-width: 50px; text-align: right;
      }
      .se-slider {
        -webkit-appearance: none; width: 100%; height: 4px;
        background: #333; border-radius: 2px; outline: none;
      }
      .se-slider::-webkit-slider-thumb {
        -webkit-appearance: none; width: 14px; height: 14px;
        background: #7c3aed; border-radius: 50%; cursor: pointer;
      }
      .se-slider::-webkit-slider-thumb:hover { background: #a78bfa; }
      .se-no-slide { color: #888; text-align: center; padding: 20px 0; }
      .se-el-tag {
        color: #86efac; font-family: 'SF Mono', monospace; font-size: 11px;
        margin-bottom: 4px; word-break: break-all;
      }
      /* ── 브레드크럼 계층 표시 ── */
      .se-breadcrumb {
        display: flex; flex-wrap: wrap; align-items: center;
        gap: 2px; margin-bottom: 8px; padding: 6px 8px;
        background: #111827; border-radius: 6px; border: 1px solid #1f2937;
      }
      .se-bc-item {
        font-size: 10px; font-family: 'SF Mono', monospace;
        color: #6b7280; cursor: pointer; padding: 1px 4px;
        border-radius: 3px; transition: all 0.15s;
        max-width: 120px; overflow: hidden; text-overflow: ellipsis;
        white-space: nowrap;
      }
      .se-bc-item:hover { background: #1f2937; color: #a78bfa; }
      .se-bc-item.se-bc-active { color: #86efac; background: #064e3b; font-weight: 700; }
      .se-bc-sep { color: #374151; font-size: 10px; user-select: none; }
      .se-bc-nav {
        display: flex; gap: 4px; margin-bottom: 8px;
      }
      .se-bc-nav-btn {
        background: #1f2937; color: #9ca3af; border: 1px solid #374151;
        border-radius: 4px; padding: 2px 6px; cursor: pointer; font-size: 11px;
        font-family: 'SF Mono', monospace; transition: all 0.15s;
      }
      .se-bc-nav-btn:hover { background: #374151; color: #e5e7eb; }
      .se-bc-nav-btn:disabled { opacity: 0.3; cursor: default; }
      .se-bc-nav-btn:disabled:hover { background: #1f2937; color: #9ca3af; }
      /* ── 오버레이 + 핸들 ── */
      #se-overlay {
        position: fixed; pointer-events: none; z-index: 99990;
        border: 2px solid #3b82f6; border-radius: 2px; display: none;
      }
      .se-handle {
        position: fixed; width: ${HANDLE_SIZE}px; height: ${HANDLE_SIZE}px;
        background: #3b82f6; border: 1px solid #fff; border-radius: 2px;
        pointer-events: auto; z-index: 99991; display: none;
      }
      /* ── 격자 오버레이 ── */
      #se-grid {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        pointer-events: none; z-index: 99980;
        background-image:
          linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px),
          linear-gradient(rgba(59,130,246,0.18) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,130,246,0.18) 1px, transparent 1px);
        background-size: 20px 20px, 20px 20px, 100px 100px, 100px 100px;
      }
      /* ── 정보 바 (왼쪽 위) ── */
      #se-infobar {
        position: fixed; top: 50px; left: 12px;
        background: #1a1a2e; color: #e0e0e0; border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4); z-index: 99992;
        font-family: -apple-system, sans-serif; font-size: 12px;
        display: none; padding: 8px 12px; gap: 8px; align-items: center;
        flex-wrap: wrap; max-width: 420px;
      }
      .ib-vp-btn {
        background: #2a2a4a; color: #ccc; border: 1px solid #555;
        border-radius: 4px; padding: 2px 6px; cursor: pointer; font-size: 10px;
        font-family: 'SF Mono', monospace;
      }
      .ib-vp-btn:hover { background: #3a3a5a; color: #fff; }
      .ib-vp-btn.active { border-color: #86efac; color: #86efac; }
    `;
    document.head.appendChild(style);

    panel.querySelector('.se-close').onclick = toggle;
    panel.querySelector('.se-save').onclick = saveAll;
    panel.querySelector('.se-copy').onclick = copyCSS;
    panel.querySelector('.se-reset').onclick = resetSelected;
    makeDraggable(panel, panel.querySelector('.se-header'));
  }

  /* ══════════════════════════════════════
     오버레이 + 핸들 + 정보 바
     ══════════════════════════════════════ */
  function createOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'se-overlay';
    document.body.appendChild(overlay);

    HANDLE_POSITIONS.forEach(pos => {
      const h = document.createElement('div');
      h.className = 'se-handle';
      h.dataset.pos = pos;
      h.style.cursor = getCursor(pos);
      h.addEventListener('mousedown', e => startResize(e, pos));
      document.body.appendChild(h);
      handles.push(h);
    });
  }

  function createInfoBar() {
    infoBar = document.createElement('div');
    infoBar.id = 'se-infobar';
    infoBar.innerHTML = `
      <span style="color:#3b82f6;font-weight:700">EDITOR</span>
      <span class="ib-el" style="color:#86efac;font-family:'SF Mono',monospace"></span>
      <span class="ib-size" style="color:#ccc;font-family:'SF Mono',monospace"></span>
      <span class="ib-pos" style="color:#ccc;font-family:'SF Mono',monospace"></span>
      <span class="ib-sep" style="color:#444;margin:0 2px">|</span>
      <span class="ib-vp" style="color:#fbbf24;font-family:'SF Mono',monospace;font-size:11px"></span>
      <button class="ib-vp-btn" data-w="1920" data-h="1080">1920×1080</button>
      <button class="ib-vp-btn" data-w="1280" data-h="720">1280×720</button>
      <button class="ib-vp-btn" data-w="1024" data-h="768">1024×768</button>
      <button class="ib-vp-btn se-refresh-btn" title="이미지 캐시 새로고침">🔄</button>
      <button class="ib-vp-btn se-img-btn" title="이미지 삽입">📷</button>
    `;
    document.body.appendChild(infoBar);

    infoBar.querySelectorAll('.ib-vp-btn[data-w]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        showViewportPreview(+btn.dataset.w, +btn.dataset.h);
      });
    });
    infoBar.querySelector('.se-refresh-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      refreshSlideImages();
    });
    infoBar.querySelector('.se-img-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      insertImage();
    });
    updateViewportInfo();
    window.addEventListener('resize', updateViewportInfo);
  }

  function updateViewportInfo() {
    const vp = infoBar?.querySelector('.ib-vp');
    if (!vp) return;
    const w = window.innerWidth, h = window.innerHeight;
    const is16_9 = Math.abs(w / h - 16/9) < 0.02;
    const tag = is16_9 ? '16:9 ✓' : (w / h).toFixed(2);
    vp.textContent = `${w}×${h} (${tag})`;
    vp.style.color = is16_9 ? '#86efac' : '#fbbf24';
    infoBar?.querySelectorAll('.ib-vp-btn[data-w]').forEach(btn => {
      btn.classList.toggle('active', w === +btn.dataset.w && h === +btn.dataset.h);
    });
  }

  function showViewportPreview(tw, th) {
    document.getElementById('se-vp-overlay')?.remove();
    const slide = document.querySelector('.slide.active');
    const n = slide?.dataset?.n || '1';
    const ov = document.createElement('div');
    ov.id = 'se-vp-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;';
    const maxW = window.innerWidth - 40, maxH = window.innerHeight - 60;
    const scale = Math.min(maxW / tw, maxH / th, 1);
    const label = document.createElement('div');
    label.style.cssText = 'color:#fff;font:13px -apple-system,sans-serif;margin-bottom:8px;';
    label.textContent = `${tw}×${th} preview` + (scale < 1 ? ` (${Math.round(scale*100)}%)` : '') + ' — ESC/클릭으로 닫기';
    const frame = document.createElement('iframe');
    frame.src = location.pathname + '?slide=' + n;
    frame.style.cssText = `width:${tw}px;height:${th}px;border:2px solid #3b82f6;border-radius:4px;transform:scale(${scale});transform-origin:top center;background:#fff;`;
    ov.appendChild(label);
    ov.appendChild(frame);
    document.body.appendChild(ov);
    frame.onload = () => { try { frame.contentWindow.show(+n); } catch(e) {} };
    const close = () => ov.remove();
    ov.addEventListener('click', (e) => { if (e.target === ov) close(); });
    const onKey = (e) => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey, true); } };
    document.addEventListener('keydown', onKey, true);
  }

  function getCursor(pos) {
    return ({nw:'nw-resize',n:'n-resize',ne:'ne-resize',e:'e-resize',
             se:'se-resize',s:'s-resize',sw:'sw-resize',w:'w-resize'})[pos] || 'default';
  }

  /* ══════════════════════════════════════
     토글
     ══════════════════════════════════════ */
  function toggle() {
    active = !active;
    if (active) {
      panel.classList.add('visible');
      infoBar.style.display = 'flex';
      infoBar.querySelector('.ib-el').textContent = 'Click an element';
      infoBar.querySelector('.ib-size').textContent = '';
      infoBar.querySelector('.ib-pos').textContent = '';
      document.addEventListener('click', onClickCapture, true);
      document.addEventListener('dblclick', onDblClick, true);
      document.addEventListener('mousedown', onDragStart, true);
      document.addEventListener('mousemove', onDragMove, true);
      document.addEventListener('mouseup', onDragEnd, true);
      document.addEventListener('mouseover', onHover, true);
      document.addEventListener('mouseout', onHoverOut, true);
      document.querySelectorAll('.img-label').forEach(el => { el.style.pointerEvents = 'auto'; });
      showGrid();
      addTopbarIndicator();
    } else {
      finishTextEdit();
      deselect();
      panel.classList.remove('visible');
      infoBar.style.display = 'none';
      document.removeEventListener('click', onClickCapture, true);
      document.removeEventListener('dblclick', onDblClick, true);
      document.removeEventListener('mousedown', onDragStart, true);
      document.removeEventListener('mousemove', onDragMove, true);
      document.removeEventListener('mouseup', onDragEnd, true);
      document.removeEventListener('mouseover', onHover, true);
      document.removeEventListener('mouseout', onHoverOut, true);
      document.querySelectorAll('[data-se-hover]').forEach(el => {
        el.removeAttribute('data-se-hover');
        el.style.outline = '';
      });
      document.querySelectorAll('.img-label').forEach(el => { el.style.pointerEvents = ''; });
      hideGrid();
      removeTopbarIndicator();
    }
  }

  /* ══════════════════════════════════════
     선택 / 해제
     ══════════════════════════════════════ */
  function isSelectable(el) {
    if (!el) return false;
    if (el.closest('#slide-editor') || el.closest('#se-infobar') ||
        el.closest('#se-overlay') || el.closest('.topbar') ||
        el.classList.contains('se-handle')) return false;
    const slide = el.closest('.slide');
    if (!slide) return false;
    if (el.classList.contains('slide') || el.classList.contains('slides-area')) return false;
    if (el.classList.contains('img-label')) return true;
    if (el.classList.contains('s23-arrow')) return true;
    const rect = el.getBoundingClientRect();
    const _sz = parseFloat(document.body.style.zoom) || 1;
    if (rect.width / _sz < 10 || rect.height / _sz < 10) return false;
    return true;
  }

  function select(el) {
    if (selectedEl && selectedEl !== el) selectedEl.style.outline = '';
    selectedEl = el;
    selectedEl.style.outline = '2px solid #3b82f6';
    updateOverlay();
    updateInfoBar();
    buildSlidersForElement(el);
  }

  function deselect() {
    if (selectedEl) {
      selectedEl.style.outline = '';
      selectedEl = null;
    }
    overlay.style.display = 'none';
    handles.forEach(h => h.style.display = 'none');
    if (active) {
      infoBar.querySelector('.ib-el').textContent = 'Click an element';
      infoBar.querySelector('.ib-size').textContent = '';
      infoBar.querySelector('.ib-pos').textContent = '';
    }
    panel.querySelector('.se-body').innerHTML = '<div class="se-no-slide">Click an element to edit</div>';
    controls = [];
  }

  /* ══════════════════════════════════════
     브레드크럼 계층 + 네비게이션
     ══════════════════════════════════════ */
  function getElementPath(el) {
    const path = [];
    let cur = el;
    while (cur) {
      if (cur.classList && cur.classList.contains('slide')) { path.unshift(cur); break; }
      if (cur.classList && cur.classList.contains('slides-area')) break;
      if (cur === document.body || cur === document.documentElement) break;
      path.unshift(cur);
      cur = cur.parentElement;
    }
    return path;
  }

  function getElLabel(el) {
    const tag = el.tagName.toLowerCase();
    // 클래스에서 핵심만 추출
    const cls = el.className ? el.className.split(' ')
      .filter(c => c && !c.startsWith('se-') && c !== 'active')
      .slice(0, 2).join('.') : '';
    return cls ? `${tag}.${cls}` : tag;
  }

  function buildBreadcrumb(container, el) {
    const path = getElementPath(el);
    if (!path.length) return;

    // 브레드크럼
    const bc = document.createElement('div');
    bc.className = 'se-breadcrumb';
    path.forEach((node, i) => {
      if (i > 0) {
        const sep = document.createElement('span');
        sep.className = 'se-bc-sep';
        sep.textContent = '›';
        bc.appendChild(sep);
      }
      const item = document.createElement('span');
      item.className = 'se-bc-item' + (node === el ? ' se-bc-active' : '');
      item.textContent = getElLabel(node);
      item.title = node.tagName.toLowerCase() + (node.className ? '.' + node.className.split(' ').filter(c=>c).join('.') : '');
      item.onclick = () => { if (node !== el && isSelectable(node)) select(node); };
      bc.appendChild(item);
    });
    container.appendChild(bc);

    // 네비게이션 버튼: ↑부모  ↓자식  ←이전  →다음
    const nav = document.createElement('div');
    nav.className = 'se-bc-nav';

    const parentEl = el.parentElement;
    const hasParent = parentEl && isSelectable(parentEl);
    const firstChild = Array.from(el.children).find(c => isSelectable(c));
    const prevSib = findPrevSelectable(el);
    const nextSib = findNextSelectable(el);

    const btns = [
      { label: '↑ 부모', el: hasParent ? parentEl : null },
      { label: '↓ 자식', el: firstChild || null },
      { label: '← 이전', el: prevSib },
      { label: '→ 다음', el: nextSib },
    ];
    btns.forEach(({ label, el: target }) => {
      const btn = document.createElement('button');
      btn.className = 'se-bc-nav-btn';
      btn.textContent = label;
      btn.disabled = !target;
      if (target) btn.onclick = () => select(target);
      nav.appendChild(btn);
    });
    container.appendChild(nav);
  }

  function findPrevSelectable(el) {
    let sib = el.previousElementSibling;
    while (sib) {
      if (isSelectable(sib)) return sib;
      sib = sib.previousElementSibling;
    }
    return null;
  }

  function findNextSelectable(el) {
    let sib = el.nextElementSibling;
    while (sib) {
      if (isSelectable(sib)) return sib;
      sib = sib.nextElementSibling;
    }
    return null;
  }

  /* ══════════════════════════════════════
     스마트 클릭 — 가장 깊은/작은 요소 선택
     ══════════════════════════════════════ */
  function findDeepestSelectable(x, y) {
    const elements = document.elementsFromPoint(x, y);
    // z-index overlay elements (arrows etc.) get priority
    for (const el of elements) {
      if (el.classList.contains('s23-arrow')) return el;
    }
    let best = null;
    let bestDepth = -1;
    for (const el of elements) {
      if (!isSelectable(el)) continue;
      let depth = 0;
      let p = el;
      while (p) { depth++; p = p.parentElement; }
      if (depth > bestDepth) {
        bestDepth = depth;
        best = el;
      }
    }
    return best;
  }

  /* ══════════════════════════════════════
     슬라이더 자동 생성
     ══════════════════════════════════════ */
  function buildSlidersForElement(el) {
    const body = panel.querySelector('.se-body');
    body.innerHTML = '';
    controls = [];

    const tag = el.tagName.toLowerCase();
    const cls = el.className ? '.' + el.className.split(' ').filter(c => c).join('.') : '';
    body.innerHTML = `<div class="se-el-tag">${tag}${cls}</div>`;

    // 브레드크럼 + 네비게이션 버튼
    buildBreadcrumb(body, el);

    const cs = getComputedStyle(el);
    const isAbs = cs.position === 'absolute';

    // ── 자유 배치 버튼 ──
    const freeBtn = document.createElement('button');
    freeBtn.className = 'se-btn';
    freeBtn.style.cssText = 'width:100%;padding:6px;margin-bottom:8px;font-weight:700;' +
      (isAbs ? 'color:#86efac;border-color:#86efac44;' : 'color:#3b82f6;border-color:#3b82f644;');
    freeBtn.textContent = isAbs ? '✅ Free (absolute)' : '🔓 자유 배치 (Free Position)';
    freeBtn.onclick = () => {
      ensureAbsolute(el);
      freeBtn.textContent = '✅ Free!';
      freeBtn.style.color = '#86efac';
      freeBtn.style.borderColor = '#86efac44';
      updateOverlay();
    };
    body.appendChild(freeBtn);

    // ── Position / Size ──
    addSection(body, 'Position / Size');

    if (isAbs) {
      // absolute: top/left 슬라이더
      const topVal = parseFloat(cs.top) || 0;
      const leftVal = parseFloat(cs.left) || 0;
      const isLabel = el.classList.contains('img-label');

      if (isLabel) {
        addSlider(body, 'top', el, 'top', 0, 100, 1, '%',
          (e, v) => { e.style.top = v + '%'; }, parseFloat(el.style.top) || 0);
        addSlider(body, 'left', el, 'left', 0, 100, 1, '%',
          (e, v) => { e.style.left = v + '%'; }, parseFloat(el.style.left) || 0);
      } else {
        addSlider(body, 'top', el, 'top', -100, 1200, 1, 'px',
          (e, v) => { e.style.top = v + 'px'; }, topVal);
        addSlider(body, 'left', el, 'left', -100, 2000, 1, 'px',
          (e, v) => { e.style.left = v + 'px'; }, leftVal);
      }
      addSlider(body, 'z-index', el, 'zIndex', 0, 50, 1, '',
        (e, v) => { e.style.zIndex = v; }, parseInt(cs.zIndex) || 0);
    } else {
      // flex 모드: margin 슬라이더
      addSlider(body, 'margin-top', el, 'marginTop', -50, 120, 1, 'px');
      addSlider(body, 'margin-bottom', el, 'marginBottom', -20, 80, 1, 'px');
    }

    addSlider(body, 'padding V', el, 'paddingTop', 0, 60, 1, 'px',
      (e, v) => { e.style.paddingTop = v + 'px'; e.style.paddingBottom = v + 'px'; });
    addSlider(body, 'padding H', el, 'paddingLeft', 0, 80, 1, 'px',
      (e, v) => { e.style.paddingLeft = v + 'px'; e.style.paddingRight = v + 'px'; });

    // width/height — 슬라이더는 flex 안에서 직접 변경 (ensureAbsolute 호출 안 함)
    const w = parseFloat(cs.width) || 0;
    const h = parseFloat(cs.height) || 0;
    if (w > 0) addSlider(body, 'width', el, 'width', 30, Math.max(w * 2, 600), 1, 'px');
    if (h > 0) addSlider(body, 'height', el, 'height', 20, Math.max(h * 2, 400), 1, 'px');

    // max-width
    const mw = parseFloat(cs.maxWidth);
    if (mw && isFinite(mw)) {
      addSlider(body, 'max-width', el, 'maxWidth', 100, Math.max(mw * 1.5, 800), 5, 'px');
    }

    // gap
    const gap = parseFloat(cs.gap);
    if (gap && isFinite(gap)) {
      addSlider(body, 'gap', el, 'gap', 0, 60, 1, 'px');
    }

    // ── Typography ──
    addSection(body, 'Typography');
    addSlider(body, 'font-size', el, 'fontSize', 8, 48, 1, 'px');
    addSlider(body, 'line-height', el, 'lineHeight', 10, 60, 1, 'px');
    addSlider(body, 'font-weight', el, 'fontWeight', 100, 900, 100, '',
      (e, v) => { e.style.fontWeight = v; });

    // ── Visual ──
    addSection(body, 'Visual');
    addSlider(body, 'border-radius', el, 'borderRadius', 0, 30, 1, 'px');
    addSlider(body, 'opacity', el, 'opacity', 0, 1, 0.05, '',
      (e, v) => { e.style.opacity = v; }, parseFloat(cs.opacity) || 1);

    // ── Image-specific ──
    if (tag === 'img') {
      addSection(body, 'Image');
      addSlider(body, 'max-height', el, 'maxHeight', 50, 500, 5, 'px',
        null, parseFloat(cs.maxHeight) || h);
      addSlider(body, 'max-width', el, 'maxWidth', 50, 800, 5, 'px',
        null, parseFloat(cs.maxWidth) || w);
    }

    // ── 텍스트 편집 ──
    if (el.textContent && !['IMG','UL','OL','DIV'].includes(el.tagName) ||
        el.classList.contains('img-label') || el.classList.contains('img-caption') ||
        el.classList.contains('card-title')) {
      addSection(body, 'Text');
      const editBtn = document.createElement('button');
      editBtn.className = 'se-btn';
      editBtn.style.cssText = 'width:100%;color:#f59e0b;border-color:#f59e0b44;margin-top:4px;padding:6px;';
      editBtn.textContent = '✏ Double-click to edit text';
      editBtn.onclick = () => startTextEdit(el);
      const lastSec = body.querySelector('.se-section:last-child') || body;
      lastSec.appendChild(editBtn);
    }
  }

  /* ── 섹션 / 슬라이더 헬퍼 ── */
  function addSection(container, title) {
    const div = document.createElement('div');
    div.className = 'se-section';
    div.innerHTML = `<div class="se-section-title">${title}</div>`;
    container.appendChild(div);
  }

  function addSlider(container, label, element, prop, min, max, step, unit, customApply, initialValue) {
    const current = (initialValue !== undefined) ? initialValue : (parseFloat(getComputedStyle(element)[prop]) || 0);
    const ctrl = document.createElement('div');
    ctrl.className = 'se-control';
    const dv = step < 1 ? current.toFixed(2) : Math.round(current);
    ctrl.innerHTML = `
      <div class="se-control-header">
        <span class="se-label">${label}</span>
        <span class="se-value">${dv}${unit}</span>
      </div>
      <input type="range" class="se-slider" min="${min}" max="${max}" step="${step}" value="${current}">
    `;
    const lastSection = container.querySelector('.se-section:last-child') || container;
    lastSection.appendChild(ctrl);

    const slider = ctrl.querySelector('.se-slider');
    const valueDisplay = ctrl.querySelector('.se-value');

    slider.oninput = () => {
      const v = parseFloat(slider.value);
      valueDisplay.textContent = (step < 1 ? v.toFixed(2) : Math.round(v)) + unit;
      if (customApply) {
        customApply(element, v);
      } else {
        element.style[prop] = v + unit;
      }
      recordChange(element, prop, element.style[prop] || v + unit);
      updateOverlay();
      updateInfoBar();
    };

    controls.push({ label, element, prop, slider, unit, customApply });
  }

  /* ══════════════════════════════════════
     오버레이 / 정보 바 업데이트
     ══════════════════════════════════════ */
  function updateOverlay() {
    if (!selectedEl) return;
    const r = selectedEl.getBoundingClientRect();
    overlay.style.display = 'block';
    overlay.style.left = r.left + 'px';
    overlay.style.top = r.top + 'px';
    overlay.style.width = r.width + 'px';
    overlay.style.height = r.height + 'px';

    const hs = HANDLE_SIZE / 2;
    const positions = {
      nw: [r.left - hs, r.top - hs],
      n:  [r.left + r.width/2 - hs, r.top - hs],
      ne: [r.right - hs, r.top - hs],
      e:  [r.right - hs, r.top + r.height/2 - hs],
      se: [r.right - hs, r.bottom - hs],
      s:  [r.left + r.width/2 - hs, r.bottom - hs],
      sw: [r.left - hs, r.bottom - hs],
      w:  [r.left - hs, r.top + r.height/2 - hs],
    };
    handles.forEach(h => {
      const [x, y] = positions[h.dataset.pos];
      h.style.display = 'block';
      h.style.left = x + 'px';
      h.style.top = y + 'px';
    });
  }

  function updateInfoBar() {
    if (!selectedEl) return;
    const r = selectedEl.getBoundingClientRect();
    const _iz = parseFloat(document.body.style.zoom) || 1;
    const tag = selectedEl.tagName.toLowerCase();
    const cls = selectedEl.className ? '.' + selectedEl.className.split(' ').filter(c => c).join('.') : '';
    infoBar.querySelector('.ib-el').textContent = tag + cls;
    infoBar.querySelector('.ib-size').textContent = `${Math.round(r.width / _iz)}×${Math.round(r.height / _iz)}`;
    const cs = getComputedStyle(selectedEl);
    if (cs.position === 'absolute') {
      const t = Math.round(parseFloat(cs.top) || 0);
      const l = Math.round(parseFloat(cs.left) || 0);
      infoBar.querySelector('.ib-pos').textContent = `pos(${l},${t})`;
    } else {
      infoBar.querySelector('.ib-pos').textContent = '';
    }
  }

  /* ══════════════════════════════════════
     호버 / 클릭
     ══════════════════════════════════════ */
  function onHover(e) {
    if (!active || dragState) return;
    const el = e.target;
    if (!isSelectable(el) || el === selectedEl) return;
    el.setAttribute('data-se-hover', '1');
    el.style.outline = '1px dashed #3b82f680';
  }

  function onHoverOut(e) {
    const el = e.target;
    if (el.hasAttribute('data-se-hover')) {
      el.removeAttribute('data-se-hover');
      if (el !== selectedEl) el.style.outline = '';
    }
  }

  function onClickCapture(e) {
    if (!active) return;
    if (e.target.classList.contains('se-handle')) return;
    if (e.target.closest('#slide-editor') || e.target.closest('#se-infobar')) return;
    if (e.target.closest('.topbar')) return;
    if (e.target.isContentEditable || e.target.closest('[contenteditable="true"]')) return;

    e.preventDefault();
    e.stopPropagation();

    // 스마트 클릭: 가장 깊은(작은) 요소를 자동 선택
    const deepest = findDeepestSelectable(e.clientX, e.clientY);
    if (!deepest) { deselect(); return; }
    select(deepest);
  }

  /* ══════════════════════════════════════
     더블클릭 텍스트 편집
     ══════════════════════════════════════ */
  function onDblClick(e) {
    if (!active) return;
    if (e.target.closest('#slide-editor') || e.target.closest('#se-infobar') ||
        e.target.closest('.topbar')) return;
    const el = e.target;
    if (el.classList.contains('img-label') || el.classList.contains('img-caption') ||
        el.classList.contains('card-title') || el.classList.contains('slide-title') ||
        el.classList.contains('slide-subtitle') || el.tagName === 'LI' ||
        el.classList.contains('key-insight') || el.classList.contains('citation')) {
      e.preventDefault();
      e.stopPropagation();
      startTextEdit(el);
    }
  }

  function startTextEdit(el) {
    finishTextEdit();
    editingEl = el;
    el.contentEditable = 'true';
    el.style.outline = '2px solid #f59e0b';
    el.style.background = 'rgba(245,158,11,0.1)';
    el.style.cursor = 'text';
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    el.addEventListener('keydown', onTextEditKey);
    el.addEventListener('blur', onTextEditBlur);
  }

  function onTextEditKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); finishTextEdit(); }
    if (e.key === 'Escape') { e.preventDefault(); finishTextEdit(); }
    e.stopPropagation();
  }

  function onTextEditBlur() { setTimeout(() => finishTextEdit(), 100); }

  function finishTextEdit() {
    if (!editingEl) return;
    editingEl.contentEditable = 'false';
    editingEl.style.outline = selectedEl === editingEl ? '2px solid #3b82f6' : '';
    editingEl.style.background = '';
    editingEl.style.cursor = '';
    editingEl.removeEventListener('keydown', onTextEditKey);
    editingEl.removeEventListener('blur', onTextEditBlur);
    editingEl = null;
  }

  /* ══════════════════════════════════════
     드래그 이동 — top/left 사용 (translate 아님)
     ══════════════════════════════════════ */
  function onDragStart(e) {
    if (!active || !selectedEl) return;
    if (e.target.classList.contains('se-handle')) return;
    if (e.target.closest('#slide-editor') || e.target.closest('#se-infobar') ||
        e.target.closest('.topbar')) return;
    if (!e.target.closest('.slide') || !isSelectable(e.target)) return;

    const r = selectedEl.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right ||
        e.clientY < r.top || e.clientY > r.bottom) return;

    e.preventDefault();
    e.stopPropagation();

    // 드래그 시작 → absolute로 전환
    ensureAbsolute(selectedEl);

    const cs = getComputedStyle(selectedEl);
    dragState = {
      type: 'move',
      startX: e.clientX, startY: e.clientY,
      origLeft: parseFloat(cs.left) || 0,
      origTop: parseFloat(cs.top) || 0,
    };
  }

  function getZoom() { return parseFloat(document.body.style.zoom) || 1; }

  function onDragMove(e) {
    if (!dragState || !selectedEl) return;
    e.preventDefault();
    const z = getZoom();
    const dx = (e.clientX - dragState.startX) / z;
    const dy = (e.clientY - dragState.startY) / z;

    if (dragState.type === 'move') {
      selectedEl.style.left = Math.round(dragState.origLeft + dx) + 'px';
      selectedEl.style.top = Math.round(dragState.origTop + dy) + 'px';
      recordChange(selectedEl, 'left', selectedEl.style.left);
      recordChange(selectedEl, 'top', selectedEl.style.top);
    } else if (dragState.type === 'resize') {
      applyResize(dx, dy);
    }
    updateOverlay();
    updateInfoBar();
  }

  function onDragEnd() { dragState = null; }

  /* ══════════════════════════════════════
     리사이즈 — 직접 top/left/width/height 조작
     ══════════════════════════════════════ */
  function startResize(e, pos) {
    if (!selectedEl) return;
    e.preventDefault();
    e.stopPropagation();

    // flex 자식이면 ensureAbsolute 건너뛰기 — width/height만 변경
    const _isFlex = isFlexChild(selectedEl);
    if (!_isFlex) {
      ensureAbsolute(selectedEl);
    }

    const cs = getComputedStyle(selectedEl);
    dragState = {
      type: 'resize', handle: pos,
      flexMode: _isFlex,
      startX: e.clientX, startY: e.clientY,
      origLeft: parseFloat(cs.left) || 0,
      origTop: parseFloat(cs.top) || 0,
      origWidth: parseFloat(cs.width) || 0,
      origHeight: parseFloat(cs.height) || 0,
    };
  }

  function applyResize(dx, dy) {
    if (!dragState || dragState.type !== 'resize') return;
    const pos = dragState.handle;
    let l = dragState.origLeft, t = dragState.origTop;
    let w = dragState.origWidth, h = dragState.origHeight;

    if (pos.includes('e')) w += dx;
    if (pos.includes('w')) { w -= dx; l += dx; }
    if (pos.includes('s')) h += dy;
    if (pos.includes('n')) { h -= dy; t += dy; }

    w = Math.max(30, w);
    h = Math.max(20, h);

    if (dragState.flexMode) {
      // flex 자식: width/height만 변경, left/top 건드리지 않음
      selectedEl.style.width = Math.round(w) + 'px';
      selectedEl.style.height = Math.round(h) + 'px';
      selectedEl.style.maxWidth = 'none';
      selectedEl.style.maxHeight = 'none';
      recordChange(selectedEl, 'width', selectedEl.style.width);
      recordChange(selectedEl, 'height', selectedEl.style.height);
    } else {
      selectedEl.style.left = Math.round(l) + 'px';
      selectedEl.style.top = Math.round(t) + 'px';
      selectedEl.style.width = Math.round(w) + 'px';
      selectedEl.style.height = Math.round(h) + 'px';
      selectedEl.style.maxWidth = 'none';
      selectedEl.style.maxHeight = 'none';
      recordChange(selectedEl, 'left', selectedEl.style.left);
      recordChange(selectedEl, 'top', selectedEl.style.top);
      recordChange(selectedEl, 'width', selectedEl.style.width);
      recordChange(selectedEl, 'height', selectedEl.style.height);
    }
  }

  /* ══════════════════════════════════════
     격자 오버레이
     ══════════════════════════════════════ */
  function showGrid() {
    if (gridOverlay) return;
    const slide = document.querySelector('.slide.active');
    if (!slide) return;
    gridOverlay = document.createElement('div');
    gridOverlay.id = 'se-grid';
    slide.appendChild(gridOverlay);
  }

  function hideGrid() {
    if (gridOverlay) { gridOverlay.remove(); gridOverlay = null; }
  }

  /* ══════════════════════════════════════
     이미지 도구
     ══════════════════════════════════════ */
  // 이미지 캐시 새로고침 — 현재 슬라이드의 모든 이미지 강제 리로드
  function refreshSlideImages() {
    const slide = document.querySelector('.slide.active');
    if (!slide) return;
    const ts = Date.now();
    let count = 0;
    slide.querySelectorAll('img').forEach(img => {
      const src = img.src.split('?')[0];
      img.src = src + '?t=' + ts;
      count++;
    });
    showFeedback('.se-refresh-btn', `✅ ${count}`);
  }

  // 이미지 삽입 — 파일 선택 → data URL → 슬라이드에 배치
  function insertImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const slide = document.querySelector('.slide.active');
        if (!slide) return;
        const img = document.createElement('img');
        img.src = ev.target.result;
        img.style.cssText = 'position:absolute;left:100px;top:100px;max-width:400px;z-index:10;';
        slide.appendChild(img);
        select(img);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  /* ══════════════════════════════════════
     변경 기록 / 복사 / 리셋
     ══════════════════════════════════════ */
  function recordChange(el, prop, value) {
    if (!changesMap.has(el)) changesMap.set(el, {});
    changesMap.get(el)[prop] = value;
  }

  function copyCSS() {
    if (!selectedEl) return;
    const changes = changesMap.get(selectedEl);
    if (!changes || Object.keys(changes).length === 0) {
      showFeedback('.se-copy', 'No changes'); return;
    }
    const tag = selectedEl.tagName.toLowerCase();
    const cls = selectedEl.className ? '.' + selectedEl.className.split(' ').filter(c => c).join('.') : '';
    let lines = [`/* ${tag}${cls} */`];
    for (const [prop, val] of Object.entries(changes)) {
      const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
      lines.push(`${cssProp}: ${val};`);
    }
    navigator.clipboard.writeText(lines.join('\n')).then(() => showFeedback('.se-copy', 'Copied!'));
  }

  // ── 💾 Save All — 모든 변경 사항을 한번에 내보내기 ──
  function saveAll() {
    if (changesMap.size === 0) {
      showFeedback('.se-save', '변경 없음');
      return;
    }

    const slide = document.querySelector('.slide.active');
    const slideN = slide?.dataset?.n || '?';
    const lines = [`/* ═══ Slide ${slideN} — ${changesMap.size}개 요소 변경 — ${new Date().toLocaleString()} ═══ */\n`];

    let idx = 0;
    changesMap.forEach((changes, el) => {
      idx++;
      const tag = el.tagName.toLowerCase();
      const cls = el.className ? '.' + el.className.split(' ').filter(c => c && !c.startsWith('se-')).join('.') : '';
      const text = el.textContent?.substring(0, 30).trim();
      const selector = getUniqueSelector(el);

      lines.push(`/* [${idx}] ${tag}${cls} "${text}..." */`);
      lines.push(`/* selector: ${selector} */`);

      // inline style 출력 (원래 absolute가 아닌 요소는 position/left/top 제외)
      const wasAbsolute = originalPositionMap.get(el) === 'absolute';
      const skipProps = wasAbsolute ? [] : ['position', 'left', 'top', 'flex', 'maxWidth', 'maxHeight', 'margin', 'zIndex'];
      const styleLines = [];
      for (const [prop, val] of Object.entries(changes)) {
        if (skipProps.includes(prop)) continue;
        const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
        styleLines.push(`  ${cssProp}: ${val};`);
      }
      if (styleLines.length === 0) { idx--; return; } // 출력할 변경사항 없으면 스킵
      lines.push(`${tag}${cls} {`);
      lines.push(styleLines.join('\n'));
      lines.push(`}\n`);
    });

    // 요약
    lines.push(`/* ═══ 총 ${changesMap.size}개 요소 변경됨 ═══ */`);

    const output = lines.join('\n');
    navigator.clipboard.writeText(output).then(() => {
      showFeedback('.se-save', `✅ ${changesMap.size}개 복사됨`);
      console.log('[SlideEditor] Save All:\n' + output);
    });
  }

  // 요소의 고유 CSS 선택자 생성
  function getUniqueSelector(el) {
    const parts = [];
    let cur = el;
    while (cur && cur !== document.documentElement) {
      if (cur.id) { parts.unshift('#' + cur.id); break; }
      let seg = cur.tagName.toLowerCase();
      if (cur.classList.length > 0) {
        const cls = Array.from(cur.classList)
          .filter(c => !c.startsWith('se-') && c !== 'active')
          .slice(0, 2).join('.');
        if (cls) seg += '.' + cls;
      }
      // nth-child 추가 (같은 태그 형제가 있을 때)
      const parent = cur.parentElement;
      if (parent) {
        const sameTag = Array.from(parent.children).filter(c => c.tagName === cur.tagName);
        if (sameTag.length > 1) {
          const idx = sameTag.indexOf(cur) + 1;
          seg += `:nth-of-type(${idx})`;
        }
      }
      parts.unshift(seg);
      if (cur.classList.contains('slide')) break;
      cur = cur.parentElement;
    }
    return parts.join(' > ');
  }

  function resetSelected() {
    if (!selectedEl) return;
    const changes = changesMap.get(selectedEl);
    if (changes) {
      for (const prop of Object.keys(changes)) selectedEl.style[prop] = '';
      changesMap.delete(selectedEl);
    }
    buildSlidersForElement(selectedEl);
    updateOverlay();
    updateInfoBar();
    showFeedback('.se-reset', 'Done!');
  }

  function showFeedback(selector, msg) {
    const btn = panel?.querySelector(selector) || infoBar?.querySelector(selector);
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = msg;
    setTimeout(() => btn.textContent = orig, 1500);
  }

  /* ══════════════════════════════════════
     유틸
     ══════════════════════════════════════ */
  function makeDraggable(el, handle) {
    let ox, oy, sx, sy;
    handle.onmousedown = e => {
      e.preventDefault();
      ox = e.clientX; oy = e.clientY;
      const rect = el.getBoundingClientRect();
      sx = rect.left; sy = rect.top;
      document.onmousemove = e2 => {
        el.style.left = (sx + e2.clientX - ox) + 'px';
        el.style.top = (sy + e2.clientY - oy) + 'px';
        el.style.right = 'auto';
      };
      document.onmouseup = () => { document.onmousemove = null; document.onmouseup = null; };
    };
  }

  function addTopbarIndicator() {
    const topbar = document.querySelector('.topbar');
    if (!topbar || document.getElementById('se-indicator')) return;
    const ind = document.createElement('span');
    ind.id = 'se-indicator';
    ind.textContent = 'EDITOR';
    ind.style.cssText = 'color:#3b82f6;font-weight:800;font-size:11px;background:#3b82f620;padding:2px 8px;border-radius:6px;border:1px solid #3b82f6;margin-left:8px;';
    topbar.querySelector('.nav-group')?.prepend(ind);
  }

  function removeTopbarIndicator() { document.getElementById('se-indicator')?.remove(); }

  /* ══════════════════════════════════════
     슬라이드 전환 감지
     ══════════════════════════════════════ */
  let lastSlideN = null;
  function watchSlideChange() {
    setInterval(() => {
      if (!active) return;
      const cur = document.querySelector('.slide.active');
      const n = cur?.dataset?.n;
      if (n && n !== lastSlideN) { lastSlideN = n; deselect(); hideGrid(); showGrid(); }
    }, 300);
  }

  /* ══════════════════════════════════════
     초기화
     ══════════════════════════════════════ */
  function init() {
    createPanel();
    createOverlay();
    createInfoBar();
    watchSlideChange();

    window.addEventListener('resize', () => { if (selectedEl) updateOverlay(); });
    window.addEventListener('scroll', () => { if (selectedEl) updateOverlay(); }, true);

    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.target.isContentEditable) return;
      if ((e.key === 'e' || e.key === 'E') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault(); toggle();
      }
      if (active && e.key === 'Escape') deselect();

      // 화살표 키: 선택된 오브젝트 이동 (Shift: 10px, 기본: 1px)
      if (active && selectedEl && ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
        e.preventDefault();
        ensureAbsolute(selectedEl);
        const step = e.shiftKey ? 10 : 1;
        const cs = getComputedStyle(selectedEl);
        let left = parseFloat(cs.left) || 0;
        let top = parseFloat(cs.top) || 0;
        if (e.key === 'ArrowUp') top -= step;
        else if (e.key === 'ArrowDown') top += step;
        else if (e.key === 'ArrowLeft') left -= step;
        else if (e.key === 'ArrowRight') left += step;
        selectedEl.style.left = Math.round(left) + 'px';
        selectedEl.style.top = Math.round(top) + 'px';
        recordChange(selectedEl, 'left', selectedEl.style.left);
        recordChange(selectedEl, 'top', selectedEl.style.top);
        updateOverlay();
        updateInfoBar();
      }

      // Tab도 유지 (부모/자식)
      if (active && e.key === 'Tab' && selectedEl) {
        e.preventDefault();
        if (e.shiftKey) {
          const parent = selectedEl.parentElement;
          if (parent && isSelectable(parent)) select(parent);
        } else {
          const child = Array.from(selectedEl.children).find(c => isSelectable(c));
          if (child) select(child);
        }
      }
    });

    // topbar 버튼
    const topbar = document.querySelector('.topbar');
    if (topbar) {
      const btn = document.createElement('button');
      btn.textContent = '⚙';
      btn.title = 'Slide Editor (E)';
      btn.style.cssText = 'background:none;border:1px solid #3b82f6;border-radius:6px;padding:2px 8px;cursor:pointer;font-size:16px;margin-left:8px;color:#3b82f6;';
      btn.onclick = toggle;
      topbar.querySelector('.nav-group')?.prepend(btn);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
