/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { CDPLaunchOptions, Config, Request } from '@browserless.io/browserless';
import { Browser, Page } from 'puppeteer-core';
import { Duplex } from 'stream';
import { EventEmitter } from 'events';
export declare class CDPChromium extends EventEmitter {
    private config;
    private userDataDir;
    private record;
    private blockAds;
    private running;
    private browser;
    private browserWSEndpoint;
    private port?;
    private debug;
    private proxy;
    constructor({ userDataDir, config, record, blockAds, }: {
        blockAds: boolean;
        config: Config;
        record: boolean;
        userDataDir: CDPChromium['userDataDir'];
    });
    private cleanListeners;
    private setUpEmbeddedAPI;
    getPageId: (page: Page) => string;
    makeLiveURL: (browserId: string, pageId: string) => string;
    private onTargetCreated;
    isRunning: () => boolean;
    newPage: () => Promise<Page>;
    close: () => Promise<void>;
    pages: () => Promise<Page[]>;
    process: () => import("child_process").ChildProcess | null;
    launch: (options?: CDPLaunchOptions) => Promise<Browser>;
    wsEndpoint: () => string | null;
    publicWSEndpoint: (token: string) => string | null;
    proxyPageWebSocket: (req: Request, socket: Duplex, head: Buffer) => Promise<void>;
    proxyWebSocket: (req: Request, socket: Duplex, head: Buffer) => Promise<void>;
}
