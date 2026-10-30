import test from "node:test";
import assert from "node:assert/strict";
import { buildDossierShareUrl } from "../app/src/data/share-url.ts";

test("creates a shareable entity route and preserves the site address", () => {
  assert.equal(buildDossierShareUrl("https://impact.example/app?mode=web#old", "nestle"), "https://impact.example/app?mode=web#entity/nestle");
});

test("encodes special characters in entity identifiers", () => {
  assert.equal(buildDossierShareUrl("https://impact.example/", "marque & société"), "https://impact.example/#entity/marque%20%26%20soci%C3%A9t%C3%A9");
});
