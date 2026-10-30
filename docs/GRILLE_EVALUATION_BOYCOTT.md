# Grille d'évaluation des dossiers et des boycotts

Cette grille s'applique à toute entité documentée dans IMPACT : entreprise, marque, produit, organisation ou institution. Elle ne constitue pas un classement moral définitif.

## Trois évaluations séparées

1. **Gravité documentée** : gravité des impacts établis dans le périmètre du dossier.
2. **Priorité du boycott** : force avec laquelle les preuves disponibles justifient d'envisager cette action comme levier citoyen.
3. **Solidité des éléments** : qualité, indépendance, convergence et limites des preuves.

Une gravité élevée ne produit donc pas automatiquement une priorité de boycott élevée. Il faut aussi examiner le lien avec l'entité, le périmètre des produits ou activités concernés, les alternatives disponibles, l'efficacité plausible du levier et les mesures correctives.

## Échelles communes

### Gravité documentée
- **Critique** : dommages très graves et étendus établis par des preuves robustes.
- **Élevée** : dommages sérieux ou manquements majeurs établis.
- **Modérée** : impacts réels mais plus limités, circonscrits ou moins graves.
- **Faible** : effets limités établis.
- **Insuffisamment documentée** : impossible de qualifier la gravité à partir des éléments publiés.

### Priorité du boycott
- **Cas solide** : éléments robustes, problème grave et persistant, lien clair avec l'entité et levier d'action raisonnablement pertinent.
- **À envisager** : motifs sérieux documentés, mais portée, efficacité, alternatives ou mesures correctives nécessitent encore une appréciation.
- **À surveiller** : signaux ou problèmes limités ; le suivi et la collecte de preuves priment.
- **Non établie** : les éléments disponibles ne justifient pas de recommander ou de prioriser un boycott.

### Solidité des éléments
- **Élevée** : plusieurs sources fiables et indépendantes convergent, avec méthode et périmètre transparents.
- **Modérée** : preuves sérieuses mais dépendance à certaines sources, lacunes ou limites notables.
- **Limitée** : sources peu nombreuses, indirectes, contestées ou encore incomplètes.

## Critères à documenter pour chaque dossier

- Nature et gravité des impacts.
- Qualité, indépendance et convergence des sources.
- Ampleur, localisation, période et activités concernées.
- Récence et persistance des faits.
- Réponses de l'entité, corrections et réparations vérifiables.
- Lien causal ou opérationnel entre l'entité et les faits.
- Possibilité d'agir de façon ciblée (produit, filiale, activité ou groupe).
- Alternatives accessibles et risques de conséquences indirectes.
- Efficacité plausible du boycott comme levier, sans la présenter comme certaine.

## Règles de publication

- Aucun score automatique ne transforme des accusations en faits.
- Les affirmations non vérifiées ne soutiennent pas le niveau final.
- Une réponse d'entreprise est présentée loyalement, sans être considérée comme preuve à elle seule.
- Les chiffres gardent leur dénominateur, leur période et leur méthode.
- Les limites et éléments allant à l'encontre de la conclusion sont visibles dans le résumé.
- Chaque motif renvoie vers les constats, sources et réponses détaillés.
- Le résumé est masqué si une affirmation qu'il cite n'est plus publiée.
- Toute évaluation est datée et réexaminée lors d'une mise à jour substantielle.
- La priorité du boycott est une appréciation éditoriale argumentée, pas une injonction adressée au public.

## Modèle pour un nouveau dossier

Créer une entrée dans `app/src/data/dossier-summary.ts` en renseignant le niveau de gravité, la priorité du boycott, la solidité des preuves, les critères d'évaluation, les motifs courts et leurs identifiants de constats publiés. Réutiliser la même interface et la même présentation pour toutes les entités.
