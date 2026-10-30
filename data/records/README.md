# Données éditoriales

Les enregistrements sont séparés par type :

- `entities/` : organisations, marques, produits et services ;
- `sources/` : documents et ressources consultés ;
- `claims/` : affirmations documentées ;
- `evidence/` : éléments précis extraits des sources ;
- `relationships/` : liens qualifiés entre entités ;
- `campaigns/` : campagnes publiques ;
- `responses/` : réponses des entités ;
- `commitments/` : engagements et résultats mesurés.

Chaque enregistrement est un fichier JSON contenant un seul objet, avec un identifiant stable. Son nom de fichier peut reprendre cet identifiant.

## Contrôles avant intégration

Depuis la racine du dépôt, après avoir installé les dépendances de développement :

```sh
cd app && npm ci
cd ..
node scripts/check-schemas.mjs
node scripts/check-data.mjs
node --test scripts/test-data-integrity.test.mjs
```

Le validateur contrôle chaque fichier avec son schéma JSON (types, champs obligatoires, formats, énumérations et contraintes conditionnelles), puis vérifie les références croisées. Il contrôle notamment que :

- chaque affirmation pointe vers une entité et au moins une source existantes ;
- chaque preuve pointe vers une source existante ;
- chaque relation pointe vers deux entités existantes et des sources ;
- les campagnes, réponses et engagements ne contiennent pas de références cassées ;
- les dates éditoriales ne sont pas incohérentes.

## Règles de publication

Une source est publiable si son statut est `reviewed`, ou si son statut est `evidence_verified` et qu'elle comporte une méthode, une date et une note de vérification documentaire.

Une entité n'est affichée que si son statut est `published`, si sa publication repose sur une revue humaine datée ou sur une base `evidence_verified` documentée, et si **toutes** les sources qu'elle référence sont publiables.

Une affirmation doit avoir au moins une source publiable. Elle n'est affichée que si elle a été revue humainement, ou si elle est explicitement confirmée/corroborée, publiée sur la base `evidence_verified`, accompagnée d'une note de publication et déclarée sans examen humain requis. Les sujets sensibles définis par les schémas restent soumis à une revue humaine ; une simple vérification documentaire ne permet pas de contourner cette exigence.

Les preuves ne sont affichées que si leur source est publiable et si elles sont reliées au dossier ou à une affirmation publiée. Les réponses doivent être publiées et reliées à une source publiable. Les engagements nécessitent une revue humaine datée et des sources publiables.

Les statuts de publication ne remplacent pas la qualité de l'analyse : chaque affirmation doit rester limitée à ce que ses sources démontrent. Les limites, incertitudes, réponses des entités et éventuels éléments contradictoires doivent être conservés.

## Dossier Nestlé

Le dépôt contient désormais une **publication partielle** du dossier Nestlé. Elle porte sur sept constats délimités : trois concernant les pratiques de Nestlé Waters en France, deux concernant des produits Gerber testés, un concernant un audit scientifique mondial de déchets plastiques de marque et un concernant des chiffres de déforestation du cacao publiés par Nestlé.

Cette publication partielle ne signifie pas que toutes les affirmations du corpus sont validées. Les autres sujets restent en préparation tant qu'ils ne satisfont pas leurs propres critères de preuve et, lorsque nécessaire, la revue humaine. Les résultats concernant un produit, un échantillon, une période ou un site ne doivent pas être généralisés à tout le groupe Nestlé.

Le lecteur public applique les règles de publication décrites ci-dessus. Une donnée en brouillon, non examinée ou insuffisamment sourcée ne doit pas apparaître dans l'application.

