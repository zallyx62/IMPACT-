# Language and translation strategy — IMPACT

## Language order

1. French (`fr`) — the only interface language in the current project scope.
2. Other languages are not currently planned for the public prototype. They may be reconsidered only after a human translation and review process is available.

The public interface is displayed in French. There is no language selector and no language preference is stored.

## Architecture rules

- Use standard language codes and an extensible TypeScript `Language` union.
- Centralize interface labels by language; do not scatter translated text across components.
- French is the interface language; source documents retain their original language.
- Editorial translations must be reviewed by a person before publication.
- Do not use automatic translation in the public application.
- Never translate quotations, document titles or excerpts as though the translation were the original text.
- Preserve and display the original language of each source.
- If a human-reviewed translation is unavailable, clearly show the original language rather than implying that the content is translated.
- Translations must preserve legal and scientific nuance, methodological limits, statuses and dates.
- A correction to source content must trigger a review of related translations.

No additional language is being added to the current prototype. Any future language would require a separate decision, a complete human-reviewed interface translation, reviewed editorial content and tests before it could be advertised.

## Current status

- French: only public interface language.
- English, Spanish, German and others: not included in the current scope.
- Nestlé dossiers remain unpublished editorial drafts; source quotations and documents retain their original language.


## Display theme

The web app offers explicit Light and Dark choices. Dark is the default for a first visit; the selected theme is saved only in the browser's local storage on that device so it remains selected on return. The theme preference is never sent to IMPACT servers and is not used for analytics or profiling. The theme selector remains available independently of the system colour-scheme setting.
