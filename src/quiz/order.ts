import type { AnswerResult, OrderQuestion, Rng } from "../types";
import { shuffle } from "../data";
import { esc } from "./choice";

/**
 * 並べ替え: 候補をタップした順に回答欄へ積む。
 * 「戻す」で最後の 1 つを候補に戻す。全部積んだら「決定」で判定。
 */
export function renderOrder(
  root: HTMLElement,
  q: OrderQuestion,
  onAnswer: (r: AnswerResult) => void,
  rng: Rng = Math.random,
): void {
  const n = q.items.length;
  // 正解と同じ並びで出題されないよう、シャッフル結果が正解順なら 1 回だけ回転させる
  let candidates = shuffle(q.items, rng);
  if (candidates.every((it, i) => it === q.items[i])) {
    candidates = [...candidates.slice(1), candidates[0]];
  }
  const picked: string[] = [];
  let done = false;

  root.innerHTML = `
    <div class="order">
      <ol class="order-answer" aria-label="回答欄"></ol>
      <div class="order-candidates" aria-label="候補"></div>
      <div class="order-actions">
        <button class="btn btn-sub" data-act="undo">戻す</button>
        <button class="btn btn-primary" data-act="submit">決定</button>
      </div>
    </div>`;
  const answerEl = root.querySelector<HTMLOListElement>(".order-answer")!;
  const candEl = root.querySelector<HTMLDivElement>(".order-candidates")!;
  const undoBtn = root.querySelector<HTMLButtonElement>('[data-act="undo"]')!;
  const submitBtn = root.querySelector<HTMLButtonElement>('[data-act="submit"]')!;

  function draw(): void {
    answerEl.innerHTML = Array.from({ length: n }, (_, i) => {
      const it = picked[i];
      const cls = done ? (it === q.items[i] ? " is-correct" : " is-wrong") : "";
      return `<li class="order-slot${it === undefined ? " is-empty" : ""}${cls}">${
        it === undefined ? "" : esc(it)
      }</li>`;
    }).join("");
    candEl.innerHTML = candidates
      .map((it) => {
        const used = picked.includes(it);
        return `<button class="btn btn-cand" data-item="${esc(it)}" ${used || done ? "disabled" : ""}>${esc(it)}</button>`;
      })
      .join("");
    undoBtn.disabled = done || picked.length === 0;
    submitBtn.disabled = done || picked.length !== n;
  }

  candEl.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-item]");
    if (!btn || btn.disabled || done) return;
    picked.push(btn.dataset.item!);
    draw();
  });
  undoBtn.addEventListener("click", () => {
    if (done) return;
    picked.pop();
    draw();
  });
  submitBtn.addEventListener("click", () => {
    if (done || picked.length !== n) return;
    done = true;
    draw();
    const correct = picked.every((it, i) => it === q.items[i]);
    onAnswer({
      question: q,
      correct,
      userText: picked.join(" → "),
      correctText: q.items.join(" → "),
    });
  });

  draw();
}
