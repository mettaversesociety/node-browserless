/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { BrowserServerOptions, Config, Request } from '@browserless.io/browserless';
import playwright, { Page } from 'playwright-core';
import { Duplex } from 'stream';
import { EventEmitter } from 'events';
export declare class PlaywrightChromium extends EventEmitter {
    private config;
    private userDataDir;
    private record;
    private running;
    private proxy;
    private browser;
    private browserWSEndpoint;
    private debug;
    constructor({ config, userDataDir, record, }: {
        config: Config;
        record: boolean;
        userDataDir: PlaywrightChromium['userDataDir'];
    });
    private cleanListeners;
    isRunning: () => boolean;
    close: () => Promise<void>;
    pages: () => Promise<[]>;
    getPageId: () => string;
    makeLiveURL: () => void;
    newPage: () => Promise<Page>;
    launch: (options?: BrowserServerOptions) => Promise<playwright.BrowserServer>;
    wsEndpoint: () => string | null;
    publicWSEndpoint: (token: string) => string | null;
    proxyPageWebSocket: () => Promise<void>;
    proxyWebSocket: (req: Request, socket: Duplex, head: Buffer) => Promise<void>;
}
