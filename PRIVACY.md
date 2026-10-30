# Politique de confidentialité — IMPACT

**Version :** 0.1  
**Périmètre :** prototype web actuel.

IMPACT est conçu pour être consulté sans compte, sans profil publicitaire et sans suivi comportemental.

## Ce que fait le prototype actuel

- La recherche filtre uniquement les textes et mots-clés embarqués dans l'application.
- Le texte recherché n'est pas envoyé à un serveur et n'est pas conservé après fermeture de la page.
- La langue sélectionnée reste en mémoire pendant la session ; elle n'est pas enregistrée dans un profil.
- Le thème clair ou sombre et la couleur d’accent choisis sont enregistrés uniquement dans le stockage local du navigateur sous les clés `impact-theme` et `impact-accent` afin de conserver ces préférences sur l’appareil ; ces valeurs ne sont jamais transmises à IMPACT.
- Aucun outil d'analyse d'audience, tracker publicitaire ou SDK tiers n'est intégré.
- Aucune API distante n'est nécessaire pour afficher les univers et les outils de démonstration.
- Le service worker met en cache des ressources statiques pour amorcer le fonctionnement hors ligne.

## Ce que le projet ne peut pas promettre

Lorsqu'un site est hébergé publiquement, l'infrastructure d'hébergement et les intermédiaires réseau peuvent traiter certaines métadonnées techniques, par exemple l'adresse IP, l'heure de la requête, l'URL demandée et des informations techniques du navigateur. IMPACT ne contrôle pas tous ces traitements.

La promesse du projet est de réduire les transmissions, de ne pas mettre en place de collecte volontaire ou de profilage côté application, et d'expliquer les limites plutôt que de promettre une invisibilité réseau absolue.

## Données locales et hors ligne

Le prototype n'utilise aucun cookie applicatif, stockage local de recherche ni IndexedDB. Les seuls éléments de préférence conservés dans le stockage local sont le thème clair ou sombre et la couleur d’accent choisis par la personne, sur son propre appareil. Le cache du service worker contient les ressources de l'application et peut être supprimé depuis les réglages du navigateur.

Le premier chargement nécessite une connexion. La disponibilité hors ligne doit être testée sur les appareils et navigateurs ciblés avant toute version stable. Les futurs dossiers de données ne seront pas automatiquement disponibles hors ligne s'ils n'ont pas été inclus dans le cache.

## Évolutions futures

Avant d'ajouter une fonctionnalité qui transmet des données ou conserve des préférences, le projet devra documenter :
- quelles données sont nécessaires ;
- où elles sont traitées et stockées ;
- qui peut y accéder ;
- comment les supprimer ;
- pourquoi le traitement est nécessaire ;
- quelles solutions hors ligne ou locales sont possibles.

Aucune télémétrie ni publicité ne doit être ajoutée. Toute exception technique devra être examinée publiquement avant d'être intégrée.

## Contributions et signalements

Ne publiez pas dans les issues publiques de données personnelles, d'adresses privées, de mots de passe, de clés d'accès ou de documents confidentiels. Les informations de sécurité ne doivent pas être diffusées publiquement avant qu'une correction soit possible.

## État

Cette politique décrit le code du prototype à ce stade. Elle ne constitue pas un audit indépendant de l'hébergement ou du navigateur. Elle devra être révisée avec les futures fonctionnalités et après une revue humaine.
