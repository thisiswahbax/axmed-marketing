#!/usr/bin/env node
// Usage: node scripts/utm.mjs <url> <source> <medium> <asset-id> [campaign]
const [, , url, source, medium, content, campaign = "c01-every-birth"] = process.argv;
if (!url || !source || !medium || !content) {
  console.error("usage: utm.mjs <url> <linkedin|email|whatsapp|gtm> <organic|paid|direct> <asset-id> [campaign]");
  process.exit(1);
}
const u = new URL(url);
Object.entries({ utm_source: source, utm_medium: medium, utm_campaign: campaign, utm_content: content })
  .forEach(([k, v]) => u.searchParams.set(k, v));
console.log(u.toString());
