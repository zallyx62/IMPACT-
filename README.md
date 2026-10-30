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

**Phase : prototype web 0.1 en construction.**

Le prototype propose une interface en français, un mode sombre par défaut, un mode clair et cinq couleurs d’accent personnalisables (vert, bleu, violet, orange et rose), des préférences conservées localement et une navigation compatible avec le bouton Retour Android, un lecteur de dossiers documentés et les six univers prévus. Le dépôt contient un corpus Nestlé sur les eaux, l'alimentation infantile, le cacao, le travail, les emballages et l'environnement. Deux constats précisément circonscrits sur des produits Gerber — un rapport Greenpeace/SINTEF et une enquête Consumer Reports — sont publiés selon les critères documentaires de la charte ; les autres affirmations restent exclues tant que leurs propres preuves ne satisfont pas ces critères. Avant chaque build Web, un générateur filtre les enregistrements et n'embarque que les dossiers, sources et preuves admissibles ; les brouillons non vérifiés restent exclus du bundle public. Les tests automatisés du service worker couvrent le cache initial, les mises à jour, le repli hors ligne et les exclusions de requêtes. La CI vérifie également les icônes PWA générées (180, 192 et 512 px), le manifeste et le paquet de production. Au 30 octobre 2026, les contrôles Web complets et l'analyse CodeQL ont réussi sur le commit `a18f2af` de `main` (exécutions [Quality checks](https://github.com/zallyx62/IMPACT-/actions/runs/41046643019) et [CodeQL](https://github.com/zallyx62/IMPACT-/actions/runs/41046642998)). Le déploiement GitHub Pages de ce même commit a également réussi ([exécution](https://github.com/zallyx62/IMPACT-/actions/runs/41046643013)). Le build Android debug et release a réussi sur `main` au commit `94417b1` ; l'APK debug de test est disponible temporairement dans [l'exécution GitHub Actions](https://github.com/zallyx62/IMPACT-/actions/runs/41043170926). La pull request de mise à jour du dossier Nestlé (#86) contient le filtre de publication fondé sur les preuves, deux constats Gerber publiés avec leurs limites et réponses d'entreprise, ainsi que la modernisation de l'interface. Sur le commit `045cdf1`, les contrôles Web (tests, schémas, TypeScript, build PWA), le build Android debug/release et CodeQL ont tous réussi. L'APK debug de test correspondant est disponible dans [l'exécution GitHub Actions](https://github.com/zallyx62/IMPACT-/actions/runs/41069182493). La PR reste en brouillon et non fusionnée ; aucun déploiement de cette branche ni APK release signé n'est déclaré terminé. Les essais multi-appareils, l'accessibilité et la validation sur appareil physique restent à faire.

## Utiliser et installer IMPACT

La version Web est la première cible. Elle est conçue pour fonctionner dans un navigateur sur Android, iOS/iPadOS, Windows, macOS et Linux.

| Plateforme | État actuel |
|---|---|
| Web (tous appareils) | **En ligne** via [GitHub Pages](https://zallyx62.github.io/IMPACT-/) ; prototype public, non version stable |
| Android | [APK debug de test](https://github.com/zallyx62/IMPACT-/actions/runs/41043170926) ; aucune APK stable signée publiée |
| iPhone/iPad | Utilisation de la préversion Web publique dans Safari ; aucune application native iOS ni fichier IPA |
| Windows / macOS / Linux | Utilisation de la préversion Web publique ; aucun installateur natif (.exe, .msi, .dmg, .deb, .rpm ou AppImage) |
| GitHub | Code source et artefacts de test ; GitHub ne lance pas directement l'application depuis l'onglet Code |

**Version Web publique :** [Ouvrir IMPACT](https://zallyx62.github.io/IMPACT-/).

GitHub Pages est activé et le déploiement du 30 octobre 2026 a réussi. Les modifications du site sont désormais reconstruites et publiées par GitHub Actions après les contrôles automatisés. Le site reste un prototype public, pas une version stable.

La page [GitHub Releases](https://github.com/zallyx62/IMPACT-/releases) ne contient pas encore de version officielle. Les APK de la CI sont des artefacts temporaires de test, pas des versions stables. Le build Android a produit une APK debug et une APK release non signée ; seule l'APK debug est fournie comme artefact téléchargeable. iOS et les installateurs natifs de bureau ne sont pas encore développés.

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
