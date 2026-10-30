# Mises à jour Android — IMPACT

## Décision

La distribution principale Android visée est F-Droid. Les mises à jour doivent rester sous le contrôle du gestionnaire de confiance utilisé pour installer l'application.

| Besoin | Solution retenue |
|---|---|
| Mise à jour automatique | Le client F-Droid vérifie les dépôts et propose/télécharge les mises à jour selon ses réglages. |
| Mise à jour manuelle | L'utilisateur ouvre F-Droid, actualise/recherche les mises à jour et choisit d'installer IMPACT. |
| APK téléchargée directement | Canal distinct éventuel, clairement identifié et activé volontairement ; jamais activé par défaut. |

## Pourquoi IMPACT ne s'auto-installe pas

Android n'autorise pas une application ordinaire à remplacer silencieusement son propre APK. Une installation déclenchée par l'application passe par le mécanisme d'installation Android et demande une action explicite de l'utilisateur, sauf cas particuliers gérés par le système.

La politique F-Droid exige en outre un consentement explicite, volontaire et compréhensible avant le téléchargement d'exécutables qui contourneraient les contrôles de F-Droid. Un auto-updater intégré et activé par défaut serait donc contraire à la voie de distribution retenue et nuirait à la confiance apportée par les builds vérifiés.

Le manifeste Android conserve donc, à ce stade : aucune permission Internet, aucune permission d'installation de paquets et aucun téléchargement d'APK depuis l'application.

## Cycle de publication

1. Mettre à jour les sources et les tests.
2. Incrémenter versionCode et mettre à jour versionName dans android/app/build.gradle.kts.
3. Lancer les contrôles Web et Android sur une copie propre du dépôt.
4. Vérifier le build debug sur un appareil réel.
5. Vérifier la compilation release et la reproductibilité.
6. Créer un tag de version correspondant au code publié.
7. Laisser F-Droid détecter et construire la nouvelle version après configuration des métadonnées.
8. Vérifier dans le client F-Droid que la mise à jour est proposée.

Le code de version doit toujours augmenter. La clé de signature doit être conservée et protégée ; un changement de clé après publication peut empêcher les mises à jour transparentes.

## Limites actuelles

- IMPACT n'est pas encore publié sur F-Droid.
- Aucun dépôt F-Droid officiel ni URL de fiche n'existe encore.
- Les mises à jour automatiques et manuelles ne peuvent donc pas être activées pour les utilisateurs à ce stade.
- La CI actuelle produit un APK debug de test et un APK release non signé ; ce n'est pas un canal de distribution.

## Références

- [Politique d'inclusion F-Droid](https://f-droid.org/docs/Inclusion_Policy/)
- [Guide de soumission F-Droid](https://f-droid.org/docs/Submitting_to_F-Droid_Quick_Start_Guide/)
- [Traitement des mises à jour F-Droid](https://f-droid.org/en/docs/Update_Processing/)
- [API Android PackageInstaller](https://developer.android.com/reference/android/content/pm/PackageInstaller)
