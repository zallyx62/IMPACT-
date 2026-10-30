import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateCollections } from "./lib/data-integrity.mjs";

const valid = {
  entities: [{ id: "entity-one", source_ids: ["source-one"] }, { id: "entity-two", source_ids: ["source-one"] }],
  sources: [{ id: "source-one" }],
  claims: [{ id: "claim-one", subject_entity_id: "entity-one", source_ids: ["source-one"], evidence_ids: ["evidence-one"] }],
  evidence: [{ id: "evidence-one", source_id: "source-one", supports_claim_ids: ["claim-one"] }],
  relationships: [{ id: "relation-one", from_entity_id: "entity-one", to_entity_id: "entity-two", source_ids: ["source-one"] }],
  campaigns: [{ id: "campaign-one", target_entity_ids: ["entity-one"], demands: ["A documented demand"], source_ids: ["source-one"], claim_ids: ["claim-one"], response_ids: ["response-one"] }],
  responses: [{ id: "response-one", entity_id: "entity-one", related_claim_ids: ["claim-one"], source_id: "source-one" }],
  commitments: [{ id: "commitment-one", entity_id: "entity-one", source_ids: ["source-one"] }],
};

describe("validateCollections", () => {
  it("accepts records whose references all exist", () => {
    assert.deepEqual(validateCollections(valid), []);
  });

  it("reports missing entity, source and claim references", () => {
    const broken = structuredClone(valid);
    broken.claims[0].subject_entity_id = "missing-entity";
    broken.claims[0].source_ids = ["missing-source"];
    broken.responses[0].related_claim_ids = ["missing-claim"];
    const errors = validateCollections(broken);
    assert.equal(errors.length, 3);
    assert.ok(errors.some((error) => error.includes('missing-entity')));
    assert.ok(errors.some((error) => error.includes('missing-source')));
    assert.ok(errors.some((error) => error.includes('missing-claim')));
  });

  it("rejects empty source lists and duplicate identifiers", () => {
    const broken = structuredClone(valid);
    broken.relationships[0].source_ids = [];
    broken.entities.push({ id: "entity-one" });
    const errors = validateCollections(broken);
    assert.ok(errors.some((error) => error.includes("must not be empty")));
    assert.ok(errors.some((error) => error.includes("duplicate id")));
  });
  it("checks references for evidence, relationships, campaigns, responses and commitments", () => {
    const broken = structuredClone(valid);
    broken.evidence[0].source_id = "missing-evidence-source";
    broken.relationships[0].to_entity_id = "missing-target";
    broken.campaigns[0].target_entity_ids = ["missing-campaign-target"];
    broken.responses[0].source_id = "missing-response-source";
    broken.commitments[0].entity_id = "missing-commitment-entity";
    const errors = validateCollections(broken);
    assert.equal(errors.length, 5);
    assert.ok(errors.some((error) => error.includes("missing-evidence-source")));
    assert.ok(errors.some((error) => error.includes("missing-target")));
    assert.ok(errors.some((error) => error.includes("missing-campaign-target")));
    assert.ok(errors.some((error) => error.includes("missing-response-source")));
    assert.ok(errors.some((error) => error.includes("missing-commitment-entity")));
  });

});
