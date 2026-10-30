# Données éditoriales

Les enregistrements réels seront ajoutés ici, séparés par type :

- `entities/` : organisations, marques, produits et services ;
- `sources/` : documents et ressources consultés ;
- `claims/` : affirmations documentées ;
- `evidence/` : éléments précis extraits des sources ;
- `relationships/` : liens qualifiés entre entités ;
- `campaigns/` : campagnes publiques ;
- `responses/` : réponses des entités ;
- `commitments/` : engagements et résultats mesurés.

Chaque enregistrement doit être un fichier JSON contenant un seul objet, avec un identifiant stable. Son nom de fichier peut reprendre cet identifiant.

## Contrôles avant intégration

Depuis la racine du dépôt, après avoir installé les dépendances de développement :

```sh
cd app && npm ci
cd ..
node scripts/check-schemas.mjs
node scripts/check-data.mjs
node --test scripts/test-data-integrity.test.mjs
```

Le validateur contrôle d'abord chaque fichier avec son schéma JSON (types, champs obligatoires, formats, énumérations et contraintes conditionnelles), puis vérifie les références croisées. Il contrôle notamment que :
- chaque affirmation pointe vers une entité et au moins une source existantes ;
- chaque preuve pointe vers une source existante ;
- chaque relation pointe vers deux entités existantes et des sources ;
- les campagnes, réponses et engagements ne contiennent pas de références cassées.

Chaque entité doit elle-même référencer au moins une source ; le lecteur ne l'affiche que si au moins une de ces sources est au statut `reviewed`.

Les dossiers sont actuellement vides : aucun contenu factuel n'est publié par ce simple dispositif. Le lecteur public n'affiche que les entités marquées `published` et les éléments associés disposant d'au moins une source au statut `reviewed`. Les réponses ne sont affichées que si elles sont publiées et reliées à une source examinée. Toute donnée ajoutée doit être sourcée, examinée et validée selon la charte éditoriale.
