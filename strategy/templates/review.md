# Review: <ID> <title>

<!--
One file per asset, kept next to it as review.md. Newest round at the top.
Each reviewer adds one block per round and only reads the asset's files, never the maker's reasoning.
Verdict is PASS or FIX. A FIX has at most 7 lines, and each line quotes the exact text and gives the fix.
After two FIX rounds the producer stops and asks a person: a third round usually means the brief is wrong.
The fact checker pastes the script output; it is the evidence, not a summary of it.
-->

Status after this round: <in-review | needs-fix | ready-for-approval>

## Round 1 (YYYY-MM-DD)

| Reviewer | Verdict | Checked |
|---|---|---|
| Facts | PASS / FIX | `node scripts/check-numbers.mjs <folder> --final` |
| Brand | PASS / FIX | `brand/brand-guidelines.md`, central test |
| Design | PASS / FIX | Brand kit rules, Hallmark lint, renders at full size |

### Facts

```
<check-numbers output>
```

- "<exact text>" → <fix>

### Brand

- "<exact text>" → <fix>

### Design

- <element, slide or render> → <fix>
