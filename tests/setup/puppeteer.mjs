import Chrome from 'puppeteer';
import http from 'http';
import sirv from 'sirv';

// Launch the browser
// Add `browser` and `page` to context
export function setup(serverDir) {
  return async (context) => {
    context.browser = await Chrome.launch();
    context.page = await context.browser.newPage();
    context.server = http.createServer(sirv(serverDir));
    context.server.listen(9527);
  };
}

// Close everything on suite completion
export async function reset(context) {
  if(context.page) {
    await context.page.close();
    await context.browser.close();
    context.server.close();
  }


}

// Navigate to homepage
export async function homepage(context) {
  await context.page.goto('http://localhost:9527');
}
