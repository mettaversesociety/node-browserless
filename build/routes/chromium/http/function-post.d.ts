import { BrowserHTTPRoute, CDPLaunchOptions, SystemQueryParameters } from '@browserless.io/browserless';
interface JSONSchema {
    code: string;
    context?: Record<string, string | number>;
}
export type BodySchema = JSONSchema | string;
export interface QuerySchema extends SystemQueryParameters {
    launch?: CDPLaunchOptions | string;
}
/**
 * Responses are determined by the returned value of the function
 * itself. Binary responses (PDF's, screenshots) are returned back
 * as binary data, and primitive JavaScript values are returned back
 * by type (HTML data is "text/html", Objects are "application/json")
 */
export type ResponseSchema = unknown;
declare const route: BrowserHTTPRoute;
export default route;
