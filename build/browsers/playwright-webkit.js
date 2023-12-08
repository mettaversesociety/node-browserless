import { ServerError, createLogger, } from '@browserless.io/browserless';
import playwright from 'playwright-core';
import { EventEmitter } from 'events';
import httpProxy from 'http-proxy';
export class PlaywrightWebkit extends EventEmitter {
    config;
    userDataDir;
    record;
    running = false;
    proxy = httpProxy.createProxyServer();
    browser = null;
    browserWSEndpoint = null;
    debug = createLogger('browsers:playwright:webkit');
    constructor({ config, userDataDir, record, }) {
        super();
        this.userDataDir = userDataDir;
        this.config = config;
        this.record = record;
        this.debug(`Starting new browser instance`);
    }
    cleanListeners() {
        this.removeAllListeners();
    }
    isRunning = () => this.running;
    close = async () => {
        if (this.browser) {
            this.debug(`Closing browser process and all listeners`);
            this.emit('close');
            this.cleanListeners();
            this.browser.close();
            this.running = false;
            this.browser = null;
            this.browserWSEndpoint = null;
        }
    };
    pages = async () => [];
    getPageId = () => {
        throw new ServerError(`#getPageId is not yet supported with this browser.`);
    };
    makeLiveURL = () => {
        throw new ServerError(`Live URLs are not yet supported with this browser.`);
    };
    newPage = async () => {
        throw new ServerError(`Can't create new page with this browser`);
    };
    launch = async (options = {}) => {
        if (this.record) {
            throw new ServerError(`Recording is not yet available with this browser`);
        }
        this.debug(`Launching WebKit Handler`);
        this.browser = await playwright.webkit.launchServer({
            ...options,
            args: [this.userDataDir ? `-profile=${this.userDataDir}` : ''],
            executablePath: playwright.webkit.executablePath(),
        });
        const browserWSEndpoint = this.browser.wsEndpoint();
        this.debug(`Browser is running on ${browserWSEndpoint}`);
        this.browserWSEndpoint = browserWSEndpoint;
        this.running = true;
        return this.browser;
    };
    wsEndpoint = () => this.browserWSEndpoint;
    publicWSEndpoint = (token) => {
        if (!this.browserWSEndpoint) {
            return null;
        }
        const wsURL = new URL(this.browserWSEndpoint);
        const serverURL = new URL(this.config.getExternalAddress());
        wsURL.hostname = serverURL.hostname;
        wsURL.port = serverURL.port;
        wsURL.protocol = serverURL.protocol === 'https' ? 'wss' : 'ws';
        if (token) {
            wsURL.searchParams.set('token', token);
        }
        return wsURL.href;
    };
    proxyPageWebSocket = async () => {
        console.warn(`Not yet implemented`);
    };
    proxyWebSocket = async (req, socket, head) => new Promise((resolve, reject) => {
        if (!this.browserWSEndpoint) {
            throw new ServerError(`No browserWSEndpoint found, did you launch first?`);
        }
        socket.once('close', resolve);
        this.debug(`Proxying ${req.parsed.href} to browser ${this.browserWSEndpoint}`);
        // Delete headers known to cause issues
        delete req.headers.origin;
        req.url = '';
        this.proxy.ws(req, socket, head, {
            changeOrigin: true,
            target: this.browserWSEndpoint,
        }, (error) => {
            this.debug(`Error proxying session: ${error}`);
            this.close();
            return reject(error);
        });
    });
}
