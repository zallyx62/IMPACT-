export const COLLECTIONS = [
  "entities",
  "sources",
  "claims",
  "evidence",
  "relationships",
  "campaigns",
  "responses",
  "commitments",
];

export function validateCollections(collections) {
  const errors = [];
  const indexes = Object.fromEntries(COLLECTIONS.map((name) => [name, new Map()]));

  for (const collectionName of COLLECTIONS) {
    const records = collections[collectionName] ?? [];
    for (const record of records) {
      if (!record || typeof record !== "object" || Array.isArray(record)) {
        errors.push(`${collectionName}: every record must be a JSON object`);
        continue;
      }
      if (typeof record.id !== "string" || record.id.length < 3) {
        errors.push(`${collectionName}: record has a missing or invalid id`);
        continue;
      }
      if (indexes[collectionName].has(record.id)) {
        errors.push(`${collectionName}: duplicate id "${record.id}"`);
        continue;
      }
      indexes[collectionName].set(record.id, record);
    }
  }

  function requireReference(from, record, field, target, options = {}) {
    const { optional = false, array = false, nonEmpty = false } = options;
    const value = record[field];
    if (value === undefined || value === null) {
      if (!optional) errors.push(`${from}/${record.id}: missing reference "${field}"`);
      return;
    }
    const references = array ? value : [value];
    if (!Array.isArray(references)) {
      errors.push(`${from}/${record.id}: "${field}" must be an array`);
      return;
    }
    if (nonEmpty && references.length === 0) {
      errors.push(`${from}/${record.id}: "${field}" must not be empty`);
    }
    for (const id of references) {
      if (typeof id !== "string" || !indexes[target].has(id)) {
        errors.push(`${from}/${record.id}: "${field}" references missing ${target} id "${String(id)}"`);
      }
    }
  }

  function validateDateRange(from, record, startField, endField) {
    const start = record[startField];
    const end = record[endField];
    if (typeof start === "string" && typeof end === "string" && start > end) {
      errors.push(`${from}/${record.id}: "${startField}" must not be later than "${endField}"`);
    }
  }

  for (const record of collections.entities ?? []) {
    requireReference("entities", record, "source_ids", "sources", { array: true, nonEmpty: true });
  }

  for (const record of collections.claims ?? []) {
    requireReference("claims", record, "subject_entity_id", "entities");
    requireReference("claims", record, "source_ids", "sources", { array: true, nonEmpty: true });
    requireReference("claims", record, "evidence_ids", "evidence", { array: true, optional: true });
    validateDateRange("claims", record, "valid_from", "valid_until");
  }

  for (const record of collections.evidence ?? []) {
    requireReference("evidence", record, "source_id", "sources");
    requireReference("evidence", record, "supports_claim_ids", "claims", { array: true, optional: true });
    requireReference("evidence", record, "contradicts_claim_ids", "claims", { array: true, optional: true });
  }

  for (const record of collections.relationships ?? []) {
    requireReference("relationships", record, "from_entity_id", "entities");
    requireReference("relationships", record, "to_entity_id", "entities");
    requireReference("relationships", record, "source_ids", "sources", { array: true, nonEmpty: true });
    if (record.from_entity_id === record.to_entity_id) {
      errors.push(`relationships/${record.id}: an entity cannot have a relationship with itself`);
    }
    validateDateRange("relationships", record, "valid_from", "valid_until");
  }

  for (const record of collections.campaigns ?? []) {
    requireReference("campaigns", record, "organizer_entity_id", "entities", { optional: true });
    requireReference("campaigns", record, "target_entity_ids", "entities", { array: true, nonEmpty: true });
    requireReference("campaigns", record, "claim_ids", "claims", { array: true, optional: true });
    requireReference("campaigns", record, "response_ids", "responses", { array: true, optional: true });
    requireReference("campaigns", record, "source_ids", "sources", { array: true, nonEmpty: true });
    validateDateRange("campaigns", record, "started_at", "ended_at");
  }

  for (const record of collections.responses ?? []) {
    requireReference("responses", record, "entity_id", "entities");
    requireReference("responses", record, "related_claim_ids", "claims", { array: true, nonEmpty: true });
    requireReference("responses", record, "source_id", "sources", { optional: true });
    validateDateRange("responses", record, "received_at", "published_at");
  }

  for (const record of collections.commitments ?? []) {
    requireReference("commitments", record, "entity_id", "entities");
    requireReference("commitments", record, "source_ids", "sources", { array: true, nonEmpty: true });
    validateDateRange("commitments", record, "announced_at", "target_date");
  }

  return errors;
}
