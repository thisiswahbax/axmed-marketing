#!/usr/bin/env node
// Check every number and risky phrase in an asset against strategy/fact-sheet.md.
//
//   node scripts/check-numbers.mjs <file-or-folder>... [--final] [--json]
//
// A number passes when it appears in the fact sheet's "Safe to say" column or its Evidence table,
// or when strategy/claim-rules.json says it isn't a claim (a year, a date, a dose, the 48-hour
// promise). Numbers from "Not yet approved" fail; partner data warns (confirm before public use).
// A file can clear a specific number with a comment, which reviewers then see:
//   <!-- numbers-ok: 50% (MgSO4 strength in a product name) -->
// Fence off illustrative UI (mock data) with <!-- illustrative:start --> ... <!-- illustrative:end -->.
// --final also fails on placeholders such as [REF] or [NUMBER NEEDED]: use it before approval.
// Exit code 1 when anything fails. No dependencies.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const FINAL = args.includes("--final");
const JSON_OUT = args.includes("--json");
const targets = args.filter((a) => !a.startsWith("--"));
if (!targets.length) {
  console.error("usage: check-numbers.mjs <file-or-folder>... [--final] [--json]");
  process.exit(2);
}

const rules = JSON.parse(fs.readFileSync(path.join(ROOT, "strategy/claim-rules.json"), "utf8"));
const factSheetText = fs.readFileSync(path.join(ROOT, "strategy/fact-sheet.md"), "utf8");

// ---- numbers -------------------------------------------------------------------------------
const SCALE = { million: 1e6, m: 1e6, billion: 1e9, bn: 1e9, thousand: 1e3, k: 1e3 };
// a number, an optional range end, an optional unit (% or a scale word)
const NUM = /(?<![\w.$])(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)(?:\s*[–-]\s*(\d+(?:\.\d+)?))?(\+)?\s*(%|percent\b|million\b|billion\b|thousand\b|bn\b|M\b|k\b)?/g;

function keyOf(raw, unit) {
  let v = Number(raw.replace(/,/g, ""));
  const u = (unit || "").toLowerCase();
  if (u === "%" || u === "percent") return `${v}%`;
  if (SCALE[u]) v = Math.round(v * SCALE[u]);
  return String(v);
}

function numbersIn(text) {
  const out = [];
  for (const m of text.matchAll(NUM)) {
    const [whole, a, b, , unit] = m;
    if (!unit && /[A-Za-z]/.test(text[m.index + whole.trimEnd().length] || "")) continue;   // 3D, 4K: a name, not a figure
    const ctx = text.slice(Math.max(0, m.index - 30), m.index + whole.length + 30).replace(/\s+/g, " ").trim();
    out.push({ shown: whole.trim(), key: keyOf(a, unit), ctx });
    if (b) out.push({ shown: whole.trim(), key: keyOf(b, unit), ctx });
  }
  return out;
}

function wordNumbers(text) {
  const keys = [];
  if (/\bzero\b/i.test(text)) keys.push("0");
  if (/\b(a|one) million\b/i.test(text)) keys.push("1000000");
  return keys;
}

// ---- the fact sheet --------------------------------------------------------------------------
function tables(md) {
  const lines = md.split("\n"), found = [];
  for (let i = 0; i < lines.length - 1; i++) {
    if (!lines[i].startsWith("|") || !/^\|\s*-/.test(lines[i + 1])) continue;
    const cells = (l) => l.split("|").slice(1, -1).map((c) => c.trim());
    const head = cells(lines[i]), rows = [];
    for (let j = i + 2; j < lines.length && lines[j].startsWith("|"); j++) rows.push(cells(lines[j]));
    found.push({ head, rows });
  }
  return found;
}

function section(md, title) {
  const i = md.indexOf(`## ${title}`);
  if (i < 0) return "";
  const rest = md.slice(i + title.length + 3);
  const end = rest.search(/\n## |\nDefinitions:/);
  return end < 0 ? rest : rest.slice(0, end);
}

function factSheet(md) {
  const safe = new Set(), evidence = new Set(), partner = new Set(), blocked = new Set();
  const add = (set, text) => { numbersIn(text).forEach((n) => set.add(n.key)); wordNumbers(text).forEach((k) => set.add(k)); };
  for (const t of tables(md)) {
    const s = t.head.findIndex((h) => /safe to say/i.test(h));
    if (s >= 0) t.rows.forEach((r) => add(safe, r[s] || ""));
    if (t.head.some((h) => /^claim$/i.test(h))) t.rows.forEach((r) => add(evidence, r.join(" ")));
  }
  add(blocked, section(md, "Not yet approved"));
  add(partner, section(md, "Partner data"));
  const signedOff = !/awaiting .*sign-off/i.test(md.slice(0, 600));
  return { safe, evidence, partner, blocked, signedOff };
}

// ---- assets ----------------------------------------------------------------------------------
const SKIP = new Set(["review.md", "approval.md", "brief.md"]);
function files(target) {
  const p = path.resolve(target);
  if (!fs.existsSync(p)) { console.error(`not found: ${target}`); process.exit(2); }
  if (fs.statSync(p).isFile()) return [p];
  return fs.readdirSync(p, { withFileTypes: true }).flatMap((d) => {
    const q = path.join(p, d.name);
    if (d.isDirectory()) return d.name === "renders" ? [] : files(q);
    return /\.(html|md|txt)$/.test(d.name) && !SKIP.has(d.name) ? [q] : [];
  });
}

function readable(raw, isHtml) {
  const allow = new Set();
  for (const m of raw.matchAll(/numbers-ok:\s*([^\n>]*?)(?:-->|$)/gim)) numbersIn(m[1]).forEach((n) => allow.add(n.key));
  // illustrative UI (a mock spreadsheet, a sample order) is fenced off and reported, not checked
  let skipped = 0;
  let t = raw.replace(/<!--\s*illustrative:start\s*-->[\s\S]*?<!--\s*illustrative:end\s*-->/gi, () => { skipped++; return " "; });
  t = t.replace(/<!--[\s\S]*?-->/g, " ");
  if (isHtml) {
    // the <head> (title, meta) never reaches a viewer; only the body is checked
    t = t.replace(/<head[\s\S]*?<\/head>/i, " ").replace(/<(style|script)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#(\d+);/g, (_, c) => String.fromCharCode(c));
  }
  else t = t.replace(/`[^`\n]*`/g, " ");   // Markdown code spans are paths and commands, not copy
  t = t.replace(/https?:\/\/\S+/g, " ").replace(/\]\([^)]*\)/g, "]");
  return { text: t, allow, skipped };
}

const fs_ = factSheet(factSheetText);
const report = [];
let fails = 0, warns = 0;

for (const file of targets.flatMap(files)) {
  const raw = fs.readFileSync(file, "utf8");
  const { text, allow, skipped } = readable(raw, file.endsWith(".html"));
  const items = [];
  // numbers that are not claims are blanked out first, so their digits aren't read as claims
  let rest = text;
  for (const r of rules.notClaims) rest = rest.replace(new RegExp(r.pattern, "g"), (m) => " ".repeat(m.length));
  rest = rest.replace(/\b[A-Z]\d+\.\d+\b/g, (m) => " ".repeat(m.length));   // asset IDs such as A1.6
  for (const n of numbersIn(rest)) {
    let level = "fail", why = "not in the fact sheet";
    if (allow.has(n.key)) [level, why] = ["ok", "cleared in this file (numbers-ok)"];
    else if (fs_.blocked.has(n.key)) why = "listed under Not yet approved";
    else if (fs_.safe.has(n.key)) [level, why] = ["ok", "fact sheet: safe to say"];
    else if (fs_.evidence.has(n.key)) [level, why] = ["ok", "fact sheet: evidence, cite the source"];
    else if (fs_.partner.has(n.key)) [level, why] = ["warn", "partner data: confirm with the partner before public use"];
    items.push({ level, number: n.shown, why, context: n.ctx });
  }
  for (const p of rules.phrases) {
    for (const m of text.matchAll(new RegExp(p.pattern, "gi"))) {
      const ctx = text.slice(Math.max(0, m.index - 80), m.index + m[0].length + 80);
      if (p.near && !new RegExp(p.near, "i").test(ctx)) continue;
      items.push({ level: p.level || "fail", number: m[0], why: p.why, context: ctx.replace(/\s+/g, " ").trim().slice(0, 120) });
    }
  }
  for (const ph of rules.placeholders) {
    let i = raw.indexOf(ph);
    while (i >= 0) {
      items.push({ level: FINAL ? "fail" : "warn", number: ph, why: "placeholder still open", context: raw.slice(i, i + 60).replace(/\s+/g, " ") });
      i = raw.indexOf(ph, i + ph.length);
    }
  }
  if (skipped) items.push({ level: "warn", number: "illustrative", why: `${skipped} illustrative block(s) not checked: label them "Illustrative interface" on the asset`, context: "" });
  fails += items.filter((i) => i.level === "fail").length;
  warns += items.filter((i) => i.level === "warn").length;
  report.push({ file: path.relative(ROOT, file), items });
}

const verdict = fails ? "FIX" : "PASS";
if (JSON_OUT) {
  console.log(JSON.stringify({ verdict, fails, warns, factSheetSignedOff: fs_.signedOff, report }, null, 2));
} else {
  for (const r of report) {
    console.log(`\n${r.file}`);
    if (!r.items.length) console.log("  no numbers or flagged phrases");
    for (const i of r.items) console.log(`  ${i.level.padEnd(4)}  ${i.number.padEnd(16)}  ${i.why}\n        "${i.context}"`);
  }
  console.log(`\n${verdict}: ${fails} to fix, ${warns} to look at.` + (fs_.signedOff ? "" : " The fact sheet itself is not signed off yet."));
}
process.exit(fails ? 1 : 0);
