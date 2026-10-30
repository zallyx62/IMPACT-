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
- **État du dépôt vérifié le 30 octobre 2026 :** la branche `main` est actuellement signalée comme non protégée par l'API GitHub (`protected: false`) et aucun ruleset n'est listé. La connexion utilisée pour cet audit ne permet pas de modifier les paramètres d'administration ; cette protection doit donc être activée manuellement par le propriétaire.
- L'état de Secret Scanning, de Push Protection, des alertes Dependabot et du signalement privé n'a pas pu être confirmé par cette connexion. Une recherche du code indexé sur la branche `main` n'a trouvé aucune occurrence des motifs courants `BEGIN PRIVATE KEY`, `ghp_`, `AKIA`, `password =` et `secret =` ; cela ne remplace pas Secret Scanning et ne couvre pas l'historique complet.

## Réglages GitHub à activer manuellement

Dans **Settings → Branches**, protéger `main` avec les règles suivantes :
- interdire la suppression de la branche et les force-push ;
- demander une Pull Request pour intégrer les changements ;
- exiger les contrôles `Quality checks` et `Analyze Java, JavaScript, TypeScript and GitHub Actions` (CodeQL). Le workflow `IMPACT checks` a été ajusté pour s'exécuter sur toutes les Pull Requests vers `main`, y compris les modifications de documentation ;
- ne pas exiger d'approbation humaine obligatoire tant qu'il n'existe pas de second mainteneur disponible, afin de ne pas bloquer le propriétaire seul.

Dans **Settings → Advanced Security**, vérifier et activer si disponibles :
- Dependabot alerts et Dependabot security updates ;
- Secret scanning et Push protection ;
- Code scanning / CodeQL (le workflow CodeQL est déjà présent dans le dépôt).

Dans **Settings → Security → Code security and analysis**, activer le signalement privé des vulnérabilités si cette option est proposée. Le guide [SECURITY.md](../SECURITY.md) fournit déjà la procédure de signalement.

## Procédure

Toute alerte doit être examinée avant fusion. Ne pas ignorer une alerte uniquement parce qu'un test de compilation réussit. Les corrections de dépendances doivent mettre à jour le fichier lock et relancer l'ensemble du workflow.
