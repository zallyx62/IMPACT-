import type { EntityDossier, EvidenceRecord, ClaimRecord, SourceRecord } from "./records";

export type EvidenceRelation = "supports" | "contradicts" | "mixed" | "context";
export type EvidenceFilter = "all" | EvidenceRelation;

export interface EvidenceIndexItem {
  id: string;
  entityId: string;
  entityName: string;
  evidence: EvidenceRecord;
  source?: SourceRecord;
  claims: ClaimRecord[];
  relation: EvidenceRelation;
}

export function buildEvidenceIndex(dossiers: EntityDossier[]): EvidenceIndexItem[] {
  return dossiers.flatMap((dossier) => {
    const sources = new Map(dossier.sources.map((source) => [source.id, source]));
    return dossier.evidence.map((item) => {
      const claims = dossier.claims.filter((claim) =>
        item.supports_claim_ids?.includes(claim.id) ||
        item.contradicts_claim_ids?.includes(claim.id) ||
        claim.evidence_ids?.includes(item.id));
      const supports = claims.some((claim) => item.supports_claim_ids?.includes(claim.id));
      const contradicts = claims.some((claim) => item.contradicts_claim_ids?.includes(claim.id));
      const relation: EvidenceRelation = supports && contradicts ? "mixed"
        : supports ? "supports" : contradicts ? "contradicts" : "context";
      return {
        id: item.id, entityId: dossier.entity.id, entityName: dossier.entity.name,
        evidence: item, source: sources.get(item.source_id), claims, relation,
      };
    }).filter((item) => item.source !== undefined);
  });
}

export function filterEvidenceIndex(index: EvidenceIndexItem[], query: string, relation: EvidenceFilter): EvidenceIndexItem[] {
  const normalizedQuery = query.trim().toLocaleLowerCase("fr");
  return index.filter(({ entityName, evidence, source, claims, relation: itemRelation }) => {
    if (relation !== "all" && itemRelation !== relation) return false;
    if (!normalizedQuery) return true;
    return [entityName, evidence.summary, evidence.locator, evidence.excerpt, evidence.limitations,
      source?.title, source?.publisher, ...claims.map((claim) => claim.statement)]
      .filter(Boolean).join(" ").toLocaleLowerCase("fr").includes(normalizedQuery);
  });
}
