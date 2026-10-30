import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseSelectionHash } from "../app/src/data/hash-route.ts";

describe("parseSelectionHash", () => {
  it("resolves each supported route type", () => {
    assert.deepEqual(parseSelectionHash("#universe/environment"), { type: "universe", id: "environment" });
    assert.deepEqual(parseSelectionHash("#tool/alternatives"), { type: "tool", id: "alternatives" });
    assert.deepEqual(parseSelectionHash("#entity/nestle"), { type: "entity", id: "nestle" });
  });

  it("decodes route identifiers", () => {
    assert.deepEqual(parseSelectionHash("#entity/brand%20name"), { type: "entity", id: "brand name" });
    assert.deepEqual(parseSelectionHash("#entity/%C3%A9thique"), { type: "entity", id: "éthique" });
  });

  it("ignores unsupported, empty and malformed routes", () => {
    assert.equal(parseSelectionHash(""), null);
    assert.equal(parseSelectionHash("#method"), null);
    assert.equal(parseSelectionHash("#unknown/nestle"), null);
    assert.equal(parseSelectionHash("#entity/"), null);
    assert.equal(parseSelectionHash("#entity/%20%20"), null);
    assert.equal(parseSelectionHash("#entity/%E0%A4%A"), null);
  });
});
