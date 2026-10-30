import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../app/src/styles.css", import.meta.url), "utf8");
const dossierPanel = await readFile(new URL("../app/src/DossierPanel.tsx", import.meta.url), "utf8");
const app = await readFile(new URL("../app/src/App.tsx", import.meta.url), "utf8");
const privacy = await readFile(new URL("../PRIVACY.md", import.meta.url), "utf8");

assert.match(css, /button:focus-visible, a:focus-visible, input:focus-visible/);
assert.match(css, /\.language-select:focus-visible/);
assert.ok(css.includes(':root[data-theme="dark"] {'), "a user-selected dark theme must be available");
assert.ok(!css.includes("prefers-color-scheme: dark"), "dark mode must not override the user selection");
assert.doesNotMatch(app, /id="language-select"/, "the public prototype must not expose a language selector");
assert.match(app, /id="theme-select"/);
assert.ok(app.includes("useState<Theme>(getInitialTheme)"));
assert.ok(app.includes("document.documentElement.dataset.theme = theme"));
assert.ok(app.includes('localStorage.setItem("impact-theme", theme)'));
assert.ok(privacy.includes("impact-theme") && privacy.includes("impact-accent") && /jamais transmises à IMPACT/.test(privacy),
  "the locally stored theme and accent preferences must be disclosed in the privacy policy");
assert.match(app, /const language: Language = "fr";/, "French must be the only public interface language");
assert.match(app, /<section id="method" className="content-section editorial-method"/,
  "the navigation method link must lead to the editorial evidence policy");
assert.match(app, /<section id="privacy" className="method-section"/,
  "the privacy section must have its own anchor, separate from editorial method");
assert.match(app, /methodPublicationText: "Une affirmation peut être publiée sans validation humaine/,
  "the public method must explain evidence-based publication without human approval");
assert.doesNotMatch(app, /setLanguage/, "the public prototype must not expose a language switch");
assert.match(app, /document\.documentElement\.lang = language/);
assert.match(app, /document\.title = language === "fr"/);
assert.match(app, /meta\[name="description"\]/);
assert.match(css, /@media \(max-width: 760px\)/);
assert.match(css, /@media \(max-width: 390px\)/);
assert.equal((css.match(/prefers-reduced-motion:\s*reduce/g) ?? []).length, 1,
  "reduced-motion rules should be centralized to avoid conflicting duplicates");

const darkMode = css.slice(css.indexOf(':root[data-theme="dark"] {'));
assert.ok(darkMode.includes("--paper: #18251d;"), "dark mode must replace page and card surfaces");
assert.ok(darkMode.includes(".dossier-card") && darkMode.includes(".claim-card"),
  "dossier and claim cards must retain dark surfaces");
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

console.log("UI invariant checks passed: keyboard focus, French-only interface, mobile breakpoints, reduced motion, dossier dark mode and cross-entity claim attribution.");
