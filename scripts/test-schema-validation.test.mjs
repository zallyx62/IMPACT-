import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { compileRecordValidators, validateSchemaRecords } from "./lib/schema-validation.mjs";

const valid = {
  entities: [{ id: "entity-one", name: "Example organization", entity_type: "organization", status: "published", reviewed_at: "2026-10-30", source_ids: ["source-one"] }],
  sources: [{ id: "source-one", title: "Official report", publisher: "Example publisher", source_type: "official_statement", accessed_at: "2026-10-30", review_status: "reviewed", url: "https://example.org/report" }],
  claims: [{ id: "claim-one", subject_entity_id: "entity-one", statement: "A sufficiently detailed example claim for schema validation.", topic: "other", claim_status: "confirmed", source_ids: ["source-one"], evidence_ids: ["evidence-one"], reviewed_at: "2026-10-30", uncertainty_note: "The example is fictional and used only in tests." }],
  evidence: [{ id: "evidence-one", source_id: "source-one", locator: "Section 2", summary: "A sufficiently detailed summary of the example evidence.", supports_claim_ids: ["claim-one"] }],
  relationships: [{ id: "relation-one", from_entity_id: "entity-one", to_entity_id: "entity-two", relationship_type: "owns", knowledge_status: "confirmed", source_ids: ["source-one"] }],
  campaigns: [{ id: "campaign-one", title: "Example campaign", target_entity_ids: ["entity-one"], demands: ["Publish a transparent report"], campaign_status: "active", source_ids: ["source-one"], claim_ids: ["claim-one"], response_ids: ["response-one"] }],
  responses: [{ id: "response-one", entity_id: "entity-one", related_claim_ids: ["claim-one"], summary: "A sufficiently detailed summary of an example response.", source_id: "source-one", publication_status: "published" }],
  commitments: [{ id: "commitment-one", entity_id: "entity-one", statement: "An example commitment with enough detail for validation.", announced_at: "2026-10-30", status: "achieved", source_ids: ["source-one"], reviewed_at: "2026-10-30", measurement_method: "A documented and repeatable measurement method.", observed_result: "A documented result measured against the stated baseline." }],
};

describe("JSON Schema validation", () => {
  it("accepts valid examples for all eight record types", async () => {
    const validators = await compileRecordValidators();
    assert.deepEqual(validateSchemaRecords(valid, validators), []);
  });

  it("rejects missing sources and unknown enum values", async () => {
    const validators = await compileRecordValidators();
    const invalid = structuredClone(valid);
    invalid.claims[0].source_ids = [];
    invalid.claims[0].topic = "invented_topic";
    const errors = validateSchemaRecords(invalid, validators);
    assert.ok(errors.some((error) => error.includes("must NOT have fewer than 1 items")));
    assert.ok(errors.some((error) => error.includes("must be equal to one of the allowed values")));
  });

  it("rejects non-web URL protocols in sources and entities", async () => {
    const validators = await compileRecordValidators();
    const invalid = structuredClone(valid);
    invalid.sources[0].url = "javascript:alert(1)";
    invalid.entities[0].website = "data:text/html,unsafe";
    const errors = validateSchemaRecords(invalid, validators);
    assert.ok(errors.some((error) => error.includes("url") && error.includes("must match pattern")));
    assert.ok(errors.some((error) => error.includes("website") && error.includes("must match pattern")));
  });

  it("requires a human review date for high-risk claims", async () => {
    const validators = await compileRecordValidators();
    const invalid = structuredClone(valid);
    invalid.claims[0].requires_human_review = true;
    invalid.claims[0].reviewed_at = null;
    const errors = validateSchemaRecords(invalid, validators);
    assert.ok(errors.some((error) => error.includes("reviewed_at") && error.includes("must be string")));
  });

  it("allows a high-risk claim to remain pending until human review", async () => {
    const validators = await compileRecordValidators();
    const pending = structuredClone(valid);
    pending.claims[0].claim_status = "not_reviewed";
    pending.claims[0].reviewed_at = null;
    pending.claims[0].requires_human_review = true;
    assert.deepEqual(validateSchemaRecords(pending, validators), []);
  });

  it("requires an explicit low-risk classification for evidence-only publication", async () => {
    const validators = await compileRecordValidators();
    const invalid = structuredClone(valid);
    invalid.claims[0].reviewed_at = null;
    invalid.claims[0].publication_basis = "evidence_verified";
    invalid.claims[0].published_at = "2026-10-30";
    invalid.claims[0].publication_note = "The exact observation and its limits are documented.";
    delete invalid.claims[0].requires_human_review;
    let errors = validateSchemaRecords(invalid, validators);
    assert.ok(errors.some((error) => error.includes("requires_human_review") && error.includes("must have required property")));

    invalid.claims[0].requires_human_review = true;
    errors = validateSchemaRecords(invalid, validators);
    assert.ok(errors.some((error) => error.includes("requires_human_review") && error.includes("must be equal to constant")));
  });

  it("requires measurement details for achieved commitments", async () => {
    const validators = await compileRecordValidators();
    const invalid = structuredClone(valid);
    delete invalid.commitments[0].measurement_method;
    delete invalid.commitments[0].observed_result;
    const errors = validateSchemaRecords(invalid, validators);
    assert.ok(errors.some((error) => error.includes("measurement_method")));
    assert.ok(errors.some((error) => error.includes("observed_result")));
  });
});
