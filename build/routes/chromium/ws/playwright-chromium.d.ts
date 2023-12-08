import { BrowserServerOptions, BrowserWebsocketRoute, SystemQueryParameters } from '@browserless.io/browserless';
export interface QuerySchema extends SystemQueryParameters {
    launch?: BrowserServerOptions | string;
}
declare const route: BrowserWebsocketRoute;
export default route;
