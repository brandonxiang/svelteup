<svelte:options customElement="counter-app" />

<script>
  let count = $state(1);

  function onclick() {
    count += 1;
  }
</script>

<input type="number" bind:value={count} />
<button {onclick}>count </button>
