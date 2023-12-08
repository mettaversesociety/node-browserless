import { BrowserInstance, Config, Request } from '@browserless.io/browserless';
import { FunctionRunner } from './client.js';
import { Page } from 'puppeteer-core';
import debug from 'debug';
declare global {
    interface Window {
        BrowserlessFunctionRunner: typeof FunctionRunner;
    }
}
interface HandlerOptions {
    downloadPath?: string;
}
declare const _default: (config: Config, debug: debug.Debugger, options?: HandlerOptions) => (req: Request, browser: BrowserInstance) => Promise<{
    contentType: string;
    page: Page;
    payload: unknown;
}>;
export default _default;
