import { BadRequest, CDPChromium, HTTPManagementRoutes, NotFound, ServerError, browserHook, convertIfBase64, createLogger, exists, getTokenFromRequest, id, makeExternalURL, noop, pageHook, parseBooleanParam, } from '@browserless.io/browserless';
import path, { join } from 'path';
import { deleteAsync } from 'del';
import { mkdir } from 'fs/promises';
export class BrowserManager {
    config;
    browsers = new Map();
    launching = new Map();
    timers = new Map();
    debug = createLogger('browser-manager');
    constructor(config) {
        this.config = config;
    }
    removeUserDataDir = async (userDataDir) => {
        if (userDataDir && (await exists(userDataDir))) {
            this.debug(`Deleting data directory "${userDataDir}"`);
            await deleteAsync(userDataDir, { force: true }).catch((err) => {
                this.debug(`Error cleaning up user-data-dir "${err}" at ${userDataDir}`);
            });
        }
    };
    /**
     * Generates a directory for the user-data-dir contents to be saved in. Uses
     * the provided sessionId, or creates one when omitted,
     * and appends it to the name of the directory. If the
     * directory already exists then no action is taken, verified by run `stat`
     *
     * @param sessionId The ID of the session
     * @returns Promise<string> of the fully-qualified path of the directory
     */
    generateDataDir = async (sessionId = id()) => {
        const baseDirectory = await this.config.getDataDir();
        const dataDirPath = join(baseDirectory, `browserless-data-dir-${sessionId}`);
        if (await exists(dataDirPath)) {
            this.debug(`Data directory already exists, not creating "${dataDirPath}"`);
            return dataDirPath;
        }
        this.debug(`Generating user-data-dir at ${dataDirPath}`);
        await mkdir(dataDirPath, { recursive: true }).catch((err) => {
            throw new ServerError(`Error creating data-directory "${dataDirPath}": ${err}`);
        });
        return dataDirPath;
    };
    generateSessionJson = (browser, session) => {
        const serverAddress = this.config.getExternalAddress();
        return {
            ...session,
            browser: browser.constructor.name,
            browserId: browser.wsEndpoint()?.split('/').pop(),
            initialConnectURL: new URL(session.initialConnectURL, serverAddress).href,
            killURL: session.id
                ? makeExternalURL(serverAddress, HTTPManagementRoutes.sessions, session.id)
                : null,
            running: browser.isRunning(),
            timeAliveMs: Date.now() - session.startedOn,
        };
    };
    close = async (browser, session) => {
        const cleanupACtions = [];
        this.debug(`${session.numbConnected} Client(s) are currently connected`);
        this.debug(`Closing browser session`);
        cleanupACtions.push(() => browser.close());
        if (session.isTempDataDir) {
            this.debug(`Deleting "${session.userDataDir}" user-data-dir and session from memory`);
            this.browsers.delete(browser);
            cleanupACtions.push(() => this.removeUserDataDir(session.userDataDir));
        }
        await Promise.all(cleanupACtions.map((a) => a()));
    };
    getAllSessions = async (req) => {
        const sessions = Array.from(this.browsers);
        const requestToken = getTokenFromRequest(req);
        const token = this.config.getToken();
        if (token && !requestToken) {
            throw new BadRequest(`Couldn't locate your API token`);
        }
        return sessions.map(([browser, session]) => this.generateSessionJson(browser, session));
    };
    complete = async (browser) => {
        const session = this.browsers.get(browser);
        if (!session) {
            this.debug(`Couldn't locate session for browser, proceeding with close`);
            return browser.close();
        }
        const { id, resolver } = session;
        if (id && resolver) {
            resolver(null);
            this.launching.delete(id);
        }
        --session.numbConnected;
        this.close(browser, session);
    };
    getBrowserForRequest = async (req, router) => {
        const { browser: Browser } = router;
        const record = parseBooleanParam(req.parsed.searchParams, 'record', false);
        const blockAds = parseBooleanParam(req.parsed.searchParams, 'blockAds', false);
        const decodedLaunchOptions = convertIfBase64(req.parsed.searchParams.get('launch') || '{}');
        let parsedLaunchOptions;
        // Handle re-connects here:
        if (req.parsed.pathname.includes('/devtools/browser')) {
            const sessions = Array.from(this.browsers);
            const id = req.parsed.pathname.split('/').pop();
            const browser = sessions.find(([b]) => b.wsEndpoint()?.includes(req.parsed.pathname));
            if (browser) {
                this.debug(`Located browser with ID ${id}`);
                return browser[0];
            }
            throw new NotFound(`Couldn't locate browser "${id}" for request "${req.parsed.pathname}"`);
        }
        try {
            parsedLaunchOptions = JSON.parse(decodedLaunchOptions);
        }
        catch (err) {
            throw new BadRequest(`Error parsing launch-options: ${err}. Launch options must be a JSON or base64-encoded JSON object`);
        }
        const requestToken = getTokenFromRequest(req);
        const token = this.config.getToken();
        if (token && !requestToken) {
            throw new ServerError(`Error locating authorization token`);
        }
        const routerOptions = typeof router.defaultLaunchOptions === 'function'
            ? router.defaultLaunchOptions(req)
            : router.defaultLaunchOptions;
        const launchOptions = {
            ...routerOptions,
            ...parsedLaunchOptions,
        };
        const manualUserDataDir = launchOptions.args
            ?.find((arg) => arg.includes('--user-data-dir='))
            ?.split('=')[2] || launchOptions.userDataDir;
        // Always specify a user-data-dir since plugins can "inject" their own
        // unless it's playwright which takes care of its own data-dirs
        const userDataDir = manualUserDataDir ||
            (Browser.name === CDPChromium.name ? await this.generateDataDir() : null);
        const browser = new Browser({
            blockAds,
            config: this.config,
            record,
            userDataDir,
        });
        const connectionMeta = {
            id: null,
            initialConnectURL: path.join(req.parsed.pathname, req.parsed.search) || '',
            isTempDataDir: !manualUserDataDir,
            launchOptions,
            numbConnected: 1,
            resolver: noop,
            routePath: router.path,
            startedOn: Date.now(),
            ttl: 0,
            userDataDir,
        };
        this.browsers.set(browser, connectionMeta);
        await browser.launch(launchOptions);
        await browserHook({ browser, meta: req.parsed });
        browser.on('newPage', async (page) => {
            await pageHook({ meta: req.parsed, page });
            (router.onNewPage || noop)(req.parsed || '', page);
        });
        return browser;
    };
    stop = async () => {
        this.debug(`Closing down browser instances`);
        const sessions = Array.from(this.browsers);
        await Promise.all(sessions.map(([b]) => b.close()));
        const timers = Array.from(this.timers);
        await Promise.all(timers.map(([, timer]) => clearInterval(timer)));
        this.timers.forEach((t) => clearTimeout(t));
        this.browsers = new Map();
        this.timers = new Map();
        this.debug(`Shutdown complete`);
    };
}
