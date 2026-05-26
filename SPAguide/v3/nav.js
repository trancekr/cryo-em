/* v3 deck navigation
   - Arrow keys / Space / PageUp/Down: prev/next
   - Home/End: first/last
   - I: toggle index overlay
   - Esc: close index
   - Hash sync (#3 = slide 3)
   - Auto-fit zoom for smaller viewports (preserves 1920×1080 layout)
*/

(function () {
  const deck = document.querySelector('.deck');
  const slides = Array.from(document.querySelectorAll('.slide, .bl-slide'));
  const counter = document.querySelector('.deck-counter');
  const counterCur = counter?.querySelector('.cur');
  const counterTotal = counter?.querySelector('.total');
  const pageInfo = document.getElementById('page-info');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const progress = document.querySelector('.deck-progress-fill');
  const indexOverlay = document.querySelector('.index-overlay');
  const total = slides.length;
  const printMode = new URLSearchParams(location.search).has('print');

  if (!total) return;
  if (counterTotal) counterTotal.textContent = String(total).padStart(2, '0');

  let current = 0;

  const printButton = document.createElement('button');
  printButton.type = 'button';
  printButton.className = 'deck-print';
  printButton.setAttribute('aria-label', 'Print slides or save as PDF');
  printButton.textContent = 'PDF';
  (deck || document.body).appendChild(printButton);

  function enterPrintMode(openDialog = false) {
    document.documentElement.classList.add('print-mode');
    indexOverlay?.classList.remove('open');
    if (deck) {
      deck.removeAttribute('style');
    } else {
      document.body.style.zoom = '';
    }
    slides.forEach((slide) => slide.classList.add('active'));
    if (openDialog) {
      setTimeout(() => window.print(), 120);
    }
  }

  printButton.addEventListener('click', () => enterPrintMode(true));

  function showIndex(idx) {
    if (document.documentElement.classList.contains('print-mode')) return;
    current = ((idx % total) + total) % total;
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    if (counterCur) counterCur.textContent = String(current + 1).padStart(2, '0');
    if (pageInfo) pageInfo.textContent = `${current + 1} / ${total}`;
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === total - 1;
    if (progress) progress.style.width = `${((current + 1) / total) * 100}%`;
    history.replaceState(null, '', `#${current + 1}`);
    if (typeof window.onBrandlogySlideChange === 'function') {
      window.onBrandlogySlideChange(current + 1);
    }
  }

  window.show = (n) => showIndex((parseInt(n, 10) || 1) - 1);
  window.go = (d) => showIndex(current + d);
  window.jumpToSlide = () => {
    const input = prompt(`Go to slide (1-${total}):`, current + 1);
    if (input === null) return;
    const n = parseInt(input, 10);
    if (Number.isFinite(n) && n >= 1 && n <= total) window.show(n);
  };

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (indexOverlay?.classList.contains('open')) {
      if (e.key === 'Escape' || e.key === 'i' || e.key === 'I') {
        indexOverlay.classList.remove('open');
        e.preventDefault();
      }
      return;
    }
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      showIndex(current + 1); e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      showIndex(current - 1); e.preventDefault();
    } else if (e.key === 'Home') {
      showIndex(0); e.preventDefault();
    } else if (e.key === 'End') {
      showIndex(total - 1); e.preventDefault();
    } else if (e.key === 'i' || e.key === 'I') {
      indexOverlay?.classList.add('open'); e.preventDefault();
    } else if ((e.key === 't' || e.key === 'T') && typeof window.cycleTheme === 'function') {
      if (document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
      window.cycleTheme(); e.preventDefault();
    }
  });

  // Buttons
  document.querySelector('.nav-arrow.prev')?.addEventListener('click', () => showIndex(current - 1));
  document.querySelector('.nav-arrow.next')?.addEventListener('click', () => showIndex(current + 1));
  prevBtn?.addEventListener('click', () => showIndex(current - 1));
  nextBtn?.addEventListener('click', () => showIndex(current + 1));
  pageInfo?.addEventListener('click', window.jumpToSlide);

  // Index card click
  if (indexOverlay) {
    indexOverlay.querySelectorAll('.index-card').forEach((card, i) => {
      card.addEventListener('click', () => {
        showIndex(i);
        indexOverlay.classList.remove('open');
      });
    });
    indexOverlay.querySelector('.index-close')?.addEventListener('click', () => {
      indexOverlay.classList.remove('open');
    });
  }

  // Init from hash
  const hashIdx = parseInt(location.hash.slice(1), 10) - 1;
  showIndex(Number.isFinite(hashIdx) && hashIdx >= 0 ? hashIdx : 0);
  window.addEventListener('hashchange', () => {
    const idx = parseInt(location.hash.slice(1), 10) - 1;
    if (Number.isFinite(idx) && idx >= 0 && idx < total) showIndex(idx);
  });

  // Auto-fit zoom (preserves 1920×1080 layout for any viewport)
  function fit() {
    if (document.documentElement.classList.contains('print-mode')) return;
    const sx = window.innerWidth / 1920;
    const sy = window.innerHeight / 1080;
    const scale = Math.min(sx, sy);
    if (deck) {
      deck.style.position = 'absolute';
      deck.style.left = '50%';
      deck.style.top = '50%';
      deck.style.transform = `translate(-50%, -50%) scale(${scale})`;
      deck.style.transformOrigin = 'center center';
      deck.style.width  = '1920px';
      deck.style.height = '1080px';
    } else {
      document.body.style.zoom = scale;
    }
  }
  if (printMode) {
    enterPrintMode(false);
  } else {
    fit();
    window.addEventListener('resize', fit);
  }

  // Click outside to close index
  indexOverlay?.addEventListener('click', (e) => {
    if (e.target === indexOverlay) indexOverlay.classList.remove('open');
  });

  // Prevent image drag
  document.querySelectorAll('img.pdf-page').forEach((img) => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
  });

  // Locator slide: click image card → toggle BOTH panel and highlight (brandlogy s2 pattern)
  document.querySelectorAll('.locator-card').forEach((card) => {
    card.addEventListener('click', () => {
      const n = card.id.replace('loc-card-', '');
      const panel = document.getElementById('loc-panel-' + n);
      const hl    = document.getElementById('loc-hl-' + n);
      const on    = panel && !panel.classList.contains('open');
      if (panel) panel.classList.toggle('open', on);
      if (hl)    hl.classList.toggle('open', on);
    });
  });

  // ============================================================
  //  Mini editor (v3): H 키 → 활성 슬라이드의 .locator-highlight /
  //                          .locator-panel / .emphasis 편집 모드.
  //  드래그=이동, 모서리 핸들=리사이즈, C=클립보드 복사, H=종료
  // ============================================================
  let editMode = false;
  let editTarget = null;
  let editLabel = null;
  let editHandles = [];

  function deckScale() {
    const t = getComputedStyle(deck).transform;
    if (t && t !== 'none') {
      const m = t.match(/matrix\(([^)]+)\)/);
      if (m) return parseFloat(m[1].split(',')[0]);
    }
    return 1;
  }

  function pickEditTarget() {
    const slide = document.querySelector('.slide.active');
    if (!slide) return null;
    return slide.querySelector('.locator-highlight, .locator-panel, .emphasis');
  }

  function makeLabel() {
    const lbl = document.createElement('div');
    lbl.style.cssText =
      'position:fixed;top:18px;left:50%;transform:translateX(-50%);' +
      'background:rgba(11,13,17,0.92);color:#fff;padding:10px 18px;' +
      'border-radius:999px;font:600 13px/1 ui-monospace,monospace;' +
      'letter-spacing:0.04em;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.4);';
    document.body.appendChild(lbl);
    return lbl;
  }

  function updateLabel() {
    if (!editLabel || !editTarget) return;
    const s = editTarget.style;
    const tag = (editTarget.className || '').split(' ')[0];
    editLabel.textContent =
      `[${tag}]  left:${parseInt(s.left)||0}  top:${parseInt(s.top)||0}  ` +
      `width:${parseInt(s.width)||0}  height:${parseInt(s.height)||0}   ` +
      `(C=copy · H=exit · click target to switch)`;
  }

  function clearHandles() {
    editHandles.forEach(h => h.remove());
    editHandles = [];
  }

  function drawHandles() {
    clearHandles();
    if (!editTarget) return;
    const positions = [
      ['nw', 0, 0], ['n', 0.5, 0], ['ne', 1, 0],
      ['w', 0, 0.5],               ['e', 1, 0.5],
      ['sw', 0, 1], ['s', 0.5, 1], ['se', 1, 1],
    ];
    positions.forEach(([id, fx, fy]) => {
      const h = document.createElement('div');
      h.dataset.handle = id;
      const cur = (id.includes('n') || id.includes('s')) && (id.includes('e') || id.includes('w'))
        ? id + '-resize'
        : (id === 'n' || id === 's' ? 'ns-resize' : 'ew-resize');
      h.style.cssText =
        `position:absolute;width:14px;height:14px;background:#fff;border:2px solid #d8232a;` +
        `border-radius:50%;left:calc(${fx*100}% - 7px);top:calc(${fy*100}% - 7px);` +
        `cursor:${cur};z-index:50;box-shadow:0 2px 6px rgba(0,0,0,0.3);`;
      editTarget.appendChild(h);
      editHandles.push(h);
      h.addEventListener('mousedown', (e) => startResize(e, id));
    });
  }

  function setTarget(el) {
    if (editTarget) editTarget.style.outline = '';
    clearHandles();
    editTarget = el;
    if (!el) return;
    // ensure inline style has measured values
    const cs = getComputedStyle(el);
    if (!el.style.left)   el.style.left   = parseInt(cs.left)   + 'px';
    if (!el.style.top)    el.style.top    = parseInt(cs.top)    + 'px';
    if (!el.style.width)  el.style.width  = parseInt(cs.width)  + 'px';
    if (!el.style.height) el.style.height = parseInt(cs.height) + 'px';
    el.style.outline = '2px dashed #2563eb';
    el.style.pointerEvents = 'auto';
    drawHandles();
    updateLabel();
  }

  function startMove(e) {
    if (!editTarget || e.target.dataset.handle) return;
    e.preventDefault(); e.stopPropagation();
    const sc = deckScale();
    const startX = e.clientX, startY = e.clientY;
    const startLeft = parseInt(editTarget.style.left) || 0;
    const startTop  = parseInt(editTarget.style.top)  || 0;
    function move(ev) {
      const dx = (ev.clientX - startX) / sc;
      const dy = (ev.clientY - startY) / sc;
      editTarget.style.left = Math.round(startLeft + dx) + 'px';
      editTarget.style.top  = Math.round(startTop  + dy) + 'px';
      updateLabel();
    }
    function up() {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    }
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }

  function startResize(e, dir) {
    if (!editTarget) return;
    e.preventDefault(); e.stopPropagation();
    const sc = deckScale();
    const startX = e.clientX, startY = e.clientY;
    const sL = parseInt(editTarget.style.left)   || 0;
    const sT = parseInt(editTarget.style.top)    || 0;
    const sW = parseInt(editTarget.style.width)  || 0;
    const sH = parseInt(editTarget.style.height) || 0;
    function move(ev) {
      const dx = (ev.clientX - startX) / sc;
      const dy = (ev.clientY - startY) / sc;
      let L=sL, T=sT, W=sW, H=sH;
      if (dir.includes('e')) W = Math.max(20, sW + dx);
      if (dir.includes('w')) { W = Math.max(20, sW - dx); L = sL + (sW - W); }
      if (dir.includes('s')) H = Math.max(20, sH + dy);
      if (dir.includes('n')) { H = Math.max(20, sH - dy); T = sT + (sH - H); }
      editTarget.style.left   = Math.round(L) + 'px';
      editTarget.style.top    = Math.round(T) + 'px';
      editTarget.style.width  = Math.round(W) + 'px';
      editTarget.style.height = Math.round(H) + 'px';
      updateLabel();
    }
    function up() {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    }
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }

  function copyCoords() {
    if (!editTarget) return;
    const s = editTarget.style;
    const txt =
      `"${(editTarget.className||'').split(' ')[0]}": ` +
      `{"left":${parseInt(s.left)||0},"top":${parseInt(s.top)||0},` +
      `"width":${parseInt(s.width)||0},"height":${parseInt(s.height)||0}}`;
    navigator.clipboard.writeText(txt).then(() => {
      const old = editLabel.textContent;
      editLabel.textContent = '✔ copied: ' + txt;
      setTimeout(() => updateLabel(), 1200);
    });
  }

  function exitEdit() {
    editMode = false;
    if (editTarget) editTarget.style.outline = '';
    clearHandles();
    if (editLabel) { editLabel.remove(); editLabel = null; }
    editTarget = null;
  }

  function enterEdit() {
    editMode = true;
    editLabel = makeLabel();
    setTarget(pickEditTarget());
    if (!editTarget) editLabel.textContent = '편집할 요소 없음 (locator-highlight / locator-panel / emphasis)';
  }

  // mousedown on target → start move (handles intercept first)
  document.addEventListener('mousedown', (e) => {
    if (!editMode) return;
    // click on another candidate target inside active slide → switch
    const slide = document.querySelector('.slide.active');
    if (slide && slide.contains(e.target)) {
      const candidate = e.target.closest('.locator-highlight, .locator-panel, .emphasis');
      if (candidate && candidate !== editTarget) {
        setTarget(candidate);
        return;
      }
    }
    if (editTarget && editTarget.contains(e.target)) startMove(e);
  }, true);

  // H 토글, C 복사
  document.addEventListener('keydown', (e) => {
    if (e.key === 'h' || e.key === 'H') {
      if (editMode) exitEdit(); else enterEdit();
      e.preventDefault();
    } else if (editMode && (e.key === 'c' || e.key === 'C')) {
      copyCoords();
      e.preventDefault();
    } else if (editMode && e.key === 'Escape') {
      exitEdit();
      e.preventDefault();
    }
  });
})();
