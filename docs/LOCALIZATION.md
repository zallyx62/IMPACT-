# Langues et stratégie de traduction — IMPACT

## Ordre des langues

1. Français (`fr`) — langue principale et langue par défaut.
2. Anglais (`en`) — deuxième langue, sélectionnable dans l'interface.
3. Espagnol (`es`), allemand (`de`) et autres langues — ajout progressif après traduction et relecture.

Le sélecteur actuel permet de choisir explicitement Français ou English. Le français est la valeur initiale à chaque nouvelle session ; le choix reste en mémoire et n'est pas transmis ni enregistré à distance.

## Règles d'architecture

- Utiliser des codes de langue standard et une union TypeScript `Language` extensible.
- Centraliser les libellés de l'interface par langue ; ne pas disperser les textes traduits dans les composants.
- Le français est la langue source de rédaction du produit.
- Une traduction éditoriale doit être relue par une personne avant publication.
- Ne pas utiliser de traduction automatique dans l'application publique.
- Ne jamais traduire les citations, titres de documents ou extraits comme s'il s'agissait du texte original.
- Conserver la langue originale de chaque source et l'afficher dans la fiche.
- Si une traduction humaine d'un contenu n'existe pas, afficher clairement la langue originale plutôt que prétendre que le contenu est traduit.
- Les traductions doivent conserver les nuances juridiques, les limites méthodologiques, les statuts et les dates de la version française.
- Une correction du contenu source doit déclencher une vérification des traductions liées.

## Ajout d'une langue

Pour ajouter une langue :
1. Ajouter son code au type `Language`.
2. Ajouter les libellés de navigation, formulaires, messages d'erreur et états vides.
3. Traduire les contenus éditoriaux qui ont été validés.
4. Faire relire les traductions, notamment les formulations juridiques et scientifiques.
5. Ajouter des tests garantissant que chaque clé requise existe.
6. Vérifier les textes longs sur petits écrans et avec lecteur d'écran.

Une langue ne doit pas être annoncée comme disponible tant que l'interface et les contenus présentés ne sont pas effectivement traduits.

## État actuel

- Français : interface disponible, langue par défaut.
- Anglais : interface disponible, sélection explicite.
- Espagnol, allemand et autres : prévus, pas encore disponibles.
- Les dossiers Nestlé sont des brouillons éditoriaux non publiés ; leurs traductions anglaises devront être relues avant toute publication.
