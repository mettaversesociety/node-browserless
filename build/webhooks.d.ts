import { Config } from '@browserless.io/browserless';
export declare class WebHooks {
    private config;
    constructor(config: Config);
    private callURL;
    callFailedHealthURL(): Promise<void | Response> | undefined;
    callQueueAlertURL(): Promise<void | Response> | undefined;
    callRejectAlertURL(): Promise<void | Response> | undefined;
    callTimeoutAlertURL(): Promise<void | Response> | undefined;
    callErrorAlertURL(message: string): void | Promise<void | Response>;
}
