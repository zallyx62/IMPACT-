import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { safeExternalUrl } from "../app/src/data/safe-url.ts";

describe("safeExternalUrl", () => {
  it("accepts HTTPS and HTTP web links", () => {
    assert.equal(safeExternalUrl("https://example.org/report"), "https://example.org/report");
    assert.equal(safeExternalUrl("http://example.org/report"), "http://example.org/report");
  });

  it("rejects script and data protocols", () => {
    assert.equal(safeExternalUrl("javascript:alert(1)"), undefined);
    assert.equal(safeExternalUrl("data:text/html,<script>alert(1)</script>"), undefined);
    assert.equal(safeExternalUrl("file:///etc/passwd"), undefined);
  });

  it("rejects malformed URLs and protocol-relative URLs", () => {
    assert.equal(safeExternalUrl("not a URL"), undefined);
    assert.equal(safeExternalUrl("//example.org/path"), undefined);
    assert.equal(safeExternalUrl(undefined), undefined);
    assert.equal(safeExternalUrl(null), undefined);
  });

  it("rejects URLs containing embedded credentials", () => {
    assert.equal(safeExternalUrl("https://user:password@example.org/"), undefined);
  });
});
