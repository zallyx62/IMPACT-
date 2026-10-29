import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { COLLECTIONS } from "./data-integrity.mjs";

const require = createRequire(new URL("../../app/package.json", import.meta.url));
const AjvModule = require("ajv/dist/2020.js");
const addFormatsModule = require("ajv-formats");
const Ajv2020 = AjvModule.default ?? AjvModule;
const addFormats = addFormatsModule.default ?? addFormatsModule;

export async function compileRecordValidators() {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validators = new Map();

  for (const collection of COLLECTIONS) {
    const schemaUrl = new URL(`../../data/schema/${collection.slice(0, -1)}.schema.json`, import.meta.url);
    const schemaName = {
      entities: "entity",
      sources: "source",
      claims: "claim",
      evidence: "evidence",
      relationships: "relationship",
      campaigns: "campaign",
      responses: "response",
      commitments: "commitment",
    }[collection];
    const schema = JSON.parse(await readFile(new URL(`../../data/schema/${schemaName}.schema.json`, import.meta.url), "utf8"));
    validators.set(collection, ajv.compile(schema));
  }

  return validators;
}

export function validateSchemaRecords(collections, validators) {
  const errors = [];
  for (const [collection, records] of Object.entries(collections)) {
    const validate = validators.get(collection);
    if (!validate) continue;
    for (const record of records) {
      if (!validate(record)) {
        errors.push(`${collection}/${record.id ?? "unknown"}: ${validate.errors.map((error) => `${error.instancePath || "/"} ${error.message}`).join("; ")}`);
      }
    }
  }
  return errors;
}
