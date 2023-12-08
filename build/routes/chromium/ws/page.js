import { APITags, CDPChromium, WebsocketRoutes, } from '@browserless.io/browserless';
const route = {
    auth: true,
    browser: CDPChromium,
    concurrency: false,
    description: `Connect to Chromium with a library like chrome-remote-interface or others that work over JSON chrome-devtools-protocol.`,
    handler: async (req, socket, head, chrome) => chrome.proxyPageWebSocket(req, socket, head),
    path: WebsocketRoutes.page,
    tags: [APITags.browserWS],
};
export default route;
