import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseSelectionHash } from "../app/src/data/hash-route.ts";

describe("parseSelectionHash", () => {
  it("resolves all supported route types", () => {
    assert.deepEqual(parseSelectionHash("#universe/environment"), { type: "universe", id: "environment" });
    assert.deepEqual(parseSelectionHash("#tool/alternatives"), { type: "tool", id: "alternatives" });
    assert.deepEqual(parseSelectionHash("#entity/nestle"), { type: "entity", id: "nestle" });
  });

  it("decodes identifiers without changing their meaning", () => {
    assert.deepEqual(parseSelectionHash("#entity/brand%20name"), { type: "entity", id: "brand name" });
    assert.deepEqual(parseSelectionHash("#entity/%C3%A9thique"), { type: "entity", id: "éthique" });
  });

  it("ignores unsupported, empty and malformed routes", () => {
    for (const hash of ["", "#method", "#unknown/nestle", "#entity/", "#entity/%E0%A4%A", "#tool/%"]) {
      assert.equal(parseSelectionHash(hash), null, hash);
    }
  });
});
