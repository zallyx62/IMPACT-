# IMPACT

**Comprendre. Choisir. Agir.**

**Version Web :** [Ouvrir IMPACT](https://zallyx62.github.io/IMPACT-/) · [Code source](https://github.com/zallyx62/IMPACT-)

[![Contrôles Web](https://github.com/zallyx62/IMPACT-/actions/workflows/checks.yml/badge.svg?branch=main)](https://github.com/zallyx62/IMPACT-/actions/workflows/checks.yml) [![Build Android](https://github.com/zallyx62/IMPACT-/actions/workflows/android.yml/badge.svg?branch=main)](https://github.com/zallyx62/IMPACT-/actions/workflows/android.yml) [![CodeQL](https://github.com/zallyx62/IMPACT-/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/zallyx62/IMPACT-/actions/workflows/codeql.yml)

IMPACT est un projet citoyen, gratuit et open source qui vise à rendre accessibles des informations documentées sur les entreprises, les produits, les technologies et les conséquences de nos choix.

Le projet veut aider chacun à comprendre, vérifier et comparer des informations, sans décider à sa place.

## Principes

- Gratuit et sans publicité.
- Code logiciel sous licence GNU AGPL-3.0-only.
- Aucun tracker, aucune télémétrie ni profilage côté application.
- Pas de compte obligatoire pour consulter les contenus.
- Fonctionnement hors ligne recherché en priorité.
- Sources, dates, incertitudes et corrections visibles.
- Publication fondée sur des preuves vérifiables, sans validation humaine systématique ; examen renforcé pour les sujets à risque.
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

**Phase : prototype Web 0.1 public, en validation — pas encore une version stable.**

La version Web est une application progressive (PWA) en français, conçue pour être consultée sans compte. Elle propose une recherche locale, six univers, des dossiers documentés, un centre de preuves, un comparateur documentaire, un explorateur de relations entre acteurs, un suivi des engagements, un formulaire local de contribution et un atelier local de préparation de projets. L'atelier comprend une bibliothèque de trois méthodes génériques (diagnostic, expérimentation limitée, évaluation) et permet de télécharger une fiche projet en Markdown. Les brouillons et recherches ne sont pas transmis ni publiés automatiquement.

Le corpus public comprend actuellement un dossier Nestlé et sept constats précisément délimités, accompagnés de sources, de preuves, de limites et, lorsque disponibles, de réponses d'entreprise. Les rubriques sans données admissibles restent vides : IMPACT ne complète pas les lacunes par des suppositions. Les dossiers non admissibles sont exclus du paquet public par le générateur exécuté avant chaque build.

Les contrôles automatisés couvrent le typage TypeScript, les tests unitaires, les schémas et références éditoriales, les règles de publication, les contrastes, les invariants d'interface, le service worker, le paquet PWA, l'audit des dépendances et CodeQL. Les workflows construisent également les APK Android debug et release ; ces builds ne constituent pas une publication Android stable.

**Limites à ne pas masquer :** le site est statique, sans compte, serveur applicatif ni synchronisation communautaire. Les tests automatisés du mode hors ligne ne remplacent pas un essai sur appareil réel. Les parcours d'accessibilité, la navigation mobile, le mode avion et le trafic réseau doivent encore être contrôlés manuellement avant de qualifier le prototype de version stable. Les journaux de l'hébergeur peuvent traiter des métadonnées réseau ordinaires.

## Utiliser et installer IMPACT

La version Web est la première cible. Elle est conçue pour fonctionner dans un navigateur sur Android, iOS/iPadOS, Windows, macOS et Linux.

| Plateforme | État actuel |
|---|---|
| Web (tous appareils) | **En ligne** via [GitHub Pages](https://zallyx62.github.io/IMPACT-/) ; prototype public, non version stable |
| Android | Builds debug/release vérifiés par CI ; [artefacts de test](https://github.com/zallyx62/IMPACT-/actions/workflows/android.yml) ; aucune APK stable signée publiée |
| iPhone/iPad | Utilisation de la préversion Web publique dans Safari ; aucune application native iOS ni fichier IPA |
| Windows / macOS / Linux | Utilisation de la préversion Web publique ; aucun installateur natif (.exe, .msi, .dmg, .deb, .rpm ou AppImage) |
| GitHub | Code source et artefacts de test ; GitHub ne lance pas directement l'application depuis l'onglet Code |

**Version Web publique :** [Ouvrir IMPACT](https://zallyx62.github.io/IMPACT-/).

GitHub Pages est activé. Les modifications de la branche principale sont reconstruites et publiées par GitHub Actions après les contrôles automatisés. Le site reste un prototype public, pas une version stable.

La page [GitHub Releases](https://github.com/zallyx62/IMPACT-/releases) ne contient pas encore de version officielle. Les APK de la CI sont des artefacts temporaires de test, pas des versions stables. Le build Android produit une APK debug de test et une APK release non signée ; ces artefacts CI ne sont pas des versions distribuables stables. iOS et les installateurs natifs de bureau ne sont pas encore développés.

Voir le [guide complet des plateformes, installations et versions](docs/PLATFORMS.md).

## Documentation

- [Stratégie de langues et traductions](docs/LOCALIZATION.md)
- [Préparation Android et F-Droid](docs/ANDROID_FDROID.md)
- [Politique de mises à jour Android](docs/ANDROID_UPDATES.md)
- [Projet Android et instructions de compilation](android/README.md)

- [Architecture technique](docs/ARCHITECTURE.md)
- [Journal des modifications et état des versions](CHANGELOG.md)
- [Politique de confidentialité](PRIVACY.md)
- [Guide de contribution](CONTRIBUTING.md)
- [Code de conduite](CODE_OF_CONDUCT.md)
- [Politique de sécurité](SECURITY.md)
- [Contrôles de sécurité automatisés](docs/SECURITY_CONTROLS.md)
- [Plan de réalisation de la version 0.1](docs/PLAN_V0_1.md)
- [Feuille de route Web à long terme](docs/ROADMAP_WEB.md)
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
