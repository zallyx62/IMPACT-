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
- Les règles de protection de branche, la configuration de secret scanning et les options de sécurité du compte GitHub doivent être vérifiées dans les paramètres du dépôt ; le code du dépôt ne peut pas prouver qu'elles sont activées.

## Procédure

Toute alerte doit être examinée avant fusion. Ne pas ignorer une alerte uniquement parce qu'un test de compilation réussit. Les corrections de dépendances doivent mettre à jour le fichier lock et relancer l'ensemble du workflow.
