/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class Config extends EventEmitter {
    private readonly debug;
    private readonly host;
    private readonly external;
    private readonly isWin;
    private port;
    private downloadsDir;
    private dataDir;
    private metricsJSONPath;
    private createDataDir;
    private createDownloadsDir;
    private routes;
    private token;
    private concurrent;
    private queued;
    private timeout;
    private static;
    private retries;
    private allowFileProtocol;
    private allowGet;
    private allowCors;
    private corsMethods;
    private corsOrigin;
    private corsMaxAge;
    private maxCpu;
    private maxMemory;
    private healthCheck;
    private failedHealthURL;
    private queueAlertURL;
    private rejectAlertURL;
    private timeoutAlertURL;
    private errorAlertURL;
    getRoutes: () => string;
    getHost: () => string;
    getPort: () => number;
    getIsWin: () => boolean;
    getToken: () => string | null;
    getDebug: () => string;
    /**
     * The maximum number of concurrent sessions allowed. Set
     * to "-1" or "Infinity" for no limit.
     * @returns number
     */
    getConcurrent: () => number;
    /**
     * The maximum number of queued sessions allowed. Set to
     * "-1" or "Infinity" for no limit.
     * @returns number
     */
    getQueued: () => number;
    getTimeout: () => number;
    getStatic: () => string;
    getRetries: () => number;
    getAllowFileProtocol: () => boolean;
    getCPULimit: () => number;
    getMemoryLimit: () => number;
    getHealthChecksEnabled: () => boolean;
    getFailedHealthURL: () => string | null;
    getQueueAlertURL: () => string | null;
    getRejectAlertURL: () => string | null;
    getTimeoutAlertURL: () => string | null;
    getErrorAlertURL: () => string | null;
    /**
     * If true, allows GET style calls on our browser-based APIs, using
     * ?body=JSON format.
     */
    getAllowGetCalls: () => boolean;
    /**
     * Determines if CORS is allowed
     */
    getAllowCORS: () => boolean;
    getDataDir: () => Promise<string>;
    getDownloadsDir: () => Promise<string>;
    /**
     * Repeats the TOKEN parameter up to 24 characters so we can
     * do AES encoding for saving things to disk and generating
     * secure links.
     */
    getAESKey: () => Buffer;
    getMetricsJSONPath: () => string;
    setDataDir: (newDataDir: string) => Promise<string>;
    setRoutes: (newRoutePath: string) => string;
    setConcurrent: (newConcurrent: number) => number;
    setQueued: (newQueued: number) => number;
    setToken: (newToken: string | null) => string | null;
    setTimeout: (newTimeout: number) => number;
    setStatic: (newStatic: string) => string;
    setRetries: (newRetries: number) => number;
    setCPULimit: (limit: number) => number;
    setMemoryLimit: (limit: number) => number;
    enableHealthChecks: (enable: boolean) => boolean;
    enableGETRequests: (enable: boolean) => boolean;
    enableCORS: (enable: boolean) => boolean;
    setCORSMethods: (methods: string) => string;
    setCORSOrigin: (origin: string) => string;
    setCORSMaxAge: (maxAge: number) => number;
    setFailedHealthURL: (url: string | null) => string | null;
    setQueueAlertURL: (url: string | null) => string | null;
    setRejectAlertURL: (url: string | null) => string | null;
    setTimeoutAlertURL: (url: string | null) => string | null;
    setErrorAlertURL: (url: string | null) => string | null;
    setMetricsJSONPath: (path: string) => string;
    setPort: (port: number) => number;
    setAllowFileProtocol: (allow: boolean) => boolean;
    /**
     * Returns the fully-qualified server address, which
     * includes host, protocol, and port for which the
     * server is *actively* listening on. For uses behind
     * a reverse proxy or some other load-balancer, use
     * #getExternalAddress
     *
     * @returns Fully-qualified server address
     */
    getServerAddress: () => string;
    /**
     * Returns the the fully-qualified URL for the
     * external address that browserless might be
     * running behind *or* the server address if
     * no external URL is provided.
     *
     * @returns {string} The URL to reach the server
     */
    getExternalAddress: () => string;
    /**
     * When CORS is enabled, returns relevant CORS headers
     * to requests and for the OPTIONS call. Values can be
     * overridden by specifying `CORS_ALLOW_METHODS`, `CORS_ALLOW_ORIGIN`,
     * and `CORS_MAX_AGE`
     */
    getCORSHeaders: () => {
        'Access-Control-Allow-Methods': string;
        'Access-Control-Allow-Origin': string;
        'Access-Control-Max-Age': number;
    };
}
