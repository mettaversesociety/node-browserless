import { APITags, BadRequest, PlaywrightFirefox, WebsocketRoutes, } from '@browserless.io/browserless';
const route = {
    auth: true,
    browser: PlaywrightFirefox,
    concurrency: true,
    description: `Connect to Firefox with any playwright-compliant library.`,
    handler: async (req, socket, head, browser) => {
        const isPlaywright = req.headers['user-agent']
            ?.toLowerCase()
            .includes('playwright');
        if (!isPlaywright) {
            throw new BadRequest(`Only playwright is allowed to work with this route`);
        }
        return browser.proxyWebSocket(req, socket, head);
    },
    path: WebsocketRoutes.playwrightFirefox,
    tags: [APITags.browserWS],
};
export default route;
