<svelte:options customElement="split-shell" />

<script>
  let loaded = $state(false);

  async function loadPanel() {
    await import('./heavy-panel.svelte');
    loaded = true;
  }
</script>

<section>
  <h1>Code splitting</h1>
  <p>The lazy panel is registered only after the dynamic import finishes.</p>
  <button onclick={loadPanel}>Load lazy panel</button>

  {#if loaded}
    <lazy-panel></lazy-panel>
  {/if}
</section>

<style>
  section {
    display: grid;
    gap: 12px;
    max-width: 440px;
    padding: 24px;
    border: 1px solid #d7dde8;
    border-radius: 8px;
    font-family:
      Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  h1 {
    margin: 0;
    font-size: 24px;
  }

  p {
    margin: 0;
    color: #4b5563;
  }

  button {
    width: fit-content;
    padding: 8px 12px;
    border: 1px solid #111827;
    border-radius: 6px;
    background: #111827;
    color: white;
    cursor: pointer;
  }
</style>
