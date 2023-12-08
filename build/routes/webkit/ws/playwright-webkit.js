import { APITags, BadRequest, PlaywrightWebkit, WebsocketRoutes, } from '@browserless.io/browserless';
const route = {
    auth: true,
    browser: PlaywrightWebkit,
    concurrency: true,
    description: `Connect to Webkit with any playwright-compliant library.`,
    handler: async (req, socket, head, browser) => {
        const isPlaywright = req.headers['user-agent']
            ?.toLowerCase()
            .includes('playwright');
        if (!isPlaywright) {
            throw new BadRequest(`Only playwright is allowed to work with this route`);
        }
        return browser.proxyWebSocket(req, socket, head);
    },
    path: WebsocketRoutes.playwrightWebkit,
    tags: [APITags.browserWS],
};
export default route;
