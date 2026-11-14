#!/usr/bin/env bash
# Installs the community skills this repo relies on, into ./.claude/skills (project scope).
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ Marketing skills (coreyhaines31/marketingskills)"
npx -y skills add coreyhaines31/marketingskills -a claude-code -y \
  --skill copywriting social-content email-sequence launch-strategy \
          marketing-psychology product-marketing-context copy-editing content-strategy

echo "→ Remotion skills (remotion-dev/skills)"
npx -y skills add remotion-dev/skills -a claude-code -y

echo "→ Optional extras (uncomment to install)"
# npx -y skills add charlie947/social-media-skills -a claude-code -y
# npx -y skills add jpeggdev/humanize-writing -a claude-code -y

echo "→ Node deps for render scripts"
npm install --silent
npx -y playwright install chromium

cat <<'MSG'

Done. Two steps left inside Claude Code:
  1. /plugin marketplace add anthropics/skills   (then accept document-skills when prompted)
  2. Make sure `uv` is installed (brew install uv) so the ElevenLabs MCP can start.
Our own axmed-* skills in .claude/skills always take priority over community ones.
MSG
