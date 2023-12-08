import { APITags, BadRequest, CDPChromium, HTTPRoutes, Methods, ServerError, contentTypes, dedent, writeResponse, } from '@browserless.io/browserless';
import Stream from 'stream';
import { fileTypeFromBuffer } from 'file-type';
import functionHandler from '../utils/function/handler.js';
const route = {
    accepts: [contentTypes.json, contentTypes.javascript],
    auth: true,
    browser: CDPChromium,
    concurrency: true,
    contentTypes: [contentTypes.any],
    description: dedent(`
  A JSON or JavaScript content-type API for running puppeteer code in the browser's context.
  Browserless sets up a blank page, injects your puppeteer code, and runs it.
  You can optionally load external libraries via the "import" module that are meant for browser usage.
  Values returned from the function are checked and an appropriate content-type and response is sent back
  to your HTTP call.`),
    handler: async (req, res, browser) => {
        const { _config: getConfig, _debug: getDebug } = route;
        if (!getConfig || !getDebug) {
            throw new ServerError(`Couldn't load configuration for request`);
        }
        const debug = getDebug();
        const config = getConfig();
        const handler = functionHandler(config, debug);
        const { contentType, payload, page } = await handler(req, browser);
        debug(`Got function response of "${contentType}"`);
        page.close();
        page.removeAllListeners();
        if (contentType === 'uint8array') {
            const response = new Uint8Array(payload);
            const type = ((await fileTypeFromBuffer(response)) || { mime: undefined })
                .mime;
            if (!type) {
                throw new BadRequest(`Couldn't determine function's response type.`);
            }
            else {
                debug(`Sending file-type response of "${type}"`);
                const readStream = new Stream.PassThrough();
                readStream.end(response);
                res.setHeader('Content-Type', type);
                return new Promise((r) => readStream.pipe(res).once('close', r));
            }
        }
        else {
            writeResponse(res, 200, payload, contentType);
        }
        return;
    },
    method: Methods.post,
    path: HTTPRoutes.function,
    tags: [APITags.browserAPI],
};
export default route;
