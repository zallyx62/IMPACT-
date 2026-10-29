import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const claimSchema = JSON.parse(
  await readFile(new URL("../data/schema/claim.schema.json", import.meta.url), "utf8"),
);
const sourceSchema = JSON.parse(
  await readFile(new URL("../data/schema/source.schema.json", import.meta.url), "utf8"),
);

assert.ok(claimSchema.required.includes("source_ids"), "Every claim must require source_ids");
assert.equal(
  claimSchema.properties.source_ids.minItems,
  1,
  "Every claim must cite at least one source",
);
assert.ok(sourceSchema.required.includes("title"), "Every source must have a title");
assert.ok(sourceSchema.required.includes("review_status"), "Every source must have a review status");

console.log("Schema JSON and editorial invariants are valid.");
