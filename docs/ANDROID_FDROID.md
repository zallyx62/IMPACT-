# Préparation Android et F-Droid

## Décision de principe

La priorité reste le Web. L'application actuelle est une PWA statique construite avec React, TypeScript et Vite. Une PWA installable n'est pas à elle seule une application Android publiable sur F-Droid.

L'application Android devra embarquer les ressources Web localement et fonctionner sans serveur applicatif, compte, télémétrie, publicité ou dépendance propriétaire. Le choix final entre une enveloppe Android native légère (WebView) et une solution de pont multiplateforme sera arrêté après un prototype et un test de compilation reproductible. Ne pas ajouter de SDK tant que son utilité, sa licence et son comportement réseau ne sont pas vérifiés.

## Étapes Android

1. Choisir et vérifier un identifiant d'application Android unique.
2. Créer un projet Android source complet, avec les ressources Web générées localement.
3. Définir les permissions minimales : aucune permission réseau si l'application peut fonctionner entièrement sur les ressources embarquées ; ne pas demander d'accès inutile aux contacts, fichiers, localisation ou identifiants.
4. Bloquer la navigation WebView vers des domaines externes dans la vue intégrée ; ouvrir les sources externes dans le navigateur système après action explicite.
5. Vérifier les liens externes, le clavier, le retour Android, les tailles d'écran, les lecteurs d'écran, le thème sombre et le mode hors ligne.
6. Fixer les versions du JDK, du Gradle, du plugin Android et du SDK nécessaires à la compilation.
7. Construire en ligne de commande depuis une copie propre du dépôt et documenter chaque dépendance.
8. Ajouter un job CI Android seulement lorsque le projet natif existe et que le build peut être reproduit.

## Préparation F-Droid

F-Droid exige notamment un logiciel libre, des dépendances et outils de compilation acceptables, un dépôt public avec le vrai code source, des métadonnées complètes et une application utile et maintenue. Un simple site web emballé sans amélioration native peut ne pas répondre à ses critères.

Avant soumission :
- vérifier les licences de toutes les dépendances et ressources ;
- supprimer toute dépendance propriétaire, publicité, analyse d'audience ou SDK de suivi ;
- fournir un identifiant Android unique et un numéro de version ;
- publier une version taguée et ses instructions de compilation ;
- fournir les métadonnées et captures d'écran requises ;
- préparer et tester la recette de compilation F-Droid ;
- comparer le binaire amont et le binaire reconstruit, et viser la reproductibilité ;
- demander une revue de conformité avant la soumission.

Références officielles :
- Politique d'inclusion : https://f-droid.org/fr/docs/Inclusion_Policy/
- Guide de soumission : https://f-droid.org/docs/Submitting_to_F-Droid_Quick_Start_Guide/
- Compilation reproductible : https://f-droid.org/docs/Reproducible_Builds/

## État actuel et limites

- PWA : prototype Web présent, contrôles automatisés réussis dans GitHub Actions.
- Android : aucun projet natif, APK ou paquet signé n'est encore livré.
- F-Droid : aucune métadonnée de soumission ni demande d'inclusion n'est encore prête.
- Les tests actuels du service worker sont simulés ; ils ne remplacent pas les essais sur appareils réels.

Aucune publication Android ou F-Droid ne doit être annoncée avant la compilation, l'installation et les tests réels.
