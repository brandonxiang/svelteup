import { afterEach, beforeEach, expect, test } from 'vitest';
import * as ENV from '../setup/playwright.mjs';
import { svelteup } from '../../dist/index.mjs';

const rootPath = 'tests/custom-element/';
const entry = rootPath + 'components/index.js';
const outdir = rootPath + 'public/dist';
const servedir = rootPath + 'public';

beforeEach(async (context) => {
  await ENV.setup(servedir)(context);
  await ENV.homepage(context);
});
afterEach(ENV.reset);

await svelteup(entry, {
  _: [],
  watch: false,
  outdir,
  format: 'iife',
  servedir,
});

const getShadowRoot = (component, selector) => {
  return `document.querySelector('${component}').shadowRoot.querySelector('${selector}')`;
};

test('[WC]build by svelteup should render a page', async (context) => {
  const btnText = await context.page.evaluate(
    getShadowRoot('counter-app', 'button') + '.textContent',
  );

  const inputValue = await context.page.evaluate(getShadowRoot('counter-app', 'input') + '.value');

  expect(btnText).toBeTypeOf('string');
  expect(btnText).toBe('count');
  expect(inputValue).toBeTypeOf('string');
  expect(inputValue).toBe('0');
});

test('[WC]input should increase after click button in case of svelteup', async (context) => {
  const btnHandle = await context.page.evaluateHandle(getShadowRoot('counter-app', 'button'));
  await btnHandle.click();

  const value = await context.page.evaluate(getShadowRoot('counter-app', 'input') + '.value');

  expect(value).toBeTypeOf('string');
  expect(value).toBe('1');
});

test('[WC]loading the same bundle twice should not redefine custom elements', async (context) => {
  const pageErrors = [];
  context.page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  await context.page.addScriptTag({ url: 'http://localhost:9527/dist/index.js' });

  const isDefined = await context.page.evaluate(() => {
    return customElements.get('counter-app') !== undefined;
  });

  expect(isDefined).toBe(true);
  expect(pageErrors).toEqual([]);
});

test('[WC]custom elements support attributes, properties, events, slots, and multiple instances', async (context) => {
  const firstLabel = await context.page.evaluate(
    getShadowRoot('#first-profile', '[data-testid="label"]') + '.textContent',
  );
  const secondLabel = await context.page.evaluate(
    getShadowRoot('#second-profile', '[data-testid="label"]') + '.textContent',
  );
  const firstSlot = await context.page.evaluate(
    "document.querySelector('#first-profile').textContent.trim()",
  );

  expect(firstLabel).toBe('First');
  expect(secondLabel).toBe('Second');
  expect(firstSlot).toBe('Primary slot');

  await context.page.evaluate(() => {
    document.querySelector('#first-profile').label = 'Updated';
    document.querySelector('#first-profile').count = 7;
  });

  const updatedLabel = await context.page.evaluate(
    getShadowRoot('#first-profile', '[data-testid="label"]') + '.textContent',
  );
  const updatedCount = await context.page.evaluate(
    getShadowRoot('#first-profile', '[data-testid="count"]') + '.textContent',
  );
  const isolatedSecondCount = await context.page.evaluate(
    getShadowRoot('#second-profile', '[data-testid="count"]') + '.textContent',
  );

  expect(updatedLabel).toBe('Updated');
  expect(updatedCount).toBe('7');
  expect(isolatedSecondCount).toBe('2');

  const eventDetail = await context.page.evaluate(async () => {
    const card = document.querySelector('#first-profile');
    const event = new Promise((resolve) => {
      card.addEventListener('confirm', (event) => resolve(event.detail));
    });

    card.shadowRoot.querySelector('button').click();
    return await event;
  });

  expect(eventDetail).toEqual({ label: 'Updated', count: 7 });
});
