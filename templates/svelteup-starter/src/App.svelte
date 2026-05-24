<script>
import { RouterView } from '@dvcol/svelte-simple-router/components';

const RouteName = {
  Hello: 'hello',
  Goodbye: 'goodbye',
  Home: 'home',
  Any: 'any',
} ;

export const routes = [
  {
    name: RouteName.Home,
    path: '/',
    component: () => import('./hello/HelloComponent.svelte'),
  },
  {
    name: RouteName.Goodbye,
    path: `/goodbye`,
    component: () => import('./goodbye/GoodbyeComponent.svelte'),
  },
];

export const options = {
  hash: true,
  routes,
};

</script>

<RouterView {options} />