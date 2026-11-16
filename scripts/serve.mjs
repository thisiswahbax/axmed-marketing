#!/usr/bin/env node
// Open the Axmed landing page and the brand kit locally. No install needed: Node only.
//
//   npm start                    → http://localhost:3094 (landing page), then opens your browser
//   node scripts/serve.mjs --port 4000 --no-open
//
// The repo root is served, so pages that reach into brand/ keep working. The landing page's
// /buy and /sell links point at routes on the live site; here they open the local buyer and
// supplier pages instead.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const PORT = Number(args[args.indexOf("--port") + 1]) || 3094;
const OPEN = !args.includes("--no-open");

const ROUTES = { "/": "/site/index.html", "/buy": "/site/buyers.html", "/sell": "/site/suppliers.html" };
// the kit uses relative paths, so send the browser to its real folder rather than serving it at /kit
const REDIRECTS = { "/kit": "/brand/kit/" };
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".gif": "image/gif", ".mp4": "video/mp4", ".woff2": "font/woff2", ".ico": "image/x-icon" };

const server = http.createServer((req, res) => {
  let url = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/\/+$/, "") || "/";
  if (REDIRECTS[url]) { res.writeHead(302, { Location: REDIRECTS[url] }).end(); return; }
  url = ROUTES[url] || url;
  let file = path.join(ROOT, url);
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403).end(); return; }   // stay inside the repo
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  // the landing page's own files (site.css, img/…) sit in site/; serve them from there when asked from /
  if (!fs.existsSync(file) && fs.existsSync(path.join(ROOT, "site", url))) file = path.join(ROOT, "site", url);
  if (!fs.existsSync(file) || /(^|\/)\.env/.test(url)) { res.writeHead(404, { "Content-Type": "text/plain" }).end(`Not found: ${url}`); return; }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
  fs.createReadStream(file).pipe(res);
});

server.on("error", (e) => {
  console.error(e.code === "EADDRINUSE" ? `Port ${PORT} is busy. Try: node scripts/serve.mjs --port ${PORT + 1}` : e.message);
  process.exit(1);
});

server.listen(PORT, "127.0.0.1", () => {
  const home = `http://localhost:${PORT}`;
  console.log(`Axmed landing page   ${home}\nBuyers / suppliers   ${home}/buy   ${home}/sell\nBrand kit            ${home}/kit\n\nCtrl+C to stop.`);
  if (OPEN) {
    const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "cmd" : "xdg-open";
    const cmdArgs = process.platform === "win32" ? ["/c", "start", "", home] : [home];
    spawn(cmd, cmdArgs, { stdio: "ignore", detached: true }).on("error", () => {}).unref();
  }
});
