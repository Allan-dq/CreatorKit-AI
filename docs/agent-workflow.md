# Agent workflow and design-system tools

## Roles

| Role | Structured input | Structured output | Decision boundary |
| --- | --- | --- | --- |
| Brief Analyst | `DesignBrief` | Audience, task, content, interaction, business constraints | Does not rewrite the source brief |
| System Librarian | Analysis + manifest | Approved components, tokens, patterns, constraints | Returns the narrowest permitted vocabulary |
| Prototype Composer | Analysis + library + `PrototypePlan` | Validated `PrototypeSpec` | Cannot output executable code |
| Asset Art Director | Brief + palette | `AssetRequest[]` | Preserves provider and synthetic provenance |
| Visual QA Critic | Prototype spec | `AgentCritique` | Reviews hierarchy, spacing, contrast, consistency, fit, clarity |
| A11y + Validation | Revised spec | `AgentCritique` + tool results | Blocks unknown components or failed validation |
| Orchestrator | Shared structured state | `WorkflowResult` + traces | Maximum two critique/revision loops |

Every trace records role, input, output, ordered tool calls, validation failures, decision, status, latency, and nullable usage/cost fields. Mock trace timestamps and outputs are deterministic; per-step latency is measured at runtime.

## Revision policy

The visual critic can request a revision. The orchestrator increments a counter and gives the composer only the critique and current spec identity. The loop stops when approved or after two revisions. This prevents unbounded self-critique and makes each change attributable.

## Provider architecture

`StructuredProvider` exposes one operation: generate a schema-bound object. Mock mode is implemented locally. The optional OpenAI Responses adapter supports brief-to-plan, prototype composition, critique, and asset prompt requests through `POST /api/workflow`.

Provider safeguards:

- model and provider selected through environment variables;
- API key required only in provider mode;
- 24-second timeout and one retry;
- 2,400 output-token ceiling;
- response storage disabled;
- JSON parsing and Zod validation before returning output;
- cost remains unavailable unless measured from provider data.

## Local design-system tool server

Start the JSON-lines interface:

```bash
pnpm exec tsx packages/design-system-mcp/src/server.ts
```

Tools:

- `list_design_tokens({ category? })`
- `list_components()`
- `get_component_contract({ name })`
- `search_design_patterns({ query })`
- `validate_prototype_spec({ spec })`

The smoke suite checks structured token results, all 14 component summaries, contract retrieval, pattern search, and a real generated spec.

## Using it from AI coding agents

Codex, Cursor, or Claude Code can wrap the process as a local stdio command. The recommended generation sequence is:

1. Call `list_components` and `search_design_patterns` before proposing UI.
2. Retrieve exact contracts for each intended component.
3. Retrieve only the relevant token category rather than copying the whole manifest into context.
4. Produce a `PrototypeSpec`—never browser JavaScript.
5. Call `validate_prototype_spec` and repair any returned issue before rendering.

Example request/response:

```json
{"id":1,"tool":"list_components","input":{}}
{"id":1,"result":{"components":[{"name":"Button","purpose":"...","variants":["primary","secondary","ghost","danger"]}],"count":14}}
```

This repository calls the surface “MCP-compatible” because it implements the required structured tools over stdio JSON lines. A production integration can add standard MCP initialization and discovery messages without changing the underlying tool contracts.
