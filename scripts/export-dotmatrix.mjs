#!/usr/bin/env node
// Export a dot-matrix illustration as an MP4 loop + a PNG still.
// Usage: node scripts/export-dotmatrix.mjs <shape> [theme=night] [size=1080] [seconds=6]
import { chromium } from "playwright"; import { execSync } from "node:child_process";
import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
const [, , shape = "shield", theme = "night", size = "1080", secs = "6"] = process.argv;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "brand/dot-matrix/exports"); fs.mkdirSync(out, { recursive: true });
const tmp = fs.mkdtempSync("/tmp/dm-"); const fps = 30, N = Math.round(+secs * fps);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +size, height: +size } });
await p.goto(`file://${root}/brand/dot-matrix/index.html?shape=${shape}&theme=${theme}&size=${size}&manual=1`);
await p.addStyleTag({ content: "h1,figcaption{display:none}.gal{padding:0;max-width:none}.gal canvas{border-radius:0}" });
const c = p.locator("canvas");
for (let i = 0; i < N; i++) { await p.evaluate(([k, t]) => window["dm_" + k].drawAt(t), [shape, i / fps]); await c.screenshot({ path: `${tmp}/f${String(i).padStart(4, "0")}.png` }); }
await p.evaluate(([k]) => window["dm_" + k].drawAt(2.0), [shape]); await c.screenshot({ path: `${out}/${shape}-${theme}.png` });
await b.close();
execSync(`ffmpeg -y -loglevel error -framerate ${fps} -i ${tmp}/f%04d.png -c:v libx264 -pix_fmt yuv420p -crf 20 ${out}/${shape}-${theme}.mp4`);
fs.rmSync(tmp, { recursive: true }); console.log("✓", `${out}/${shape}-${theme}.mp4`, "+ png");
