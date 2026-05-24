<svelte:options
  customElement={{
    tag: 'profile-card',
    props: {
      label: { attribute: 'label', reflect: true, type: 'String' },
      count: { attribute: 'count', reflect: true, type: 'Number' },
    },
  }}
/>

<script>
  import { createEventDispatcher } from 'svelte';

  let { label = 'Default', count = 0 } = $props();
  const dispatch = createEventDispatcher();

  function confirm() {
    dispatch('confirm', { label, count });
  }
</script>

<article>
  <p data-testid="label">{label}</p>
  <p data-testid="count">{count}</p>
  <slot></slot>
  <button onclick={confirm}>confirm</button>
</article>
