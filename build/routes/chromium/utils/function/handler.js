import { BadRequest, HTTPRoutes, contentTypes, convertIfBase64, exists, id, makeExternalURL, mimeTypes, } from '@browserless.io/browserless';
import fs from 'fs';
import path from 'path';
export default (config, debug, options = {}) => async (req, browser) => {
    const isJson = req.headers['content-type']?.includes('json');
    const functionAssetLocation = path.join(config.getStatic(), 'function');
    const functionRequestPath = makeExternalURL(config.getExternalAddress(), HTTPRoutes.function);
    const functionIndexHTML = makeExternalURL(config.getExternalAddress(), HTTPRoutes.function, '/index.html');
    const { code: rawCode, context: rawContext } = isJson
        ? req.body
        : {
            code: req.body,
            context: {},
        };
    const context = JSON.stringify(rawContext);
    const code = convertIfBase64(rawCode);
    const browserWSEndpoint = browser.publicWSEndpoint(req.parsed.searchParams.get('token') ?? '');
    if (!browserWSEndpoint) {
        throw new Error(`No browser endpoint was found, is the browser running?`);
    }
    const functionCodeJS = `browserless-function-${id()}.js`;
    const page = (await browser.newPage());
    await page.setRequestInterception(true);
    /**
     * We serve static files to the function api by injecting
     * request responses. This is done because users can use
     * a proxy, which might not have access or abilities to
     * request the function index/js from this server.
     */
    page.on('request', async (request) => {
        const requestUrl = request.url();
        debug(`/function.js: Page Request: "${requestUrl}"`);
        if (requestUrl.startsWith(functionRequestPath)) {
            const filename = path.basename(requestUrl);
            if (filename === functionCodeJS) {
                return request.respond({
                    body: code,
                    contentType: contentTypes.javascript,
                    status: 200,
                });
            }
            const filePath = path.join(functionAssetLocation, filename);
            if (await exists(filePath)) {
                const contentType = mimeTypes.get(path.extname(filePath));
                return request.respond({
                    body: await fs.readFileSync(filePath).toString(),
                    contentType: contentType,
                    status: 200,
                });
            }
            debug(`Static asset request to "${requestUrl}" couldn't be found, 404-ing`);
            return request.respond({
                body: code,
                contentType: `Couldn't locate this file "${filename}" request "${requestUrl}" in "${functionAssetLocation}"`,
                status: 404,
            });
        }
        return request.continue();
    });
    page.on('response', (res) => {
        debug(`/function.js: Page Response: "${res.url()}"`);
        if (res.status() !== 200) {
            debug(`Received a non-200 response for request "${res.url()}"`);
        }
    });
    page.on('console', (event) => {
        debug(`${event.type()}: ${event.text()}`);
    });
    await page.goto(functionIndexHTML);
    const { contentType, payload } = await page
        .evaluate(async (browserWSEndpoint, context, functionCodeJS, serializedOptions) => {
        const [{ default: code }] = await Promise.all([
            import('./' + functionCodeJS),
        ]);
        console.log('/function.js: imported successfully.');
        const helper = new window.BrowserlessFunctionRunner();
        const options = JSON.parse(serializedOptions);
        console.log('/function.js: executing puppeteer code.');
        return helper.start({
            browserWSEndpoint,
            code,
            context: JSON.parse(context || `{}`),
            options,
        });
    }, browserWSEndpoint, context, functionCodeJS, JSON.stringify(options))
        .catch((e) => {
        debug(`Error running code: ${e}`);
        throw new BadRequest(e.message);
    });
    return {
        contentType,
        page,
        payload,
    };
};
