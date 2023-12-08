/**
 * Given a legacy connect or API call, this shim will
 * re-order the arguments to make them valid in the 2.0
 * world as much as possible. It does not handle request
 * validation as that happens later downstream.
 *
 * @param req A parsed user requests
 */
export declare const shimLegacyRequests: (url: URL) => URL;
