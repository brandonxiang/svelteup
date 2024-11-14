<svelte:options customElement="timer-app" />

<script>
  import { onDestroy } from 'svelte';

  let elapsed = $state(0);
  let duration = $state(5000);

  let last_time = window.performance.now();
  let frame;

  (function update() {
    frame = requestAnimationFrame(update);

    const time = window.performance.now();
    elapsed += Math.min(time - last_time, duration - elapsed);

    last_time = time;
  })();

  onDestroy(() => {
    cancelAnimationFrame(frame);
  });
</script>

<label>
  elapsed time:
  <progress value={elapsed / duration} ></progress>
</label>

<div>{(elapsed / 1000).toFixed(1)}s</div>

<label>
  duration:
  <input type="range" bind:value={duration} min="1" max="20000" />
</label>

<button onclick={() => (elapsed = 0)}>reset</button>
