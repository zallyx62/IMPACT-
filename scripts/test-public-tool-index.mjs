import test from "node:test";
import assert from "node:assert/strict";
import { buildActorIndex, buildCommitmentIndex } from "../app/src/data/public-tool-index.ts";

const dossier = (id, name, relationships = [], commitments = [], sources = []) => ({
  entity: { id, name }, relationships, commitments, sources,
});

test("actor index deduplicates relationships and excludes links to unpublished entities", () => {
  const relationship = {
    id: "r1", from_entity_id: "a", to_entity_id: "b", relationship_type: "supplies",
    knowledge_status: "confirmed", source_ids: ["s1"], notes: "Documented supplier link",
  };
  const result = buildActorIndex([
    dossier("a", "Alpha", [relationship], [], [{ id: "s1", title: "Source A" }]),
    dossier("b", "Beta", [relationship]),
  ]);
  assert.equal(result.length, 1);
  assert.equal(result[0].fromName, "Alpha");
  assert.equal(result[0].toName, "Beta");
  assert.deepEqual(result[0].sourceTitles, ["Source A"]);
  assert.equal(buildActorIndex([dossier("a", "Alpha", [relationship])]).length, 0);
});

test("commitment index keeps the published entity and sorts by target date", () => {
  const result = buildCommitmentIndex([
    dossier("a", "Alpha", [], [
      { id: "later", entity_id: "a", statement: "Later", announced_at: "2025-01-01", target_date: "2027-01-01", status: "announced", source_ids: ["s1"] },
      { id: "sooner", entity_id: "a", statement: "Sooner", announced_at: "2025-01-01", target_date: "2026-01-01", status: "in_progress", source_ids: ["s1"] },
    ], [{ id: "s1", title: "Commitment source" }]),
  ]);
  assert.deepEqual(result.map((item) => item.id), ["sooner", "later"]);
  assert.deepEqual(result[0].sourceTitles, ["Commitment source"]);
});
