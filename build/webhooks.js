import { fetchTimeout, noop } from '@browserless.io/browserless';
export class WebHooks {
    config;
    constructor(config) {
        this.config = config;
    }
    callURL(url) {
        if (url) {
            return fetchTimeout(url, {
                method: 'GET',
                timeout: 10000,
            }).catch(noop);
        }
        return;
    }
    callFailedHealthURL() {
        const url = this.config.getFailedHealthURL();
        return this.callURL(url);
    }
    callQueueAlertURL() {
        const url = this.config.getQueueAlertURL();
        return this.callURL(url);
    }
    callRejectAlertURL() {
        const url = this.config.getRejectAlertURL();
        return this.callURL(url);
    }
    callTimeoutAlertURL() {
        const url = this.config.getTimeoutAlertURL();
        return this.callURL(url);
    }
    callErrorAlertURL(message) {
        const url = this.config.getErrorAlertURL();
        try {
            const fullURL = new URL(url ?? '');
            fullURL?.searchParams.set('error', message);
            return this.callURL(fullURL.href);
        }
        catch (err) {
            return console.error(`Issue calling error hook: "${err}". Did you set a working ERROR_ALERT_URL env variable?`);
        }
    }
}
