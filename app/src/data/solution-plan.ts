export interface SolutionPlanInput {
  objective: string;
  context: string;
  resources: string;
  constraints: string;
  indicator: string;
}

export function buildSolutionPlan(input: SolutionPlanInput): string {
  const objective = input.objective.trim();
  if (objective.length < 12) {
    throw new Error("Décrivez l’objectif en au moins 12 caractères.");
  }

  const value = (text: string, fallback: string) => text.trim() || fallback;
  return [
    "# Fiche de projet IMPACT",
    "",
    "## Objectif",
    objective,
    "",
    "## Contexte",
    value(input.context, "À documenter avant toute mise en œuvre."),
    "",
    "## Ressources disponibles",
    value(input.resources, "À identifier avec les participants."),
    "",
    "## Contraintes et risques",
    value(input.constraints, "À examiner avant le lancement."),
    "",
    "## Indicateur de résultat",
    value(input.indicator, "Définir un indicateur mesurable, une valeur de départ et une méthode de collecte."),
    "",
    "## Étapes proposées",
    "1. Décrire précisément le problème et son périmètre.",
    "2. Rechercher les solutions déjà expérimentées et leurs sources.",
    "3. Comparer les options, coûts, risques et effets possibles.",
    "4. Définir une expérimentation limitée, réversible et sûre.",
    "5. Mesurer les résultats avec la méthode annoncée.",
    "6. Publier les réussites, échecs, limites et enseignements.",
    "",
    "## Garde-fous",
    "- Ne pas présenter une hypothèse comme un fait établi.",
    "- Obtenir les autorisations nécessaires et protéger les personnes.",
    "- Ne pas engager de dépense sans financement confirmé.",
    "- Documenter les conflits d’intérêts et les effets inattendus.",
    "",
    "## Statut",
    "Brouillon local : cette fiche n’a pas été envoyée, vérifiée ni publiée par IMPACT.",
    "",
  ].join("\n");
}
