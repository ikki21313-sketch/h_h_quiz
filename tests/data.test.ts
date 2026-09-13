import { describe, expect, it } from "vitest";
import { pickQuestions, shuffle } from "../src/data";
import type { Question } from "../src/types";

/** 固定シードの乱数 (mulberry32) */
function seededRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function tf(id: string, difficulty: 1 | 2 | 3 | 4): Question {
  return { id, type: "tf", difficulty, question: id, explanation: "", answer: true };
}

const pool: Question[] = [
  ...Array.from({ length: 15 }, (_, i) => tf(`a${i}`, 1)),
  ...Array.from({ length: 3 }, (_, i) => tf(`b${i}`, 2)),
];

describe("shuffle", () => {
  it("元の配列を変更せず、同じ要素を含む", () => {
    const src = [1, 2, 3, 4, 5];
    const out = shuffle(src, seededRng(1));
    expect(src).toEqual([1, 2, 3, 4, 5]);
    expect(out.slice().sort()).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("pickQuestions", () => {
  it("指定難易度から 10 問を重複なく抽出する", () => {
    const qs = pickQuestions(pool, 1, 10, seededRng(42));
    expect(qs).toHaveLength(10);
    expect(new Set(qs.map((q) => q.id)).size).toBe(10);
    expect(qs.every((q) => q.difficulty === 1)).toBe(true);
  });

  it("問題数が足りなければあるだけ返す", () => {
    expect(pickQuestions(pool, 2, 10, seededRng(1))).toHaveLength(3);
    expect(pickQuestions(pool, 3, 10, seededRng(1))).toHaveLength(0);
  });
});
