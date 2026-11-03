# Case study: CreatorKit AI

## Context

Creator and short-form teams need to move from campaign intent to working experience quickly, but the most common AI design workflows trade speed for consistency and accountability. Free-form generated UI can invent patterns, violate tokens, conceal reasoning, and leave no useful training data.

## Thesis

Treat generative design as a governed compiler pipeline, not a chatbot canvas. Agents interpret and critique; schemas and the design system own what can render; people decide what is aesthetically preferable.

## What was built

CreatorKit provides six product pages and a complete brief-to-evidence journey. Four sample briefs feed seven specialist roles. The composer emits a validated `PrototypeSpec` using five approved component blocks in the reference flow. The renderer turns that data into an interactive mobile prototype, while the art director creates traceable asset requests and two reviewable variants.

The user can inspect every agent handoff, approve/reject/regenerate an asset, compare variants, record a six-dimension human label, run validation, and export the full artifact package.

## Key decisions

### 1. Generate a spec, not code

The browser never executes arbitrary model-authored JavaScript. This shrinks the safety surface and makes compliance deterministic. The cost is less unconstrained composition, which is appropriate for an internal design-system tool.

### 2. Make the system readable by machines

Signal Garden begins as structured JSON and compiles into runtime CSS, TypeScript, docs, and a manifest. Fourteen component contracts describe purpose, variants, props, tokens, accessibility, examples, anti-patterns, and composition. The same data powers the librarian and the local tool server.

### 3. Bound critique

The orchestrator allows at most two revision loops. The reference fixture performs one targeted spacing revision. This avoids endless agent self-review and keeps latency/cost predictable.

### 4. Preserve provenance

Human labels, AI critiques, and synthetic assets are distinct types and visible UI states. Only explicit human submissions enter JSONL export. Mock usage fields remain unavailable rather than estimated.

## Design direction

The original Signal Garden identity uses warm editorial surfaces, dense evidence typography, lime signals, coral urgency, orbital linework, and a contrast-safe violet. It deliberately avoids the visual language, logos, and proprietary interface patterns of existing creator platforms.

## Outcomes

Measured technical outcomes from the completed local project:

- 76 design-token leaves compile into four targets.
- 14 reusable components have structured contracts and Storybook coverage.
- 7 agent roles produce 8 trace events in the reference one-revision flow.
- 4 domain-specific sample briefs generate valid prototypes and at least 2 asset requests each.
- 17/17 Vitest checks and 12/12 Playwright checks pass.
- axe reports 0 violations across the six product pages and completed primary journey.
- 18/18 route×viewport overflow checks and 1/1 visual baseline pass.
- The reference spec measures 100% token-root compliance and 0 unknown components.

No preference lift, productivity improvement, conversion, revenue, or model-training gain is claimed because those outcomes were not measured.

## What I would test next

Run a consented study with creator marketers and design-system contributors. Compare time-to-approved-prototype and agreement on aesthetic labels against an ungoverned prompting baseline. Version the exported datasets, reserve a held-out brief set, and only then evaluate ranking or LoRA experiments.
