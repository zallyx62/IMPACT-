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
- **GitHub Pages** : hébergement de la préversion publique ; toute publication stable exige des validations supplémentaires.

Les versions directes des dépendances sont fixées dans `app/package.json` et le graphe transitif est verrouillé dans `app/package-lock.json`. Le workflow utilise `npm ci` puis `npm audit --audit-level=high`. Vite 8 exige une version récente de Node.js (20.19+ ou 22.12+). Le workflow de contrôle utilise Node 22.

Références techniques :
- Vite et versions prises en charge : https://vite.dev/releases
- Exigences de Vite 8 : https://vite.dev/blog/announcing-vite8
- Versions de React : https://react.dev/versions

Les dépendances sont surveillées chaque semaine par Dependabot et auditées avec `npm audit`. CodeQL analyse le code JavaScript/TypeScript et les workflows GitHub Actions. Ces contrôles complètent les tests ; ils ne remplacent pas une revue de sécurité indépendante. Voir `docs/SECURITY_CONTROLS.md`.

## 3. Structure du dépôt

```text
.
├── .github/workflows/checks.yml
├── data/schema/
│   ├── claim.schema.json
│   ├── source.schema.json
│   ├── entity.schema.json
│   ├── relationship.schema.json
│   ├── evidence.schema.json
│   ├── campaign.schema.json
│   ├── response.schema.json
│   └── commitment.schema.json
├── data/records/
│   ├── entities/
│   ├── sources/
│   ├── claims/
│   ├── evidence/
│   ├── relationships/
│   ├── campaigns/
│   ├── responses/
│   └── commitments/
├── docs/
│   ├── DATA_RIGHTS_POLICY.md
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
│   │   ├── data/records.ts
│   │   ├── data/dossier-builder.ts
│   │   ├── data/public-records.generated.ts (généré, ignoré par Git)
│   │   ├── App.tsx
│   │   ├── DossierPanel.tsx
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md
├── scripts/
│   ├── check-schemas.mjs
│   ├── check-data.mjs
│   ├── check-contrast.mjs
│   ├── check-pwa-build.mjs
│   ├── generate-public-records.mjs
│   ├── test-public-data.test.mjs
│   ├── lib/data-integrity.mjs
│   ├── lib/schema-validation.mjs
│   ├── test-service-worker.mjs
│   ├── test-search.mjs
│   ├── test-data-integrity.test.mjs
│   ├── test-schema-validation.test.mjs
│   └── test-dossier-publication.test.mjs
├── .gitignore
├── LICENSE
└── README.md
```

## 4. Frontières entre interface et données

- `app/src/data/catalog.ts` contient uniquement la navigation et les textes génériques du prototype.
- `data/schema/` définit huit structures : entités, sources, affirmations, preuves, relations, campagnes, réponses et engagements.
- `data/records/` contient les enregistrements JSON versionnés, séparés par type. Le dépôt contient des brouillons documentaires Nestlé (eaux, substituts du lait maternel, sucre, cacao, travail, emballages et déforestation), qui restent invisibles jusqu'à validation éditoriale humaine.
- `scripts/generate-public-records.mjs` lit les enregistrements source, applique `dossier-builder.ts` et génère avant les commandes Web un module filtré `app/src/data/public-records.generated.ts`.
- `app/src/data/records.ts` charge uniquement ce module généré ; les sources, affirmations et preuves non examinées ne sont donc pas intégrées au bundle Web distribué.
- Le module généré est ignoré par Git et recréé avant le développement, le typage, les tests et le build. Le test `scripts/test-public-data.test.mjs` vérifie les statuts et les références ; `scripts/check-pwa-build.mjs` compare les enregistrements source au jeu public et vérifie que l'identifiant de chaque enregistrement exclu est absent des fichiers JavaScript produits.
- Un dossier réel peut être publié sans validation humaine préalable lorsque les critères de preuve, de corroboration, de transparence et les contrôles définis dans la charte sont satisfaits. Les cas sensibles ou à risque élevé restent bloqués pour examen humain.
- Une source, une affirmation et un élément de preuve restent trois objets distincts.

La première version contient un corpus de travail non publié ; aucun dossier Nestlé n'est visible tant que les critères de preuve et les statuts de publication ne sont pas satisfaits. Les écrans qui présentent les outils avancés signalent donc explicitement qu'ils sont en préparation.

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

L'interface publique du prototype est en français uniquement. Les sources et citations conservent leur langue d'origine. Aucune traduction automatique ne sera intégrée. Une future persistance locale sera ajoutée uniquement si elle répond à un besoin précis et documenté.

## 6. Fonctionnement hors ligne

Le service worker met en cache les navigations de l'application et les ressources statiques du shell et des bundles `/assets/` sur la même origine. Les chemins dynamiques et les requêtes API ne sont pas interceptés ni mis en cache. Le premier chargement nécessite une connexion ; ensuite, les ressources déjà mises en cache peuvent rester disponibles hors ligne.

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

Les contrôles automatisés exécutés dans GitHub Actions (y compris les changements sous `data/records/` lors des pull requests) sont :
1. générer le jeu de données publiques filtré à partir des enregistrements source ;
2. installer les dépendances avec `npm ci` ;
3. auditer les dépendances avec `npm audit` ;
4. vérifier TypeScript ;
5. exécuter les tests de recherche et de publication des données publiques ;
6. tester l'intégrité des références et la validation JSON Schema ;
7. tester les règles de publication des dossiers ;
8. simuler le service worker, vérifier les invariants d'interface et contrôler les contrastes en thèmes clair et sombre ;
9. construire les fichiers de production ;
10. vérifier le paquet PWA généré, les schémas et les références de données, notamment l'absence de brouillons dans le bundle.

Ces tests simulés ne remplacent pas les essais sur un vrai navigateur ou téléphone.

Ces contrôles ne constituent ni un audit de sécurité, ni un audit de confidentialité, ni une validation éditoriale. Des tests d'accessibilité, de navigation, d'installation PWA et de comportement hors ligne restent nécessaires.

## 9. Déploiement

Une préversion publique est actuellement déployée sur GitHub Pages. Elle ne doit pas être confondue avec une version stable. Toute nouvelle version publique doit être précédée de :
- un build réussi ;
- une vérification manuelle de l'interface ;
- des tests en ligne et hors ligne ;
- un examen des chemins de ressources et du service worker ;
- la confirmation que l'application n'effectue pas de requêtes non prévues.

Le premier prototype est destiné au développement. Il ne doit pas être présenté comme une application stable ou auditée.

## 10. Évolution sans complexité inutile

Aucun serveur central n'est prévu pour la première version. Un service distant ne sera envisagé que si une exigence réelle le rend indispensable, après analyse du coût, des risques, des possibilités d'auto-hébergement et de la confidentialité.

Les contributions et dossiers factuels sont intégrés par des changements versionnés. La publication suit le seuil de preuve de la charte ; un examen humain préalable est réservé aux catégories sensibles ou à risque élevé.
