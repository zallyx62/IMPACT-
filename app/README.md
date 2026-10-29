# IMPACT — application web

Premier squelette de l'application web progressive. Il s'agit d'un prototype de navigation, pas encore d'une base d'informations vérifiées.

## Prérequis

Node.js 22.12 ou plus récent dans la ligne 22, ou une version Node compatible avec Vite 8, et npm.

## Commandes

Dans ce dossier :

```sh
npm install
npm run dev
```

Contrôles :

```sh
npm run typecheck
npm run test
npm run build
npm run preview
```

Le test du service worker est exécuté depuis la racine du dépôt :

```sh
node scripts/test-service-worker.mjs
```

Le build de production est généré dans `dist/`.

## Confidentialité du prototype

La recherche se fait dans des tableaux embarqués dans l'application. Elle n'est pas envoyée au serveur et n'est pas enregistrée. L'application n'utilise aucun service analytique, aucune API distante, aucun compte et aucune IA générative.

Une fois déployée, l'infrastructure d'hébergement peut néanmoins traiter des métadonnées réseau ordinaires.

## État

Les univers et outils sont des éléments de navigation de démonstration. Aucun dossier réel d'entreprise ni aucune évaluation factuelle n'est inclus. Le comportement hors ligne nécessite encore des essais manuels avant toute publication stable.
