/// <reference types="node" />
import { BrowserServerOptions, CDPLaunchOptions } from '@browserless.io/browserless';
import http from 'http';
export declare const errorCodes: {
    readonly 400: {
        readonly code: 400;
        readonly description: "The request contains errors or didn't properly encode content.";
        readonly message: "HTTP/1.1 400 Bad Request";
    };
    readonly 401: {
        readonly code: 401;
        readonly description: "The request is missing, or contains bad, authorization credentials.";
        readonly message: "HTTP/1.1 401 Unauthorized";
    };
    readonly 404: {
        readonly code: 404;
        readonly description: "Resource couldn't be found.";
        readonly message: "HTTP/1.1 404 Not Found";
    };
    readonly 408: {
        readonly code: 408;
        readonly description: "The request took has taken too long to process.";
        readonly message: "HTTP/1.1 408 Request Timeout";
    };
    readonly 429: {
        readonly code: 429;
        readonly description: "Too many requests are currently being processed.";
        readonly message: "HTTP/1.1 429 Too Many Requests";
    };
    readonly 500: {
        readonly code: 500;
        readonly description: "An internal error occurred when handling the request.";
        readonly message: "HTTP/1.1 500 Internal Server Error";
    };
};
export declare const okCodes: {
    readonly 200: {
        readonly code: 200;
        readonly description: "The request ran successfully and returned an OK response.";
        readonly message: "HTTP/1.1 200 OK";
    };
    readonly 204: {
        readonly code: 204;
        readonly description: "The request ran successfully, but no response was necessary.";
        readonly message: "HTTP/1.1 204 No Content";
    };
};
export declare const codes: {
    readonly 200: {
        readonly code: 200;
        readonly description: "The request ran successfully and returned an OK response.";
        readonly message: "HTTP/1.1 200 OK";
    };
    readonly 204: {
        readonly code: 204;
        readonly description: "The request ran successfully, but no response was necessary.";
        readonly message: "HTTP/1.1 204 No Content";
    };
    readonly 400: {
        readonly code: 400;
        readonly description: "The request contains errors or didn't properly encode content.";
        readonly message: "HTTP/1.1 400 Bad Request";
    };
    readonly 401: {
        readonly code: 401;
        readonly description: "The request is missing, or contains bad, authorization credentials.";
        readonly message: "HTTP/1.1 401 Unauthorized";
    };
    readonly 404: {
        readonly code: 404;
        readonly description: "Resource couldn't be found.";
        readonly message: "HTTP/1.1 404 Not Found";
    };
    readonly 408: {
        readonly code: 408;
        readonly description: "The request took has taken too long to process.";
        readonly message: "HTTP/1.1 408 Request Timeout";
    };
    readonly 429: {
        readonly code: 429;
        readonly description: "Too many requests are currently being processed.";
        readonly message: "HTTP/1.1 429 Too Many Requests";
    };
    readonly 500: {
        readonly code: 500;
        readonly description: "An internal error occurred when handling the request.";
        readonly message: "HTTP/1.1 500 Internal Server Error";
    };
};
export declare enum contentTypes {
    any = "*/*",
    html = "text/html",
    javascript = "application/javascript",
    jpeg = "image/jpeg",
    json = "application/json",
    pdf = "application/pdf",
    png = "image/png",
    text = "text/plain",
    zip = "application/zip"
}
export declare enum encodings {
    utf8 = "UTF-8"
}
export declare enum Methods {
    delete = "delete",
    get = "get",
    post = "post",
    put = "put"
}
export declare enum WebsocketRoutes {
    '/' = "?(/)",
    browser = "/devtools/browser/*",
    page = "/devtools/page/*",
    playwrightChromium = "/playwright/chromium",
    playwrightFirefox = "/playwright/firefox",
    playwrightWebkit = "/playwright/webkit"
}
export declare enum HTTPRoutes {
    content = "/content",
    download = "/download",
    function = "/function",
    pdf = "/pdf",
    performance = "/performance",
    scrape = "/scrape",
    screenshot = "/screenshot"
}
export declare enum HTTPManagementRoutes {
    config = "/config",
    metrics = "/metrics",
    metricsTotal = "/metrics/total",
    sessions = "/sessions",
    static = "/"
}
export declare enum APITags {
    'browserAPI' = "Browser APIs",
    'browserWS' = "Browser WebSockets",
    'management' = "Management APIs"
}
export interface Request extends http.IncomingMessage {
    body: unknown;
    parsed: URL;
    queryParams: Record<string, unknown>;
}
export type Response = http.ServerResponse;
export interface SystemQueryParameters {
    /**
     * Whether or nor to load ad-blocking extensions for the session.
     * This currently uses uBlock Origin and may cause certain sites
     * to not load properly.
     */
    blockAds?: boolean;
    /**
     * Launch options, which can be either an object
     * of puppeteer.launch options or playwright.launchServer
     * options, depending on the API. Must be either JSON
     * object, or a base64-encoded JSON object.
     */
    launch?: CDPLaunchOptions | BrowserServerOptions | string;
    /**
     * Whether or nor to record the session. The browser will run
     * in "head-full" mode, and recording is started and closed
     * via the embedded browserless API. Please refer to the "Recording"
     * section in the live documentation site for more details.
     */
    record?: boolean;
    /**
     * Override the system-level timeout for this request.
     * Accepts a value in milliseconds.
     */
    timeout?: number;
    /**
     * The authorization token
     */
    token?: string;
}
