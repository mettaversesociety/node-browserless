import { APITags, BadRequest, CDPChromium, HTTPRoutes, Methods, ServerError, contentTypes, jsonResponse, } from '@browserless.io/browserless';
import main from '../utils/performance/main.js';
const route = {
    accepts: [contentTypes.json],
    auth: true,
    browser: CDPChromium,
    concurrency: true,
    contentTypes: [contentTypes.json],
    description: `Run lighthouse performance audits with a supplied "url" in your JSON payload.`,
    handler: async (req, res, browser) => {
        const { _config: getConfig } = route;
        if (!req.body) {
            throw new BadRequest(`No JSON body present`);
        }
        if (!getConfig) {
            throw new ServerError(`Couldn't load configuration for timeouts`);
        }
        const config = getConfig();
        const response = await main({
            browser,
            context: req.body,
            timeout: config.getTimeout(),
        });
        return jsonResponse(res, 200, response);
    },
    method: Methods.post,
    path: HTTPRoutes.performance,
    tags: [APITags.browserAPI],
};
export default route;
