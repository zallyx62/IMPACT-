import test from "node:test";
import assert from "node:assert/strict";
import { getComparisonMetrics } from "../app/src/data/comparison-metrics.ts";

test("counts only sources explicitly marked as evidence verified", () => {
  const dossier = {
    entity: { reviewed_at: "2026-02-01" },
    claims: [{ id: "c1", topic: "environment", reviewed_at: "2026-03-01" }, { id: "c2", topic: "environment", reviewed_at: null }],
    sources: [{ review_status: "evidence_verified" }, { review_status: "pending" }, { review_status: "evidence_verified" }],
    evidence: [{ id: "e1" }], commitments: [], responses: [{ id: "r1" }],
    relationships: [{ id: "rel1" }, { id: "rel2" }],
  };
  assert.deepEqual(getComparisonMetrics(dossier), {
    claims: 2, verifiedSources: 2, evidence: 1, commitments: 0, responses: 1, relationships: 2,
    claimsByTopic: { environment: 2 }, lastReviewedAt: "2026-03-01",
  });
});

test("returns zero counts for an empty dossier", () => {
  assert.deepEqual(getComparisonMetrics({
    entity: {}, claims: [], sources: [], evidence: [], commitments: [], responses: [], relationships: [],
  }), { claims: 0, verifiedSources: 0, evidence: 0, commitments: 0, responses: 0, relationships: 0, claimsByTopic: {}, lastReviewedAt: null });
});
