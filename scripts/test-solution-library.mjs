import test from "node:test";
import assert from "node:assert/strict";
import { searchSolutionMethods, solutionMethods } from "../app/src/data/solution-library.ts";

test("publishes three clearly scoped reusable method templates", () => {
  assert.equal(solutionMethods.length, 3);
  assert.equal(new Set(solutionMethods.map((method) => method.id)).size, 3);
  for (const method of solutionMethods) {
    assert.ok(method.title.length > 8);
    assert.ok(method.steps.length >= 5);
    assert.ok(method.indicatorExamples.length > 0);
    assert.ok(method.watchPoints.length > 0);
  }
});

test("search is accent-insensitive and returns all methods for an empty query", () => {
  assert.equal(searchSolutionMethods("").length, 3);
  assert.deepEqual(searchSolutionMethods("expérimenter").map((method) => method.id), ["pilot"]);
  assert.deepEqual(searchSolutionMethods("indicateur").map((method) => method.id), ["diagnostic", "pilot", "evaluation"]);
  assert.deepEqual(searchSolutionMethods("aucun résultat correspondant"), []);
});
