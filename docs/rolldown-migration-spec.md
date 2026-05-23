# Spec: Migrate Svelteup from esbuild to Rolldown

## Assumptions

1. Svelteup keeps the same public CLI, JavaScript API, config file names, and examples.
2. The migration may refactor internal bundling and development-server code. Users should not need to rewrite `svelteup.config.js`.
3. The first implementation phase adds tests around current behavior before replacing esbuild.
4. Rolldown is added as the bundler dependency. esbuild and esbuild-svelte are removed only after parity tests pass.
5. Development mode still supports watch rebuilds and static file serving.

## Objective

Replace Svelteup's esbuild-based bundling pipeline with a Rolldown-based pipeline while preserving the current user-facing behavior:

- File entries bundle imported Svelte components into one output graph.
- Directory entries bundle each top-level `.svelte` file as a separate entry.
- `compilerOptions.customElement` defaults to `true`.
- `preprocess`, `compilerOptions`, `outdir`, `watch`, `dev`, and `serveOptions` keep working through the existing config and API.
- CLI commands continue to use `svelteup [entry] [options]`.
- Development server internals may change, but `-d` and `serveOptions` keep their public behavior.

Success means users can upgrade without changing their Svelteup usage, and the test suite proves behavior before and after the bundler swap.

## Tech Stack

- TypeScript package.
- CLI: `sade`.
- Config loading: `bundle-require`.
- Previous bundler: `esbuild` with `esbuild-svelte`.
- Current bundler: `rolldown`.
- Svelte compilation path: local Rolldown plugin that uses `svelte/compiler`.
- Tests: `uvu` plus browser checks through `puppeteer` and `sirv`.

Rolldown references:

- Rolldown exposes `rolldown()` and `watch()` APIs compatible with Rollup, plus an experimental `build()` API.
- Rolldown separates input options from output options in its JavaScript API.
- Rolldown's plugin API is compatible with Rollup plugins.

## Commands

```bash
pnpm install
pnpm run build
pnpm test
pnpm run format
```

Additional migration verification commands:

```bash
pnpm test
pnpm run build
node bin.js examples/custom-element/components/index.js -o examples/custom-element/public/dist
node bin.js examples/custom-element-split/components -o examples/custom-element-split/public/dist
node bin.js examples/no-custom-element/components/index.js -o examples/no-custom-element/public/dist -c examples/no-custom-element/svelteup.config.ts
```

## Project Structure

```text
src/
  command/            Build, watch, and serve command implementations.
  interface/          Public option types used by CLI, config, and JS API.
  plugins/            Development plugins such as live reload.
  utils/              Entry generation utilities.
tests/
  custom-element/     Browser test for custom-element bundling.
  custom-element-split/
                      Browser test for directory-entry bundling.
  no-custom-element/  Browser test for client-rendered Svelte mode.
  setup/              Puppeteer and static-server test helpers.
examples/
  custom-element/
  custom-element-split/
  no-custom-element/
docs/
  rolldown-migration-spec.md
  rolldown-migration-plan.md
```

## Code Style

Keep the existing TypeScript module style and option-shape conventions.

```typescript
const buildCommand = async (opts: Options) => {
  const { entryPoints, outdir, minify } = opts;

  await bundle({
    entryPoints,
    outdir,
    minify,
    sourcemap: false,
    preprocess: opts.preprocess,
    compilerOptions: opts.compilerOptions,
  });
};
```

Conventions:

- Keep user-facing option names stable.
- Put bundler-specific translation behind a local helper or adapter.
- Prefer explicit async handling for bundler calls.
- Do not expose Rolldown-specific options through the public API until a separate feature requires them.

## Testing Strategy

Phase 1 adds tests against the current esbuild behavior. Those tests become the parity contract for the Rolldown replacement.

Test levels:

- Unit tests cover config merging, entry resolution, directory entry generation, and bundler option translation.
- Integration tests call the public `svelteup()` API and inspect generated files.
- Browser tests keep the existing custom-element and no-custom-element rendering checks.
- End-to-end checks run the CLI against example projects and verify generated output loads in a browser.
- Dev-server tests run `svelteup -d` against a fixture, verify static serving, trigger a rebuild, and close the server cleanly.

Coverage expectations:

- File entry and directory entry modes both tested.
- `customElement: true` and `customElement: false` both tested.
- `preprocess` path tested with the existing no-custom-element example.
- `watch` and `dev` are tested at least at the process/API level, with cleanup assertions so no watcher or server leaks remain.
- `serveOptions.servedir`, `serveOptions.host`, and `serveOptions.port` are covered if the dev-server implementation changes.

## Boundaries

- Always: preserve public CLI flags, JS API shape, config names, and default output behavior.
- Always: add tests before changing the bundler implementation.
- Always: close Rolldown bundles/watchers after builds to avoid resource leaks.
- Always: preserve `svelteup -d` behavior while allowing the dev-server implementation to be refactored.
- Ask first: adding new public config fields, changing output file names, changing supported Node version, or changing CLI flags.
- Ask first: replacing the test runner or changing release scripts.
- Never: remove existing examples to make the migration pass.
- Never: delete failing tests without documenting and replacing the covered behavior.
- Never: commit generated `dist` output unless the release flow explicitly requires it.

## Success Criteria

- `pnpm test` passes with meaningful test counts.
- `pnpm run build` passes.
- Existing examples build through the CLI.
- Development mode serves files, rebuilds on source change, and shuts down cleanly in tests.
- Browser checks pass for custom elements, split custom elements, and `customElement: false` mode.
- `package.json` no longer depends on `esbuild` or `esbuild-svelte` after Rolldown parity is complete.
- README remains accurate after the migration.

## Open Questions

1. Release versioning remains open: this can be a minor release if behavior is treated as unchanged, or a major release if the bundler dependency change is considered breaking.
