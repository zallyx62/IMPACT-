import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { constants } from "node:fs";

const dist = new URL("../app/dist/", import.meta.url);
const requiredFiles = [
  "index.html",
  "sw.js",
  "manifest.webmanifest",
  "icons/impact.svg",
];

for (const file of requiredFiles) {
  await access(new URL(file, dist), constants.R_OK);
  console.log(`PASS build contains ${file}`);
}

const html = await readFile(new URL("index.html", dist), "utf8");
assert.match(html, /<title>IMPACT/);
assert.match(html, /rel="manifest"/);
assert.match(html, /assets\/[^"]+\.js/);
assert.match(html, /assets\/[^"]+\.css/);

const manifest = JSON.parse(await readFile(new URL("manifest.webmanifest", dist), "utf8"));
const iconSvg = await readFile(new URL("icons/impact.svg", dist), "utf8");
assert.equal(manifest.start_url, "./");
assert.equal(manifest.scope, "./");
assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0);
assert.ok(manifest.icons.some((icon) => icon.purpose?.includes("maskable")), "a maskable icon must be declared");
assert.ok(iconSvg.includes('transform="translate(12.8 12.8) scale(0.8)"'), "maskable foreground must be scaled into its safe zone");
for (const icon of manifest.icons) {
  const iconPath = new URL(icon.src, new URL("manifest.webmanifest", dist));
  await access(iconPath, constants.R_OK);
}

const assets = await readdir(new URL("assets/", dist));
assert.ok(assets.some((file) => file.endsWith(".js")), "production JavaScript bundle is missing");
assert.ok(assets.some((file) => file.endsWith(".css")), "production CSS bundle is missing");

const serviceWorker = await readFile(new URL("sw.js", dist), "utf8");
assert.match(serviceWorker, /self\.addEventListener\(["']install/);
assert.match(serviceWorker, /self\.addEventListener\(["']fetch/);

console.log("PWA production package smoke checks passed.");
