# Journal des modifications

Ce fichier décrit les changements destinés aux utilisateurs. Les versions publiées seront identifiées par un tag Git et une entrée GitHub Releases.

## [Non publié] — développement en cours

### Application Web
- Préversion publique déployée sur GitHub Pages le 30 octobre 2026 ; publication automatisée réservée à la branche `main`.
- Interface publique en français uniquement ; le thème sombre reste le choix initial.
- Interface avec thème sombre par défaut, mode clair et cinq couleurs d'accent.
- Préférences d'apparence conservées localement sur l'appareil.
- Navigation avec prise en charge du retour navigateur et Android.
- Application Web progressive avec cache hors ligne soumis à des tests automatisés.
- Contrôles de contraste, d'interface, de données et de build exécutés dans GitHub Actions.

### Android
- Premier test manuel de base de l'APK debug rapporté comme réussi sur un téléphone par le propriétaire le 30 octobre 2026 ; couverture multi-appareils toujours nécessaire.
- Premier projet Android qui embarque le build Web dans une WebView locale.
- Permissions réseau et installation de paquets non déclarées.
- Compilation debug et release dans GitHub Actions ; l'APK release reste non signée.
- Aucun APK stable signé ni publication F-Droid.

### Distribution
- Workflow de build et de préparation de publication GitHub Pages ajouté.
- Le site ne sera publié qu'après activation de GitHub Pages dans les paramètres du dépôt.
- Aucune version officielle n'est publiée dans GitHub Releases.
- Aucune application native iOS, Windows, macOS ou Linux n'est disponible.

### Sécurité et qualité
- Déclaration des préférences locales de thème et d'accent dans la politique de confidentialité.
- Exclusion des sorties Android/Gradle, APK, AAB et fichiers de signature du dépôt.
- Tests d'interface alignés sur les règles de mouvement réduit et la confidentialité.
- Workflows CI configurés pour exécuter les contrôles sur toutes les Pull Requests vers `main`.

## Politique de versionnement

Le projet suivra le versionnement sémantique : `MAJOR.MINOR.PATCH`. Les versions Android utiliseront également un `versionCode` strictement croissant et un `versionName` correspondant.

Une entrée ne sera déplacée vers une version publiée qu'après validation des tests, revue des contenus, vérification des signatures et publication des artefacts correspondants. Les builds de test de GitHub Actions ne constituent pas des versions officielles.
