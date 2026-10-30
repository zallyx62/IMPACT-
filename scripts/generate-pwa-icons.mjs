import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const iconDirectory = resolve(root, "app/public/icons");

const icons = [
  { size: 180, source: "impact-180.png.b64" },
  { size: 192, source: "impact-192.png.b64" },
  { size: 512, source: "impact-512.png.b64" },
];

await mkdir(iconDirectory, { recursive: true });

for (const icon of icons) {
  const encoded = (await readFile(resolve(root, "assets/pwa-icons", icon.source), "utf8")).trim();
  assert.match(encoded, /^[A-Za-z0-9+/]+={0,2}$/, `invalid base64 icon source: ${icon.source}`);

  const png = Buffer.from(encoded, "base64");
  assert.equal(png.toString("base64"), encoded, `invalid base64 encoding: ${icon.source}`);
  assert.deepEqual(
    [...png.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
    `invalid PNG signature: ${icon.source}`,
  );
  assert.equal(png.readUInt32BE(16), icon.size, `unexpected PNG width: ${icon.source}`);
  assert.equal(png.readUInt32BE(20), icon.size, `unexpected PNG height: ${icon.source}`);

  const output = resolve(iconDirectory, `impact-${icon.size}.png`);
  await writeFile(output, png);
  console.log(`Generated app/public/icons/impact-${icon.size}.png`);
}
