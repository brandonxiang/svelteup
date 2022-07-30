import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as ENV from '../setup/puppeteer.mjs';
import { svelteup } from '../../dist/index.js';

const rootPath = 'tests/no-custom-element/';
const entry = rootPath + 'components/index.js';
const outdir = rootPath + 'public/dist';
const servedir = rootPath + 'public';

test.before(ENV.setup(servedir));
test.before.each(ENV.homepage);
test.after(ENV.reset);

svelteup(entry, {
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
  const btnText = await context.page.evaluate(
    getSelector('button') + '.textContent',
  );

  console.log(btnText);

  const inputValue = await context.page.evaluate(
    getSelector('input') + '.value',
  );

  assert.type(btnText, 'string');
  assert.is(btnText, 'count');
  assert.type(inputValue, 'string');
  assert.is(inputValue, '0');
});

test('[no-WC]input should increase after click button in case of svelteup', async (context) => {
  const btnHandle = await context.page.evaluateHandle(getSelector('button'));
  await btnHandle.click();

  const value = await context.page.evaluate(getSelector('input') + '.value');

  assert.type(value, 'string');
  assert.is(value, '1');
});

test.run();
