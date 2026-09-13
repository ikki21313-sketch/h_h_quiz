import type { AnswerResult, TfQuestion } from "../types";

const label = (b: boolean) => (b ? "◯" : "×");

export function renderTf(
  root: HTMLElement,
  q: TfQuestion,
  onAnswer: (r: AnswerResult) => void,
): void {
  root.innerHTML = `
    <div class="tf-buttons">
      <button class="btn btn-tf btn-true" data-v="true">◯</button>
      <button class="btn btn-tf btn-false" data-v="false">×</button>
    </div>`;
  root.querySelectorAll<HTMLButtonElement>("button[data-v]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const v = btn.dataset.v === "true";
      root.querySelectorAll("button").forEach((b) => (b.disabled = true));
      btn.classList.add(v === q.answer ? "is-correct" : "is-wrong");
      onAnswer({
        question: q,
        correct: v === q.answer,
        userText: label(v),
        correctText: label(q.answer),
      });
    });
  });
}
