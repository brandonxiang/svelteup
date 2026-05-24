# Code Splitting Example

This example enables Rolldown code splitting for ESM output.

```bash
cd examples/code-splitting
svelteup -d
```

The entry bundle registers `<split-shell>`. Clicking the button dynamically imports `heavy-panel.svelte`, which emits a separate chunk and registers `<lazy-panel>`.
