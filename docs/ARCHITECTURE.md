# Architecture technique — IMPACT

**Version :** 0.1  
**Statut :** architecture proposée pour le premier prototype web  
**Priorité :** simplicité, confidentialité, maintenabilité et coût nul.

## 1. Décision d'architecture

IMPACT commence comme une application web statique progressive (PWA), construite avec React, TypeScript et Vite. La première version n'a ni serveur applicatif, ni compte utilisateur, ni base de données distante, ni API externe obligatoire.

Les contenus éditoriaux sont conservés dans le dépôt sous forme de fichiers versionnés. L'application les lit localement au navigateur. Cette architecture limite les transmissions, fonctionne avec un hébergement statique et permet à d'autres personnes de cloner ou d'héberger une copie du projet.

**Limite importante :** un hébergement public peut traiter certaines métadonnées de connexion, comme l'adresse IP et les requêtes HTTP. Le projet peut éviter la collecte volontaire et le suivi côté application, mais ne peut pas promettre une invisibilité réseau absolue.

## 2. Technologies retenues

- **React** : interface interactive.
- **TypeScript** : réduction des erreurs de programmation.
- **Vite** : serveur de développement et génération des fichiers statiques.
- **JSON versionné** : format initial des données éditoriales.
- **IndexedDB** : stockage local futur lorsque le besoin sera établi.
- **Service worker** : cache des ressources de l'application pour un usage hors ligne progressif.
- **GitHub Actions** : vérification automatisée du typage, des tests unitaires, du comportement simulé du service worker, de la compilation et des invariants éditoriaux des schémas.
- **GitHub Pages ou autre hébergement statique** : cible possible, uniquement après tests.

Les versions directes des dépendances sont fixées dans `app/package.json`. Vite 8 exige une version récente de Node.js (20.19+ ou 22.12+). Le workflow de contrôle utilise Node 22.

Références techniques :
- Vite et versions prises en charge : https://vite.dev/releases
- Exigences de Vite 8 : https://vite.dev/blog/announcing-vite8
- Versions de React : https://react.dev/versions

Les dépendances devront être réexaminées et un fichier de verrouillage npm devra être ajouté avant une version stable.

## 3. Structure du dépôt

```text
.
├── .github/workflows/checks.yml
├── data/schema/
│   ├── claim.schema.json
│   └── source.schema.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CHARTE_EDITORIALE.md
│   ├── MODELE_DE_DONNEES.md
│   └── PLAN_V0_1.md
├── app/
│   ├── public/
│   │   ├── icons/impact.svg
│   │   ├── manifest.webmanifest
│   │   └── sw.js
│   ├── src/
│   │   ├── data/catalog.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md
├── .gitignore
├── LICENSE
└── README.md
```

## 4. Frontières entre interface et données

- `app/src/data/catalog.ts` contient uniquement la navigation et les textes génériques du prototype.
- `data/schema/` définit les structures prévues pour les affirmations et les sources.
- Les futures données factuelles seront conservées séparément de l'interface.
- Aucun dossier réel d'entreprise ne doit être inventé ou publié sans recherche et validation éditoriale.
- Une source, une affirmation et un élément de preuve restent trois objets distincts.

La première version ne contient pas encore de base de données factuelle vérifiée. Les écrans qui présentent les outils avancés signalent donc explicitement qu'ils sont en préparation.

## 5. Confidentialité

Pour le prototype :
- aucun compte ;
- aucun tracker ni outil d'analyse d'audience ;
- aucune publicité ;
- aucun appel vers une API externe ;
- aucune transmission du texte recherché ;
- aucune persistance du texte recherché ;
- aucune police, image ou bibliothèque chargée depuis un CDN ;
- aucun service d'IA générative intégré.

Les préférences temporaires d'interface restent en mémoire pendant la session. Une future persistance locale sera ajoutée uniquement si elle répond à un besoin précis et documenté.

## 6. Fonctionnement hors ligne

Le service worker met en cache les ressources de l'application servies depuis la même origine. Le premier chargement nécessite une connexion ; ensuite, les ressources déjà mises en cache peuvent rester disponibles hors ligne.

Le cache ne rend pas automatiquement les futures données nouvelles ou les dossiers jamais téléchargés disponibles hors ligne. Ces comportements devront être testés sur téléphone Android, navigateur de bureau et lors des mises à jour.

## 7. Accessibilité et interface

Exigences :
- HTML sémantique ;
- navigation au clavier ;
- indicateurs de focus visibles ;
- libellés explicites pour les champs ;
- prise en charge des préférences de réduction des animations ;
- contraste lisible ;
- interface responsive ;
- aucune information communiquée uniquement par la couleur ;
- messages d'état compréhensibles par les technologies d'assistance.

## 8. Qualité et sécurité

Les contrôles automatisés de base doivent :
1. installer les dépendances ;
2. vérifier TypeScript ;
3. construire les fichiers de production ;
4. vérifier que les schémas de données sont du JSON syntaxiquement valide.

Ces contrôles ne constituent ni un audit de sécurité, ni un audit de confidentialité, ni une validation éditoriale. Des tests d'accessibilité, de navigation, d'installation PWA et de comportement hors ligne restent nécessaires.

## 9. Déploiement

Le déploiement public ne doit pas être activé avant :
- un build réussi ;
- une vérification manuelle de l'interface ;
- des tests en ligne et hors ligne ;
- un examen des chemins de ressources et du service worker ;
- la confirmation que l'application n'effectue pas de requêtes non prévues.

Le premier prototype est destiné au développement. Il ne doit pas être présenté comme une application stable ou auditée.

## 10. Évolution sans complexité inutile

Aucun serveur central n'est prévu pour la première version. Un service distant ne sera envisagé que si une exigence réelle le rend indispensable, après analyse du coût, des risques, des possibilités d'auto-hébergement et de la confidentialité.

Les contributions et dossiers factuels pourront être examinés par des humains puis intégrés par des changements versionnés dans le dépôt.
