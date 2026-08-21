# Signal Garden design system

Signal Garden is an original editorial system for creator tooling. Its visual grammar combines warm paper, high-contrast ink, signal lime, coral, and an accessibility-adjusted violet with compact mono evidence labels and restrained orbital geometry.

## Token source and compilation

The source of truth is `packages/design-tokens/src/tokens.json`. It contains 76 leaves across:

- colors and light/dark themes;
- sans/display/mono typography, sizes, weights, line heights;
- spacing, radii, shadows, and motion;
- breakpoints and state tokens;
- focus, disabled, selected, loading, and error requirements.

Run `pnpm tokens:build` to emit CSS custom properties, typed TypeScript constants, Markdown documentation, and a machine-readable manifest. Generated files are deterministic and verified by unit tests.

## Accessibility rules

- Ink is the default body text on paper and white surfaces.
- Lime is a surface/accent color and only receives ink text.
- Violet was darkened to `#563FCC` so compact text clears AA contrast on paper and white.
- Muted text uses `#5F605A`, clearing AA contrast on paper and white.
- Focus uses a two-part ring and never relies on color alone.
- Motion tokens include reduced-motion overrides.
- Error, selected, approved, and rejected states combine color with text or iconography.

## Reusable components

Fourteen components are implemented and documented in Storybook:

1. Button
2. IconButton
3. Input
4. Textarea
5. Select
6. Tabs
7. Card
8. Badge
9. Dialog
10. Tooltip
11. Toast
12. Sidebar
13. AssetCard
14. PrototypeFrame

The controls expose native semantics, labels, disabled/loading state, visible focus, and keyboard behavior. Tabs implement Arrow Left/Right/Home/End; Dialog uses the native modal element with Escape and an accessible name; feedback controls associate hints and errors.

## AI-readable contracts

`packages/design-system/src/contracts.ts` validates every contract with `ComponentContractSchema`. A contract includes:

- name and purpose;
- allowed variants;
- required and optional props;
- applicable tokens;
- accessibility rules;
- valid and invalid usage;
- composition constraints.

Agents retrieve these contracts through the System Librarian or the local tool server. A contract is an enforceable design vocabulary, not prose appended to a prompt.

## Deterministic composition

The `PrototypeSpec` schema permits only known block names and serializable props/content. `PrototypeRenderer` owns the component implementation. Generated JavaScript, dynamic imports, HTML strings, and arbitrary CSS are outside the contract and cannot execute.

## Themes and responsiveness

The design-system page can switch between light and dark token aliases. Components use responsive product layouts at the mobile (`760px`), tablet (`900px`), and wide-workspace (`1180px`) boundaries while tokens also publish machine-readable breakpoint values.

## Storybook

Run `pnpm storybook`. Stories cover actions, form controls, navigation/feedback, asset cards, and prototype compositions. `pnpm storybook:build` produces the static documentation bundle and runs with the same compiled token CSS.
