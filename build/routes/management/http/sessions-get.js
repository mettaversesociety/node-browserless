import { APITags, BadRequest, HTTPManagementRoutes, Methods, contentTypes, jsonResponse, } from '@browserless.io/browserless';
const route = {
    accepts: [contentTypes.any],
    auth: true,
    browser: null,
    concurrency: false,
    contentTypes: [contentTypes.json],
    description: `Lists all currently running sessions and relevant meta-data excluding potentially open pages.`,
    handler: async (req, res) => {
        const { _browserManager: browserManager } = route;
        if (!browserManager) {
            throw new BadRequest(`Couldn't load browsers running`);
        }
        const response = await browserManager().getAllSessions(req);
        return jsonResponse(res, 200, response);
    },
    method: Methods.get,
    path: HTTPManagementRoutes.sessions,
    tags: [APITags.management],
};
export default route;
