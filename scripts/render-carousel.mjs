#!/usr/bin/env node
// Render each <section class="slide"> of an HTML file to PNG, plus one combined PDF.
// Usage: node scripts/render-carousel.mjs <slides.html> <outdir> [--size 1080x1350]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [, , input, outdir = ".", ...rest] = process.argv;
if (!input) { console.error("usage: render-carousel.mjs <slides.html> <outdir> [--size WxH]"); process.exit(1); }
const sizeArg = rest[rest.indexOf("--size") + 1] ?? "1080x1350";
const [W, H] = (rest.includes("--size") ? sizeArg : "1080x1350").split("x").map(Number);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokens = fs.readFileSync(path.join(root, "brand/tokens.css"), "utf8");
fs.mkdirSync(outdir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await page.goto("file://" + path.resolve(input), { waitUntil: "networkidle" });
// Always inject brand tokens, so slides render on-brand wherever the HTML lives
await page.addStyleTag({ content: tokens + `:root{--w:${W}px;--h:${H}px}body{background:transparent}` });
// Official Axmed lockup (mark + wordmark, from the marketplace app) in every .brand slot
const logoWhite = fs.readFileSync(path.join(root, "brand/logo/axmed-logo-white.svg"), "utf8").replace("<svg ", '<svg style="height:58px;width:auto;display:block" ');
const logoIndigo = fs.readFileSync(path.join(root, "brand/logo/axmed-logo.svg"), "utf8").replace("<svg ", '<svg style="height:58px;width:auto;display:block" ');
await page.evaluate(({ light, dark }) => {
  document.querySelectorAll(".brand").forEach((el) => {
    const s = el.closest(".slide");
    const onDark = s && [...s.classList].some((c) => ["cover", "cta", "dark", "field"].includes(c) || c.startsWith("bg-") && !c.endsWith("-light"));
    el.innerHTML = onDark ? dark : light;
  });
}, { light: logoIndigo, dark: logoWhite });
// Brand pattern backgrounds: add class bg-<pattern> to any slide (e.g. bg-strands-dark, bg-supergraphic, bg-routes-light, bg-signature-dark)
const pdir = path.join(root, "brand/patterns");
const bgCss = fs.readdirSync(pdir).filter((f) => f.endsWith(`_${W}x${H}.svg`)).map((f) => {
  const name = f.replace(`_${W}x${H}.svg`, "");
  const dark = !name.endsWith("-light");
  // quiet zone: the pattern fades out where the copy sits (left/bottom), stays full on the right
  const fade = dark ? "30,22,98" : "250,250,252";   // --indigo-ink / --paper, so the veil meets the slide colour
  const veil = `linear-gradient(100deg, rgba(${fade},.96) 0%, rgba(${fade},.88) 48%, rgba(${fade},0) 82%)`;
  return `.slide.bg-${name}{background:${veil}, url("file://${path.join(pdir, f)}") center/cover no-repeat !important}` +
    `.slide.bg-${name}::before{display:none}` +
    (dark ? [
      // text on a dark pattern: system.css tokens, with the old values as a fallback for slides that only load tokens.css
      `.slide.bg-${name} :is(h1,h2,.head,.big,.quote,.brand,.num,blockquote){color:var(--on-indigo,#F4F2FD)}`,
      `.slide.bg-${name} :is(.head span,p.lead,.lead,cite,.cite,.source,.src,.page,.pnum,li,.label){color:var(--on-indigo-soft,#C9C4EC)}`,
    ].join("") : "");
}).join("\n");
await page.addStyleTag({ content: bgCss });
await page.evaluate(() => document.fonts.ready);

const slides = await page.$$("section.slide");
for (let i = 0; i < slides.length; i++) {
  const file = path.join(outdir, `slide-${String(i + 1).padStart(2, "0")}.png`);
  await slides[i].screenshot({ path: file });
  console.log("✓", file);
}
await page.addStyleTag({ content: `@page{size:${W}px ${H}px;margin:0}section.slide{page-break-after:always}` });
await page.pdf({ path: path.join(outdir, "carousel.pdf"), width: `${W}px`, height: `${H}px`, printBackground: true });
console.log("✓", path.join(outdir, "carousel.pdf"), `(${slides.length} pages)`);
await browser.close();
