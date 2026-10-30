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
const change = await loadSchema("change");

function requireFields(schema, fields, label) {
  for (const field of fields) {
    assert.ok(schema.required.includes(field), `${label} must require ${field}`);
  }
}

function requireWebUrl(schema, field, label) {
  assert.equal(schema.properties[field].format, "uri", `${label}.${field} must use URI validation`);
  assert.equal(schema.properties[field].pattern, "^https?://", `${label}.${field} must allow only HTTP(S) URLs`);
}

function requireSourcedArray(schema, field, label) {
  const property = schema.properties[field];
  assert.equal(property.type, "array", `${label}.${field} must be an array`);
  assert.equal(property.minItems, 1, `${label}.${field} must contain at least one reference`);
  assert.equal(property.uniqueItems, true, `${label}.${field} references must be unique`);
}

requireFields(claim, ["id", "subject_entity_id", "statement", "claim_status", "source_ids", "reviewed_at", "uncertainty_note"], "claim");
assert.equal(claim.properties.requires_human_review.type, "boolean", "high-risk claims must be able to require human review");
assert.ok(claim.allOf.some((rule) => rule.if?.properties?.requires_human_review?.const === true &&
  rule.then?.required?.includes("reviewed_at")),
  "claims flagged for human review must require a review date");
assert.ok(claim.allOf.some((rule) => rule.if?.properties?.publication_basis?.const === "evidence_verified" &&
  ["published_at", "publication_note"].every((field) => rule.then?.required?.includes(field))),
  "evidence-published claims must record publication date and rationale");
requireSourcedArray(claim, "source_ids", "claim");
requireFields(source, ["id", "title", "publisher", "source_type", "accessed_at", "review_status"], "source");
assert.ok(source.properties.review_status.enum.includes("evidence_verified"));
assert.ok(source.allOf.some((rule) => rule.if?.properties?.review_status?.const === "evidence_verified" &&
  ["verification_method", "verified_at", "verification_note"].every((field) => rule.then?.required?.includes(field))),
  "evidence-verified sources must record method, date and rationale");
requireWebUrl(source, "url", "source");
requireWebUrl(source, "archived_url", "source");
requireFields(entity, ["id", "name", "entity_type", "status", "reviewed_at", "source_ids"], "entity");
assert.ok(entity.allOf.some((rule) => rule.if?.properties?.publication_basis?.const === "evidence_verified" &&
  ["published_at", "publication_note"].every((field) => rule.then?.required?.includes(field))),
  "evidence-published entities must record publication date and rationale");
requireSourcedArray(entity, "source_ids", "entity");
requireWebUrl(entity, "website", "entity");
requireFields(relationship, ["id", "from_entity_id", "to_entity_id", "relationship_type", "knowledge_status", "source_ids"], "relationship");
requireSourcedArray(relationship, "source_ids", "relationship");
assert.ok(relationship.properties.relationship_type.enum.includes("alternative_to"), "alternatives must use an explicit relationship type");
assert.ok(relationship.allOf.some((rule) => rule.if?.properties?.relationship_type?.const === "alternative_to" && rule.then?.required?.includes("notes")), "alternative relationships must explain their scope and limitations");
requireFields(evidence, ["id", "source_id", "locator", "summary"], "evidence");
requireFields(campaign, ["id", "title", "target_entity_ids", "demands", "campaign_status", "source_ids"], "campaign");
requireSourcedArray(campaign, "source_ids", "campaign");
assert.equal(campaign.properties.target_entity_ids.minItems, 1, "Every campaign must identify at least one target");
assert.equal(campaign.properties.demands.minItems, 1, "Every campaign must state at least one demand");
requireFields(response, ["id", "entity_id", "related_claim_ids", "summary", "publication_status"], "response");
assert.equal(response.properties.related_claim_ids.minItems, 1, "Every response must relate to at least one claim");
requireFields(commitment, ["id", "entity_id", "statement", "announced_at", "status", "source_ids", "reviewed_at"], "commitment");
requireFields(change, ["id", "entity_id", "event_date", "event_type", "title", "summary", "source_ids", "reviewed_at"], "change");
requireSourcedArray(change, "source_ids", "change");
requireSourcedArray(commitment, "source_ids", "commitment");
assert.ok(commitment.allOf.some((rule) => rule.if?.properties?.status?.const === "achieved" && rule.then?.required?.includes("measurement_method") && rule.then?.required?.includes("observed_result")), "Achieved commitments must require a measurement method and observed result");

console.log("All nine JSON schemas and editorial invariants are valid.");
