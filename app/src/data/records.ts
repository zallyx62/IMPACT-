import { buildEntityDossier } from "./dossier-builder";
import { publicRecords } from "./public-records.generated";

export type Language = "fr" | "en";

export interface EntityRecord {
  id: string;
  name: string;
  entity_type: string;
  description?: string;
  website?: string | null;
  status: string;
  reviewed_at: string | null;
  publication_basis?: string;
  published_at?: string;
  publication_note?: string;
  source_ids: string[];
  country_codes?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface SourceRecord {
  id: string;
  title: string;
  publisher: string;
  url?: string | null;
  archived_url?: string | null;
  source_type: string;
  published_at?: string | null;
  accessed_at: string;
  language?: string;
  methodology?: string;
  potential_conflicts?: string;
  limitations?: string;
  source_license?: string;
  rights_note?: string;
  review_status: string;
  verification_method?: string;
  verified_at?: string;
  verification_note?: string;
}

export interface ClaimRecord {
  id: string;
  subject_entity_id: string;
  statement: string;
  topic: string;
  claim_status: string;
  source_ids: string[];
  evidence_ids?: string[];
  reviewed_at: string | null;
  publication_basis?: string;
  published_at?: string;
  publication_note?: string;
  requires_human_review?: boolean;
  uncertainty_note: string;
  valid_from?: string | null;
  valid_until?: string | null;
  editorial_note?: string;
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
  valid_from?: string | null;
  valid_until?: string | null;
  notes?: string;
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
  started_at?: string | null;
  ended_at?: string | null;
}

export interface ResponseRecord {
  id: string;
  entity_id: string;
  related_claim_ids: string[];
  summary: string;
  source_id?: string | null;
  publication_status: string;
  received_at?: string | null;
  published_at?: string | null;
  full_response_url?: string | null;
}

export interface CommitmentRecord {
  id: string;
  entity_id: string;
  statement: string;
  announced_at: string;
  target_date?: string | null;
  status: string;
  source_ids: string[];
  reviewed_at: string | null;
  measurement_method?: string;
  observed_result?: string;
  baseline?: string;
  target_value?: string;
}

export const entities = publicRecords.entities as EntityRecord[];
export const sources = publicRecords.sources as SourceRecord[];
export const claims = publicRecords.claims as ClaimRecord[];
export const evidence = publicRecords.evidence as EvidenceRecord[];
export const relationships = publicRecords.relationships as RelationshipRecord[];
export const campaigns = publicRecords.campaigns as CampaignRecord[];
export const responses = publicRecords.responses as ResponseRecord[];
export const commitments = publicRecords.commitments as CommitmentRecord[];

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

export function getPublishedEntities(): EntityRecord[] {
  return entities;
}

export function getEntityDossier(entityId: string): EntityDossier | undefined {
  return buildEntityDossier(entityId, {
    entities,
    sources,
    claims,
    evidence,
    relationships,
    campaigns,
    responses,
    commitments,
  });
}
