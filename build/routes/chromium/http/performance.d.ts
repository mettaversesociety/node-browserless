import { BrowserHTTPRoute, CDPLaunchOptions, SystemQueryParameters } from '@browserless.io/browserless';
export interface BodySchema {
    budgets?: Array<object>;
    config?: object;
    url: string;
}
export interface QuerySchema extends SystemQueryParameters {
    launch?: CDPLaunchOptions | string;
}
/**
 * The response of the lighthouse stats. Response objects are
 * determined by the type of budgets and config in the POST
 * JSON body
 */
export type ResponseSchema = object;
declare const route: BrowserHTTPRoute;
export default route;
