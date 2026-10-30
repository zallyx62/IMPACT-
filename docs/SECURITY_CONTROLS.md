# Contrôles de sécurité automatisés

## Contrôles actifs

- `npm audit --audit-level=high` dans le workflow de qualité.
- TypeScript, tests unitaires, tests du service worker et validation des données.
- Analyse CodeQL planifiée et déclenchée sur les changements de `main` et les pull requests.
- Dependabot surveille chaque semaine les dépendances npm de `app/` et les actions GitHub.
- Les workflows utilisent des permissions minimales au niveau global et n'accordent `security-events: write` qu'au job CodeQL.

## Portée et limites

- Un résultat CodeQL propre ne prouve pas l'absence de vulnérabilité.
- `npm audit` couvre les vulnérabilités connues des dépendances publiées dans les avis npm ; il ne remplace pas une analyse de code ni une revue manuelle.
- Les contrôles actuels ne testent pas l'application sur des appareils physiques.
- Aucun test d'intrusion indépendant n'a été réalisé.
- **État du dépôt vérifié le 30 octobre 2026 à 12:55 :** le ruleset de dépôt `Protection de main` (ID `26202059`) est actif. Sa cible `~DEFAULT_BRANCH` désigne la branche par défaut du dépôt, actuellement `main`. L'interdiction de suppression est active. La règle `Block force pushes` n'apparaît pas dans la configuration enregistrée et doit être réactivée. Le passage par Pull Request est obligatoire, sans approbation humaine imposée (seuil de zéro). L'exigence de contrôles de statut est activée, mais le second contrôle a été enregistré avec le texte supplémentaire `Ne sélectionne` : il faut le remplacer par le nom exact `Analyze Java, JavaScript, TypeScript and GitHub Actions`. `Quality checks` est correctement enregistré.
- La règle classique de protection de branche peut afficher un état différent : les rulesets sont un mécanisme distinct. L'état de Secret Scanning, de Push Protection, des alertes Dependabot et du signalement privé n'a pas été confirmé par cette vérification.
- Une recherche du code indexé sur `main` n'a pas trouvé les motifs courants `BEGIN PRIVATE KEY`, `ghp_`, `AKIA`, `password =` et `secret =` ; cela ne remplace pas Secret Scanning et ne couvre pas l'historique complet.

## Réglages GitHub à terminer

Ouvrir le [ruleset Protection de main](https://github.com/zallyx62/IMPACT-/rules/26202059) dans GitHub (au besoin, activer l'affichage « version pour ordinateur » sur mobile).

La configuration actuellement enregistrée est :
- cibler la branche par défaut (actuellement `main`) ;
- interdire la suppression de la branche ;
- réactiver `Block force pushes` ;
- demander une Pull Request pour intégrer les changements ;
- ne pas exiger d'approbation humaine obligatoire tant qu'il n'existe pas de second mainteneur disponible ;
- conserver `Quality checks` et corriger le second contrôle pour qu'il soit exactement `Analyze Java, JavaScript, TypeScript and GitHub Actions` (CodeQL).

Le workflow `IMPACT checks` s'exécute sur toutes les Pull Requests vers `main`, y compris les modifications de documentation.

Dans **Settings → Advanced Security**, vérifier et activer si disponibles :
- Dependabot alerts et Dependabot security updates ;
- Secret scanning et Push protection ;
- Code scanning / CodeQL (le workflow CodeQL est déjà présent dans le dépôt).

Dans **Settings → Security → Code security and analysis**, activer le signalement privé des vulnérabilités si cette option est proposée. Le guide [SECURITY.md](../SECURITY.md) fournit déjà la procédure de signalement.

## Procédure

Toute alerte doit être examinée avant fusion. Ne pas ignorer une alerte uniquement parce qu'un test de compilation réussit. Les corrections de dépendances doivent mettre à jour le fichier lock et relancer l'ensemble du workflow.
