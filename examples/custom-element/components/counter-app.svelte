<svelte:options tag="counter-app" />

<script>
  let count = 0;

  function onclick() {
    count += 1;
  }
</script>

<input type="number" bind:value={count} />
<button on:click={onclick}>count </button>
