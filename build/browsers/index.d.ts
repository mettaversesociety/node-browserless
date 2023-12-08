import { BrowserHTTPRoute, BrowserInstance, BrowserWebsocketRoute, BrowserlessSession, BrowserlessSessionJSON, Config, Request } from '@browserless.io/browserless';
export declare class BrowserManager {
    private config;
    private browsers;
    private launching;
    private timers;
    private debug;
    constructor(config: Config);
    private removeUserDataDir;
    /**
     * Generates a directory for the user-data-dir contents to be saved in. Uses
     * the provided sessionId, or creates one when omitted,
     * and appends it to the name of the directory. If the
     * directory already exists then no action is taken, verified by run `stat`
     *
     * @param sessionId The ID of the session
     * @returns Promise<string> of the fully-qualified path of the directory
     */
    private generateDataDir;
    private generateSessionJson;
    close: (browser: BrowserInstance, session: BrowserlessSession) => Promise<void>;
    getAllSessions: (req: Request) => Promise<BrowserlessSessionJSON[]>;
    complete: (browser: BrowserInstance) => Promise<void>;
    getBrowserForRequest: (req: Request, router: BrowserHTTPRoute | BrowserWebsocketRoute) => Promise<BrowserInstance>;
    stop: () => Promise<void>;
}
