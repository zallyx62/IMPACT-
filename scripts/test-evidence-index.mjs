import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildEvidenceIndex } from "../app/src/data/evidence-index.ts";

function dossier() {
  const claims = [
    { id: "claim-a", statement: "Affirmation A", evidence_ids: ["evidence-context"] },
    { id: "claim-b", statement: "Affirmation B" },
    { id: "claim-c", statement: "Affirmation C" },
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
  it("keeps only evidence whose source is present in the published dossier", () => {
    const index = buildEvidenceIndex([dossier()]);
    assert.equal(index.length, 4);
    assert.ok(index.every((item) => item.source?.id === "source-a"));
  });

  it("distinguishes supporting, contradicting, mixed and contextual evidence", () => {
    const index = buildEvidenceIndex([dossier()]);
    assert.deepEqual(
      Object.fromEntries(index.map((item) => [item.id, item.relation])),
      {
        "evidence-support": "supports",
        "evidence-contradict": "contradicts",
        "evidence-mixed": "mixed",
        "evidence-context": "context",
      },
    );
  });

  it("retains the entity, source and linked claims for traceability", () => {
    const item = buildEvidenceIndex([dossier()]).find((entry) => entry.id === "evidence-support");
    assert.equal(item?.entityName, "Entité A");
    assert.equal(item?.source?.title, "Source publique");
    assert.deepEqual(item?.claims.map((claim) => claim.id), ["claim-a"]);
  });

  it("does not duplicate evidence when indexing multiple dossiers", () => {
    const first = dossier();
    const second = { ...dossier(), entity: { id: "entity-b", name: "Entité B" } };
    const index = buildEvidenceIndex([first, second]);
    assert.equal(index.length, 8);
    assert.equal(index.filter((item) => item.id === "evidence-support").length, 2);
  });
});
