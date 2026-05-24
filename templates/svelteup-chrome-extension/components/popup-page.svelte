<svelte:options customElement="popup-page" />

<script>
  let backgroundColor = ''
  
  chrome.storage.sync.get("color", ({ color }) => {
    backgroundColor = color;
  });


  async function handleChangeColor () {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setPageBackgroundColor,
    });
  }

  // The body of this function will be execuetd as a content script inside the
  // current page
  function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => {
      document.body.style.backgroundColor = color;
    });
  }

</script>

<button style="background-color: {backgroundColor}" on:click={handleChangeColor}></button>

<style>
  button {
  height: 30px;
  width: 30px;
  outline: none;
  margin: 10px;
  border: none;
  border-radius: 2px;
 }
</style>
