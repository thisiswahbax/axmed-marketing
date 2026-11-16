#!/usr/bin/env node
// Open the Axmed landing page and the brand kit locally. No install needed: Node only.
//
//   npm start                    → http://localhost:3094 (landing page), then opens your browser
//   node scripts/serve.mjs --port 4000 --no-open
//
// Only site/ and brand/ are served: the rest of the repo (.env, .git, strategy, drafts) never is.
// Requests must come to localhost, which blocks DNS-rebinding pages from reading files through it.
// The landing page's /buy and /sell links point at routes on the live site; here they open the
// local buyer and supplier pages instead.
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

// Only these folders can be read. Real paths are compared, so a symlink can't lead outside them.
const ALLOWED = ["site", "brand"].map((d) => fs.realpathSync(path.join(ROOT, d)) + path.sep);
const HOSTS = new Set([`localhost:${PORT}`, `127.0.0.1:${PORT}`, `[::1]:${PORT}`]);
const notFound = (res) => res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");

// the file to serve, or null: anything hidden, outside site/ and brand/, or missing
function resolve(url) {
  // any segment starting with a dot (.env, .ENV, .git) is refused, whatever its case or separator
  if (url.split(/[\\/]/).some((seg) => seg.startsWith("."))) return null;
  const candidates = [path.join(ROOT, url), path.join(ROOT, "site", url)];   // site.css, img/… are asked from /
  for (let file of candidates) {
    if (!fs.existsSync(file)) continue;
    if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) continue;
    const real = fs.realpathSync(file);
    if (ALLOWED.some((dir) => real.startsWith(dir)) && fs.statSync(real).isFile()) return real;
  }
  return null;
}

const server = http.createServer((req, res) => {
  if (!HOSTS.has((req.headers.host || "").toLowerCase())) { res.writeHead(403, { "Content-Type": "text/plain" }).end("Forbidden host"); return; }
  if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405).end(); return; }
  let url;
  try { url = decodeURIComponent(new URL(req.url, "http://localhost").pathname).replace(/\/+$/, "") || "/"; }
  catch { notFound(res); return; }
  if (REDIRECTS[url]) { res.writeHead(302, { Location: REDIRECTS[url] }).end(); return; }
  const file = resolve(ROUTES[url] || url);
  if (!file) { notFound(res); return; }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
  if (req.method === "HEAD") { res.end(); return; }
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
