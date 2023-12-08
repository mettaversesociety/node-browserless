import { HTTPRoute } from '@browserless.io/browserless';
export interface ResponseSchema {
    allowCORS: boolean;
    allowFileProtocol: boolean;
    allowGetCalls: boolean;
    concurrent: number;
    data: string;
    debug: string;
    errorAlertURL: string | null;
    healthFailureURL: string | null;
    host: string;
    maxCPU: number;
    maxMemory: number;
    metricsJSONPath: string;
    port: number;
    queued: number;
    queuedAlertURL: string | null;
    rejectAlertURL: string | null;
    retries: number;
    timeout: number;
    timeoutAlertURL: string | null;
    token: string | null;
}
declare const route: HTTPRoute;
export default route;
