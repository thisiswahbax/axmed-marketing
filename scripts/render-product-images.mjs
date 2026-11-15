#!/usr/bin/env node
// Render the eight How it works product scenes (.ps in site/index.html) to brand/product-images/ at 2x,
// plus overview.jpg with all eight. Edit the scenes in the HTML, then re-run this.
// Usage: npm install && npx playwright install chromium && node scripts/render-product-images.mjs
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "brand/product-images");
const names = [
  "buyers-01-bring-your-list", "buyers-02-compare-quotes", "buyers-03-checked-before-it-ships", "buyers-04-tracked-to-every-site",
  "suppliers-01-see-pooled-demand", "suppliers-02-quote-once", "suppliers-03-get-qualified", "suppliers-04-ship-and-get-paid",
];
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
await page.goto("file://" + path.join(root, "site/index.html"), { waitUntil: "networkidle" });
// Every scene at rest: both panels shown, every step in focus, a fixed frame size, no transitions.
await page.addStyleTag({ content: `
  *, *::before, *::after { transition: none !important; animation: none !important; }
  .hw .panel[hidden] { display: block !important; }
  .ps { width: 760px !important; height: 560px !important; aspect-ratio: auto !important; }
` });
await page.evaluate(() => document.querySelectorAll(".hw-step").forEach((s) => s.classList.add("on")));
const scenes = await page.$$(".hw .ps");
if (scenes.length !== names.length) throw new Error(`expected ${names.length} scenes, found ${scenes.length}`);
for (const [i, el] of scenes.entries()) {
  await el.scrollIntoViewIfNeeded();
  await el.screenshot({ path: path.join(out, names[i] + ".png"), omitBackground: true });
  console.log("wrote", names[i] + ".png");
}

// overview: the eight in a 4 x 2 grid on paper
const imgs = names.map((n) => "data:image/png;base64," + fs.readFileSync(path.join(out, n + ".png")).toString("base64"));
const sheet = await browser.newPage({ viewport: { width: 1600, height: 640 }, deviceScaleFactor: 2 });
await sheet.setContent(`<body style="margin:0;padding:40px;background:#F7F6F3;display:grid;grid-template-columns:repeat(4,1fr);gap:24px">
  ${imgs.map((src) => `<img src="${src}" style="width:100%;display:block">`).join("")}</body>`);
await sheet.screenshot({ path: path.join(out, "overview.jpg"), type: "jpeg", quality: 88, fullPage: true });
console.log("wrote overview.jpg");
await browser.close();
