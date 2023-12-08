import { APITags, CDPChromium, WebsocketRoutes, } from '@browserless.io/browserless';
const route = {
    auth: true,
    browser: CDPChromium,
    concurrency: true,
    description: `Launch and connect to Chromium with a library like puppeteer or others that work over chrome-devtools-protocol.`,
    handler: async (req, socket, head, chrome) => chrome.proxyWebSocket(req, socket, head),
    path: WebsocketRoutes['/'],
    tags: [APITags.browserWS],
};
export default route;
