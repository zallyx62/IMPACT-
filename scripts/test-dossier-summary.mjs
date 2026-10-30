import assert from "node:assert/strict";
import { getDossierSummary } from "../app/src/data/dossier-summary.ts";

const published = [
  "claim-nestle-water-treatments",
  "claim-nestle-water-cjipe",
  "claim-nestle-water-health-finding",
  "claim-nestle-gerber-microplastics-consumer-reports-2026",
  "claim-nestle-branded-plastic-audit-2024",
  "claim-nestle-cocoa-deforestation-2025",
].map((id) => ({ id, publication_basis: "evidence_verified" }));

const summary = getDossierSummary("nestle", published);
assert.ok(summary, "Nestlé summary is available when all referenced claims are published");
assert.equal(summary.level, "high");
assert.equal(summary.reasons.length, 4);
assert.ok(summary.reasons.every((reason) => reason.claimIds.length > 0));
assert.match(summary.reasons[1].text.fr, /ne démontre ni que l'emballage est la source/);
assert.match(summary.reasons[2].text.fr, /ne représente pas 3 % de la pollution plastique mondiale/);
assert.match(summary.reasons[3].text.fr, /ne prouve pas une déforestation/);
assert.match(summary.methodology.fr, /pas une note scientifique/);
assert.equal(getDossierSummary("unknown", published), undefined);
assert.equal(
  getDossierSummary("nestle", published.filter((claim) => claim.id !== "claim-nestle-water-cjipe")),
  undefined,
  "summary is hidden if any referenced claim is not present",
);
assert.equal(
  getDossierSummary("nestle", published.map((claim) => ({ ...claim, publication_basis: "not_reviewed" }))),
  undefined,
  "unpublished claims cannot support a summary",
);

console.log("PASS dossier summary scope and publication safeguards");
