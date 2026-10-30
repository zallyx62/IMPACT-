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
      "source-nestle-baby-food-plastic-packaging-response-2026",
      "source-fda-microplastics-food-guidance-2026",
      "source-consumer-reports-baby-food-testing-2026",
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
      "claim-nestle-baby-food-microplastics-2026",
      "claim-nestle-gerber-microplastics-consumer-reports-2026",
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
      "evidence-nestle-baby-food-microplastics-2026",
      "evidence-fda-microplastics-health-uncertainty-2026",
      "evidence-consumer-reports-gerber-microplastics-2026",
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
      "response-nestle-baby-food-microplastics-2026",
      "response-gerber-consumer-reports-baby-food-testing-2026",
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
      "source-nestle-baby-food-plastic-packaging-response-2026",
      "source-fda-microplastics-food-guidance-2026",
      "source-consumer-reports-baby-food-testing-2026",
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
      "claim-nestle-baby-food-microplastics-2026",
      "claim-nestle-gerber-microplastics-consumer-reports-2026",
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
      "evidence-nestle-baby-food-microplastics-2026",
      "evidence-fda-microplastics-health-uncertainty-2026",
      "evidence-consumer-reports-gerber-microplastics-2026",
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
    const responseIds = ["response-nestle-water-cjipe", "response-nestle-bms-policy", "response-nestle-baby-food-sugar", "response-nestle-cocoa-plan", "response-nestle-bms-marketing-2024", "response-nestle-plastic-pollution-2024", "response-nestle-liberia-cocoa-deforestation-2025", "response-nestle-baby-food-microplastics-2026", "response-gerber-consumer-reports-baby-food-testing-2026"];
    const responses = await Promise.all(responseIds.map((id) => readRecord("responses", id)));
    for (const response of responses) {
      assert.ok(response.related_claim_ids.every((id) => claimIds.includes(id)));
      assert.ok(sourceIds.has(response.source_id));
    }
  });
  it("keeps the Greenpeace/SINTEF microplastics finding within its actual sample and evidentiary limits", async () => {
    const source = await readRecord("sources", "source-greenpeace-baby-food-plastic-pouches-2026");
    const claim = await readRecord("claims", "claim-nestle-baby-food-microplastics-2026");
    const evidence = await readRecord("evidence", "evidence-nestle-baby-food-microplastics-2026");

    assert.equal(source.review_status, "to_review");
    assert.match(source.limitations, /three pouches per brand/i);
    assert.match(source.limitations, /does not prove migration/i);
    assert.equal(claim.claim_status, "not_reviewed");
    assert.equal(claim.reviewed_at, null);
    assert.match(claim.statement, /trois sachets/i);
    assert.match(claim.uncertainty_note, /ne démontre aucun effet sanitaire/i);
    assert.ok(claim.source_ids.includes(source.id));
    assert.ok(claim.evidence_ids.includes(evidence.id));
    assert.ok(evidence.supports_claim_ids.includes(claim.id));
    assert.match(evidence.limitations, /ne démontre ni.*effet sanitaire/i);

    const fdaSource = await readRecord("sources", "source-fda-microplastics-food-guidance-2026");
    const fdaEvidence = await readRecord("evidence", "evidence-fda-microplastics-health-uncertainty-2026");
    const nestleResponse = await readRecord("responses", "response-nestle-baby-food-microplastics-2026");
    assert.equal(fdaSource.review_status, "to_review");
    assert.match(fdaEvidence.summary, /ne démontrent pas que les niveaux détectés.*présentent un risque/i);
    assert.match(claim.uncertainty_note, /La FDA indique/i);
    assert.equal(nestleResponse.publication_status, "published");
    assert.ok(nestleResponse.related_claim_ids.includes(claim.id));
    assert.equal(nestleResponse.source_id, "source-nestle-baby-food-plastic-packaging-response-2026");

    const crSource = await readRecord("sources", "source-consumer-reports-baby-food-testing-2026");
    const crClaim = await readRecord("claims", "claim-nestle-gerber-microplastics-consumer-reports-2026");
    const crEvidence = await readRecord("evidence", "evidence-consumer-reports-gerber-microplastics-2026");
    const gerberResponse = await readRecord("responses", "response-gerber-consumer-reports-baby-food-testing-2026");
    assert.equal(crSource.review_status, "to_review");
    assert.match(crEvidence.summary, /728 294 particules/i);
    assert.equal(crClaim.claim_status, "not_reviewed");
    assert.equal(crClaim.reviewed_at, null);
    assert.match(crClaim.uncertainty_note, /La FDA a déclaré ne pas avoir examiné/i);
    assert.ok(crClaim.evidence_ids.includes(crEvidence.id));
    assert.equal(gerberResponse.publication_status, "published");
    assert.ok(gerberResponse.related_claim_ids.includes(crClaim.id));

  });

});
