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


export interface AlternativeLink {
  id: string;
  alternativeName: string;
  targetName: string;
  relationship: RelationshipRecord;
  sourceTitles: string[];
}

/** An alternative is listed only when both entities and at least one source are public. */
export function buildAlternativeIndex(dossiers: EntityDossier[]): AlternativeLink[] {
  const names = new Map(dossiers.map((dossier) => [dossier.entity.id, dossier.entity.name]));
  const sources = new Map(dossiers.flatMap((dossier) => dossier.sources.map((source) => [source.id, source.title] as const)));
  const relationships = new Map<string, RelationshipRecord>();
  for (const dossier of dossiers) {
    for (const relationship of dossier.relationships) {
      if (relationship.relationship_type === "alternative_to" &&
        (relationship.knowledge_status === "confirmed" || relationship.knowledge_status === "partial")) {
        relationships.set(relationship.id, relationship);
      }
    }
  }
  return [...relationships.values()]
    .filter((relationship) => names.has(relationship.from_entity_id) && names.has(relationship.to_entity_id))
    .map((relationship) => ({
      id: relationship.id,
      alternativeName: names.get(relationship.from_entity_id)!,
      targetName: names.get(relationship.to_entity_id)!,
      relationship,
      sourceTitles: relationship.source_ids.map((id) => sources.get(id)).filter((title): title is string => Boolean(title)),
    }))
    .filter((item) => item.sourceTitles.length > 0)
    .sort((a, b) => a.targetName.localeCompare(b.targetName, "fr") || a.alternativeName.localeCompare(b.alternativeName, "fr"));
}

export interface DossierTimelineEvent {
  id: string;
  entityName: string;
  date: string;
  type: "dossier" | "claim" | "response" | "commitment" | "change";
  title: string;
  detail: string;
  sourceTitles: string[];
}

/** A chronology of dated public records, not a claim that every historical change is known. */
export function buildDossierTimeline(dossiers: EntityDossier[]): DossierTimelineEvent[] {
  const events: DossierTimelineEvent[] = [];
  for (const dossier of dossiers) {
    const sourceTitles = new Map(dossier.sources.map((source) => [source.id, source.title] as const));
    const add = (event: DossierTimelineEvent) => {
      if (/^\\d{4}-\\d{2}-\\d{2}$/.test(event.date)) events.push(event);
    };
    if (dossier.entity.published_at) add({
      id: `${dossier.entity.id}:published`, entityName: dossier.entity.name, date: dossier.entity.published_at,
      type: "dossier", title: "Dossier publié", detail: dossier.entity.description ?? "",
      sourceTitles: dossier.entity.source_ids.map((id) => sourceTitles.get(id)).filter((value): value is string => Boolean(value)),
    });
    for (const claim of dossier.claims) {
      const date = claim.published_at ?? claim.reviewed_at;
      if (!date) continue;
      add({
        id: claim.id, entityName: dossier.entity.name, date,
        type: "claim", title: claim.published_at ? "Constat publié" : "Constat examiné",
        detail: claim.statement,
        sourceTitles: claim.source_ids.map((id) => sourceTitles.get(id)).filter((value): value is string => Boolean(value)),
      });
    }
    for (const response of dossier.responses) {
      const date = response.published_at ?? response.received_at;
      if (!date) continue;
      add({
        id: response.id, entityName: dossier.entity.name, date, type: "response",
        title: response.published_at ? "Réponse publiée" : "Réponse reçue",
        detail: response.summary,
        sourceTitles: response.source_id ? [sourceTitles.get(response.source_id)].filter((value): value is string => Boolean(value)) : [],
      });
    }
    for (const change of dossier.changes ?? []) add({
      id: change.id, entityName: dossier.entity.name, date: change.event_date, type: "change",
      title: change.title, detail: change.summary,
      sourceTitles: change.source_ids.map((id) => sourceTitles.get(id)).filter((value): value is string => Boolean(value)),
    });
    for (const commitment of dossier.commitments) {
      add({
        id: `${commitment.id}:announced`, entityName: dossier.entity.name, date: commitment.announced_at,
        type: "commitment", title: "Engagement annoncé", detail: commitment.statement,
        sourceTitles: commitment.source_ids.map((id) => sourceTitles.get(id)).filter((value): value is string => Boolean(value)),
      });
      if (commitment.target_date) add({
        id: `${commitment.id}:deadline`, entityName: dossier.entity.name, date: commitment.target_date,
        type: "commitment", title: "Échéance annoncée", detail: commitment.statement,
        sourceTitles: commitment.source_ids.map((id) => sourceTitles.get(id)).filter((value): value is string => Boolean(value)),
      });
      if (commitment.reviewed_at) add({
        id: `${commitment.id}:reviewed`, entityName: dossier.entity.name, date: commitment.reviewed_at,
        type: "commitment", title: "Engagement réévalué",
        detail: commitment.observed_result ?? commitment.statement,
        sourceTitles: commitment.source_ids.map((id) => sourceTitles.get(id)).filter((value): value is string => Boolean(value)),
      });
    }
  }
  return events.sort((a, b) => b.date.localeCompare(a.date) || a.entityName.localeCompare(b.entityName, "fr"));
}

export function getCommitmentDisplayStatus(
  commitment: CommitmentRecord,
  now: Date = new Date(),
): string {
  if (commitment.status !== "announced" && commitment.status !== "in_progress") return commitment.status;
  if (!commitment.target_date) return commitment.status;
  const today = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-");
  return commitment.target_date < today ? "overdue" : commitment.status;
}
