import { APITags, HTTPManagementRoutes, Methods, ServerError, contentTypes, jsonResponse, } from '@browserless.io/browserless';
const route = {
    accepts: [contentTypes.any],
    auth: true,
    browser: null,
    concurrency: false,
    contentTypes: [contentTypes.json],
    description: `Returns a JSON payload of the current system configuration.`,
    handler: async (_req, res) => {
        const { _config: getConfig } = route;
        if (!getConfig) {
            throw new ServerError(`Couldn't locate the config object`);
        }
        const config = getConfig();
        const response = {
            allowCORS: config.getAllowCORS(),
            allowFileProtocol: config.getAllowFileProtocol(),
            allowGetCalls: config.getAllowGetCalls(),
            concurrent: config.getConcurrent(),
            data: await config.getDataDir(),
            debug: config.getDebug(),
            errorAlertURL: config.getErrorAlertURL(),
            healthFailureURL: config.getFailedHealthURL(),
            host: config.getHost(),
            maxCPU: config.getCPULimit(),
            maxMemory: config.getMemoryLimit(),
            metricsJSONPath: config.getMetricsJSONPath(),
            port: config.getPort(),
            queued: config.getQueued(),
            queuedAlertURL: config.getQueueAlertURL(),
            rejectAlertURL: config.getRejectAlertURL(),
            retries: config.getRetries(),
            timeout: config.getTimeout(),
            timeoutAlertURL: config.getTimeoutAlertURL(),
            token: config.getToken(),
        };
        return jsonResponse(res, 200, response);
    },
    method: Methods.get,
    path: HTTPManagementRoutes.config,
    tags: [APITags.management],
};
export default route;
