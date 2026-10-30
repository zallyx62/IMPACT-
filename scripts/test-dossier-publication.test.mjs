import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildEntityDossier, getPublishedEntities } from "../app/src/data/dossier-builder.ts";

const data = {
  entities: [
    { id: "entity-one", name: "Published entity", entity_type: "organization", status: "published", reviewed_at: "2026-10-30", source_ids: ["source-reviewed"] },
    { id: "entity-two", name: "Related entity", entity_type: "organization", status: "published", reviewed_at: "2026-10-30", source_ids: ["source-reviewed"] },
    { id: "entity-draft", name: "Draft entity", entity_type: "organization", status: "draft", reviewed_at: "2026-10-30", source_ids: ["source-reviewed"] },
    { id: "entity-unreviewed", name: "Unreviewed entity", entity_type: "organization", status: "published", reviewed_at: "2026-10-30", source_ids: ["source-pending"] },
    { id: "entity-no-review-date", name: "Entity awaiting review", entity_type: "organization", status: "published", reviewed_at: null, source_ids: ["source-reviewed"] },
  ],
  sources: [
    { id: "source-reviewed", title: "Reviewed source", publisher: "Publisher", source_type: "official_statement", accessed_at: "2026-10-30", review_status: "reviewed" },
    { id: "source-pending", title: "Pending source", publisher: "Publisher", source_type: "journalism", accessed_at: "2026-10-30", review_status: "to_review" },
  ],
  claims: [
    { id: "claim-reviewed", subject_entity_id: "entity-one", statement: "A reviewed claim with a source.", topic: "other", claim_status: "confirmed", source_ids: ["source-reviewed"], evidence_ids: ["evidence-reviewed"], reviewed_at: "2026-10-30", uncertainty_note: "Test fixture." },
    { id: "claim-pending", subject_entity_id: "entity-one", statement: "A claim that must remain unpublished.", topic: "other", claim_status: "alleged", source_ids: ["source-pending"], reviewed_at: "2026-10-30", uncertainty_note: "Test fixture." },
    { id: "claim-no-review", subject_entity_id: "entity-one", statement: "A claim whose source is reviewed but whose editorial review is pending.", topic: "other", claim_status: "not_reviewed", source_ids: ["source-reviewed"], reviewed_at: null, uncertainty_note: "Human editorial review is pending." },
    { id: "claim-related", subject_entity_id: "entity-two", statement: "A related claim included through a campaign.", topic: "other", claim_status: "corroborated", source_ids: ["source-reviewed"], reviewed_at: "2026-10-30", uncertainty_note: "Test fixture." },
    { id: "claim-unrelated", subject_entity_id: "entity-two", statement: "A claim unrelated to this dossier or its campaigns.", topic: "other", claim_status: "confirmed", source_ids: ["source-reviewed"], reviewed_at: "2026-10-30", uncertainty_note: "Test fixture." },
    { id: "claim-draft-subject", subject_entity_id: "entity-draft", statement: "A claim belonging to an unpublished entity.", topic: "other", claim_status: "confirmed", source_ids: ["source-reviewed"], reviewed_at: "2026-10-30", uncertainty_note: "Test fixture." },
  ],
  evidence: [
    { id: "evidence-reviewed", source_id: "source-reviewed", locator: "Section 1", summary: "A reviewed evidence summary for this test.", supports_claim_ids: ["claim-reviewed"] },
    { id: "evidence-pending", source_id: "source-pending", locator: "Section 2", summary: "Evidence from a source that is not reviewed yet.", supports_claim_ids: ["claim-reviewed"] },
  ],
  relationships: [
    { id: "relationship-reviewed", from_entity_id: "entity-one", to_entity_id: "entity-two", relationship_type: "owns", knowledge_status: "confirmed", source_ids: ["source-reviewed"] },
    { id: "relationship-pending", from_entity_id: "entity-one", to_entity_id: "entity-two", relationship_type: "supplies", knowledge_status: "partial", source_ids: ["source-pending"] },
    { id: "relationship-draft-target", from_entity_id: "entity-one", to_entity_id: "entity-draft", relationship_type: "controls", knowledge_status: "confirmed", source_ids: ["source-reviewed"] },
  ],
  campaigns: [
    { id: "campaign-reviewed", title: "Reviewed campaign", organizer_entity_id: "entity-draft", target_entity_ids: ["entity-one", "entity-draft", "entity-unreviewed"], demands: ["Publish a report"], campaign_status: "active", source_ids: ["source-reviewed"], claim_ids: ["claim-related", "claim-draft-subject"], response_ids: ["response-published", "response-withheld", "response-public-other", "response-no-published-claim", "response-pending-source", "response-unknown"] },
    { id: "campaign-pending", title: "Pending campaign", target_entity_ids: ["entity-one"], demands: ["Publish data"], campaign_status: "active", source_ids: ["source-pending"] },
  ],
  responses: [
    { id: "response-published", entity_id: "entity-one", related_claim_ids: ["claim-related"], summary: "A published response backed by a reviewed source.", source_id: "source-reviewed", publication_status: "published" },
    { id: "response-withheld", entity_id: "entity-one", related_claim_ids: ["claim-reviewed"], summary: "A response that must not be displayed.", source_id: "source-reviewed", publication_status: "withheld" },
    { id: "response-public-other", entity_id: "entity-two", related_claim_ids: ["claim-related"], summary: "A public response for a related entity.", source_id: "source-reviewed", publication_status: "published" },
    { id: "response-no-published-claim", entity_id: "entity-two", related_claim_ids: ["claim-pending"], summary: "A response whose related claim is not publishable.", source_id: "source-reviewed", publication_status: "published" },
    { id: "response-pending-source", entity_id: "entity-two", related_claim_ids: [], summary: "A response backed by a source awaiting review.", source_id: "source-pending", publication_status: "published" },
  ],
  commitments: [
    { id: "commitment-reviewed", entity_id: "entity-one", statement: "A reviewed public commitment for the test.", announced_at: "2026-10-30", status: "in_progress", source_ids: ["source-reviewed"], reviewed_at: "2026-10-30" },
    { id: "commitment-pending", entity_id: "entity-one", statement: "An unreviewed commitment for the test.", announced_at: "2026-10-30", status: "announced", source_ids: ["source-pending"], reviewed_at: "2026-10-30" },
    { id: "commitment-no-review", entity_id: "entity-one", statement: "A commitment whose source is reviewed but whose editorial review is pending.", announced_at: "2026-10-30", status: "announced", source_ids: ["source-reviewed"], reviewed_at: null },
  ],
};

describe("buildEntityDossier publication rules", () => {
  it("only exposes records backed by reviewed sources", () => {
    const dossier = buildEntityDossier("entity-one", data);
    assert.ok(dossier);
    assert.deepEqual(dossier.claims.map((item) => item.id).sort(), ["claim-related", "claim-reviewed"]);
    assert.ok(!dossier.claims.some((item) => item.id === "claim-no-review"), "claims without human editorial review must remain hidden");
    assert.deepEqual(dossier.sources.map((item) => item.id), ["source-reviewed"]);
    assert.deepEqual(dossier.evidence.map((item) => item.id), ["evidence-reviewed"]);
    assert.deepEqual(dossier.relationships.map((item) => item.id), ["relationship-reviewed"]);
    assert.ok(dossier.relationships.every((item) => item.to_entity_id !== "entity-draft"));
    assert.deepEqual(dossier.campaigns.map((item) => item.id), ["campaign-reviewed"]);
    assert.deepEqual(dossier.campaigns[0].target_entity_ids, ["entity-one"]);
    assert.equal(dossier.campaigns[0].organizer_entity_id, null, "unpublished campaign organizers are not exposed");
    assert.deepEqual(dossier.campaigns[0].claim_ids, ["claim-related"]);
    assert.deepEqual(dossier.campaigns[0].response_ids, ["response-published", "response-public-other"]);
    assert.ok(!dossier.claims.some((item) => item.id === "claim-draft-subject"));
    assert.ok(!dossier.claims.some((item) => item.id === "claim-unrelated"), "claims from unrelated entities must not leak into this dossier");
    assert.deepEqual(dossier.responses.map((item) => item.id), ["response-published", "response-public-other"]);
    assert.ok(!dossier.responses.some((item) => item.id === "response-no-published-claim"), "responses without a published related claim must remain hidden");
    assert.equal(dossier.responses.find((item) => item.id === "response-public-other")?.entity_id, "entity-two",
      "published responses linked from a related campaign must retain their responding entity");
    assert.deepEqual(dossier.commitments.map((item) => item.id), ["commitment-reviewed"]);
    assert.ok(!dossier.commitments.some((item) => item.id === "commitment-no-review"), "unreviewed commitments must remain hidden");
  });

  it("hides campaign organizers that are published but lack a reviewed source", () => {
    const withUnreviewedOrganizer = structuredClone(data);
    withUnreviewedOrganizer.campaigns[0].organizer_entity_id = "entity-unreviewed";
    const dossier = buildEntityDossier("entity-one", withUnreviewedOrganizer);
    assert.equal(dossier?.campaigns[0].organizer_entity_id, null);
    assert.deepEqual(dossier?.campaigns[0].target_entity_ids, ["entity-one"]);
  });

  it("preserves a campaign organizer when the organizer is publishable", () => {
    const withPublishedOrganizer = structuredClone(data);
    withPublishedOrganizer.campaigns[0].organizer_entity_id = "entity-two";
    const dossier = buildEntityDossier("entity-one", withPublishedOrganizer);
    assert.equal(dossier?.campaigns[0].organizer_entity_id, "entity-two");
  });

  it("publishes a fully documented evidence-verified entity and claim without human review", () => {
    const verified = structuredClone(data);
    verified.entities[0].reviewed_at = null;
    verified.entities[1].status = "draft";
    verified.entities[0].publication_basis = "evidence_verified";
    verified.entities[0].published_at = "2026-10-30";
    verified.entities[0].publication_note = "Scope is restricted to the primary report listed in this record.";
    verified.sources[0].review_status = "evidence_verified";
    verified.sources[0].verification_method = "primary_document_review";
    verified.sources[0].verified_at = "2026-10-30";
    verified.sources[0].verification_note = "Original report inspected; methodology, sample and limitations recorded.";
    verified.claims[0].reviewed_at = null;
    verified.claims[0].publication_basis = "evidence_verified";
    verified.claims[0].published_at = "2026-10-30";
    verified.claims[0].publication_note = "The wording reports only the observation made in the cited primary report.";
    const published = getPublishedEntities(verified);
    assert.deepEqual(published.map((item) => item.id), ["entity-one"]);
    const dossier = buildEntityDossier("entity-one", verified);
    assert.ok(dossier);
    assert.ok(dossier.claims.some((item) => item.id === "claim-reviewed"));
    assert.equal(dossier.entity.reviewed_at, null);
  });

  it("rejects evidence-verified records missing their audit trail", () => {
    const invalid = structuredClone(data);
    invalid.entities[0].reviewed_at = null;
    invalid.entities[1].status = "draft";
    invalid.entities[0].publication_basis = "evidence_verified";
    invalid.entities[0].published_at = "2026-10-30";
    invalid.entities[0].publication_note = "A sufficiently long documented publication rationale.";
    invalid.sources[0].review_status = "evidence_verified";
    invalid.sources[0].verification_method = "primary_document_review";
    invalid.sources[0].verified_at = "2026-10-30";
    invalid.sources[0].verification_note = "";
    assert.deepEqual(getPublishedEntities(invalid), []);
    assert.equal(buildEntityDossier("entity-one", invalid), undefined);
  });

  it("blocks allegations and high-risk claims from evidence-only publication", () => {
    const highRisk = structuredClone(data);
    highRisk.claims[0].reviewed_at = null;
    highRisk.claims[0].publication_basis = "evidence_verified";
    highRisk.claims[0].published_at = "2026-10-30";
    highRisk.claims[0].publication_note = "The primary source was inspected and its scope recorded.";
    highRisk.claims[0].claim_status = "alleged";
    highRisk.claims[0].requires_human_review = true;
    const dossier = buildEntityDossier("entity-one", highRisk);
    assert.ok(dossier);
    assert.ok(!dossier.claims.some((item) => item.id === "claim-reviewed"),
      "allegations requiring human review must not pass the evidence-only gate");
  });

  it("does not expose draft entities", () => {
    assert.equal(buildEntityDossier("entity-draft", data), undefined);
  });

  it("lists only entities with at least one reviewed source", () => {
    assert.deepEqual(getPublishedEntities(data).map((item) => item.id), ["entity-one", "entity-two"]);
    assert.ok(!getPublishedEntities(data).some((item) => item.id === "entity-no-review-date"), "entities without a review date must remain hidden");
  });

  it("does not expose an entity without a reviewed source", () => {
    const unreviewed = structuredClone(data);
    unreviewed.entities[0].source_ids = ["source-pending"];
    assert.equal(buildEntityDossier("entity-one", unreviewed), undefined);
  });
  it("removes unreviewed references from every published dossier record", () => {
    const mixed = structuredClone(data);
    mixed.entities[0].source_ids.push("source-pending");
    mixed.claims[0].source_ids.push("source-pending");
    mixed.claims[0].evidence_ids.push("evidence-pending");
    mixed.relationships[0].source_ids.push("source-pending");
    mixed.campaigns[0].source_ids.push("source-pending");
    mixed.campaigns[0].claim_ids.push("claim-pending");
    mixed.responses[0].related_claim_ids.push("claim-pending");
    mixed.commitments[0].source_ids.push("source-pending");

    const dossier = buildEntityDossier("entity-one", mixed);
    assert.ok(dossier);
    assert.deepEqual(dossier.entity.source_ids, ["source-reviewed"]);
    assert.deepEqual(dossier.claims.find((item) => item.id === "claim-reviewed")?.source_ids, ["source-reviewed"]);
    assert.deepEqual(dossier.claims.find((item) => item.id === "claim-reviewed")?.evidence_ids, ["evidence-reviewed"]);
    assert.deepEqual(dossier.relationships[0].source_ids, ["source-reviewed"]);
    assert.deepEqual(dossier.campaigns[0].source_ids, ["source-reviewed"]);
    assert.deepEqual(dossier.campaigns[0].claim_ids, ["claim-related"]);
    assert.deepEqual(dossier.responses[0].related_claim_ids, ["claim-related"]);
    assert.deepEqual(dossier.commitments[0].source_ids, ["source-reviewed"]);
    assert.ok(dossier.evidence.every((item) => item.source_id === "source-reviewed"));
  });

});