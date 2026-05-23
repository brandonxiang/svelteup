# Embedded Svelte Tooling Roadmap

## Product Goal

Svelteup is a lightweight bundling tool for embedding Svelte components and small Svelte pages into existing websites.

The primary workflow is to compile Svelte components into browser-ready custom elements, then insert them into any host page with a small script and a custom tag. The tool should preserve Svelte's small runtime footprint and make component embedding feel precise: users can ship one widget, one page fragment, or a group of related components without adopting a full application framework in the host site.

Svelteup should not become a general-purpose Vite replacement. Rolldown owns bundling and watch rebuilds. Svelteup owns the opinionated custom-element workflow, local debugging, and the small amount of runtime hardening needed for third-party pages.

## Target Use Cases

- Embed a Svelte widget in a non-Svelte website.
- Ship a small interactive page fragment to a CMS, landing page, documentation site, or legacy app.
- Bundle multiple custom elements from one components directory.
- Package a page-level Svelte component as a self-contained browser script.
- Develop and debug the embedded output locally before copying it to another site or deploying it to a CDN.

## Product Principles

- **Small by default:** Prefer independent browser-ready bundles with minimal assumptions about the host page.
- **Custom elements first:** `compilerOptions.customElement` defaults to `true`.
- **Safe to embed:** Generated custom elements should tolerate repeated script loads and multiple instances on the same page.
- **Explicit contracts:** Config, output format, dev server behavior, and custom-element constraints should be typed and documented.
- **Debuggable locally:** Development mode should serve static files, rebuild on change, and reload the page with clear errors.

## P0: Core Loop

P0 is the minimum production-quality loop for the current project goal.

### Stable Custom Element Output

- Single file entries bundle imported components into one output.
- Directory entries bundle each first-level `.svelte` file as a separate output.
- `compilerOptions.customElement` defaults to `true`.
- Generated output should not crash if the same custom element bundle is loaded more than once.

### Embedded Output Modes

- Default output is ESM-friendly browser JavaScript for modern host pages.
- `format: "iife"` is available for host pages that want a classic self-running script.
- IIFE output has a stable global name fallback for bundler compatibility, but the custom-element registration remains the primary public API.

### Config Contract

- Config files can be `svelteup.config.js`, `svelteup.config.mjs`, or `svelteup.config.ts`.
- `defineConfig(...)` provides a typed configuration helper.
- Option precedence is explicit: CLI/API options override config values, and config values override defaults.
- Invalid output formats fail fast with a clear error.

### Development Server

- `svelteup -d` serves static files from `serveOptions.servedir`.
- Development mode rebuilds on source changes.
- Development mode injects live reload into generated bundles.
- Static files are served in dev mode without stale content-length headers.
- Port binding failures should produce a clear error instead of an unhandled stack trace.

## P1: Embedding Ergonomics

- Generate an embed snippet after build.
- Document custom-element tags, props, attributes, events, and slots.
- Add tests for props, attributes, events, slots, multiple instances, and duplicate bundle loads.
- Document shadow DOM theming with CSS custom properties.
- Add `base` or `publicPath` once asset handling is implemented.

## P2: Bundle Quality

- Add size reporting for raw, gzip, and brotli output.
- Add `--analyze` or an equivalent dependency breakdown.
- Support explicit `external` and `globals` configuration.
- Define browser target defaults and compatibility policy.
- Add an asset pipeline for images, fonts, and CSS `url(...)` references.

## P3: Developer Experience

- Add `svelteup init` for a minimal custom-element project.
- Add `svelteup inspect` to print resolved config, entries, and output options.
- Improve config and entry error messages with attempted paths and current working directory.
- Expand examples for CDN embed, native HTML, React/Vue host pages, and no-custom-element usage.

## P4: Verification Matrix

- Build output renders in plain HTML with a classic script tag.
- Build output renders in module-script mode.
- Loading the same bundle twice does not crash.
- Multiple component instances keep isolated state.
- Attributes and DOM properties update component state.
- Custom events can be listened to by the host page.
- Shadow DOM styles are isolated from host page CSS.
- Development reload works after rebuilds.
- `.js`, `.mjs`, and `.ts` config files all load correctly.
