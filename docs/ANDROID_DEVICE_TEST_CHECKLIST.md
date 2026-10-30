# Essais manuels Android — IMPACT 0.1

**État :** protocole préparé ; les cases ne sont pas considérées comme réussies tant qu'un test réel n'a pas été effectué et consigné.

## Préparation

- [ ] Télécharger l'artefact `impact-android-debug-apk` depuis la dernière exécution réussie du workflow Android.
- [ ] Vérifier que le fichier s'appelle `app-debug.apk` et qu'il provient bien du dépôt officiel `zallyx62/IMPACT-`.
- [ ] Installer l'APK debug sur un appareil de test Android.
- [ ] Noter le modèle de l'appareil, la version Android, la date et le commit testé.
- [ ] Ne pas utiliser l'APK release non signée comme application distribuable.

## Navigation et affichage

- [ ] L'application démarre sans écran blanc ni fermeture inattendue.
- [ ] L'accueil, les six univers et les outils s'affichent correctement.
- [ ] Le défilement fonctionne en portrait et en paysage.
- [ ] Le bouton Retour Android revient à l'écran précédent ; depuis l'accueil, il quitte normalement l'application.
- [ ] Les liens vers des sites externes s'ouvrent dans le navigateur système, jamais dans la WebView intégrée.
- [ ] Les liens internes et les ancres de méthode fonctionnent.

## Préférences et accessibilité

- [ ] Le thème sombre s'affiche au premier lancement.
- [ ] Le changement vers le thème clair est immédiat.
- [ ] Les cinq couleurs d'accent sont lisibles en thèmes clair et sombre.
- [ ] Après fermeture complète et redémarrage, les préférences locales sont conservées.
- [ ] Le clavier virtuel ne masque pas durablement le champ de recherche.
- [ ] Les libellés et commandes restent utilisables avec TalkBack et les tailles de police agrandies.

## Confidentialité et fonctionnement hors ligne

- [ ] Aucune permission Android n'est demandée pendant l'installation.
- [ ] Les fonctions locales restent utilisables en mode avion après installation.
- [ ] La recherche n'envoie pas de requête réseau.
- [ ] Les liens externes ne sont ouverts que lorsque l'utilisateur les active.
- [ ] Aucun dossier éditorial en brouillon ou non validé n'apparaît dans l'application.

## Reprise et stabilité

- [ ] Mettre l'application en arrière-plan puis la reprendre.
- [ ] Verrouiller/déverrouiller l'appareil puis reprendre l'application.
- [ ] Faire pivoter l'écran plusieurs fois.
- [ ] Fermer l'application depuis le sélecteur Android puis la relancer.
- [ ] Vérifier qu'aucun plantage ni perte inattendue de préférence ne survient.

## Compte rendu

Consigner les résultats dans une issue ou une pull request sans publier d'identifiants personnels :

- Appareil et version Android :
- Version / commit :
- Date du test :
- Tests réussis :
- Tests échoués :
- Étapes pour reproduire chaque anomalie :
- Captures d'écran sans données personnelles, si utiles :

Un seul appareil ne suffit pas à démontrer une compatibilité Android générale. Les tests doivent être répétés sur plusieurs versions et tailles d'écran avant toute version stable.
