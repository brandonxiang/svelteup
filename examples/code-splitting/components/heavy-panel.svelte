<svelte:options customElement="lazy-panel" />

<script>
  const rows = [
    ['Chunk', 'heavy-panel.js'],
    ['Loaded by', 'dynamic import'],
    ['Output', 'separate ESM file'],
  ];
</script>

<article>
  <h2>Lazy panel</h2>
  <dl>
    {#each rows as [label, value]}
      <div>
        <dt>{label}</dt>
        <dd>{value}</dd>
      </div>
    {/each}
  </dl>
</article>

<style>
  article {
    display: grid;
    gap: 10px;
    padding: 16px;
    background: #f8fafc;
    border: 1px solid #d7dde8;
    border-radius: 8px;
  }

  h2 {
    margin: 0;
    font-size: 18px;
  }

  dl {
    display: grid;
    gap: 8px;
    margin: 0;
  }

  div {
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }

  dt {
    color: #4b5563;
  }

  dd {
    margin: 0;
    font-weight: 600;
  }
</style>
