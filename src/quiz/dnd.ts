/**
 * ポインターイベントによるドラッグ&ドロップ (マウス・タッチ共通)。
 * - マウス: 6px 動かしたらドラッグ開始
 * - タッチ/ペン: 250ms 長押しでドラッグ開始。長押し前に動いたら通常のスクロールに任せる
 * ドラッグ中は要素の複製 (ghost) をポインターに追従させ、ドロップ先は zones() から elementFromPoint で判定する。
 */
export interface DragOptions {
  /** ドロップ先候補。ドラッグ開始のたびに評価する */
  zones: () => HTMLElement[];
  /** ドロップ時。zone が null ならドロップ先なし (元に戻す) */
  onDrop: (zone: HTMLElement | null) => void;
}

const MOUSE_THRESHOLD = 6;
const TOUCH_CANCEL_THRESHOLD = 10;
const HOLD_MS = 250;

export function makeDraggable(el: HTMLElement, opts: DragOptions): void {
  let pointerId = -1;
  let startX = 0;
  let startY = 0;
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;
  let holdTimer: ReturnType<typeof setTimeout> | null = null;
  let ghost: HTMLElement | null = null;

  el.classList.add("draggable");

  function zoneAt(x: number, y: number): HTMLElement | null {
    const target = document.elementFromPoint(x, y);
    if (!target) return null;
    return opts.zones().find((z) => z.contains(target)) ?? null;
  }

  function begin(x: number, y: number): void {
    dragging = true;
    const r = el.getBoundingClientRect();
    offsetX = x - r.left;
    offsetY = y - r.top;
    ghost = el.cloneNode(true) as HTMLElement;
    ghost.classList.add("drag-ghost");
    ghost.style.width = `${r.width}px`;
    document.body.appendChild(ghost);
    el.classList.add("is-dragging");
    move(x, y);
  }

  function move(x: number, y: number): void {
    if (!ghost) return;
    ghost.style.transform = `translate(${x - offsetX}px, ${y - offsetY}px)`;
    const zone = zoneAt(x, y);
    for (const z of opts.zones()) z.classList.toggle("is-over", z === zone);
  }

  function clearHold(): void {
    if (holdTimer !== null) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
  }

  function finish(x: number | null, y: number | null): void {
    clearHold();
    pointerId = -1;
    if (!dragging) return;
    dragging = false;
    ghost?.remove();
    ghost = null;
    el.classList.remove("is-dragging");
    for (const z of opts.zones()) z.classList.remove("is-over");
    opts.onDrop(x === null || y === null ? null : zoneAt(x, y));
  }

  el.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || pointerId !== -1) return;
    // ボタンなど内側の操作要素からはドラッグしない
    if ((e.target as HTMLElement).closest("button")) return;
    pointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    el.setPointerCapture(pointerId);
    if (e.pointerType !== "mouse") {
      holdTimer = setTimeout(() => {
        holdTimer = null;
        begin(startX, startY);
      }, HOLD_MS);
    }
  });

  el.addEventListener("pointermove", (e) => {
    if (e.pointerId !== pointerId) return;
    if (dragging) {
      move(e.clientX, e.clientY);
      return;
    }
    const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
    if (e.pointerType === "mouse") {
      if (dist >= MOUSE_THRESHOLD) begin(e.clientX, e.clientY);
    } else if (dist >= TOUCH_CANCEL_THRESHOLD) {
      // 長押し前に動いた → スクロール操作とみなす
      clearHold();
      pointerId = -1;
    }
  });

  el.addEventListener("pointerup", (e) => {
    if (e.pointerId !== pointerId) return;
    finish(e.clientX, e.clientY);
  });
  el.addEventListener("pointercancel", (e) => {
    if (e.pointerId !== pointerId) return;
    finish(null, null);
  });

  // ドラッグ中はスクロールさせない (touch-action を常時 none にするとスクロールできなくなるため)
  el.addEventListener("touchmove", (e) => {
    if (dragging) e.preventDefault();
  }, { passive: false });
  el.addEventListener("contextmenu", (e) => {
    if (dragging || holdTimer !== null) e.preventDefault();
  });
  // ネイティブの DnD (画像・テキスト選択のドラッグ) を無効化
  el.addEventListener("dragstart", (e) => e.preventDefault());
}
