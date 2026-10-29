# Plan de réalisation — IMPACT 0.1

**But :** obtenir une première application web navigable, claire et légère, sans publier prématurément des informations factuelles sur des entreprises.

## Périmètre inclus

- Accueil responsive en français et anglais.
- Navigation dans les six univers.
- Recherche locale parmi les univers et les outils du prototype.
- Pages explicatives de sélection pour les univers.
- Présentation des outils futurs et de leur statut.
- Engagements de confidentialité visibles.
- Manifest PWA et mise en cache de ressources statiques.
- Contrôle de typage, tests unitaires, tests simulés du service worker, validation des schémas et build dans GitHub Actions.

## Hors périmètre de la version 0.1

- Dossiers factuels d'entreprises, marques ou produits.
- Scanner de codes-barres.
- Base de données de fournisseurs.
- Notes ou comparaisons réelles d'entreprises.
- Comptes et profils utilisateur.
- Contributions publiées directement par les utilisateurs.
- Backend, synchronisation ou API distante.
- Notifications de suivi.
- Publication stable sur GitHub Pages ou F-Droid.

## Critères d'acceptation

- Le projet s'installe avec Node.js compatible et npm.
- `npm run typecheck` réussit.
- `npm run test` réussit.
- `node scripts/test-service-worker.mjs` réussit depuis la racine du dépôt.
- `npm run build` réussit.
- Les six univers s'affichent et sont sélectionnables.
- La recherche filtre les titres, descriptions et mots-clés locaux.
- Le bouton de langue change les textes de l'interface.
- Les fonctions encore indisponibles sont clairement signalées.
- Le navigateur n'envoie ni recherche, ni préférence à un serveur.
- L'application n'inclut pas de publicités, suivi analytique, compte ni IA générative.
- Le service worker passe les tests automatisés simulés.
- Le service worker et l'utilisation hors ligne sont testés manuellement sur de vrais navigateurs et appareils avant déploiement.

## Ordre de travail

1. Finaliser le squelette et la documentation d'architecture.
2. Exécuter les contrôles automatisés.
3. Corriger les erreurs de typage ou de build.
4. Réaliser une revue des chemins PWA et du service worker.
5. Vérifier manuellement l'interface sur mobile.
6. Demander une revue humaine de la sécurité, de la confidentialité et de l'accessibilité.
7. Seulement ensuite, envisager un premier hébergement public.

## Risques à suivre

- Les catégories seules ne remplacent pas une base documentaire.
- Les contenus éditoriaux exigent du travail humain continu.
- Les hébergeurs statiques peuvent enregistrer des métadonnées de connexion.
- Une PWA peut avoir des différences de comportement selon les navigateurs.
- Sans fichier de verrouillage, les dépendances transitives ne sont pas totalement reproductibles ; ajouter un lockfile avant une version stable.
