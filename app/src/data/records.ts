export type Language = "fr" | "en";

export interface EntityRecord {
  id: string;
  name: string;
  entity_type: string;
  description?: string;
  website?: string | null;
  status: string;
  reviewed_at: string;
}

export interface SourceRecord {
  id: string;
  title: string;
  publisher: string;
  url?: string | null;
  source_type: string;
  published_at?: string | null;
  accessed_at: string;
  limitations?: string;
  review_status: string;
}

export interface ClaimRecord {
  id: string;
  subject_entity_id: string;
  statement: string;
  topic: string;
  claim_status: string;
  source_ids: string[];
  evidence_ids?: string[];
  reviewed_at: string;
  uncertainty_note: string;
}

export interface EvidenceRecord {
  id: string;
  source_id: string;
  locator: string;
  summary: string;
  excerpt?: string;
  limitations?: string;
  supports_claim_ids?: string[];
  contradicts_claim_ids?: string[];
}

export interface RelationshipRecord {
  id: string;
  from_entity_id: string;
  to_entity_id: string;
  relationship_type: string;
  knowledge_status: string;
  source_ids: string[];
}

export interface CampaignRecord {
  id: string;
  title: string;
  organizer_entity_id?: string | null;
  target_entity_ids: string[];
  demands: string[];
  campaign_status: string;
  claim_ids?: string[];
  response_ids?: string[];
  source_ids: string[];
  outcome_summary?: string;
}

export interface ResponseRecord {
  id: string;
  entity_id: string;
  related_claim_ids: string[];
  summary: string;
  source_id?: string | null;
  publication_status: string;
}

export interface CommitmentRecord {
  id: string;
  entity_id: string;
  statement: string;
  announced_at: string;
  target_date?: string | null;
  status: string;
  source_ids: string[];
  reviewed_at: string;
  measurement_method?: string;
  observed_result?: string;
}

function loadRecords<T>(modules: Record<string, unknown>): T[] {
  return Object.values(modules) as T[];
}

export const entities = loadRecords<EntityRecord>(
  import.meta.glob("../../../data/records/entities/*.json", { eager: true, import: "default" }),
);
export const sources = loadRecords<SourceRecord>(
  import.meta.glob("../../../data/records/sources/*.json", { eager: true, import: "default" }),
);
export const claims = loadRecords<ClaimRecord>(
  import.meta.glob("../../../data/records/claims/*.json", { eager: true, import: "default" }),
);
export const evidence = loadRecords<EvidenceRecord>(
  import.meta.glob("../../../data/records/evidence/*.json", { eager: true, import: "default" }),
);
export const relationships = loadRecords<RelationshipRecord>(
  import.meta.glob("../../../data/records/relationships/*.json", { eager: true, import: "default" }),
);
export const campaigns = loadRecords<CampaignRecord>(
  import.meta.glob("../../../data/records/campaigns/*.json", { eager: true, import: "default" }),
);
export const responses = loadRecords<ResponseRecord>(
  import.meta.glob("../../../data/records/responses/*.json", { eager: true, import: "default" }),
);
export const commitments = loadRecords<CommitmentRecord>(
  import.meta.glob("../../../data/records/commitments/*.json", { eager: true, import: "default" }),
);

export interface EntityDossier {
  entity: EntityRecord;
  claims: ClaimRecord[];
  sources: SourceRecord[];
  evidence: EvidenceRecord[];
  relationships: RelationshipRecord[];
  campaigns: CampaignRecord[];
  responses: ResponseRecord[];
  commitments: CommitmentRecord[];
}

export function getEntityDossier(entityId: string): EntityDossier | undefined {
  const entity = entities.find((item) => item.id === entityId && item.status === "published");
  if (!entity) return undefined;

  const entityClaims = claims.filter((claim) => claim.subject_entity_id === entityId);
  const claimIds = new Set(entityClaims.map((claim) => claim.id));
  const sourceIds = new Set(entityClaims.flatMap((claim) => claim.source_ids));
  const evidenceIds = new Set(entityClaims.flatMap((claim) => claim.evidence_ids ?? []));

  const entityRelationships = relationships.filter(
    (item) => item.from_entity_id === entityId || item.to_entity_id === entityId,
  );
  entityRelationships.forEach((item) => item.source_ids.forEach((id) => sourceIds.add(id)));

  const entityCampaigns = campaigns.filter((item) => item.target_entity_ids.includes(entityId));
  entityCampaigns.forEach((item) => {
    item.source_ids.forEach((id) => sourceIds.add(id));
    (item.claim_ids ?? []).forEach((id) => claimIds.add(id));
  });

  const entityResponses = responses.filter((item) => item.entity_id === entityId);
  entityResponses.forEach((item) => {
    item.related_claim_ids.forEach((id) => claimIds.add(id));
    if (item.source_id) sourceIds.add(item.source_id);
  });

  const entityCommitments = commitments.filter((item) => item.entity_id === entityId);
  entityCommitments.forEach((item) => item.source_ids.forEach((id) => sourceIds.add(id)));

  const relatedEvidence = evidence.filter(
    (item) => evidenceIds.has(item.id) || item.supports_claim_ids?.some((id) => claimIds.has(id)) || item.contradicts_claim_ids?.some((id) => claimIds.has(id)),
  );
  relatedEvidence.forEach((item) => sourceIds.add(item.source_id));

  const relatedSources = sources.filter((item) => sourceIds.has(item.id));

  return {
    entity,
    claims: entityClaims,
    sources: relatedSources,
    evidence: relatedEvidence,
    relationships: entityRelationships,
    campaigns: entityCampaigns,
    responses: entityResponses,
    commitments: entityCommitments,
  };
}
