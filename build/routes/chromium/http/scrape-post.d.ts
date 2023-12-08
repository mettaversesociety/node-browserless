import { BrowserHTTPRoute, CDPLaunchOptions, InBoundRequest, OutBoundRequest, ScrapeDebugOptions, ScrapeElementSelector, SystemQueryParameters, WaitForEventOptions, WaitForFunctionOptions, WaitForSelectorOptions, bestAttempt, rejectRequestPattern, rejectResourceTypes, requestInterceptors } from '@browserless.io/browserless';
import { Page, Protocol } from 'puppeteer-core';
export interface BodySchema {
    addScriptTag?: Array<Parameters<Page['addScriptTag']>[0]>;
    addStyleTag?: Array<Parameters<Page['addStyleTag']>[0]>;
    authenticate?: Parameters<Page['authenticate']>[0];
    bestAttempt?: bestAttempt;
    cookies?: Array<Parameters<Page['setCookie']>[0]>;
    debugOpts?: ScrapeDebugOptions;
    elements: Array<ScrapeElementSelector>;
    emulateMediaType?: Parameters<Page['emulateMediaType']>[0];
    gotoOptions?: Parameters<Page['goto']>[1];
    html?: Parameters<Page['setContent']>[0];
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
export type QuerySchema = SystemQueryParameters & {
    launch?: CDPLaunchOptions | string;
};
/**
 * The JSON response body
 */
export interface ResponseSchema {
    data: {
        results: {
            /**
             * A list of HTML attributes of the element
             */
            attributes: {
                /**
                 * The name of the HTML attribute for the element
                 */
                name: string;
                /**
                 * The value of the HTML attribute for the element
                 */
                value: string;
            }[];
            /**
             * The height the element
             */
            height: number;
            /**
             * The HTML the element
             */
            html: string;
            /**
             * The amount of pixels from the left of the page
             */
            left: number;
            /**
             * The text the element
             */
            text: string;
            /**
             * The amount of pixels from the top of the page
             */
            top: number;
            /**
             * The width the element
             */
            width: number;
        }[];
        /**
         * The DOM selector of the element
         */
        selector: string;
    }[] | null;
    /**
     * When debugOpts options are present, results are here
     */
    debug: {
        /**
         * A list of console messages from the browser
         */
        console: string[];
        /**
         * List of cookies for the site or null
         */
        cookies: Protocol.Network.Cookie[] | null;
        /**
         * The HTML string of the website or null
         */
        html: string | null;
        network: {
            inbound: InBoundRequest[];
            outbound: OutBoundRequest[];
        };
        /**
         * A base64-encoded string of the site or null
         */
        screenshot: string | null;
    } | null;
}
declare const route: BrowserHTTPRoute;
export default route;
