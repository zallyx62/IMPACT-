# Alternatives et historique éditorial

## Alternatives documentées

Une relation `alternative_to` est orientée ainsi :

- `from_entity_id` : entité proposée comme alternative ;
- `to_entity_id` : produit, marque ou service auquel elle peut se substituer.

La relation n'est visible que si les deux entités disposent d'un dossier publié, si le lien est confirmé ou partiellement documenté et si au moins une source associée est publiée.

Chaque relation doit préciser dans `notes` (au moins 30 caractères) :
- l'usage auquel l'alternative répond ;
- le critère concret de substitution (fonction, composition, service rendu, disponibilité, etc.) ;
- le périmètre géographique et les éventuelles conditions d'accès ;
- les limites connues et les éléments qui ne sont pas comparés.

Une alternative fonctionnelle n'est pas automatiquement meilleure sur le plan environnemental, social, sanitaire ou animal. IMPACT ne doit pas employer de qualificatif global (« meilleure », « responsable », « écologique ») sans comparaison indépendante, critères explicites et données suffisamment comparables. Aucun lien commercial, classement sponsorisé ou rémunération ne doit influencer l'ordre d'affichage.

Les relations contestées ou inconnues ne sont pas présentées comme des alternatives recommandées. Si aucune relation ne satisfait les critères, l'outil affiche explicitement qu'aucune alternative n'est actuellement documentée.

## Historique éditorial

Les éléments de la chronologie sont issus des dates réellement présentes dans les dossiers : publication d'un dossier ou d'un constat, examen, réponse, annonce ou échéance d'un engagement.

Une entrée de la collection `data/records/changes/` sert à consigner une évolution éditoriale durable :
- `event_date` : date de l'événement ou de la correction ;
- `event_type` : correction, nouvelle preuve, changement de périmètre, changement de statut, réparation ou autre évolution ;
- `title` et `summary` : description précise de ce qui a changé et pourquoi ;
- `source_ids` : au moins une source consultable ;
- `claim_ids` : constats concernés, lorsqu'ils sont identifiables ;
- `reviewed_at` : date de l'examen éditorial.

Les entrées sans examen ou dont les sources ne sont pas publiables restent absentes du paquet public. Une correction doit expliquer si elle modifie le fond, le périmètre, la formulation ou le statut d'un constat. Il ne faut jamais déduire automatiquement une correction d'une différence de fichier.

La chronologie n'est pas présentée comme exhaustive : l'absence d'une entrée ne prouve pas qu'aucune évolution n'a eu lieu. Les anciennes versions, les dates de publication et les sources doivent être conservées lorsque cela est possible.

## Échéances des engagements

L'état éditorial d'un engagement n'est jamais modifié automatiquement. L'interface peut afficher « échéance dépassée » lorsque la date cible est passée et que l'état reste « annoncé » ou « en cours ». Seul un nouvel examen appuyé par des éléments probants peut faire évoluer l'état vers « atteint », « non atteint », « abandonné » ou « impossible à évaluer ».
