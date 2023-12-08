import { BrowserHTTPRoute, BrowserManager, BrowserWebsocketRoute, Config, HTTPRoute, Limiter, Metrics, WebSocketRoute } from '@browserless.io/browserless';
export interface HTTPServerOptions {
    concurrent: number;
    host: string;
    port: string;
    queued: number;
    timeout: number;
}
export declare class HTTPServer {
    private config;
    private metrics;
    private browserManager;
    private limiter;
    private httpRoutes;
    private webSocketRoutes;
    private server;
    private port;
    private host?;
    private log;
    private verbose;
    constructor(config: Config, metrics: Metrics, browserManager: BrowserManager, limiter: Limiter, httpRoutes: Array<HTTPRoute | BrowserHTTPRoute>, webSocketRoutes: Array<WebSocketRoute | BrowserWebsocketRoute>);
    private onQueueFullHTTP;
    private onQueueFullWebSocket;
    private onHTTPTimeout;
    private onWebsocketTimeout;
    private onHTTPUnauthorized;
    private onWebsocketUnauthorized;
    private wrapHTTPHandler;
    private wrapWebSocketHandler;
    private getTimeout;
    private registerHTTPRoute;
    private registerWebSocketRoute;
    start(): Promise<void>;
    stop(): Promise<void>;
    private tearDown;
    private handleRequest;
    private handleWebSocket;
}
