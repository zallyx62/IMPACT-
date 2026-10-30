import assert from "node:assert/strict";
import { publicRecords } from "../app/src/data/public-records.generated.ts";

const entityIds = new Set(publicRecords.entities.map((item) => item.id));
const sourceIds = new Set(publicRecords.sources.map((item) => item.id));
const claimIds = new Set(publicRecords.claims.map((item) => item.id));
const evidenceIds = new Set(publicRecords.evidence.map((item) => item.id));
const responseIds = new Set(publicRecords.responses.map((item) => item.id));

assert.ok(publicRecords.entities.every((item) => item.status === "published" && item.reviewed_at !== null),
  "only human-reviewed published entities may enter the public bundle");
assert.ok(publicRecords.sources.every((item) => item.review_status === "reviewed"),
  "unreviewed sources must never enter the public bundle");
assert.ok(publicRecords.claims.every((item) => item.reviewed_at !== null && item.claim_status !== "not_reviewed"),
  "unreviewed claims must never enter the public bundle");
assert.ok(publicRecords.evidence.every((item) => sourceIds.has(item.source_id)),
  "public evidence must only reference public sources");

for (const entity of publicRecords.entities) {
  assert.ok(entity.source_ids.length > 0 && entity.source_ids.every((id) => sourceIds.has(id)));
}
for (const claim of publicRecords.claims) {
  assert.ok(claim.source_ids.length > 0 && claim.source_ids.every((id) => sourceIds.has(id)));
  assert.ok((claim.evidence_ids ?? []).every((id) => evidenceIds.has(id)));
}
for (const item of publicRecords.evidence) {
  assert.ok((item.supports_claim_ids ?? []).every((id) => claimIds.has(id)));
  assert.ok((item.contradicts_claim_ids ?? []).every((id) => claimIds.has(id)));
}
for (const item of publicRecords.relationships) {
  assert.ok(entityIds.has(item.from_entity_id) && entityIds.has(item.to_entity_id));
  assert.ok(item.source_ids.length > 0 && item.source_ids.every((id) => sourceIds.has(id)));
}
for (const item of publicRecords.campaigns) {
  assert.ok(item.target_entity_ids.length > 0 && item.target_entity_ids.every((id) => entityIds.has(id)));
  assert.ok(item.source_ids.length > 0 && item.source_ids.every((id) => sourceIds.has(id)));
  assert.ok((item.claim_ids ?? []).every((id) => claimIds.has(id)));
  assert.ok((item.response_ids ?? []).every((id) => responseIds.has(id)));
}
for (const item of publicRecords.responses) {
  assert.ok(entityIds.has(item.entity_id));
  assert.ok(item.source_id && sourceIds.has(item.source_id));
  assert.ok(item.related_claim_ids.length > 0 && item.related_claim_ids.every((id) => claimIds.has(id)));
}
for (const item of publicRecords.commitments) {
  assert.ok(entityIds.has(item.entity_id));
  assert.ok(item.source_ids.length > 0 && item.source_ids.every((id) => sourceIds.has(id)));
}

const nestle = publicRecords.entities.find((item) => item.id === "nestle");
if (!nestle) {
  const serialized = JSON.stringify(publicRecords);
  assert.doesNotMatch(serialized, /claim-nestle-|source-nestle-|evidence-nestle-/,
    "Nestlé draft records must not be shipped while the entity remains unpublished");
}

console.log(`Public editorial bundle checks passed (${publicRecords.entities.length} entities, ${publicRecords.claims.length} claims, ${publicRecords.sources.length} sources).`);
