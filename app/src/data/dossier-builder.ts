import type {
  CampaignRecord, ClaimRecord, CommitmentRecord, EntityDossier, EntityRecord,
  EvidenceRecord, RelationshipRecord, ResponseRecord, SourceRecord,
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

function publishableSourceIds(data: DossierCollections): Set<string> {
  return new Set(data.sources.filter((source) =>
    source.review_status === "reviewed" ||
    (source.review_status === "evidence_verified" &&
      Boolean(source.verified_at) &&
      Boolean(source.verification_method) &&
      Boolean(source.verification_note?.trim())),
  ).map((source) => source.id));
}

function isPublishableEntity(entity: EntityRecord, sourceIds: Set<string>): boolean {
  const eligible = entity.reviewed_at !== null ||
    (entity.publication_basis === "evidence_verified" &&
      Boolean(entity.published_at) && Boolean(entity.publication_note?.trim()));
  return entity.status === "published" && eligible &&
    Array.isArray(entity.source_ids) && entity.source_ids.every((id) => sourceIds.has(id));
}

function isPublishableClaim(claim: ClaimRecord, sourceIds: Set<string>): boolean {
  const eligible = claim.reviewed_at !== null ||
    (claim.publication_basis === "evidence_verified" &&
      (claim.claim_status === "confirmed" || claim.claim_status === "corroborated") &&
      claim.requires_human_review === false &&
      Boolean(claim.published_at) && Boolean(claim.publication_note?.trim()));
  return claim.claim_status !== "not_reviewed" && eligible &&
    Array.isArray(claim.source_ids) && claim.source_ids.length > 0 &&
    claim.source_ids.every((id) => sourceIds.has(id));
}

export function getPublishedEntities(data: DossierCollections): EntityRecord[] {
  const sources = publishableSourceIds(data);
  return data.entities
    .filter((entity) => isPublishableEntity(entity, sources))
    .map((entity) => ({ ...entity, source_ids: entity.source_ids.filter((id) => sources.has(id)) }));
}

export function buildEntityDossier(entityId: string, data: DossierCollections): EntityDossier | undefined {
  const publishableSources = publishableSourceIds(data);
  const originalEntity = data.entities.find((item) =>
    item.id === entityId && isPublishableEntity(item, publishableSources));
  if (!originalEntity) return undefined;

  const publishableEntityIds = new Set(
    data.entities.filter((item) => isPublishableEntity(item, publishableSources)).map((item) => item.id),
  );

  const entityRelationships = data.relationships.filter((item) =>
    (item.from_entity_id === entityId || item.to_entity_id === entityId) &&
    publishableEntityIds.has(item.from_entity_id) &&
    publishableEntityIds.has(item.to_entity_id) &&
    item.source_ids.length > 0 &&
    item.source_ids.every((id) => publishableSources.has(id)),
  );

  const entityCampaigns = data.campaigns.filter((item) =>
    item.target_entity_ids.includes(entityId) &&
    item.target_entity_ids.some((id) => publishableEntityIds.has(id)) &&
    item.source_ids.length > 0 &&
    item.source_ids.every((id) => publishableSources.has(id)),
  );

  const campaignResponseIds = new Set(entityCampaigns.flatMap((item) => item.response_ids ?? []));
  const candidateResponses = data.responses.filter((item) =>
    (item.entity_id === entityId || campaignResponseIds.has(item.id)) &&
    item.publication_status === "published" &&
    publishableEntityIds.has(item.entity_id) &&
    Boolean(item.source_id && publishableSources.has(item.source_id)),
  );

  const claimIds = new Set(
    data.claims.filter((item) =>
      item.subject_entity_id === entityId && isPublishableClaim(item, publishableSources),
    ).map((item) => item.id),
  );
  entityCampaigns.forEach((item) => (item.claim_ids ?? []).forEach((id) => claimIds.add(id)));
  candidateResponses.forEach((item) => item.related_claim_ids.forEach((id) => claimIds.add(id)));

  const claims = data.claims.filter((item) =>
    claimIds.has(item.id) &&
    publishableEntityIds.has(item.subject_entity_id) &&
    isPublishableClaim(item, publishableSources),
  );
  const publishedClaimIds = new Set(claims.map((item) => item.id));

  const responses = candidateResponses.map((item) => ({
    ...item,
    related_claim_ids: item.related_claim_ids.filter((id) => publishedClaimIds.has(id)),
  })).filter((item) => item.related_claim_ids.length > 0);
  const publishedResponseIds = new Set(responses.map((item) => item.id));

  const evidenceIds = new Set(claims.flatMap((item) => item.evidence_ids ?? []));
  const evidence = data.evidence.filter((item) =>
    publishableSources.has(item.source_id) &&
    (evidenceIds.has(item.id) ||
      item.supports_claim_ids?.some((id) => publishedClaimIds.has(id)) ||
      item.contradicts_claim_ids?.some((id) => publishedClaimIds.has(id))),
  );
  const publishedEvidenceIds = new Set(evidence.map((item) => item.id));

  const commitments = data.commitments.filter((item) =>
    item.entity_id === entityId &&
    item.reviewed_at !== null &&
    item.source_ids.length > 0 &&
    item.source_ids.every((id) => publishableSources.has(id)),
  );

  const sourceIds = new Set(originalEntity.source_ids.filter((id) => publishableSources.has(id)));
  claims.forEach((item) => item.source_ids.forEach((id) => sourceIds.add(id)));
  entityRelationships.forEach((item) => item.source_ids.forEach((id) => sourceIds.add(id)));
  entityCampaigns.forEach((item) => item.source_ids.forEach((id) => sourceIds.add(id)));
  responses.forEach((item) => { if (item.source_id) sourceIds.add(item.source_id); });
  commitments.forEach((item) => item.source_ids.forEach((id) => sourceIds.add(id)));
  evidence.forEach((item) => sourceIds.add(item.source_id));

  const sources = data.sources.filter((item) => sourceIds.has(item.id) && publishableSources.has(item.id));
  const publishedSourceIds = new Set(sources.map((item) => item.id));

  return {
    entity: {
      ...originalEntity,
      source_ids: originalEntity.source_ids.filter((id) => publishedSourceIds.has(id)),
    },
    claims: claims.map((item) => ({
      ...item,
      source_ids: item.source_ids.filter((id) => publishedSourceIds.has(id)),
      ...(item.evidence_ids ? { evidence_ids: item.evidence_ids.filter((id) => publishedEvidenceIds.has(id)) } : {}),
    })),
    sources,
    evidence: evidence.map((item) => ({
      ...item,
      supports_claim_ids: item.supports_claim_ids?.filter((id) => publishedClaimIds.has(id)),
      contradicts_claim_ids: item.contradicts_claim_ids?.filter((id) => publishedClaimIds.has(id)),
    })),
    relationships: entityRelationships.map((item) => ({
      ...item, source_ids: item.source_ids.filter((id) => publishedSourceIds.has(id)),
    })),
    campaigns: entityCampaigns.map((item) => ({
      ...item,
      ...(item.organizer_entity_id && !publishableEntityIds.has(item.organizer_entity_id)
        ? { organizer_entity_id: null } : {}),
      target_entity_ids: item.target_entity_ids.filter((id) => publishableEntityIds.has(id)),
      source_ids: item.source_ids.filter((id) => publishedSourceIds.has(id)),
      ...(item.claim_ids ? { claim_ids: item.claim_ids.filter((id) => publishedClaimIds.has(id)) } : {}),
      ...(item.response_ids ? { response_ids: item.response_ids.filter((id) => publishedResponseIds.has(id)) } : {}),
    })),
    responses,
    commitments: commitments.map((item) => ({
      ...item, source_ids: item.source_ids.filter((id) => publishedSourceIds.has(id)),
    })),
  };
}
