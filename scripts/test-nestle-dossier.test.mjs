import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { buildEntityDossier, getPublishedEntities } from "../app/src/data/dossier-builder.ts";

const recordsRoot = new URL("../data/records/", import.meta.url);

async function readRecord(collection, filename) {
  return JSON.parse(await readFile(new URL(`${collection}/${filename}.json`, recordsRoot), "utf8"));
}

describe("Nestlé dossier editorial gate", () => {
  it("publishes only the Nestlé facts that pass the evidence gate", async () => {
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
      "source-efsa-food-contact-microplastics-review-2025",
      "source-efsa-microplastics-food-risk-status-2026",
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
      "evidence-fda-microplastics-health-uncertainty-2026",
      "evidence-efsa-food-contact-microplastics-2025",
      "evidence-efsa-microplastics-risk-status-2026",
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
    const reviewGuide = await readFile(new URL("../docs/reviews/NESTLE.md", import.meta.url), "utf8");
    assert.equal(sources.length, 25);
    assert.equal(claims.length, 21);
    assert.equal(evidence.length, 26);
    assert.match(reviewGuide, /25 sources/);
    assert.match(reviewGuide, /21 affirmations et de leurs 26 éléments de preuve/);

    assert.equal(entity.status, "published");
    assert.equal(entity.reviewed_at, null);
    assert.equal(entity.publication_basis, "evidence_verified");
    assert.deepEqual(entity.source_ids, ["source-greenpeace-baby-food-plastic-pouches-2026", "source-consumer-reports-baby-food-testing-2026", "source-senat-2025-enquete-eaux-minerales", "source-assemblee-nationale-2026-eaux-nestle", "source-justice-2024-cjipe-nestle", "source-nestle-2024-reponse-cjipe"]);
    const evidenceVerifiedSourceIds = [
      "source-greenpeace-baby-food-plastic-pouches-2026",
      "source-fda-microplastics-food-guidance-2026",
      "source-efsa-food-contact-microplastics-review-2025",
      "source-efsa-microplastics-food-risk-status-2026",
      "source-nestle-baby-food-plastic-packaging-response-2026",
      "source-consumer-reports-baby-food-testing-2026",
      "source-senat-2025-enquete-eaux-minerales",
      "source-assemblee-nationale-2026-eaux-nestle",
      "source-justice-2024-cjipe-nestle",
      "source-nestle-2024-reponse-cjipe",
    ];
    assert.ok(sources.filter((source) => evidenceVerifiedSourceIds.includes(source.id)).every((source) => source.review_status === "evidence_verified"));
    assert.ok(sources.filter((source) => !evidenceVerifiedSourceIds.includes(source.id)).every((source) => source.review_status === "to_review"));
    const greenpeaceClaim = claims.find((claim) => claim.id === "claim-nestle-baby-food-plastic-pouches-2025");
    assert.equal(greenpeaceClaim.publication_basis, "evidence_verified");
    assert.equal(greenpeaceClaim.reviewed_at, null);
    const publishedClaimIds = new Set([greenpeaceClaim.id, "claim-nestle-gerber-microplastics-consumer-reports-2026", "claim-nestle-water-treatments", "claim-nestle-water-cjipe", "claim-nestle-water-health-finding"]);
    assert.ok(claims.filter((claim) => !publishedClaimIds.has(claim.id)).every((claim) => claim.reviewed_at === null));
    assert.ok(claims.filter((claim) => !publishedClaimIds.has(claim.id)).every((claim) => claim.claim_status === "not_reviewed"));
    assert.ok(claims.filter((claim) => publishedClaimIds.has(claim.id)).every((claim) => claim.requires_human_review === false));
    assert.deepEqual(getPublishedEntities(data).map((item) => item.id), ["nestle"]);
    const dossier = buildEntityDossier("nestle", data);
    assert.ok(dossier);
    assert.deepEqual(dossier.claims.map((claim) => claim.id).sort(), [...publishedClaimIds].sort());
    assert.deepEqual(new Set(dossier.sources.map((source) => source.id)), new Set(evidenceVerifiedSourceIds));
    assert.deepEqual(dossier.responses.map((response) => response.id).sort(), ["response-nestle-water-cjipe", "response-nestle-baby-food-microplastics-2026", "response-gerber-consumer-reports-baby-food-testing-2026"].sort());
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
      "source-efsa-food-contact-microplastics-review-2025",
      "source-efsa-microplastics-food-risk-status-2026",
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
      "evidence-fda-microplastics-health-uncertainty-2026",
      "evidence-efsa-food-contact-microplastics-2025",
      "evidence-efsa-microplastics-risk-status-2026",
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
  it("publishes narrowly scoped official Nestlé Waters findings and preserves unresolved accusations", async () => {
    const senate = await readRecord("sources", "source-senat-2025-enquete-eaux-minerales");
    const government = await readRecord("sources", "source-assemblee-nationale-2026-eaux-nestle");
    const justice = await readRecord("sources", "source-justice-2024-cjipe-nestle");
    const company = await readRecord("sources", "source-nestle-2024-reponse-cjipe");
    for (const source of [senate, government, justice, company]) {
      assert.equal(source.review_status, "evidence_verified");
      assert.ok(source.verification_method && source.verified_at && source.verification_note);
    }

    const treatments = await readRecord("claims", "claim-nestle-water-treatments");
    const cjipe = await readRecord("claims", "claim-nestle-water-cjipe");
    const health = await readRecord("claims", "claim-nestle-water-health-finding");
    for (const claim of [treatments, cjipe, health]) {
      assert.equal(claim.claim_status, "confirmed");
      assert.equal(claim.publication_basis, "evidence_verified");
      assert.equal(claim.reviewed_at, null);
      assert.ok(claim.published_at && claim.publication_note);
    }
    assert.match(treatments.statement, /31 août 2021/);
    assert.match(treatments.statement, /traitements UV et au charbon actif étaient interdits/);
    assert.doesNotMatch(treatments.statement, /Vergèze|Vittel|Contrexéville|0,2 micromètre/,
      "the published claim must not assign every treatment to named sites or include the separate microfiltration issue");
    assert.match(treatments.uncertainty_note, /ne faut pas en déduire que chaque traitement était utilisé sur chacun des sites/);
    assert.deepEqual(health.source_ids, ["source-assemblee-nationale-2026-eaux-nestle"]);
    assert.ok(treatments.evidence_ids.includes("evidence-nestle-water-admission"));
    assert.ok(treatments.evidence_ids.includes("evidence-nestle-water-2026-regulatory-response"));
    assert.match(cjipe.statement, /deux millions d'euros/);
    assert.match(cjipe.uncertainty_note, /ne doit pas être présentée comme une condamnation pénale/);
    assert.ok(cjipe.evidence_ids.includes("evidence-nestle-water-cjipe"));
    assert.ok(cjipe.evidence_ids.includes("evidence-nestle-water-cjipe-fine"));
    assert.match(health.statement, /aucun risque sanitaire n'a été constaté/);
    assert.match(health.uncertainty_note, /3 février 2026/);

    const unresolvedDeception = await readRecord("claims", "claim-nestle-water-consumer-deception");
    const unresolvedMicrofiltration = await readRecord("claims", "claim-nestle-water-microfiltration");
    assert.equal(unresolvedDeception.claim_status, "not_reviewed",
      "the serious consumer-deception characterization remains unpublished pending enhanced review");
    assert.equal(unresolvedMicrofiltration.claim_status, "not_reviewed",
      "the complex microfiltration regulatory interpretation remains unpublished pending further review");
    assert.equal(unresolvedDeception.requires_human_review, true);
    assert.equal(unresolvedMicrofiltration.requires_human_review, true);

    const response = await readRecord("responses", "response-nestle-water-cjipe");
    assert.deepEqual(response.related_claim_ids, [treatments.id, cjipe.id, health.id]);
    assert.equal(response.source_id, company.id);
  });

  it("keeps the Greenpeace/SINTEF microplastics finding within its actual sample and evidentiary limits", async () => {
    const source = await readRecord("sources", "source-greenpeace-baby-food-plastic-pouches-2026");
    const claim = await readRecord("claims", "claim-nestle-baby-food-plastic-pouches-2025");
    const evidence = await readRecord("evidence", "evidence-nestle-baby-food-plastic-pouches-2025");

    assert.equal(source.review_status, "evidence_verified");
    assert.equal(source.verification_method, "primary_document_review");
    assert.ok(source.verified_at && source.verification_note);
    assert.match(source.limitations, /three pouches per brand/i);
    assert.match(source.limitations, /does not prove migration/i);
    assert.equal(claim.claim_status, "confirmed");
    assert.equal(claim.publication_basis, "evidence_verified");
    assert.equal(claim.reviewed_at, null);
    assert.match(claim.statement, /trois sachets/i);
    assert.match(claim.uncertainty_note, /n'établit pas d'effet sanitaire/i);
    assert.ok(claim.source_ids.includes(source.id));
    assert.ok(claim.evidence_ids.includes(evidence.id));
    assert.ok(evidence.supports_claim_ids.includes(claim.id));
    assert.match(evidence.limitations, /No clinical health outcome was measured/i);

    const fdaSource = await readRecord("sources", "source-fda-microplastics-food-guidance-2026");
    const fdaEvidence = await readRecord("evidence", "evidence-fda-microplastics-health-uncertainty-2026");
    const nestleResponse = await readRecord("responses", "response-nestle-baby-food-microplastics-2026");
    assert.equal(fdaSource.review_status, "evidence_verified");
    const efsaReviewSource = await readRecord("sources", "source-efsa-food-contact-microplastics-review-2025");
    const efsaStatusSource = await readRecord("sources", "source-efsa-microplastics-food-risk-status-2026");
    const efsaReviewEvidence = await readRecord("evidence", "evidence-efsa-food-contact-microplastics-2025");
    const efsaStatusEvidence = await readRecord("evidence", "evidence-efsa-microplastics-risk-status-2026");
    assert.equal(efsaReviewSource.review_status, "evidence_verified");
    assert.equal(efsaStatusSource.review_status, "evidence_verified");
    assert.match(efsaReviewEvidence.summary, /libération de microplastiques/i);
    assert.match(efsaReviewEvidence.summary, /bien inférieures/i);
    assert.match(efsaStatusEvidence.summary, /ne pas avoir encore achevé une évaluation complète/i);

    assert.match(fdaEvidence.summary, /ne démontrent pas que les niveaux détectés.*présentent un risque/i);
    assert.match(claim.uncertainty_note, /La FDA indique/i);
    assert.match(claim.uncertainty_note, /La revue de littérature de l'EFSA/i);
    assert.ok(claim.evidence_ids.includes(fdaEvidence.id));
    assert.ok(claim.evidence_ids.includes(efsaReviewEvidence.id));
    assert.ok(claim.evidence_ids.includes(efsaStatusEvidence.id));
    assert.equal(nestleResponse.publication_status, "published");
    assert.equal((await readRecord("sources", "source-nestle-baby-food-plastic-packaging-response-2026")).review_status, "evidence_verified");
    assert.ok(nestleResponse.related_claim_ids.includes(claim.id));
    assert.equal(nestleResponse.source_id, "source-nestle-baby-food-plastic-packaging-response-2026");

    const crSource = await readRecord("sources", "source-consumer-reports-baby-food-testing-2026");
    const crClaim = await readRecord("claims", "claim-nestle-gerber-microplastics-consumer-reports-2026");
    const crEvidence = await readRecord("evidence", "evidence-consumer-reports-gerber-microplastics-2026");
    const gerberResponse = await readRecord("responses", "response-gerber-consumer-reports-baby-food-testing-2026");
    assert.equal(crSource.review_status, "evidence_verified");
    assert.match(crEvidence.summary, /728 294 particules/i);
    assert.equal(crClaim.claim_status, "confirmed");
    assert.equal(crClaim.publication_basis, "evidence_verified");
    assert.equal(crClaim.reviewed_at, null);
    assert.match(crClaim.uncertainty_note, /La FDA a déclaré ne pas avoir examiné/i);
    assert.ok(crClaim.evidence_ids.includes(crEvidence.id));
    assert.equal(gerberResponse.publication_status, "published");
    assert.ok(gerberResponse.related_claim_ids.includes(crClaim.id));

  });

});
