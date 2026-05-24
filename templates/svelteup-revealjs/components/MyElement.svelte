<svelte:options customElement="my-element" />

<script>
	export let name = 'world';
</script>

<h1>Hello {name}!</h1>
<slot></slot>

<style>
	h1 {
		font-size: 3.77em;
	}
</style>
