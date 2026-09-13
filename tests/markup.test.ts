import { describe, expect, it } from "vitest";
import { markup } from "../src/quiz/choice";

describe("markup", () => {
  it("[語] を破線下線の span にする", () => {
    expect(markup("を(a)[3]回")).toBe('を(a)<span class="mark">3</span>回');
  });
  it("HTML はエスケープする", () => {
    expect(markup("<b>[x]</b>")).toBe('&lt;b&gt;<span class="mark">x</span>&lt;/b&gt;');
  });
  it("複数箇所を変換する", () => {
    expect(markup("[a] と [b]")).toBe('<span class="mark">a</span> と <span class="mark">b</span>');
  });
});
