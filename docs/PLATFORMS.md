# Utiliser et installer IMPACT selon son appareil

## État réel des distributions

IMPACT est actuellement un prototype Web accompagné d'un projet Android de test. Il n'existe pas encore de version stable officiellement publiée.

| Appareil | Ce qui est disponible | Ce qui n'est pas encore disponible |
|---|---|---|
| Android | APK debug de test produite par GitHub Actions lorsque la compilation réussit ; projet Android compilable depuis les sources | APK stable signée, publication F-Droid et mises à jour officielles |
| iPhone et iPad (iOS/iPadOS) | Utilisation de la préversion Web publique dans Safari | Application native iOS, fichier IPA et publication App Store |
| Windows | Utilisation de la préversion Web publique dans un navigateur compatible ; lancement local depuis les sources | Installateur natif .exe ou .msi |
| macOS | Utilisation de la préversion Web publique dans un navigateur compatible ; lancement local depuis les sources | Application .app ou installateur .dmg officiel |
| Linux | Utilisation de la préversion Web publique dans un navigateur compatible ; lancement local depuis les sources | Paquet .deb, .rpm, AppImage ou Flatpak officiel |
| GitHub | Code source, historique, documentation, contrôles automatisés et artefacts temporaires de CI | L'onglet Code de GitHub n'exécute pas directement l'application |

## Version Web — tous les systèmes

La version Web publique est la voie multiplateforme prioritaire. La version Web est publiée sur GitHub Pages à l'adresse suivante :

https://zallyx62.github.io/IMPACT-/

Le déploiement GitHub Pages a été confirmé comme réussi le 30 octobre 2026. Il s'agit d'un prototype public, pas d'une version stable.

La version Web fonctionne dans les navigateurs modernes sur Android, iOS/iPadOS, Windows, macOS et Linux. Elle partage la même interface et la même direction artistique : thème sombre par défaut, mode clair et cinq couleurs d'accent.

### Publication GitHub Pages — activée

GitHub Pages est activé sur le dépôt et le workflow de publication a réussi le 30 octobre 2026. Les mises à jour de l'application, des scripts et de la documentation déclenchent une reconstruction et une publication après les contrôles.

Consulter l'exécution [Deploy IMPACT Web to GitHub Pages](https://github.com/zallyx62/IMPACT-/actions/runs/41041891940) pour voir le build et le déploiement réussis.

Le workflow construit l'application, exécute les contrôles essentiels, puis publie uniquement le dossier de production `app/dist`. Il ne publie ni les sources de développement, ni les fichiers Android, ni les données éditoriales non destinées à l'application.

Le réglage Pages est déjà activé dans les paramètres du dépôt. Le workflow ne déploie que depuis `main`.

### Ajouter IMPACT à l'écran d'accueil

- **Android :** ouvrir l'adresse Web dans Chrome ou un navigateur compatible, puis utiliser l'option d'installation ou « Ajouter à l'écran d'accueil » proposée par le navigateur.
- **iPhone/iPad :** ouvrir l'adresse dans Safari, utiliser Partager puis « Sur l'écran d'accueil ». Cette voie Web doit encore être validée sur des appareils iOS réels.
- **Windows/macOS/Linux :** utiliser le navigateur ; si celui-ci propose l'installation d'une application Web (PWA), cette option peut créer un raccourci ou une fenêtre dédiée.

L'ajout à l'écran d'accueil ne transforme pas la version Web en application native iOS, Windows, macOS ou Linux.

## Android — APK

Le workflow [IMPACT Android build](https://github.com/zallyx62/IMPACT-/actions/workflows/android.yml) construit les APK debug et release. Une compilation debug/release a réussi le 30 octobre 2026 ; [récupérer l'APK debug de test dans l'exécution](https://github.com/zallyx62/IMPACT-/actions/runs/41042218215). L'APK debug peut être conservé temporairement comme artefact de test dans une exécution réussie du workflow ; les artefacts de CI ne sont pas des versions officielles et peuvent expirer.

La release actuelle est non signée. Elle ne doit pas être présentée comme un téléchargement prêt à installer.

Avant une publication Android, il faut notamment :
- établir et protéger la clé de signature ;
- produire et vérifier une version release signée ;
- tester la mise à jour depuis une version antérieure ;
- vérifier l'installation sur plusieurs appareils et versions Android ;
- terminer les contrôles d'accessibilité et de sécurité ;
- préparer les métadonnées et la procédure de publication F-Droid.

Aucun APK ne doit être téléchargé depuis une issue ou un commit non identifié. Une future version officielle devra être publiée dans [GitHub Releases](https://github.com/zallyx62/IMPACT-/releases) avec numéro de version, notes, empreinte SHA-256 et provenance du build.

## iOS, Windows, macOS et Linux — applications natives

Aucun projet natif iOS, Windows, macOS ou Linux n'est présent actuellement. Il ne faut donc pas annoncer de fichier IPA, EXE, MSI, DMG, DEB, RPM ou AppImage.

Le choix retenu est de rendre d'abord la version Web utilisable sur ces systèmes. Des applications natives ou des paquets de bureau ne seront envisagés que si une fonction spécifique le justifie et si leur maintenance, leur sécurité et leur compilation peuvent être assurées.

## Lancer le projet depuis les sources

Prérequis : Git, Node.js 22.12 ou plus récent dans la ligne 22, et npm.

```sh
git clone https://github.com/zallyx62/IMPACT-.git
cd IMPACT-/app
npm ci
npm run dev
```

Vite affiche alors une adresse locale à ouvrir dans le navigateur. Pour préparer le build de production :

```sh
npm run typecheck
npm test
npm run build
```

Les commandes sont les mêmes sur Windows, macOS et Linux si Git, Node.js et npm sont installés. Sur Windows, elles peuvent être exécutées dans PowerShell ou un terminal compatible.

## Versions et téléchargements officiels

À ce jour, la page [GitHub Releases](https://github.com/zallyx62/IMPACT-/releases) ne contient aucune version publiée. Il n'existe donc pas encore de canal officiel de téléchargement multi-plateforme.

Une version ne sera déclarée stable qu'après :
- validation de la CI Web et Android ;
- revue des dépendances et des alertes de sécurité ;
- vérification du build et des signatures ;
- tests sur appareils et navigateurs réels ;
- revue humaine des contenus éditoriaux ;
- publication d'une version identifiée et documentée.

Les téléchargements temporaires de GitHub Actions servent aux tests. Ils ne remplacent pas une version publiée et maintenue.
