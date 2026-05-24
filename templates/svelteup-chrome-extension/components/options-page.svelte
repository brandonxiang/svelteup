<svelte:options customElement="options-page" />

<script>
  let selectedClassName = "current";
  let currentColor = '';
  const presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

  // Reacts to a button click by marking marking the selected button and saving
  // the selection
  function handleButtonClick(event) {
    const color = event.target.dataset.color;
    currentColor = color;
    chrome.storage.sync.set({ color });
  }

  chrome.storage.sync.get("color", (data) => {
    currentColor = data.color;
  });

</script>

<div>
  {#each presetButtonColors as buttonColor}
    <button 
      class="{buttonColor === currentColor ? selectedClassName : ''}" 
      style="background-color: {buttonColor}"
      data-color="{buttonColor}"
      on:click="{handleButtonClick}"
    />
  {/each}
</div>
<div>
  <p>Choose a different background color!</p>
</div>

<style>
  button {
  height: 30px;
  width: 30px;
  outline: none;
  margin: 10px;
  border: none;
  border-radius: 2px;
 }

 button.current {
    box-shadow: 0 0 0 2px white,
                0 0 0 4px black;
  }
</style>
