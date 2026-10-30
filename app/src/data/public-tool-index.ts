import type { EntityDossier, RelationshipRecord, CommitmentRecord } from "./records";

export interface ActorLink {
  id: string;
  fromName: string;
  toName: string;
  relationship: RelationshipRecord;
  sourceTitles: string[];
}

export interface TrackedCommitment {
  id: string;
  entityName: string;
  commitment: CommitmentRecord;
  sourceTitles: string[];
}

export function buildActorIndex(dossiers: EntityDossier[]): ActorLink[] {
  const names = new Map(dossiers.map((dossier) => [dossier.entity.id, dossier.entity.name]));
  const sources = new Map(dossiers.flatMap((dossier) => dossier.sources.map((source) => [source.id, source.title] as const)));
  const relationships = new Map<string, RelationshipRecord>();
  for (const dossier of dossiers) {
    for (const relationship of dossier.relationships) relationships.set(relationship.id, relationship);
  }
  return [...relationships.values()]
    .filter((relationship) => names.has(relationship.from_entity_id) && names.has(relationship.to_entity_id))
    .map((relationship) => ({
      id: relationship.id,
      fromName: names.get(relationship.from_entity_id)!,
      toName: names.get(relationship.to_entity_id)!,
      relationship,
      sourceTitles: relationship.source_ids.map((id) => sources.get(id)).filter((title): title is string => Boolean(title)),
    }))
    .sort((a, b) => a.fromName.localeCompare(b.fromName, "fr") || a.toName.localeCompare(b.toName, "fr"));
}

export function buildCommitmentIndex(dossiers: EntityDossier[]): TrackedCommitment[] {
  return dossiers.flatMap((dossier) => dossier.commitments.map((commitment) => ({
    id: commitment.id,
    entityName: dossier.entity.name,
    commitment,
    sourceTitles: commitment.source_ids.map((id) => dossier.sources.find((source) => source.id === id)?.title)
      .filter((title): title is string => Boolean(title)),
  }))).sort((a, b) => {
    const aDate = a.commitment.target_date ?? a.commitment.announced_at;
    const bDate = b.commitment.target_date ?? b.commitment.announced_at;
    return aDate.localeCompare(bDate) || a.entityName.localeCompare(b.entityName, "fr");
  });
}
