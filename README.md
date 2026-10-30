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

Le prototype propose une interface bilingue, un mode sombre par défaut, un mode clair et cinq couleurs d’accent personnalisables (vert, bleu, violet, orange et rose), des préférences conservées localement et une navigation compatible avec le bouton Retour Android, un lecteur de dossiers documentés et les six univers prévus. Le dépôt contient un corpus Nestlé en brouillon (eaux, alimentation infantile, cacao, travail, emballages et environnement), mais aucun dossier n'est publié : la validation humaine reste obligatoire. Les tests automatisés du service worker couvrent le cache initial, les mises à jour, le repli hors ligne et les exclusions de requêtes. Les tests automatisés Web et l'analyse CodeQL sont configurés dans GitHub Actions ; leur résultat doit être vérifié après chaque série de modifications. Un projet Android local embarqué existe désormais avec une CI de compilation ; les essais sur téléphone réel, l'audit d'accessibilité et toute publication stable restent à faire.

## Utiliser et installer IMPACT

La version Web est la première cible. Elle est conçue pour fonctionner dans un navigateur sur Android, iOS/iPadOS, Windows, macOS et Linux.

| Plateforme | État actuel |
|---|---|
| Web (tous appareils) | Déploiement GitHub Pages préparé ; activation du service dans les paramètres du dépôt encore nécessaire |
| Android | APK debug de test via GitHub Actions ; aucune APK stable signée publiée |
| iPhone/iPad | Utilisation Web prévue via Safari ; aucune application native iOS ni fichier IPA |
| Windows / macOS / Linux | Utilisation Web prévue ; aucun installateur natif (.exe, .msi, .dmg, .deb, .rpm ou AppImage) |
| GitHub | Code source et artefacts de test ; GitHub ne lance pas directement l'application depuis l'onglet Code |

**Adresse Web prévue après activation et déploiement réussi :** `https://zallyx62.github.io/IMPACT-/`.

Pour activer le déploiement automatique, ouvrir [Settings → Pages](https://github.com/zallyx62/IMPACT-/settings/pages) et choisir **GitHub Actions** comme source. Le workflow construit et contrôle le site avant publication. Tant que cette étape n'est pas faite et que le workflow n'a pas réussi, l'adresse Web ne doit pas être considérée comme disponible.

La page [GitHub Releases](https://github.com/zallyx62/IMPACT-/releases) ne contient pas encore de version officielle. Les APK de la CI sont des artefacts temporaires de test, pas des versions stables. iOS et les installateurs natifs de bureau ne sont pas encore développés.

Voir le [guide complet des plateformes, installations et versions](docs/PLATFORMS.md).

## Documentation

- [Stratégie de langues et traductions](docs/LOCALIZATION.md)
- [Préparation Android et F-Droid](docs/ANDROID_FDROID.md)
- [Politique de mises à jour Android](docs/ANDROID_UPDATES.md)
- [Projet Android et instructions de compilation](android/README.md)

- [Architecture technique](docs/ARCHITECTURE.md)
- [Politique de confidentialité](PRIVACY.md)
- [Guide de contribution](CONTRIBUTING.md)
- [Code de conduite](CODE_OF_CONDUCT.md)
- [Politique de sécurité](SECURITY.md)
- [Contrôles de sécurité automatisés](docs/SECURITY_CONTROLS.md)
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
