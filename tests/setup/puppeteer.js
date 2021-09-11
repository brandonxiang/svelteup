import Chrome from 'puppeteer';
import http from 'http';
import sirv from 'sirv';


// Launch the browser
// Add `browser` and `page` to context
export async function setup(context) {
	context.browser = await Chrome.launch();
	context.page = await context.browser.newPage();
	context.server = http.createServer(sirv('tests/public'));
	context.server.listen(5000);
}

// Close everything on suite completion
export async function reset(context) {
	await context.page.close();
	await context.browser.close();
	context.server.close();
}

// Navigate to homepage
export async function homepage(context) {
	await context.page.goto('http://localhost:5000');
}