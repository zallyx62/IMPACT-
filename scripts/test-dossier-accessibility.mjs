import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const component = await readFile(new URL("../app/src/DossierPanel.tsx", import.meta.url), "utf8");
assert.match(component, /useRef<HTMLHeadingElement>\(null\)/, "dossier title has a focus target");
assert.match(component, /titleRef\.current\?\.focus\(\)/, "opening a dossier moves keyboard and screen-reader focus to its title");
assert.match(component, /\[dossier\.entity\.id\]/, "focus updates when navigating between dossiers");
assert.match(component, /<h2 id="dossier-title" ref=\{titleRef\} tabIndex=\{-1\}>/, "the dossier heading is programmatically focusable without entering the tab order");
console.log("PASS dossier navigation announces the newly opened dossier through focus management");
