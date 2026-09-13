import type { AnswerResult, PickOrderQuestion } from "../types";
import { esc } from "./choice";
import { makeDraggable } from "./dnd";

type Bin = "unsorted" | "target" | "other";

/**
 * 仕分け＋並べ替え: 各カードを「対象 (順序あり)」「対象外」の箱へドラッグ (またはボタンで移動)。
 * 対象の箱では上下ボタン、またはカードの上へのドロップで順番を変えられる。
 * 全カードを仕分けると決定できる。
 */
export function renderPickOrder(
  root: HTMLElement,
  q: PickOrderQuestion,
  onAnswer: (r: AnswerResult) => void,
): void {
  const [targetLabel, otherLabel] = q.bins;
  const target: number[] = []; // 順序あり
  const other = new Set<number>();
  let done = false;

  root.innerHTML = `
    <div class="multi pickorder">
      <p class="multi-hint">すべてのカードを「${esc(targetLabel)}」か「${esc(otherLabel)}」に仕分けてから決定してください。「${esc(targetLabel)}」の箱は上から順番になるように並べてください。カードはドラッグかボタンで移動できます。</p>
      <div class="multi-body">
        <div class="multi-bins">
          <section class="bin bin-target zone" data-bin="target">
            <h3 class="bin-title">${esc(targetLabel)} (上から順に)</h3>
            <div class="bin-list"></div>
          </section>
          <section class="bin bin-other zone" data-bin="other">
            <h3 class="bin-title">${esc(otherLabel)}</h3>
            <div class="bin-list"></div>
          </section>
        </div>
        <section class="bin bin-unsorted zone" data-bin="unsorted">
          <h3 class="bin-title">未分類 (選択肢)</h3>
          <div class="bin-list"></div>
        </section>
      </div>
      <button class="btn btn-primary" data-act="submit" disabled>決定</button>
    </div>`;

  const binEls = Array.from(root.querySelectorAll<HTMLElement>(".bin"));
  const lists: Record<Bin, HTMLElement> = {
    unsorted: root.querySelector<HTMLElement>('[data-bin="unsorted"] .bin-list')!,
    target: root.querySelector<HTMLElement>('[data-bin="target"] .bin-list')!,
    other: root.querySelector<HTMLElement>('[data-bin="other"] .bin-list')!,
  };
  const submitBtn = root.querySelector<HTMLButtonElement>('[data-act="submit"]')!;

  function binOf(i: number): Bin {
    if (target.includes(i)) return "target";
    if (other.has(i)) return "other";
    return "unsorted";
  }

  function unsorted(): number[] {
    return q.options.map((_, i) => i).filter((i) => binOf(i) === "unsorted");
  }

  function detach(i: number): void {
    const k = target.indexOf(i);
    if (k !== -1) target.splice(k, 1);
    other.delete(i);
  }

  /** bin へ移動。target の場合は before (挿入先のカード添字) の前に挿入、未指定なら末尾 */
  function moveTo(i: number, bin: Bin, before?: number): void {
    if (done) return;
    detach(i);
    if (bin === "target") {
      const k = before === undefined ? -1 : target.indexOf(before);
      if (k === -1) target.push(i);
      else target.splice(k, 0, i);
    } else if (bin === "other") {
      other.add(i);
    }
    draw();
  }

  function shift(i: number, delta: number): void {
    if (done) return;
    const k = target.indexOf(i);
    const j = k + delta;
    if (k === -1 || j < 0 || j >= target.length) return;
    [target[k], target[j]] = [target[j], target[k]];
    draw();
  }

  function cardHtml(i: number, pos: number): string {
    const bin = binOf(i);
    const buttons = done
      ? ""
      : `<div class="card-actions">
          ${bin === "target" ? `<button class="btn btn-mini" data-shift="-1" ${pos === 0 ? "disabled" : ""}>↑</button><button class="btn btn-mini" data-shift="1" ${pos === target.length - 1 ? "disabled" : ""}>↓</button>` : ""}
          ${bin !== "target" ? `<button class="btn btn-mini" data-to="target">${esc(targetLabel)}へ</button>` : ""}
          ${bin !== "other" ? `<button class="btn btn-mini" data-to="other">${esc(otherLabel)}へ</button>` : ""}
          ${bin !== "unsorted" ? `<button class="btn btn-mini btn-mini-sub" data-to="unsorted">戻す</button>` : ""}
        </div>`;
    const num = bin === "target" ? `<span class="card-num">${pos + 1}</span>` : "";
    return `<div class="card${bin === "target" ? " zone card-zone" : ""}" data-i="${i}">
      <span class="drag-grip" aria-hidden="true">⠿</span>
      <span class="card-text">${num}${esc(q.options[i])}</span>
      ${buttons}
    </div>`;
  }

  function draw(): void {
    lists.unsorted.innerHTML =
      unsorted().map((i) => cardHtml(i, 0)).join("") || `<p class="bin-empty">ここにドロップ</p>`;
    lists.target.innerHTML =
      target.map((i, pos) => cardHtml(i, pos)).join("") || `<p class="bin-empty">ここにドロップ</p>`;
    lists.other.innerHTML =
      [...other].map((i) => cardHtml(i, 0)).join("") || `<p class="bin-empty">ここにドロップ</p>`;

    root.querySelectorAll<HTMLElement>(".card").forEach((card) => {
      const i = Number(card.dataset.i);
      card.querySelectorAll<HTMLButtonElement>("button[data-to]").forEach((b) => {
        b.addEventListener("click", () => moveTo(i, b.dataset.to as Bin));
      });
      card.querySelectorAll<HTMLButtonElement>("button[data-shift]").forEach((b) => {
        b.addEventListener("click", () => shift(i, Number(b.dataset.shift)));
      });
      if (!done) {
        makeDraggable(card, {
          // 対象の箱のカードもドロップ先 (その前に挿入)。カードを先に並べて優先させる
          zones: () => [
            ...Array.from(lists.target.querySelectorAll<HTMLElement>(".card-zone")).filter((c) => c !== card),
            ...binEls,
          ],
          onDrop: (zone) => {
            if (!zone) return;
            if (zone.classList.contains("card-zone")) {
              moveTo(i, "target", Number(zone.dataset.i));
            } else {
              moveTo(i, zone.dataset.bin as Bin);
            }
          },
        });
      }
    });
    submitBtn.disabled = done || unsorted().length > 0;
  }

  submitBtn.addEventListener("click", () => {
    if (done || unsorted().length > 0) return;
    done = true;
    const correct =
      target.length === q.ordered.length && target.every((i, k) => i === q.ordered[k]);
    draw();
    const orderedSet = new Set(q.ordered);
    root.querySelectorAll<HTMLElement>(".card").forEach((card) => {
      const i = Number(card.dataset.i);
      const bin = binOf(i);
      let ok: boolean;
      if (bin === "target") ok = q.ordered[target.indexOf(i)] === i;
      else ok = !orderedSet.has(i);
      card.classList.add(ok ? "is-correct" : "is-wrong");
    });
    submitBtn.disabled = true;
    onAnswer({
      question: q,
      correct,
      userText: `${targetLabel}: ${target.map((i) => q.options[i]).join(" → ") || "(なし)"}`,
      correctText: `${targetLabel}: ${q.ordered.map((i) => q.options[i]).join(" → ")}`,
    });
  });

  draw();
}
