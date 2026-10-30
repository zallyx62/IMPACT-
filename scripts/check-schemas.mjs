import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function loadSchema(name) {
  return JSON.parse(await readFile(new URL(`../data/schema/${name}.schema.json`, import.meta.url), "utf8"));
}

const claim = await loadSchema("claim");
const source = await loadSchema("source");
const entity = await loadSchema("entity");
const relationship = await loadSchema("relationship");
const evidence = await loadSchema("evidence");
const campaign = await loadSchema("campaign");
const response = await loadSchema("response");
const commitment = await loadSchema("commitment");

function requireFields(schema, fields, label) {
  for (const field of fields) {
    assert.ok(schema.required.includes(field), `${label} must require ${field}`);
  }
}

function requireSourcedArray(schema, field, label) {
  const property = schema.properties[field];
  assert.equal(property.type, "array", `${label}.${field} must be an array`);
  assert.equal(property.minItems, 1, `${label}.${field} must contain at least one reference`);
  assert.equal(property.uniqueItems, true, `${label}.${field} references must be unique`);
}

requireFields(claim, ["id", "subject_entity_id", "statement", "claim_status", "source_ids", "reviewed_at", "uncertainty_note"], "claim");
requireSourcedArray(claim, "source_ids", "claim");
requireFields(source, ["id", "title", "publisher", "source_type", "accessed_at", "review_status"], "source");
requireFields(entity, ["id", "name", "entity_type", "status", "reviewed_at", "source_ids"], "entity");
requireSourcedArray(entity, "source_ids", "entity");
requireFields(relationship, ["id", "from_entity_id", "to_entity_id", "relationship_type", "knowledge_status", "source_ids"], "relationship");
requireSourcedArray(relationship, "source_ids", "relationship");
requireFields(evidence, ["id", "source_id", "locator", "summary"], "evidence");
requireFields(campaign, ["id", "title", "target_entity_ids", "demands", "campaign_status", "source_ids"], "campaign");
requireSourcedArray(campaign, "source_ids", "campaign");
assert.equal(campaign.properties.target_entity_ids.minItems, 1, "Every campaign must identify at least one target");
assert.equal(campaign.properties.demands.minItems, 1, "Every campaign must state at least one demand");
requireFields(response, ["id", "entity_id", "related_claim_ids", "summary", "publication_status"], "response");
assert.equal(response.properties.related_claim_ids.minItems, 1, "Every response must relate to at least one claim");
requireFields(commitment, ["id", "entity_id", "statement", "announced_at", "status", "source_ids", "reviewed_at"], "commitment");
requireSourcedArray(commitment, "source_ids", "commitment");
assert.ok(commitment.allOf.some((rule) => rule.if?.properties?.status?.const === "achieved" && rule.then?.required?.includes("measurement_method") && rule.then?.required?.includes("observed_result")), "Achieved commitments must require a measurement method and observed result");

console.log("All eight JSON schemas and editorial invariants are valid.");
