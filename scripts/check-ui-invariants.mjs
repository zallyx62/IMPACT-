import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../app/src/styles.css", import.meta.url), "utf8");
const dossierPanel = await readFile(new URL("../app/src/DossierPanel.tsx", import.meta.url), "utf8");
const app = await readFile(new URL("../app/src/App.tsx", import.meta.url), "utf8");

assert.match(css, /button:focus-visible, a:focus-visible, input:focus-visible/);
assert.match(css, /\.language-select:focus-visible/);
assert.match(app, /id="language-select"/);
assert.match(app, /useState<Language>\("en"\)/, "English must be the default language for new sessions");
assert.match(app, /<option value="fr">Français<\/option>/);
assert.match(app, /<option value="en">English<\/option>/);
assert.match(app, /document\.documentElement\.lang = language/);
assert.match(app, /document\.title = language === "fr"/);
assert.match(app, /meta\[name="description"\]/);
assert.match(css, /@media \(max-width: 760px\)/);
assert.match(css, /@media \(max-width: 390px\)/);
assert.equal((css.match(/prefers-reduced-motion:\s*reduce/g) ?? []).length, 1,
  "reduced-motion rules should be centralized to avoid conflicting duplicates");

const darkModeBlocks = css.split('@media (prefers-color-scheme: dark) {').slice(1).map((block) => block.split(String.fromCharCode(10) + "}")[0]);
const darkMode = darkModeBlocks[0];
const finalDarkMode = darkModeBlocks.at(-1);
assert.ok(darkModeBlocks.length > 0, "dark-mode styles are required");
assert.ok(finalDarkMode.includes(".dossier-card, .claim-card { background: var(--paper); }"),
  "dossier and claim cards must retain dark surfaces after their base styles");
assert.ok(finalDarkMode.includes(".claim-uncertainty { background: #342f21; color: #e5d9b8; }"),
  "uncertainty notes must retain their dark-mode colors after their base styles");
assert.ok(darkMode.includes(".claim-uncertainty { background: #342f21; color: #e5d9b8; }"),
  "uncertainty notes need a dark-mode surface and readable foreground");

for (const marker of ["selected-mark", "tool-mark", "result-mark", "universe-mark", "footer-mark"]) {
  assert.match(app, new RegExp(`<span className="${marker}" aria-hidden="true">`),
    `${marker} is decorative and must be hidden from assistive technology`);
}

assert.ok(dossierPanel.includes("sourceReference(item.source_id)"), "every evidence item must link to its own source");
assert.ok(dossierPanel.includes("dossier.entity.updated_at"), "entity update dates must be displayed when supplied");
for (const field of ["claim.valid_from", "claim.valid_until", "claim.editorial_note", "item.started_at", "item.ended_at", "item.received_at", "item.published_at", "item.full_response_url", "item.announced_at", "item.baseline", "item.target_value"]) {
  assert.ok(dossierPanel.includes(field), `editorial metadata field ${field} must be displayed`);
}

for (const field of ["source.source_type", "source.published_at", "source.language", "source.methodology", "source.potential_conflicts", "source.archived_url"]) {
  assert.ok(dossierPanel.includes(field), `source provenance field ${field} must be displayed`);
}

assert.match(dossierPanel, /item\.entity_id !== dossier\.entity\.id/,
  "responses from related campaign entities must be attributed");
assert.match(dossierPanel, /respondingEntity: "Entité répondante"/);
assert.match(dossierPanel, /respondingEntity: "Responding entity"/);

assert.match(dossierPanel, /claim\.subject_entity_id !== dossier\.entity\.id/,
  "claims about another entity must be explicitly attributed in the dossier");
assert.match(dossierPanel, /claimAbout: "Concerne"/);
assert.match(dossierPanel, /claimAbout: "About"/);

console.log("UI invariant checks passed: keyboard focus, language selection, mobile breakpoints, reduced motion, dossier dark mode and cross-entity claim attribution.");
