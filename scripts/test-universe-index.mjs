import test from "node:test";
import assert from "node:assert/strict";
import { dossiersForUniverse } from "../app/src/data/universe-index.ts";

const dossier = (id, topic, campaigns = []) => ({
  entity: { id, name: id }, claims: topic ? [{ topic }] : [], campaigns,
});

test("thematic universes include dossiers with matching published claim topics", () => {
  const items = [dossier("food", "animals_food"), dossier("climate", "environment"), dossier("rights", "human_rights"), dossier("business", "business_consumption"), dossier("tech", "technology_privacy")];
  assert.deepEqual(dossiersForUniverse("animals-food", items).map((item) => item.entity.id), ["food"]);
  assert.deepEqual(dossiersForUniverse("environment", items).map((item) => item.entity.id), ["climate"]);
  assert.deepEqual(dossiersForUniverse("people-society", items).map((item) => item.entity.id), ["rights"]);
  assert.deepEqual(dossiersForUniverse("business-consumption", items).map((item) => item.entity.id), ["business"]);
  assert.deepEqual(dossiersForUniverse("technology", items).map((item) => item.entity.id), ["tech"]);
});

test("the action universe includes only dossiers with documented campaigns", () => {
  const items = [dossier("one", null, [{ id: "c1" }]), dossier("two", "environment")];
  assert.deepEqual(dossiersForUniverse("take-action", items).map((item) => item.entity.id), ["one"]);
  assert.deepEqual(dossiersForUniverse("unknown", items), []);
});
