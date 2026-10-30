import test from "node:test";
import assert from "node:assert/strict";
import { buildSolutionPlan } from "../app/src/data/solution-plan.ts";

test("creates a transparent project plan from local input", () => {
  const plan = buildSolutionPlan({
    objective: "Réduire le gaspillage alimentaire local",
    context: "Diagnostic à réaliser avec les commerces participants.",
    resources: "Bénévoles et espace de stockage à confirmer.",
    constraints: "Respect de la chaîne du froid et des règles sanitaires.",
    indicator: "Kilogrammes redistribués par semaine, pesés et consignés.",
  });
  assert.match(plan, /Réduire le gaspillage alimentaire local/);
  assert.match(plan, /Kilogrammes redistribués/);
  assert.match(plan, /n’a pas été envoyé, vérifié ni publié/);
  assert.match(plan, /Ne pas présenter une hypothèse comme un fait établi/);
});

test("requires a meaningful objective and supplies explicit unknowns", () => {
  assert.throws(() => buildSolutionPlan({
    objective: "Trop court", context: "", resources: "", constraints: "", indicator: "",
  }), /au moins 12 caractères/);
  const plan = buildSolutionPlan({
    objective: "Améliorer l’accès local à la réparation",
    context: "", resources: "", constraints: "", indicator: "",
  });
  assert.match(plan, /À documenter avant toute mise en œuvre/);
  assert.match(plan, /Définir un indicateur mesurable/);
});
