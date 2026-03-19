/**
 * WYSIWYG Slide Editor — 파워포인트처럼 요소를 마우스로 이동/리사이즈
 * 'W' 키로 토글, 클릭으로 선택, 드래그로 이동, 핸들로 리사이즈
 */
(function() {
  'use strict';

  let active = false;
  let selectedEl = null;
  let overlay = null;      // 선택 표시 오버레이
  let handles = [];        // 리사이즈 핸들 8개
  let infoPanel = null;    // 하단 정보 패널
  let changesMap = new Map(); // element → {prop: value} 변경 기록
  let dragState = null;    // 드래그 상태

  const HANDLE_SIZE = 10;
  const HANDLE_POSITIONS = ['nw','n','ne','e','se','s','sw','w'];

  /* (init removed — logic merged into start()) */

  /* ── 오버레이 (선택 표시 + 핸들) ── */
  function createOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'wysiwyg-overlay';
    overlay.style.cssText = `
      position: fixed; pointer-events: none; z-index: 99990;
      border: 2px solid #3b82f6; border-radius: 2px;
      display: none;
    `;
    document.body.appendChild(overlay);

    // 8개 리사이즈 핸들
    HANDLE_POSITIONS.forEach(pos => {
      const h = document.createElement('div');
      h.className = 'wysiwyg-handle';
      h.dataset.pos = pos;
      h.style.cssText = `
        position: fixed; width: ${HANDLE_SIZE}px; height: ${HANDLE_SIZE}px;
        background: #3b82f6; border: 1px solid #fff; border-radius: 2px;
        pointer-events: auto; z-index: 99991; display: none;
        cursor: ${getCursor(pos)};
      `;
      h.addEventListener('mousedown', e => startResize(e, pos));
      document.body.appendChild(h);
      handles.push(h);
    });
  }

  function getCursor(pos) {
    const map = {nw:'nw-resize',n:'n-resize',ne:'ne-resize',e:'e-resize',
                 se:'se-resize',s:'s-resize',sw:'sw-resize',w:'w-resize'};
    return map[pos] || 'default';
  }

  /* ── 정보 패널 ── */
  function createInfoPanel() {
    infoPanel = document.createElement('div');
    infoPanel.id = 'wysiwyg-info';
    infoPanel.style.cssText = `
      position: fixed; bottom: 12px; left: 50%; transform: translateX(-50%);
      background: #1a1a2e; color: #e0e0e0; border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4); z-index: 99992;
      font-family: -apple-system, sans-serif; font-size: 12px;
      display: none; padding: 8px 16px; gap: 12px; align-items: center;
      max-width: 90vw;
    `;
    infoPanel.innerHTML = `
      <span class="wi-mode" style="color:#3b82f6;font-weight:700">WYSIWYG</span>
      <span class="wi-el" style="color:#86efac;font-family:'SF Mono',monospace"></span>
      <span class="wi-size" style="color:#ccc;font-family:'SF Mono',monospace"></span>
      <span class="wi-pos" style="color:#ccc;font-family:'SF Mono',monospace"></span>
      <button class="wi-copy" style="
        background:#2a2a4a;color:#86efac;border:1px solid #86efac44;
        border-radius:5px;padding:2px 10px;cursor:pointer;font-size:11px;
      ">Copy CSS</button>
      <button class="wi-reset" style="
        background:#2a2a4a;color:#f87171;border:1px solid #f8717144;
        border-radius:5px;padding:2px 10px;cursor:pointer;font-size:11px;
      ">Reset</button>
      <span class="wi-hint" style="color:#666;font-size:10px">W:toggle Tab:parent Shift+Tab:child ESC:deselect</span>
    `;
    document.body.appendChild(infoPanel);

    infoPanel.querySelector('.wi-copy').onclick = copyCSS;
    infoPanel.querySelector('.wi-reset').onclick = resetSelected;
  }

  /* ── 토글 ── */
  function toggle() {
    active = !active;
    if (active) {
      enableEditing();
    } else {
      disableEditing();
    }
  }

  function enableEditing() {
    infoPanel.style.display = 'flex';
    infoPanel.querySelector('.wi-el').textContent = 'Click an element';
    infoPanel.querySelector('.wi-size').textContent = '';
    infoPanel.querySelector('.wi-pos').textContent = '';

    // 슬라이드 내 요소에 클릭 이벤트 추가
    document.addEventListener('click', onClickCapture, true);
    document.addEventListener('mousedown', onDragStart, true);
    document.addEventListener('mousemove', onDragMove, true);
    document.addEventListener('mouseup', onDragEnd, true);

    // 호버 효과용
    document.addEventListener('mouseover', onHover, true);
    document.addEventListener('mouseout', onHoverOut, true);

    // topbar 버튼에 표시
    addTopbarIndicator();
  }

  function disableEditing() {
    deselect();
    infoPanel.style.display = 'none';

    document.removeEventListener('click', onClickCapture, true);
    document.removeEventListener('mousedown', onDragStart, true);
    document.removeEventListener('mousemove', onDragMove, true);
    document.removeEventListener('mouseup', onDragEnd, true);
    document.removeEventListener('mouseover', onHover, true);
    document.removeEventListener('mouseout', onHoverOut, true);

    // 호버 효과 제거
    document.querySelectorAll('[data-wysiwyg-hover]').forEach(el => {
      el.removeAttribute('data-wysiwyg-hover');
      el.style.outline = '';
    });

    removeTopbarIndicator();
  }

  /* ── topbar 표시 ── */
  function addTopbarIndicator() {
    const topbar = document.querySelector('.topbar');
    if (!topbar || document.getElementById('wysiwyg-indicator')) return;
    const ind = document.createElement('span');
    ind.id = 'wysiwyg-indicator';
    ind.textContent = 'WYSIWYG';
    ind.style.cssText = `
      color:#3b82f6;font-weight:800;font-size:11px;
      background:#3b82f620;padding:2px 8px;border-radius:6px;
      border:1px solid #3b82f6;margin-left:8px;
    `;
    topbar.querySelector('.nav-group')?.prepend(ind);
  }

  function removeTopbarIndicator() {
    document.getElementById('wysiwyg-indicator')?.remove();
  }

  /* ── 선택 가능한 요소인지 판단 ── */
  function isSelectable(el) {
    if (!el) return false;
    // 자체 UI 요소 제외
    if (el.closest('#wysiwyg-info') || el.closest('#wysiwyg-overlay') ||
        el.closest('#slide-editor') || el.closest('.topbar') ||
        el.classList.contains('wysiwyg-handle')) return false;
    // 슬라이드 영역 내 요소만
    const slide = el.closest('.slide');
    if (!slide) return false;
    // 너무 큰 컨테이너(slide 자체, slides-area)는 제외
    if (el.classList.contains('slide') || el.classList.contains('slides-area')) return false;
    // 최소 크기 있는 요소만
    const rect = el.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return false;
    return true;
  }

  /* ── 호버 ── */
  function onHover(e) {
    if (!active || dragState) return;
    const el = e.target;
    if (!isSelectable(el)) return;
    if (el === selectedEl) return;
    el.setAttribute('data-wysiwyg-hover', '1');
    el.style.outline = '1px dashed #3b82f680';
  }

  function onHoverOut(e) {
    const el = e.target;
    if (el.hasAttribute('data-wysiwyg-hover')) {
      el.removeAttribute('data-wysiwyg-hover');
      if (el !== selectedEl) el.style.outline = '';
    }
  }

  /* ── 클릭으로 선택 ── */
  function onClickCapture(e) {
    if (!active) return;
    // 핸들 클릭은 무시 (리사이즈에서 처리)
    if (e.target.classList.contains('wysiwyg-handle')) return;
    // 자체 UI 클릭은 무시
    if (e.target.closest('#wysiwyg-info') || e.target.closest('#slide-editor')) return;
    // topbar는 무시 (네비게이션 허용)
    if (e.target.closest('.topbar')) return;

    e.preventDefault();
    e.stopPropagation();

    const el = e.target;
    if (!isSelectable(el)) {
      deselect();
      return;
    }

    select(el);
  }

  /* ── 선택 ── */
  function select(el) {
    // 이전 선택 해제
    if (selectedEl && selectedEl !== el) {
      selectedEl.style.outline = '';
    }

    selectedEl = el;
    selectedEl.style.outline = '2px solid #3b82f6';
    updateOverlay();
    updateInfo();
  }

  function deselect() {
    if (selectedEl) {
      selectedEl.style.outline = '';
      selectedEl = null;
    }
    overlay.style.display = 'none';
    handles.forEach(h => h.style.display = 'none');
    if (infoPanel.style.display !== 'none') {
      infoPanel.querySelector('.wi-el').textContent = 'Click an element';
      infoPanel.querySelector('.wi-size').textContent = '';
      infoPanel.querySelector('.wi-pos').textContent = '';
    }
  }

  /* ── 오버레이 + 핸들 위치 업데이트 ── */
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
      const pos = h.dataset.pos;
      const [x, y] = positions[pos];
      h.style.display = 'block';
      h.style.left = x + 'px';
      h.style.top = y + 'px';
    });
  }

  /* ── 정보 패널 업데이트 ── */
  function updateInfo() {
    if (!selectedEl) return;
    const r = selectedEl.getBoundingClientRect();
    const tag = selectedEl.tagName.toLowerCase();
    const cls = selectedEl.className ? '.' + selectedEl.className.split(' ').filter(c =>
      c && !c.startsWith('wysiwyg')).join('.') : '';
    infoPanel.querySelector('.wi-el').textContent = tag + cls;
    infoPanel.querySelector('.wi-size').textContent = `${Math.round(r.width)}×${Math.round(r.height)}`;

    // 현재 transform 표시
    const tx = getTranslateX(selectedEl);
    const ty = getTranslateY(selectedEl);
    if (tx !== 0 || ty !== 0) {
      infoPanel.querySelector('.wi-pos').textContent = `move(${Math.round(tx)},${Math.round(ty)})`;
    } else {
      infoPanel.querySelector('.wi-pos').textContent = '';
    }
  }

  /* ── 드래그 이동 ── */
  function onDragStart(e) {
    if (!active || !selectedEl) return;
    // 핸들 드래그는 리사이즈 (별도 처리)
    if (e.target.classList.contains('wysiwyg-handle')) return;
    // UI 요소는 무시
    if (e.target.closest('#wysiwyg-info') || e.target.closest('#slide-editor') ||
        e.target.closest('.topbar')) return;

    const el = e.target.closest('.slide') ? e.target : null;
    if (!el || !isSelectable(el)) return;

    // 선택된 요소 위에서만 드래그 시작
    const r = selectedEl.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right ||
        e.clientY < r.top || e.clientY > r.bottom) return;

    e.preventDefault();
    e.stopPropagation();

    dragState = {
      type: 'move',
      startX: e.clientX,
      startY: e.clientY,
      origTx: getTranslateX(selectedEl),
      origTy: getTranslateY(selectedEl),
    };
  }

  function onDragMove(e) {
    if (!dragState || !selectedEl) return;
    e.preventDefault();

    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;

    if (dragState.type === 'move') {
      const newTx = dragState.origTx + dx;
      const newTy = dragState.origTy + dy;
      setTranslate(selectedEl, newTx, newTy);
      recordChange(selectedEl, 'transform', selectedEl.style.transform);
    } else if (dragState.type === 'resize') {
      applyResize(dx, dy);
    }

    updateOverlay();
    updateInfo();
  }

  function onDragEnd(e) {
    if (dragState) {
      dragState = null;
    }
  }

  /* ── 리사이즈 ── */
  function startResize(e, pos) {
    if (!selectedEl) return;
    e.preventDefault();
    e.stopPropagation();

    const r = selectedEl.getBoundingClientRect();
    const cs = getComputedStyle(selectedEl);

    dragState = {
      type: 'resize',
      handle: pos,
      startX: e.clientX,
      startY: e.clientY,
      origWidth: r.width,
      origHeight: r.height,
      origTx: getTranslateX(selectedEl),
      origTy: getTranslateY(selectedEl),
      origLeft: r.left,
      origTop: r.top,
    };
  }

  function applyResize(dx, dy) {
    if (!dragState || dragState.type !== 'resize') return;
    const pos = dragState.handle;
    let newW = dragState.origWidth;
    let newH = dragState.origHeight;
    let newTx = dragState.origTx;
    let newTy = dragState.origTy;

    // 핸들 위치에 따라 크기/위치 조절
    if (pos.includes('e')) { newW = dragState.origWidth + dx; }
    if (pos.includes('w')) { newW = dragState.origWidth - dx; newTx = dragState.origTx + dx; }
    if (pos.includes('s')) { newH = dragState.origHeight + dy; }
    if (pos.includes('n')) { newH = dragState.origHeight - dy; newTy = dragState.origTy + dy; }

    // 최소 크기
    newW = Math.max(30, newW);
    newH = Math.max(20, newH);

    // 적용
    selectedEl.style.width = newW + 'px';
    selectedEl.style.height = newH + 'px';
    selectedEl.style.maxWidth = 'none';
    selectedEl.style.maxHeight = 'none';
    selectedEl.style.flexBasis = 'auto';
    selectedEl.style.flex = '0 0 auto';

    if (pos.includes('w') || pos.includes('n')) {
      setTranslate(selectedEl, newTx, newTy);
      recordChange(selectedEl, 'transform', selectedEl.style.transform);
    }

    recordChange(selectedEl, 'width', selectedEl.style.width);
    recordChange(selectedEl, 'height', selectedEl.style.height);
    recordChange(selectedEl, 'maxWidth', 'none');
    recordChange(selectedEl, 'maxHeight', 'none');
    recordChange(selectedEl, 'flex', '0 0 auto');
  }

  /* ── Transform 유틸 ── */
  function getTranslateX(el) {
    const m = el.style.transform?.match(/translate\(([^,]+)/);
    if (m) return parseFloat(m[1]) || 0;
    const m2 = el.style.transform?.match(/translateX\(([^)]+)\)/);
    if (m2) return parseFloat(m2[1]) || 0;
    return 0;
  }

  function getTranslateY(el) {
    const m = el.style.transform?.match(/translate\([^,]+,\s*([^)]+)/);
    if (m) return parseFloat(m[1]) || 0;
    const m2 = el.style.transform?.match(/translateY\(([^)]+)\)/);
    if (m2) return parseFloat(m2[1]) || 0;
    // clamp 등 CSS 함수도 체크
    const comp = getComputedStyle(el).transform;
    if (comp && comp !== 'none') {
      const mat = comp.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,([^,]+),\s*([^)]+)\)/);
      if (mat) return parseFloat(mat[2]) || 0;
    }
    return 0;
  }

  function setTranslate(el, tx, ty) {
    // 기존 transform에서 translate만 교체
    let t = el.style.transform || '';
    // 기존 translate 제거
    t = t.replace(/translate\([^)]*\)/g, '').replace(/translateX\([^)]*\)/g, '')
         .replace(/translateY\([^)]*\)/g, '').trim();
    const translatePart = `translate(${Math.round(tx)}px, ${Math.round(ty)}px)`;
    el.style.transform = translatePart + (t ? ' ' + t : '');
  }

  /* ── 변경 기록 ── */
  function recordChange(el, prop, value) {
    if (!changesMap.has(el)) changesMap.set(el, {});
    changesMap.get(el)[prop] = value;
  }

  /* ── CSS 복사 ── */
  function copyCSS() {
    if (!selectedEl) return;
    const changes = changesMap.get(selectedEl);
    if (!changes || Object.keys(changes).length === 0) {
      showCopyFeedback('No changes');
      return;
    }

    const tag = selectedEl.tagName.toLowerCase();
    const cls = selectedEl.className ? '.' + selectedEl.className.split(' ')
      .filter(c => c && !c.startsWith('wysiwyg')).join('.') : '';

    let lines = [`/* ${tag}${cls} */`];
    for (const [prop, val] of Object.entries(changes)) {
      const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
      lines.push(`${cssProp}: ${val};`);
    }
    const text = lines.join('\n');
    navigator.clipboard.writeText(text).then(() => showCopyFeedback('Copied!'));
  }

  function showCopyFeedback(msg) {
    const btn = infoPanel.querySelector('.wi-copy');
    const orig = btn.textContent;
    btn.textContent = msg;
    setTimeout(() => btn.textContent = orig, 1500);
  }

  /* ── 선택 요소 리셋 ── */
  function resetSelected() {
    if (!selectedEl) return;
    const changes = changesMap.get(selectedEl);
    if (changes) {
      for (const prop of Object.keys(changes)) {
        selectedEl.style[prop] = '';
      }
      changesMap.delete(selectedEl);
    }
    updateOverlay();
    updateInfo();
  }

  /* ── 윈도우 리사이즈/스크롤 시 오버레이 동기화 ── */
  function syncOverlay() {
    if (selectedEl) updateOverlay();
  }

  /* ── 슬라이드 전환 감지 ── */
  let lastSlideN = null;
  function watchSlideChange() {
    setInterval(() => {
      if (!active) return;
      const cur = document.querySelector('.slide.active');
      const n = cur?.dataset?.n;
      if (n && n !== lastSlideN) {
        lastSlideN = n;
        deselect();
      }
    }, 300);
  }

  /* ── 시작 ── */
  function start() {
    createOverlay();
    createInfoPanel();
    watchSlideChange();

    window.addEventListener('resize', syncOverlay);
    window.addEventListener('scroll', syncOverlay, true);

    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'w' || e.key === 'W') {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        e.preventDefault();
        toggle();
      }
      if (active && e.key === 'Escape') deselect();
      // Tab: 부모 요소 선택, Shift+Tab: 자식 요소 선택
      if (active && e.key === 'Tab' && selectedEl) {
        e.preventDefault();
        if (e.shiftKey) {
          const child = selectedEl.firstElementChild;
          if (child && isSelectable(child)) select(child);
        } else {
          const parent = selectedEl.parentElement;
          if (parent && isSelectable(parent)) select(parent);
        }
      }
    });

    // topbar에 W 버튼 추가
    const topbar = document.querySelector('.topbar');
    if (topbar) {
      const btn = document.createElement('button');
      btn.textContent = '✎';
      btn.title = 'WYSIWYG Editor (W)';
      btn.style.cssText = 'background:none;border:1px solid #3b82f6;border-radius:6px;padding:2px 8px;cursor:pointer;font-size:16px;margin-left:4px;color:#3b82f6;';
      btn.onclick = toggle;
      topbar.querySelector('.nav-group')?.prepend(btn);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
