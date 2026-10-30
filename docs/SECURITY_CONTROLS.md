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
- **État du dépôt vérifié le 30 octobre 2026 :** la branche `main` est protégée par le ruleset de dépôt actif `Protection de main`, ciblant la branche par défaut. Le ruleset impose une Pull Request, les contrôles `Quality checks` et `Analyze Java, JavaScript, TypeScript and GitHub Actions` (CodeQL), interdit la suppression et les mises à jour non fast-forward (force-push). Aucune approbation humaine obligatoire n'est configurée ; la validation éditoriale humaine reste néanmoins obligatoire avant publication des dossiers.
- L'état de Secret Scanning, de Push Protection, des alertes Dependabot et du signalement privé n'a pas pu être confirmé par cette connexion. Une recherche du code indexé sur la branche `main` n'a trouvé aucune occurrence des motifs courants `BEGIN PRIVATE KEY`, `ghp_`, `AKIA`, `password =` et `secret =` ; cela ne remplace pas Secret Scanning et ne couvre pas l'historique complet.

## Réglages GitHub — état actuel

La protection de `main` est déjà active via le ruleset `Protection de main`. Aucune action supplémentaire n'est nécessaire pour activer les protections de base.

Le ruleset impose :
- une Pull Request avant fusion ;
- les contrôles `Quality checks` et `Analyze Java, JavaScript, TypeScript and GitHub Actions` ;
- le blocage des suppressions de `main` ;
- le blocage des force-push et mises à jour non fast-forward.

Le nombre d'approbations humaines obligatoires est actuellement de zéro, afin de ne pas bloquer le propriétaire seul. Cela ne dispense pas de la relecture humaine des affirmations éditoriales avant toute publication.

Le workflow `Android debug and release builds` est également déclenché pour les Pull Requests qui modifient l'application, le wrapper Android, les données éditoriales ou le générateur public. Il n'est pas encore un contrôle obligatoire du ruleset ; il est recommandé de l'ajouter aux contrôles requis lorsque son contexte apparaît dans la liste GitHub.

Dans **Settings → Advanced Security**, vérifier et activer si disponibles :
- Dependabot alerts et Dependabot security updates ;
- Secret scanning et Push protection ;
- Code scanning / CodeQL (le workflow CodeQL est déjà présent dans le dépôt).

Dans **Settings → Security → Code security and analysis**, vérifier le signalement privé des vulnérabilités si cette option est proposée. Le guide [SECURITY.md](../SECURITY.md) fournit déjà la procédure de signalement.

## Procédure

Toute alerte doit être examinée avant fusion. Ne pas ignorer une alerte uniquement parce qu'un test de compilation réussit. Les corrections de dépendances doivent mettre à jour le fichier lock et relancer l'ensemble du workflow.
