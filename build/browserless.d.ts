/// <reference types="node" />
import { BrowserManager, Config, FileSystem, HTTPServer, Limiter, Metrics, Monitoring, WebHooks } from '@browserless.io/browserless';
export declare class Browserless {
    private config;
    private monitoring;
    private metrics;
    private fileSystem;
    private browserManager;
    private limiter;
    private webhooks;
    private debug;
    webSocketRouteFiles: string[];
    httpRouteFiles: string[];
    server?: HTTPServer;
    metricsSaveInterval: number;
    metricsSaveIntervalID?: NodeJS.Timer;
    constructor({ browserManager, config, monitoring, limiter, metrics, fileSystem, webhooks, }?: {
        browserManager?: BrowserManager;
        config?: Config;
        fileSystem?: FileSystem;
        limiter?: Limiter;
        metrics?: Metrics;
        monitoring?: Monitoring;
        webhooks?: WebHooks;
    });
    private saveMetrics;
    setMetricsSaveInterval: (interval: number) => void;
    addHTTPRoute(httpRouteFilePath: string): void;
    addWebSocketRoute(webSocketRouteFilePath: string): void;
    setPort(port: number): void;
    stop(): Promise<[void | undefined]>;
    start(): Promise<void>;
}
