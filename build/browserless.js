import * as path from 'path';
import { BrowserManager, Config, FileSystem, HTTPServer, Limiter, Metrics, Monitoring, WebHooks, availableBrowsers, createLogger, getRouteFiles, makeExternalURL, printLogo, safeParse, } from '@browserless.io/browserless';
import { readFile } from 'fs/promises';
import { userInfo } from 'os';
const routeSchemas = ['body', 'query'];
export class Browserless {
    config;
    monitoring;
    metrics;
    fileSystem;
    browserManager;
    limiter;
    webhooks;
    debug = createLogger('index');
    webSocketRouteFiles = [];
    httpRouteFiles = [];
    server;
    metricsSaveInterval = 5 * 60 * 1000;
    metricsSaveIntervalID;
    constructor({ browserManager, config, monitoring, limiter, metrics, fileSystem, webhooks, } = {}) {
        this.config = config || new Config();
        this.metrics = metrics || new Metrics();
        this.webhooks = webhooks || new WebHooks(this.config);
        this.browserManager = browserManager || new BrowserManager(this.config);
        this.monitoring = monitoring || new Monitoring(this.config);
        this.fileSystem = fileSystem || new FileSystem(this.config);
        this.limiter =
            limiter ||
                new Limiter(this.config, this.metrics, this.monitoring, this.webhooks);
    }
    saveMetrics = async () => {
        const metricsPath = this.config.getMetricsJSONPath();
        const { cpu, memory } = await this.monitoring.getMachineStats();
        const metrics = await this.metrics.get();
        const aggregatedStats = {
            ...metrics,
            cpu,
            memory,
        };
        this.metrics.reset();
        this.debug(`Current period usage: ${JSON.stringify({
            date: aggregatedStats.date,
            error: aggregatedStats.error,
            maxConcurrent: aggregatedStats.maxConcurrent,
            maxTime: aggregatedStats.maxTime,
            meanTime: aggregatedStats.meanTime,
            minTime: aggregatedStats.minTime,
            rejected: aggregatedStats.rejected,
            successful: aggregatedStats.successful,
            timedout: aggregatedStats.timedout,
            totalTime: aggregatedStats.totalTime,
            units: aggregatedStats.units,
        })}`);
        if (metricsPath) {
            this.debug(`Saving metrics to "${metricsPath}"`);
            this.fileSystem.append(metricsPath, JSON.stringify(aggregatedStats));
        }
    };
    setMetricsSaveInterval = (interval) => {
        if (interval <= 0) {
            return console.warn(`Interval value of "${interval}" must be greater than 1. Ignoring`);
        }
        clearInterval(this.metricsSaveInterval);
        this.metricsSaveInterval = interval;
        this.metricsSaveIntervalID = setInterval(this.saveMetrics, this.metricsSaveInterval);
    };
    addHTTPRoute(httpRouteFilePath) {
        this.httpRouteFiles.push(httpRouteFilePath);
    }
    addWebSocketRoute(webSocketRouteFilePath) {
        this.webSocketRouteFiles.push(webSocketRouteFilePath);
    }
    setPort(port) {
        if (this.server) {
            throw new Error(`Server is already instantiated and bound to port ${this.config.getPort()}`);
        }
        this.config.setPort(port);
    }
    async stop() {
        clearInterval(this.metricsSaveIntervalID);
        return Promise.all([this.server?.stop()]);
    }
    async start() {
        const httpRoutes = [];
        const wsRoutes = [];
        const [[httpRouteFiles, wsRouteFiles], installedBrowsers] = await Promise.all([getRouteFiles(this.config), availableBrowsers]);
        const docsLink = makeExternalURL(this.config.getExternalAddress(), '/docs');
        this.debug(printLogo(docsLink));
        this.debug(`Running as user "${userInfo().username}"`);
        this.debug('Starting import of HTTP Routes');
        for (const httpRoute of httpRouteFiles) {
            if (httpRoute.endsWith('js')) {
                const { name } = path.parse(httpRoute);
                const [bodySchema, querySchema] = await Promise.all(routeSchemas.map(async (schemaType) => {
                    const schemaPath = path.parse(httpRoute);
                    schemaPath.base = `${schemaPath.name}.${schemaType}.json`;
                    return await readFile(path.format(schemaPath), 'utf-8').catch(() => '');
                }));
                const routeImport = `${this.config.getIsWin() ? 'file:///' : ''}${httpRoute}`;
                const logger = createLogger(`http:${name}`);
                const { default: route } = await import(routeImport + `?cb=${Date.now()}`);
                route.bodySchema = safeParse(bodySchema);
                route.querySchema = safeParse(querySchema);
                route._config = () => this.config;
                route._metrics = () => this.metrics;
                route._monitor = () => this.monitoring;
                route._fileSystem = () => this.fileSystem;
                route._debug = () => logger;
                httpRoutes.push(route);
            }
        }
        this.debug('Starting import of WebSocket Routes');
        for (const wsRoute of wsRouteFiles) {
            if (wsRoute.endsWith('js')) {
                const { name } = path.parse(wsRoute);
                const [, querySchema] = await Promise.all(routeSchemas.map(async (schemaType) => {
                    const schemaPath = path.parse(wsRoute);
                    schemaPath.base = `${schemaPath.name}.${schemaType}.json`;
                    return await readFile(path.format(schemaPath), 'utf-8').catch(() => '');
                }));
                const wsImport = `${this.config.getIsWin() ? 'file:///' : ''}${wsRoute}`;
                const logger = createLogger(`ws:${name}`);
                const { default: route, } = await import(wsImport + `?cb=${Date.now()}`);
                route.querySchema = safeParse(querySchema);
                route._config = () => this.config;
                route._metrics = () => this.metrics;
                route._monitor = () => this.monitoring;
                route._fileSystem = () => this.fileSystem;
                route._debug = () => logger;
                wsRoutes.push(route);
            }
        }
        // Validate that browsers are installed and route paths are unique
        [...httpRoutes, ...wsRoutes].forEach((route) => {
            if (route.browser &&
                !installedBrowsers.some((b) => b.name === route.browser.name)) {
                throw new Error(`Couldn't load route "${route.path}" due to missing browser of "${route.browser.name}"`);
            }
        });
        this.debug(`Imported and validated all route files, starting up server.`);
        this.server = new HTTPServer(this.config, this.metrics, this.browserManager, this.limiter, httpRoutes, wsRoutes);
        await this.server.start();
        this.debug(`Starting metrics collection.`);
        this.metricsSaveIntervalID = setInterval(() => this.saveMetrics(), this.metricsSaveInterval);
    }
}
