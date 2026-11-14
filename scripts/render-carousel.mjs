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
// Real Axmed mark + wordmark in every .brand slot (white mark on indigo slides)
const markSvg = (main) => fs.readFileSync(path.join(root, "brand/logo/axmed-mark.svg"), "utf8").replaceAll('fill="#261C7A"', `fill="${main}"`);
const lockup = (main) => `<span style="display:inline-flex;align-items:center;gap:14px"><span style="height:56px;display:inline-block">${markSvg(main).replace("<svg ", '<svg style="height:56px;width:auto" ')}</span>Axmed</span>`;
await page.evaluate(({ light, dark }) => {
  document.querySelectorAll(".brand").forEach((el) => {
    const s = el.closest(".slide");
    const onDark = s && [...s.classList].some((c) => ["cover", "cta", "dark"].includes(c) || c.startsWith("bg-") && !c.endsWith("-light"));
    el.innerHTML = onDark ? dark : light;
  });
}, { light: lockup("#261C7A"), dark: lockup("#FFFFFF") });
// Brand pattern backgrounds: add class bg-<pattern> to any slide (e.g. bg-strands-dark, bg-supergraphic, bg-routes-light, bg-signature-dark)
const pdir = path.join(root, "brand/patterns");
const bgCss = fs.readdirSync(pdir).filter((f) => f.endsWith(`_${W}x${H}.svg`)).map((f) => {
  const name = f.replace(`_${W}x${H}.svg`, "");
  const dark = !name.endsWith("-light");
  // quiet zone: the pattern fades out where the copy sits (left/bottom), stays full on the right
  const fade = dark ? "28,21,96" : "247,249,253";
  const veil = `linear-gradient(100deg, rgba(${fade},.96) 0%, rgba(${fade},.88) 48%, rgba(${fade},0) 82%)`;
  return `.slide.bg-${name}{background:${veil}, url("file://${path.join(pdir, f)}") center/cover no-repeat !important}` +
    `.slide.bg-${name}::before{display:none}` +
    (dark ? `.slide.bg-${name} h1,.slide.bg-${name} h2,.slide.bg-${name} .brand,.slide.bg-${name} .num,.slide.bg-${name} blockquote{color:#fff}.slide.bg-${name} p.lead,.slide.bg-${name} cite,.slide.bg-${name} .source,.slide.bg-${name} .page,.slide.bg-${name} li{color:#D9D6F5}` : "");
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
