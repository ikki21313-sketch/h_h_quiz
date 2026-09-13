import type { AnswerResult, ChoiceQuestion, Rng } from "../types";
import { shuffle } from "../data";

export function renderChoice(
  root: HTMLElement,
  q: ChoiceQuestion,
  onAnswer: (r: AnswerResult) => void,
  rng: Rng = Math.random,
): void {
  // 選択肢は出題時にシャッフル (shuffle: false なら元の順)。元の添字を data 属性で持つ
  const indices = q.choices.map((_, i) => i);
  const order = q.shuffle === false ? indices : shuffle(indices, rng);
  root.innerHTML = `${q.text ? `<p class="choice-text">${markup(q.text)}</p>` : ""}<div class="choice-list">${order
    .map((i) => `<button class="btn btn-choice" data-i="${i}">${esc(q.choices[i])}</button>`)
    .join("")}</div>`;

  root.querySelectorAll<HTMLButtonElement>("button[data-i]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.i);
      root.querySelectorAll<HTMLButtonElement>("button").forEach((b) => {
        b.disabled = true;
        if (Number(b.dataset.i) === q.answer) b.classList.add("is-correct");
      });
      if (i !== q.answer) btn.classList.add("is-wrong");
      onAnswer({
        question: q,
        correct: i === q.answer,
        userText: q.choices[i],
        correctText: q.choices[q.answer],
      });
    });
  });
}

/** `[語]` を破線下線の span に変換する (それ以外はエスケープ) */
export function markup(text: string): string {
  return esc(text).replace(/\[([^\]]+)\]/g, '<span class="mark">$1</span>');
}

export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
