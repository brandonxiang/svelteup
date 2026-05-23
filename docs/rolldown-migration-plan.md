# Implementation Plan: Rolldown Migration

## Overview

This plan migrates Svelteup from esbuild to Rolldown in three phases: first lock down current behavior with tests, then replace the internal bundler, then run end-to-end verification against the examples and CLI. The public CLI, JavaScript API, and config contract stay unchanged.

## Architecture Decisions

- Add a bundler adapter before swapping implementations. `src/command/*` should call a local bundling abstraction instead of importing the bundler directly.
- Use Rolldown's Rollup-compatible API as the stable integration point. The official `build()` API is experimental, so `rolldown()` and `watch()` are safer for package internals.
- Keep static serving separate from bundling. Rolldown covers bundling and watch rebuilds; the dev server can be refactored as long as `-d` and `serveOptions` keep their public behavior.
- Treat tests as the migration contract. Any behavior not covered before the swap is a migration risk.

## Dependency Graph

```text
Current behavior tests
  |
  v
Bundler adapter contract
  |
  v
Rolldown option mapping and Svelte plugin integration
  |
  +--> build command
  +--> watch command
  +--> dev serve command
  |
  v
CLI and example end-to-end verification
```

## Task List

### Phase 1: Baseline Tests

## Task 1: Fix test discovery and baseline reporting

**Description:** Make the existing `pnpm test` command report the actual test files and passing assertions clearly before adding new coverage.

**Acceptance criteria:**

- [x] `pnpm test` discovers all existing `*.test.mjs` files.
- [x] Test output reports non-zero passed tests when existing assertions pass.
- [x] No browser test is removed.

**Verification:**

- [x] Run `pnpm test`.
- [x] Confirm output reports the existing custom-element, split, and no-custom-element assertions as passed.

**Dependencies:** None

**Files likely touched:**

- `package.json`
- `tests/**/*.test.mjs`

**Estimated scope:** Small

## Task 2: Add unit tests for config and entry resolution

**Description:** Cover the behavior in `src/index.ts` that resolves CLI entry, config entry, default entry, config file loading, and directory entry validation.

**Acceptance criteria:**

- [ ] File entry, directory entry, missing entry, and unsupported entry paths are tested.
- [ ] Config precedence is tested: defaults, config file, CLI/API options, explicit CLI entry.
- [ ] Tests avoid process-level exits by isolating or refactoring error handling in a small, controlled way.

**Verification:**

- [ ] Run `pnpm test`.
- [ ] Run `pnpm run build`.

**Dependencies:** Task 1

**Files likely touched:**

- `src/index.ts`
- `tests/unit/*.test.mjs`

**Estimated scope:** Medium

## Task 3: Add bundler-output integration tests

**Description:** Add tests that call `svelteup()` and assert generated output files exist and contain expected custom element/client rendering behavior.

**Acceptance criteria:**

- [ ] Single file entry writes expected output.
- [ ] Directory entry writes one output per top-level `.svelte` entry.
- [ ] `compilerOptions.customElement: false` continues to render through the no-custom-element example.

**Verification:**

- [ ] Run `pnpm test`.
- [ ] Inspect generated test output directories are ignored or cleaned.

**Dependencies:** Task 1

**Files likely touched:**

- `tests/**/*.test.mjs`
- `tests/setup/*.mjs`
- `.gitignore` if a new temp output directory is needed

**Estimated scope:** Medium

### Checkpoint: Baseline

- [ ] `pnpm test` passes with meaningful test counts.
- [ ] `pnpm run build` passes.
- [ ] Current esbuild behavior is covered well enough to detect migration regressions.

### Phase 2: Replace Bundler Internals

## Task 4: Introduce a bundler adapter

**Description:** Create a small internal module that owns bundler input/output options and Svelte compiler/plugin configuration. Keep it backed by esbuild at first.

**Acceptance criteria:**

- [ ] `buildCommand`, `watchCommand`, and `serveCommand` stop importing esbuild directly.
- [ ] The adapter exposes build and watch operations needed by the command layer.
- [ ] Existing tests still pass with esbuild behind the adapter.

**Verification:**

- [ ] Run `pnpm test`.
- [ ] Run `pnpm run build`.

**Dependencies:** Baseline checkpoint

**Files likely touched:**

- `src/command/build.ts`
- `src/command/watch.ts`
- `src/command/serve.ts`
- `src/bundler/*.ts`

**Estimated scope:** Medium

## Task 5: Replace build mode with Rolldown

**Description:** Swap the adapter's build implementation from esbuild to Rolldown for non-watch builds.

**Acceptance criteria:**

- [ ] Rolldown receives `input`, `output.dir`, `format: 'esm'`, minify, sourcemap, and plugin settings equivalent to current behavior.
- [ ] File and directory entries generate browser-loadable ESM output.
- [ ] Bundles are closed after write.

**Verification:**

- [ ] Run `pnpm test`.
- [ ] Run `pnpm run build`.
- [ ] Run the CLI against `examples/custom-element` and `examples/custom-element-split`.

**Dependencies:** Task 4

**Files likely touched:**

- `src/bundler/*.ts`
- `package.json`
- `pnpm-lock.yaml`

**Estimated scope:** Medium

## Task 6: Replace watch mode with Rolldown watch

**Description:** Implement watch mode through Rolldown's `watch()` API and preserve the current command behavior.

**Acceptance criteria:**

- [ ] `svelteup components -w` rebuilds when a module changes.
- [ ] Watcher results are closed on `BUNDLE_END`.
- [ ] The command exposes a cleanup path for tests and future programmatic usage.

**Verification:**

- [ ] Run watch-mode integration test with a temporary fixture.
- [ ] Run `pnpm test`.

**Dependencies:** Task 5

**Files likely touched:**

- `src/bundler/*.ts`
- `src/command/watch.ts`
- `tests/unit/*.test.mjs`

**Estimated scope:** Medium

## Task 7: Refactor dev serve mode

**Description:** Refactor development serving around Rolldown watch rebuilds. The implementation can move away from esbuild's `serve()` shape, but the CLI and config behavior must remain stable.

**Acceptance criteria:**

- [ ] `svelteup components -d` serves `serveOptions.servedir`.
- [ ] `serveOptions.host` and `serveOptions.port` are honored.
- [ ] Source changes rebuild bundles.
- [ ] Browser refresh or live reload behavior is preserved, or a deliberate replacement behavior is documented and tested.
- [ ] Server and watcher can be closed in tests.

**Verification:**

- [ ] Run browser test against dev mode.
- [ ] Run a dev-server lifecycle test that starts, requests a static asset, changes a source file, observes rebuild output, and shuts down.
- [ ] Run `pnpm test`.

**Dependencies:** Task 6

**Files likely touched:**

- `src/command/serve.ts`
- `src/plugins/livereloadPlugin.ts`
- `src/bundler/*.ts`
- `src/server/*.ts`
- `tests/setup/*.mjs`

**Estimated scope:** Medium

## Task 8: Remove esbuild dependencies

**Description:** Remove esbuild-specific packages and imports after Rolldown paths pass parity tests.

**Acceptance criteria:**

- [ ] `package.json` removes `esbuild` and `esbuild-svelte`.
- [ ] `pnpm-lock.yaml` updates cleanly.
- [ ] No source file imports `esbuild` or `esbuild-svelte`.

**Verification:**

- [ ] Run `rg -n "esbuild|esbuild-svelte" src package.json`.
- [ ] Run `pnpm install`.
- [ ] Run `pnpm test`.
- [ ] Run `pnpm run build`.

**Dependencies:** Task 7

**Files likely touched:**

- `package.json`
- `pnpm-lock.yaml`
- `src/**/*.ts`

**Estimated scope:** Small

### Checkpoint: Rolldown Parity

- [ ] Build mode works through Rolldown.
- [ ] Watch mode works through Rolldown.
- [ ] Dev serve mode works with refactored static serving plus Rolldown watch.
- [ ] esbuild packages are no longer required.

### Phase 3: End-to-End Verification and Documentation

## Task 9: Add CLI end-to-end tests for examples

**Description:** Execute `bin.js` against the example projects and verify output plus browser rendering.

**Acceptance criteria:**

- [ ] CLI file entry test passes for `examples/custom-element`.
- [ ] CLI directory entry test passes for `examples/custom-element-split`.
- [ ] CLI config test passes for `examples/no-custom-element`.

**Verification:**

- [ ] Run `pnpm test`.
- [ ] Run each documented CLI command manually once.

**Dependencies:** Rolldown parity checkpoint

**Files likely touched:**

- `tests/e2e/*.test.mjs`
- `tests/setup/*.mjs`

**Estimated scope:** Medium

## Task 10: Update README and migration notes

**Description:** Update public documentation after the implementation is complete, without exposing internal migration details as user-facing configuration.

**Acceptance criteria:**

- [ ] README reflects Rolldown as the bundler.
- [ ] Existing CLI/API examples remain valid.
- [ ] Migration notes call out that public usage is unchanged.

**Verification:**

- [ ] Run `pnpm run build`.
- [ ] Run `git diff --check`.

**Dependencies:** Task 9

**Files likely touched:**

- `README.md`
- `docs/rolldown-migration-spec.md`
- `docs/rolldown-migration-plan.md`

**Estimated scope:** Small

### Checkpoint: Complete

- [ ] All tests pass.
- [ ] Build passes.
- [ ] CLI examples work.
- [ ] Browser rendering checks pass.
- [ ] Documentation is updated.

## Risks and Mitigations

| Risk | Impact | Mitigation |
| ---- | ------ | ---------- |
| Svelte plugin choice is incompatible with Svelte 5 custom elements. | High | Spike the plugin integration before removing esbuild. Keep tests for `customElement: true` and `false`. |
| Rolldown watch API differs from esbuild context lifecycle. | Medium | Wrap watch in an adapter with explicit close behavior and tests. |
| Dev serve relied on esbuild's `serve()`. | Medium | Refactor serving behind a small internal server module and test `serveOptions`, rebuilds, browser refresh behavior, and cleanup. |
| Output file names differ between esbuild and Rolldown. | High | Add output-shape tests before migration and decide whether to preserve names or document the change. |
| Current tests report misleading counts. | Medium | Fix test discovery/reporting before adding new migration tests. |

## Parallelization Opportunities

- Task 2 and Task 3 can proceed in parallel after Task 1.
- Task 10 can start as draft documentation after Task 5, but final README updates should wait for Task 9.
- Tasks 5, 6, and 7 should stay sequential because they share the bundler adapter lifecycle.

## Human Review Gate

Before implementation starts, review and approve:

- The public API preservation boundary.
- The Svelte plugin strategy for Rolldown.
- The dev-server implementation choice: keep `sirv`, use Node `http`, or add another dependency.
- Whether output file names must be byte-for-byte stable or only behaviorally stable.
- Whether this ships as a minor or major release.
