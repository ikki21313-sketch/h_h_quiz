import { describe, expect, it } from "vitest";
import { allQuestions } from "../src/data/index";
import { DIFFICULTIES } from "../src/types";

/** 問題データの整合性検証。データを追加したらここで弾かれないことを確認する */
describe("問題データ", () => {
  it("id が重複していない", () => {
    const ids = allQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("難易度と問題文が正しい", () => {
    for (const q of allQuestions) {
      expect(DIFFICULTIES, q.id).toContain(q.difficulty);
      expect(q.question.trim(), q.id).not.toBe("");
    }
  });

  it.each(allQuestions.map((q) => [q.id, q] as const))("%s の形式固有の整合性", (_id, q) => {
    switch (q.type) {
      case "tf":
        expect(typeof q.answer).toBe("boolean");
        break;
      case "choice":
        expect(q.choices.length).toBeGreaterThanOrEqual(2);
        expect(q.choices.length).toBeLessThanOrEqual(6);
        expect(q.choices.every((c) => c.trim() !== "")).toBe(true);
        expect(new Set(q.choices).size).toBe(q.choices.length);
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.choices.length);
        if (q.text) expect(q.text).not.toMatch(/\[[^\]]*\[/); // 強調の入れ子なし
        break;
      case "order":
        expect(q.items.length).toBeGreaterThanOrEqual(3);
        expect(q.items.length).toBeLessThanOrEqual(6);
        expect(new Set(q.items).size).toBe(q.items.length);
        break;
      case "multi":
        expect(q.options.length).toBeGreaterThanOrEqual(3);
        expect(new Set(q.options).size).toBe(q.options.length);
        expect(q.answers.length).toBeGreaterThanOrEqual(1);
        expect(new Set(q.answers).size).toBe(q.answers.length);
        for (const a of q.answers) {
          expect(a).toBeGreaterThanOrEqual(0);
          expect(a).toBeLessThan(q.options.length);
        }
        if (q.bins) expect(q.bins[0]).not.toBe(q.bins[1]);
        if (q.pick !== undefined) {
          expect(q.pick).toBeGreaterThanOrEqual(1);
          expect(q.pick).toBeLessThanOrEqual(q.answers.length);
          // 正解以外の候補 (ダミー) が 1 つ以上ある
          expect(q.options.length).toBeGreaterThan(q.answers.length);
        }
        break;
      case "pickorder":
        expect(q.options.length).toBeGreaterThanOrEqual(3);
        expect(new Set(q.options).size).toBe(q.options.length);
        expect(q.ordered.length).toBeGreaterThanOrEqual(2);
        expect(q.ordered.length).toBeLessThan(q.options.length);
        expect(new Set(q.ordered).size).toBe(q.ordered.length);
        for (const a of q.ordered) {
          expect(a).toBeGreaterThanOrEqual(0);
          expect(a).toBeLessThan(q.options.length);
        }
        expect(q.bins[0]).not.toBe(q.bins[1]);
        break;
      case "fill":
        expect(q.rows.length).toBeGreaterThanOrEqual(1);
        if (q.pool) {
          expect(new Set(q.pool).size).toBe(q.pool.length);
          // 候補は単一使用なので正解は行ごとに異なる必要がある
          const answers = q.rows.map((r) => r.answer);
          expect(new Set(answers).size).toBe(answers.length);
          for (const row of q.rows) expect(q.pool, row.label).toContain(row.answer);
          expect(q.pool.length).toBeGreaterThanOrEqual(q.rows.length);
        } else {
          for (const row of q.rows) {
            expect(row.options, row.label).toBeDefined();
            expect(row.options!.length, row.label).toBeGreaterThanOrEqual(2);
            expect(new Set(row.options).size, row.label).toBe(row.options!.length);
            expect(row.options, row.label).toContain(row.answer);
          }
        }
        break;
    }
  });
});
