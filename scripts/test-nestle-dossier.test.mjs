import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { buildEntityDossier, getPublishedEntities } from "../app/src/data/dossier-builder.ts";

const recordsRoot = new URL("../data/records/", import.meta.url);

async function readRecord(collection, filename) {
  return JSON.parse(await readFile(new URL(`${collection}/${filename}.json`, recordsRoot), "utf8"));
}

describe("Nestlé dossier editorial gate", () => {
  it("keeps the first Nestlé dossier out of public results until human review", async () => {
    const entity = await readRecord("entities", "nestle");
    const sourceNames = [
      "source-assemblee-nationale-2026-eaux-nestle",
      "source-senat-2025-enquete-eaux-minerales",
      "source-justice-2024-cjipe-nestle",
      "source-nestle-2024-reponse-cjipe",
      "source-atni-bms-index-2024",
      "source-nestle-bms-policy-2024",
      "source-public-eye-baby-food-2024",
      "source-bmj-nestle-sugar-2024",
      "source-nestle-sugar-response-2025",
      "source-fla-cocoa-cameroon-2022",
      "source-nestle-cocoa-plan",
      "source-nestle-non-financial-statement-2024-bms",
      "source-fla-cocoa-cameroon-iem-2021",
      "source-greenpeace-baby-food-plastic-pouches-2026",
      "source-science-advances-plastic-brand-audit-2024",
      "source-bffp-asian-plastic-sachet-audit-2024",
      "source-nestle-packaging-progress-2025",
      "source-nestle-plastic-pollution-response-2024",
      "source-nestle-deforestation-supply-chains-2025",
      "source-global-witness-liberia-cocoa-deforestation-2025",
    ];
    const sources = await Promise.all(sourceNames.map((id) => readRecord("sources", id)));
    const claims = await Promise.all([
      "claim-nestle-water-treatments",
      "claim-nestle-water-microfiltration",
      "claim-nestle-water-pressure",
      "claim-nestle-water-health-finding",
      "claim-nestle-water-cjipe",
      "claim-nestle-water-consumer-deception",
      "claim-nestle-water-gard-uncertainty",
      "claim-nestle-water-vosges-surveillance",
      "claim-nestle-bms-marketing-atni-2024",
      "claim-nestle-bms-policy-gaps",
      "claim-nestle-baby-food-added-sugar",
      "claim-nestle-cocoa-cameroon-child-labor",
      "claim-nestle-cocoa-cameroon-forced-labor-risk",
      "claim-nestle-bms-marketing-company-count-2024",
      "claim-nestle-baby-food-plastic-pouches-2025",
      "claim-nestle-branded-plastic-audit-2024",
      "claim-nestle-plastic-sachets-asia-2024",
      "claim-nestle-packaging-progress-2025",
      "claim-nestle-cocoa-deforestation-2025",
      "claim-nestle-liberia-cocoa-deforestation-exposure-2025",
    ].map((id) => readRecord("claims", id)));
    const evidence = await Promise.all([
      "evidence-nestle-water-admission",
      "evidence-nestle-water-microfiltration",
      "evidence-nestle-water-pressure",
      "evidence-nestle-water-health-finding",
      "evidence-nestle-water-cjipe",
      "evidence-nestle-water-cjipe-fine",
      "evidence-nestle-water-2026-regulatory-response",
      "evidence-nestle-water-consumer-deception",
      "evidence-nestle-water-gard-uncertainty",
      "evidence-nestle-water-vosges-surveillance",
      "evidence-nestle-bms-atni-219",
      "evidence-nestle-bms-policy-gaps",
      "evidence-nestle-baby-food-added-sugar",
      "evidence-nestle-cocoa-cameroon-child-labor",
      "evidence-nestle-cocoa-cameroon-forced-labor-risk",
      "evidence-nestle-bms-marketing-company-count-2024",
      "evidence-nestle-baby-food-plastic-pouches-2025",
      "evidence-nestle-branded-plastic-audit-2024",
      "evidence-nestle-plastic-sachets-asia-2024",
      "evidence-nestle-packaging-progress-2025",
      "evidence-nestle-cocoa-deforestation-2025",
      "evidence-nestle-liberia-cocoa-deforestation-exposure-2025",
    ].map((id) => readRecord("evidence", id)));
    const responses = await Promise.all([
      "response-nestle-water-cjipe",
      "response-nestle-bms-policy",
      "response-nestle-baby-food-sugar",
      "response-nestle-cocoa-plan",
      "response-nestle-bms-marketing-2024",
      "response-nestle-plastic-pollution-2024",
      "response-nestle-liberia-cocoa-deforestation-2025",
    ].map((id) => readRecord("responses", id)));
    const data = { entities: [entity], sources, claims, evidence, relationships: [], campaigns: [], responses, commitments: [] };

    assert.equal(entity.status, "review_needed");
    assert.equal(entity.reviewed_at, null);
    assert.ok(sourceNames.every((id) => entity.source_ids.includes(id)));
    assert.ok(sources.every((source) => source.review_status === "to_review"));
    assert.ok(claims.every((claim) => claim.reviewed_at === null));
    assert.ok(claims.every((claim) => claim.claim_status === "not_reviewed"));
    assert.deepEqual(getPublishedEntities(data), []);
    assert.equal(buildEntityDossier("nestle", data), undefined);
  });

  it("links every Nestlé claim to existing sources and evidence", async () => {
    const sourceIds = new Set([
      "source-assemblee-nationale-2026-eaux-nestle",
      "source-senat-2025-enquete-eaux-minerales",
      "source-justice-2024-cjipe-nestle",
      "source-nestle-2024-reponse-cjipe",
      "source-atni-bms-index-2024",
      "source-nestle-bms-policy-2024",
      "source-public-eye-baby-food-2024",
      "source-bmj-nestle-sugar-2024",
      "source-nestle-sugar-response-2025",
      "source-fla-cocoa-cameroon-2022",
      "source-nestle-cocoa-plan",
      "source-nestle-non-financial-statement-2024-bms",
      "source-fla-cocoa-cameroon-iem-2021",
      "source-greenpeace-baby-food-plastic-pouches-2026",
      "source-science-advances-plastic-brand-audit-2024",
      "source-bffp-asian-plastic-sachet-audit-2024",
      "source-nestle-packaging-progress-2025",
      "source-nestle-plastic-pollution-response-2024",
      "source-nestle-deforestation-supply-chains-2025",
      "source-global-witness-liberia-cocoa-deforestation-2025",
    ]);
    const claimIds = [
      "claim-nestle-water-treatments",
      "claim-nestle-water-microfiltration",
      "claim-nestle-water-pressure",
      "claim-nestle-water-health-finding",
      "claim-nestle-water-cjipe",
      "claim-nestle-water-consumer-deception",
      "claim-nestle-water-gard-uncertainty",
      "claim-nestle-water-vosges-surveillance",
      "claim-nestle-bms-marketing-atni-2024",
      "claim-nestle-bms-policy-gaps",
      "claim-nestle-baby-food-added-sugar",
      "claim-nestle-cocoa-cameroon-child-labor",
      "claim-nestle-cocoa-cameroon-forced-labor-risk",
      "claim-nestle-bms-marketing-company-count-2024",
      "claim-nestle-baby-food-plastic-pouches-2025",
      "claim-nestle-branded-plastic-audit-2024",
      "claim-nestle-plastic-sachets-asia-2024",
      "claim-nestle-packaging-progress-2025",
      "claim-nestle-cocoa-deforestation-2025",
      "claim-nestle-liberia-cocoa-deforestation-exposure-2025",
    ];
    const claims = await Promise.all(claimIds.map((id) => readRecord("claims", id)));
    const evidence = await Promise.all([
      "evidence-nestle-water-admission",
      "evidence-nestle-water-microfiltration",
      "evidence-nestle-water-pressure",
      "evidence-nestle-water-health-finding",
      "evidence-nestle-water-cjipe",
      "evidence-nestle-water-cjipe-fine",
      "evidence-nestle-water-2026-regulatory-response",
      "evidence-nestle-water-consumer-deception",
      "evidence-nestle-water-gard-uncertainty",
      "evidence-nestle-water-vosges-surveillance",
      "evidence-nestle-bms-atni-219",
      "evidence-nestle-bms-policy-gaps",
      "evidence-nestle-baby-food-added-sugar",
      "evidence-nestle-cocoa-cameroon-child-labor",
      "evidence-nestle-cocoa-cameroon-forced-labor-risk",
      "evidence-nestle-bms-marketing-company-count-2024",
      "evidence-nestle-baby-food-plastic-pouches-2025",
      "evidence-nestle-branded-plastic-audit-2024",
      "evidence-nestle-plastic-sachets-asia-2024",
      "evidence-nestle-packaging-progress-2025",
      "evidence-nestle-cocoa-deforestation-2025",
      "evidence-nestle-liberia-cocoa-deforestation-exposure-2025",
    ].map((id) => readRecord("evidence", id)));
    const evidenceIds = new Set(evidence.map((item) => item.id));
    for (const claim of claims) {
      assert.ok(claim.source_ids.length > 0);
      assert.ok(claim.source_ids.every((id) => sourceIds.has(id)));
      assert.ok(claim.evidence_ids.length > 0);
      assert.ok(claim.evidence_ids.every((id) => evidenceIds.has(id)));
    }
    const responseIds = ["response-nestle-water-cjipe", "response-nestle-bms-policy", "response-nestle-baby-food-sugar", "response-nestle-cocoa-plan", "response-nestle-bms-marketing-2024", "response-nestle-plastic-pollution-2024", "response-nestle-liberia-cocoa-deforestation-2025"];
    const responses = await Promise.all(responseIds.map((id) => readRecord("responses", id)));
    for (const response of responses) {
      assert.ok(response.related_claim_ids.every((id) => claimIds.includes(id)));
      assert.ok(sourceIds.has(response.source_id));
    }
  });
  it("keeps the infant-death count attributed and the disputed fourth case unconfirmed", async () => {
    const claim = await readRecord("claims", "claim-nestle-infant-deaths-no-causal-link-2026");
    const ministryEvidence = await readRecord("evidence", "evidence-nestle-infant-deaths-ministry-update-2026");
    const parliamentaryEvidence = await readRecord("evidence", "evidence-nestle-infant-deaths-parliamentary-status-2026");
    const ministrySource = await readRecord("sources", "source-fr-health-ministry-infant-formula-update-2026");

    assert.equal(claim.claim_status, "not_reviewed");
    assert.equal(claim.reviewed_at, null);
    assert.ok(claim.source_ids.includes(ministrySource.id));
    assert.ok(claim.evidence_ids.includes(ministryEvidence.id));
    assert.ok(claim.evidence_ids.includes(parliamentaryEvidence.id));
    assert.match(ministryEvidence.summary, /aucune imputabilité scientifique n'a été établie/u);
    assert.match(parliamentaryEvidence.summary, /il n'y a pas eu quatre décès/u);
    assert.match(parliamentaryEvidence.summary, /ne permet pas de présenter le quatrième cas comme confirmé/u);
    assert.equal(ministrySource.review_status, "to_review");
  });


  it("validates cross-references for the 2025–2026 Nestlé additions", async () => {
    const entity = await readRecord("entities", "nestle");
    const claimIds = [
      "claim-nestle-guigoz-bacillus-cereus-recall-2025",
      "claim-nestle-infant-deaths-no-causal-link-2026",
      "claim-nestle-infant-formula-notification-timeline-dispute-2026",
      "claim-nestle-infant-formula-recall-cereulide-2026",
      "claim-nestle-vosges-plastic-dumps-retrial-2026",
      "claim-nestle-waters-cjipe-completion-2026",
      "claim-nestle-waters-perrier-raids-2026",
    ];
    const evidenceIds = [
      "evidence-nestle-cereulide-notification-allegation-2026",
      "evidence-nestle-cereulide-notification-company-response-may-2026",
      "evidence-nestle-cereulide-notification-response-2026",
      "evidence-nestle-cereulide-parliamentary-timeline-2026",
      "evidence-nestle-infant-death-angers-2026",
      "evidence-nestle-infant-death-bordeaux-2026",
      "evidence-nestle-infant-death-investigations-ecdc-2026",
      "evidence-nestle-infant-deaths-ministry-update-2026",
      "evidence-nestle-infant-deaths-parliamentary-status-2026",
      "evidence-nestle-infant-formula-recall-cereulide-2026",
      "evidence-nestle-vosges-cassation-2026",
      "evidence-nestle-vosges-plastic-dumps-retrial-2026",
      "evidence-nestle-waters-cjipe-completion-2026",
      "evidence-nestle-waters-perrier-raids-2026",
      "evidence-rappelconso-guigoz-bacillus-cereus-2025",
      "evidence-rappelconso-guigoz-liquid-2026",
      "evidence-rappelconso-guigoz-optipro-relai-2026-02",
      "evidence-rappelconso-guigoz-powder-2026",
      "evidence-rappelconso-nidal-powder-2026",
    ];
    const claims = await Promise.all(claimIds.map((id) => readRecord("claims", id)));
    const evidence = await Promise.all(evidenceIds.map((id) => readRecord("evidence", id)));
    const entitySourceIds = new Set(entity.source_ids);
    const evidenceById = new Map(evidence.map((item) => [item.id, item]));
    const claimsById = new Map(claims.map((item) => [item.id, item]));

    for (const claim of claims) {
      assert.equal(claim.subject_entity_id, "nestle");
      assert.ok(claim.source_ids.length > 0);
      assert.ok(claim.source_ids.every((id) => entitySourceIds.has(id)), `${claim.id} references a source absent from the Nestlé entity`);
      assert.ok(claim.evidence_ids.length > 0);
      assert.ok(claim.evidence_ids.every((id) => evidenceById.has(id)), `${claim.id} references missing evidence`);
      assert.equal(claim.claim_status, "not_reviewed");
      assert.equal(claim.reviewed_at, null);
    }

    for (const item of evidence) {
      assert.ok(entitySourceIds.has(item.source_id), `${item.id} references a source absent from the Nestlé entity`);
      assert.ok(item.supports_claim_ids.length > 0);
      assert.ok(item.supports_claim_ids.every((id) => claimsById.has(id)), `${item.id} references a missing new claim`);
      for (const claimId of item.supports_claim_ids) {
        assert.ok(claimsById.get(claimId).evidence_ids.includes(item.id), `${item.id} is not linked back from ${claimId}`);
      }
    }
  });

});
