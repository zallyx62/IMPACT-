import test from "node:test";
import assert from "node:assert/strict";
import { projectMarkdownFilename } from "../app/src/data/solution-export.ts";

test("creates a readable Markdown filename from a French project objective", () => {
  assert.equal(projectMarkdownFilename("Réduire le gaspillage alimentaire local"), "reduire-le-gaspillage-alimentaire-local.md");
});

test("removes unsafe filename characters and limits the slug length", () => {
  const filename = projectMarkdownFilename("../../Projet : <test> / ?");
  assert.equal(filename, "projet-test.md");
  assert.ok(projectMarkdownFilename("A".repeat(200)).length <= 51);
});

test("uses a safe fallback for empty or punctuation-only objectives", () => {
  assert.equal(projectMarkdownFilename("   "), "projet-impact.md");
  assert.equal(projectMarkdownFilename("!!!"), "projet-impact.md");
});
