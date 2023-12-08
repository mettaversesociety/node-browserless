import { APITags, BadRequest, CDPChromium, HTTPRoutes, Methods, bestAttemptCatch, contentTypes, noop, waitForEvent as waitForEvt, waitForFunction as waitForFn, writeResponse, } from '@browserless.io/browserless';
const route = {
    accepts: [contentTypes.json],
    auth: true,
    browser: CDPChromium,
    concurrency: true,
    contentTypes: [contentTypes.html],
    description: `A JSON-based API. Given a "url" or "html" field, runs and returns HTML content after the page has loaded and JavaScript has parsed.`,
    handler: async (req, res, browser) => {
        const contentType = !req.headers.accept || req.headers.accept?.includes('*')
            ? contentTypes.html
            : req.headers.accept;
        if (!req.body) {
            throw new BadRequest(`Couldn't parse JSON body`);
        }
        res.setHeader('Content-Type', contentType);
        const { bestAttempt = false, url, gotoOptions, html, authenticate, addScriptTag = [], addStyleTag = [], cookies = [], emulateMediaType, rejectRequestPattern = [], requestInterceptors = [], rejectResourceTypes = [], setExtraHTTPHeaders, setJavaScriptEnabled, userAgent, viewport, waitForTimeout, waitForFunction, waitForSelector, waitForEvent, } = req.body;
        const content = url || html;
        if (!content) {
            throw new BadRequest(`One of "url" or "html" properties are required.`);
        }
        const page = (await browser.newPage());
        const gotoCall = url ? page.goto.bind(page) : page.setContent.bind(page);
        if (emulateMediaType) {
            await page.emulateMediaType(emulateMediaType);
        }
        if (cookies.length) {
            await page.setCookie(...cookies);
        }
        if (viewport) {
            await page.setViewport(viewport);
        }
        if (userAgent) {
            await page.setUserAgent(userAgent);
        }
        if (authenticate) {
            await page.authenticate(authenticate);
        }
        if (setExtraHTTPHeaders) {
            await page.setExtraHTTPHeaders(setExtraHTTPHeaders);
        }
        if (setJavaScriptEnabled) {
            await page.setJavaScriptEnabled(setJavaScriptEnabled);
        }
        if (rejectRequestPattern.length ||
            requestInterceptors.length ||
            rejectResourceTypes.length) {
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                if (!!rejectRequestPattern.find((pattern) => req.url().match(pattern)) ||
                    rejectResourceTypes.includes(req.resourceType())) {
                    return req.abort();
                }
                const interceptor = requestInterceptors.find((r) => req.url().match(r.pattern));
                if (interceptor) {
                    return req.respond(interceptor.response);
                }
                return req.continue();
            });
        }
        if (addStyleTag.length) {
            for (const tag in addStyleTag) {
                await page.addStyleTag(addStyleTag[tag]);
            }
        }
        if (addScriptTag.length) {
            for (const tag in addScriptTag) {
                await page.addScriptTag(addScriptTag[tag]);
            }
        }
        const gotoResponse = await gotoCall(content, gotoOptions).catch(bestAttemptCatch(bestAttempt));
        if (waitForTimeout) {
            await page
                .waitForTimeout(waitForTimeout)
                .catch(bestAttemptCatch(bestAttempt));
        }
        if (waitForFunction) {
            await waitForFn(page, waitForFunction).catch(bestAttemptCatch(bestAttempt));
        }
        if (waitForSelector) {
            const { selector, hidden, timeout, visible } = waitForSelector;
            await page
                .waitForSelector(selector, { hidden, timeout, visible })
                .catch(bestAttemptCatch(bestAttempt));
        }
        if (waitForEvent) {
            await waitForEvt(page, waitForEvent).catch(bestAttemptCatch(bestAttempt));
        }
        const headers = {
            'X-Response-Code': gotoResponse?.status(),
            'X-Response-IP': gotoResponse?.remoteAddress().ip,
            'X-Response-Port': gotoResponse?.remoteAddress().port,
            'X-Response-Status': gotoResponse?.statusText(),
            'X-Response-URL': gotoResponse?.url().substring(0, 1000),
        };
        for (const [key, value] of Object.entries(headers)) {
            if (value !== undefined) {
                res.setHeader(key, value);
            }
        }
        const markup = await page.content();
        page.close().catch(noop);
        return writeResponse(res, 200, markup, contentTypes.html);
    },
    method: Methods.post,
    path: HTTPRoutes.content,
    tags: [APITags.browserAPI],
};
export default route;
