<svelte:options tag="main-app" />

<script>
  import CounterApp from './counter-app.svelte';
  import CrudApp from './crud-app.svelte';
  import FlightBooker from './flight-booker.svelte';
  import TemperatureApp from './temperature-app.svelte';
  import TimerApp from './timer-app.svelte';
</script>

<h1>Counter</h1>

<CounterApp />

<h1>Temperature Converter</h1>

<TemperatureApp />

<h1>Flight Booker</h1>

<FlightBooker />

<h1>Timer</h1>

<TimerApp />

<h1>CRUD</h1>

<CrudApp />
