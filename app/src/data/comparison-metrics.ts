import type { EntityDossier } from "./records";

export interface ComparisonMetrics {
  claims: number;
  verifiedSources: number;
  evidence: number;
  commitments: number;
  responses: number;
  relationships: number;
  claimsByTopic: Record<string, number>;
  lastReviewedAt: string | null;
}

export function getComparisonMetrics(dossier: EntityDossier): ComparisonMetrics {
  const claimsByTopic = dossier.claims.reduce<Record<string, number>>((counts, claim) => {
    counts[claim.topic] = (counts[claim.topic] ?? 0) + 1;
    return counts;
  }, {});
  const reviewDates = [
    dossier.entity.reviewed_at,
    ...dossier.claims.map((claim) => claim.reviewed_at),
    ...dossier.sources.map((source) => source.verified_at),
  ].filter((value): value is string => Boolean(value)).sort();
  return {
    claims: dossier.claims.length,
    verifiedSources: dossier.sources.filter((source) => source.review_status === "evidence_verified").length,
    evidence: dossier.evidence.length,
    commitments: dossier.commitments.length,
    responses: dossier.responses.length,
    relationships: dossier.relationships.length,
    claimsByTopic,
    lastReviewedAt: reviewDates.at(-1) ?? null,
  };
}
