import { TooManyRequests, afterRequest, createLogger, } from '@browserless.io/browserless';
import q from 'queue';
export class Limiter extends q {
    config;
    metrics;
    monitor;
    webhooks;
    queued;
    debug = createLogger('limiter');
    constructor(config, metrics, monitor, webhooks) {
        super({
            autostart: true,
            concurrency: config.getConcurrent(),
            timeout: config.getTimeout(),
        });
        this.config = config;
        this.metrics = metrics;
        this.monitor = monitor;
        this.webhooks = webhooks;
        this.queued = config.getQueued();
        this.debug(`Concurrency: ${this.concurrency} queue: ${this.queued} timeout: ${this.timeout}ms`);
        config.on('concurrent', (concurrency) => {
            this.debug(`Concurrency updated to ${concurrency}`);
            this.concurrency = concurrency;
        });
        config.on('queued', (queued) => {
            this.debug(`Queue updated to ${queued}`);
            this.queued = queued;
        });
        config.on('timeout', (timeout) => {
            this.debug(`Timeout updated to ${timeout}ms`);
            this.timeout = timeout <= 0 ? 0 : timeout;
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.addEventListener('timeout', this.handleJobTimeout);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.addEventListener('success', this.handleSuccess);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.addEventListener('error', this.handleFail);
        this.addEventListener('end', this.handleEnd);
    }
    handleEnd() {
        this.logQueue('All jobs complete.');
    }
    handleSuccess({ detail: { job } }) {
        const timeUsed = Date.now() - job.start;
        this.debug(`Job has succeeded after ${timeUsed.toLocaleString()}ms of activity.`);
        this.metrics.addSuccessful(Date.now() - job.start);
        // @TODO Figure out a better argument handling for jobs
        afterRequest({
            req: job.args[0],
            start: job.start,
            status: 'successful',
        });
    }
    handleJobTimeout({ detail: { next, job }, }) {
        const timeUsed = Date.now() - job.start;
        this.debug(`Job has hit timeout after ${timeUsed.toLocaleString()}ms of activity.`);
        this.metrics.addTimedout(Date.now() - job.start);
        this.webhooks.callTimeoutAlertURL();
        this.debug(`Calling timeout handler`);
        job?.onTimeoutFn(job);
        afterRequest({
            req: job.args[0],
            start: job.start,
            status: 'timedout',
        });
        next();
    }
    handleFail({ detail: { error, job }, }) {
        this.debug(`Recording failed stat, cleaning up: "${error?.toString()}"`);
        this.metrics.addError(Date.now() - job.start);
        this.webhooks.callErrorAlertURL(error?.toString() ?? 'Unknown Error');
        afterRequest({
            req: job.args[0],
            start: job.start,
            status: 'error',
        });
    }
    logQueue(message) {
        this.debug(`(Running: ${this.executing}, Pending: ${this.waiting}) ${message} `);
    }
    get executing() {
        return this.length > this.concurrency ? this.concurrency : this.length;
    }
    get waiting() {
        return this.length > this.concurrency ? this.length - this.concurrency : 0;
    }
    get willQueue() {
        return this.length >= this.concurrency;
    }
    get concurrencySize() {
        return this.concurrency;
    }
    get hasCapacity() {
        return this.length < this.concurrency + this.queued;
    }
    limit = (limitFn, overCapacityFn, onTimeoutFn, timeoutOverrideFn) => {
        return (...args) => new Promise(async (res, rej) => {
            const timeout = timeoutOverrideFn(...args) ?? this.timeout;
            this.logQueue(`Adding to queue, max time allowed is ${timeout.toLocaleString()}ms`);
            if (this.config.getHealthChecksEnabled()) {
                const { cpuOverloaded, memoryOverloaded } = await this.monitor.overloaded();
                if (cpuOverloaded || memoryOverloaded) {
                    this.logQueue(`Health checks have failed, rejecting`);
                    this.webhooks.callFailedHealthURL();
                    this.metrics.addRejected();
                    overCapacityFn(...args);
                    return rej(new Error(`Health checks have failed, rejecting`));
                }
            }
            if (!this.hasCapacity) {
                this.logQueue(`Concurrency and queue is at capacity`);
                this.webhooks.callRejectAlertURL();
                this.metrics.addRejected();
                overCapacityFn(...args);
                return rej(new TooManyRequests(`Concurrency and queue is at capacity`));
            }
            if (this.willQueue) {
                this.logQueue(`Concurrency is at capacity, queueing`);
                this.webhooks.callQueueAlertURL();
                this.metrics.addQueued();
            }
            const bound = async () => {
                this.logQueue(`Starting new job`);
                this.metrics.addRunning();
                try {
                    const result = await limitFn(...args);
                    res(result);
                    return;
                }
                catch (err) {
                    rej(err);
                    throw err;
                }
            };
            const job = Object.assign(bound, {
                args,
                onTimeoutFn: () => onTimeoutFn(...args),
                start: Date.now(),
                timeout,
            });
            this.push(job);
            return bound;
        });
    };
}
