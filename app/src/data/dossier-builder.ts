import type {
  CampaignRecord,
  ClaimRecord,
  CommitmentRecord,
  EntityDossier,
  EntityRecord,
  EvidenceRecord,
  RelationshipRecord,
  ResponseRecord,
  SourceRecord,
} from "./records";

export interface DossierCollections {
  entities: EntityRecord[];
  sources: SourceRecord[];
  claims: ClaimRecord[];
  evidence: EvidenceRecord[];
  relationships: RelationshipRecord[];
  campaigns: CampaignRecord[];
  responses: ResponseRecord[];
  commitments: CommitmentRecord[];
}

export function buildEntityDossier(entityId: string, data: DossierCollections): EntityDossier | undefined {
  const entity = data.entities.find((item) => item.id === entityId && item.status === "published");
  if (!entity) return undefined;

  const reviewedSourceIds = new Set(
    data.sources.filter((item) => item.review_status === "reviewed").map((item) => item.id),
  );

  const entityRelationships = data.relationships.filter(
    (item) =>
      (item.from_entity_id === entityId || item.to_entity_id === entityId) &&
      item.source_ids.some((sourceId) => reviewedSourceIds.has(sourceId)),
  );

  const entityCampaigns = data.campaigns.filter(
    (item) =>
      item.target_entity_ids.includes(entityId) &&
      item.source_ids.some((sourceId) => reviewedSourceIds.has(sourceId)),
  );

  const entityResponses = data.responses.filter(
    (item) =>
      item.entity_id === entityId &&
      item.publication_status === "published" &&
      Boolean(item.source_id && reviewedSourceIds.has(item.source_id)),
  );

  const entityCommitments = data.commitments.filter(
    (item) =>
      item.entity_id === entityId &&
      item.source_ids.some((sourceId) => reviewedSourceIds.has(sourceId)),
  );

  const claimIds = new Set(
    data.claims
      .filter((item) => item.subject_entity_id === entityId && item.source_ids.some((sourceId) => reviewedSourceIds.has(sourceId)))
      .map((item) => item.id),
  );
  entityCampaigns.forEach((item) => (item.claim_ids ?? []).forEach((id) => claimIds.add(id)));
  entityResponses.forEach((item) => item.related_claim_ids.forEach((id) => claimIds.add(id)));

  const relatedClaims = data.claims.filter(
    (item) => claimIds.has(item.id) && item.source_ids.some((sourceId) => reviewedSourceIds.has(sourceId)),
  );
  const sourceIds = new Set<string>();
  const evidenceIds = new Set(relatedClaims.flatMap((item) => item.evidence_ids ?? []));

  relatedClaims.forEach((item) => item.source_ids.forEach((id) => sourceIds.add(id)));
  entityRelationships.forEach((item) => item.source_ids.forEach((id) => sourceIds.add(id)));
  entityCampaigns.forEach((item) => item.source_ids.forEach((id) => sourceIds.add(id)));
  entityResponses.forEach((item) => {
    if (item.source_id) sourceIds.add(item.source_id);
  });
  entityCommitments.forEach((item) => item.source_ids.forEach((id) => sourceIds.add(id)));

  const relatedEvidence = data.evidence.filter(
    (item) =>
      reviewedSourceIds.has(item.source_id) &&
      (evidenceIds.has(item.id) ||
        item.supports_claim_ids?.some((id) => claimIds.has(id)) ||
        item.contradicts_claim_ids?.some((id) => claimIds.has(id))),
  );
  relatedEvidence.forEach((item) => sourceIds.add(item.source_id));

  const relatedSources = data.sources.filter(
    (item) => sourceIds.has(item.id) && reviewedSourceIds.has(item.id),
  );

  return {
    entity,
    claims: relatedClaims,
    sources: relatedSources,
    evidence: relatedEvidence,
    relationships: entityRelationships,
    campaigns: entityCampaigns,
    responses: entityResponses,
    commitments: entityCommitments,
  };
}
