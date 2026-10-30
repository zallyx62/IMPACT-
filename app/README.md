# IMPACT — application web

Application web progressive avec navigation, recherche locale et lecteur de dossiers documentés alimenté par des fichiers JSON versionnés. Avant les commandes de développement, de typage, de test et de build, un générateur applique la règle de publication éditoriale et ne produit qu'un jeu de données publiques validées. Les brouillons non examinés ne sont pas intégrés au bundle Web.

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

Le build de production est généré dans `dist/`. Les icônes PNG PWA de 180, 192 et 512 pixels sont générées automatiquement depuis les sources versionnées dans `assets/pwa-icons/` avant `npm run dev` et `npm run build` ; les fichiers générés restent ignorés par Git.

## Interface et navigation

L'interface publique est en français uniquement. Le mode sombre est activé par défaut. Dans Paramètres, l'utilisateur peut choisir le mode clair et l'une des cinq couleurs d'accent : vert, bleu, violet, orange ou rose. Les préférences sont enregistrées uniquement dans le stockage local de l'appareil. Les fiches et univers utilisent l'historique de navigation du navigateur afin que le bouton Retour Android revienne à l'écran précédent.

L'interface Web et l'interface de l'APK utilisent le même code React embarqué dans l'APK ; les ajustements de présentation restent donc cohérents entre les deux versions.

## Confidentialité du prototype

La recherche se fait dans des tableaux embarqués dans l'application. Elle n'est pas envoyée au serveur et n'est pas enregistrée. L'application n'utilise aucun service analytique, aucune API distante, aucun compte et aucune IA générative.

Une fois déployée, l'infrastructure d'hébergement peut néanmoins traiter des métadonnées réseau ordinaires.

## État

Les univers et outils restent des structures de navigation. Le lecteur de dossiers comprend actuellement six constats Nestlé publiés selon les critères documentaires de la charte : trois sur les pratiques de Nestlé Waters en France, deux sur des produits Gerber testés et un sur les objets plastiques de marque recensés dans une étude évaluée par les pairs, avec leurs sources, limites et réponses d'entreprise. Les autres sujets du corpus restent exclus du bundle public jusqu'à vérification de leurs propres preuves. Les tests automatisés simulent le cache hors ligne et vérifient que les identifiants de brouillons ne se retrouvent pas dans le bundle de production ; une installation et des essais réels sur téléphone et navigateur restent nécessaires avant toute publication stable.
