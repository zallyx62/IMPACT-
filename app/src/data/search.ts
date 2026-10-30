import type { CatalogItem } from "./catalog";

export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function searchableText(item: CatalogItem): string {
  return normalizeSearch([
    item.title.fr,
    item.title.en,
    item.description.fr,
    item.description.en,
    ...item.keywords,
  ].join(" "));
}

const searchAliases: Record<string, string> = {
  organization: "organisation organization",
  brand: "marque brand",
  product: "produit product",
  service: "service",
  association: "association",
  institution: "institution",
  public_body: "organisme public public body",
  animals_food: "animaux alimentation animals food",
  environment: "environnement environnemental environment",
  human_rights: "droits humains droits de l homme human rights",
  business_consumption: "entreprises consommation business consumption",
  technology_privacy: "technologie vie privee technology privacy",
  other: "autre other",
  owns: "detient possede owns",
  operates: "exploite operates",
  manufactures: "fabrique manufactures",
  distributes: "distribue distributes",
  supplies: "fournit supplies",
  certifies: "certifie certifies",
  funds: "finance funds",
  partners_with: "partenaire partenaires partners with",
  confirmed: "confirmee confirme confirmed",
  corroborated: "corroboree corroborated",
  alleged: "allegation allegee alleged",
  disputed: "contestee disputed",
  refuted: "refutee refuted",
  insufficient_information: "informations insuffisantes insufficient information",
};

export interface SearchableDossier {
  claims: Array<{ statement: string; topic: string; claim_status: string; uncertainty_note?: string }>;
  sources: Array<{ title: string; publisher: string }>;
  evidence: Array<{ summary: string; locator: string }>;
  campaigns: Array<{ title: string; demands: string[]; outcome_summary?: string }>;
  responses: Array<{ summary: string }>;
  commitments: Array<{ statement: string; measurement_method?: string; observed_result?: string }>;
  relationships: Array<{ relationship_type: string }>;
}

export function searchableEntityText(
  entity: { name: string; entity_type: string; description?: string },
  dossier?: SearchableDossier,
): string {
  if (!dossier) return normalizeSearch([entity.name, entity.description ?? "", entity.entity_type].join(" "));

  return normalizeSearch([
    entity.name,
    entity.description ?? "",
    entity.entity_type,
    searchAliases[entity.entity_type] ?? "",
    ...dossier.claims.flatMap((item) => [item.statement, item.topic, searchAliases[item.topic] ?? "", item.claim_status, searchAliases[item.claim_status] ?? "", item.uncertainty_note ?? ""]),
    ...dossier.sources.flatMap((item) => [item.title, item.publisher]),
    ...dossier.evidence.flatMap((item) => [item.summary, item.locator]),
    ...dossier.campaigns.flatMap((item) => [item.title, ...item.demands, item.outcome_summary ?? ""]),
    ...dossier.responses.map((item) => item.summary),
    ...dossier.commitments.flatMap((item) => [item.statement, item.measurement_method ?? "", item.observed_result ?? ""]),
    ...dossier.relationships.flatMap((item) => [item.relationship_type, searchAliases[item.relationship_type] ?? ""]),
  ].join(" "));
}

export function matchesSearch(value: string, query: string): boolean {
  const terms = normalizeSearch(query).split(/\s+/u).filter(Boolean);
  if (terms.length === 0) return false;

  const normalizedValue = normalizeSearch(value);
  return terms.every((term) => normalizedValue.includes(term));
}
