import { exists, keyLength, untildify } from '@browserless.io/browserless';
import { EventEmitter } from 'events';
import debug from 'debug';
import { mkdir } from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';
/**
 * configs to add:
 * EXIT_ON_HEALTH_FAILURE
 * MAX_PAYLOAD_SIZE
 */
var oldConfig;
(function (oldConfig) {
    oldConfig["CONNECTION_TIMEOUT"] = "CONNECTION_TIMEOUT";
    oldConfig["DEFAULT_USER_DATA_DIR"] = "DEFAULT_USER_DATA_DIR";
    oldConfig["ENABLE_API_GET"] = "ENABLE_API_GET";
    oldConfig["ENABLE_CORS"] = "ENABLE_CORS";
    oldConfig["MAX_CONCURRENT_SESSIONS"] = "MAX_CONCURRENT_SESSIONS";
    oldConfig["PRE_REQUEST_HEALTH_CHECK"] = "PRE_REQUEST_HEALTH_CHECK";
    oldConfig["PROXY_URL"] = "PROXY_URL";
    oldConfig["QUEUE_LENGTH"] = "QUEUE_LENGTH";
})(oldConfig || (oldConfig = {}));
var newConfigMap;
(function (newConfigMap) {
    newConfigMap["CONNECTION_TIMEOUT"] = "TIMEOUT";
    newConfigMap["DEFAULT_USER_DATA_DIR"] = "DATA_DIR";
    newConfigMap["ENABLE_API_GET"] = "ALLOW_GET";
    newConfigMap["ENABLE_CORS"] = "CORS";
    newConfigMap["MAX_CONCURRENT_SESSIONS"] = "CONCURRENT";
    newConfigMap["PRE_REQUEST_HEALTH_CHECK"] = "HEALTH";
    newConfigMap["PROXY_URL"] = "EXTERNAL";
    newConfigMap["QUEUE_LENGTH"] = "QUEUED";
})(newConfigMap || (newConfigMap = {}));
var deprecatedConfig;
(function (deprecatedConfig) {
    deprecatedConfig["CHROME_REFRESH_TIME"] = "CHROME_REFRESH_TIME";
    deprecatedConfig["DEFAULT_BLOCK_ADS"] = "DEFAULT_BLOCK_ADS";
    deprecatedConfig["DEFAULT_DUMPIO"] = "DEFAULT_DUMPIO";
    deprecatedConfig["DEFAULT_HEADLESS"] = "DEFAULT_HEADLESS";
    deprecatedConfig["DEFAULT_IGNORE_DEFAULT_ARGS"] = "DEFAULT_IGNORE_DEFAULT_ARGS";
    deprecatedConfig["DEFAULT_IGNORE_HTTPS_ERRORS"] = "DEFAULT_IGNORE_HTTPS_ERRORS";
    deprecatedConfig["DEFAULT_LAUNCH_ARGS"] = "DEFAULT_LAUNCH_ARGS";
    deprecatedConfig["DEFAULT_STEALTH"] = "DEFAULT_STEALTH";
    deprecatedConfig["DISABLED_FEATURES"] = "DISABLED_FEATURES";
    deprecatedConfig["ENABLE_HEAP_DUMP"] = "ENABLE_HEAP_DUMP";
    deprecatedConfig["FUNCTION_BUILT_INS"] = "FUNCTION_BUILT_INS";
    deprecatedConfig["FUNCTION_ENABLE_INCOGNITO_MODE"] = "FUNCTION_ENABLE_INCOGNITO_MODE";
    deprecatedConfig["FUNCTION_ENV_VARS"] = "FUNCTION_ENV_VARS";
    deprecatedConfig["FUNCTION_EXTERNALS"] = "FUNCTION_EXTERNALS";
    deprecatedConfig["KEEP_ALIVE"] = "KEEP_ALIVE";
    deprecatedConfig["PREBOOT_CHROME"] = "PREBOOT_CHROME";
    deprecatedConfig["PRINT_GET_STARTED_LINKS"] = "PRINT_GET_STARTED_LINKS";
    deprecatedConfig["WORKSPACE_DELETE_EXPIRED"] = "WORKSPACE_DELETE_EXPIRED";
    deprecatedConfig["WORKSPACE_DIR"] = "WORKSPACE_DIR";
    deprecatedConfig["WORKSPACE_EXPIRE_DAYS"] = "WORKSPACE_EXPIRE_DAYS";
})(deprecatedConfig || (deprecatedConfig = {}));
for (const config in deprecatedConfig) {
    if (process.env[config] !== undefined) {
        console.error(`Environment variable of "${config}" is deprecated and ignored. See for more details`);
    }
}
for (const config in oldConfig) {
    if (process.env[config] !== undefined) {
        const newConfigName = newConfigMap[config];
        if (newConfigName) {
            console.error(`Please use variable name "${newConfigName}" in place of "${config}"`);
        }
        else {
            console.error(`Environment variable of "${config}" has changed and will be removed in an upcoming release.`);
        }
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseEnvVars = (defaultVal, ...variableNames) => {
    return variableNames.reduce((priorReturn, variable, idx, all) => {
        if (priorReturn !== undefined) {
            return priorReturn;
        }
        const envVar = process.env[variable];
        if (envVar !== undefined) {
            return envVar !== 'false';
        }
        if (idx === all.length - 1 && priorReturn === undefined) {
            return defaultVal;
        }
    }, undefined);
};
const getDebug = () => {
    if (typeof process.env.DEBUG !== 'undefined') {
        return process.env.DEBUG;
    }
    process.env.DEBUG = 'browserless*,-**:verbose';
    debug.enable(process.env.DEBUG);
    return process.env.DEBUG;
};
export class Config extends EventEmitter {
    debug = getDebug();
    host = process.env.HOST ?? 'localhost';
    external = process.env.PROXY_URL ?? process.env.EXTERNAL;
    isWin = process.platform === 'win32';
    port = +(process.env.PORT ?? '3000');
    downloadsDir = process.env.DOWNLOAD_DIR
        ? untildify(process.env.DOWNLOAD_DIR)
        : path.join(tmpdir(), 'browserless-download-dirs');
    dataDir = process.env.DATA_DIR
        ? untildify(process.env.DATA_DIR)
        : path.join(tmpdir(), 'browserless-data-dirs');
    metricsJSONPath = process.env.METRICS_JSON_PATH
        ? untildify(process.env.METRICS_JSON_PATH)
        : path.join(tmpdir(), 'browserless-metrics.json');
    createDataDir = !process.env.DATA_DIR;
    createDownloadsDir = !process.env.DOWNLOAD_DIR;
    routes = process.env.ROUTES
        ? untildify(process.env.ROUTES)
        : path.join(process.cwd(), 'build', 'routes');
    token = process.env.TOKEN || null;
    concurrent = +(process.env.CONCURRENT ??
        process.env.MAX_CONCURRENT_SESSIONS ??
        '10');
    queued = +(process.env.QUEUE_LENGTH ?? process.env.QUEUED ?? '10');
    timeout = +(process.env.TIMEOUT ??
        process.env.CONNECTION_TIMEOUT ??
        '30000');
    static = process.env.STATIC ?? path.join(process.cwd(), 'static');
    retries = +(process.env.RETRIES ?? '5');
    allowFileProtocol = !!parseEnvVars(false, 'ALLOW_FILE_PROTOCOL');
    allowGet = !!parseEnvVars(false, 'ALLOW_GET', 'ENABLE_API_GET');
    allowCors = !!parseEnvVars(false, 'CORS', 'ENABLE_CORS');
    corsMethods = process.env.CORS_ALLOW_METHODS ?? 'OPTIONS, POST, GET';
    corsOrigin = process.env.CORS_ALLOW_ORIGIN ?? '*';
    corsMaxAge = +(process.env.CORS_MAX_AGE ?? '2592000');
    maxCpu = +(process.env.MAX_CPU_PERCENT ?? '99');
    maxMemory = +(process.env.MAX_MEMORY_PERCENT ?? '99');
    healthCheck = !!parseEnvVars(false, 'HEALTH');
    failedHealthURL = process.env.FAILED_HEALTH_URL ?? null;
    queueAlertURL = process.env.QUEUE_ALERT_URL ?? null;
    rejectAlertURL = process.env.REJECT_ALERT_URL ?? null;
    timeoutAlertURL = process.env.TIMEOUT_ALERT_URL ?? null;
    errorAlertURL = process.env.ERROR_ALERT_URL ?? null;
    getRoutes = () => this.routes;
    getHost = () => this.host;
    getPort = () => this.port;
    getIsWin = () => this.isWin;
    getToken = () => this.token;
    getDebug = () => this.debug;
    /**
     * The maximum number of concurrent sessions allowed. Set
     * to "-1" or "Infinity" for no limit.
     * @returns number
     */
    getConcurrent = () => this.concurrent;
    /**
     * The maximum number of queued sessions allowed. Set to
     * "-1" or "Infinity" for no limit.
     * @returns number
     */
    getQueued = () => this.queued;
    getTimeout = () => this.timeout;
    getStatic = () => this.static;
    getRetries = () => this.retries;
    getAllowFileProtocol = () => this.allowFileProtocol;
    getCPULimit = () => this.maxCpu;
    getMemoryLimit = () => this.maxMemory;
    getHealthChecksEnabled = () => this.healthCheck;
    getFailedHealthURL = () => this.failedHealthURL;
    getQueueAlertURL = () => this.queueAlertURL;
    getRejectAlertURL = () => this.rejectAlertURL;
    getTimeoutAlertURL = () => this.timeoutAlertURL;
    getErrorAlertURL = () => this.errorAlertURL;
    /**
     * If true, allows GET style calls on our browser-based APIs, using
     * ?body=JSON format.
     */
    getAllowGetCalls = () => this.allowGet;
    /**
     * Determines if CORS is allowed
     */
    getAllowCORS = () => this.allowCors;
    getDataDir = async () => {
        if (this.createDataDir && !(await exists(this.dataDir))) {
            await mkdir(this.dataDir, { recursive: true }).catch((err) => {
                throw new Error(`Error in creating the data directory ${err}, exiting`);
            });
            this.createDataDir = false;
        }
        if (!(await exists(this.dataDir))) {
            throw new Error(`"${this.dataDir}" Directory doesn't exist, did you forget to mount or make it?`);
        }
        return this.dataDir;
    };
    getDownloadsDir = async () => {
        if (this.createDownloadsDir && !(await exists(this.downloadsDir))) {
            await mkdir(this.downloadsDir, { recursive: true }).catch((err) => {
                throw new Error(`Error in creating the downloads directory ${err}, exiting`);
            });
            this.createDownloadsDir = false;
        }
        if (!(await exists(this.downloadsDir))) {
            throw new Error(`"${this.downloadsDir}" Directory doesn't exist, did you forget to mount or make it?`);
        }
        return this.downloadsDir;
    };
    /**
     * Repeats the TOKEN parameter up to 24 characters so we can
     * do AES encoding for saving things to disk and generating
     * secure links.
     */
    getAESKey = () => {
        const aesToken = this.token || 'browserless';
        return Buffer.from(aesToken.repeat(keyLength).substring(0, keyLength));
    };
    getMetricsJSONPath = () => this.metricsJSONPath;
    setDataDir = async (newDataDir) => {
        if (!(await exists(newDataDir))) {
            throw new Error(`New data-directory "${newDataDir}" doesn't exist, did you forget to mount or create it?`);
        }
        this.dataDir = newDataDir;
        this.emit('data-dir', newDataDir);
        return this.dataDir;
    };
    setRoutes = (newRoutePath) => {
        this.emit('routes', newRoutePath);
        return (this.routes = newRoutePath);
    };
    setConcurrent = (newConcurrent) => {
        this.emit('concurrent', newConcurrent);
        return (this.concurrent = newConcurrent);
    };
    setQueued = (newQueued) => {
        this.emit('queued', newQueued);
        return (this.queued = newQueued);
    };
    setToken = (newToken) => {
        this.emit('token', newToken);
        return (this.token = newToken);
    };
    setTimeout = (newTimeout) => {
        this.emit('timeout', newTimeout);
        return (this.timeout = newTimeout);
    };
    setStatic = (newStatic) => {
        this.emit('static', newStatic);
        return (this.static = newStatic);
    };
    setRetries = (newRetries) => {
        this.emit('retries', newRetries);
        return (this.retries = newRetries);
    };
    setCPULimit = (limit) => {
        this.emit('cpuLimit', limit);
        return (this.maxCpu = limit);
    };
    setMemoryLimit = (limit) => {
        this.emit('memoryLimit', limit);
        return (this.maxMemory = limit);
    };
    enableHealthChecks = (enable) => {
        this.emit('healthCheck', enable);
        return (this.healthCheck = enable);
    };
    enableGETRequests = (enable) => {
        this.emit('getRequests', enable);
        return (this.allowGet = enable);
    };
    enableCORS = (enable) => {
        this.emit('cors', enable);
        return (this.allowCors = enable);
    };
    setCORSMethods = (methods) => {
        this.emit('corsMethods', methods);
        return (this.corsMethods = methods);
    };
    setCORSOrigin = (origin) => {
        this.emit('corsOrigin', origin);
        return (this.corsOrigin = origin);
    };
    setCORSMaxAge = (maxAge) => {
        this.emit('corsMaxAge', maxAge);
        return (this.corsMaxAge = maxAge);
    };
    setFailedHealthURL = (url) => {
        this.emit('failedHealthURL');
        return (this.failedHealthURL = url);
    };
    setQueueAlertURL = (url) => {
        this.emit('queueAlertURL');
        return (this.queueAlertURL = url);
    };
    setRejectAlertURL = (url) => {
        this.emit('rejectAlertURL');
        return (this.rejectAlertURL = url);
    };
    setTimeoutAlertURL = (url) => {
        this.emit('timeoutAlertURL');
        return (this.timeoutAlertURL = url);
    };
    setErrorAlertURL = (url) => {
        this.emit('errorAlertURL');
        return (this.errorAlertURL = url);
    };
    setMetricsJSONPath = (path) => {
        this.emit('metricsJSONPath', path);
        return (this.metricsJSONPath = path);
    };
    setPort = (port) => {
        this.emit('port', port);
        return (this.port = port);
    };
    setAllowFileProtocol = (allow) => {
        this.emit('allowFileProtocol', allow);
        return (this.allowFileProtocol = allow);
    };
    /**
     * Returns the fully-qualified server address, which
     * includes host, protocol, and port for which the
     * server is *actively* listening on. For uses behind
     * a reverse proxy or some other load-balancer, use
     * #getExternalAddress
     *
     * @returns Fully-qualified server address
     */
    getServerAddress = () => this.port === 443
        ? `https://${this.host}:${this.port}`
        : this.port === 80
            ? `http://${this.host}`
            : `http://${this.host}:${this.port}`;
    /**
     * Returns the the fully-qualified URL for the
     * external address that browserless might be
     * running behind *or* the server address if
     * no external URL is provided.
     *
     * @returns {string} The URL to reach the server
     */
    getExternalAddress = () => this.external ?? this.getServerAddress();
    /**
     * When CORS is enabled, returns relevant CORS headers
     * to requests and for the OPTIONS call. Values can be
     * overridden by specifying `CORS_ALLOW_METHODS`, `CORS_ALLOW_ORIGIN`,
     * and `CORS_MAX_AGE`
     */
    getCORSHeaders = () => ({
        'Access-Control-Allow-Methods': this.corsMethods,
        'Access-Control-Allow-Origin': this.corsOrigin,
        'Access-Control-Max-Age': this.corsMaxAge,
    });
}
