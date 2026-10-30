import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../app/src/styles.css", import.meta.url), "utf8");

function cssVariable(name) {
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(match, `Missing CSS variable --${name}`);
  return match[1];
}

function selectorRule(selector) {
  const index = css.indexOf(selector);
  assert.notEqual(index, -1, `Missing CSS selector ${selector}`);
  const open = css.indexOf("{", index);
  const close = css.indexOf("}", open);
  assert.ok(open !== -1 && close !== -1, `Invalid CSS rule for ${selector}`);
  return css.slice(open + 1, close);
}

function luminance(hex) {
  const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255);
  const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

const muted = cssVariable("muted");
const mutedStrong = cssVariable("muted-strong");
const checks = [
  { selector: ".universe-number", foreground: muted, background: "#ffffff" },
  { selector: ".section-index", foreground: muted, background: "#f7f8f4" },
  { selector: ".footer-version", foreground: muted, background: "#f7f8f4" },
  { selector: ".search-field input::placeholder", foreground: muted, background: "#ffffff" },
  { selector: ".method-copy > p:not(.section-kicker)", foreground: mutedStrong, background: "#edf4eb" },
];

for (const check of checks) {
  const rule = selectorRule(check.selector);
  const expected = check.foreground === muted ? "var(--muted)" : "var(--muted-strong)";
  assert.ok(rule.includes(`color: ${expected}`), `${check.selector} must use ${expected}`);
  const ratio = contrast(check.foreground, check.background);
  assert.ok(ratio >= 4.5, `${check.selector} contrast is ${ratio.toFixed(2)}:1; expected at least 4.5:1`);
  console.log(`PASS ${check.selector}: ${ratio.toFixed(2)}:1`);
}


const darkChecks = [
  { label: "dark primary text", foreground: "#e1ebe2", background: "#18251d" },
  { label: "dark secondary text", foreground: "#a5b4a9", background: "#18251d" },
  { label: "dark links", foreground: "#b3efd0", background: "#18251d" },
  { label: "dark uncertainty note", foreground: "#e5d9b8", background: "#342f21" },
  { label: "dark status label", foreground: "#b3efd0", background: "#28493a" },
];

for (const check of darkChecks) {
  assert.ok(css.includes(check.foreground) && css.includes(check.background),
    `Missing dark-mode colors for ${check.label}`);
  const ratio = contrast(check.foreground, check.background);
  assert.ok(ratio >= 4.5, `${check.label} contrast is ${ratio.toFixed(2)}:1; expected at least 4.5:1`);
  console.log(`PASS ${check.label}: ${ratio.toFixed(2)}:1`);
}

console.log("All checked light and dark text contrast ratios meet WCAG AA (4.5:1).");
