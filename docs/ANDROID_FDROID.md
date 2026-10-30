# Préparation Android et F-Droid

## Projet Android ajouté

Un premier projet Android source est présent dans `android/`. Il embarque le build de production du Web dans l'APK ; il ne charge pas le site IMPACT depuis un serveur distant.

- Identifiant provisoire : `org.zallyx62.impact` (à vérifier avant une vraie publication).
- Version de départ : `0.1.0`, code version `1`.
- JDK : 17.
- Android Gradle Plugin : 9.5.0.
- Gradle CI : 9.6.0.
- Android SDK : compile / target 36, minimum 24.
- AndroidX WebKit : 1.18.0.
- Build Web embarqué : `android/scripts/build-web-assets.sh`, copié dans les assets de l’APK et servi à l’origine locale `/impact/`.
- CI : `.github/workflows/android.yml`, qui prépare les ressources puis tente les APK debug et release.

Le projet ne contient pas encore de Gradle Wrapper ; la CI installe explicitement Gradle 9.6.0. La release générée par Gradle est non signée. Aucun APK signé ni paquet de distribution n'est livré.

## Sécurité et confidentialité Android

- Le manifeste ne déclare aucune permission, notamment aucune permission `INTERNET`.
- Les ressources locales sont servies avec AndroidX `WebViewAssetLoader`, sous une origine HTTPS locale ; aucun chargement depuis `file://`.
- L'accès WebView aux fichiers et aux fournisseurs de contenu est désactivé.
- Les liens HTTP/HTTPS ne sont pas ouverts dans la WebView : une action explicite les transmet au navigateur du système.
- Le stockage DOM est activé uniquement pour les préférences d'apparence (thème clair/sombre et couleur d'accent), conservées localement par la WebView.
- Aucun compte, tracker, publicité, télémétrie ni API applicative distante n'est intégré.

La documentation Android recommande `WebViewAssetLoader` plutôt que les URL `file://`, et déconseille d'activer les accès fichier depuis une WebView. Ces précautions sont appliquées ici.

## Vérifications encore obligatoires

Le code source et la compilation automatisée ne remplacent pas :
- un premier test manuel d'installation et d'utilisation de base du debug APK sur un téléphone Android réel a été rapporté comme réussi par le propriétaire le 30 octobre 2026 ; ce test unique ne garantit pas la compatibilité générale ;
- des tests complémentaires sur plusieurs appareils et versions Android, notamment retour Android, liens externes, clavier, rotation et reprise après fermeture ;
- la vérification du thème clair/sombre après relancement ;
- le contrôle TalkBack, contraste, tailles d'écran et mode avion ;
- une revue indépendante du comportement de la WebView et des permissions ;
- la construction reproductible et la vérification d'un APK release non signé puis signé dans une procédure séparée.

Ne pas annoncer Android comme stable avant ces essais. Ne pas publier de binaire signé dans le dépôt.

## Conditions F-Droid

La PWA et un simple emballage WebView ne suffisent pas à garantir l'acceptation. La politique d'inclusion F-Droid demande notamment que les applications qui emballent un site apportent des fonctions ou améliorations natives, qu'elles soient utiles et maintenues, et que la construction soit vérifiable avec une chaîne d'outils libre. Elle prévoit normalement au moins trois mois de développement actif, sauf exceptions (par exemple des utilisateurs déjà établis ou une expérience antérieure de publication F-Droid).

Le dépôt public IMPACT date du 29 octobre 2026. Sans preuve d'un développement public plus ancien ni exception, le critère de trois mois ne serait normalement atteint qu'à partir du 29 janvier 2027, sous réserve de poursuivre le développement. Cette date n'est pas une garantie d'acceptation : les mainteneurs F-Droid restent seuls décisionnaires.

Avant une demande d'inclusion :
- confirmer l'identifiant d'application et les droits sur les ressources ;
- vérifier la licence de chaque dépendance et de chaque outil de compilation ;
- développer des améliorations Android utiles au-delà de l'affichage Web ;
- compléter les tests d'appareils et l'audit de sécurité ;
- documenter une compilation hors ligne ou reproductible et vérifier le binaire obtenu ;
- préparer les métadonnées, descriptions, captures d'écran, notes de version et recette de compilation ;
- vérifier les exigences et versions de la politique au moment de la soumission.

Aucune soumission F-Droid n'a été faite et aucun APK n'est déclaré prêt à distribuer.

## Références officielles

- Politique d'inclusion F-Droid : https://f-droid.org/docs/Inclusion_Policy/
- Guide de soumission F-Droid : https://f-droid.org/docs/Submitting_to_F-Droid_Quick_Start_Guide/
- Builds reproductibles F-Droid : https://f-droid.org/docs/Reproducible_Builds/
- Android — charger du contenu local : https://developer.android.com/develop/ui/views/layout/webapps/load-local-content
- Android — inclusion de fichiers non sécurisée dans les WebView : https://developer.android.com/privacy-and-security/risks/webview-unsafe-file-inclusion
- Android Gradle Plugin — versions et compatibilité : https://developer.android.com/build/releases/about-agp
- AndroidX WebKit — notes de version : https://developer.android.com/jetpack/androidx/releases/webkit
