# IMPACT — application web

Application web progressive avec navigation, recherche locale et lecteur de dossiers documentés alimenté par des fichiers JSON versionnés. Le dépôt ne contient pas encore de dossier factuel publié.

## Prérequis

Node.js 22.12 ou plus récent dans la ligne 22, ou une version Node compatible avec Vite 8, et npm.

## Commandes

Dans ce dossier :

```sh
npm ci
npm run dev
```

Contrôles :

```sh
npm run typecheck
npm run test
npm run build
npm run preview
```

Après `npm ci` dans `app/`, revenez à la racine du dépôt (`cd ..`) pour exécuter les contrôles de données et du service worker :

```sh
node scripts/test-service-worker.mjs
node --test scripts/test-data-integrity.test.mjs
node --test scripts/test-schema-validation.test.mjs
node --test scripts/test-dossier-publication.test.mjs
node scripts/check-schemas.mjs
node scripts/check-data.mjs
node scripts/check-contrast.mjs
node scripts/check-ui-invariants.mjs
```

Le contrôle du paquet PWA (`node scripts/check-pwa-build.mjs`) s'exécute après `npm run build`.

Le build de production est généré dans `dist/`.

## Confidentialité du prototype

La recherche se fait dans des tableaux embarqués dans l'application. Elle n'est pas envoyée au serveur et n'est pas enregistrée. L'application n'utilise aucun service analytique, aucune API distante, aucun compte et aucune IA générative.

Une fois déployée, l'infrastructure d'hébergement peut néanmoins traiter des métadonnées réseau ordinaires.

## État

Les univers et outils restent des structures de navigation. Le lecteur de dossiers et les validateurs sont en place, mais aucun dossier réel d'entreprise ni aucune évaluation factuelle n'est inclus. Les tests automatisés simulent le cache hors ligne ; une installation et des essais réels sur téléphone et navigateur restent nécessaires avant toute publication stable.
