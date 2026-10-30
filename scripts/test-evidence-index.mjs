import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildEvidenceIndex, filterEvidenceIndex } from "../app/src/data/evidence-index.ts";

function makeDossier() {
  const claims = [
    { id: "claim-a", statement: "Affirmation A", evidence_ids: ["evidence-context"] },
    { id: "claim-b", statement: "Affirmation B" },
  ];
  return {
    entity: { id: "entity-a", name: "Entité A" },
    claims,
    sources: [{ id: "source-a", title: "Source publique", publisher: "Éditeur", url: "https://example.org", review_status: "reviewed" }],
    evidence: [
      { id: "evidence-support", source_id: "source-a", locator: "p. 2", summary: "Élément favorable", supports_claim_ids: ["claim-a"] },
      { id: "evidence-contradict", source_id: "source-a", locator: "p. 3", summary: "Élément contradictoire", contradicts_claim_ids: ["claim-b"] },
      { id: "evidence-mixed", source_id: "source-a", locator: "p. 4", summary: "Élément nuancé", supports_claim_ids: ["claim-a"], contradicts_claim_ids: ["claim-b"] },
      { id: "evidence-context", source_id: "source-a", locator: "p. 5", summary: "Contexte" },
      { id: "evidence-orphan", source_id: "missing-source", locator: "p. 6", summary: "Source absente" },
    ],
  };
}

describe("buildEvidenceIndex", () => {
  it("excludes evidence without a source in the published dossier", () => {
    const index = buildEvidenceIndex([makeDossier()]);
    assert.equal(index.length, 4);
    assert.ok(index.every((item) => item.source?.id === "source-a"));
  });
  it("classifies supporting, contradicting, mixed and contextual evidence", () => {
    const index = buildEvidenceIndex([makeDossier()]);
    assert.deepEqual(Object.fromEntries(index.map((item) => [item.id, item.relation])), {
      "evidence-support": "supports", "evidence-contradict": "contradicts",
      "evidence-mixed": "mixed", "evidence-context": "context",
    });
  });
  it("retains source, entity and claim traceability", () => {
    const item = buildEvidenceIndex([makeDossier()]).find((entry) => entry.id === "evidence-support");
    assert.equal(item?.entityName, "Entité A");
    assert.equal(item?.source?.title, "Source publique");
    assert.deepEqual(item?.claims.map((claim) => claim.id), ["claim-a"]);
  });
});
describe("filterEvidenceIndex", () => {
  const index = buildEvidenceIndex([makeDossier()]);
  it("filters by evidence relation", () => {
    assert.equal(filterEvidenceIndex(index, "", "all").length, 4);
    assert.deepEqual(filterEvidenceIndex(index, "", "supports").map((item) => item.id), ["evidence-support"]);
    assert.deepEqual(filterEvidenceIndex(index, "", "contradicts").map((item) => item.id), ["evidence-contradict"]);
    assert.deepEqual(filterEvidenceIndex(index, "", "mixed").map((item) => item.id), ["evidence-mixed"]);
    assert.deepEqual(filterEvidenceIndex(index, "", "context").map((item) => item.id), ["evidence-context"]);
  });
  it("searches source, claim and evidence text", () => {
    assert.equal(filterEvidenceIndex(index, "SOURCE PUBLIQUE", "all").length, 4);
    assert.equal(filterEvidenceIndex(index, "affirmation b", "all").length, 2);
    assert.deepEqual(filterEvidenceIndex(index, "nuancé", "all").map((item) => item.id), ["evidence-mixed"]);
  });
});
