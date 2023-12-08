import { IBrowserlessStats } from '@browserless.io/browserless';
export declare class Metrics {
    private sessionTimes;
    private successful;
    private queued;
    private rejected;
    private unauthorized;
    private concurrent;
    private timedout;
    private running;
    private unhealthy;
    private error;
    addSuccessful: (sessionTime: number) => number;
    addTimedout: (sessionTime: number) => number;
    addError: (sessionTime: number) => number;
    addQueued: () => number;
    addRejected: () => number;
    addUnhealthy: () => number;
    addUnauthorized: () => number;
    addRunning: () => number;
    get: () => Omit<IBrowserlessStats, 'cpu' | 'memory'>;
    reset: () => void;
    private calculateStats;
}
