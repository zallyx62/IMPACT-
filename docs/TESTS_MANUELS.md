# Checklist de tests manuels — IMPACT

**Objectif :** compléter les contrôles automatisés par des essais réels avant toute publication publique.
**Règle :** ne pas cocher un test sur la seule base d'une simulation ou d'un build réussi.

## 1. Environnement à consigner

Pour chaque session, noter :

- Date et heure :
- Version / commit testé :
- Appareil et modèle :
- Système et version :
- Navigateur et version :
- Taille d'écran / orientation :
- Réseau utilisé :
- Résultat global : non testé / réussi / échoué / bloqué

## 2. Navigation et affichage

- [ ] L'accueil s'affiche sans erreur.
- [ ] Les six univers s'ouvrent et le bouton de retour fonctionne.
- [ ] Les outils s'ouvrent et leur statut « en préparation » est compréhensible.
- [ ] La recherche trouve les univers et les outils.
- [ ] La recherche vide ou sans résultat reste compréhensible.
- [ ] Le bouton de changement de langue modifie l'interface et la langue du document.
- [ ] L’anglais est la langue affichée lors d’une première visite.
- [ ] Le sélecteur de thème permet de passer du mode clair au mode sombre et inversement.
- [ ] Le fond de page, les cartes, les panneaux, les champs et les fiches changent réellement de thème.
- [ ] Le choix du thème reste appliqué après rechargement et n’est stocké que localement sur l’appareil.
- [ ] Le mode sombre reste lisible avec le contraste, le focus clavier et les lecteurs d’écran.
- [ ] Les liens externes s'ouvrent correctement.
- [ ] Aucun texte n'est coupé à 320 px, 360 px, 390 px et sur tablette.
- [ ] Le défilement horizontal involontaire est absent.

## 3. Accessibilité

- [ ] Navigation complète au clavier : Tab, Maj+Tab et Entrée.
- [ ] Le lien « Aller au contenu » est visible au focus et fonctionne.
- [ ] Le focus clavier reste clairement visible.
- [ ] Les lecteurs d'écran annoncent les titres, champs, boutons et résultats de manière compréhensible.
- [ ] Les lettres et symboles décoratifs ne sont pas annoncés comme des informations.
- [ ] Les tailles de texte restent lisibles avec le zoom système.
- [ ] Le thème sombre reste lisible.
- [ ] La réduction des animations système est respectée.

## 4. PWA et fonctionnement hors ligne

À effectuer sur un navigateur prenant en charge l'installation PWA :

- [ ] Le navigateur propose l'installation ou l'ajout à l'écran d'accueil.
- [ ] Le nom et l'icône affichés sont corrects.
- [ ] L'application installée démarre.
- [ ] Après un premier chargement complet en ligne, activer le mode avion.
- [ ] Recharger l'application : l'écran d'accueil reste accessible.
- [ ] Naviguer entre les sections déjà intégrées : aucun écran blanc.
- [ ] La recherche locale fonctionne hors ligne.
- [ ] Après reconnexion, recharger l'application et vérifier qu'elle fonctionne toujours.
- [ ] Une mise à jour du service worker ne laisse pas une ancienne interface incohérente.

**Limite connue :** les sources externes ne sont pas garanties hors ligne. L'application doit rester claire lorsque ces liens ne sont pas accessibles.

## 5. Confidentialité et réseau

Avec les outils réseau du navigateur, si disponibles :

- [ ] Aucun compte, cookie de suivi ou identifiant publicitaire n'est créé par l'application.
- [ ] Une recherche saisie n'est envoyée à aucun serveur.
- [ ] Aucun appel vers un service d'analyse d'audience ou de télémétrie n'est émis.
- [ ] Aucun contenu distant non nécessaire n'est chargé.
- [ ] Les liens externes ne transmettent pas l'URL de la page IMPACT comme référent.
- [ ] Les données éditoriales chargées sont bien celles incluses dans la version testée.

Les journaux techniques de l'hébergeur peuvent exister indépendamment du code de l'application ; ce point doit être évalué lors du choix de l'hébergement.

## 6. Anomalies

Pour chaque anomalie, consigner :

- Étapes exactes pour la reproduire :
- Résultat attendu :
- Résultat observé :
- Appareil / navigateur :
- Capture ou vidéo, si possible :
- Gravité : bloquante / majeure / mineure

## 7. Décision avant publication

La publication doit rester bloquée tant que :

- un test essentiel est en échec ;
- le fonctionnement hors ligne n'a pas été essayé sur au moins un appareil réel ;
- les parcours clavier et lecteur d'écran n'ont pas été examinés ;
- les affirmations de confidentialité n'ont pas été confrontées au trafic réseau réel ;
- la revue humaine de sécurité, d'accessibilité et de politique éditoriale n'a pas été réalisée.

**Ne pas remplacer « non testé » par « réussi ».**
