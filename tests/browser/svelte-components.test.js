import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import CounterApp from '../custom-element/components/counter-app.svelte';
import ProfileCard from '../custom-element/components/profile-card.svelte';

test('renders and updates a Svelte counter component in the browser', async () => {
  const screen = await render(CounterApp);
  const input = screen.container.querySelector('input');

  await expect.element(screen.getByRole('button', { name: 'count' })).toBeVisible();
  expect(input.value).toBe('0');

  await screen.getByRole('button', { name: 'count' }).click();

  expect(input.value).toBe('1');
});

test('renders Svelte component props in the browser', async () => {
  const screen = await render(ProfileCard, {
    label: 'First',
    count: 1,
  });

  await expect.element(screen.getByText('First')).toBeVisible();
  await expect.element(screen.getByText('1')).toBeVisible();

  await screen.rerender({
    label: 'Updated',
    count: 7,
  });

  await expect.element(screen.getByText('Updated')).toBeVisible();
  await expect.element(screen.getByText('7')).toBeVisible();
});
