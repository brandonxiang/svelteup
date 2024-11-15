
<script>
  let count = $state(0);
 
 function onclick() {
   count += 1;
 }
 </script>
 
 <input type="number" bind:value={count} />
 <button {onclick}>count</button>