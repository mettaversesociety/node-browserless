import { Config, Metrics, Monitoring, WebHooks } from '@browserless.io/browserless';
import q from 'queue';
export type LimitFn<TArgs extends unknown[], TResult> = (...args: TArgs) => Promise<TResult>;
export type ErrorFn<TArgs extends unknown[]> = (...args: TArgs) => void;
export declare class Limiter extends q {
    private config;
    private metrics;
    private monitor;
    private webhooks;
    private queued;
    private debug;
    constructor(config: Config, metrics: Metrics, monitor: Monitoring, webhooks: WebHooks);
    private handleEnd;
    private handleSuccess;
    private handleJobTimeout;
    private handleFail;
    private logQueue;
    get executing(): number;
    get waiting(): number;
    get willQueue(): boolean;
    get concurrencySize(): number;
    get hasCapacity(): boolean;
    limit: <TArgs extends unknown[], TResult>(limitFn: LimitFn<TArgs, TResult>, overCapacityFn: ErrorFn<TArgs>, onTimeoutFn: ErrorFn<TArgs>, timeoutOverrideFn: (...args: TArgs) => number | undefined) => LimitFn<TArgs, unknown>;
}
