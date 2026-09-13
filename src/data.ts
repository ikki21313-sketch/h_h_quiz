import type { Difficulty, Question, Rng } from "./types";
import { QUESTIONS_PER_GAME } from "./types";
import { allQuestions, DATA_VERSION } from "./data/index";

export function loadQuestions(): { version: string; questions: Question[] } {
  return { version: DATA_VERSION, questions: allQuestions };
}

/** Fisher-Yates。元の配列は変更しない */
export function shuffle<T>(arr: readonly T[], rng: Rng = Math.random): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 指定難易度の問題からランダムに count 問抽出する (形式混在)。
 * 問題数が count 未満ならあるだけ返す。
 */
export function pickQuestions(
  all: readonly Question[],
  difficulty: Difficulty,
  count = QUESTIONS_PER_GAME,
  rng: Rng = Math.random,
): Question[] {
  const pool = all.filter((q) => q.difficulty === difficulty);
  return shuffle(pool, rng).slice(0, count);
}

/** 難易度ごとの問題数 */
export function countByDifficulty(all: readonly Question[], difficulty: Difficulty): number {
  return all.filter((q) => q.difficulty === difficulty).length;
}
