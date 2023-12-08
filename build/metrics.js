export class Metrics {
    sessionTimes = [];
    successful = 0;
    queued = 0;
    rejected = 0;
    unauthorized = 0;
    concurrent = 0;
    timedout = 0;
    running = 0;
    unhealthy = 0;
    error = 0;
    addSuccessful = (sessionTime) => {
        --this.running;
        this.sessionTimes.push(sessionTime);
        return ++this.successful;
    };
    addTimedout = (sessionTime) => {
        --this.running;
        this.sessionTimes.push(sessionTime);
        return ++this.timedout;
    };
    addError = (sessionTime) => {
        --this.running;
        this.sessionTimes.push(sessionTime);
        return ++this.error;
    };
    addQueued = () => {
        return ++this.queued;
    };
    addRejected = () => {
        return ++this.rejected;
    };
    addUnhealthy = () => {
        return ++this.unhealthy;
    };
    addUnauthorized = () => {
        return ++this.unauthorized;
    };
    addRunning = () => {
        ++this.running;
        if (this.concurrent < this.running) {
            this.concurrent = this.running;
        }
        return this.running;
    };
    get = () => {
        const currentStat = {
            error: this.error,
            maxConcurrent: this.concurrent,
            queued: this.queued,
            rejected: this.rejected,
            running: this.running,
            sessionTimes: this.sessionTimes,
            successful: this.successful,
            timedout: this.timedout,
            unauthorized: this.unauthorized,
            unhealthy: this.unhealthy,
        };
        return {
            ...currentStat,
            ...this.calculateStats(currentStat.sessionTimes),
            date: Date.now(),
        };
    };
    reset = () => {
        this.successful = 0;
        this.error = 0;
        this.queued = 0;
        this.rejected = 0;
        this.unauthorized = 0;
        this.concurrent = 0;
        this.timedout = 0;
        this.running = 0;
        this.unhealthy = 0;
        this.sessionTimes = [];
    };
    calculateStats(sessionTimes) {
        return {
            maxTime: Math.max(...sessionTimes) || 0,
            meanTime: sessionTimes.reduce((avg, value, _, { length }) => avg + value / length, 0),
            minTime: Math.min(...sessionTimes) || 0,
            totalTime: sessionTimes.reduce((sum, value) => sum + value, 0),
            units: sessionTimes.reduce((sum, value) => sum + Math.ceil(value / 30000), 0),
        };
    }
}
