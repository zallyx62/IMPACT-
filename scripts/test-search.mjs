import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { tools, universes } from "../app/src/data/catalog.ts";
import { normalizeSearch, searchableText } from "../app/src/data/search.ts";

describe("normalizeSearch", () => {
  it("ignores accents and letter case", () => {
    assert.equal(normalizeSearch("  ÉLÉVAGE  "), "elevage");
  });

  it("trims surrounding whitespace", () => {
    assert.equal(normalizeSearch("  privacy  "), "privacy");
  });

  it("normalizes ASCII case independently of the browser locale", () => {
    assert.equal(normalizeSearch("IMPACT"), "impact");
  });
});

describe("searchableText", () => {
  it("finds French keywords without accents", () => {
    assert.ok(searchableText(universes[0]).includes("elevage"));
  });

  it("includes English names and descriptions", () => {
    assert.ok(searchableText(universes[1]).includes("biodiversity"));
  });

  it("includes cross-cutting tool keywords", () => {
    assert.ok(searchableText(tools[0]).includes("reliability"));
  });
});
