import { Page } from 'puppeteer-core';
type codeHandler = (params: {
    context: unknown;
    page: Page;
}) => Promise<unknown>;
export declare class FunctionRunner {
    private browser?;
    private page?;
    log: () => {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    start(data: {
        browserWSEndpoint: string;
        code: codeHandler;
        context: unknown;
        options: {
            downloadPath?: string;
        };
    }): Promise<{
        contentType: string;
        payload: {} | undefined;
    }>;
    stop(): void;
}
export {};
