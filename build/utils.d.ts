/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { BrowserHTTPRoute, BrowserWebsocketRoute, CDPChromium, Config, HTTPRoute, PlaywrightChromium, PlaywrightFirefox, PlaywrightWebkit, Request, WaitForEventOptions, WaitForFunctionOptions, WebSocketRoute, codes, contentTypes } from '@browserless.io/browserless';
import { CDPSession } from 'playwright-core';
import { Duplex } from 'stream';
import { Page } from 'puppeteer-core';
import { ServerResponse } from 'http';
import debug from 'debug';
export declare const buildDir: string;
export declare const tsExtension = ".d.ts";
export declare const jsonExtension = ".json";
export declare const jsExtension = ".js";
export declare const id: () => string;
export declare const createLogger: (domain: string) => debug.Debugger;
export declare const dedent: (strings: string | string[], ...values: string[]) => string;
export declare const isConnected: (connection: Duplex | ServerResponse) => boolean;
export declare const writeResponse: (writeable: Duplex | ServerResponse, httpCode: keyof typeof codes, message: string, contentType?: contentTypes) => void;
export declare const jsonResponse: (response: ServerResponse, httpCode?: keyof typeof codes, json?: unknown, allowNull?: boolean) => void;
export declare const fetchJson: (url: string, init?: RequestInit | undefined) => Promise<unknown>;
export declare const getTokenFromRequest: (req: Request) => string | null;
export declare const isAuthorized: (req: Request, route: BrowserHTTPRoute | BrowserWebsocketRoute | HTTPRoute | WebSocketRoute, token: string | null) => boolean;
export declare const readRequestBody: (req: Request) => Promise<string>;
export declare const safeParse: (maybeJson: string) => unknown | null;
export declare const removeNullStringify: (json: unknown, allowNull?: boolean) => string;
export declare const jsonOrString: (maybeJson: string) => unknown | string;
export declare const readBody: (req: Request) => Promise<ReturnType<typeof safeParse>>;
export declare const getRouteFiles: (config: Config) => Promise<string[][]>;
export declare const make404: (...messages: string[]) => string;
/**
 * Returns a Promise that will automatically resolve
 * after the provided number of milliseconds.
 *
 * @param {number} time
 * @returns {Promise}
 */
export declare const sleep: (time: number) => Promise<void>;
/**
 * Returns a boolean if a given filepath (directory or file)
 * exists in the file system. Uses stat internally.
 *
 * @param {string} path The file or folder path
 * @returns {boolean}
 */
export declare const exists: (path: string) => Promise<boolean>;
/**
 * Returns a boolean if a given file, not directory,
 * exists in the file system. Uses stat internally.
 *
 * @param {string} path The file or folder path
 * @returns {boolean}
 */
export declare const fileExists: (path: string) => Promise<boolean>;
export declare const convertIfBase64: (item: string) => string;
export declare const availableBrowsers: Promise<(typeof CDPChromium | typeof PlaywrightChromium | typeof PlaywrightFirefox | typeof PlaywrightWebkit)[]>;
export declare const queryParamsToObject: (params: URLSearchParams) => Record<string, unknown>;
export declare const waitForFunction: (page: Page, opts: WaitForFunctionOptions) => Promise<void>;
export declare const waitForEvent: (page: Page, opts: WaitForEventOptions) => Promise<void>;
/**
 * Scrolls through the web-page to trigger any lazy-loaded
 * assets to load up. Currently doesn't support infinite-loading
 * pages as they'll increase the length of the page.
 *
 * @param page Page
 */
export declare const scrollThroughPage: (page: Page) => Promise<void>;
export declare const noop: () => void;
export declare const once: <A extends unknown[], R, T>(fn: (this: T, ...arg: A) => R) => (this: T, ...arg: A) => R | undefined;
export declare const getRandomNegativeInt: () => number;
/**
 * Converts an inbound req.url string to a valid URL object.
 * Handles cases where browserless might be behind a path or reverse proxy.
 *
 * @param url The inbound url, generally req.url
 * @param config The config object
 * @returns The full URL object
 */
export declare const convertPathToURL: (url: string, config: Config) => URL;
export declare const makeExternalURL: (externalAddress: string, ...parts: string[]) => string;
export declare class BadRequest extends Error {
    constructor(message: string);
}
export declare class TooManyRequests extends Error {
    constructor(message: string);
}
export declare class ServerError extends Error {
    constructor(message: string);
}
export declare class Unauthorized extends Error {
    constructor(message: string);
}
export declare class NotFound extends Error {
    constructor(message: string);
}
export declare class Timeout extends Error {
    constructor(message: string);
}
export declare const bestAttemptCatch: (bestAttempt: boolean) => (err: Error) => void;
export declare const parseBooleanParam: (params: URLSearchParams, name: string, defaultValue: boolean) => boolean;
export declare const parseNumberParam: (params: URLSearchParams, name: string, defaultValue: number) => number;
export declare const parseStringParam: (params: URLSearchParams, name: string, defaultValue: string) => any;
export declare const encrypt: (text: string, secret: Buffer) => string;
export declare const decrypt: (encryptedText: string, secret: Buffer) => string;
interface RequestInitTimeout extends RequestInit {
    timeout?: number;
}
export declare const fetchTimeout: (input: RequestInfo | URL, initWithTimeout?: RequestInitTimeout) => Promise<Response>;
export declare const untildify: (path: string) => string;
export declare const printLogo: (docsLink: string) => string;
export declare const getCDPClient: (page: Page) => CDPSession;
export {};
