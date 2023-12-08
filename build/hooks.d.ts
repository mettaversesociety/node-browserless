import { AfterResponse, BeforeRequest, BrowserHook, PageHook } from '@browserless.io/browserless';
export declare const beforeRequest: (args: BeforeRequest) => boolean;
export declare const afterRequest: (args: AfterResponse | unknown) => boolean;
export declare const browserHook: (opts: BrowserHook) => Promise<boolean>;
export declare const pageHook: (opts: PageHook) => Promise<boolean>;
