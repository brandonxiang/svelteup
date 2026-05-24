import { afterEach, beforeEach, expect, test } from 'vitest';
import * as ENV from '../setup/playwright.mjs';
import { svelteup } from '../../dist/index.mjs';

const rootPath = 'tests/custom-element-split/';
const entry = rootPath + 'components';
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
  servedir,
});

const getShadowRoot = (component, selector) => {
  return `document.querySelector('${component}').shadowRoot.querySelector('${selector}')`;
};

test('[WC split]build by svelteup should render a page', async (context) => {
  const btnText = await context.page.evaluate(
    getShadowRoot('counter-app', 'button') + '.textContent',
  );

  const inputValue = await context.page.evaluate(getShadowRoot('counter-app', 'input') + '.value');

  expect(btnText).toBeTypeOf('string');
  expect(btnText).toBe('count');
  expect(inputValue).toBeTypeOf('string');
  expect(inputValue).toBe('0');
});

test('[WC split]input should increase after click button in case of svelteup', async (context) => {
  const btnHandle = await context.page.evaluateHandle(getShadowRoot('counter-app', 'button'));
  await btnHandle.click();

  const value = await context.page.evaluate(getShadowRoot('counter-app', 'input') + '.value');

  expect(value).toBeTypeOf('string');
  expect(value).toBe('1');
});
