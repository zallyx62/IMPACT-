import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const [app, styles, html, manifest] = await Promise.all([
  readFile(new URL("../app/src/App.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/src/styles.css", import.meta.url), "utf8"),
  readFile(new URL("../app/index.html", import.meta.url), "utf8"),
  readFile(new URL("../app/public/manifest.webmanifest", import.meta.url), "utf8"),
]);

describe("IMPACT appearance settings", () => {
  it("uses French as the only public interface language", () => {
    assert.match(app, /const language: Language = "fr"/);
    assert.doesNotMatch(app, /id="language-select"/);
    assert.match(html, /<html lang="fr"/);
    assert.match(html, /IMPACT — Comprendre\. Choisir\. Agir\./);
  });

  it("defaults to dark mode and restores the user's saved mode", () => {
    assert.match(app, /getItem\("impact-theme"\) === "light" \? "light" : "dark"/);
    assert.match(html, /data-theme="dark"/);
    assert.match(styles, /:root\[data-theme="dark"\]/);
  });

  it("offers exactly five accent colours", () => {
    const values = [...app.matchAll(/<option value="(green|blue|violet|orange|rose)">/g)].map((match) => match[1]);
    assert.deepEqual(values, ["green", "blue", "violet", "orange", "rose"]);
    for (const accent of values) {
      assert.match(styles, new RegExp('data-accent="' + accent + '"'));
    }
  });

  it("stores both mode and accent locally, without a remote preference service", () => {
    assert.match(app, /setItem\("impact-theme", theme\)/);
    assert.match(app, /setItem\("impact-accent", accent\)/);
    assert.match(app, /getItem\("impact-accent"\)/);
    assert.doesNotMatch(app, /fetch\s*\(/);
  });

  it("supports system back navigation in the WebView and browser", () => {
    assert.match(app, /window\.history\.pushState/);
    assert.match(app, /addEventListener\("popstate"/);
    assert.match(app, /window\.history\.back\(\)/);
  });

  it("starts the PWA with dark launch colours", () => {
    assert.match(html, /name="theme-color" content="#111b16"/);
    assert.match(manifest, /"theme_color":\s*"#111b16"/);
    assert.match(manifest, /"background_color":\s*"#111b16"/);
  });
});
