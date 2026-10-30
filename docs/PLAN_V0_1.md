# Plan de réalisation — IMPACT 0.1

**But :** obtenir une première application web navigable, claire et légère, sans publier prématurément des informations factuelles sur des entreprises.

## Périmètre inclus

- Accueil responsive en français, sans sélecteur de langue, mode sombre par défaut, mode clair, cinq couleurs d’accent au choix et hiérarchie visuelle affinée.
- Interface publique en français uniquement ; aucune autre langue n'est prévue dans le périmètre actuel.
- Navigation dans les six univers.
- Recherche locale parmi les dossiers publiés, les univers et les outils du prototype.
- Lecteur de dossiers documentés, avec affirmations, sources, preuves et incertitudes ; deux constats Nestlé limités à des produits Gerber précis sont publiés selon le seuil documentaire, les autres sujets restant en préparation.
- Pages explicatives de sélection pour les univers.
- Présentation des outils futurs et de leur statut.
- Engagements de confidentialité visibles.
- Manifest PWA et mise en cache de ressources statiques.
- Chargement des données éditoriales JSON versionnées ; génération avant build d'un jeu public ne contenant que les enregistrements validés humainement.
- Validation des huit types d'enregistrements et de leurs références croisées.
- Audit npm et vérification automatisée du paquet PWA.
- Contrôle de typage, tests unitaires, tests simulés du service worker, contrôle des contrastes en thèmes clair et sombre, invariants d'interface, validation des schémas et build dans GitHub Actions.

## Hors périmètre de la version 0.1

- Publication de dossiers factuels : les faits répondant au seuil documentaire de la charte peuvent être publiés sans validation humaine préalable ; les autres dossiers restent exclus jusqu'à ce que leurs preuves soient suffisantes ou qu'un examen humain requis soit effectué.
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
- Les tests d'intégrité, JSON Schema et règles de publication réussissent.
- `npm audit --audit-level=high` ne signale aucune vulnérabilité.
- `node scripts/check-data.mjs` valide les enregistrements et leurs références.
- Le générateur de données publiques n'inclut que les enregistrements ayant passé la règle de publication humaine.
- Les tests vérifient les références du jeu public et l'absence de tout identifiant de dossier exclu dans le bundle de production.
- Le contrôle PWA vérifie les fichiers générés après le build.
- `npm run build` réussit.
- Les six univers s'affichent et sont sélectionnables.
- Le bouton Retour Android et la navigation arrière du navigateur reviennent à l'écran précédent après ouverture d'un dossier ou d'un univers.
- La recherche filtre les titres, descriptions et mots-clés locaux des univers, outils et dossiers publiés.
- L'interface publique est entièrement en français ; les documents sources conservent leur langue originale.
- Le mode sombre est sélectionné par défaut ; l’utilisateur peut choisir le mode clair et l’une des cinq couleurs d’accent (vert, bleu, violet, orange, rose), avec mémorisation locale sur l’appareil.
- Aucune traduction automatique n'est utilisée ; les citations et sources restent dans leur langue originale.
- Les langues futures peuvent être ajoutées sans réécrire l'architecture.
- Les fonctions encore indisponibles sont clairement signalées.
- Le navigateur n'envoie ni recherche, ni préférence à un serveur.
- L'application n'inclut pas de publicités, suivi analytique, compte ni IA générative.
- Le service worker passe les tests automatisés simulés.
- Les contrôles statiques de focus clavier, breakpoints mobiles, réduction des animations et contraste des thèmes clair/sombre réussissent.
- Le service worker et l'utilisation hors ligne sont testés manuellement sur de vrais navigateurs et appareils avant déploiement.

## Ordre de travail

1. Finaliser le squelette et la documentation d'architecture.
2. Exécuter les contrôles automatisés.
3. Corriger les erreurs de typage ou de build.
4. Réaliser une revue des chemins PWA et du service worker.
5. Vérifier manuellement l'interface sur mobile.
6. Demander une revue humaine de la sécurité, de la confidentialité et de l'accessibilité.
7. Préparer un wrapper Android natif et les métadonnées F-Droid, puis construire et tester un APK reproductible.
8. La préversion publique est déjà hébergée sur GitHub Pages ; ne préparer une version stable et une soumission F-Droid qu'après les validations manuelles.

## Risques à suivre

- Les catégories seules ne remplacent pas une base documentaire.
- Les contenus éditoriaux exigent du travail humain continu.
- Les hébergeurs statiques peuvent enregistrer des métadonnées de connexion.
- Une PWA peut avoir des différences de comportement selon les navigateurs.
- Le corpus éditorial contient des brouillons non publiés ; chaque source et affirmation doit être vérifiée par une personne.
- Un wrapper Android de test existe et les APK debug/release non signées ont été compilées en CI ; les tests multi-appareils, la signature et la publication F-Droid restent à réaliser. Une PWA ou un simple wrapper WebView ne suffit pas à lui seul pour une soumission F-Droid.
