import { readdir, readFile } from "node:fs/promises";
import { COLLECTIONS, validateCollections } from "./lib/data-integrity.mjs";
import { compileRecordValidators, validateSchemaRecords } from "./lib/schema-validation.mjs";

const root = new URL("../data/records/", import.meta.url);

async function loadCollection(name) {
  const directory = new URL(`${name}/`, root);
  let files;
  try {
    files = await readdir(directory);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }

  const records = [];
  for (const file of files.filter((entry) => entry.endsWith(".json")).sort()) {
    const path = new URL(file, directory);
    const record = JSON.parse(await readFile(path, "utf8"));
    if (!record || typeof record !== "object" || Array.isArray(record)) {
      throw new Error(`${name}/${file}: expected one JSON object per file`);
    }
    records.push(record);
  }
  return records;
}

const collections = Object.fromEntries(
  await Promise.all(COLLECTIONS.map(async (name) => [name, await loadCollection(name)])),
);
const validators = await compileRecordValidators();
const errors = [
  ...validateSchemaRecords(collections, validators),
  ...validateCollections(collections),
];

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  const count = Object.values(collections).reduce((total, records) => total + records.length, 0);
  console.log(`Data references are valid (${count} records checked).`);
}
