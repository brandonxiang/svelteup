<svelte:options customElement="counter-app" />

<script>
  let count = 1;

  function onclick() {
    count += 1;
  }
</script>

<input type="number" bind:value={count} />
<button on:click={onclick}>count </button>
