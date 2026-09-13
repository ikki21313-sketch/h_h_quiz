import "./style.css";
import type { AnswerResult, Difficulty, Question } from "./types";
import { DIFFICULTIES, DIFFICULTY_LABELS, QUESTIONS_PER_GAME, TYPE_LABELS } from "./types";
import { countByDifficulty, loadQuestions, pickQuestions } from "./data";
import { getBest, updateBest } from "./storage";
import { renderTf } from "./quiz/tf";
import { renderChoice, esc } from "./quiz/choice";
import { renderOrder } from "./quiz/order";
import { renderMulti } from "./quiz/multi";
import { renderFill } from "./quiz/fill";
import { renderPickOrder } from "./quiz/pickorder";

const root = document.getElementById("app")!;
const data = loadQuestions();

interface Game {
  difficulty: Difficulty;
  questions: Question[];
  index: number;
  results: AnswerResult[];
}

/** 出題画面の形式表示。kind があれば「複数選択 (誤り探し)」のように補足する */
function typeLabel(q: Question): string {
  const base = TYPE_LABELS[q.type];
  const hint = q.type === "order" ? "タップして順に並べる" : q.kind;
  return hint ? `${base} (${hint})` : base;
}

function difficultyStars(d: Difficulty): string {
  return d === 4 ? "☆" : "★".repeat(d);
}

// ---------- タイトル ----------
function renderTitle(): void {
  root.innerHTML = `
    <main class="screen screen-title">
      <h1 class="title">ハンターハンター<br>クイズ</h1>
      <p class="lead">難易度を選んでスタート。1 プレイ ${QUESTIONS_PER_GAME} 問。</p>
      <div class="difficulty-list">
        ${DIFFICULTIES.map((d) => {
          const count = countByDifficulty(data.questions, d);
          const best = getBest(d);
          const disabled = count === 0;
          return `<button class="btn btn-difficulty" data-d="${d}" ${disabled ? "disabled" : ""}>
            <span class="difficulty-stars">${difficultyStars(d)}</span>
            <span class="difficulty-name">${DIFFICULTY_LABELS[d]}</span>
            <span class="difficulty-meta">${
              disabled
                ? "問題準備中"
                : `全 ${count} 問 / 最高 ${best === undefined ? "-" : best} 問正解`
            }</span>
          </button>`;
        }).join("")}
      </div>
      <p class="footnote">非公式・非営利のファンメイドクイズです。データ版: ${esc(data.version)}</p>
    </main>`;
  root.querySelectorAll<HTMLButtonElement>("button[data-d]").forEach((btn) => {
    btn.addEventListener("click", () => startGame(Number(btn.dataset.d) as Difficulty));
  });
}

// ---------- 出題 ----------
function startGame(difficulty: Difficulty): void {
  const questions = pickQuestions(data.questions, difficulty);
  renderQuestion({ difficulty, questions, index: 0, results: [] });
}

function renderQuestion(game: Game): void {
  const q = game.questions[game.index];
  const total = game.questions.length;
  root.innerHTML = `
    <main class="screen screen-quiz">
      <header class="quiz-header">
        <span class="quiz-difficulty">${DIFFICULTY_LABELS[game.difficulty]}</span>
        <span class="quiz-progress">${game.index + 1} / ${total}</span>
      </header>
      <div class="progress-bar"><div class="progress-fill" style="width:${(game.index / total) * 100}%"></div></div>
      <p class="quiz-type">${esc(typeLabel(q))}</p>
      <p class="quiz-question">${esc(q.question).replace(/\n/g, "<br>")}</p>
      <div class="quiz-body"></div>
      <div class="quiz-feedback" hidden></div>
    </main>`;
  const body = root.querySelector<HTMLDivElement>(".quiz-body")!;
  const onAnswer = (r: AnswerResult) => showFeedback(game, r);
  switch (q.type) {
    case "tf":
      renderTf(body, q, onAnswer);
      break;
    case "choice":
      renderChoice(body, q, onAnswer);
      break;
    case "order":
      renderOrder(body, q, onAnswer);
      break;
    case "multi":
      renderMulti(body, q, onAnswer);
      break;
    case "fill":
      renderFill(body, q, onAnswer);
      break;
    case "pickorder":
      renderPickOrder(body, q, onAnswer);
      break;
  }
}

function showFeedback(game: Game, r: AnswerResult): void {
  game.results.push(r);
  const fb = root.querySelector<HTMLDivElement>(".quiz-feedback")!;
  const last = game.index + 1 >= game.questions.length;
  fb.innerHTML = `
    <p class="verdict ${r.correct ? "is-correct" : "is-wrong"}">${r.correct ? "正解！" : "不正解"}</p>
    ${r.correct ? "" : `<p class="feedback-answer">正解: ${esc(r.correctText)}</p>`}
    ${r.question.explanation ? `<p class="feedback-explanation">${esc(r.question.explanation).replace(/\n/g, "<br>")}</p>` : ""}
    <button class="btn btn-primary btn-next">${last ? "結果を見る" : "次へ"}</button>`;
  fb.hidden = false;
  fb.querySelector<HTMLButtonElement>(".btn-next")!.addEventListener("click", () => {
    if (last) renderResult(game);
    else renderQuestion({ ...game, index: game.index + 1 });
  });
  fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ---------- 結果 ----------
function renderResult(game: Game): void {
  const score = game.results.filter((r) => r.correct).length;
  const total = game.results.length;
  const isNewBest = updateBest(game.difficulty, score);
  root.innerHTML = `
    <main class="screen screen-result">
      <h2 class="result-title">${DIFFICULTY_LABELS[game.difficulty]} の結果</h2>
      <p class="result-score"><span class="result-score-num">${score}</span> / ${total} 問正解</p>
      ${isNewBest ? '<p class="result-best">最高記録更新！</p>' : ""}
      <ol class="result-list">
        ${game.results
          .map(
            (r) => `<li class="result-item ${r.correct ? "is-correct" : "is-wrong"}">
              <span class="result-mark">${r.correct ? "◯" : "×"}</span>
              <span class="result-q">${esc(r.question.question).replace(/\n/g, " ")}</span>
              ${r.correct ? "" : `<span class="result-a">正解: ${esc(r.correctText)}</span>`}
            </li>`,
          )
          .join("")}
      </ol>
      <div class="result-actions">
        <button class="btn btn-primary" data-act="retry">もう一度</button>
        <button class="btn btn-sub" data-act="top">トップへ</button>
      </div>
    </main>`;
  root.querySelector('[data-act="retry"]')!.addEventListener("click", () => startGame(game.difficulty));
  root.querySelector('[data-act="top"]')!.addEventListener("click", renderTitle);
}

/** 動作確認用: `?q=om09` のように id を指定するとその 1 問だけを出題する */
function startFromQuery(): boolean {
  const id = new URLSearchParams(location.search).get("q");
  if (!id) return false;
  const q = data.questions.find((x) => x.id === id);
  if (!q) return false;
  renderQuestion({ difficulty: q.difficulty, questions: [q], index: 0, results: [] });
  return true;
}

if (!startFromQuery()) renderTitle();
