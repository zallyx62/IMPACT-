import { safeExternalUrl } from "./safe-url";

export interface ContributionDraftInput {
  subject: string;
  detail: string;
  sourceUrl: string;
  sourceTitle: string;
  contact?: string;
}

export function buildContributionDraft(input: ContributionDraftInput): string {
  const subject = input.subject.trim();
  const detail = input.detail.trim();
  const sourceTitle = input.sourceTitle.trim();
  const sourceUrl = safeExternalUrl(input.sourceUrl.trim());
  const contact = input.contact?.trim();
  if (!subject || !detail || !sourceTitle || !sourceUrl) {
    throw new Error("Un sujet, une description, un titre de source et une URL HTTP(S) valide sont nécessaires.");
  }
  return [
    "# Proposition de contribution à IMPACT",
    "",
    "## Sujet ou dossier concerné",
    subject,
    "",
    "## Information proposée ou correction",
    detail,
    "",
    "## Source à examiner",
    sourceTitle,
    sourceUrl,
    "",
    "## Contact facultatif",
    contact || "Non communiqué",
    "",
    "---",
    "Cette proposition n’est pas publiée automatiquement. Elle doit être examinée selon la charte éditoriale d’IMPACT.",
  ].join("\n");
}
