import type { EntityDossier } from "./records";

export interface ComparisonMetrics {
  claims: number;
  verifiedSources: number;
  evidence: number;
  commitments: number;
  responses: number;
  relationships: number;
}

export function getComparisonMetrics(dossier: EntityDossier): ComparisonMetrics {
  return {
    claims: dossier.claims.length,
    verifiedSources: dossier.sources.filter((source) => source.review_status === "evidence_verified").length,
    evidence: dossier.evidence.length,
    commitments: dossier.commitments.length,
    responses: dossier.responses.length,
    relationships: dossier.relationships.length,
  };
}
