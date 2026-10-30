import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../app/src/styles.css", import.meta.url), "utf8");

assert.match(css, /button:focus-visible, a:focus-visible, input:focus-visible/);
assert.match(css, /@media \(max-width: 760px\)/);
assert.match(css, /@media \(max-width: 390px\)/);
assert.equal((css.match(/prefers-reduced-motion:\s*reduce/g) ?? []).length, 1,
  "reduced-motion rules should be centralized to avoid conflicting duplicates");

const darkMode = css.match(/@media \(prefers-color-scheme: dark\) \{([\s\S]*?)\n\}/);
assert.ok(darkMode, "dark-mode styles are required");
assert.match(darkMode[1], /\.dossier-card, \.claim-card \{ background: var\(--paper\); \}/,
  "dossier and claim cards must use the dark surface color");
assert.match(darkMode[1], /\.claim-uncertainty \{ background: #[0-9a-fA-F]{6}; color: #[0-9a-fA-F]{6}; \}/,
  "uncertainty notes need a dark-mode surface and readable foreground");

console.log("UI invariant checks passed: keyboard focus, mobile breakpoints, reduced motion and dossier dark mode.");
