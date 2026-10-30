import { buildEntityDossier } from "./dossier-builder";

export type Language = "fr" | "en";

export interface EntityRecord {
  id: string;
  name: string;
  entity_type: string;
  description?: string;
  website?: string | null;
  status: string;
  reviewed_at: string;
  source_ids: string[];
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
  source_license?: string;
  rights_note?: string;
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
