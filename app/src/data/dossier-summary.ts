import type { ClaimRecord, Language } from "./records";

export interface DossierSummaryReason {
  title: Record<Language, string>;
  text: Record<Language, string>;
  claimIds: string[];
}

export type EvidenceSeverity = "critical" | "high" | "moderate" | "low" | "insufficient";
export type BoycottPriority = "strong_case" | "consider" | "watch" | "not_established";
export type EvidenceConfidence = "high" | "moderate" | "limited";

export const BOYCOTT_ASSESSMENT_SCALE = {
  severity: ["critical", "high", "moderate", "low", "insufficient"] as const,
  priority: ["strong_case", "consider", "watch", "not_established"] as const,
  confidence: ["high", "moderate", "limited"] as const,
  criteria: [
    "gravité et nature des impacts documentés",
    "qualité, indépendance et convergence des preuves",
    "ampleur et périmètre réellement concernés",
    "actualité et durée des faits",
    "réponses, corrections et réparations vérifiables",
    "lien démontré entre l'entité, l'activité et le problème",
  ],
} as const;

export interface DossierSummary {
  /** Date of the editorial assessment, not a claim-level verification date. */
  assessedAt: string;
  level: EvidenceSeverity;
  levelLabel: Record<Language, string>;
  boycottPriority: BoycottPriority;
  boycottPriorityLabel: Record<Language, string>;
  confidence: EvidenceConfidence;
  confidenceLabel: Record<Language, string>;
  assessmentFactors: Record<Language, string[]>;
  title: Record<Language, string>;
  introduction: Record<Language, string>;
  reasons: DossierSummaryReason[];
  balanceTitle: Record<Language, string>;
  balancePoints: Record<Language, string[]>;
  conclusion: Record<Language, string>;
  methodology: Record<Language, string>;
}

const summaries: Record<string, DossierSummary> = {
  nestle: {
    assessedAt: "2026-10-30",
    level: "high",
    levelLabel: {
      fr: "Gravité documentée : élevée",
      en: "Documented severity: high",
    },
    boycottPriority: "consider",
    boycottPriorityLabel: {
      fr: "Boycott à envisager",
      en: "Boycott worth considering",
    },
    confidence: "moderate",
    confidenceLabel: {
      fr: "Confiance : modérée",
      en: "Confidence: moderate",
    },
    assessmentFactors: {
      fr: [
        "Gravité : plusieurs sujets environnementaux et de conformité, dont un accord judiciaire environnemental.",
        "Preuves : documents publics, étude scientifique et données déclarées par l'entreprise ; toutes les sources n'ont pas le même niveau d'indépendance.",
        "Périmètre : constats portant sur certaines activités, produits, audits et chaînes d'approvisionnement, pas sur chaque produit.",
        "Actualité : les constats couvrent plusieurs périodes ; leur situation doit être réévaluée lors des mises à jour.",
        "Réponses et réparations : à examiner avec les réponses et engagements détaillés du dossier.",
      ],
      en: [
        "Severity: several environmental and compliance issues, including an environmental judicial agreement.",
        "Evidence: public documents, a scientific study and company-reported data; sources do not all have the same level of independence.",
        "Scope: findings concern specific activities, products, audits and supply chains, not every product.",
        "Recency: findings cover several periods and should be reassessed when updated.",
        "Responses and remedies: examine these alongside the dossier's detailed responses and commitments.",
      ],
    },
    title: {
      fr: "Pourquoi certaines personnes envisagent un boycott",
      en: "Why some people consider a boycott",
    },
    introduction: {
      fr: "En bref : plusieurs motifs documentés touchent l'eau, les déchets plastiques et la traçabilité du cacao. Ils concernent des activités, produits et périodes précis — pas automatiquement tout le groupe ni chaque produit.",
      en: "In brief: several documented concerns relate to water, plastic waste and cocoa traceability. They concern specific activities, products and periods—not automatically the whole group or every product.",
    },
    reasons: [
      {
        title: {
          fr: "Eaux minérales : traitements interdits et accord judiciaire",
          en: "Bottled water: prohibited treatments and a judicial agreement",
        },
        text: {
          fr: "Le rapport du Sénat et la réponse du Gouvernement confirment l'utilisation de traitements UV et au charbon actif interdits dans des usines Nestlé Waters citées. En 2024, Nestlé Waters Supply Est a aussi conclu une convention judiciaire d'intérêt public environnementale assortie de 2 millions d'euros. Le Gouvernement indiquait toutefois qu'aucun risque sanitaire n'avait été constaté pour les eaux concernées à la date de sa réponse de février 2026.",
          en: "The French Senate report and the Government response confirm the use of prohibited UV and activated-carbon treatments at cited Nestlé Waters plants. In 2024, Nestlé Waters Supply Est also entered an environmental public-interest judicial agreement involving a €2 million payment. The Government nevertheless stated that no health risk had been identified for the waters concerned as of its February 2026 response.",
        },
        claimIds: ["claim-nestle-water-treatments", "claim-nestle-water-cjipe", "claim-nestle-water-health-finding"],
      },
      {
        title: {
          fr: "Microplastiques : un résultat signalé sur une purée Gerber",
          en: "Microplastics: a reported result for one Gerber purée",
        },
        text: {
          fr: "Consumer Reports a rapporté 728 294 particules pour une portion de 99 g d'une purée Gerber précisément identifiée. Cela ne démontre ni que l'emballage est la source, ni un effet sur la santé ; l'organisme précise lui-même ne pas recommander d'éviter les produits testés.",
          en: "Consumer Reports reported 728,294 particles in a 99 g serving of one specifically identified Gerber purée. This does not establish that the packaging was the source or that there is a health effect; the organisation itself says it does not recommend avoiding the tested products.",
        },
        claimIds: ["claim-nestle-gerber-microplastics-consumer-reports-2026"],
      },
      {
        title: {
          fr: "Déchets plastiques : une présence mesurée dans des audits",
          en: "Plastic waste: a measured presence in audit data",
        },
        text: {
          fr: "Une étude évaluée par les pairs attribue à Nestlé 3 % des objets de marque recensés dans 1 576 audits menés dans 84 pays entre 2018 et 2022. Ce chiffre ne représente pas 3 % de la pollution plastique mondiale : la moitié des objets collectés n'étaient pas marqués.",
          en: "A peer-reviewed study attributes 3% of branded items recorded in 1,576 audits across 84 countries between 2018 and 2022 to Nestlé. This is not 3% of global plastic pollution: half of the collected items were unbranded.",
        },
        claimIds: ["claim-nestle-branded-plastic-audit-2024"],
      },
      {
        title: {
          fr: "Cacao : une part de la chaîne reste inconnue",
          en: "Cocoa: part of the supply chain remains unknown",
        },
        text: {
          fr: "Pour 2025, Nestlé déclare que 91,7 % de sa chaîne d'approvisionnement primaire en cacao a été évaluée comme exempte de déforestation et que 8,3 % reste classée « inconnue ». Ces chiffres viennent de l'entreprise : la part inconnue ne prouve pas une déforestation, et la part évaluée comme exempte n'est pas une vérification indépendante de chaque exploitation.",
          en: "For 2025, Nestlé says 91.7% of its primary cocoa supply chain was assessed as deforestation-free and 8.3% remains classified as “unknown”. These are company-reported figures: the unknown share does not prove deforestation, and the assessed share is not independent verification of every farm.",
        },
        claimIds: ["claim-nestle-cocoa-deforestation-2025"],
      },
    ],
    balanceTitle: {
      fr: "À garder en tête avant de décider",
      en: "What to keep in mind before deciding",
    },
    balancePoints: {
      fr: [
        "Les constats publiés ont des périmètres précis : certaines usines, un produit Gerber, un jeu de données d'audits et les chiffres de cacao déclarés par l'entreprise.",
        "Les éléments sur le sucre, le marketing des substituts du lait maternel, le travail et d'autres sujets ne sont pas intégrés à cette synthèse tant qu'ils ne sont pas publiés selon les critères du dossier.",
        "Les réponses de Nestlé et les limites méthodologiques restent consultables dans les sections détaillées.",
      ],
      en: [
        "Published findings have specific scopes: certain plants, one Gerber product, one audit dataset and company-reported cocoa figures.",
        "Material on sugar, breast-milk-substitute marketing, labour and other topics is not included until it is published under the dossier's criteria.",
        "Nestlé's responses and methodological limitations remain available in the detailed sections.",
      ],
    },
    conclusion: {
      fr: "Bilan IMPACT : les motifs environnementaux et de gouvernance documentés sont suffisamment importants pour justifier une vigilance élevée et une réflexion sur ses achats. IMPACT ne transforme pas cette synthèse en consigne obligatoire de boycott : chacun peut examiner les preuves et décider.",
      en: "IMPACT assessment: the documented environmental and governance concerns are substantial enough to warrant a high level of scrutiny and reflection on purchasing choices. IMPACT does not turn this summary into a mandatory boycott instruction: readers can examine the evidence and decide.",
    },
    methodology: {
      fr: "Appréciation éditoriale qualitative fondée uniquement sur les affirmations publiées dans ce dossier. Ce n'est ni une note scientifique, ni un classement des entreprises, ni une validation humaine indépendante.",
      en: "Qualitative editorial assessment based only on claims published in this dossier. It is not a scientific score, company ranking or independent human review.",
    },
  },
};

export function getDossierSummary(
  entityId: string,
  publishedClaims: readonly Pick<ClaimRecord, "id" | "publication_basis">[],
): DossierSummary | undefined {
  const summary = summaries[entityId];
  if (!summary) return undefined;

  const publishedIds = new Set(
    publishedClaims
      .filter((claim) => claim.publication_basis === "evidence_verified")
      .map((claim) => claim.id),
  );
  const referencedIds = summary.reasons.flatMap((reason) => reason.claimIds);
  if (referencedIds.some((id) => !publishedIds.has(id))) return undefined;

  return summary;
}
