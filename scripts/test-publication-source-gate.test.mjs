import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildEntityDossier } from "../app/src/data/dossier-builder.ts";

function fixture() {
  const entity = (id) => ({
    id, name: id, entity_type: "organization", status: "published",
    reviewed_at: "2026-10-30", source_ids: ["source-reviewed"],
  });
  return {
    entities: [entity("entity-one"), entity("entity-two")],
    sources: [
      { id: "source-reviewed", title: "Reviewed", publisher: "Publisher", source_type: "official_statement", accessed_at: "2026-10-30", review_status: "reviewed" },
      { id: "source-pending", title: "Pending", publisher: "Publisher", source_type: "official_statement", accessed_at: "2026-10-30", review_status: "to_review" },
    ],
    claims: [
      { id: "claim-one", subject_entity_id: "entity-one", statement: "A narrowly scoped claim.", topic: "other", claim_status: "confirmed", source_ids: ["source-reviewed"], evidence_ids: [], reviewed_at: "2026-10-30", uncertainty_note: "Test fixture." },
    ],
    evidence: [],
    relationships: [
      { id: "relationship-one", from_entity_id: "entity-one", to_entity_id: "entity-two", relationship_type: "owns", knowledge_status: "confirmed", source_ids: ["source-reviewed"] },
    ],
    campaigns: [
      { id: "campaign-one", title: "Campaign", target_entity_ids: ["entity-one"], demands: ["Test"], campaign_status: "active", source_ids: ["source-reviewed"], claim_ids: [], response_ids: [] },
    ],
    responses: [],
    commitments: [
      { id: "commitment-one", entity_id: "entity-one", statement: "Commitment.", announced_at: "2026-10-30", status: "in_progress", source_ids: ["source-reviewed"], reviewed_at: "2026-10-30" },
    ],
  };
}

describe("strict publication source gate", () => {
  it("withholds an entity when any cited source is unpublished", () => {
    const data = fixture();
    data.entities[0].source_ids = ["source-reviewed", "source-pending"];
    assert.equal(buildEntityDossier("entity-one", data), undefined);
  });

  it("withholds a claim when any cited source is unpublished", () => {
    const data = fixture();
    data.claims[0].source_ids = ["source-reviewed", "source-pending"];
    const dossier = buildEntityDossier("entity-one", data);
    assert.ok(dossier);
    assert.deepEqual(dossier.claims, []);
  });

  it("withholds relationships, campaigns and commitments with mixed source status", () => {
    const data = fixture();
    data.relationships[0].source_ids = ["source-reviewed", "source-pending"];
    data.campaigns[0].source_ids = ["source-reviewed", "source-pending"];
    data.commitments[0].source_ids = ["source-reviewed", "source-pending"];
    const dossier = buildEntityDossier("entity-one", data);
    assert.ok(dossier);
    assert.deepEqual(dossier.relationships, []);
    assert.deepEqual(dossier.campaigns, []);
    assert.deepEqual(dossier.commitments, []);
  });
});
