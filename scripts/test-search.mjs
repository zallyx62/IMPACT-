import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { tools, universes } from "../app/src/data/catalog.ts";
import { matchesSearch, normalizeSearch, searchableEntityText, searchableText } from "../app/src/data/search.ts";

describe("normalizeSearch", () => {
  it("ignores accents and letter case", () => {
    assert.equal(normalizeSearch("  ÉLÉVAGE  "), "elevage");
  });

  it("trims surrounding whitespace", () => {
    assert.equal(normalizeSearch("  privacy  "), "privacy");
  });

  it("normalizes ASCII case independently of the browser locale", () => {
    assert.equal(normalizeSearch("IMPACT"), "impact");
  });
});

describe("searchableText", () => {
  it("finds French keywords without accents", () => {
    assert.ok(searchableText(universes[0]).includes("elevage"));
  });

  it("includes English names and descriptions", () => {
    assert.ok(searchableText(universes[1]).includes("biodiversity"));
  });

  it("includes cross-cutting tool keywords", () => {
    assert.ok(searchableText(tools[0]).includes("reliability"));
  });
});

describe("searchableEntityText", () => {
  const entity = { name: "Example Group", entity_type: "organization", description: "A published entity." };
  const dossier = {
    claims: [{ statement: "Uses a documented supply-chain standard.", topic: "human_rights", claim_status: "confirmed", uncertainty_note: "Coverage remains incomplete." }],
    sources: [{ title: "Supply chain report", publisher: "Independent Institute", review_status: "evidence_verified", verification_note: "Analyse documentaire de la source primaire" }],
    evidence: [{ summary: "The report describes supplier audits.", locator: "Page 12" }],
    campaigns: [{ title: "Transparency campaign", demands: ["Publish supplier information"], outcome_summary: "A public response was issued." }],
    responses: [{ summary: "The organization published a response." }],
    commitments: [{ statement: "Reduce emissions by 2030.", measurement_method: "Annual inventory", observed_result: "Baseline published." }],
    relationships: [{ relationship_type: "supplies" }],
  };

  it("indexes published claims, source metadata, evidence and campaigns", () => {
    const text = searchableEntityText(entity, dossier);
    assert.ok(matchesSearch(text, "supply chain"));
    assert.ok(matchesSearch(text, "supplier audits"));
    assert.ok(matchesSearch(text, "transparency campaign"));
    assert.ok(matchesSearch(text, "analyse documentaire"), "evidence verification notes must be searchable");
    assert.ok(matchesSearch(text, "supplier information"));
    assert.ok(matchesSearch(text, "droits humains"), "French topic names must match internal topic identifiers");
    assert.ok(matchesSearch(text, "confirmee"), "French claim status labels must match internal status identifiers");
  });

  it("indexes published responses, commitments and relationships", () => {
    const text = searchableEntityText(entity, dossier);
    assert.ok(matchesSearch(text, "annual inventory"));
    assert.ok(matchesSearch(text, "public response"));
    assert.ok(matchesSearch(text, "supplies"));
  });

  it("indexes the explicit pending-review status in French", () => {
    const pending = searchableEntityText(entity, { ...dossier, claims: [{ ...dossier.claims[0], claim_status: "not_reviewed" }] });
    assert.ok(matchesSearch(pending, "non examinee"));
  });

  it("keeps the entity searchable when no dossier is supplied", () => {
    assert.ok(matchesSearch(searchableEntityText(entity), "example group"));
    assert.ok(matchesSearch(searchableEntityText({ ...entity, entity_type: "organization" }), "organisation"));
  });
});

describe("matchesSearch", () => {
  it("matches every query term regardless of order or adjacency", () => {
    assert.equal(matchesSearch("Climat, impacts et biodiversité", "biodiversité climat"), true);
  });

  it("rejects a query when one term is missing", () => {
    assert.equal(matchesSearch("Climat, impacts et biodiversité", "climat océans"), false);
  });

  it("does not match an empty query", () => {
    assert.equal(matchesSearch("Climate impacts", "   "), false);
  });
});
