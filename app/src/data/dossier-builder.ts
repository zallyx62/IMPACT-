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

function reviewedSourceIds(data: DossierCollections): Set<string> {
  return new Set(
    data.sources.filter((source) => source.review_status === "reviewed").map((source) => source.id),
  );
}

export function getPublishedEntities(data: DossierCollections): EntityRecord[] {
  const reviewed = reviewedSourceIds(data);
  return data.entities
    .filter(
      (entity) =>
        entity.status === "published" &&
        Array.isArray(entity.source_ids) &&
        entity.source_ids.some((sourceId) => reviewed.has(sourceId)),
    )
    .map((entity) => ({
      ...entity,
      source_ids: entity.source_ids.filter((sourceId) => reviewed.has(sourceId)),
    }));
}

export function buildEntityDossier(entityId: string, data: DossierCollections): EntityDossier | undefined {
  const originalEntity = data.entities.find((item) => item.id === entityId && item.status === "published");
  if (!originalEntity || !Array.isArray(originalEntity.source_ids)) return undefined;

  const reviewed = reviewedSourceIds(data);
  if (!originalEntity.source_ids.some((sourceId) => reviewed.has(sourceId))) return undefined;

  const publishableEntityIds = new Set(
    data.entities
      .filter(
        (item) =>
          item.status === "published" &&
          Array.isArray(item.source_ids) &&
          item.source_ids.some((sourceId) => reviewed.has(sourceId)),
      )
      .map((item) => item.id),
  );
  const entityRelationships = data.relationships.filter(
    (item) =>
      (item.from_entity_id === entityId || item.to_entity_id === entityId) &&
      publishableEntityIds.has(item.from_entity_id) &&
      publishableEntityIds.has(item.to_entity_id) &&
      item.source_ids.some((sourceId) => reviewed.has(sourceId)),
  );
  const entityCampaigns = data.campaigns.filter(
    (item) =>
      item.target_entity_ids.includes(entityId) &&
      item.target_entity_ids.every((targetId) => publishableEntityIds.has(targetId)) &&
      (!item.organizer_entity_id || publishableEntityIds.has(item.organizer_entity_id)) &&
      item.source_ids.some((sourceId) => reviewed.has(sourceId)),
  );
  const entityResponses = data.responses.filter(
    (item) =>
      item.entity_id === entityId &&
      item.publication_status === "published" &&
      Boolean(item.source_id && reviewed.has(item.source_id)),
  );
  const entityCommitments = data.commitments.filter(
    (item) =>
      item.entity_id === entityId &&
      item.source_ids.some((sourceId) => reviewed.has(sourceId)),
  );

  const claimIds = new Set(
    data.claims
      .filter((item) => publishableEntityIds.has(item.subject_entity_id) && item.source_ids.some((sourceId) => reviewed.has(sourceId)))
      .map((item) => item.id),
  );
  entityCampaigns.forEach((item) => (item.claim_ids ?? []).forEach((id) => claimIds.add(id)));
  entityResponses.forEach((item) => item.related_claim_ids.forEach((id) => claimIds.add(id)));

  const claims = data.claims.filter(
    (item) => claimIds.has(item.id) && publishableEntityIds.has(item.subject_entity_id) && item.source_ids.some((sourceId) => reviewed.has(sourceId)),
  );
  const publishedClaimIds = new Set(claims.map((item) => item.id));
  const evidenceIds = new Set(claims.flatMap((item) => item.evidence_ids ?? []));
  const evidence = data.evidence.filter(
    (item) =>
      reviewed.has(item.source_id) &&
      (evidenceIds.has(item.id) ||
        item.supports_claim_ids?.some((id) => publishedClaimIds.has(id)) ||
        item.contradicts_claim_ids?.some((id) => publishedClaimIds.has(id))),
  );
  const publishedEvidenceIds = new Set(evidence.map((item) => item.id));

  const sourceIds = new Set(originalEntity.source_ids.filter((id) => reviewed.has(id)));
  claims.forEach((item) => item.source_ids.forEach((id) => sourceIds.add(id)));
  entityRelationships.forEach((item) => item.source_ids.forEach((id) => sourceIds.add(id)));
  entityCampaigns.forEach((item) => item.source_ids.forEach((id) => sourceIds.add(id)));
  entityResponses.forEach((item) => {
    if (item.source_id) sourceIds.add(item.source_id);
  });
  entityCommitments.forEach((item) => item.source_ids.forEach((id) => sourceIds.add(id)));
  evidence.forEach((item) => sourceIds.add(item.source_id));

  const sources = data.sources.filter((item) => sourceIds.has(item.id) && reviewed.has(item.id));
  const publishedSourceIds = new Set(sources.map((item) => item.id));

  return {
    entity: {
      ...originalEntity,
      source_ids: originalEntity.source_ids.filter((id) => publishedSourceIds.has(id)),
    },
    claims: claims.map((item) => ({
      ...item,
      source_ids: item.source_ids.filter((id) => publishedSourceIds.has(id)),
      ...(item.evidence_ids
        ? { evidence_ids: item.evidence_ids.filter((id) => publishedEvidenceIds.has(id)) }
        : {}),
    })),
    sources,
    evidence: evidence.map((item) => ({
      ...item,
      supports_claim_ids: item.supports_claim_ids?.filter((id) => publishedClaimIds.has(id)),
      contradicts_claim_ids: item.contradicts_claim_ids?.filter((id) => publishedClaimIds.has(id)),
    })),
    relationships: entityRelationships.map((item) => ({
      ...item,
      source_ids: item.source_ids.filter((id) => publishedSourceIds.has(id)),
    })),
    campaigns: entityCampaigns.map((item) => ({
      ...item,
      target_entity_ids: item.target_entity_ids.filter((id) => publishableEntityIds.has(id)),
      source_ids: item.source_ids.filter((id) => publishedSourceIds.has(id)),
      ...(item.claim_ids
        ? { claim_ids: item.claim_ids.filter((id) => publishedClaimIds.has(id)) }
        : {}),
    })),
    responses: entityResponses.map((item) => ({
      ...item,
      related_claim_ids: item.related_claim_ids.filter((id) => publishedClaimIds.has(id)),
    })),
    commitments: entityCommitments.map((item) => ({
      ...item,
      source_ids: item.source_ids.filter((id) => publishedSourceIds.has(id)),
    })),
  };
}
