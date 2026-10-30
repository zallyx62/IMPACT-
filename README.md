# IMPACT

**Comprendre. Choisir. Agir.**

IMPACT est un projet citoyen, gratuit et open source qui vise à rendre accessibles des informations documentées sur les entreprises, les produits, les technologies et les conséquences de nos choix.

Le projet veut aider chacun à comprendre, vérifier et comparer des informations, sans décider à sa place.

## Principes

- Gratuit et sans publicité.
- Code logiciel sous licence GNU AGPL-3.0-only.
- Aucun tracker, aucune télémétrie ni profilage côté application.
- Pas de compte obligatoire pour consulter les contenus.
- Fonctionnement hors ligne recherché en priorité.
- Sources, dates, incertitudes et corrections visibles.
- Validation humaine des informations éditoriales.
- Aucune IA générative intégrée au produit destiné au public.

## Les six univers

1. Animaux et alimentation
2. Planète et environnement
3. Humains et société
4. Entreprises et consommation
5. Technologie et numérique
6. Agir et changer

## Ce qui rend IMPACT distinctif

- Cartographie des entreprises, marques, filiales et relations documentées.
- Dossiers séparant faits, déclarations, allégations, opinions et informations inconnues.
- Sources et éléments de preuve traçables.
- Historique des engagements et des corrections.
- Droit de réponse et traitement des contestations.
- Comparaisons multicritères sans note morale globale.
- Mise en évidence des connaissances manquantes et des limites des données.

## État du projet

**Phase : prototype web 0.1 en construction.**

Le prototype propose une interface en français et en anglais, un sélecteur de langue, une recherche locale, un lecteur de dossiers documentés et les six univers prévus. Le dépôt contient un corpus Nestlé en brouillon (eaux, alimentation infantile, cacao, travail, emballages et environnement), mais aucun dossier n'est publié : la validation humaine reste obligatoire. Les tests automatisés du service worker couvrent le cache initial, les mises à jour, le repli hors ligne et les exclusions de requêtes. Les essais réels sur navigateurs et téléphones, l'audit d'accessibilité et la publication restent à faire.

## Documentation

- [Stratégie de langues et traductions](docs/LOCALIZATION.md)
- [Préparation Android et F-Droid](docs/ANDROID_FDROID.md)

- [Architecture technique](docs/ARCHITECTURE.md)
- [Politique de confidentialité](PRIVACY.md)
- [Guide de contribution](CONTRIBUTING.md)
- [Code de conduite](CODE_OF_CONDUCT.md)
- [Politique de sécurité](SECURITY.md)
- [Plan de réalisation de la version 0.1](docs/PLAN_V0_1.md)
- [Modèle de données](docs/MODELE_DE_DONNEES.md)
- [Charte éditoriale et de vérification](docs/CHARTE_EDITORIALE.md)
- [Politique des droits sur les données](docs/DATA_RIGHTS_POLICY.md)
- [Schéma JSON des affirmations](data/schema/claim.schema.json)
- [Schéma JSON des sources](data/schema/source.schema.json)
- [Schéma JSON des entités](data/schema/entity.schema.json)
- [Schéma JSON des relations](data/schema/relationship.schema.json)
- [Schéma JSON des éléments de preuve](data/schema/evidence.schema.json)
- [Schéma JSON des campagnes](data/schema/campaign.schema.json)
- [Schéma JSON des réponses](data/schema/response.schema.json)
- [Schéma JSON des engagements](data/schema/commitment.schema.json)
- [Instructions de développement de l'application](app/README.md)
- [Code de l'application web](app/src/App.tsx)

## Développement

Consultez [app/README.md](app/README.md) pour démarrer le prototype. Le workflow GitHub Actions exécute `npm ci`, l'audit des dépendances, le typage, les tests de recherche, les contrôles de données et de publication, les tests simulés du service worker, les contrôles d'interface et de contraste clair/sombre, le build et la vérification du paquet PWA.

Ces contrôles ne remplacent pas une revue humaine de l'accessibilité, de la sécurité, de la confidentialité et du contenu éditorial.

## Licence

Le code logiciel est distribué sous licence GNU AGPL-3.0-only ; voir [LICENSE](LICENSE). Les contenus, données et médias peuvent relever de licences différentes. Leur licence doit être indiquée séparément avant toute réutilisation.

Les contributions éditoriales ne sont pas automatiquement publiées : elles doivent être examinées selon la charte éditoriale.

---

**IMPACT ne décide pas à votre place. Il vous donne les moyens de comprendre, de vérifier et d'agir librement.**
