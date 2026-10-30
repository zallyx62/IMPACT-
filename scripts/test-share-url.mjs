import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildDossierShareUrl } from "../app/src/data/share-url.ts";

describe("buildDossierShareUrl", () => {
  it("creates a direct link to the requested dossier", () => {
    assert.equal(
      buildDossierShareUrl("https://example.org/IMPACT-/", "nestle"),
      "https://example.org/IMPACT-/#entity/nestle",
    );
  });

  it("preserves the deployment path and safely encodes identifiers", () => {
    assert.equal(
      buildDossierShareUrl("https://example.org/IMPACT-/?theme=dark#old", "marque française"),
      "https://example.org/IMPACT-/?theme=dark#entity/marque%20fran%C3%A7aise",
    );
  });
});
