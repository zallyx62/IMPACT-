import type { EntityDossier } from "./records";

const topicByUniverse: Record<string, string> = {
  "animals-food": "animals_food",
  environment: "environment",
  "people-society": "human_rights",
  "business-consumption": "business_consumption",
  technology: "technology_privacy",
};

export function dossiersForUniverse(universeId: string, dossiers: EntityDossier[]): EntityDossier[] {
  if (universeId === "take-action") {
    return dossiers.filter((dossier) => dossier.campaigns.length > 0);
  }
  const topic = topicByUniverse[universeId];
  if (!topic) return [];
  return dossiers.filter((dossier) => dossier.claims.some((claim) => claim.topic === topic));
}
