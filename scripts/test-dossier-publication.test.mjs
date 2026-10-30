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
    { id: "campaign-reviewed", title: "Reviewed campaign", organizer_entity_id: "entity-draft", target_entity_ids: ["entity-one", "entity-draft", "entity-unreviewed"], demands: ["Publish a report"], campaign_status: "active", source_ids: ["source-reviewed"], claim_ids: ["claim-related", "claim-draft-subject"], response_ids: ["response-published", "response-withheld", "response-public-other", "response-pending-source", "response-unknown"] },
    { id: "campaign-pending", title: "Pending campaign", target_entity_ids: ["entity-one"], demands: ["Publish data"], campaign_status: "active", source_ids: ["source-pending"] },
  ],
  responses: [
    { id: "response-published", entity_id: "entity-one", related_claim_ids: ["claim-related"], summary: "A published response backed by a reviewed source.", source_id: "source-reviewed", publication_status: "published" },
    { id: "response-withheld", entity_id: "entity-one", related_claim_ids: ["claim-reviewed"], summary: "A response that must not be displayed.", source_id: "source-reviewed", publication_status: "withheld" },
    { id: "response-public-other", entity_id: "entity-two", related_claim_ids: [], summary: "A public response for a related entity.", source_id: "source-reviewed", publication_status: "published" },
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
    assert.deepEqual(dossier.campaigns[0].target_entity_ids, ["entity-one"]);
    assert.deepEqual(dossier.campaigns[0].claim_ids, ["claim-related"]);
    assert.ok(!dossier.claims.some((item) => item.id === "claim-draft-subject"));
    assert.deepEqual(dossier.responses.map((item) => item.id), ["response-published", "response-public-other"]);
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


  it("keeps the SHEIN dossier unpublished and validates its record links", async () => {
    const recordsRoot = new URL("../data/records/", import.meta.url);
    const readRecord = async (collection, id) =>
      JSON.parse(await (await import("node:fs/promises")).readFile(new URL(`${collection}/${id}.json`, recordsRoot), "utf8"));

    const entity = await readRecord("entities", "shein");
    const sourceIds = [
      "source-eu-commission-shein-dsa-2026",
      "source-fr-economy-shein-marketplace-2026",
      "source-france-pcn-shein-2025",
      "source-newclimate-shein-climate-2025",
      "source-public-eye-shein-china-2024",
      "source-reuters-shein-child-labor-2025",
      "source-senat-shein-dgccrf-2026",
      "source-shein-sustainability-2024",
      "source-uk-parliament-shein-cotton-hearing-2025",
      "source-uk-parliament-shein-cotton-letter-2025",
    ];
    const claimIds = [
      "claim-shein-child-labor-cases-2024",
      "claim-shein-chinese-cotton-traceability-2025",
      "claim-shein-consumer-information-fine-2026",
      "claim-shein-customs-noncompliance-2025",
      "claim-shein-dsa-investigation-2026",
      "claim-shein-emissions-climate-targets-2025",
      "claim-shein-france-pcn-nonconformities-2025",
      "claim-shein-misleading-prices-environmental-claims-2025",
      "claim-shein-supplier-working-hours-public-eye-2024",
    ];
    const evidenceIds = [
      "evidence-shein-child-labor-cases-2024",
      "evidence-shein-consumer-information-fine-2026",
      "evidence-shein-cotton-hearing-2025",
      "evidence-shein-cotton-letter-2025",
      "evidence-shein-customs-noncompliance-2025",
      "evidence-shein-dsa-investigation-2026",
      "evidence-shein-emissions-climate-targets-2025",
      "evidence-shein-france-pcn-2025",
      "evidence-shein-misleading-prices-environmental-claims-2025",
      "evidence-shein-supplier-working-hours-public-eye-2024",
    ];
    const [sources, claims, evidence] = await Promise.all([
      Promise.all(sourceIds.map((id) => readRecord("sources", id))),
      Promise.all(claimIds.map((id) => readRecord("claims", id))),
      Promise.all(evidenceIds.map((id) => readRecord("evidence", id))),
    ]);
    const knownSources = new Set([...entity.source_ids]);
    const knownEvidence = new Set(evidence.map((item) => item.id));
    const knownClaims = new Set(claims.map((item) => item.id));

    assert.equal(entity.status, "review_needed");
    assert.equal(entity.reviewed_at, null);
    assert.ok(sourceIds.every((id) => knownSources.has(id)));
    assert.ok(sources.every((source) => source.review_status === "to_review"));
    assert.ok(claims.every((claim) => claim.claim_status === "not_reviewed" && claim.reviewed_at === null));
    assert.equal(buildEntityDossier("shein", { ...data, entities: [...data.entities, entity], sources: [...data.sources, ...sources], claims: [...data.claims, ...claims], evidence: [...data.evidence, ...evidence] }), undefined);

    for (const claim of claims) {
      assert.ok(claim.source_ids.length > 0 && claim.source_ids.every((id) => knownSources.has(id)), `${claim.id} has an unknown source`);
      assert.ok(claim.evidence_ids.length > 0 && claim.evidence_ids.every((id) => knownEvidence.has(id)), `${claim.id} has missing evidence`);
    }
    for (const item of evidence) {
      assert.ok(knownSources.has(item.source_id), `${item.id} has an unknown source`);
      assert.ok(item.supports_claim_ids.length > 0 && item.supports_claim_ids.every((id) => knownClaims.has(id)), `${item.id} has an unknown claim`);
      for (const claimId of item.supports_claim_ids) {
        assert.ok(claims.find((claim) => claim.id === claimId).evidence_ids.includes(item.id), `${item.id} is not linked back from ${claimId}`);
      }
    }
  });

});