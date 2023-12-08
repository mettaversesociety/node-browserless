import { APITags, CDPChromium, WebsocketRoutes, } from '@browserless.io/browserless';
const route = {
    auth: true,
    browser: CDPChromium,
    concurrency: false,
    description: `Connect to an already-running Chromium with a library like puppeteer, or others, that work over chrome-devtools-protocol.`,
    handler: async (req, socket, head, chrome) => chrome.proxyWebSocket(req, socket, head),
    path: WebsocketRoutes.browser,
    tags: [APITags.browserWS],
};
export default route;
