import { describe, expect, it } from "vitest";
import { tools, universes } from "./catalog";
import { normalizeSearch, searchableText } from "./search";

describe("normalizeSearch", () => {
  it("ignores accents and letter case", () => {
    expect(normalizeSearch("  ÉLÉVAGE  ")).toBe("elevage");
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeSearch("  privacy  ")).toBe("privacy");
  });
});

describe("searchableText", () => {
  it("finds French keywords without accents", () => {
    expect(searchableText(universes[0])).toContain("elevage");
  });

  it("includes English names and descriptions", () => {
    expect(searchableText(universes[1])).toContain("biodiversity");
  });

  it("includes cross-cutting tool keywords", () => {
    expect(searchableText(tools[0])).toContain("reliability");
  });
});
