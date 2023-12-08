import { BrowserHTTPRoute, CDPLaunchOptions, SystemQueryParameters, WaitForEventOptions, WaitForFunctionOptions, WaitForSelectorOptions, bestAttempt, rejectRequestPattern, rejectResourceTypes, requestInterceptors, setJavaScriptEnabled } from '@browserless.io/browserless';
import { Page } from 'puppeteer-core';
export interface BodySchema {
    addScriptTag?: Array<Parameters<Page['addScriptTag']>[0]>;
    addStyleTag?: Array<Parameters<Page['addStyleTag']>[0]>;
    authenticate?: Parameters<Page['authenticate']>[0];
    bestAttempt?: bestAttempt;
    cookies?: Array<Parameters<Page['setCookie']>[0]>;
    emulateMediaType?: Parameters<Page['emulateMediaType']>[0];
    gotoOptions?: Parameters<Page['goto']>[1];
    html?: Parameters<Page['setContent']>[0];
    rejectRequestPattern?: rejectRequestPattern[];
    rejectResourceTypes?: rejectResourceTypes[];
    requestInterceptors?: Array<requestInterceptors>;
    setExtraHTTPHeaders?: Parameters<Page['setExtraHTTPHeaders']>[0];
    setJavaScriptEnabled?: setJavaScriptEnabled;
    url?: Parameters<Page['goto']>[0];
    userAgent?: Parameters<Page['setUserAgent']>[0];
    viewport?: Parameters<Page['setViewport']>[0];
    waitForEvent?: WaitForEventOptions;
    waitForFunction?: WaitForFunctionOptions;
    waitForSelector?: WaitForSelectorOptions;
    waitForTimeout?: Parameters<Page['waitForTimeout']>[0];
}
/**
 * An HTML payload of the website or HTML after JavaScript
 * parsing and execution.
 */
export type ResponseSchema = string;
export type QuerySchema = SystemQueryParameters & {
    launch?: CDPLaunchOptions | string;
};
declare const route: BrowserHTTPRoute;
export default route;
