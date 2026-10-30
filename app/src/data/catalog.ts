export type Language = "fr" | "en";

export interface CatalogItem {
  id: string;
  number: string;
  mark: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  detail: Record<Language, string>;
  keywords: string[];
}

export const universes: CatalogItem[] = [
  {
    id: "animals-food", number: "01", mark: "A",
    title: { fr: "Animaux et alimentation", en: "Animals and food" },
    description: { fr: "Élevage, pêche, alimentation et alternatives.", en: "Farming, fishing, food and alternatives." },
    detail: {
      fr: "Cet univers étudiera les pratiques de production, le bien-être animal, les systèmes alimentaires et les alternatives disponibles. Chaque publication devra citer ses sources et distinguer les données, les déclarations et les opinions.",
      en: "This area will examine production practices, animal welfare, food systems and available alternatives. Every publication will cite its sources and distinguish data, statements and opinions."
    },
    keywords: ["élevage", "pêche", "véganisme", "végétal", "nutrition", "animaux", "farming", "fishing", "vegan", "plant-based", "nutrition"]
  },
  {
    id: "environment", number: "02", mark: "P",
    title: { fr: "Planète et environnement", en: "Planet and environment" },
    description: { fr: "Climat, biodiversité, pollution et ressources.", en: "Climate, biodiversity, pollution and resources." },
    detail: {
      fr: "Cet univers rassemblera des informations sur les impacts environnementaux, les méthodes de mesure, les limites des données et les solutions documentées. Les chiffres seront toujours accompagnés de leur périmètre et de leur date.",
      en: "This area will gather information about environmental impacts, measurement methods, data limitations and documented solutions. Figures will include their scope and date."
    },
    keywords: ["climat", "déforestation", "pollution", "plastique", "biodiversité", "eau", "climate", "deforestation", "pollution", "plastic", "biodiversity", "water"]
  },
  {
    id: "people-society", number: "03", mark: "H",
    title: { fr: "Humains et société", en: "People and society" },
    description: { fr: "Droits humains, travail et conditions de production.", en: "Human rights, labour and production conditions." },
    detail: {
      fr: "Cet univers traitera les droits humains, les conditions de travail et les chaînes de sous-traitance. Les dossiers devront éviter les généralisations et préciser les lieux, périodes et acteurs concernés.",
      en: "This area will cover human rights, working conditions and subcontracting chains. Reports must avoid generalisations and specify the places, periods and actors involved."
    },
    keywords: ["travail", "droits humains", "exploitation", "salaires", "chaîne d'approvisionnement", "labour", "human rights", "exploitation", "wages", "supply chain"]
  },
  {
    id: "business-consumption", number: "04", mark: "E",
    title: { fr: "Entreprises et consommation", en: "Business and consumption" },
    description: { fr: "Marques, groupes, produits et campagnes documentées.", en: "Brands, corporate groups, products and documented campaigns." },
    detail: {
      fr: "Cet univers présentera les liens vérifiables entre sociétés, marques et produits, ainsi que les campagnes et controverses avec leurs sources, leurs réponses et leur historique. Aucune accusation ne sera déduite d'une simple association commerciale.",
      en: "This area will present verifiable links between companies, brands and products, plus campaigns and controversies with their sources, responses and history. No accusation will be inferred from a mere commercial association."
    },
    keywords: ["entreprise", "marque", "filiale", "boycott", "produit", "fournisseur", "company", "brand", "subsidiary", "boycott", "product", "supplier"]
  },
  {
    id: "technology", number: "05", mark: "T",
    title: { fr: "Technologie et numérique", en: "Technology and digital life" },
    description: { fr: "Vie privée, logiciels libres, surveillance et réparabilité.", en: "Privacy, free software, surveillance and repairability." },
    detail: {
      fr: "Cet univers examinera les pratiques numériques, la protection des données, la réparabilité, les logiciels libres et les impacts de l'intelligence artificielle. IMPACT ne prévoit pas d'intégrer d'IA générative à son application destinée au public.",
      en: "This area will examine digital practices, data protection, repairability, free software and the impacts of artificial intelligence. IMPACT does not plan to integrate generative AI into the public-facing app."
    },
    keywords: ["vie privée", "logiciel libre", "surveillance", "réparabilité", "données", "intelligence artificielle", "privacy", "open source", "surveillance", "repairability", "data", "artificial intelligence"]
  },
  {
    id: "take-action", number: "06", mark: "→",
    title: { fr: "Agir et changer", en: "Take action and change" },
    description: { fr: "Associations, initiatives, alternatives et actions concrètes.", en: "Associations, initiatives, alternatives and practical actions." },
    detail: {
      fr: "Cet univers permettra de trouver des actions individuelles, collectives et citoyennes. Les initiatives seront décrites sans promesse de résultat et les liens vers des organisations seront vérifiés avant publication.",
      en: "This area will help people find individual, collective and civic actions. Initiatives will be described without promising outcomes, and links to organisations will be checked before publication."
    },
    keywords: ["association", "bénévolat", "pétition", "action locale", "initiative", "volunteer", "petition", "local action", "initiative"]
  }
];

export const tools: CatalogItem[] = [
  {
    id: "evidence", number: "A1", mark: "01",
    title: { fr: "Centre de preuves", en: "Evidence centre" },
    description: { fr: "Sources, dates, limites et corrections accessibles.", en: "Accessible sources, dates, limitations and corrections." },
    detail: {
      fr: "Consultez les preuves publiées, recherchez dans leurs sources et filtrez les éléments favorables, contradictoires, mixtes ou contextuels. Chaque élément conserve son périmètre et ses limites.",
      en: "Browse published evidence, search its sources and filter supporting, contradicting, mixed or contextual items. Each item retains its scope and limitations."
    },
    keywords: ["preuve", "source", "correction", "fiabilité", "evidence", "source", "correction", "reliability"]
  },
  {
    id: "network", number: "A2", mark: "02",
    title: { fr: "Carte des acteurs", en: "Actor map" },
    description: { fr: "Liens entre groupes, marques et fournisseurs.", en: "Links between corporate groups, brands and suppliers." },
    detail: {
      fr: "Explorez les relations publiées entre entités, avec leur type, leur état de connaissance, leur période éventuelle et leurs sources. Une relation de fourniture n’est jamais présentée comme une relation de propriété.",
      en: "Relationships will be typed, dated and linked to sources. A supplier relationship will never be presented as an ownership relationship."
    },
    keywords: ["carte", "groupe", "marque", "filiale", "fournisseur", "map", "group", "brand", "subsidiary", "supplier"]
  },
  {
    id: "compare", number: "A3", mark: "03",
    title: { fr: "Comparateur multicritère", en: "Multi-criteria comparison" },
    description: { fr: "Comparer des choix sans note morale simplificatrice.", en: "Compare choices without a simplistic moral score." },
    detail: {
      fr: "Comparez les volumes de documentation disponibles dans les dossiers publiés : affirmations, sources vérifiées, preuves, engagements, réponses et relations. Ces chiffres ne mesurent ni la valeur morale d’une organisation ni son impact réel.",
      en: "Compare the documentation available in published dossiers: claims, verified sources, evidence, commitments, responses and relationships. These counts do not measure an organisation's moral worth or actual impact."
    },
    keywords: ["comparateur", "coût", "impact", "alternative", "compare", "cost", "impact", "alternative"]
  },
  {
    id: "history", number: "A4", mark: "04",
    title: { fr: "Observatoire des engagements", en: "Commitment tracker" },
    description: { fr: "Promesses, échéances et résultats documentés.", en: "Promises, deadlines and documented results." },
    detail: {
      fr: "Retrouvez les engagements publiés, leurs échéances, leur état, les résultats observés et les méthodes de mesure lorsqu’elles existent. Une promesse annoncée n’est jamais considérée comme réalisée sans éléments justificatifs.",
      en: "Commitments will be kept separate from measured results. An announced promise will not be treated as achieved without supporting evidence."
    },
    keywords: ["historique", "engagement", "promesse", "résultat", "history", "commitment", "promise", "outcome"]
  },
  {
    id: "participate", number: "A5", mark: "05",
    title: { fr: "Contribution citoyenne", en: "Citizen contributions" },
    description: { fr: "Proposer une source ou une correction, examinée par un humain.", en: "Suggest a source or correction for human review." },
    detail: {
      fr: "Préparez une proposition de source ou de correction directement sur votre appareil, puis transmettez-la vous-même. Rien n’est envoyé ni publié automatiquement ; chaque proposition doit être examinée selon la charte éditoriale.",
      en: "Contributions will not be published automatically. An editorial process must review sources, context, risks and conflicts of interest before acceptance."
    },
    keywords: ["contribution", "citoyen", "correction", "communauté", "contribution", "citizen", "correction", "community"]
  }
];
