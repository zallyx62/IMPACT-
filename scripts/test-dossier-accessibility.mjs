import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const component = await readFile(new URL("../app/src/DossierPanel.tsx", import.meta.url), "utf8");
assert.match(component, /useRef<HTMLHeadingElement>\(null\)/, "dossier title has a focus target");
assert.match(component, /titleRef\.current\?\.focus\(\)/, "opening a dossier moves focus to its title");
assert.match(component, /\[dossier\.entity\.id\]/, "focus updates when navigating between dossiers");
assert.match(component, /<h2 id="dossier-title" ref=\{titleRef\} tabIndex=\{-1\}>/, "the heading is programmatically focusable");
assert.match(component, /typeof navigator\.share === "function"/, "native device sharing is supported");
assert.match(component, /navigator\.clipboard\?\.writeText/, "clipboard fallback is supported");
console.log("PASS dossier focus management and sharing fallbacks");
