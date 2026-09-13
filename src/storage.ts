import type { Difficulty } from "./types";

const KEY = "h_h_quiz.best";

type BestRecord = Partial<Record<Difficulty, number>>;

function read(): BestRecord {
  try {
    const s = localStorage.getItem(KEY);
    if (!s) return {};
    const obj = JSON.parse(s);
    return typeof obj === "object" && obj !== null ? (obj as BestRecord) : {};
  } catch {
    return {};
  }
}

function write(rec: BestRecord): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(rec));
  } catch {
    // プライベートモード等で保存できない場合は無視
  }
}

/** 難易度別の最高正解数。未プレイなら undefined */
export function getBest(difficulty: Difficulty): number | undefined {
  const v = read()[difficulty];
  return typeof v === "number" ? v : undefined;
}

/** 最高記録を更新したら true を返す */
export function updateBest(difficulty: Difficulty, score: number): boolean {
  const rec = read();
  const prev = rec[difficulty];
  if (typeof prev === "number" && prev >= score) return false;
  rec[difficulty] = score;
  write(rec);
  return true;
}
