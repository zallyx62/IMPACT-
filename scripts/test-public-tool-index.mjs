import test from "node:test";
import assert from "node:assert/strict";
import { buildActorIndex, buildAlternativeIndex, buildCommitmentIndex, buildDossierTimeline, getCommitmentDisplayStatus } from "../app/src/data/public-tool-index.ts";

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


test("alternative index requires two published entities, a confirmed or partial relation and a source", () => {
  const relationship = {
    id: "alt-1", from_entity_id: "b", to_entity_id: "a", relationship_type: "alternative_to",
    knowledge_status: "confirmed", source_ids: ["s1"], notes: "Alternative pour le même usage",
  };
  const result = buildAlternativeIndex([
    dossier("a", "Produit cible"),
    dossier("b", "Alternative", [relationship], [], [{ id: "s1", title: "Comparaison sourcée" }]),
  ]);
  assert.equal(result.length, 1);
  assert.equal(result[0].alternativeName, "Alternative");
  assert.equal(result[0].targetName, "Produit cible");
  assert.equal(buildAlternativeIndex([dossier("a", "Produit cible"), dossier("b", "Alternative", [{ ...relationship, notes: "" }], [], [{ id: "s1", title: "Comparaison sourcée" }])]).length, 0);
  assert.equal(buildAlternativeIndex([dossier("a", "Produit cible"), dossier("b", "Alternative", [relationship])]).length, 0);
});

test("timeline includes only dated public events and sorts newest first", () => {
  const result = buildDossierTimeline([{
    ...dossier("a", "Alpha", [], [
      { id: "c1", entity_id: "a", statement: "Engagement", announced_at: "2025-01-01", target_date: "2026-01-01", status: "in_progress", source_ids: ["s1"], reviewed_at: "2025-02-01" },
    ], [{ id: "s1", title: "Source" }]),
    entity: { id: "a", name: "Alpha", published_at: "2024-01-01", source_ids: ["s1"] },
    claims: [{ id: "claim1", statement: "Constat", published_at: "2025-03-01", source_ids: ["s1"] }],
    responses: [{ id: "response1", summary: "Réponse", received_at: "2025-04-01", source_id: "s1" }],
  }]);
  assert.equal(result[0].date, "2025-04-01");
  assert.ok(result.some((event) => event.title === "Échéance annoncée"));
  assert.equal(result.length, 6);
});

test("overdue label is computed without mutating the published commitment status", () => {
  const commitment = { status: "in_progress", target_date: "2025-12-31" };
  assert.equal(getCommitmentDisplayStatus(commitment, new Date("2026-01-01T12:00:00")), "overdue");
  assert.equal(commitment.status, "in_progress");
  assert.equal(getCommitmentDisplayStatus({ status: "achieved", target_date: "2025-01-01" }, new Date("2026-01-01")), "achieved");
});
