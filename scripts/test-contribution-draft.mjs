import test from "node:test";
import assert from "node:assert/strict";
import { buildContributionDraft } from "../app/src/data/contribution-draft.ts";

test("builds a local contribution draft with a safe source URL", () => {
  const draft = buildContributionDraft({
    subject: "Dossier exemple", detail: "Une correction détaillée avec son contexte et sa période.",
    sourceTitle: "Rapport public", sourceUrl: "https://example.org/report",
  });
  assert.match(draft, /Dossier exemple/);
  assert.match(draft, /https:\/\/example\.org\/report/);
  assert.match(draft, /n’est pas publiée automatiquement/);
});

test("rejects missing details and unsafe source protocols", () => {
  assert.throws(() => buildContributionDraft({
    subject: "Sujet", detail: "Description suffisamment longue pour être utile.",
    sourceTitle: "Source", sourceUrl: "javascript:alert(1)",
  }));
});
