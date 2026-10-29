# Modèle de données — IMPACT

**Statut :** proposition technique initiale  
**Version :** 0.1  
**Langue :** français  
**Objectif :** définir une structure cohérente, vérifiable et évolutive pour les informations publiées dans IMPACT.

Ce document décrit le modèle éditorial et technique de départ. Il ne constitue pas encore une base de données exhaustive ni une validation juridique ou scientifique. Les schémas JSON initiaux couvrent les entités, les relations, les sources, les affirmations et les éléments de preuve ; les campagnes, réponses et engagements restent à formaliser.

## 1. Principes de conception

1. **Une affirmation n'est jamais une preuve.** Les affirmations, les sources et les éléments de preuve sont enregistrés séparément.
2. **La source n'est pas la conclusion.** Une source peut être intéressée, incomplète, ancienne ou contestée.
3. **L'incertitude est explicite.** Une information inconnue ne doit pas être remplacée par une supposition.
4. **Les faits sont datés.** La date de publication d'une source et la date de vérification par IMPACT sont deux champs distincts.
5. **Les corrections sont traçables.** Une modification importante conserve son motif, sa date et son historique.
6. **Les relations sont qualifiées.** Une relation entre deux organisations doit préciser sa nature et sa source.
7. **Pas de note morale globale.** IMPACT ne classe pas les personnes, entreprises ou produits comme « bons » ou « mauvais ».

## 2. Objets principaux

### 2.1 Organisation

Représente une entreprise, une association, une institution, une coopérative ou un autre acteur collectif.

Champs recommandés :
- `id` : identifiant stable, non réutilisé.
- `name` : nom affiché.
- `kind` : type d'organisation.
- `country_codes` : pays concernés, si connus.
- `website` : site officiel, si vérifié.
- `description` : description factuelle et neutre.
- `created_at` : date de création de la fiche.
- `updated_at` : dernière modification.
- `reviewed_at` : dernière révision éditoriale.
- `status` : brouillon, publié, à réviser ou retiré.

### 2.2 Marque

Représente une marque commerciale. Une marque est distincte de l'organisation qui la possède ou l'exploite.

Champs recommandés :
- `id`
- `name`
- `description`
- `website`
- `status`
- `reviewed_at`

La relation entre une marque et une organisation est enregistrée séparément, avec une période de validité et des sources.

### 2.3 Produit ou service

Représente un produit ou un service identifié.

Champs recommandés :
- `id`
- `name`
- `brand_id` : facultatif si la marque est inconnue.
- `category`
- `identifiers` : codes-barres ou identifiants, si leur exactitude est vérifiée.
- `description`
- `status`

Un code-barres identifie une référence commerciale ; il ne prouve pas à lui seul le lieu de fabrication, l'origine des matières ou les conditions de production.

### 2.4 Relation entre acteurs

Permet de représenter les liens entre organisations, marques, produits, fournisseurs et autres acteurs.

Champs :
- `id`
- `from_entity_id`
- `to_entity_id`
- `relationship_type` : possède, exploite, fabrique, distribue, fournit, certifie, finance, etc.
- `valid_from` : début connu de la relation.
- `valid_until` : fin connue, si applicable.
- `knowledge_status` : confirmé, partiel, contesté ou inconnu.
- `source_ids` : sources qui étayent la relation.
- `notes` : limites et précisions.

Ne jamais déduire une relation de propriété à partir d'une simple relation commerciale.

### 2.5 Source

Représente un document ou une ressource consultable.

Champs :
- `id`
- `title`
- `publisher` : auteur ou organisme éditeur.
- `url` : adresse exacte, si disponible.
- `source_type` : document officiel, étude scientifique, rapport, article, décision, déclaration, base de données, etc.
- `published_at` : date de publication, si connue.
- `accessed_at` : date de consultation.
- `language`
- `methodology` : méthode employée, si connue.
- `potential_conflicts` : intérêts ou liens pertinents connus.
- `limitations` : limites identifiées.
- `archived_url` : copie d'archive licite, si disponible.
- `review_status` : à examiner, examinée, contestée ou inaccessible.

La nature d'une source ne suffit pas à garantir sa fiabilité. Son contenu et sa méthode doivent être examinés.

### 2.6 Affirmation

Représente une proposition factuelle précise, formulée de manière vérifiable.

Champs :
- `id`
- `subject_entity_id` : entité concernée.
- `statement` : formulation précise, sans exagération.
- `topic` : environnement, travail, animaux, vie privée, etc.
- `claim_status` : confirmé, corroboré, allégué, contesté, réfuté ou insuffisamment documenté.
- `valid_from` et `valid_until` : période à laquelle l'affirmation se rapporte, si connue.
- `reviewed_at`
- `source_ids`
- `evidence_ids`
- `uncertainty_note` : ce qui reste incertain.
- `editorial_note` : contexte nécessaire à la compréhension.

Le statut décrit l'état de l'examen de l'affirmation ; il ne constitue pas un jugement définitif sur une organisation.

### 2.7 Élément de preuve

Représente un passage, un tableau, une mesure, une décision ou un élément précis tiré d'une source.

Champs :
- `id`
- `source_id`
- `locator` : page, section, paragraphe, tableau ou horodatage.
- `excerpt` : extrait court lorsque sa reproduction est autorisée.
- `summary` : résumé rédigé par IMPACT.
- `supports_claim_ids`
- `contradicts_claim_ids`
- `limitations`

Une source peut soutenir une affirmation sur un point et ne pas la soutenir sur un autre.

### 2.8 Réponse ou droit de réponse

Champs :
- `id`
- `entity_id`
- `related_claim_ids`
- `published_at`
- `received_at`
- `source_id` : communiqué ou document original, si disponible.
- `summary`
- `full_response_url`
- `publication_status`

La réponse est présentée loyalement et séparément de l'évaluation des preuves. Sa publication ne signifie ni qu'IMPACT l'approuve, ni qu'elle invalide automatiquement l'affirmation concernée.

### 2.9 Engagement

Représente un objectif ou une promesse publique d'une organisation.

Champs :
- `id`
- `entity_id`
- `statement`
- `announced_at`
- `target_date`
- `measurement_method`
- `baseline`
- `target_value`
- `observed_result`
- `status` : annoncé, en cours, atteint selon les éléments disponibles, non atteint, abandonné ou impossible à évaluer.
- `source_ids`
- `reviewed_at`

Ne pas déclarer un engagement atteint sans méthode de mesure et éléments justificatifs.

### 2.10 Campagne

Représente une campagne publique, y compris une campagne de boycott.

Champs :
- `id`
- `title`
- `organizer`
- `target_entity_ids`
- `demands`
- `started_at`
- `ended_at`
- `campaign_status`
- `claim_ids`
- `response_ids`
- `outcome_summary`
- `source_ids`

Les revendications d'une campagne doivent rester identifiées comme telles et ne pas être présentées automatiquement comme des faits établis.

## 3. Statuts à ne pas confondre

### Statut éditorial d'une fiche
- `draft` : brouillon non public.
- `published` : publiée.
- `review_needed` : révision nécessaire.
- `withdrawn` : retirée, avec motif conservé dans l'historique.

### État d'examen d'une affirmation
- `confirmed` : suffisamment étayée par les éléments examinés.
- `corroborated` : appuyée par plusieurs sources concordantes, sans confirmation primaire complète.
- `alleged` : accusation ou signalement documenté qui n'est pas établi.
- `disputed` : contestation pertinente en cours d'examen.
- `refuted` : éléments fiables contraires à l'affirmation.
- `insufficient_information` : éléments insuffisants pour conclure.

Ces statuts ne doivent pas être réduits à une note numérique unique.

## 4. Historique des modifications

Toute modification éditoriale significative doit produire un événement d'historique contenant :
- l'identifiant de l'objet modifié ;
- la date ;
- la nature du changement ;
- le motif ;
- les champs concernés ;
- la référence de la version précédente ;
- le statut de validation.

Les journaux publics ne doivent pas exposer de données personnelles, d'adresses privées ou d'informations de sécurité.

## 5. Règles de publication

Une fiche ne peut être publiée que si :
1. son objet est identifié sans ambiguïté ;
2. les affirmations importantes sont formulées précisément ;
3. les sources sont consultables ou leur indisponibilité est expliquée ;
4. les dates et limites sont indiquées ;
5. les réponses pertinentes sont présentées ;
6. les conflits d'intérêts connus sont déclarés ;
7. une personne responsable de la validation éditoriale est identifiée dans le processus interne.

Les informations sensibles, accusations graves et données concernant des personnes physiques nécessitent un examen renforcé et une base légale appropriée.

## 6. Exemple JSON minimal

```json
{
  "id": "claim-example-001",
  "subject_entity_id": "org-example-001",
  "statement": "L'organisation a publié un objectif de réduction de ses émissions pour une année donnée.",
  "topic": "environment",
  "claim_status": "confirmed",
  "valid_from": "2025-01-01",
  "valid_until": null,
  "reviewed_at": "2026-01-15",
  "source_ids": ["source-example-001"],
  "evidence_ids": ["evidence-example-001"],
  "uncertainty_note": "La publication de l'objectif ne démontre pas sa réalisation.",
  "editorial_note": "L'objectif et les résultats doivent être évalués séparément."
}
```

Cet exemple est fictif et sert uniquement à illustrer la structure.

## 7. Choix techniques pour la première version

Pour le prototype web :
- données éditoriales stockées dans des fichiers JSON versionnés ;
- identifiants stables ;
- validation automatique des formats avant intégration ;
- séparation des données et de l'interface ;
- dates normalisées au format ISO 8601 ;
- URLs conservées telles que publiées, sans les reconstruire ;
- aucune collecte de données personnelles nécessaire à la consultation.

Une base de données serveur ne sera envisagée que si un besoin réel apparaît et si son coût, sa sécurité et ses implications de confidentialité sont maîtrisés.

## 8. Points à valider avant production

- Définition précise des catégories et des relations.
- Politique de conservation et d'archivage des sources.
- Règles juridiques relatives aux citations, données et droits de réponse.
- Méthode de validation éditoriale.
- Procédure de contestation et de correction.
- Licences des contenus et jeux de données.

**Règle générale : IMPACT doit pouvoir expliquer d'où vient chaque information, ce qu'elle permet de dire et ce qu'elle ne permet pas de conclure.**
