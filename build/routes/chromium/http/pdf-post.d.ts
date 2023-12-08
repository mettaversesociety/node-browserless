import { BrowserHTTPRoute, CDPLaunchOptions, SystemQueryParameters, WaitForEventOptions, WaitForFunctionOptions, WaitForSelectorOptions, bestAttempt, rejectRequestPattern, rejectResourceTypes, requestInterceptors } from '@browserless.io/browserless';
import { Page } from 'puppeteer-core';
export interface BodySchema {
    addScriptTag?: Array<Parameters<Page['addScriptTag']>[0]>;
    addStyleTag?: Array<Parameters<Page['addStyleTag']>[0]>;
    authenticate?: Parameters<Page['authenticate']>[0];
    bestAttempt?: bestAttempt;
    blockModals?: boolean;
    cookies?: Array<Parameters<Page['setCookie']>[0]>;
    emulateMediaType?: Parameters<Page['emulateMediaType']>[0];
    gotoOptions?: Parameters<Page['goto']>[1];
    html?: Parameters<Page['setContent']>[0];
    options?: Parameters<Page['pdf']>[0];
    rejectRequestPattern?: rejectRequestPattern[];
    rejectResourceTypes?: rejectResourceTypes[];
    requestInterceptors?: Array<requestInterceptors>;
    setExtraHTTPHeaders?: Parameters<Page['setExtraHTTPHeaders']>[0];
    setJavaScriptEnabled?: boolean;
    url?: Parameters<Page['goto']>[0];
    userAgent?: Parameters<Page['setUserAgent']>[0];
    viewport?: Parameters<Page['setViewport']>[0];
    waitForEvent?: WaitForEventOptions;
    waitForFunction?: WaitForFunctionOptions;
    waitForSelector?: WaitForSelectorOptions;
    waitForTimeout?: Parameters<Page['waitForTimeout']>[0];
}
export interface QuerySchema extends SystemQueryParameters {
    launch?: CDPLaunchOptions | string;
}
/**
 * Responds with an application/pdf content-type and a binary PDF
 */
export type ResponseSchema = string;
declare const route: BrowserHTTPRoute;
export default route;
