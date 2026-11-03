# Evaluation methodology

CreatorKit separates automated evidence, human labels, AI critique, synthetic fixtures, and hypothetical business outcomes.

## What is measured

| Area | Method | Evidence |
| --- | --- | --- |
| Schema validity | Zod parses briefs, plans, specs, assets, critiques, labels, evaluations, and traces | Vitest + evaluation result |
| Token compliance | Every `tokenRefs` root checked against governed categories | 15/15 refs in the reference fixture |
| Component usage | Spec blocks checked against the contract map | 5 valid / 0 invalid in the fixture |
| Accessibility | axe-core on all six product pages and completed Studio flow | 0 detected violations in the latest suite |
| Keyboard | Component test and real-browser tab navigation | 2/2 checks |
| Responsive | Six routes × three viewports checked for horizontal overflow | 18/18 checks |
| Visual regression | Chromium full-page reference for Studio | 1/1 baseline |
| Agent reliability | Trace status, failures, retries, and bounded revision count | Exported per workflow |
| Generation latency | Real elapsed mock workflow time | Measured per run; machine-dependent |
| Preference labels | Explicit local human submissions only | Current repository baseline: 0 |
| Asset decisions | Explicit approve/reject actions | Measured per local session/export |

## Test commands

`pnpm validate` verifies tokens, strict TypeScript, lint, unit, component, integration, and MCP behavior. `pnpm test:e2e` covers the end-to-end workflow, page-level accessibility, keyboard tabs, responsive sizes, and visual regression. `pnpm test:html` checks the production-rendered output after `pnpm build`.

## Preference data

A human label contains the chosen variant or tie, six 1–5 aesthetic scores, free-form rationale, brief ID, timestamp, and `provenance: "human"`. AI critiques use a separate schema and never enter the human export. Demo assets and mock agent output are labeled synthetic/demo.

JSONL export is suitable for versioning. `training/prepare-preferences.mjs` filters out ties and any non-human provenance, then emits pairwise ranking records. Actual training requires a documented asset join, train/validation split, licensing review, and held-out comparison.

## Visual regression process

The baseline is generated intentionally with `pnpm exec playwright test tests/e2e/visual.spec.ts --update-snapshots`. Routine runs compare the current Studio page against that committed reference with a 1% maximum pixel-difference ratio. Baselines are updated only after human visual review.

## Evidence boundaries

- Passing axe does not prove full WCAG conformance; it is automated evidence plus keyboard checks.
- Local fixture compliance does not imply model accuracy on arbitrary briefs.
- No preference win rate is reported without a real human dataset.
- No efficiency improvement is reported without a measured baseline workflow.
- Revenue and creator conversion are hypothetical downstream metrics only.
- Missing data appears as **Not measured**, never as a fabricated zero or percentage.
