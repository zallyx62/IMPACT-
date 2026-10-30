# Contribuer à IMPACT

Merci de contribuer à un projet qui privilégie la fiabilité, la transparence et la confidentialité.

## Principes

- Toutes les contributions doivent respecter la licence du code et les licences propres aux contenus.
- Aucune donnée factuelle n'est publiée automatiquement.
- Les changements éditoriaux sont examinés par des humains avant publication.
- Toute affirmation importante doit renvoyer à des sources consultables et indiquer ses limites.
- Les conflits d'intérêts pertinents doivent être déclarés.
- Les informations inconnues doivent rester indiquées comme inconnues, sans supposition.
- Aucun tracker, système publicitaire ou service d'IA générative ne doit être intégré à l'application publique sans révision explicite et publique des principes du projet.

## Proposer une modification

1. Consultez le [cahier des données](docs/MODELE_DE_DONNEES.md), la [charte éditoriale](docs/CHARTE_EDITORIALE.md) et la [politique de confidentialité](PRIVACY.md).
2. Expliquez le problème que votre contribution résout.
3. Pour un changement technique, décrivez les effets sur l'accessibilité, les performances, la sécurité, la confidentialité et le fonctionnement hors ligne.
4. Pour un changement éditorial, fournissez les sources originales, les dates, le contexte, les limites et, si pertinent, la réponse de l'organisation concernée.
5. Ouvrez une pull request ou une issue sur GitHub. Une proposition ne sera pas considérée comme publiée tant qu'elle n'a pas été examinée et intégrée.

## Vérification technique

Dans le dossier `app/`, exécutez :

```sh
npm ci
npm audit --audit-level=high
npm run typecheck
npm run test
node scripts/test-service-worker.mjs
node --test scripts/test-data-integrity.test.mjs
node --test scripts/test-schema-validation.test.mjs
node --test scripts/test-dossier-publication.test.mjs
node scripts/check-contrast.mjs
npm run build
node scripts/check-pwa-build.mjs
node scripts/check-schemas.mjs
node scripts/check-data.mjs
```

Avant une version stable, des essais manuels d'accessibilité, de navigation, d'installation PWA, de fonctionnement hors ligne et de confidentialité restent nécessaires.

## Sources et droits d'auteur

- Préférez les documents originaux, les études publiées, les décisions officielles et les données méthodologiquement décrites.
- Citez de courts extraits seulement lorsque cela est légalement permis ; préférez un résumé rédigé avec une référence.
- Ne copiez pas intégralement des articles, rapports ou bases de données protégés.
- Vérifiez les conditions de réutilisation et indiquez la licence des contenus ajoutés.
- Ne présentez pas une campagne, une opinion ou une allégation comme un fait établi.

## Transparence sur les outils

Les contributeurs restent responsables de leurs modifications. Une assistance automatisée ne remplace ni la vérification des sources ni la revue humaine. Le projet ne prévoit pas d'intégrer d'IA générative dans l'application destinée au public.

## Respect et collaboration

Critiquez les idées et le code, pas les personnes. Les signalements d'erreurs et les désaccords documentés sont bienvenus. Les menaces, le harcèlement, les accusations personnelles non étayées et la publication de données privées n'ont pas leur place dans les échanges du projet.
