import { BrowserWebsocketRoute, CDPLaunchOptions, SystemQueryParameters } from '@browserless.io/browserless';
export interface QuerySchema extends SystemQueryParameters {
    launch?: CDPLaunchOptions | string;
}
declare const route: BrowserWebsocketRoute;
export default route;
