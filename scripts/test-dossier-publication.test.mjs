import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildEntityDossier } from "../app/src/data/dossier-builder.ts";

const data = {
  entities: [
    { id: "entity-one", name: "Published entity", entity_type: "organization", status: "published", reviewed_at: "2026-10-30" },
    { id: "entity-two", name: "Related entity", entity_type: "organization", status: "published", reviewed_at: "2026-10-30" },
    { id: "entity-draft", name: "Draft entity", entity_type: "organization", status: "draft", reviewed_at: "2026-10-30" },
  ],
  sources: [
    { id: "source-reviewed", title: "Reviewed source", publisher: "Publisher", source_type: "official_statement", accessed_at: "2026-10-30", review_status: "reviewed" },
    { id: "source-pending", title: "Pending source", publisher: "Publisher", source_type: "journalism", accessed_at: "2026-10-30", review_status: "to_review" },
  ],
  claims: [
    { id: "claim-reviewed", subject_entity_id: "entity-one", statement: "A reviewed claim with a source.", topic: "other", claim_status: "confirmed", source_ids: ["source-reviewed"], evidence_ids: ["evidence-reviewed"], reviewed_at: "2026-10-30", uncertainty_note: "Test fixture." },
    { id: "claim-pending", subject_entity_id: "entity-one", statement: "A claim that must remain unpublished.", topic: "other", claim_status: "alleged", source_ids: ["source-pending"], reviewed_at: "2026-10-30", uncertainty_note: "Test fixture." },
    { id: "claim-related", subject_entity_id: "entity-two", statement: "A related claim included through a campaign.", topic: "other", claim_status: "corroborated", source_ids: ["source-reviewed"], reviewed_at: "2026-10-30", uncertainty_note: "Test fixture." },
  ],
  evidence: [
    { id: "evidence-reviewed", source_id: "source-reviewed", locator: "Section 1", summary: "A reviewed evidence summary for this test.", supports_claim_ids: ["claim-reviewed"] },
    { id: "evidence-pending", source_id: "source-pending", locator: "Section 2", summary: "Evidence from a source that is not reviewed yet.", supports_claim_ids: ["claim-reviewed"] },
  ],
  relationships: [
    { id: "relationship-reviewed", from_entity_id: "entity-one", to_entity_id: "entity-two", relationship_type: "owns", knowledge_status: "confirmed", source_ids: ["source-reviewed"] },
    { id: "relationship-pending", from_entity_id: "entity-one", to_entity_id: "entity-two", relationship_type: "supplies", knowledge_status: "partial", source_ids: ["source-pending"] },
  ],
  campaigns: [
    { id: "campaign-reviewed", title: "Reviewed campaign", target_entity_ids: ["entity-one"], demands: ["Publish a report"], campaign_status: "active", source_ids: ["source-reviewed"], claim_ids: ["claim-related"] },
    { id: "campaign-pending", title: "Pending campaign", target_entity_ids: ["entity-one"], demands: ["Publish data"], campaign_status: "active", source_ids: ["source-pending"] },
  ],
  responses: [
    { id: "response-published", entity_id: "entity-one", related_claim_ids: ["claim-related"], summary: "A published response backed by a reviewed source.", source_id: "source-reviewed", publication_status: "published" },
    { id: "response-withheld", entity_id: "entity-one", related_claim_ids: ["claim-reviewed"], summary: "A response that must not be displayed.", source_id: "source-reviewed", publication_status: "withheld" },
  ],
  commitments: [
    { id: "commitment-reviewed", entity_id: "entity-one", statement: "A reviewed public commitment for the test.", announced_at: "2026-10-30", status: "in_progress", source_ids: ["source-reviewed"], reviewed_at: "2026-10-30" },
    { id: "commitment-pending", entity_id: "entity-one", statement: "An unreviewed commitment for the test.", announced_at: "2026-10-30", status: "announced", source_ids: ["source-pending"], reviewed_at: "2026-10-30" },
  ],
};

describe("buildEntityDossier publication rules", () => {
  it("only exposes records backed by reviewed sources", () => {
    const dossier = buildEntityDossier("entity-one", data);
    assert.ok(dossier);
    assert.deepEqual(dossier.claims.map((item) => item.id).sort(), ["claim-related", "claim-reviewed"]);
    assert.deepEqual(dossier.sources.map((item) => item.id), ["source-reviewed"]);
    assert.deepEqual(dossier.evidence.map((item) => item.id), ["evidence-reviewed"]);
    assert.deepEqual(dossier.relationships.map((item) => item.id), ["relationship-reviewed"]);
    assert.deepEqual(dossier.campaigns.map((item) => item.id), ["campaign-reviewed"]);
    assert.deepEqual(dossier.responses.map((item) => item.id), ["response-published"]);
    assert.deepEqual(dossier.commitments.map((item) => item.id), ["commitment-reviewed"]);
  });

  it("does not expose draft entities", () => {
    assert.equal(buildEntityDossier("entity-draft", data), undefined);
  });
});
