import type { AnswerResult, MultiQuestion } from "../types";
import { esc } from "./choice";
import { makeDraggable } from "./dnd";

type Bin = "unsorted" | "target" | "other";

/**
 * 仕分け: 各選択肢を「対象」「対象外」の箱へドラッグ (またはカードのボタンで移動) して回答する。
 * pick 未指定なら全カードを仕分けてから決定。pick 指定なら対象の箱にちょうど pick 枚で決定可。
 */
export function renderMulti(
  root: HTMLElement,
  q: MultiQuestion,
  onAnswer: (r: AnswerResult) => void,
): void {
  const [targetLabel, otherLabel] = q.bins ?? ["該当する", "該当しない"];
  const bins: Bin[] = q.options.map(() => "unsorted");
  let done = false;

  const hint =
    q.pick !== undefined
      ? `「${targetLabel}」の箱に ${q.pick} つ入れてから決定してください`
      : `すべてのカードを「${targetLabel}」か「${otherLabel}」に仕分けてから決定してください`;

  root.innerHTML = `
    <div class="multi">
      <p class="multi-hint">${esc(hint)}。カードはドラッグかボタンで移動できます。</p>
      <div class="multi-body">
        <div class="multi-bins">
          <section class="bin bin-target zone" data-bin="target">
            <h3 class="bin-title">${esc(targetLabel)}${q.pick !== undefined ? ` (${q.pick} つ)` : ""}</h3>
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

  const zones = Array.from(root.querySelectorAll<HTMLElement>(".zone"));
  const lists: Record<Bin, HTMLElement> = {
    unsorted: root.querySelector<HTMLElement>('[data-bin="unsorted"] .bin-list')!,
    target: root.querySelector<HTMLElement>('[data-bin="target"] .bin-list')!,
    other: root.querySelector<HTMLElement>('[data-bin="other"] .bin-list')!,
  };
  const submitBtn = root.querySelector<HTMLButtonElement>('[data-act="submit"]')!;

  function count(bin: Bin): number {
    return bins.filter((b) => b === bin).length;
  }

  function canSubmit(): boolean {
    return q.pick !== undefined ? count("target") === q.pick : count("unsorted") === 0;
  }

  function moveTo(i: number, bin: Bin): void {
    if (done) return;
    if (bin === "target" && q.pick !== undefined && bins[i] !== "target" && count("target") >= q.pick) {
      return; // 上限
    }
    bins[i] = bin;
    draw();
  }

  function cardHtml(i: number): string {
    const bin = bins[i];
    const buttons = done
      ? ""
      : `<div class="card-actions">
          ${bin !== "target" ? `<button class="btn btn-mini" data-to="target">${esc(targetLabel)}</button>` : ""}
          ${bin !== "other" ? `<button class="btn btn-mini" data-to="other">${esc(otherLabel)}</button>` : ""}
          ${bin !== "unsorted" ? `<button class="btn btn-mini btn-mini-sub" data-to="unsorted">戻す</button>` : ""}
        </div>`;
    return `<div class="card" data-i="${i}">
      <span class="drag-grip" aria-hidden="true">⠿</span>
      <span class="card-text">${esc(q.options[i])}</span>
      ${buttons}
    </div>`;
  }

  function draw(): void {
    (["unsorted", "target", "other"] as Bin[]).forEach((bin) => {
      const idx = bins.map((b, i) => (b === bin ? i : -1)).filter((i) => i >= 0);
      lists[bin].innerHTML = idx.map(cardHtml).join("") || `<p class="bin-empty">ここにドロップ</p>`;
    });
    root.querySelectorAll<HTMLElement>(".card").forEach((card) => {
      const i = Number(card.dataset.i);
      card.querySelectorAll<HTMLButtonElement>("button[data-to]").forEach((b) => {
        b.addEventListener("click", () => moveTo(i, b.dataset.to as Bin));
      });
      if (!done) {
        makeDraggable(card, {
          zones: () => zones,
          onDrop: (zone) => {
            if (zone) moveTo(i, zone.dataset.bin as Bin);
          },
        });
      }
    });
    submitBtn.disabled = done || !canSubmit();
  }

  submitBtn.addEventListener("click", () => {
    if (done || !canSubmit()) return;
    done = true;
    const answerSet = new Set(q.answers);
    const inTarget = bins.map((b, i) => (b === "target" ? i : -1)).filter((i) => i >= 0);
    const correct =
      q.pick !== undefined
        ? inTarget.length === q.pick && inTarget.every((i) => answerSet.has(i))
        : inTarget.length === answerSet.size && inTarget.every((i) => answerSet.has(i));
    draw();
    root.querySelectorAll<HTMLElement>(".card").forEach((card) => {
      const i = Number(card.dataset.i);
      const shouldBeTarget = answerSet.has(i);
      if (bins[i] === "unsorted") {
        // pick モードで未分類のまま残したカード。正解側なら薄く示す
        if (shouldBeTarget) card.classList.add("is-hint");
        return;
      }
      const ok = (bins[i] === "target") === shouldBeTarget;
      card.classList.add(ok ? "is-correct" : "is-wrong");
    });
    submitBtn.disabled = true;
    onAnswer({
      question: q,
      correct,
      userText: `${targetLabel}: ${inTarget.map((i) => q.options[i]).join(" / ") || "(なし)"}`,
      correctText:
        q.pick !== undefined
          ? `${q.answers.map((i) => q.options[i]).join(" / ")} のうち ${q.pick} つ`
          : `${targetLabel}: ${q.answers.map((i) => q.options[i]).join(" / ")}`,
    });
  });

  draw();
}
