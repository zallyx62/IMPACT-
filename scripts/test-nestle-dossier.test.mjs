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
      "source-atni-bms-index-2024-nestle",
      "source-nestle-non-financial-statement-2024-bms",
      "source-atni-bms-index-2024-nestle",
      "source-nestle-non-financial-statement-2024-bms",
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
      "claim-nestle-bms-marketing-atni-2024",
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
      "evidence-nestle-bms-marketing-atni-2024",
      "evidence-nestle-bms-marketing-company-response",
      "evidence-nestle-bms-marketing-atni-2024",
      "evidence-nestle-bms-marketing-company-response",
    ].map((id) => readRecord("evidence", id)));
    const responses = await Promise.all([
      "response-nestle-water-cjipe",
      "response-nestle-bms-marketing-2024",
    ].map((id) => readRecord("responses", id)));
    const data = { entities: [entity], sources, claims, evidence, relationships: [], campaigns: [], responses, commitments: [] };

    assert.equal(entity.status, "review_needed");
    assert.equal(entity.reviewed_at, null);
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
    ].map((id) => readRecord("evidence", id)));
    const evidenceIds = new Set(evidence.map((item) => item.id));
    for (const claim of claims) {
      assert.ok(claim.source_ids.length > 0);
      assert.ok(claim.source_ids.every((id) => sourceIds.has(id)));
      assert.ok(claim.evidence_ids.length > 0);
      assert.ok(claim.evidence_ids.every((id) => evidenceIds.has(id)));
    }
    const waterResponse = await readRecord("responses", "response-nestle-water-cjipe");
    const bmsResponse = await readRecord("responses", "response-nestle-bms-marketing-2024");
    assert.ok(waterResponse.related_claim_ids.every((id) => claimIds.includes(id)));
    assert.equal(waterResponse.source_id, "source-nestle-2024-reponse-cjipe");
    assert.ok(bmsResponse.related_claim_ids.every((id) => claimIds.includes(id)));
    assert.equal(bmsResponse.source_id, "source-nestle-non-financial-statement-2024-bms");
  });
});
