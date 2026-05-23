import { chromium } from 'playwright';
import http from 'node:http';
import sirv from 'sirv';
import fs from 'node:fs';

const browserPaths = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

const executablePath = browserPaths.find((browserPath) => {
  return fs.existsSync(browserPath);
});

const launchOptions = executablePath ? { executablePath } : {};

export function setup(serverDir) {
  return async (context) => {
    context.browser = await chromium.launch(launchOptions);
    context.page = await context.browser.newPage();
    context.server = http.createServer(sirv(serverDir));
    await new Promise((resolve) => {
      context.server.listen(9527, resolve);
    });
  };
}

export async function reset(context) {
  if (context.page) {
    await context.page.close();
    await context.browser.close();
  }

  if (context.server) {
    await new Promise((resolve, reject) => {
      context.server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

export async function homepage(context) {
  await context.page.goto('http://localhost:9527');
}
