import { afterEach, beforeEach, expect, test } from 'vitest';
import * as ENV from '../setup/puppeteer.mjs';
import { svelteup } from '../../dist/index.mjs';

const rootPath = 'tests/no-custom-element/';
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
  servedir,
  compilerOptions: {
    customElement: false,
  },
});

const getSelector = (selector) => {
  return `document.querySelector('${selector}')`;
};

test('[no-WC]build by svelteup should render a page', async (context) => {
  const btnText = await context.page.evaluate(getSelector('button') + '.textContent');

  const inputValue = await context.page.evaluate(getSelector('input') + '.value');

  expect(btnText).toBeTypeOf('string');
  expect(btnText).toBe('count');
  expect(inputValue).toBeTypeOf('string');
  expect(inputValue).toBe('0');
});

test('[no-WC]input should increase after click button in case of svelteup', async (context) => {
  const btnHandle = await context.page.evaluateHandle(getSelector('button'));
  await btnHandle.click();

  const value = await context.page.evaluate(getSelector('input') + '.value');

  expect(value).toBeTypeOf('string');
  expect(value).toBe('1');
});
