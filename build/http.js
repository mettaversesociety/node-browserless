export const errorCodes = {
    400: {
        code: 400,
        description: `The request contains errors or didn't properly encode content.`,
        message: 'HTTP/1.1 400 Bad Request',
    },
    401: {
        code: 401,
        description: `The request is missing, or contains bad, authorization credentials.`,
        message: 'HTTP/1.1 401 Unauthorized',
    },
    404: {
        code: 404,
        description: `Resource couldn't be found.`,
        message: 'HTTP/1.1 404 Not Found',
    },
    408: {
        code: 408,
        description: `The request took has taken too long to process.`,
        message: 'HTTP/1.1 408 Request Timeout',
    },
    429: {
        code: 429,
        description: `Too many requests are currently being processed.`,
        message: 'HTTP/1.1 429 Too Many Requests',
    },
    500: {
        code: 500,
        description: `An internal error occurred when handling the request.`,
        message: 'HTTP/1.1 500 Internal Server Error',
    },
};
export const okCodes = {
    200: {
        code: 200,
        description: `The request ran successfully and returned an OK response.`,
        message: 'HTTP/1.1 200 OK',
    },
    204: {
        code: 204,
        description: `The request ran successfully, but no response was necessary.`,
        message: 'HTTP/1.1 204 No Content',
    },
};
export const codes = {
    ...errorCodes,
    ...okCodes,
};
export var contentTypes;
(function (contentTypes) {
    contentTypes["any"] = "*/*";
    contentTypes["html"] = "text/html";
    contentTypes["javascript"] = "application/javascript";
    contentTypes["jpeg"] = "image/jpeg";
    contentTypes["json"] = "application/json";
    contentTypes["pdf"] = "application/pdf";
    contentTypes["png"] = "image/png";
    contentTypes["text"] = "text/plain";
    contentTypes["zip"] = "application/zip";
})(contentTypes || (contentTypes = {}));
export var encodings;
(function (encodings) {
    encodings["utf8"] = "UTF-8";
})(encodings || (encodings = {}));
export var Methods;
(function (Methods) {
    Methods["delete"] = "delete";
    Methods["get"] = "get";
    Methods["post"] = "post";
    Methods["put"] = "put";
})(Methods || (Methods = {}));
export var WebsocketRoutes;
(function (WebsocketRoutes) {
    WebsocketRoutes["/"] = "?(/)";
    WebsocketRoutes["browser"] = "/devtools/browser/*";
    WebsocketRoutes["page"] = "/devtools/page/*";
    WebsocketRoutes["playwrightChromium"] = "/playwright/chromium";
    WebsocketRoutes["playwrightFirefox"] = "/playwright/firefox";
    WebsocketRoutes["playwrightWebkit"] = "/playwright/webkit";
})(WebsocketRoutes || (WebsocketRoutes = {}));
export var HTTPRoutes;
(function (HTTPRoutes) {
    HTTPRoutes["content"] = "/content";
    HTTPRoutes["download"] = "/download";
    HTTPRoutes["function"] = "/function";
    HTTPRoutes["pdf"] = "/pdf";
    HTTPRoutes["performance"] = "/performance";
    HTTPRoutes["scrape"] = "/scrape";
    HTTPRoutes["screenshot"] = "/screenshot";
})(HTTPRoutes || (HTTPRoutes = {}));
export var HTTPManagementRoutes;
(function (HTTPManagementRoutes) {
    HTTPManagementRoutes["config"] = "/config";
    HTTPManagementRoutes["metrics"] = "/metrics";
    HTTPManagementRoutes["metricsTotal"] = "/metrics/total";
    HTTPManagementRoutes["sessions"] = "/sessions";
    HTTPManagementRoutes["static"] = "/";
})(HTTPManagementRoutes || (HTTPManagementRoutes = {}));
export var APITags;
(function (APITags) {
    APITags["browserAPI"] = "Browser APIs";
    APITags["browserWS"] = "Browser WebSockets";
    APITags["management"] = "Management APIs";
})(APITags || (APITags = {}));
