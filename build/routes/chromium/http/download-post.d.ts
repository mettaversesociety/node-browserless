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
 * Responses are determined by the returned value of the downloads
 * themselves, so there isn't a static response type for this API.
 */
export type ResponseSchema = unknown;
declare const route: BrowserHTTPRoute;
export default route;
