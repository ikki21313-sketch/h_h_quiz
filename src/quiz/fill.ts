import type { AnswerResult, FillQuestion, Rng } from "../types";
import { shuffle } from "../data";
import { esc } from "./choice";
import { makeDraggable } from "./dnd";

/**
 * 穴埋め・組み合わせ。
 * pool あり: 共通候補を解答欄へドラッグ、または解答欄をタップ (選択状態) → 候補をタップ。
 *           候補をタップしたときに選択中の解答欄がなければ、最初の空欄に入る。使った候補は候補欄から消える。
 *           解答欄に入った候補は、タップまたは候補欄へドラッグで戻せる。解答欄同士のドラッグで入れ替え。
 * pool なし: 解答欄をタップするとその行の候補が開き、タップで入力する。
 */
export function renderFill(
  root: HTMLElement,
  q: FillQuestion,
  onAnswer: (r: AnswerResult) => void,
  rng: Rng = Math.random,
): void {
  const n = q.rows.length;
  const placed: (string | null)[] = q.rows.map(() => null);
  const pool = q.pool ? shuffle(q.pool, rng) : null;
  // 行専用候補はここでシャッフルして固定する
  const rowOptions = q.rows.map((r) => (r.options ? shuffle(r.options, rng) : []));
  let active: number | null = null; // 選択中の解答欄 (pool あり)
  let chooserOpen: number | null = null; // 候補を開いている行 (pool なし)
  let done = false;

  root.innerHTML = `
    <div class="fill">
      ${q.text ? `<p class="fill-text">${esc(q.text)}</p>` : ""}
      <p class="fill-hint">${
        pool
          ? "候補を解答欄へドラッグするか、解答欄をタップしてから候補をタップしてください。入れた候補はタップで戻せます。"
          : "解答欄をタップして候補から選んでください。"
      }</p>
      <div class="fill-body${pool ? " has-pool" : ""}">
        <div class="fill-slots"></div>
        ${pool ? `<div class="pool zone" data-zone="pool"></div>` : ""}
      </div>
      <button class="btn btn-primary" data-act="submit" disabled>決定</button>
    </div>`;
  const slotsEl = root.querySelector<HTMLElement>(".fill-slots")!;
  const poolEl = root.querySelector<HTMLElement>(".pool");
  const submitBtn = root.querySelector<HTMLButtonElement>('[data-act="submit"]')!;

  const zones = (): HTMLElement[] => {
    const z = Array.from(root.querySelectorAll<HTMLElement>(".slot-box"));
    if (poolEl) z.push(poolEl);
    return z;
  };

  function allFilled(): boolean {
    return placed.every((p) => p !== null);
  }

  function firstEmpty(): number | null {
    const i = placed.findIndex((p) => p === null);
    return i === -1 ? null : i;
  }

  function nextEmptyAfter(i: number): number | null {
    for (let k = 1; k <= n; k++) {
      const j = (i + k) % n;
      if (placed[j] === null) return j;
    }
    return null;
  }

  /** 候補 value を行 i に入れる。既に入っていた候補は候補欄へ戻る (pool あり) */
  function put(i: number, value: string): void {
    if (done) return;
    if (pool) {
      // 同じ候補が他の行にあれば外す (単一使用)
      const j = placed.indexOf(value);
      if (j !== -1 && j !== i) placed[j] = null;
    }
    placed[i] = value;
    active = pool ? nextEmptyAfter(i) : null;
    chooserOpen = null;
    draw();
  }

  function clear(i: number): void {
    if (done) return;
    placed[i] = null;
    active = i;
    draw();
  }

  function swap(i: number, j: number): void {
    if (done) return;
    [placed[i], placed[j]] = [placed[j], placed[i]];
    active = null;
    draw();
  }

  function slotHtml(i: number): string {
    const v = placed[i];
    const mark = done
      ? v === q.rows[i].answer
        ? `<span class="fill-mark">◯</span>`
        : `<span class="fill-mark">× → ${esc(q.rows[i].answer)}</span>`
      : "";
    const state = done ? (v === q.rows[i].answer ? " is-correct" : " is-wrong") : active === i ? " is-active" : "";
    const box =
      v === null
        ? `<div class="slot-box zone is-empty" data-i="${i}"><span class="slot-placeholder">${
            pool ? "ここにドロップ / タップして選択" : "タップして選択"
          }</span></div>`
        : `<div class="slot-box zone" data-i="${i}"><div class="chip chip-placed" data-i="${i}" data-value="${esc(v)}">${esc(v)}</div></div>`;
    const chooser =
      !pool && chooserOpen === i && !done
        ? `<div class="chooser">${rowOptions[i]
            .map((o) => `<button class="btn chip chip-option" data-value="${esc(o)}">${esc(o)}</button>`)
            .join("")}</div>`
        : "";
    return `<div class="slot${state}" data-i="${i}">
      <span class="slot-label">${esc(q.rows[i].label)}</span>
      ${box}
      ${mark}
      ${chooser}
    </div>`;
  }

  function draw(): void {
    slotsEl.innerHTML = q.rows.map((_, i) => slotHtml(i)).join("");
    if (pool && poolEl) {
      const remaining = pool.filter((v) => !placed.includes(v));
      poolEl.innerHTML =
        remaining.map((v) => `<div class="chip chip-pool" data-value="${esc(v)}">${esc(v)}</div>`).join("") ||
        `<p class="bin-empty">候補はすべて使用中</p>`;
    }
    bind();
    submitBtn.disabled = done || !allFilled();
  }

  function bind(): void {
    if (done) return;
    // 解答欄 (空) のタップ
    slotsEl.querySelectorAll<HTMLElement>(".slot-box.is-empty").forEach((box) => {
      box.addEventListener("click", () => {
        const i = Number(box.dataset.i);
        if (pool) {
          active = active === i ? null : i;
        } else {
          chooserOpen = chooserOpen === i ? null : i;
        }
        draw();
      });
    });
    // 解答欄に入った候補: タップで戻す / 変更、ドラッグで移動
    slotsEl.querySelectorAll<HTMLElement>(".chip-placed").forEach((chip) => {
      const i = Number(chip.dataset.i);
      chip.addEventListener("click", () => {
        if (pool) clear(i);
        else {
          chooserOpen = chooserOpen === i ? null : i;
          draw();
        }
      });
      if (pool) {
        makeDraggable(chip, {
          zones,
          onDrop: (zone) => {
            if (!zone) return;
            if (zone === poolEl) clear(i);
            else {
              const j = Number(zone.dataset.i);
              if (j !== i) swap(i, j);
            }
          },
        });
      }
    });
    // 行専用候補
    slotsEl.querySelectorAll<HTMLButtonElement>(".chip-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = Number(btn.closest<HTMLElement>(".slot")!.dataset.i);
        put(i, btn.dataset.value!);
      });
    });
    // 共通候補: タップで選択中 (または最初の空欄) へ、ドラッグで解答欄へ
    poolEl?.querySelectorAll<HTMLElement>(".chip-pool").forEach((chip) => {
      const value = chip.dataset.value!;
      chip.addEventListener("click", () => {
        const i = active ?? firstEmpty();
        if (i !== null) put(i, value);
      });
      makeDraggable(chip, {
        zones,
        onDrop: (zone) => {
          if (!zone || zone === poolEl) return;
          put(Number(zone.dataset.i), value);
        },
      });
    });
  }

  submitBtn.addEventListener("click", () => {
    if (done || !allFilled()) return;
    done = true;
    active = null;
    chooserOpen = null;
    draw();
    const correct = placed.every((v, i) => v === q.rows[i].answer);
    onAnswer({
      question: q,
      correct,
      userText: placed.map((v, i) => `${q.rows[i].label}: ${v}`).join(" / "),
      correctText: q.rows.map((r) => `${r.label}: ${r.answer}`).join(" / "),
    });
  });

  draw();
}
