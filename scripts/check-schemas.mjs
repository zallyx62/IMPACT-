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
requireFields(entity, ["id", "name", "entity_type", "status", "reviewed_at"], "entity");
requireFields(relationship, ["id", "from_entity_id", "to_entity_id", "relationship_type", "knowledge_status", "source_ids"], "relationship");
requireSourcedArray(relationship, "source_ids", "relationship");
requireFields(evidence, ["id", "source_id", "locator", "summary"], "evidence");

console.log("All five JSON schemas and editorial invariants are valid.");
