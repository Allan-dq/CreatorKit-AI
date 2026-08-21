# AI-assisted development

## Actual workflow used

This project was built with Codex as the coding collaborator and the built-in ImageGen tool for one original campaign asset. The workflow was iterative:

1. inspect the workspace and available runtime;
2. establish the end-to-end mock journey first;
3. encode schemas, tokens, component contracts, and the deterministic renderer;
4. add orchestration, provider boundaries, assets, labeling, and evaluation;
5. run strict TypeScript, Vitest, Storybook, production build, and Playwright;
6. inspect the live UI in a browser, review console output, and fix visual/accessibility regressions;
7. capture final screenshots and write evidence-bound documentation.

The generated social asset used an original prompt centered on Signal Garden’s editorial creator-workflow identity. It was reviewed before being added to `public/demo-assets/creator-kit-workflow.png`; no third-party brand, logo, or copyrighted UI was requested.

## Human judgment that remained essential

- Choosing an original visual direction rather than imitating the target employer.
- Turning a broad role description into a credible internal-tool workflow.
- Deciding that model output must be a spec instead of arbitrary code.
- Setting the two-revision ceiling and separating human, AI, and synthetic provenance.
- Adjusting compact-text colors after real axe measurements.
- Reviewing layout hierarchy at desktop and mobile sizes.
- Rejecting claims about preference lift, productivity, business conversion, or training improvement without data.

## Safeguards for vibe coding

- Zod is the boundary between generated data and application state.
- The renderer maps only approved component names.
- Component contracts give agents structured allowed/invalid usage.
- The local tool surface validates specs before UI generation.
- Provider output receives timeout, retry, token, JSON, and schema limits.
- Secrets stay in ignored environment files.
- Test failures and console warnings are treated as product defects.
- Generated assets keep provider/prompt/seed/provenance history.

## Reproducing the workflow in Cursor or Claude Code

Point the agent at `docs/agent-workflow.md`, start the local design-system tool server, and instruct it to retrieve contracts before editing UI. Require a successful `validate_prototype_spec` response and the standard `pnpm validate`/Playwright checks before accepting changes.

The important practice is not the editor brand; it is keeping the agent inside machine-readable constraints, making decisions inspectable, and reserving aesthetic and evidence judgments for humans.
