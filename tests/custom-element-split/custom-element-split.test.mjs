import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as ENV from '../setup/puppeteer.mjs';
import { svelteup } from '../../dist/index.js';

const rootPath = 'tests/custom-element-split/';
const entry = rootPath + 'components';
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
});

const getShadowRoot = (component, selector) => {
  return `document.querySelector('${component}').shadowRoot.querySelector('${selector}')`;
};

test('[WC split]build by svelteup should render a page', async (context) => {
  const btnText = await context.page.evaluate(
    getShadowRoot('counter-app', 'button') + '.textContent'
  );

  const inputValue = await context.page.evaluate(
    getShadowRoot('counter-app', 'input') + '.value'
  );

  assert.type(btnText, 'string');
  assert.is(btnText, 'count');
  assert.type(inputValue, 'string');
  assert.is(inputValue, '0');
});

test('[WC split]input should increase after click button in case of svelteup', async (context) => {
  const btnHandle = await context.page.evaluateHandle(
    getShadowRoot('counter-app', 'button')
  );
  await btnHandle.click();

  const value = await context.page.evaluate(
    getShadowRoot('counter-app', 'input') + '.value'
  );

  assert.type(value, 'string');
  assert.is(value, '1');
});

test.run();
