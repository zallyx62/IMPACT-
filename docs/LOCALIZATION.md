# Language and translation strategy — IMPACT

## Language order

1. English (`en`) — primary interface language and default for new sessions.
2. French (`fr`) — selectable and maintained alongside English.
3. Spanish (`es`), German (`de`) and other languages — added progressively after translation and review.

The selector currently allows an explicit choice between English and French. English is the initial value on each fresh session. The selection remains in application memory only; it is not sent to a server or stored remotely.

## Architecture rules

- Use standard language codes and an extensible TypeScript `Language` union.
- Centralize interface labels by language; do not scatter translated text across components.
- English is the default interface language; source documents retain their original language.
- Editorial translations must be reviewed by a person before publication.
- Do not use automatic translation in the public application.
- Never translate quotations, document titles or excerpts as though the translation were the original text.
- Preserve and display the original language of each source.
- If a human-reviewed translation is unavailable, clearly show the original language rather than implying that the content is translated.
- Translations must preserve legal and scientific nuance, methodological limits, statuses and dates.
- A correction to source content must trigger a review of related translations.

## Adding a language

1. Add its code to the `Language` type.
2. Add navigation labels, forms, error messages and empty states.
3. Translate editorial content that has been validated.
4. Have translations reviewed by a person, especially legal and scientific wording.
5. Add tests ensuring every required key exists.
6. Check long text on small screens and with screen readers.

A language must not be advertised as available until the interface and the content actually shown are translated.

## Current status

- English: interface available, default language for new sessions.
- French: interface available and selectable.
- Spanish, German and others: planned, not yet available.
- Nestlé dossiers remain unpublished editorial drafts; English and French translations must be reviewed before publication.
