export interface SolutionMethod {
  id: string;
  title: string;
  description: string;
  whenToUse: string;
  steps: string[];
  indicatorExamples: string[];
  watchPoints: string[];
}

export const solutionMethods: SolutionMethod[] = [
  {
    id: "diagnostic",
    title: "Diagnostiquer un problème local",
    description: "Une trame pour décrire une situation avant de choisir une action.",
    whenToUse: "Quand le problème est encore mal délimité, que les causes sont incertaines ou que plusieurs personnes vivent la situation différemment.",
    steps: [
      "Définir le lieu, la période et les personnes concernées sans publier de données personnelles.",
      "Décrire les observations séparément des interprétations et des opinions.",
      "Rechercher les données et documents existants, en noter la date et les limites.",
      "Écouter plusieurs points de vue, y compris les désaccords et les personnes moins visibles.",
      "Formuler les causes possibles comme des hypothèses à vérifier.",
      "Publier un diagnostic provisoire avec les inconnues et les prochaines vérifications."
    ],
    indicatorExamples: [
      "Nombre de sources indépendantes consultées et date de mise à jour.",
      "Part des constats accompagnés d'une méthode et d'un périmètre explicites.",
      "Liste des inconnues restantes et des vérifications à effectuer."
    ],
    watchPoints: [
      "Un témoignage isolé ne représente pas automatiquement toute une population.",
      "Ne pas collecter de données sensibles ou identifiantes sans nécessité et base légitime.",
      "Ne pas confondre corrélation, cause et simple succession dans le temps."
    ]
  },
  {
    id: "pilot",
    title: "Tester une action à petite échelle",
    description: "Une trame pour expérimenter prudemment une action avant d'envisager son extension.",
    whenToUse: "Quand une piste d'action existe mais que ses effets, ses coûts ou ses risques restent à vérifier dans le contexte réel.",
    steps: [
      "Énoncer l'hypothèse que l'expérimentation doit examiner.",
      "Définir un périmètre limité, une durée et des critères d'arrêt.",
      "Vérifier les autorisations, la sécurité, l'accessibilité et les effets possibles sur les tiers.",
      "Décrire les ressources nécessaires et les coûts éventuels avant de commencer.",
      "Mesurer une situation de départ avec une méthode reproductible.",
      "Conduire le test, consigner les écarts et arrêter si un risque non maîtrisé apparaît.",
      "Publier les résultats, les limites et les éléments qui n'ont pas fonctionné."
    ],
    indicatorExamples: [
      "Ressources réellement consommées, y compris temps bénévole et matériel.",
      "Évolution d'un indicateur défini avant le test, avec période et méthode.",
      "Incidents, effets indésirables et abandons consignés."
    ],
    watchPoints: [
      "Un petit test ne prouve pas qu'une action fonctionnera ailleurs ou à grande échelle.",
      "Prévoir une solution de retour en arrière et ne pas exposer les participants à un risque évitable.",
      "Ne pas annoncer un résultat avant la fin de la mesure."
    ]
  },
  {
    id: "evaluation",
    title: "Évaluer et partager les résultats",
    description: "Une trame pour rendre compte des effets observés sans exagérer les conclusions.",
    whenToUse: "Quand une action a été menée et qu'il faut comparer les résultats à l'objectif initial.",
    steps: [
      "Reprendre l'objectif, la situation de départ et les indicateurs annoncés avant l'action.",
      "Décrire les données collectées, leur provenance, leur qualité et les données manquantes.",
      "Comparer les résultats observés à la situation de départ sans changer la méthode en cours de route.",
      "Présenter les effets inattendus, les limites et les explications alternatives.",
      "Distinguer les résultats mesurés des estimations, témoignages et interprétations.",
      "Documenter ce qui peut être reproduit, ce qui doit être adapté et ce qui reste inconnu."
    ],
    indicatorExamples: [
      "Valeur de départ, valeur finale, unité, période et source pour chaque indicateur.",
      "Part des objectifs atteints selon les critères annoncés à l'avance.",
      "Nombre et nature des limites, données manquantes et effets inattendus documentés."
    ],
    watchPoints: [
      "Une amélioration observée ne prouve pas à elle seule que l'action en est la cause.",
      "Éviter les pourcentages sans dénominateur, période et définition.",
      "Publier aussi les résultats nuls ou défavorables et conserver l'historique des corrections."
    ]
  }
];

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr");
}

export function searchSolutionMethods(query: string): SolutionMethod[] {
  const needle = normalize(query.trim());
  if (!needle) return solutionMethods;
  return solutionMethods.filter((method) => normalize([
    method.title,
    method.description,
    method.whenToUse,
    ...method.steps,
    ...method.indicatorExamples,
    ...method.watchPoints
  ].join(" ")).includes(needle));
}
