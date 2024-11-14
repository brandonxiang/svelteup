<svelte:options customElement="counter-app" />

<script>
  let count = $state(0);

  function increment() {
    count += 1;
  }
</script>

<input type="number" bind:value={count} />
<button onclick={increment}>count</button>